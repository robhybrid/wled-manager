import React, { useState } from "react";
import UpdateElectron from "@/components/update";

import { observer } from "mobx-react";
import { action } from "mobx";
import { Button, ConfigProvider, theme, Tag } from "antd";
import {
  LoadingOutlined,
  ReloadOutlined,
  WifiOutlined,
} from "@ant-design/icons";

import globalStore, { GlobalStore, Device } from "./globalStore";

import WifiModal from "./components/WifiModal/WifiModal";
import Networks from "./components/Networks";
import "./App.scss";
import BuildSelector from "./components/BuildSelector";

export const AppContext = React.createContext(globalStore);
export { GlobalStore };

const themeAlgorithm = theme.darkAlgorithm;

interface AppProps {
  store: GlobalStore;
}

function App({ store }: AppProps) {
  const [count, setCount] = useState(0);

  const selectDevice = action((device: Device) => {
    store.selectedDevice = device;
  });
  const device = store.selectedDevice;

  const connectDeviceToNetwork = action((device: Device) => {
    if (store.wifiPassword) store.connectDeviceToNetwork(device);
    else store.wifiModalOpen = true;
  });

  const connectToDevice = action((device: Device) => {
    if (device.service) {
      open(`http://${device.service.host}`);
    } else if (device.network) {
      store.connectToDevice(device);
    }
  });

  return (
    <AppContext.Provider value={store}>
      <ConfigProvider
        theme={{
          algorithm: themeAlgorithm,
        }}
      >
        <div className="App">
          <div className="wifi">
            <Button
              onClick={() => store.scanWifi()}
              loading={store.scanningWifi}
            >
              ssid: {store.network?.ssid || "scan"}
              <WifiOutlined />
            </Button>
            <Networks />
          </div>
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
          {device && (
            <div className="selected-device" key={device.name}>
              <h1>{device.name}</h1>
              {device.info && (
                <div className="info">
                  <Tag>{device.info.arch}</Tag>
                  <Tag>WLED ver:{device.info?.ver}</Tag>
                </div>
              )}

              {device.service ? (
                <iframe
                  className="device-window"
                  src={`http://${device.service.host}`}
                />
              ) : (
                <div className="actions">
                  <Button onClick={() => connectDeviceToNetwork(device)}>
                    connect device to network
                  </Button>
                  <Button onClick={() => connectToDevice(device)}>
                    connect Wifi to {device.network?.ssid}
                  </Button>
                </div>
              )}

              {store.releases && (
                <BuildSelector
                  deviceInfo={device.info}
                  onChange={({ release, asset }) => {
                    console.log("BuildSelector onChange", { release, asset });
                    store.upgradeDevice({ release, asset, device });
                  }}
                />
              )}
            </div>
          )}
          <WifiModal store={store} />
          <UpdateElectron />
        </div>
      </ConfigProvider>
    </AppContext.Provider>
  );
}

export default observer(App);
