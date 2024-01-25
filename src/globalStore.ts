import { makeAutoObservable, action } from "mobx";
import ReleasesStore from "./components/Releases/ReleasesStore";
import WledDevice from "./entity/WledDevice";
// import settings from "electron-settings";
import type { IpcRendererEvent, IpcRenderer } from "electron";
import type { Asset, Release } from "./type/github";
import type { Info } from "./type/wled";

const { ipcRenderer } = window;

class GlobalStore {
  networks: Network[] = [];
  currentNetworks: Network[] = [];
  network?: Network;
  _bonjourServices: Map<string, RemoteService> = new Map();
  selectedDevice: Device | null = null;
  wifiModalOpen = false;
  wifiPassword?: string;
  scanningWifi = false;
  connectingDevice: Promise<void> | null = null;
  deviceInfo = new Map();
  releases = new ReleasesStore();

  constructor() {
    this.subscribeBonjour();
    this.releases?.fetch();
  }

  get devices(): Device[] {
    const services = this.bonjourServices.map((service) => ({
      name: service.name,
      service,
      info: this.deviceInfo.get(service.fqdn),
    }));
    return services;
  }

  get bonjourServices(): RemoteService[] {
    return [...this._bonjourServices.values()];
  }

  async updateBonjour(): Promise<void> {
    await ipcRenderer.invoke("update bonjour");
  }

  async subscribeBonjour(): Promise<void> {
    ipcRenderer.on(
      "bonjour service",
      action(async (event: IpcRendererEvent, message: RemoteService) => {
        this._bonjourServices.set(message.fqdn, message);
        if (!this.deviceInfo.get(message.fqdn)) {
          const deviceInfo = await tryTimes(() =>
            fetch(`http://${message.host}/json/info`).then((r) => r.json())
          );
          this.deviceInfo.set(message.fqdn, deviceInfo);
        }
      })
    );
    ipcRenderer.on(
      "bonjour service down",
      action((event: IpcRendererEvent, message: RemoteService) => {
        // remove the device from the list.
        console.log("bonjour service down", message);
        this.deviceInfo.delete(message.fqdn);
      })
    );
    ipcRenderer.invoke("subscribe bonjour");
  }

  async upgradeDevice({
    device,
    release,
    asset,
  }: {
    device: Device;
    release: Release;
    asset: Asset | undefined;
  }) {
    if (!device.service) return;
    let assetUrl = asset?.browser_download_url || release.tarball_url;
    const deviceUrl = `http://${device.service.host}`;
    let mimeType;
    if (asset) {
      mimeType = asset.content_type || "application/octet-stream";
    } else {
      mimeType = "application/tar+gzip";
    }
    const d = new WledDevice({ url: deviceUrl });

    await d.fetchSettings();
    await ipcRenderer.invoke("upgrade device", {
      deviceUrl,
      assetUrl,
      mimeType,
    });
    await new Promise((r) => setTimeout(r, 2000));
    this._bonjourServices = new Map();
    this.subscribeBonjour();

    // check device upgraded.
    // check settings
    // rollback if necessary (find release for defice version (info))
    // notify complete.
    // reload device window.
  }

  async connectDeviceToNetworkHandle(device: Device): Promise<void> {
    try {
      this.connectingDevice = this.connectDeviceToNetwork(device);
    } catch (e) {
      console.error(e);
    } finally {
      this.connectingDevice = null;
    }
  }

  // async saveDevices() {
  //   for (const device of this.devices) {
  //     await ipcRenderer.invoke("save device", device);
  //   }
  // }
}

export { GlobalStore };

export default new GlobalStore();

async function tryTimes(fn: () => any, times = 10) {
  let failures = 0;
  while (failures < times) {
    try {
      const res = await fn();
      return res;
    } catch (e) {
      console.log(`${fn} failed`, failures);
      failures++;
    }
  }
}

export interface Network {
  mac: string;
  bssid: string;
  ssid: string;
  channel: number;
  frequency: number;
  signal_level: string;
  quality: number;
  security: string;
  security_flags: string[];
}

export interface Device {
  name: string;
  network?: Network;
  service?: RemoteService;
  info?: Info;
  wled?: WledDevice;
}

interface RemoteService extends BaseService {
  referer: RemoteInfo;
  rawTxt: Buffer;
  addresses: string[];
}
interface RemoteInfo {
  address: string;
  family: "IPv4" | "IPv6";
  port: number;
  size: number;
}
interface BaseService {
  name: string;
  fqdn: string;
  host: string;
  port: number;
  type: string;
  protocol: string;
  subtypes: string[];
  txt: { [key: string]: string };
}

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}
