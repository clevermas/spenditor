import { renderWithProviders } from "@/test/test-utils"; 
import { fireEvent, screen, cleanup } from "@testing-library/react";
import { generateTransaction } from "@/test/mocks/account-api";
import { EditTransactionModal } from "./edit-transaction-modal"; 
import { close } from "@/redux/features/modal.slice";

const reset = jest.fn();
const requestReset = jest.fn();
const initalUpdateRequest = () => ({ status: "", reset: requestReset });
const dispatch = jest.fn();

let editTransaction = jest.fn();
let isFormChanged = false;
let isDispatchMocked = true;
let updateRequest = initalUpdateRequest();

jest.mock("../transaction/transaction-form", () => {
  const form = jest.requireActual("../transaction/transaction-form");
  return {
    ...form,
    TransactionForm: () => {},
    useTransactionForm: () => {
      const originalForm = form.useTransactionForm().form;
      return {
        TransactionForm: () => null,
        form: {
          ...originalForm,
          handleSubmit: (fn) => fn({ comment: 'mock updated' }),
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
        }
      }
    }
  };
});

jest.mock("../../redux/services/account-api", () => ({
  ...jest.requireActual("../../redux/services/account-api"),
  useUpdateTransactionMutation: () => [editTransaction, updateRequest],
}));

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => isDispatchMocked ? dispatch : actual.useDispatch(),
  };
});

describe("Edit Transaction Modal", () => {
  const state = {
    preloadedState: {
      modalReducer: {
        type: "editTransaction",
        isOpen: true,
        data: {
          ...generateTransaction(),
          date: 'mocked'
        }
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
    renderWithProviders(<EditTransactionModal />, state);

    expect(screen.getByText("Edit transaction")).toBeInTheDocument();
  });

  test("renders save button", () => {
    renderWithProviders(<EditTransactionModal />, state);

    expect(saveButton()).toBeInTheDocument();
  });

  test("disables save button when form is not changed", () => {
    updateRequest.status = "mocked";

    renderWithProviders(<EditTransactionModal />, state);

    expect(saveButton()).toBeDisabled();
  });

  test("submits form on save button click", () => {
    isFormChanged = true;
    renderWithProviders(<EditTransactionModal />, state);

    fireEvent.click(saveButton());

    expect(saveButton()).not.toBeDisabled();
    expect(editTransaction).toHaveBeenCalledWith({
      ...state.preloadedState.modalReducer.data,
      comment: 'mock updated'
    });
  });

  test("disables save button when mutation is pending", () => {
    isFormChanged = true;
    renderWithProviders(<EditTransactionModal />, state);
    expect(saveButton()).not.toBeDisabled();
    
    updateRequest.status = "pending";
    cleanup();
    renderWithProviders(<EditTransactionModal />, state);

    expect(saveButton()).toBeDisabled();
  });

  test("dispatches close action when close button is clicked", () => {
    renderWithProviders(<EditTransactionModal />, state);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(dispatch).toHaveBeenCalledWith(close());
  });

  test("resets the modal on close", () => {
    isDispatchMocked = false;
    renderWithProviders(<EditTransactionModal />, state);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(reset).toHaveBeenCalled();
    expect(requestReset).toHaveBeenCalled();
  });
});
