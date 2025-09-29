import "@testing-library/jest-dom";
import { accountApi } from "@/redux/services/account-api";
import { setupStore } from "@/redux/store";
import { server } from "./server";
// make debug output for TestingLibrary Errors larger
process.env.DEBUG_PRINT_LIMIT = "15000";

const store = setupStore({});

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  // This is the solution to clear RTK Query cache after each test
  store.dispatch(accountApi.util.resetApiState());
});

// Clean up after the tests are finished.
afterAll(() => server.close());
