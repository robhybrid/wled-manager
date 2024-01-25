import React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";
import { Button, Modal, Input } from "antd";

import NetworkStore from "../Networks/NetworkStore";

export default observer(function WifiModal({ store }: { store: NetworkStore }) {
  const net = store.selectedNetwork;
  if (!net) {
    store.wifiModalOpen = false;
    return null;
  }
  const [wifiPassword, setWifiPassword] = React.useState(store.wifiPassword);
  const [deviceName, setDeviceName] = React.useState(net.ssid);

  const ok = action(async () => {
    if (!(net && deviceName)) return;
    if (store.connectingDevice) return;
    if (wifiPassword) store.wifiPassword = wifiPassword;
    await store.connectDeviceToNetwork(net, deviceName);
    store.wifiModalOpen = false;
  });
  const cancel = action(() => {
    if (store.connectingDevice) return;
    store.wifiModalOpen = false;
  });
  return (
    <Modal open={store.wifiModalOpen} onOk={ok} onCancel={cancel}>
      {store.currentNetworks?.map((n) => (
        <Button key={n.ssid}>{n.ssid}</Button>
      ))}
      <Input
        placeholder="new device name"
        value={deviceName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDeviceName(e.currentTarget.value)
        }
      />
      <Input.Password
        placeholder={`wifi password for ${store.priamryNetwork?.ssid}`}
        value={wifiPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWifiPassword(e.currentTarget.value)
        }
      />
    </Modal>
  );
});
