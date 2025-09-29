import { renderWithProviders } from "@/test/test-utils"; 
import { RemoveTransactionModal } from "./remove-transaction-modal"; 
import { fireEvent, screen } from "@testing-library/react";
import { generateTransaction } from "@/test/mocks/account-api";
import { close } from "@/redux/features/modal.slice";

const requestReset = jest.fn();
const initalUpdateRequest = () => ({ status: "", reset: requestReset });
const dispatch = jest.fn();

let removeTransaction = jest.fn();
let removeRequest = initalUpdateRequest();
let isDispatchMocked = true;

jest.mock("../../redux/services/account-api", () => ({
  ...jest.requireActual("../../redux/services/account-api"),
  useRemoveTransactionMutation: () => [removeTransaction, removeRequest],
}));

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => isDispatchMocked ? dispatch : actual.useDispatch(),
  };
});

describe("Remove Transaction Modal", () => {
  const state = {
    preloadedState: {
      modalReducer: {
        type: "removeTransaction",
        isOpen: true,
        data: {
          transactionId: 'mocked'
        }
      },
    },
  };

  function cancelButton() {
    return screen.getByText("Cancel");
  }

  function removeButton() {
    return screen.getByText("Remove");
  }

  function closeButton() {
    return screen.getByRole('button', { name: /close/i });
  }

  beforeEach(() => {
    requestReset.mockClear();
    removeTransaction.mockClear();
  });

  test("renders heading", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(screen.getByText("Remove transaction")).toBeInTheDocument();
  });

  test("renders warning text", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    const text = screen.getByText(
      "This action cannot be undone. This will permanently delete the transaction."
    );
    expect(text).toBeInTheDocument();
  });

  test("renders cancel button", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(cancelButton()).toBeInTheDocument();
    expect(cancelButton()).not.toBeDisabled();
  });

  test("renders remove button", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(removeButton()).toBeInTheDocument();
    expect(removeButton()).not.toBeDisabled();
  });

  test("removes transaction on remove button click", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    fireEvent.click(removeButton());

    expect(removeTransaction).toHaveBeenCalledWith('mocked');
  });

  test("disables remove button when mutation is pending", () => {
    removeRequest.status = "pending";
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(removeButton()).toBeDisabled();
  });

  test("dispatches close action when cancel button is clicked", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    fireEvent.click(cancelButton());
    
    expect(dispatch).toHaveBeenCalledWith(close());
  });

  test("dispatches close action when close button is clicked", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    
    fireEvent.click(closeButton());
    
    expect(dispatch).toHaveBeenCalledWith(close());
  });

  test("resets the modal on close", () => {
    isDispatchMocked = false;
    renderWithProviders(<RemoveTransactionModal />, state);

    fireEvent.click(closeButton());

    expect(requestReset).toHaveBeenCalled();
  });
});
