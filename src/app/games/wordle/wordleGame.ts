import otherAllowList from "@/app/games/wordle/otherAllowList.json";
import answerList from "@/app/games/wordle/answerList.json";
import { last, sample, sortedIndex, isEqual } from "lodash";
import { GuessResult, SingleGuessResult } from "@/app/games/guessResult";

export type GuessWithResult = {
  guess: string;
  guessResult?: GuessResult;
};

export type AlphabetResult = Record<string, SingleGuessResult>;

export type PlainWordleGame = {
  answer: string;
  guesses: Required<GuessWithResult>[];
  alphabetResult: AlphabetResult;
  isHard: boolean;
};

const allowList = answerList.concat(otherAllowList).sort();

class WordleGame {
  static get answerLength(): number {
    return 5;
  }

  static get maxGuesses(): number {
    return 6;
  }

  static get answerList(): string[] {
    return answerList;
  }

  static get allowList(): string[] {
    return allowList;
  }

  static guessIsInAllowList(guess: string): boolean {
    return this.allowList[sortedIndex(this.allowList, guess)] === guess;
  }

  static guessResult(guess: string, answer: string): GuessResult {
    if (guess.toLowerCase() !== guess) {
      return this.guessResult(guess.toLowerCase(), answer);
    }

    const guessResult: GuessResult = new Array(guess.length).fill(
      SingleGuessResult.unknown
    );
    const answerUsed: boolean[] = new Array(answer.length).fill(false);

    // Find all perfect matches first.
    for (let i = 0; i < guess.length; i++) {
      if (i > answer.length) {
        break;
      }
      if (guess[i] === answer[i]) {
        guessResult[i] = SingleGuessResult.perfectMatch;
        answerUsed[i] = true;
      }
    }

    // Then find all partial matches.
    for (let i = 0; i < guess.length; i++) {
      if (guessResult[i] === SingleGuessResult.perfectMatch) {
        continue;
      }
      for (let j = 0; j < answer.length; j++) {
        if (answerUsed[j]) {
          continue;
        }
        if (guess[i] === answer[j]) {
          guessResult[i] = SingleGuessResult.partialMatch;
          answerUsed[j] = true;
          break;
        }
      }
      if (guessResult[i] === SingleGuessResult.unknown) {
        guessResult[i] = SingleGuessResult.noMatch;
      }
    }

    return guessResult;
  }

  static updateAlphabetResult(
    { guess, guessResult }: GuessWithResult,
    alphabetResult: AlphabetResult
  ): AlphabetResult {
    const newAlphabetResult = { ...alphabetResult };
    for (let i = 0; i < guess.length; i++) {
      switch (alphabetResult[guess[i]]) {
        case SingleGuessResult.perfectMatch:
          break;
        case SingleGuessResult.partialMatch:
          if (guessResult?.[i] === SingleGuessResult.perfectMatch) {
            newAlphabetResult[guess[i]] = guessResult[i];
          }
          break;
        default:
          if (guessResult) {
            newAlphabetResult[guess[i]] = guessResult[i];
          }
          break;
      }
    }
    return newAlphabetResult;
  }

  private _answer: string;

  private _guesses: Required<GuessWithResult>[];

  private _alphabetResult: AlphabetResult;

  private _isHard: boolean;

  constructor(isHard: boolean);
  constructor(plainWordleGame: PlainWordleGame);
  constructor(arg1: PlainWordleGame | boolean) {
    if (typeof arg1 !== "boolean") {
      const { answer, guesses, alphabetResult, isHard } = arg1;
      this._answer = answer;
      this._guesses = [...guesses];
      this._alphabetResult = { ...alphabetResult };
      this._isHard = isHard;
    } else {
      const isHard = arg1;
      this._answer = sample(WordleGame.answerList) ?? "cigar";
      this._guesses = [];
      this._alphabetResult = {};
      this._isHard = isHard;
    }
  }

  get guesses(): GuessWithResult[] {
    return this._guesses;
  }

  get alphabetResult(): AlphabetResult {
    return this._alphabetResult;
  }

  get isHard(): boolean {
    return this._isHard;
  }

  get canGuess(): boolean {
    return !this.hasWon && this.guesses.length < WordleGame.maxGuesses;
  }

  get hasWon(): boolean {
    const lastGuess = last(this.guesses);
    return Boolean(lastGuess?.guess === this._answer);
  }

  /**
   * Make a guess.
   * If the guess is valid, return the guess result.
   * If the guess is invalid, return null.
   */
  public makeGuess(guess: string): GuessResult | null {
    if (guess.toLowerCase() !== guess) {
      return this.makeGuess(guess.toLowerCase());
    }

    if (!this.canGuess || !WordleGame.guessIsInAllowList(guess)) {
      return null;
    }

    if (this._isHard) {
      for (let i = 0; i < this._guesses.length; i++) {
        if (
          !isEqual(
            WordleGame.guessResult(this._guesses[i].guess, guess),
            this._guesses[i].guessResult
          )
        ) {
          return null;
        }
      }
    }

    const guessResult = WordleGame.guessResult(guess, this._answer);

    this._alphabetResult = WordleGame.updateAlphabetResult(
      { guess, guessResult },
      this._alphabetResult
    );

    this._guesses.push({ guess, guessResult });
    return guessResult;
  }

  toPlain(): PlainWordleGame {
    return {
      answer: this._answer,
      guesses: [...this._guesses],
      alphabetResult: { ...this._alphabetResult },
      isHard: this._isHard,
    };
  }
}

export default WordleGame;
