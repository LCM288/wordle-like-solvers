import React, { useState } from "react";
import { Menu, Button, Columns, Section } from "react-bulma-components";
import styled from "styled-components";

interface Props {
  className?: string;
}

const StyledMenu = styled(Menu)``;

const AppMenu = ({ className }: Props): React.ReactElement => {
  const [expended, setExpended] = useState(true);
  return (
    <StyledMenu className={className}>
      <Menu.List title="Menu List 1" textColor="dark">
        <Menu.List.Item>Menu Item A</Menu.List.Item>
        <Menu.List.Item>Menu Item B</Menu.List.Item>
      </Menu.List>

      <Menu.List title="Menu List 2">
        <Menu.List.Item>Menu Item C</Menu.List.Item>
        <Menu.List.Item active>
          <Menu.List title="Menu Item D List Active">
            <Menu.List.Item>Menu Item E</Menu.List.Item>
            <Menu.List.Item active>Menu Item F Active</Menu.List.Item>
          </Menu.List>
        </Menu.List.Item>
      </Menu.List>
      <Menu.List.Item>
        <Button onClick={() => setExpended(!expended)}>
          {expended ? "Collapse" : "Expand"}
        </Button>
      </Menu.List.Item>
    </StyledMenu>
  );
};

export const WithAppMenu = (
  Element: () => React.ReactElement
): React.ReactElement => {
  return (
    <Section>
      <Columns multiline={false} breakpoint="mobile">
        <Columns.Column narrow>
          <AppMenu />
        </Columns.Column>
        <Columns.Column>
          <Element />
        </Columns.Column>
      </Columns>
    </Section>
  );
};

export default AppMenu;
