import React from "react";
import { observer, useLocalObservable } from "mobx-react";
import _, { orderBy } from "lodash";
import type { Network, Device } from "../../globalStore";
import { WifiOutlined } from "@ant-design/icons";
import { action } from "mobx";

import WifiModal from "@/components/WifiModal/WifiModal";

import { Button } from "antd";

import { AppContext } from "@/App";
import NetworkStore from "./NetworkStore";

function Networks() {
  const globalStore = React.useContext(AppContext);
  const store = useLocalObservable(() => new NetworkStore());

  let { networks } = store;
  networks = _.chain(networks)
    .filter((n: Network) => n.frequency < 3000)
    .orderBy("quality", "desc")
    .uniqBy("ssid")
    .value();
  if (!store.showNetworks) {
    networks = networks.filter(
      (n: Network) =>
        n.ssid.match(/WLED/i) ||
        (n.security_flags.length === 1 &&
          n.security_flags.includes("(PSK/AES,TKIP/TKIP)")) ||
        n.frequency === 2412
    );
  }

  const connectDeviceToNetwork = action((n: Network | undefined) => {
    if (!n || !store.priamryNetwork) return;
    if (store.wifiPassword) store.connectDeviceToNetwork(n, n.ssid);
    else store.wifiModalOpen = true;
  });

  return (
    <div className="networks">
      <Button onClick={() => store.scanWifi()} loading={store.scanningWifi}>
        {store.priamryNetwork?.ssid || "scan"}
        <WifiOutlined />
      </Button>
      <Button
        loading={store.scanningWifi}
        onClick={() => store.toggleShowNetworks()}
      >
        All
      </Button>
      {networks?.map((n) => (
        <Button
          key={n.ssid}
          onClick={() => store.selectNetwork(n)}
          type={n === store.selectedNetwork ? "primary" : "default"}
        >
          {n.ssid} {n.signal_level}db {n.frequency}Mhz
        </Button>
      ))}

      {store.selectedNetwork && (
        <div className="actions">
          <Button onClick={() => connectDeviceToNetwork(store.selectedNetwork)}>
            connect device to network
          </Button>
          <Button onClick={() => store.connectToNetwork(store.selectedNetwork)}>
            connect Wifi to {store.selectedNetwork.ssid}
          </Button>
        </div>
      )}
      <WifiModal store={store} key={store.selectedNetwork?.ssid} />
    </div>
  );
}

export default observer(Networks);
