import React from "react";
import styled from "styled-components";
import { SingleGuessResult } from "@/app/games/guessResult";
import Colors from "@/app/utils/colors";
import Color from "color";

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
  margin-right: 0.5rem;
  width: 4rem;
  height: 4rem;
  border: 2px solid
    ${(props) =>
      props.result === SingleGuessResult.unknown
        ? props.item
          ? Colors.black.string()
          : Colors.greyLight.string()
        : Colors.transparent.string()};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
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
