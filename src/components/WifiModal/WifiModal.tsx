import React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";
import { Button, Modal, Input } from "antd";

import { GlobalStore } from "../../globalStore";

export default observer(function WifiModal({ store }: { store: GlobalStore }) {
  const device = store.selectedDevice;
  const [wifiPassword, setWifiPassword] = React.useState(store.wifiPassword);
  const [deviceName, setDeviceName] = React.useState(device?.name);

  const ok = action(async () => {
    if (store.connectingDevice) return;
    device.name = deviceName;
    if (wifiPassword) store.wifiPassword = wifiPassword;
    await store.connectDeviceToNetwork(device);
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
        placeholder={`wifi password for ${store.network?.ssid}`}
        value={wifiPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWifiPassword(e.currentTarget.value)
        }
      />
    </Modal>
  );
});
