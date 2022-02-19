import WordleGame from "@/app/games/wordle/wordleGame";
import styled from "styled-components";
import { SingleGuessResult } from "@/app/games/guessResult";
import Colors from "@/app/utils/colors";
import Color from "color";

export const fullHeight = `${(WordleGame.maxGuesses + 3) * 4.5 + 8.5}rem`;

export const mediumHeight = `${(WordleGame.maxGuesses + 3) * 3.375 + 8.25}rem`;

export const minimumHeight = `${(WordleGame.maxGuesses + 3) * 2.25 + 8}rem`;

export const GuessDiv = styled.div`
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

const backgroundColorForResult = (result: SingleGuessResult): Color => {
  switch (result) {
    case SingleGuessResult.unknown:
      return Colors.transparent;
    case SingleGuessResult.noMatch:
      return Colors.greyDarker;
    case SingleGuessResult.partialMatch:
      return Colors.warning.darken(0.3);
    case SingleGuessResult.perfectMatch:
      return Colors.success;
  }
};

export interface GuessCellDivProps {
  item: string;
  result: SingleGuessResult;
}

export const GuessCellDiv = styled.div<GuessCellDivProps>`
  border: 2px solid
    ${(props) =>
      props.result === SingleGuessResult.unknown
        ? props.item
          ? Colors.black.string()
          : Colors.greyLight.string()
        : Colors.transparent.string()};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.result === SingleGuessResult.unknown
      ? Colors.dark.string()
      : Colors.white.string()};
  background-color: ${(props) =>
    backgroundColorForResult(props.result).string()};
  @media (prefers-color-scheme: dark) {
    color: ${Colors.white.string()};
    border-color: ${(props) =>
      props.result === SingleGuessResult.unknown
        ? props.item
          ? Colors.greyLight.string()
          : Colors.greyDark.string()
        : Colors.transparent.string()};
  }
  user-select: none;
  @media (min-height: ${fullHeight}) {
    margin-right: 0.5rem;
    width: 4rem;
    height: 4rem;
    border-radius: 0.5rem;
    font-size: 2rem;
  }
  @media (min-height: ${mediumHeight}) and (max-height: ${fullHeight}) {
    margin-right: 0.375rem;
    width: 3rem;
    height: 3rem;
    border-radius: 0.375rem;
    font-size: 1.5rem;
  }
  @media (max-height: ${mediumHeight}) {
    margin-right: 0.25rem;
    width: 2rem;
    height: 2rem;
    border-radius: 0.25rem;
    font-size: 1rem;
  }
`;

export const WordleDiv = styled.div`
  outline: none;
`;
