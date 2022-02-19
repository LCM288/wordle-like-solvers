import React from "react";
import styled from "styled-components";
import { SingleGuessResult } from "@/app/games/guessResult";
import Colors from "@/app/utils/colors";
import Color from "color";
import { fullHeight, mediumHeight } from "@/app/utils/wordleBreakPoints";

export type CellAction = () => void;

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

interface Props {
  item: string;
  result: SingleGuessResult;
  action?: CellAction;
}

type StyledDivProps = Pick<Props, "item" | "result">;

const StyledDiv = styled.div<StyledDivProps>`
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

const GuessCell = ({
  item,
  result,
  action = () => undefined,
}: Props): React.ReactElement => {
  return (
    <StyledDiv
      item={item}
      result={result}
      onClick={(event) => {
        event.stopPropagation();
        action();
      }}
    >
      {item.toUpperCase()}
    </StyledDiv>
  );
};

export default GuessCell;
