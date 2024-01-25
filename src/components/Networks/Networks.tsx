import React from "react";
import { observer } from "mobx-react";

import { Button } from "antd";

import { AppContext, GlobalStore } from "@/App";
import NetworkStore from "./NetworkStore";

function Networks() {
  const globalStore = React.useContext(AppContext);
  const store = React.useMemo(() => new NetworkStore(), []);
  return (
    <div className="networks">
      <Button
        loading={globalStore.scanningWifi}
        onClick={() => store.toggleShowNetworks()}
      >
        Neworks
      </Button>
      {store.showNetworks &&
        [...new Set(globalStore.networks.map((n) => n.ssid))].map((ssid) => (
          <div
            key={ssid}
            className={
              globalStore.currentNetworks.find((n) => n.ssid === ssid)
                ? "connected"
                : ""
            }
          >
            ssid: {ssid}
          </div>
        ))}
    </div>
  );
}

export default observer(Networks);
