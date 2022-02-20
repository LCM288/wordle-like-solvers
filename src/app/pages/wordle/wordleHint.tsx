import React, { useMemo, useState, useCallback } from "react";
import { GuessDiv, WordleDiv } from "@/app/utils/wordleStyles";
import WordleSolver from "@/app/solvers/wordle/wordleSolver";
import WordleGame from "@/app/games/wordle/wordleGame";
import { range } from "lodash";
import GuessRow from "@/app/components/wordle/guessRow";
import Keyboard from "@/app/components/wordle/keyboard";
import { SingleGuessResult } from "@/app/games/guessResult";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWordleSolver,
  selectWordleHintCurrentGuess,
  selectWordleHintCurrentResult,
  updateSolver,
  updateCurrentGuess,
  updateCurrentResult,
  updateSolverMode,
  selectWordleHintSolverMode,
} from "@/app/redux/wordle/wordleHint";
import sleep from "@/app/utils/sleep";
import { Columns, Loader, Tabs } from "react-bulma-components";

export const enum SolverMode {
  Default = 0,
  Hard = 1,
  WordleHell = 2,
}

const WordleHint = (): React.ReactElement => {
  const plainSolver = useSelector(selectWordleSolver);
  const currentGuess = useSelector(selectWordleHintCurrentGuess);
  const currentResult = useSelector(selectWordleHintCurrentResult);
  const solverMode = useSelector(selectWordleHintSolverMode);
  const dispatch = useDispatch();

  const [solver, setSolver] = useState(() => new WordleSolver(plainSolver));
  const [loading, setLoading] = useState(false);

  const guesses = useMemo(() => solver.guesses, [solver]);
  const alphabetResult = useMemo(
    () => solver.alphabetResult,
    [solver.alphabetResult]
  );
  const combinedGuesses = useMemo(
    () => guesses.concat([{ guess: currentGuess, guessResult: currentResult }]),
    [guesses, currentGuess, currentResult]
  );
  const guessesInformation = useMemo(() => {
    switch (solverMode) {
      case SolverMode.Hard:
        return solver.hardModeGuessesInformation.slice(0, 10);
      case SolverMode.WordleHell:
        return solver.hardModeGuessesInformation.slice(-10).reverse();
      case SolverMode.Default:
      default:
        return solver.guessesInformation.slice(0, 10);
    }
  }, [
    solver.guessesInformation,
    solver.hardModeGuessesInformation,
    solverMode,
  ]);

  const makeGuess = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    await sleep(10);
    const success = await solver.addGuess({
      guess: currentGuess,
      guessResult: currentResult,
    });
    dispatch(updateSolver(solver.toPlain()));
    if (success) {
      dispatch(updateCurrentGuess(""));
      dispatch(updateCurrentResult([]));
    } else {
      console.log("Invalid guess");
    }
    setLoading(false);
  }, [currentGuess, currentResult, dispatch, loading, solver]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (loading) {
        return;
      }
      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        if (currentGuess.length < WordleGame.answerLength) {
          dispatch(updateCurrentGuess(currentGuess + key));
        }
      } else if (key === "Enter") {
        if (currentGuess.length === WordleGame.answerLength) {
          makeGuess();
        }
      } else if (key === "Escape" || key === "Backspace" || key === "Delete") {
        if (currentGuess.length > 0) {
          dispatch(
            updateCurrentResult(currentResult.slice(0, currentGuess.length - 1))
          );
          dispatch(
            updateCurrentGuess(
              currentGuess.substring(0, currentGuess.length - 1)
            )
          );
        }
      }
    },
    [currentGuess, currentResult, dispatch, loading, makeGuess]
  );

  const toggleGuessResult = useCallback(
    (i: number) => {
      if (loading) {
        return;
      }
      const newCurrentResult = [...currentResult];
      switch (currentResult[i]) {
        case SingleGuessResult.noMatch:
          newCurrentResult[i] = SingleGuessResult.partialMatch;
          break;
        case SingleGuessResult.partialMatch:
          newCurrentResult[i] = SingleGuessResult.perfectMatch;
          break;
        default:
          newCurrentResult[i] = SingleGuessResult.noMatch;
          break;
      }
      dispatch(updateCurrentResult(newCurrentResult));
    },
    [currentResult, dispatch, loading]
  );

  const rowActions = useMemo(
    () => range(WordleGame.answerLength).map((i) => () => toggleGuessResult(i)),
    [toggleGuessResult]
  );

  return (
    <WordleDiv onKeyDown={(event) => handleKeyDown(event.key)} tabIndex={0}>
      <Columns multiline={false} centered breakpoint="mobile" className="mb-0">
        <Columns.Column narrow>
          <div>
            {solver.entropyHistory.map((entropy, i) => (
              <div key={i}>{entropy}</div>
            ))}
          </div>
          <div>{solver.possibleAnswers.length}</div>
          {solver.possibleAnswers.slice(0, 10).map((answer, i) => (
            <div key={i}>{answer}</div>
          ))}
        </Columns.Column>
        <Columns.Column narrow className="mb-0 pb-0">
          <GuessDiv>
            {range(WordleGame.maxGuesses).map((i) => (
              <GuessRow
                key={i}
                guessWithResult={combinedGuesses[i] ?? { guess: "" }}
                length={WordleGame.answerLength}
                actions={i === solver.guesses.length ? rowActions : undefined}
              />
            ))}
          </GuessDiv>
        </Columns.Column>
        <Columns.Column narrow>
          {loading && <Loader />}
          <Tabs>
            <Tabs.Tab
              active={solverMode === SolverMode.Default}
              onClick={() => dispatch(updateSolverMode(SolverMode.Default))}
            >
              Default
            </Tabs.Tab>
            <Tabs.Tab
              active={solverMode === SolverMode.Hard}
              onClick={() => dispatch(updateSolverMode(SolverMode.Hard))}
            >
              Hard
            </Tabs.Tab>
            <Tabs.Tab
              active={solverMode === SolverMode.WordleHell}
              onClick={() => dispatch(updateSolverMode(SolverMode.WordleHell))}
            >
              WordleHell
            </Tabs.Tab>
          </Tabs>
          {guessesInformation.map(({ guess, expectedEntropy }, i) => (
            <div key={i}>
              {guess} {expectedEntropy}
            </div>
          ))}
        </Columns.Column>
      </Columns>
      <Keyboard alphabetResult={alphabetResult} handleKeyDown={handleKeyDown} />
      <button
        onClick={() => {
          const newSolver = new WordleSolver();
          setSolver(newSolver);
          dispatch(updateSolver(newSolver.toPlain()));
        }}
      >
        New Game
      </button>
    </WordleDiv>
  );
};

export default WordleHint;
