import { noResultsText } from "@/components/no-results";
import {
  generateDefaultGetAccountDataDTO,
  generateDefaultGetStatisticsDTO,
} from "@/test/mocks/account-api";
import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import Home from "./home";

const initialAccountDataQueryMock = () => ({
  data: generateDefaultGetAccountDataDTO(),
  error: null,
  isSuccess: false,
  isFetching: true,
});

const initialStatisticsQueryMock = () => ({
  data: generateDefaultGetStatisticsDTO(),
  error: null,
  isSuccess: false,
  isFetching: true,
});

const mocks = {
  accountData: initialAccountDataQueryMock(),
  statistics: initialStatisticsQueryMock(),
};

jest.mock("../../../redux/services/account-api", () => {
  const actual = jest.requireActual("../../../redux/services/account-api");
  return {
    ...actual,

    useAccountDataQuery: () => mocks.accountData,
    useStatisticsQuery: () => mocks.statistics,
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
    mocks.accountData = initialAccountDataQueryMock();
    mocks.statistics = initialStatisticsQueryMock();

    dispatch.mockClear();
  });

  test("renders skeletons while fetching", () => {
    renderWithProviders(<Home />);

    expect(screen.getByTestId("expenses-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("balance-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("main-skeleton")).toBeInTheDocument();
  });

  test("renders statistics skeletons after request error", () => {
    mocks.statistics.isFetching = false;
    mocks.statistics.isSuccess = false;
    mocks.accountData.error = true;

    renderWithProviders(<Home />);

    expect(screen.getByTestId("expenses-skeleton")).toBeInTheDocument();
  });

  test("renders no results after null data fetched", () => {
    mocks.statistics.data.currentMonth = {
      expenseCategories: [],
      weeklyExpenses: [],
      total: 0,
    };
    mocks.statistics.isSuccess = true;

    renderWithProviders(<Home />);
  });

  test("renders total expenses for current month", () => {
    mocks.statistics.isFetching = false;
    mocks.statistics.isSuccess = true;

    renderWithProviders(<Home />);

    expect(
      screen.getByText("(Current month)").parentNode.parentNode.textContent
    ).toContain("$666.00");
  });

  test("renders balance", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<Home />);

    expect(screen.getByText("Balance").parentNode.textContent).toContain(
      "$60.00"
    );
  });

  test("renders weekly expenses", () => {
    mocks.statistics.isFetching = false;
    mocks.statistics.isSuccess = true;

    renderWithProviders(<Home />);

    expect(
      screen.getByText("Weekly Expenses").parentNode.textContent
    ).toContain("mocked$666.00");
  });

  test("renders a table after data loaded", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = true;

    renderWithProviders(<Home />);

    expect(screen.getByText("$66.00")).toBeInTheDocument();
  });

  test("not renders a table after request error", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = false;

    renderWithProviders(<Home />);

    expect(screen.queryAllByText("$66.00")).toHaveLength(0);
  });

  test("renders no results after request error", () => {
    mocks.accountData.isFetching = false;
    mocks.accountData.isSuccess = false;
    mocks.accountData.error = true;

    renderWithProviders(<Home />);

    expect(screen.getByText(noResultsText)).toBeInTheDocument();
  });
});
