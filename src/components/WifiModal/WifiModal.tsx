import React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";
import { Button, Modal, Input } from "antd";

import NetworkStore from "../Networks/NetworkStore";

export default observer(function WifiModal({ store }: { store: NetworkStore }) {
  const net = store.selectedNetwork;
  const [wifiPassword, setWifiPassword] = React.useState(store.wifiPassword);
  const [deviceName, setDeviceName] = React.useState(net?.ssid);

  const ok = action(async () => {
    if (!(net && deviceName && store.priamryNetwork)) return;
    if (store.connectingDevice) return;
    if (wifiPassword) store.wifiPassword = wifiPassword;
    await store.connectDeviceToNetwork(net, deviceName);
    store.wifiModalOpen = false;
  });
  const cancel = action(() => {
    if (store.connectingDevice) return;
    store.wifiModalOpen = false;
  });

  if (!store.priamryNetwork) store.wifiModalOpen = false;
  return (
    <Modal open={store.wifiModalOpen} onOk={ok} onCancel={cancel}>
      <Input
        placeholder="new device name"
        value={deviceName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDeviceName(e.currentTarget.value)
        }
      />
      <Input.Password
        addonBefore={store.priamryNetwork?.ssid}
        placeholder={`wifi password for ${store.priamryNetwork?.ssid}`}
        value={wifiPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWifiPassword(e.currentTarget.value)
        }
      />
    </Modal>
  );
});
