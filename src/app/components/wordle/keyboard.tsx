import React, { useMemo } from "react";
import styled from "styled-components";
import GuessRow from "@/app/components/wordle/guessRow";
import { AlphabetResult } from "@/app/games/wordle/wordleGame";
import _ from "lodash";

const KeyboardDiv = styled.div`
  width: max-content;
  margin: auto;
`;

interface RowDivProps {
  row: number;
}

const RowDiv = styled.div<RowDivProps>`
  margin: auto;
  width: max-content;
`;

interface Props {
  /** The best result of the 26 alphabets */
  alphabetResult: AlphabetResult;
  handleKeyDown: (key: string) => void;
}

const Keyboard = ({
  alphabetResult,
  handleKeyDown,
}: Props): React.ReactElement => {
  const keyboardLayout = useMemo(
    () => ["QWERTYUIOP", "ASDFGHJKL", "⌫ZXCVBNM⏎"],
    []
  );
  const guessResultList = useMemo(
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
          .map((c) => {
            switch (c) {
              case "⌫":
                return () => handleKeyDown("Backspace");
              case "⏎":
                return () => handleKeyDown("Enter");
              default:
                return () => handleKeyDown(c);
            }
          })
          .value()
      ),
    [keyboardLayout, handleKeyDown]
  );
  return (
    <KeyboardDiv>
      {keyboardLayout.map((row, i) => (
        <RowDiv key={i} row={i}>
          <GuessRow
            guessWithResult={{ guess: row, guessResult: guessResultList[i] }}
            length={row.length}
            actions={actions[i]}
          />
        </RowDiv>
      ))}
    </KeyboardDiv>
  );
};

export default Keyboard;
