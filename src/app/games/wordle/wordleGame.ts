import otherAllowList from "@/app/games/wordle/otherAllowList.json";
import answerList from "@/app/games/wordle/answerList.json";
import { last, sample, sortedIndex } from "lodash";
import { GuessResult, SingleGuessResult } from "@/app/games/guessResult";

export type GuessWithResult = {
  guess: string;
  guessResult?: GuessResult;
};

export type AlphabetResult = Record<string, SingleGuessResult>;

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
  ): void {
    for (let i = 0; i < guess.length; i++) {
      switch (alphabetResult[guess[i]]) {
        case SingleGuessResult.perfectMatch:
          break;
        case SingleGuessResult.partialMatch:
          if (guessResult?.[i] === SingleGuessResult.perfectMatch) {
            alphabetResult[guess[i]] = guessResult[i];
          }
          break;
        default:
          if (guessResult) {
            alphabetResult[guess[i]] = guessResult[i];
          }
          break;
      }
    }
  }

  private _answer: string;

  private _guesses: Required<GuessWithResult>[];

  private _alphabetResult: AlphabetResult;

  constructor() {
    this._answer = sample(WordleGame.answerList) ?? "cigar";
    this._guesses = [];
    this._alphabetResult = {};
  }

  get guesses(): GuessWithResult[] {
    return this._guesses;
  }

  get alphabetResult(): AlphabetResult {
    return this._alphabetResult;
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

    const guessResult = WordleGame.guessResult(guess, this._answer);

    WordleGame.updateAlphabetResult(
      { guess, guessResult },
      this._alphabetResult
    );

    this.guesses.push({ guess, guessResult });
    return guessResult;
  }
}

export default WordleGame;
