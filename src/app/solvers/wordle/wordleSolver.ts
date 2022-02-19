import {
  generateAllGuessResultPattern,
  GuessResult,
} from "@/app/games/guessResult";
import WordleGame, { GuessWithResult } from "@/app/games/wordle/wordleGame";
import { isEqual, mean } from "lodash";

interface GuessInformation {
  guess: string;
  expectedEntropy: number;
}

class WordleSolver {
  private static _allGuessResultPattern = generateAllGuessResultPattern(
    WordleGame.answerLength
  );

  static get allGuessResultPattern(): GuessResult[] {
    return this._allGuessResultPattern;
  }

  static filterNewPossibleAnswers(
    guess: string,
    guessResult: GuessResult,
    possibleAnswers: string[]
  ): string[] {
    const newPossibleAnswers = possibleAnswers.filter((answer) =>
      isEqual(WordleGame.guessResult(guess, answer), guessResult)
    );
    return newPossibleAnswers;
  }

  static generateGuessInformation(
    possibleAnswers: string[]
  ): GuessInformation[] {
    return WordleGame.allowList
      .map((guess) => {
        const entropyGains = WordleSolver.allGuessResultPattern.flatMap(
          (guessResult) => {
            const newPossibleAnswers = this.filterNewPossibleAnswers(
              guess,
              guessResult,
              possibleAnswers
            );

            if (newPossibleAnswers.length === 0) {
              return [];
            }
            return [
              Math.log2(possibleAnswers.length / newPossibleAnswers.length),
            ];
          }
        );
        return {
          guess,
          expectedEntropy: mean(entropyGains),
        };
      })
      .sort((a, b) => b.expectedEntropy - a.expectedEntropy);
  }

  private _guesses: Required<GuessWithResult>[];

  private _possibleAnswers: string[];

  private _guessesInformation: GuessInformation[];

  constructor() {
    this._guesses = [];
    this._possibleAnswers = [...WordleGame.answerList];
    this._guessesInformation = WordleSolver.generateGuessInformation(
      this._possibleAnswers
    );
  }

  get guesses(): GuessWithResult[] {
    return this._guesses;
  }

  get possibleAnswers(): string[] {
    return this._possibleAnswers;
  }

  get currentEntropy(): number {
    return Math.log2(this._possibleAnswers.length);
  }

  get guessesInformation(): GuessInformation[] {
    return this._guessesInformation;
  }

  addGuess({ guess, guessResult }: Required<GuessWithResult>): void {
    this._guesses.push({ guess, guessResult });
    this._possibleAnswers = WordleSolver.filterNewPossibleAnswers(
      guess,
      guessResult,
      this._possibleAnswers
    );
    this._guessesInformation = WordleSolver.generateGuessInformation(
      this._possibleAnswers
    );
  }
}

export default WordleSolver;
