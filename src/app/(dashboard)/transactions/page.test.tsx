import { noResultsText } from "@/components/no-results";
import { open } from "@/redux/features/modal.slice";
import {
  generateDefaultGetAccountDataDTO,
  generateTransaction,
} from "@/test/mocks/account-api";
import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import moment from "moment";
import TransactionsPage from "./page";

const initialAccountDataQueryMock = () => ({
  data: generateDefaultGetAccountDataDTO(),
  error: null,
  isSuccess: false,
  isFetching: true,
});

const mocks = {
  accountData: initialAccountDataQueryMock(),
};

jest.mock("../../../redux/services/account-api", () => {
  const actual = jest.requireActual("../../../redux/services/account-api");
  return {
    ...actual,

    useAccountDataQuery: () => mocks.accountData,
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

describe("Transactions", () => {
  function loadMoreButton() {
    return screen.queryByText(/Load more/i);
  }

  beforeEach(() => {
    mocks.accountData = initialAccountDataQueryMock();

    dispatch.mockClear();
  });

  test("renders a heading", () => {
    renderWithProviders(<TransactionsPage />);

    expect(screen.getByText("Recent transactions")).toBeInTheDocument();
  });

  test("renders skeletons while fetching", () => {
    mocks.accountData.isFetching = true;
    mocks.accountData.isSuccess = false;

    renderWithProviders(<TransactionsPage />);

    expect(screen.getByTestId("main-skeleton")).toBeInTheDocument();
  });

  test("not renders skeletons after data loaded", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<TransactionsPage />);

    expect(screen.queryAllByTestId("main-skeleton")).toHaveLength(0);
  });

  test("renders a table after data loaded", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<TransactionsPage />);

    expect(screen.getByText("$66.00")).toBeInTheDocument();
  });

  test("not renders a table after request error", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = false;

    renderWithProviders(<TransactionsPage />);

    expect(screen.queryAllByText("$66.00")).toHaveLength(0);
  });

  test("renders no results after request error", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = false;
    mocks.accountData.error = true;

    renderWithProviders(<TransactionsPage />);

    expect(screen.getByText(noResultsText)).toBeInTheDocument();
  });

  test("renders load more button if there is more data", () => {
    mocks.accountData.data.recentTransactions.totalPages = 2;
    mocks.accountData.isFetching = true;
    mocks.accountData.isSuccess = false;

    renderWithProviders(<TransactionsPage />);

    expect(loadMoreButton().closest("button")).toBeDisabled();
  });

  test("not renders button if there is no more data", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<TransactionsPage />);

    expect(loadMoreButton()).toBeNull();
  });

  test("renders add transaction button disabled while fetching", () => {
    mocks.accountData.isFetching = true;

    renderWithProviders(<TransactionsPage />);

    expect(
      screen.getByRole("button", {
        name: "add-transaction-button",
      })
    ).toBeDisabled();
  });

  test("renders add transaction button not disabled after data is loaded", () => {
    mocks.accountData.isFetching = false;

    renderWithProviders(<TransactionsPage />);

    expect(
      screen.getByRole("button", {
        name: "add-transaction-button",
      })
    ).not.toBeDisabled();
  });

  test("opens add transaction modal on button click", () => {
    mocks.accountData.isFetching = false;

    renderWithProviders(<TransactionsPage />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "add-transaction-button",
      })
    );

    expect(dispatch).toHaveBeenCalledWith(open({ type: "addTransaction" }));
  });

  test("loads more data on click", () => {
    mocks.accountData.data.recentTransactions.totalPages = 2;
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<TransactionsPage />);
    mocks.accountData.data.recentTransactions = {
      ...mocks.accountData.data.recentTransactions,
      currentPage: 2,
      data: [
        ...mocks.accountData.data.recentTransactions.data,
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
    mocks.accountData.data.recentTransactions.totalPages = 3;
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<TransactionsPage />);
    mocks.accountData.data.recentTransactions.currentPage = 2;
    fireEvent.click(loadMoreButton());

    expect(loadMoreButton()).toBeInTheDocument();
  });

  test("not displays load more button after click if there is no more data", () => {
    mocks.accountData.data.recentTransactions.totalPages = 2;
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<TransactionsPage />);
    mocks.accountData.data.recentTransactions.currentPage = 2;
    fireEvent.click(loadMoreButton());

    expect(loadMoreButton()).toBeNull();
  });
});
