export default class FormService {
  data: object | undefined;
  url: string;

  constructor({ url }: { url: string }) {
    this.url = url;
  }
  parser = new DOMParser();

  toJSON() {
    return this.data;
  }

  async get() {
    const html = await fetch(this.url).then((res) => res.text());
    const dom = this.parser.parseFromString(html, "text/html");
    const formData = new FormData(dom.forms[0]);
    this.data = Object.fromEntries(formData.entries());
    return this.data;
  }
  async post(data = this.data) {
    return fetch(this.url, {
      method: "post",
      body: new URLSearchParams(data as Record<string, string>),
    });
    this.data = data;
  }
  async patch(data: object) {
    await this.get();
    if (!this.data) this.data = data;
    else Object.assign(this.data, data);
    return this.post();
  }
}
