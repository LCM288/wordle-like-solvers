import React, { useMemo } from "react";
import styled from "styled-components";
import GuessRow from "@/app/components/wordle/guessRow";
import { AlphabetResult } from "@/app/games/wordle/wordleGame";
import _ from "lodash";

interface StyledDivProps {
  row: number;
}

const StyledDiv = styled.div<StyledDivProps>`
  padding-left: ${(props) => props.row * 2.5}rem;
`;

interface Props {
  /** The best result of the 26 alphabets */
  alphabetResult: AlphabetResult;
  handleKeyPress: (key: string) => void;
}

const Keyboard = ({
  alphabetResult,
  handleKeyPress,
}: Props): React.ReactElement => {
  const keyboardLayout = useMemo(
    () => ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
    []
  );
  const guessResult = useMemo(
    () =>
      keyboardLayout.map((row) =>
        _(row)
          .map((c) => alphabetResult[c.toLowerCase()])
          .value()
      ),
    [keyboardLayout, alphabetResult]
  );
  const actions = useMemo(
    () =>
      keyboardLayout.map((row) =>
        _(row)
          .map((c) => () => handleKeyPress(c))
          .value()
      ),
    [keyboardLayout, handleKeyPress]
  );
  return (
    <>
      {keyboardLayout.map((row, i) => (
        <StyledDiv key={i} row={i}>
          <GuessRow
            guessWithResult={[row, guessResult[i]]}
            length={row.length}
            actions={actions[i]}
          />
        </StyledDiv>
      ))}
    </>
  );
};

export default Keyboard;
