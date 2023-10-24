import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./features/langSlice";

export const store = configureStore({
  reducer: {
    languageReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
