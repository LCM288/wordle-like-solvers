import { GuessResult, SingleGuessResult } from "@/app/games/guessResult";
import WordleGame, {
  AlphabetResult,
  GuessWithResult,
} from "@/app/games/wordle/wordleGame";
import { isEqual, sumBy } from "lodash";
import initGuessesInformation from "@/app/solvers/wordle/initGuessesInformation.json";

export interface GuessInformation {
  guess: string;
  expectedEntropy: number;
}

export interface PlainWordleSolver {
  guesses: Required<GuessWithResult>[];
  possibleAnswers: string[];
  possibleAnswersLengthHistory: number[];
  guessesInformation: GuessInformation[];
  hardModeGuessesInformation: GuessInformation[];
  alphabetResult: AlphabetResult;
}

class WordleSolver {
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
        const oldAnswerListLength = possibleAnswers.length;
        const guessResults = possibleAnswers.map((answer) =>
          WordleGame.guessResult(guess, answer)
        );
        const resultCountMap: Record<string, number> = {};
        guessResults.forEach((guessResult) => {
          resultCountMap[guessResult.toString()] =
            (resultCountMap[guessResult.toString()] ?? 0) + 1;
        });
        const expectedEntropy = sumBy(
          Object.values(resultCountMap),
          (newAnswerListLength) =>
            (newAnswerListLength / oldAnswerListLength) *
            Math.log2(oldAnswerListLength / newAnswerListLength)
        );
        return {
          guess,
          expectedEntropy,
        };
      })
      .sort((a, b) => b.expectedEntropy - a.expectedEntropy);
  }

  private _guesses: Required<GuessWithResult>[];

  private _possibleAnswers: string[];

  private _possibleAnswersLengthHistory: number[];

  private _guessesInformation: GuessInformation[];

  private _hardModeGuessesInformation: GuessInformation[];

  private _alphabetResult: AlphabetResult;

  constructor();
  constructor(plainWordleSolver: PlainWordleSolver);
  constructor(plainWordleSolver?: PlainWordleSolver) {
    if (plainWordleSolver) {
      const {
        guesses,
        possibleAnswers,
        possibleAnswersLengthHistory,
        guessesInformation,
        hardModeGuessesInformation,
        alphabetResult,
      } = plainWordleSolver;
      this._guesses = [...guesses];
      this._possibleAnswers = [...possibleAnswers];
      this._possibleAnswersLengthHistory = [...possibleAnswersLengthHistory];
      this._guessesInformation = [...guessesInformation];
      this._hardModeGuessesInformation = [...hardModeGuessesInformation];
      this._alphabetResult = { ...alphabetResult };
    } else {
      this._guesses = [];
      this._possibleAnswers = [...WordleGame.answerList];
      this._possibleAnswersLengthHistory = [this._possibleAnswers.length];
      this._guessesInformation = [...initGuessesInformation];
      this._hardModeGuessesInformation = [...initGuessesInformation];
      this._alphabetResult = {};
    }
  }

  get guesses(): GuessWithResult[] {
    return this._guesses;
  }

  get possibleAnswers(): string[] {
    return this._possibleAnswers;
  }

  get possibleAnswersLengthHistory(): number[] {
    return this._possibleAnswersLengthHistory;
  }

  get entropyHistory(): number[] {
    return this._possibleAnswersLengthHistory.map((len) => Math.log2(len));
  }

  get currentEntropy(): number {
    return Math.log2(this._possibleAnswers.length);
  }

  get guessesInformation(): GuessInformation[] {
    return this._guessesInformation;
  }

  get hardModeGuessesInformation(): GuessInformation[] {
    return this._hardModeGuessesInformation;
  }

  get alphabetResult(): AlphabetResult {
    return this._alphabetResult;
  }

  async addGuess({
    guess,
    guessResult,
  }: Required<GuessWithResult>): Promise<boolean> {
    if (guess.toLowerCase() !== guess) {
      return this.addGuess({ guess: guess.toLowerCase(), guessResult });
    }
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
    this._possibleAnswersLengthHistory.push(this._possibleAnswers.length);
    this._guessesInformation = WordleSolver.generateGuessInformation(
      this._possibleAnswers
    );
    this._hardModeGuessesInformation = this._guessesInformation.filter(
      (guessInformation) => {
        for (let i = 0; i < this._guesses.length; i++) {
          if (
            !isEqual(
              WordleGame.guessResult(
                this._guesses[i].guess,
                guessInformation.guess
              ),
              this._guesses[i].guessResult
            )
          ) {
            return false;
          }
        }
        return true;
      }
    );
    this._alphabetResult = WordleGame.updateAlphabetResult(
      { guess, guessResult },
      this._alphabetResult
    );
    return true;
  }

  toPlain(): PlainWordleSolver {
    return {
      guesses: [...this._guesses],
      possibleAnswers: [...this._possibleAnswers],
      possibleAnswersLengthHistory: [...this._possibleAnswersLengthHistory],
      guessesInformation: [...this._guessesInformation],
      hardModeGuessesInformation: [...this.hardModeGuessesInformation],
      alphabetResult: { ...this._alphabetResult },
    };
  }
}

export default WordleSolver;
