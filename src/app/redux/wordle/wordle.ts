import { createSlice } from "@reduxjs/toolkit";
import WordleGame, { PlainWordleGame } from "@/app/games/wordle/wordleGame";
import type { RootState } from "@/app/redux/store";

export const wordleSlice = createSlice({
  name: "wordle",
  initialState: {
    game: new WordleGame(false).toPlain(),
    currentGuess: "",
  },
  reducers: {
    updateGame: (state, action) => {
      state.game = action.payload;
    },
    updateCurrentGuess: (state, action) => {
      state.currentGuess = action.payload;
    },
  },
});

export const { updateGame, updateCurrentGuess } = wordleSlice.actions;

export const selectWordleGame = (state: RootState): PlainWordleGame =>
  state.wordle.game;

export const selectWordleCurrentGuess = (state: RootState): string =>
  state.wordle.currentGuess;

export default wordleSlice.reducer;
