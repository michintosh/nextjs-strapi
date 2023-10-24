import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LanguageState = {
  currentLanguage: string;
};

const initialState = {
  currentLanguage: "it",
} as LanguageState;

export const language = createSlice({
  name: "language",
  initialState,
  reducers: {
    reset: () => initialState,
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage, reset } = language.actions;
export default language.reducer;
