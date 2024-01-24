import { makeAutoObservable } from "mobx";

export default class NetworkStore {
  showNetworks = false;
  constructor() {
    makeAutoObservable(this);
  }

  toggleShowNetworks() {
    this.showNetworks = !this.showNetworks;
  }
}
