export enum SingleGuessResult {
  unknown = 0,
  noMatch = 1,
  partialMatch = 2,
  perfectMatch = 3,
}

export type GuessResult = SingleGuessResult[];

export const generateAllGuessResultPattern = (
  length: number
): GuessResult[] => {
  if (length === 0) {
    return [[]];
  } else {
    const shorterGuesResultPattern = generateAllGuessResultPattern(length - 1);
    return shorterGuesResultPattern.flatMap((guessResult) => [
      guessResult.concat([SingleGuessResult.noMatch]),
      guessResult.concat([SingleGuessResult.partialMatch]),
      guessResult.concat([SingleGuessResult.perfectMatch]),
    ]);
  }
};

export default GuessResult;
