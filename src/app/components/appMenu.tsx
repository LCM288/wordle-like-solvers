import React from "react";
import { Menu, Columns, Section } from "react-bulma-components";
import styled from "styled-components";
import { useLinkClickHandler, useLocation } from "react-router-dom";

interface Props {
  className?: string;
}

const StyledMenu = styled(Menu)`
  min-width: 20vh;
`;

const wordlePath = "/wordle";
const wordleHintPath = "/wordle/hint";

const AppMenu = ({ className }: Props): React.ReactElement => {
  const location = useLocation();
  const toWordle = useLinkClickHandler(wordlePath);
  const toWordleHint = useLinkClickHandler(wordleHintPath);
  return (
    <StyledMenu className={className}>
      <Menu.List title="Wordle" textColor="dark">
        <Menu.List.Item
          onClick={toWordle}
          active={location.pathname === wordlePath}
        >
          Game
        </Menu.List.Item>
        <Menu.List.Item
          onClick={toWordleHint}
          active={location.pathname === wordleHintPath}
        >
          Solver
        </Menu.List.Item>
      </Menu.List>
    </StyledMenu>
  );
};

export const WithAppMenu = (
  Element: React.ReactElement
): React.ReactElement => {
  return (
    <Section>
      <Columns multiline={false} breakpoint="mobile">
        <Columns.Column narrow>
          <AppMenu />
        </Columns.Column>
        <Columns.Column>{Element}</Columns.Column>
      </Columns>
    </Section>
  );
};

export default AppMenu;
