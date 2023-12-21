import { close, initialState, open, reset } from "@/redux/features/modal.slice";
import { setupStore } from "@/redux/store";

describe("Modal Slice", () => {
  const modalTypes = [
    ["addTranscation", "Add Transaction", "add transaction mocked"],
    ["editTransaction", "Edit Transaction", "edit transaction mocked"],
    ["removeTransaction", "Remove Transaction", "remove transaction mocked"],
  ];

  modalTypes.forEach(([type, name, data]) => {
    describe(name, () => {
      test("opens modal and updates the state correctly", () => {
        const store = setupStore();

        store.dispatch(open({ type, data }));

        expect(store.getState().modalReducer).toEqual({
          type,
          data,
          isOpen: true,
        });
      });

      test("closes modal and updates the state correctly", () => {
        const store = setupStore();

        store.dispatch(open({ type, data }));
        store.dispatch(close());

        expect(store.getState().modalReducer).toEqual({
          type: null,
          data,
          isOpen: false,
        });
      });

      test("resets the state correctly", () => {
        const store = setupStore();

        store.dispatch(open({ type, data }));
        store.dispatch(reset());

        expect(store.getState().modalReducer).toEqual(initialState);
      });
    });
  });
});
