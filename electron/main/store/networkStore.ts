import { safeStorage } from "electron";
import userStore from "./userStore";

const key = "wifiNetworks";

const encrypt = (val: string) =>
  safeStorage.encryptString(val).toString("base64");
const decrypt = (encrypted: string) =>
  safeStorage.decryptString(Buffer.from(encrypted, "base64"));

const networkStore = {
  available: safeStorage.isEncryptionAvailable(),
  save: async (ssid: string, password = null) => {
    if (!networkStore.available)
      return console.error("netowrk not saved, encryption is not available.");
    const safeSSID = encrypt(ssid);
    const safePassword = password && encrypt(password);
    let networks = (await networkStore.load()) as WifiNetwork[];
    networks = networks.filter((n) => n.ssid !== safeSSID);
    networks.push({ ssid: safeSSID, password: safePassword });
    userStore.set(key, networks);
  },
  load: async () => {
    if (!networkStore.available) return [];
    return userStore.get(key, []);
  },
  getPassword: async (ssid: string) => {
    const networks = (await networkStore.load()) as WifiNetwork[];
    const safeSSID = encrypt(ssid);
    const safePassword = networks.find((n) => n.ssid === safeSSID)?.ssid;
    if (!safePassword) return safePassword;
    return decrypt(safePassword);
  },
};

export default networkStore;

interface WifiNetwork {
  ssid: string;
  password: string | null;
}
