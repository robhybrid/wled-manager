import EspOTA from "esp-ota";

export default function otaUpdate({
  filepath,
  host,
  password,
  md5,
}: {
  filepath: string;
  host: string;
  password?: string;
  md5?: string;
}): { esp: EspOTA; transfer: Promise<void> } {
  const esp = new EspOTA(); // Optional arguments in this order: (bindAddress, bindPort, chunkSize, secondsTimeout)

  if (md5) {
  }

  password && esp.setPassword(password);

  const transfer = esp.uploadFile(filepath, host, 3232, EspOTA.FLASH);

  const transer = transfer
    .then(function () {
      console.log("Arduino OTA updated complete.");
    })
    .catch(function (error: Error) {
      console.error("Arduino OTA updated error: ", error);
    });

  return { esp, transfer };
}
