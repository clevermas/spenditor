import { generateTransaction } from "@/lib/transaction/transaction";
import { open } from "@/redux/features/modal.slice";
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
  beforeEach(() => {
    dispatch.mockClear();
  });

  test("renders actions dropdown button", () => {
    render(<DataTableActions />);

    const button = screen.getByRole("button", { name: "actions" });

    expect(button).toBeInTheDocument();
  });

  test("opens actions menu", async () => {
    const user = userEvent.setup();
    render(<DataTableActions />);

    const button = screen.getByRole("button", { name: "actions" });
    await user.click(button);

    const menu = screen.getByRole("menu");
    const edit = screen.getByText("Edit");
    const remove = screen.getByText("Remove");
    expect(menu).toBeInTheDocument();
    expect(edit).toBeInTheDocument();
    expect(remove).toBeInTheDocument();
  });

  test("opens edit transaction modal", async () => {
    const data = generateTransaction();
    const user = userEvent.setup();
    render(<DataTableActions data={data} />);

    const button = screen.getByRole("button", { name: "actions" });
    await user.click(button);
    const edit = screen.getByText("Edit");
    await user.click(edit);

    expect(dispatch).toHaveBeenCalledWith(
      open({ type: "editTransaction", data })
    );
  });

  test("opens remove transaction modal", async () => {
    const data = generateTransaction();
    const user = userEvent.setup();
    render(<DataTableActions data={data} />);

    const button = screen.getByRole("button", { name: "actions" });
    await user.click(button);
    const remove = screen.getByText("Remove");
    await user.click(remove);

    expect(dispatch).toHaveBeenCalledWith(
      open({ type: "removeTransaction", data: { transactionId: data._id } })
    );
  });
});
