import React from "react";
import Networks from "../Networks";
import { AppContext } from "@/App";
import UpdateElectron from "@/components/update";
import { Button } from "antd";
import { Device } from "@/globalStore";
import DeviceDetail from "@/components/DeviceDetail";
import { action } from "mobx";
import { observer } from "mobx-react";
import Releases from "../Releases";

function Routes() {
  const store = React.useContext(AppContext);
  const { route } = store;

  const selectDevice = action((device: Device) => {
    store.selectedDevice = device;
  });
  const device = store.selectedDevice;

  if (route === "networks") return <Networks />;
  if (route === "builds") return <Releases store={store.releases} />;
  return (
    <>
      <div className="actions">
        {store.network && (
          <Button onClick={() => store.updateBonjour()}>find devices</Button>
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
      <UpdateElectron />
    </>
  );
}

export default observer(Routes);
