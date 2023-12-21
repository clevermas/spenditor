import { createSlice } from "@reduxjs/toolkit";

type SidebarState = {
  isOpen: boolean;
};

export const initialState = {
  isOpen: false,
} as SidebarState;

export const sidebar = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    reset: () => initialState,
    toggle: (state) => ({ ...state, isOpen: !state.isOpen }),
  },
});

export const { reset, toggle } = sidebar.actions;
export default sidebar.reducer;
