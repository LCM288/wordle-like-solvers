import React, { useMemo, useState, useCallback } from "react";
import WordleGame from "@/app/games/wordle/wordleGame";
import GuessRow from "@/app/components/wordle/guessRow";
import Keyboard from "@/app/components/wordle/keyboard";
import useForceUpdate from "@/app/utils/useForceUpdate";
import { range } from "lodash";
import styled from "styled-components";

const StyledDiv = styled.div`
  outline: none;
`;

const Wordle = (): React.ReactElement => {
  const [forceUpdateCount, forceUpdate] = useForceUpdate();
  const [game, setGame] = useState(new WordleGame());
  const guesses = useMemo(() => game.guesses, [game]);
  const alphabetResult = useMemo(() => game.alphabetResult, [game]);
  const [currentGuess, setCurrentGuess] = useState("");
  const combinedGuesses = useMemo(
    () => guesses.concat([[currentGuess, []]]),
    [guesses, currentGuess]
  );
  const makeGuess = useCallback(() => {
    const result = game.makeGuess(currentGuess.toLowerCase());
    if (result) {
      setCurrentGuess("");
      forceUpdate();
    } else {
      console.log("Invalid guess");
    }
  }, [currentGuess, forceUpdate, game]);
  const handleKeyPress = useCallback(
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
          setCurrentGuess(currentGuess.substring(0, currentGuess.length - 1));
        }
      }
    },
    [currentGuess, makeGuess]
  );
  return (
    <StyledDiv onKeyDown={(event) => handleKeyPress(event.key)} tabIndex={0}>
      {range(WordleGame.maxGuesses).map((i) => (
        <GuessRow
          key={i}
          guessWithResult={combinedGuesses[i] ?? ["", []]}
          length={WordleGame.answerLength}
        />
      ))}
      <Keyboard
        key={forceUpdateCount}
        alphabetResult={alphabetResult}
        handleKeyPress={handleKeyPress}
      />
      <button
        onClick={() => {
          setGame(new WordleGame());
        }}
      >
        New Game
      </button>
    </StyledDiv>
  );
};

export default Wordle;
