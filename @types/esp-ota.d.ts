import type { Socket } from "net";

declare module "esp-ota" {
  export = EspOTA;
}

class EspOTA extends EventEmitter {
  filename?: string;
  constructor(
    serverHost = "0.0.0.0",
    serverPort = 0,
    chunkSize = 1460,
    timeout = 10
  );

  on(eventName: string, cb: function): void;
  setPassword(passsword: string): void;
  uploadFirmware(filename: string, address: string, port = 3232): Promise<void>;
  uploadSPIFFS(filename: string, address: string, port = 3232): Promise<void>;
  uploadFile(
    filename: string,
    address: string,
    port = 8266,
    target = EspOTA.U_FLASH
  ): Promise<void>;
  uploadBuffer(
    buffer: Buffer,
    address: string,
    port = 8266,
    target = EspOTA.U_FLASH
  ): Promise<void>;
  getFileInfo(): Promise<string>;
  handleTransfer(socket: Socket, fileInfo: string): Promise<void>;

  static U_FLASH: number;
  static U_SPIFFS: number;
  static FLASH: number;
  static SPIFFS: number;
}
