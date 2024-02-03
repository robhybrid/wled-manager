import React, { useState } from "react";
import UpdateElectron from "@/components/update";

import { observer } from "mobx-react";
import { action } from "mobx";
import { Button, ConfigProvider, theme, Space } from "antd";
import MainNav from "./components/MainNav";

import globalStore, { GlobalStore, Device } from "./globalStore";

import Wifi from "./components/Wifi";
import WifiModal from "./components/WifiModal/WifiModal";
import "./App.scss";
import DeviceDetail from "./components/DeviceDetail";
import Routes from "./components/Routes";

export const AppContext = React.createContext(globalStore);
export { GlobalStore };

const themeAlgorithm = theme.darkAlgorithm;

interface AppProps {
  store: GlobalStore;
}

function App({ store }: AppProps) {
  return (
    <AppContext.Provider value={store}>
      <ConfigProvider
        theme={{
          algorithm: themeAlgorithm,
        }}
      >
        <div className="app">
          <MainNav />
          <div className="content">
            <Space>
              <Routes />
            </Space>
          </div>
        </div>
      </ConfigProvider>
    </AppContext.Provider>
  );
}

export default observer(App);
