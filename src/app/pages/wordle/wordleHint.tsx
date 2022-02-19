import React, { useMemo, useState, useCallback } from "react";
import useForceUpdate from "@/app/utils/useForceUpdate";
import { GuessDiv, WordleDiv } from "@/app/utils/wordleStyles";
import WordleSolver from "@/app/solvers/wordle/wordleSolver";
import WordleGame from "@/app/games/wordle/wordleGame";
import { range } from "lodash";
import GuessRow from "@/app/components/wordle/guessRow";
import Keyboard from "@/app/components/wordle/keyboard";
import GuessResult, { SingleGuessResult } from "@/app/games/guessResult";

const WordleHint = (): React.ReactElement => {
  const [forceUpdateCount, forceUpdate] = useForceUpdate();

  const [solver, setSolver] = useState(() => new WordleSolver());
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentResult, setCurrentResult] = useState<GuessResult>([]);

  const guesses = useMemo(() => solver.guesses, [solver]);
  const alphabetResult = useMemo(() => solver.alphabetResult, [solver]);
  const combinedGuesses = useMemo(
    () => guesses.concat([{ guess: currentGuess, guessResult: currentResult }]),
    [guesses, currentGuess, currentResult]
  );

  const makeGuess = useCallback(() => {
    const success = solver.addGuess({
      guess: currentGuess,
      guessResult: currentResult,
    });
    if (success) {
      setCurrentGuess("");
      setCurrentResult([]);
      forceUpdate();
      console.log("Best guesses:", solver.guessesInformation.slice(0, 5));
      console.log("Answers:", solver.possibleAnswers);
    } else {
      console.log("Invalid guess");
    }
  }, [currentGuess, currentResult, forceUpdate, solver]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        if (currentGuess.length < WordleGame.answerLength) {
          setCurrentGuess(currentGuess + key);
        }
      } else if (key === "Enter") {
        if (currentGuess.length === WordleGame.answerLength) {
          makeGuess();
        }
      } else if (key === "Escape" || key === "Backspace" || key === "Delete") {
        if (currentGuess.length > 0) {
          setCurrentResult(currentResult.slice(0, currentGuess.length - 1));
          setCurrentGuess(currentGuess.substring(0, currentGuess.length - 1));
        }
      }
    },
    [currentGuess, currentResult, makeGuess]
  );

  const toggleGuessResult = useCallback(
    (i: number) => {
      let newResult = SingleGuessResult.noMatch;
      switch (currentResult[i]) {
        case SingleGuessResult.noMatch:
          newResult = SingleGuessResult.partialMatch;
          break;
        case SingleGuessResult.partialMatch:
          newResult = SingleGuessResult.perfectMatch;
          break;
        default:
          newResult = SingleGuessResult.noMatch;
          break;
      }
      setCurrentResult([
        ...currentResult.slice(0, i),
        newResult,
        ...currentResult.slice(i + 1),
      ]);
    },
    [currentResult]
  );

  const rowActions = useMemo(
    () => range(WordleGame.answerLength).map((i) => () => toggleGuessResult(i)),
    [toggleGuessResult]
  );

  return (
    <WordleDiv onKeyDown={(event) => handleKeyDown(event.key)} tabIndex={0}>
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
      <Keyboard
        key={forceUpdateCount}
        alphabetResult={alphabetResult}
        handleKeyDown={handleKeyDown}
      />
      <button
        onClick={() => {
          setSolver(new WordleSolver());
        }}
      >
        New Game
      </button>
    </WordleDiv>
  );
};

export default WordleHint;
