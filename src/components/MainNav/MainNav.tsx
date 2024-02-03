import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import "./MainNav.scss";
import { AppContext } from "@/App";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(options: {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
}): MenuItem {
  return options as MenuItem;
}

export default function MainNav() {
  const menuItems = [
    {
      key: "networks",
      label: "Networks",
    },
    {
      key: "devices",
      label: "Devices",
    },
    {
      key: "builds",
      label: "Builds",
    },
  ].map(getItem);

  const globalStore = React.useContext(AppContext);

  return (
    <Menu
      onClick={(item) => globalStore.setRoute(item.key)}
      mode="inline"
      items={menuItems}
      role="navigation"
      aria-label="Main"
      id="main-nav"
      theme="dark"
    />
  );
}
