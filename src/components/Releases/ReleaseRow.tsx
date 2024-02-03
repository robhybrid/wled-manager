import React from "react";
import { Release } from "@src/type/github";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export default class ReleaseRow {
  version: string;
  date: string;
  id: number;
  constructor(release: Release) {
    this.id = release.id;
    this.version = release.tag_name;
    this.date = dayjs(release.published_at).format("l");
  }
}
