import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";

import { close } from "@/redux/features/modal.slice";
import { AddTransactionModal } from "./add-transaction-modal";

const handleSubmit = jest.fn();
const reset = jest.fn();

jest.mock("../transaction/transaction-form", () => {
  const form = jest.requireActual("../transaction/transaction-form");
  return {
    ...form,
    useTransactionForm: () => ({
      form: {
        ...form.useTransactionForm().form,
        handleSubmit,
        reset,
      },
    }),
  };
});

const requestReset = jest.fn();
const initalUpdateRequest = () => ({ status: "", reset: requestReset });
const addTransaction = jest.fn();
let updateRequest = initalUpdateRequest();

jest.mock("../../redux/services/transactions-api", () => ({
  ...jest.requireActual("../../redux/services/transactions-api"),
  useAddTransactionMutation: () => [addTransaction, updateRequest],
}));

const dispatch = jest.fn();

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatch,
  };
});

describe("Add Transaction Modal", () => {
  const state = {
    preloadedState: {
      modalReducer: {
        type: "addTransaction",
        isOpen: true,
      },
    },
  };

  beforeEach(() => {
    handleSubmit.mockClear();
    reset.mockClear();
    requestReset.mockClear();
    addTransaction.mockClear();
  });

  test("renders heading", () => {
    renderWithProviders(<AddTransactionModal />, state);

    const heading = screen.getByText("Add transaction");

    expect(heading).toBeInTheDocument();
  });

  test("renders save button", () => {
    renderWithProviders(<AddTransactionModal />, state);

    const button = screen.getByText("Save");

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test("submits form on save button click", () => {
    renderWithProviders(<AddTransactionModal />, state);

    const button = screen.getByText("Save");
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalled();
  });

  test("resets form and closes modal on save", () => {
    handleSubmit.mockImplementation((cb) => () => cb());

    renderWithProviders(<AddTransactionModal />, state);
    const button = screen.getByText("Save");
    fireEvent.click(button);
    updateRequest.status = "fulfilled";
    renderWithProviders(<AddTransactionModal />, state);

    expect(addTransaction).toHaveBeenCalled();
    expect(requestReset).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(close());
  });
});
