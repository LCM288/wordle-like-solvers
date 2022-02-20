import { configureStore } from "@reduxjs/toolkit";
import wordleReducer from "@/app/redux/wordle/wordle";
import wordleHintReducer from "@/app/redux/wordle/wordleHint";

const store = configureStore({
  reducer: {
    wordle: wordleReducer,
    wordleHint: wordleHintReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
