import { AppStore, RootState, setupStore } from "@/redux/store";
import type { PreloadedState } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { server } from "./server";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store. For
// future dependencies, such as wanting to test with react-router, you can extend
// this interface to accept a path and route and use those in a <MemoryRouter />
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  return {
    store,
    ...render(ui, { wrapper: setWrapper(store), ...renderOptions }),
  };
}

function setWrapper(store) {
  return function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  };
}

function mockResponseHandler(url, method) {
  return () =>
    server.use(
      http[method](url, () => {
        return HttpResponse.json({});
      })
    );
}

function mockResponseErrorHandler(url, method) {
  return () =>
    server.use(
      http[method](url, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
}

const QueryMockComponentFactory = (useQuery) => {
  const QueryMockComponent = () => {
    const { data, status, isError, isSuccess, isFetching } = useQuery();

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

  QueryMockComponent.displayName = "QueryMockComponent";
  return QueryMockComponent;
};

function defaultQueryTestCases([name, query, mockErrorResponse]) {
  describe(name, () => {
    const QueryMockComponent = QueryMockComponentFactory(query);

    test("renders initial query state", async () => {
      renderWithProviders(<QueryMockComponent />);

      expect(screen.getByTestId("status").textContent).toBe("pending");
      expect(screen.getByTestId("isFetching").textContent).toBe("true");
      expect(screen.getByTestId("isError").textContent).toBe("false");
      expect(screen.getByTestId("isSuccess").textContent).toBe("false");
      expect(screen.getByTestId("data").textContent).toBe("");
    });

    test("sends request and updates query state", async () => {
      renderWithProviders(<QueryMockComponent />);

      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("fulfilled")
      );
      expect(screen.getByTestId("isFetching").textContent).toBe("false");
      expect(screen.getByTestId("isError").textContent).toBe("false");
      expect(screen.getByTestId("isSuccess").textContent).toBe("true");
      expect(screen.getByTestId("data").textContent).toBe("{}");
    });

    test("sends request and updates query state on error response", async () => {
      mockErrorResponse();

      renderWithProviders(<QueryMockComponent />);

      await waitFor(() =>
        expect(screen.getByTestId("status").textContent).toBe("rejected")
      );
      expect(screen.getByTestId("isFetching").textContent).toBe("false");
      expect(screen.getByTestId("isError").textContent).toBe("true");
      expect(screen.getByTestId("isSuccess").textContent).toBe("false");
      expect(screen.getByTestId("data").textContent).toBe("");
    });
  });
}

const MutationMockComponentFactory = (useMutation, onClickHandler) => {
  const MutationMockComponent = () => {
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

  MutationMockComponent.displayName = "MutationMockComponent";
  return MutationMockComponent;
};

function defaultMutationTestCases([
  name,
  mutation,
  mockErrorResponse,
  onClickHandler,
  mockResponse,
]) {
  describe(name, () => {
    const MutationMockComponent = MutationMockComponentFactory(
      mutation,
      onClickHandler || ((send) => send())
    );

    mockResponse && beforeEach(() => mockResponse());

    test("renders initial mutation state", async () => {
      renderWithProviders(<MutationMockComponent />);

      expect(screen.getByTestId("status").textContent).toBe("uninitialized");
      expect(screen.getByTestId("isLoading").textContent).toBe("false");
      expect(screen.getByTestId("isError").textContent).toBe("false");
      expect(screen.getByTestId("data").textContent).toBe("");
    });

    test("sends request and updates mutation state", async () => {
      renderWithProviders(<MutationMockComponent />);

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
      renderWithProviders(<MutationMockComponent />);

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

export {
  renderWithProviders,
  setWrapper,
  mockResponseErrorHandler,
  mockResponseHandler,
  defaultQueryTestCases,
  defaultMutationTestCases,
};
