import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";

import { close } from "@/redux/features/modal.slice";
import { generateTransaction } from "@/test/mocks/account-api";
import { EditTransactionModal } from "./edit-transaction-modal";

const handleSubmit = jest.fn();
const reset = jest.fn();

jest.mock("../transaction/transaction-form", () => {
  const form = jest.requireActual("../transaction/transaction-form");
  return {
    ...form,
    TransactionForm: () => {},
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
let editTransaction = jest.fn();
let updateRequest = initalUpdateRequest();

jest.mock("../../redux/services/account-api", () => ({
  ...jest.requireActual("../../redux/services/account-api"),
  useUpdateTransactionMutation: () => [editTransaction, updateRequest],
}));

const dispatch = jest.fn();

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatch,
  };
});

describe("Edit Transaction Modal", () => {
  const state = {
    preloadedState: {
      modalReducer: {
        type: "editTransaction",
        isOpen: true,
        data: generateTransaction(),
      },
    },
  };

  function saveButton() {
    return screen.getByText("Save");
  }

  beforeEach(() => {
    handleSubmit.mockClear();
    reset.mockClear();
    requestReset.mockClear();
    editTransaction.mockClear();
  });

  test("renders heading", () => {
    renderWithProviders(<EditTransactionModal />, state);

    expect(screen.getByText("Edit transaction")).toBeInTheDocument();
  });

  test("renders save button", () => {
    renderWithProviders(<EditTransactionModal />, state);

    expect(saveButton()).toBeInTheDocument();
    expect(saveButton()).not.toBeDisabled();
  });

  test("submits form on save button click", () => {
    renderWithProviders(<EditTransactionModal />, state);

    fireEvent.click(saveButton());

    expect(handleSubmit).toHaveBeenCalled();
  });

  test("resets form and closes modal on save", () => {
    handleSubmit.mockImplementation((cb) => () => cb());

    renderWithProviders(<EditTransactionModal />, state);
    const button = screen.getByText("Save");
    fireEvent.click(saveButton());
    updateRequest.status = "fulfilled";
    renderWithProviders(<EditTransactionModal />, state);

    expect(editTransaction).toHaveBeenCalled();
    expect(requestReset).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(close());
  });
});
