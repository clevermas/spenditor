import { setupStore } from "../store";
import { initialState, reset, toggle } from "./sidebar.slice";

describe("Sidebar Slice", () => {
  test("toggles sidebar open status in the state", () => {
    const store = setupStore();

    store.dispatch(toggle());

    expect(store.getState().sidebarReducer).toEqual({
      isOpen: true,
    });
  });

  test("resets the state", () => {
    const store = setupStore();

    store.dispatch(toggle());
    store.dispatch(reset());

    expect(store.getState().sidebarReducer).toEqual(initialState);
  });
});
