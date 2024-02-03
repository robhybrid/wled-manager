import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "@/App";
import NetworkStore from "./NetworkStore";
import _ from "lodash";
import DataTableView from "../DataTable/DataTable";
import Wifi from "../Wifi";
import WifiModal from "../WifiModal/WifiModal";

function Networks() {
  const globalStore = React.useContext(AppContext);
  const store = React.useMemo(() => new NetworkStore(), []);

  const records = _.uniqBy(globalStore.networks, "ssid").map((network) => {
    const connected = globalStore.currentNetworks.find(
      (n) => n.ssid === network.ssid
    );
    return { ...network, connected };
  });

  return (
    <div className="networks">
      <Wifi />
      <WifiModal store={store} />
      <DataTableView records={records} idKey="ssid" />
    </div>
  );
}

export default observer(Networks);
