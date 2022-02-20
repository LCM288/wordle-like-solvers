import { createSlice } from "@reduxjs/toolkit";
import WordleSolver, {
  PlainWordleSolver,
} from "@/app/solvers/wordle/wordleSolver";
import type { RootState } from "@/app/redux/store";
import GuessResult from "@/app/games/guessResult";
import { SolverMode } from "@/app/pages/wordle/wordleHint";

export const wordleHintSlice = createSlice({
  name: "wordleHint",
  initialState: {
    solver: new WordleSolver().toPlain(),
    currentGuess: "",
    currentResult: [] as GuessResult,
    solverMode: SolverMode.Default,
  },
  reducers: {
    updateSolver: (state, action) => {
      state.solver = action.payload;
    },
    updateCurrentGuess: (state, action) => {
      state.currentGuess = action.payload;
    },
    updateCurrentResult: (state, action) => {
      state.currentResult = action.payload;
    },
    updateSolverMode: (state, action) => {
      state.solverMode = action.payload;
    },
  },
});

export const {
  updateSolver,
  updateCurrentGuess,
  updateCurrentResult,
  updateSolverMode,
} = wordleHintSlice.actions;

export const selectWordleSolver = (state: RootState): PlainWordleSolver =>
  state.wordleHint.solver;

export const selectWordleHintCurrentGuess = (state: RootState): string =>
  state.wordleHint.currentGuess;

export const selectWordleHintCurrentResult = (state: RootState): GuessResult =>
  state.wordleHint.currentResult;

export const selectWordleHintSolverMode = (state: RootState): SolverMode =>
  state.wordleHint.solverMode;

export default wordleHintSlice.reducer;
