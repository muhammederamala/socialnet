import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  icon: "user",
};

const navbarIconSlice = createSlice({
  name: "icon",
  initialState: initialState,
  reducers: {
    setIcon(state, action) {
      state.icon = action.payload;
    },
  },
});

export const { actions: iconActions, reducer: iconReducer } = navbarIconSlice;
