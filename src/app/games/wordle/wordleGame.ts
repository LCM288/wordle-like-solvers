import otherAllowList from "@/app/games/wordle/otherAllowList.json";
import answerList from "@/app/games/wordle/answerList.json";
import { last, sample, sortedIndex } from "lodash";
import { GuessResult, SingleGuessResult } from "@/app/games/guessResult";

export type GuessWithResult = [string, GuessResult];

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

  private _answer: string;

  private _guesses: GuessWithResult[];

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
    return Boolean(lastGuess && lastGuess[0] === this._answer);
  }

  private updateAlphabetResult([guess, guessResult]: GuessWithResult) {
    for (let i = 0; i < guess.length; i++) {
      switch (this._alphabetResult[guess[i]]) {
        case SingleGuessResult.perfectMatch:
          break;
        case SingleGuessResult.partialMatch:
          if (guessResult[i] === SingleGuessResult.perfectMatch) {
            this._alphabetResult[guess[i]] = guessResult[i];
          }
          break;
        default:
          this._alphabetResult[guess[i]] = guessResult[i];
          break;
      }
    }
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

    if (
      !this.canGuess ||
      WordleGame.allowList[sortedIndex(WordleGame.allowList, guess)] !== guess
    ) {
      return null;
    }

    const answer = this._answer;
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

    this.updateAlphabetResult([guess, guessResult]);

    this.guesses.push([guess, guessResult]);
    return guessResult;
  }
}

export default WordleGame;
