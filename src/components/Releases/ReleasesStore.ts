import { makeAutoObservable } from "mobx";
import type { Release } from "../../type/github";

export default class ReleasesStore {
  releases: Release[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
    this.fetch();
  }

  async fetch() {
    this.loading = true;
    try {
      const releases = await fetch(
        "https://api.github.com/repos/Aircoookie/WLED/releases"
      ).then((r) => r.json());
      this.releases = releases;
      this.loading = false;
    } catch (e) {
      console.error("could not get latest versions", e);
    }
  }
}
