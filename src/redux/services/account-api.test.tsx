import { createList } from "@/lib/utils";
import { server } from "@/test/server";
import {
  mockResponseErrorHandler,
  mockResponseHandler,
  renderWithProviders,
} from "@/test/test-utils";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { useState } from "react";
import {
  useAccountDataQuery,
  useAddTransactionMutation,
  useRemoveTransactionMutation,
  useUpdateTransactionMutation,
} from "./account-api";

describe("Transactions API", () => {
  describe("getTransactions", () => {
    const MockComponent = () => {
      const [page, setPage] = useState(1);
      const { data, status, isError, isSuccess, isFetching } =
        useAccountDataQuery(page);
      const [addTransaction, updateRequest] = useAddTransactionMutation();

      function nextPage() {
        setPage((p) => p + 1);
      }

      function revalidate() {
        addTransaction();
      }

      return (
        <>
          <div data-testid="status">{status}</div>
          <div data-testid="isFetching">{String(isFetching)}</div>
          <div data-testid="isError">{String(isError)}</div>
          <div data-testid="isSuccess">{String(isSuccess)}</div>
          <div data-testid="data">
            {!data?.recentTransactions ? (
              <>{JSON.stringify(data)}</>
            ) : (
              <>
                <div>Balance: {data.balance}</div>
                <div>Current page: {data.recentTransactions.currentPage}</div>
                <div>Total pages: {data.recentTransactions.totalPages}</div>
                <div>Data: {data.recentTransactions.data.join(",")}</div>
              </>
            )}
          </div>
          <button data-testid="nextPage" onClick={nextPage}></button>
          <button data-testid="revalidate" onClick={revalidate}></button>
          <button data-testid="revalidationStatus">
            {updateRequest.status}
          </button>
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

    describe("caching and revalidation", () => {
      let totalPages = 5;

      async function nextPage() {
        fireEvent.click(screen.getByTestId("nextPage"));
        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("pending")
        );
        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
      }

      async function revalidate() {
        fireEvent.click(screen.getByTestId("revalidate"));
        await waitFor(() =>
          expect(screen.getByTestId("revalidationStatus").textContent).toBe(
            "pending"
          )
        );
        await waitFor(() =>
          expect(screen.getByTestId("revalidationStatus").textContent).toBe(
            "fulfilled"
          )
        );
        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
      }

      beforeEach(() => {
        server.use(
          http.get("/api/account", ({ request }) => {
            const url = new URL(request.url);
            const page = +url.searchParams.get("page");
            const limit = +url.searchParams.get("limit") || 10;

            return HttpResponse.json({
              balance: limit !== 10 ? 102 : 100,
              recentTransactions: {
                totalPages,
                limit,
                ...(limit !== 10
                  ? limit === 30
                    ? {
                        data: createList(limit, (i) => `day${i + 1}rev`),
                        currentPage: 1,
                        totalPages: 1,
                      }
                    : limit === 40
                    ? {
                        data: createList(limit, (i) => `day${i + 1}rev`),
                        currentPage: 1,
                        totalPages: 2,
                      }
                    : {
                        data: createList(40, (i) => `day${i + 1}rev`),
                        currentPage: 1,
                        totalPages: 1,
                      }
                  : {
                      data: createList(limit, (i) => `day${i + 1}page${page}`),
                      currentPage: page,
                    }),
              },
            });
          })
        );
      });

      test("caches first page", async () => {
        renderWithProviders(<MockComponent />);

        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );

        expect(screen.getByText("Balance: 100")).toBeInTheDocument();
        expect(screen.getByText("Current page: 1")).toBeInTheDocument();
        expect(screen.getByText("Total pages: 5")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Data: " + createList(10, (i) => `day${i + 1}page1`).join(",")
          )
        ).toBeInTheDocument();
      });

      test("caches second page", async () => {
        renderWithProviders(<MockComponent />);

        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
        await nextPage();

        expect(screen.getByText("Balance: 100")).toBeInTheDocument();
        expect(screen.getByText("Current page: 2")).toBeInTheDocument();
        expect(screen.getByText("Total pages: 5")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Data: " +
              createList(2, (page) =>
                createList(10, (i) => `day${i + 1}page${page + 1}`).join(",")
              ).join(",")
          )
        ).toBeInTheDocument();
      });

      test("caches and revalidates three pages", async () => {
        renderWithProviders(<MockComponent />);

        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
        for (let i = 1; i <= 2; i++) {
          await nextPage();
        }
        await revalidate();

        expect(screen.getByText("Balance: 102")).toBeInTheDocument();
        expect(screen.getByText("Current page: 3")).toBeInTheDocument();
        expect(screen.getByText("Total pages: 3")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Data: " + createList(30, (i) => `day${i + 1}rev`).join(",")
          )
        ).toBeInTheDocument();
      });

      test("caches 4 pages and updates total pages to 5 when one transaction was added after revalidation", async () => {
        totalPages = 4;
        renderWithProviders(<MockComponent />);

        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
        for (let i = 1; i <= 3; i++) {
          await nextPage();
        }
        await revalidate();

        expect(screen.getByText("Balance: 102")).toBeInTheDocument();
        expect(screen.getByText("Current page: 4")).toBeInTheDocument();
        expect(screen.getByText("Total pages: 5")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Data: " + createList(40, (i) => `day${i + 1}rev`).join(",")
          )
        ).toBeInTheDocument();
      });

      test("caches 5 pages and updates pages number to 4 when one transaction was removed after revalidation", async () => {
        totalPages = 5;
        renderWithProviders(<MockComponent />);

        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
        for (let i = 1; i <= 4; i++) {
          await nextPage();
        }
        await revalidate();

        expect(screen.getByText("Balance: 102")).toBeInTheDocument();
        expect(screen.getByText("Current page: 4")).toBeInTheDocument();
        expect(screen.getByText("Total pages: 4")).toBeInTheDocument();
        expect(
          screen.getByText(
            "Data: " + createList(40, (i) => `day${i + 1}rev`).join(",")
          )
        ).toBeInTheDocument();
      });
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
      mockResponseErrorHandler("/api/account/transaction", "post"),
    ],
    [
      "updateTransaction",
      useUpdateTransactionMutation,
      mockResponseErrorHandler("/api/account/transaction/mocked", "put"),
      (send) => send({ _id: "mocked" }),
      mockResponseHandler("/api/account/transaction/mocked", "put"),
    ],
    [
      "removeTransaction",
      useRemoveTransactionMutation,
      mockResponseErrorHandler("/api/account/transaction/mocked", "delete"),
      (send) => send("mocked"),
      mockResponseHandler("/api/account/transaction/mocked", "delete"),
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

  describe("getTransactions revalidation", () => {
    const MockComponentFactory = (useMutation, onClickHandler) => {
      const MockComponent = () => {
        const { data, status } = useAccountDataQuery();
        const [revalidate, updateRequest] = useMutation();

        return (
          <>
            <button data-testid="revalidationStatus">
              {updateRequest.status}
            </button>
            <div data-testid="status">{status}</div>
            <div data-testid="data">
              {data?.recentTransactions?.data?.join(",")}
            </div>
            <button
              data-testid="revalidate"
              onClick={() => onClickHandler(revalidate)}
            >
              Revalidate
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
        mockResponseHandler("/api/account/transaction", "post"),
      ],
      [
        "updateTransaction",
        useUpdateTransactionMutation,
        mockResponseHandler("/api/account/transaction/mocked", "put"),
        (revalidate) => revalidate({ _id: "mocked" }),
      ],
      [
        "removeTransaction",
        useRemoveTransactionMutation,
        mockResponseHandler("/api/account/transaction/mocked", "delete"),
        (revalidate) => revalidate("mocked"),
      ],
    ].forEach(([name, mutation, mockResponse, onClickHandler]) => {
      const MockComponent = MockComponentFactory(
        mutation,
        onClickHandler || ((revalidate) => revalidate({}))
      );

      beforeEach(() => {
        mockResponse && mockResponse();

        server.use(
          http.get("/api/account", ({ request }) => {
            const url = new URL(request.url);
            const page = +url.searchParams.get("page");
            const limit = +url.searchParams.get("limit");

            return HttpResponse.json({
              recentTransactions: {
                data: limit ? ["rev"] : [],
                currentPage: 1,
                totalPages: 1,
                limit: 10,
              },
            });
          })
        );
      });

      test("revalidates query after mutation update: " + name, async () => {
        renderWithProviders(<MockComponent />);

        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );
        fireEvent.click(screen.getByTestId("revalidate"));
        await waitFor(() =>
          expect(screen.getByTestId("revalidationStatus").textContent).toBe(
            "fulfilled"
          )
        );
        await waitFor(() =>
          expect(screen.getByTestId("status").textContent).toBe("fulfilled")
        );

        expect(screen.getByTestId("data").textContent).toBe("rev");
      });
    });
  });
});
