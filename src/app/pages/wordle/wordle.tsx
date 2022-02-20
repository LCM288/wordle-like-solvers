import React, { useMemo, useCallback, useState } from "react";
import WordleGame from "@/app/games/wordle/wordleGame";
import GuessRow from "@/app/components/wordle/guessRow";
import Keyboard from "@/app/components/wordle/keyboard";
import { range } from "lodash";
import { GuessDiv, WordleDiv } from "@/app/utils/wordleStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWordleGame,
  selectWordleCurrentGuess,
  updateGame,
  updateCurrentGuess,
} from "@/app/redux/wordle/wordle";

const Wordle = (): React.ReactElement => {
  const plainGame = useSelector(selectWordleGame);
  const currentGuess = useSelector(selectWordleCurrentGuess);
  const dispatch = useDispatch();

  const [game, setGame] = useState(() => new WordleGame(plainGame));

  const guesses = useMemo(() => game.guesses, [game]);
  const alphabetResult = useMemo(
    () => game.alphabetResult,
    [game.alphabetResult]
  );
  const combinedGuesses = useMemo(
    () => guesses.concat(game.canGuess ? [{ guess: currentGuess }] : []),
    [guesses, game.canGuess, currentGuess]
  );

  const makeGuess = useCallback(() => {
    const result = game.makeGuess(currentGuess);
    dispatch(updateGame(game.toPlain()));
    if (result) {
      dispatch(updateCurrentGuess(""));
    } else {
      console.log("Invalid guess");
    }
  }, [currentGuess, dispatch, game]);

  const handleKeyDown = useCallback(
    (key: string) => {
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
            updateCurrentGuess(
              currentGuess.substring(0, currentGuess.length - 1)
            )
          );
        }
      }
    },
    [currentGuess, dispatch, makeGuess]
  );

  return (
    <WordleDiv onKeyDown={(event) => handleKeyDown(event.key)} tabIndex={0}>
      <GuessDiv>
        {range(WordleGame.maxGuesses).map((i) => (
          <GuessRow
            key={i}
            guessWithResult={combinedGuesses[i] ?? { guess: "" }}
            length={WordleGame.answerLength}
          />
        ))}
      </GuessDiv>
      <Keyboard alphabetResult={alphabetResult} handleKeyDown={handleKeyDown} />
      {game.isHard && "Hard"}
      <button
        onClick={() => {
          const newGame = new WordleGame(false);
          setGame(newGame);
          dispatch(updateGame(newGame.toPlain()));
        }}
      >
        New Game
      </button>
      <button
        onClick={() => {
          const newGame = new WordleGame(true);
          setGame(newGame);
          dispatch(updateGame(newGame.toPlain()));
        }}
      >
        New Hard Game
      </button>
    </WordleDiv>
  );
};

export default Wordle;
