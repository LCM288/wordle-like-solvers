import React, { useMemo, useState, useCallback } from "react";
import WordleGame from "@/app/games/wordle/wordleGame";
import GuessRow from "@/app/components/wordle/guessRow";
import Keyboard from "@/app/components/wordle/keyboard";
import useForceUpdate from "@/app/utils/useForceUpdate";
import { range } from "lodash";
import styled from "styled-components";
import { fullHeight, mediumHeight } from "@/app/utils/wordleBreakPoints";

const StyledDiv = styled.div`
  outline: none;
`;

const GuessDiv = styled.div`
  width: max-content;
  margin: auto;
  @media (min-height: ${fullHeight}) {
    margin-bottom: 2rem;
  }
  @media (min-height: ${mediumHeight}) and (max-height: ${fullHeight}) {
    margin-bottom: 1.5rem;
  }
  @media (max-height: ${mediumHeight}) {
    margin-bottom: 1rem;
  }
`;

const Wordle = (): React.ReactElement => {
  const [forceUpdateCount, forceUpdate] = useForceUpdate();
  const [game, setGame] = useState(new WordleGame());
  const guesses = useMemo(() => game.guesses, [game]);
  const alphabetResult = useMemo(() => game.alphabetResult, [game]);
  const [currentGuess, setCurrentGuess] = useState("");
  const combinedGuesses = useMemo(
    () => guesses.concat(game.canGuess ? [{ guess: currentGuess }] : []),
    [guesses, game.canGuess, currentGuess]
  );
  const makeGuess = useCallback(() => {
    const result = game.makeGuess(currentGuess);
    if (result) {
      setCurrentGuess("");
      forceUpdate();
    } else {
      console.log("Invalid guess");
    }
  }, [currentGuess, forceUpdate, game]);
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
          setCurrentGuess(currentGuess.substring(0, currentGuess.length - 1));
        }
      }
    },
    [currentGuess, makeGuess]
  );
  return (
    <StyledDiv onKeyDown={(event) => handleKeyDown(event.key)} tabIndex={0}>
      <GuessDiv>
        {range(WordleGame.maxGuesses).map((i) => (
          <GuessRow
            key={i}
            guessWithResult={combinedGuesses[i] ?? { guess: "" }}
            length={WordleGame.answerLength}
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
          setGame(new WordleGame());
        }}
      >
        New Game
      </button>
    </StyledDiv>
  );
};

export default Wordle;
