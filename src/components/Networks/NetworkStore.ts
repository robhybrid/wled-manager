import { makeAutoObservable } from "mobx";
import type { Network } from "src/globalStore";

const { ipcRenderer } = window;

export default class NetworkStore {
  showNetworks = false;
  selectedNetwork?: Network;
  wifiPassword?: string;
  wifiModalOpen = false;
  currentNetworks: Network[] = [];
  priamryNetwork?: Network;
  scanningWifi = false;
  connectingDevice?: Promise<string>;
  networks: Network[] = [];

  constructor() {
    makeAutoObservable(this);
    this.scanWifi();
  }

  toggleShowNetworks() {
    this.showNetworks = !this.showNetworks;
  }
  selectNetwork = (n: Network) => {
    if (this.selectedNetwork === n) this.selectedNetwork = undefined;
    else this.selectedNetwork = n;
  };

  async scanWifi(): Promise<void> {
    if (this.scanningWifi || this.connectingDevice) return;
    this.scanningWifi = true;
    const { networks, current } = await ipcRenderer.invoke("scan wifi");
    this.scanningWifi = false;
    this.networks = networks;
    this.currentNetworks = current;
    if (current.length) {
      this.priamryNetwork = current[0];
    }
  }

  async connectToNetwork(network: Network | undefined): Promise<void> {
    if (!network) return;
    const { ssid } = network;
    let password = network.security_flags.length ? "wled1234" : undefined;
    await ipcRenderer.invoke("connect to network", {
      ssid,
      password,
    });
  }

  async connectDeviceToNetwork(
    network: Network | undefined,
    name: string
  ): Promise<void> {
    if (!(network && this.priamryNetwork)) return;
    await this.connectToNetwork(network);

    const url = "http://4.3.2.1/settings/wifi?";
    const wifiTxt = await fetch(url).then((res) => res.text());
    const parser = new DOMParser();
    const wifiDom = parser.parseFromString(wifiTxt, "text/xml");
    const formData = new FormData(wifiDom.forms[0]);
    formData.set("CS", this.priamryNetwork.ssid);
    formData.set("CP", this.wifiPassword || "");
    if (network.ssid !== name) {
      formData.set("CM", name.replaceAll(/\W/g, ""));
      formData.set("AS", `${name}`);
    }
    await fetch(url, {
      method: "post",
      body: new URLSearchParams(formData as any),
    });
    await new Promise((r) => setTimeout(r, 200));
    await ipcRenderer.invoke("connect to network", {
      ssid: this.priamryNetwork.ssid,
      password: this.wifiPassword,
    });
  }
}
