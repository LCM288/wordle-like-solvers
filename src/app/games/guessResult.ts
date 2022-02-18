export enum SingleGuessResult {
  unknown = 0,
  noMatch = 1,
  partialMatch = 2,
  perfectMatch = 3,
}

export type GuessResult = SingleGuessResult[];

export default GuessResult;
