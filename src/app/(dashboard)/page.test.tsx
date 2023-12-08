import { open } from "@/redux/features/modal.slice";
import { generateTransaction } from "@/test/mocks/account-api";
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
  function loadMoreButton() {
    return screen.queryByText(/Load more/i);
  }

  beforeEach(() => {
    queryMock = initialQueryMock();

    dispatch.mockClear();
  });

  test("renders a heading", () => {
    renderWithProviders(<Home />);

    expect(screen.getByText("Recent transactions")).toBeInTheDocument();
  });

  test("renders skeletons while fetching", () => {
    queryMock.isFetching = true;
    queryMock.isSuccess = false;

    renderWithProviders(<Home />);

    expect(screen.getByTestId("main-skeleton-container")).toBeInTheDocument();
    expect(
      screen.getByTestId("balance-skeleton-container")
    ).toBeInTheDocument();
  });

  test("not renders skeletons after data loaded", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);

    expect(screen.queryAllByTestId("main-skeleton-container")).toHaveLength(0);
    expect(screen.queryAllByTestId("balance-skeleton-container")).toHaveLength(
      0
    );
  });

  test("renders a table after data loaded", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);

    expect(screen.getByText("$66.00")).toBeInTheDocument();
  });

  test("not renders a table after request error", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = false;

    renderWithProviders(<Home />);

    expect(screen.queryAllByText("$66.00")).toHaveLength(0);
  });

  test("renders no results after request error", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = false;
    queryMock.error = true;

    renderWithProviders(<Home />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  test("renders load more button if there is more data", () => {
    queryMock.data.recentTransactions.totalPages = 2;
    queryMock.isFetching = true;
    queryMock.isSuccess = false;

    renderWithProviders(<Home />);

    expect(loadMoreButton().closest("button")).toBeDisabled();
  });

  test("not renders button if there is no more data", () => {
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);

    expect(loadMoreButton()).toBeNull();
  });

  test("renders add transaction button disabled while fetching", () => {
    queryMock.isFetching = true;

    renderWithProviders(<Home />);

    expect(
      screen.getByRole("button", {
        name: "add-transaction-button",
      })
    ).toBeDisabled();
  });

  test("renders add transaction button not disabled after data is loaded", () => {
    queryMock.isFetching = false;

    renderWithProviders(<Home />);

    expect(
      screen.getByRole("button", {
        name: "add-transaction-button",
      })
    ).not.toBeDisabled();
  });

  test("opens add transaction modal on button click", () => {
    queryMock.isFetching = false;

    renderWithProviders(<Home />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "add-transaction-button",
      })
    );

    expect(dispatch).toHaveBeenCalledWith(open({ type: "addTransaction" }));
  });

  test("loads more data on click", () => {
    queryMock.data.recentTransactions.totalPages = 2;
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);
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
    fireEvent.click(loadMoreButton());

    expect(screen.getByText(/66/i)).toBeInTheDocument();
    expect(screen.getByText(/77/i)).toBeInTheDocument();
  });

  test("displays load more button after click if there is more data", () => {
    queryMock.data.recentTransactions.totalPages = 3;
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);
    queryMock.data.recentTransactions.currentPage = 2;
    fireEvent.click(loadMoreButton());

    expect(loadMoreButton()).toBeInTheDocument();
  });

  test("not displays load more button after click if there is no more data", () => {
    queryMock.data.recentTransactions.totalPages = 2;
    queryMock.isFetching = false;
    queryMock.isSuccess = true;

    renderWithProviders(<Home />);
    queryMock.data.recentTransactions.currentPage = 2;
    fireEvent.click(loadMoreButton());

    expect(loadMoreButton()).toBeNull();
  });
});
