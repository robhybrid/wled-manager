interface info {
  arch: string;
  brand: string;
  core: string;
  freeheap: number;
  fs: { u: number; t: number; pmt: number };
  pmt: number;
  t: number;
  u: number;
  fxcount: number;
  ip: string;
  leds: LEDs;
  cct: number;
  count: number;
  fps: number;
  lc: number;
  maxpwr: number;
  maxseg: number;
  pwr: number;
  rgbw: boolean;
  seglc: number[];
  wv: number;
  lip: string;
  live: boolean;
  lm: string;
  lwip: number;
  mac: string;
  name: string;
  ndc: number;
  opt: number;
  palcount: number;
  product: string;
  str: boolean;
  udpport: number;
  uptime: number;
  ver: string;
  vid: number;
  wifi: Wifi;
  bssid: string;
  channel: number;
  rssi: -91;
  signal: number;
  ws: number;
}

interface LEDs {
  count: number;
  pwr: number;
  fps: number;
  maxpwr: number;
  maxseg: number;
  seglc: number[];
  lc: number;
  rgbw: boolean;
  wv: number;
  cct: number;
}

interface Wifi {
  bssid: string;
  rssi: number;
  signal: number;
  channel: number;
}
