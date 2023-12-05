import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import moment from "moment";
import { useEffect } from "react";
import { TransactionForm, useTransactionForm } from "./transaction-form";

describe("Transaction Form", () => {
  const submitSpy = jest.fn();

  const MockComponent = ({ ...formFields }) => {
    const { form } = useTransactionForm();

    const { setValue } = form;
    const { type, amount, date, category } = formFields;

    useEffect(() => {
      Object.entries({ type, amount, date, category }).forEach(
        ([field, value]) =>
          value &&
          setValue(field, value, {
            shouldValidate: true,
          })
      );
    }, [setValue, type, amount, date, category]);

    return (
      <>
        <TransactionForm form={form} onSubmit />
        <button onClick={form.handleSubmit(submitSpy)}>Submit</button>
      </>
    );
  };

  beforeEach(() => submitSpy.mockClear());

  test("renders all labels and fields", () => {
    render(<MockComponent></MockComponent>);

    expect(screen.getByText("Transaction type")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Expense")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Uncategorised")).toBeInTheDocument();
    expect(screen.getByText("Transaction Date")).toBeInTheDocument();
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter tag")).toBeInTheDocument();
    expect(screen.getByText("Comment")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Comment")).toBeInTheDocument();
  });

  test("renders error after submitting empty transaction date field", async () => {
    render(<MockComponent></MockComponent>);

    await act(() => {
      fireEvent.click(screen.getByText("Submit"));
    });

    expect(
      screen.getByText("Transaction date is required.")
    ).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();
  });

  const fields = { amount: "-1", date: new Date() };

  [
    [
      "renders error after invalid type",
      {
        ...fields,
        type: "invalid",
      },
      "Transaction type must be one of these values: income, expense",
    ],
    [
      "renders error after submitting all required fields except empty amount field",
      {
        date: new Date("09/11/2001"),
      },
      "Amount is required.",
    ],
    [
      "renders error after submitting positive expense",
      {
        ...fields,
        amount: "1",
        type: "expense",
      },
      "Expense amount should be negative",
    ],
    [
      "renders error after submitting negative income",
      {
        ...fields,
        amount: "-1",
        type: "income",
      },
      "Income amount should be positive",
    ],
    [
      "renders error in invalid format (1.234)",
      {
        ...fields,
        amount: "1.234",
      },
      "Amount must be in format (-)10.00",
    ],
    [
      "renders error in invalid format (1,234)",
      {
        ...fields,
        amount: "1,234",
      },
      "Amount must be in format (-)10.00",
    ],
    [
      "renders error in invalid format (1 234)",
      {
        ...fields,
        amount: "1 234",
      },
      "Amount must be in format (-)10.00",
    ],
    [
      "renders error in invalid format (+2.34)",
      {
        ...fields,
        amount: "+2.34",
      },
      "Amount must be in format (-)10.00",
    ],
    [
      "renders error when date is later the current",
      {
        ...fields,
        date: moment().add(1, "days").toDate(),
      },
      "Date should not be later than now",
    ],
    [
      "renders error when date is invalid",
      {
        ...fields,
        date: new Date("invalid"),
      },
      () => expect(screen.queryAllByText("Invalid date")).not.toBeNull(),
    ],
    [
      "renders invalid expense category",
      {
        ...fields,
        category: "invalid",
      },
      "Invalid expense category",
    ],
    [
      "renders invalid income category",
      {
        ...fields,
        type: "income",
        amount: "1",
        category: "invalid",
      },
      "Invalid income category",
    ],
    [
      "submits valid form",
      {
        ...fields,
      },
      () => expect(submitSpy).toHaveBeenCalled(),
      true,
    ],
  ].forEach(([testCase, props, validationMessage, notCheckSubmit]) => {
    test(testCase, async () => {
      await act(() => {
        render(<MockComponent {...props}></MockComponent>);
      });
      await act(() => {
        fireEvent.click(screen.getByText("Submit"));
      });

      typeof validationMessage === "function"
        ? validationMessage()
        : expect(screen.getByText(validationMessage)).toBeInTheDocument();
      if (!notCheckSubmit) {
        expect(submitSpy).not.toHaveBeenCalled();
      }
    });
  });
});
