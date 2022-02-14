import React from "react";
import { Menu } from "react-bulma-components";

const AppMenu = (): React.ReactElement => {
  return (
    <Menu>
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
    </Menu>
  );
};

export const WithAppMenu = (
  Element: () => React.ReactElement
): React.ReactElement => {
  return (
    <>
      <AppMenu />
      <Element />
    </>
  );
};

export default AppMenu;
