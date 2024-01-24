import { ipcMain, app } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import wifi from "node-wifi";
import Bonjour from "bonjour";
import fetch, { fileFrom, FormData } from "node-fetch";

import path from "node:path";
import fse from "fs-extra";
import fs from "node:fs/promises";
import Downloader from "nodejs-file-downloader";

const bonjour = Bonjour();
wifi.init({
  iface: null,
});

ipcMain.handle("scan wifi", async () => {
  console.log("handle scan wifi");
  const networks = await wifi.scan();
  const current = await wifi.getCurrentConnections();
  return { networks, current };
});

ipcMain.handle("subscribe bonjour", bonjourFind);
ipcMain.handle("update bonjour", bonjourFind);
let browser: Bonjour.Browser;
function bonjourFind(event: IpcMainInvokeEvent) {
  console.log("bonjourFind");
  if (browser) browser.stop();
  browser = bonjour.find({ type: "wled" }, (service) => {
    event.sender.send("bonjour service", service);
  });

  browser.addListener("down", (service) => {
    console.log("bonjour service down", service);
    event.sender.send("bonjour service down", service);
  });
  browser.addListener("error", (e) =>
    console.error("bonjour browser error", e)
  );
}

ipcMain.handle("connect to device", async (event, ssid) => {
  return connectToDevice(ssid);
});

ipcMain.handle("connect to network", async (event, { ssid, password }) => {
  await wifi.connect({ ssid, password });
  let failed = false;
  let connection;
  const timeout = setTimeout(() => {
    failed = true;
  }, 30 * 1000);
  while (!connection) {
    await new Promise((r) => setTimeout(r, 1000));
    const connections = await wifi.getCurrentConnections();
    connection = connections.find((c) => c.ssid === ssid);
    if (connection) {
      clearTimeout(timeout);
      return connection;
    }
    if (failed) throw new Error(`WIFI connection to ${ssid} failed`);
  }
});

ipcMain.handle(
  "upgrade device",
  async (
    event,
    {
      deviceUrl,
      assetUrl,
      mimeType,
    }: { deviceUrl: string; assetUrl: string; mimeType: string }
  ) => {
    try {
      const localFilePath = await downloadBuild({
        assetUrl,
      });
      const url = new URL(deviceUrl);
      const stat = await fs.stat(localFilePath);
      const fileBlob = await fileFrom(localFilePath, mimeType);
      const formData = new FormData();
      formData.append("data", fileBlob, path.basename(localFilePath));
      console.log("start upload");
      const updateUrl = path.join(deviceUrl, "update");
      await fetch(updateUrl, {
        method: "post",
        headers: {
          "Content-Length": stat.size.toString(),
          "Content-Type": "multipart/form-data;",
          Host: url.host,
          Origin: deviceUrl,
          Pragma: "no-cache",
          Referer: updateUrl,
        },
        body: formData,
      });
      console.log("upload complete", localFilePath, deviceUrl);
    } catch (e) {
      console.error("upgrade device failed", e);
    }
  }
);

async function connectToDevice(ssid: string) {
  await wifi.connect({ ssid, password: "wled1234" });
  await new Promise((r) => setTimeout(r, 1000));
  const connections = await wifi.getCurrentConnections();
  if (!connections.find((c) => c.ssid === ssid))
    throw new Error("connection failed");
}

// ipcMain.handle("store device", (event, device) => {
//   return storeDevice(device);
// });
// async function storeDevice(device: Device) {
//   // store.set(`device.${device.name}`, device);
//   console.log(device);
// }

const downloadBuild = async ({ assetUrl }: { assetUrl: string }) => {
  const url = new URL(assetUrl);
  const subPath = path.dirname(url.pathname);
  const fileName = path.basename(url.pathname);
  const directory = path.join(
    app.getPath("appData"),
    "WLED-Manager",
    url.hostname,
    subPath
  );
  console.log("directory", directory);
  const destination = path.resolve(directory, fileName);
  const exsists = await fse.pathExists(destination);
  if (exsists) {
    return destination;
  }
  const downloader = new Downloader({
    url: assetUrl,
    headers: {
      "User-Agent": "wled-manager",
      Accept: "application/vnd.github.raw+json",
    },
    directory,
    onProgress: function (percentage, chunk, remainingSize) {
      console.log("% ", percentage, "Remaining bytes: ", remainingSize);
    },
  });

  await downloader.download();
  console.log("download complete");
  return destination;
};
