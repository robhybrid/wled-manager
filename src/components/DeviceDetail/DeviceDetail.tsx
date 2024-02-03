import React from "react";
import { Button, Tag, Space } from "antd";
import { AppContext } from "@/App";
import BuildSelector from "../BuildSelector";
import { action } from "mobx";
import type { Device } from "@/globalStore";
import "./DeviceDetail.scss";

function DeviceDetail() {
  const store = React.useContext(AppContext);
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

  if (!device) return null;
  return (
    <div className="selected-device device-detail" key={device.name}>
      <h1>{device.name}</h1>
      {device.info && (
        <Space className="info">
          <Tag>{device.info.arch}</Tag>
          <Tag>WLED ver:{device.info?.ver}</Tag>
        </Space>
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
  );
}

export default DeviceDetail;
