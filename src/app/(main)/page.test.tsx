import { generateTransaction } from "@/lib/transaction/transaction";
import { open } from "@/redux/features/modal.slice";
import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import moment from "moment";
import Home from "./page";

let queryMock;

const initialQueryMock = () => ({
  data: {
    recentTransactions: {
      data: [
        {
          date: new Date().toISOString(),
          transactions: [{ ...generateTransaction(), amount: "66" }],
        },
      ],
      currentPage: 1,
      totalPages: 1,
    },
  },
  error: null,
  isSuccess: false,
  isFetching: true,
});

jest.mock("../../redux/services/account-api", () => {
  const actual = jest.requireActual("../../redux/services/account-api");
  return {
    ...actual,

    useAccountDataQuery: () => {
      return queryMock;
    },
  };
});

const dispatch = jest.fn();

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatch,
  };
});

describe("Home", () => {
  beforeEach(() => {
    queryMock = initialQueryMock();

    dispatch.mockClear();
  });

  test("renders a heading", () => {
    renderWithProviders(<Home />);

    const heading = screen.getByText("Recent transactions");

    expect(heading).toBeInTheDocument();
  });

  test("renders skeletons while fetching", () => {
    queryMock.isFetching = true;
    queryMock.isSuccess = false;

    renderWithProviders(<Home />);

    const balanceSkeleton = screen.getByTestId("balance-skeleton-container");
    const mainSkeleton = screen.getByTestId("main-skeleton-container");
    expect(mainSkeleton).toBeInTheDocument();
    expect(balanceSkeleton).toBeInTheDocument();
  });

  test("not renders skeletons after data loaded", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);

    const balanceSkeleton = screen.queryAllByTestId(
      "balance-skeleton-container"
    );
    const mainSkeleton = screen.queryAllByTestId("main-skeleton-container");
    expect(mainSkeleton).toHaveLength(0);
    expect(balanceSkeleton).toHaveLength(0);
  });

  test("renders a table after data loaded", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);

    const dataTable = screen.getByText("$66.00");
    expect(dataTable).toBeInTheDocument();
  });

  test("not renders a table after request error", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = false;

    renderWithProviders(<Home />);

    const dataTable = screen.queryAllByText("$66.00");
    expect(dataTable).toHaveLength(0);
  });

  test("renders no results after request error", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = false;
    queryMock.error = true;

    renderWithProviders(<Home />);

    const dataTable = screen.getByText("No results.");
    expect(dataTable).toBeInTheDocument();
  });

  test("renders load more button if there is more data", () => {
    queryMock.data.recentTransactions.totalPages = 2;
    queryMock.isFetching = true;
    queryMock.isSuccess = false;

    renderWithProviders(<Home />);

    const button = screen.getByText(/Load more/i).closest("button");
    expect(button).toBeDisabled();
  });

  test("not renders button if there is no more data", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);

    let button = screen.queryByText(/Load more/i);
    expect(button).toBeNull();
  });

  test("renders add transaction button disabled while fetching", () => {
    queryMock.isFetching = true;

    renderWithProviders(<Home />);

    const button = screen.getByRole("button", {
      name: "add-transaction-button",
    });
    expect(button).toBeDisabled();
  });

  test("renders add transaction button not disabled after data is loaded", () => {
    queryMock.isFetching = false;

    renderWithProviders(<Home />);

    const button = screen.getByRole("button", {
      name: "add-transaction-button",
    });
    expect(button).not.toBeDisabled();
  });

  test("opens add transaction modal on button click", () => {
    queryMock.isFetching = false;

    renderWithProviders(<Home />);
    const button = screen.getByRole("button", {
      name: "add-transaction-button",
    });
    fireEvent.click(button);

    expect(dispatch).toHaveBeenCalledWith(open({ type: "addTransaction" }));
  });

  test("loads more data on click", () => {
    queryMock.data.recentTransactions.totalPages = 2;
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);
    const button = screen.getByText(/Load more/i);
    queryMock.data.recentTransactions = {
      ...queryMock.data.recentTransactions,
      currentPage: 2,
      data: [
        ...queryMock.data.recentTransactions.data,
        {
          date: moment().subtract(1, "days").toISOString(),
          transactions: [{ ...generateTransaction(), amount: "77" }],
        },
      ],
    };
    fireEvent.click(button);

    const todayData = screen.getByText(/66/i);
    const yesterdayData = screen.getByText(/77/i);
    expect(todayData).toBeInTheDocument();
    expect(yesterdayData).toBeInTheDocument();
  });

  test("displays load more button after click if there is more data", () => {
    queryMock.data.recentTransactions.totalPages = 3;
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);
    const button = screen.getByText(/Load more/i);
    queryMock.data.recentTransactions.currentPage = 2;
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  test("not displays load more button after click if there is no more data", () => {
    queryMock.data.recentTransactions.totalPages = 2;
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);
    const button = screen.queryByText(/Load more/i);
    queryMock.data.recentTransactions.currentPage = 2;
    fireEvent.click(button);

    expect(screen.queryByText(/Load more/i)).toBeNull();
  });
});
