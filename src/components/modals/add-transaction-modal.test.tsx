import { cleanup, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils"; 

import { AddTransactionModal } from "./add-transaction-modal"; 
import { close } from "@/redux/features/modal.slice";

const dispatch = jest.fn();
const reset = jest.fn();
const requestReset = jest.fn();
const addTransaction = jest.fn();
const initalUpdateRequest = () => ({ status: "", reset: requestReset });

let isFormChanged = false;
let isDispatchMocked = true;
let updateRequest = initalUpdateRequest();

jest.mock("../transaction/transaction-form", () => {
  const form = jest.requireActual("../transaction/transaction-form");
  return {
    ...form,
    TransactionForm: () => null,
    useTransactionForm: () => {
      const originalForm = form.useTransactionForm().form;
      return {
        form: {
          ...originalForm,
          handleSubmit: (fn) => fn("mocked"),
          reset,
          getValues: jest.fn(() => {
              if (isFormChanged) {
                return {
                  ...originalForm.getValues(),
                  [Object.keys(originalForm.getValues())?.[0]]: "mock changed"
                };
              }
              return originalForm.getValues();
            }),
        },
      }
    },
  };
});

jest.mock("../../redux/services/account-api", () => ({
  ...jest.requireActual("../../redux/services/account-api"),
  useAddTransactionMutation: () => [addTransaction, updateRequest],
}));

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => isDispatchMocked ? dispatch : actual.useDispatch(),
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

  function saveButton() {
    return screen.getByText("Save");
  }

  beforeEach(() => {
    jest.clearAllMocks(); 
    isFormChanged = false;
    isDispatchMocked = true;
    updateRequest = initalUpdateRequest();
  });

  test("renders heading", () => {
    renderWithProviders(<AddTransactionModal />, state);

    expect(screen.getByText("Add transaction")).toBeInTheDocument();
  });

  test("renders save button", () => {
    renderWithProviders(<AddTransactionModal />, state);

    expect(saveButton()).toBeInTheDocument();
  });

  test("disables save button when form is not changed", () => {
    updateRequest.status = "mocked";

    renderWithProviders(<AddTransactionModal />, state);

    expect(saveButton()).toBeDisabled();
  });

  test("submits form on save button click", () => {
    isFormChanged = true;
    renderWithProviders(<AddTransactionModal />, state);

    fireEvent.click(saveButton());

    expect(saveButton()).not.toBeDisabled();
    expect(addTransaction).toHaveBeenCalledWith('mocked');
  });

  test("disables save button when mutation is pending", () => {
    isFormChanged = true;
    renderWithProviders(<AddTransactionModal />, state);
    expect(saveButton()).not.toBeDisabled();
    
    updateRequest.status = "pending";
    cleanup();
    renderWithProviders(<AddTransactionModal />, state);

    expect(saveButton()).toBeDisabled();
  });

  test("dispatches close action when close button is clicked", () => {
    renderWithProviders(<AddTransactionModal />, state);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(dispatch).toHaveBeenCalledWith(close());
  });

  test("resets the modal on close", () => {
    isDispatchMocked = false;
    renderWithProviders(<AddTransactionModal />, state);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(reset).toHaveBeenCalled();
    expect(requestReset).toHaveBeenCalled();
  });

});
