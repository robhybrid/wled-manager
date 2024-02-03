import React from "react";
import { Button } from "antd";
import { WifiOutlined } from "@ant-design/icons";
import { AppContext } from "@/App";
import Networks from "../Networks";

function Wifi() {
  const store = React.useContext(AppContext);
  return (
    <div className="wifi">
      <Button onClick={() => store.scanWifi()} loading={store.scanningWifi}>
        ssid: {store.network?.ssid || "scan"}
        <WifiOutlined />
      </Button>
    </div>
  );
}

export default Wifi;
