import { renderWithProviders } from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";

import { generateTransaction } from "@/lib/transaction/transaction";
import { close } from "@/redux/features/modal.slice";
import { RemoveTransactionModal } from "./remove-transaction-modal";

const requestReset = jest.fn();
const initalUpdateRequest = () => ({ status: "", reset: requestReset });
let removeTransaction = jest.fn();
let removeRequest = initalUpdateRequest();

jest.mock("../../redux/services/transactions-api", () => ({
  ...jest.requireActual("../../redux/services/transactions-api"),
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

  beforeEach(() => {
    requestReset.mockClear();
    removeTransaction.mockClear();
  });

  test("renders heading", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    const heading = screen.getByText("Remove transaction");

    expect(heading).toBeInTheDocument();
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

    const button = screen.getByText("Cancel");

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test("renders remove button", () => {
    renderWithProviders(<RemoveTransactionModal />, state);

    const button = screen.getByText("Remove");

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test("closes modal on removal", () => {
    renderWithProviders(<RemoveTransactionModal />, state);
    const button = screen.getByText("Remove");
    fireEvent.click(button);
    removeRequest.status = "fulfilled";
    renderWithProviders(<RemoveTransactionModal />, state);

    expect(removeTransaction).toHaveBeenCalled();
    expect(requestReset).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(close());
  });
});
