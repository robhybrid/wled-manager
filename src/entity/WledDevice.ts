import FormService from "../api/FormService";

export default class WledDevice {
  forms = ["wifi", "leds", "ui", "sync", "time" /*'um', 'sec'*/];
  url: string;
  settings: Record<string, FormService> = {};
  presets: any;

  constructor({ url }: { url: string }) {
    this.url = url;
    this.forms.forEach((endpoint) => {
      this.settings[endpoint] = new FormService({
        url: `${this.url}/settings/${endpoint}`,
      });
    });
  }
  async fetchSettings() {
    const settingsEntries = [...Object.entries(this.settings)];
    const res: object[] = await Promise.all(
      settingsEntries.map(async ([key, service]) => {
        const setting = await service.get();
        return { [key]: setting };
      })
    );
    this.presets = await fetch(`${this.url}/presets.json`).then((r) => r.json);
    return Object.assign({}, ...res);
  }

  async loadSettings(settings: Record<string, object>) {
    const settingsEntries = [...Object.entries(settings)];
    await Promise.all(
      settingsEntries.map(([key, data]: [string, object]) =>
        this.settings[key]?.post(data)
      )
    );
  }
}
