import React, { useState } from "react";
import UpdateElectron from "@/components/update";

import { observer } from "mobx-react";
import { action } from "mobx";
import { Button, ConfigProvider, theme, Tag } from "antd";

import globalStore, { GlobalStore, Device } from "./globalStore";

import Wifi from "./components/Wifi";
import WifiModal from "./components/WifiModal/WifiModal";
import "./App.scss";
import BuildSelector from "./components/BuildSelector";
import DeviceDetail from "./components/DeviceDetail";

export const AppContext = React.createContext(globalStore);
export { GlobalStore };

const themeAlgorithm = theme.darkAlgorithm;

interface AppProps {
  store: GlobalStore;
}

function App({ store }: AppProps) {
  const selectDevice = action((device: Device) => {
    store.selectedDevice = device;
  });
  const device = store.selectedDevice;

  return (
    <AppContext.Provider value={store}>
      <ConfigProvider
        theme={{
          algorithm: themeAlgorithm,
        }}
      >
        <div className="App">
          <Wifi />
          <div className="actions">
            {store.network && (
              <Button onClick={() => store.updateBonjour()}>
                find devices
              </Button>
            )}
          </div>
          <div className="devices">
            {store.devices.map((device: Device) => {
              return (
                <Button onClick={() => selectDevice(device)} key={device.name}>
                  {device.name}
                  {device.info && (
                    <span className="version">{device.info?.ver}</span>
                  )}
                </Button>
              );
            })}
          </div>
          <DeviceDetail />
          <WifiModal store={store} />
          <UpdateElectron />
        </div>
      </ConfigProvider>
    </AppContext.Provider>
  );
}

export default observer(App);
