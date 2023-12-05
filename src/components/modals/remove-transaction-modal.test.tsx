import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";

import { close } from "@/redux/features/modal.slice";
import { generateTransaction } from "@/test/mocks/account-api";
import { RemoveTransactionModal } from "./remove-transaction-modal";

const requestReset = jest.fn();
const initalUpdateRequest = () => ({ status: "", reset: requestReset });
let removeTransaction = jest.fn();
let removeRequest = initalUpdateRequest();

jest.mock("../../redux/services/account-api", () => ({
  ...jest.requireActual("../../redux/services/account-api"),
  useRemoveTransactionMutation: () => [removeTransaction, removeRequest],
}));

const dispatch = jest.fn();

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatch,
  };
});

describe("Remove Transaction Modal", () => {
  const state = {
    preloadedState: {
      modalReducer: {
        type: "removeTransaction",
        isOpen: true,
        data: generateTransaction(),
      },
    },
  };

  function removeButton() {
    return screen.getByText("Remove");
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

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).not.toBeDisabled();
  });

  test("renders remove button", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(removeButton()).toBeInTheDocument();
    expect(removeButton()).not.toBeDisabled();
  });

  test("closes modal on removal", () => {
    renderWithProviders(<RemoveTransactionModal />, state);
    fireEvent.click(removeButton());
    removeRequest.status = "fulfilled";
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(removeTransaction).toHaveBeenCalled();
    expect(requestReset).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(close());
  });
});
