import React from "react";
import { SingleGuessResult } from "@/app/games/guessResult";
import { GuessWithResult } from "@/app/games/wordle/wordleGame";
import { range } from "lodash";
import GuessCell, { CellAction } from "@/app/components/wordle/guessCell";
import styled from "styled-components";

export type CellActions = CellAction[];

interface Props {
  guessWithResult: GuessWithResult;
  length: number;
  actions?: CellActions;
}

const StyledDiv = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const GuessRow = ({
  guessWithResult,
  length,
  actions = [],
}: Props): React.ReactElement => {
  return (
    <StyledDiv>
      {range(length).map((i) => (
        <GuessCell
          key={i}
          item={guessWithResult[0][i] ?? ""}
          result={guessWithResult[1][i] ?? SingleGuessResult.unknown}
          action={actions[i]}
        />
      ))}
    </StyledDiv>
  );
};

export default GuessRow;
