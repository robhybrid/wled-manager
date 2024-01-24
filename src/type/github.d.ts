export interface Release {
  assets: Asset[];
  assets_url: string;
  body: string;
  created_at: string;
  draft: Boolean;
  html_url: string;
  id: number;
  mentions_count: number;
  name: string;
  node_id: string;
  prerelease: Boolean;
  published_at: string;
  tag_name: string;
  tarball_url: string;
  target_commitish: string;
  upload_url: string;
  url: string;
  zipball_url: string;
}
export interface Asset {
  browser_download_url: string;
  content_type: string;
  created_at: string;
  download_count: number;
  id: number;
  label: string;
  name: string;
  node_id: string;
  size: number;
  state: string;
  updated_at: string;
  // uploader: {login: "github-actions[bot]", id: 41898282, node_id: "MDM6Qm90NDE4OTgyODI=",…}
  url: string;
}
