import { open } from "@/redux/features/modal.slice";
import { generateTransaction } from "@/test/mocks/account-api";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DataTableActions } from "./data-table-actions";

const dispatch = jest.fn();

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: () => dispatch,
  };
});

describe("Home Data Table Actions", () => {
  function actionsButton() {
    return screen.getByRole("button", { name: "actions" });
  }

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("renders actions dropdown button", () => {
    render(<DataTableActions />);

    expect(actionsButton()).toBeInTheDocument();
  });

  test("opens actions menu", async () => {
    const user = userEvent.setup();
    render(<DataTableActions />);

    await user.click(actionsButton());

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  test("opens edit transaction modal", async () => {
    const data = generateTransaction();
    const user = userEvent.setup();
    render(<DataTableActions data={data} />);

    await user.click(actionsButton());
    await user.click(screen.getByText("Edit"));

    expect(dispatch).toHaveBeenCalledWith(
      open({ type: "editTransaction", data })
    );
  });

  test("opens remove transaction modal", async () => {
    const data = generateTransaction();
    const user = userEvent.setup();
    render(<DataTableActions data={data} />);

    await user.click(actionsButton());
    await user.click(screen.getByText("Remove"));

    expect(dispatch).toHaveBeenCalledWith(
      open({ type: "removeTransaction", data: { transactionId: data._id } })
    );
  });
});
