import { AppStore, RootState, setupStore } from "@/redux/store";
import type { PreloadedState } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
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

export {
  renderWithProviders,
  setWrapper,
  mockResponseErrorHandler,
  mockResponseHandler,
};
