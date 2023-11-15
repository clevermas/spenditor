import { server } from "@/test/server";
import {
  mockResponseErrorHandler,
  mockResponseHandler,
  renderWithProviders,
} from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import {
  useAddTransactionMutation,
  useGetTransactionsQuery,
  useRemoveTransactionMutation,
  useUpdateTransactionMutation,
} from "./transactions-api";

describe("Transactions API", () => {
  describe("getTransactions", () => {
    const MockComponent = () => {
      const { data, status, isError, isSuccess, isFetching } =
        useGetTransactionsQuery();
      return (
        <>
          <div data-testid="status">{status}</div>
          <div data-testid="isFetching">{String(isFetching)}</div>
          <div data-testid="isError">{String(isError)}</div>
          <div data-testid="isSuccess">{String(isSuccess)}</div>
          <div data-testid="data">{JSON.stringify(data)}</div>
        </>
      );
    };

    test("renders initial query state", async () => {
      renderWithProviders(<MockComponent />);

      expect(screen.getByTestId("status").textContent).toBe("pending");
      expect(screen.getByTestId("isFetching").textContent).toBe("true");
      expect(screen.getByTestId("isError").textContent).toBe("false");
      expect(screen.getByTestId("isSuccess").textContent).toBe("false");
      expect(screen.getByTestId("data").textContent).toBe("");
    });

    test("sends request and updates query state", async () => {
      renderWithProviders(<MockComponent />);

      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("fulfilled")
      );
      expect(screen.getByTestId("isFetching").textContent).toBe("false");
      expect(screen.getByTestId("isError").textContent).toBe("false");
      expect(screen.getByTestId("isSuccess").textContent).toBe("true");
      expect(screen.getByTestId("data").textContent).toBe("{}");
    });

    test("sends request and updates query state on error response", async () => {
      server.use(
        http.get("/api/account", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      renderWithProviders(<MockComponent />);

      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("rejected")
      );
      expect(screen.getByTestId("isFetching").textContent).toBe("false");
      expect(screen.getByTestId("isError").textContent).toBe("true");
      expect(screen.getByTestId("isSuccess").textContent).toBe("false");
      expect(screen.getByTestId("data").textContent).toBe("");
    });
  });

  const MockComponentFactory = (useMutation, onClickHandler) => {
    const MockComponent = () => {
      const [send, updateRequest] = useMutation();
      const { status, isLoading, isError, data } = updateRequest;
      return (
        <>
          <div data-testid="status">{status}</div>
          <div data-testid="isLoading">{String(isLoading)}</div>
          <div data-testid="isError">{String(isError)}</div>
          <div data-testid="data">{JSON.stringify(data)}</div>
          <button data-testid="button" onClick={() => onClickHandler(send)}>
            Send
          </button>
        </>
      );
    };

    MockComponent.displayName = "MockComponent";
    return MockComponent;
  };

  [
    [
      "addTransaction",
      useAddTransactionMutation,
      mockResponseErrorHandler("/api/transaction", "post"),
    ],
    [
      "updateTransaction",
      useUpdateTransactionMutation,
      mockResponseErrorHandler("/api/transaction/mocked", "put"),
      (send) => send({ _id: "mocked" }),
      mockResponseHandler("/api/transaction/mocked", "put"),
    ],
    [
      "removeTransaction",
      useRemoveTransactionMutation,
      mockResponseErrorHandler("/api/transaction/mocked", "delete"),
      (send) => send("mocked"),
      mockResponseHandler("/api/transaction/mocked", "delete"),
    ],
  ].forEach(
    ([name, mutation, mockErrorResponse, onClickHandler, mockResponse]) => {
      describe(name, () => {
        const MockComponent = MockComponentFactory(
          mutation,
          onClickHandler || ((send) => send())
        );

        mockResponse && beforeEach(() => mockResponse());

        test("renders initial mutation state", async () => {
          renderWithProviders(<MockComponent />);

          expect(screen.getByTestId("status").textContent).toBe(
            "uninitialized"
          );
          expect(screen.getByTestId("isLoading").textContent).toBe("false");
          expect(screen.getByTestId("isError").textContent).toBe("false");
          expect(screen.getByTestId("data").textContent).toBe("");
        });

        test("sends request and updates mutation state", async () => {
          renderWithProviders(<MockComponent />);

          fireEvent.click(screen.getByTestId("button"));

          expect(screen.getByTestId("status").textContent).toBe("pending");
          expect(screen.getByTestId("isLoading").textContent).toBe("true");
          await waitFor(() =>
            expect(screen.getByTestId("status").textContent).toBe("fulfilled")
          );
          expect(screen.getByTestId("isLoading").textContent).toBe("false");
          expect(screen.getByTestId("isError").textContent).toBe("false");
          expect(screen.getByTestId("data").textContent).toBe("{}");
        });

        test("sends request and updates mutation state on error response", async () => {
          mockErrorResponse();

          renderWithProviders(<MockComponent />);

          fireEvent.click(screen.getByTestId("button"));

          expect(screen.getByTestId("status").textContent).toBe("pending");
          expect(screen.getByTestId("isLoading").textContent).toBe("true");
          await waitFor(() =>
            expect(screen.getByTestId("status").textContent).toBe("rejected")
          );
          expect(screen.getByTestId("isLoading").textContent).toBe("false");
          expect(screen.getByTestId("isError").textContent).toBe("true");
          expect(screen.getByTestId("data").textContent).toBe("");
        });
      });
    }
  );
});
