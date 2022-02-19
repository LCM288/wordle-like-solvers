import {
  generateAllGuessResultPattern,
  GuessResult,
  SingleGuessResult,
} from "@/app/games/guessResult";
import WordleGame, {
  AlphabetResult,
  GuessWithResult,
} from "@/app/games/wordle/wordleGame";
import { isEqual, mean } from "lodash";
import initGuessesInformation from "@/app/solvers/wordle/initGuessesInformation.json";

export interface GuessInformation {
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
        const guessResults = possibleAnswers.map((answer) =>
          WordleGame.guessResult(guess, answer)
        );
        const resultCountMap: Record<string, number> = {};
        guessResults.forEach((guessResult) => {
          resultCountMap[guessResult.toString()] =
            (resultCountMap[guessResult.toString()] ?? 0) + 1;
        });
        const entropyGains = WordleSolver.allGuessResultPattern.flatMap(
          (guessResult) => {
            const newPossibleAnswersLength =
              resultCountMap[guessResult.toString()] ?? 0;
            if (newPossibleAnswersLength === 0) {
              return [];
            }
            return [newPossibleAnswersLength];
          }
        );
        return {
          guess,
          expectedEntropy: Math.log2(
            possibleAnswers.length / mean(entropyGains)
          ),
        };
      })
      .sort((a, b) => b.expectedEntropy - a.expectedEntropy);
  }

  private _guesses: Required<GuessWithResult>[];

  private _possibleAnswers: string[];

  private _guessesInformation: GuessInformation[];

  private _alphabetResult: AlphabetResult;

  constructor() {
    this._guesses = [];
    this._possibleAnswers = [...WordleGame.answerList];
    this._guessesInformation = [...initGuessesInformation];
    this._alphabetResult = {};
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

  get alphabetResult(): AlphabetResult {
    return this._alphabetResult;
  }

  addGuess({ guess, guessResult }: Required<GuessWithResult>): boolean {
    if (
      guess.length !== WordleGame.answerLength ||
      guessResult.length !== WordleGame.answerLength
    ) {
      return false;
    }
    if (!WordleGame.guessIsInAllowList(guess)) {
      return false;
    }
    for (let i = 0; i < guessResult.length; i++) {
      switch (guessResult[i]) {
        case SingleGuessResult.noMatch:
        case SingleGuessResult.partialMatch:
        case SingleGuessResult.perfectMatch:
          break;
        default:
          return false;
      }
    }
    this._guesses.push({ guess, guessResult });
    this._possibleAnswers = WordleSolver.filterNewPossibleAnswers(
      guess,
      guessResult,
      this._possibleAnswers
    );
    console.log("start");
    this._guessesInformation = WordleSolver.generateGuessInformation(
      this._possibleAnswers
    );
    console.log("end");
    WordleGame.updateAlphabetResult(
      { guess, guessResult },
      this._alphabetResult
    );
    return true;
  }
}

export default WordleSolver;
