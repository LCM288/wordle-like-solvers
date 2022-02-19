import React from "react";
import { SingleGuessResult } from "@/app/games/guessResult";
import { GuessCellDiv } from "@/app/utils/wordleStyles";

export type CellAction = () => void;

interface Props {
  item: string;
  result: SingleGuessResult;
  action?: CellAction;
}

const GuessCell = ({
  item,
  result,
  action = () => undefined,
}: Props): React.ReactElement => {
  return (
    <GuessCellDiv
      item={item}
      result={result}
      onClick={(event) => {
        event.stopPropagation();
        action();
      }}
    >
      {item.toUpperCase()}
    </GuessCellDiv>
  );
};

export default GuessCell;
