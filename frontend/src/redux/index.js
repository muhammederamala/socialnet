import { configureStore } from "@reduxjs/toolkit";
import { modalReducer } from "./modalSlice";
import { iconReducer } from "./navbarIconSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    navbarIcon: iconReducer,
  },
});

export default store;
