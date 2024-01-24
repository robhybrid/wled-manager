import React from "react";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { AppContext } from "../App";
import { GlobalStore } from "../globalStore";
import { Asset, Release } from "./Releases/ReleasesStore";

interface Props {
  onChange: ({
    asset,
    release,
  }: {
    asset: Asset | undefined;
    release: Release;
  }) => void;
}
const BuildSelector: React.FC<Props> = ({ onChange }) => {
  const store: GlobalStore = React.useContext(AppContext);

  const menuProps: MenuProps = {};

  const { releases } = store.releases;

  menuProps.items =
    releases?.flatMap((release) => {
      if (!release.assets?.length) return [];
      return [
        {
          key: release.id,
          label: release.name,
          release: release,
        },
        ...release.assets.map((asset) => ({
          key: asset.id,
          label: asset.name,
          asset,
        })),
      ];
    }) || [];

  const onClick: MenuProps["onClick"] = ({ key }: { key: number }) => {
    let release = releases.find((r) => r.id === Number(key));
    let asset;
    if (!release) {
      release = releases.find((r) => {
        asset = r.assets.find((a) => a.id === Number(key));
        return !!asset;
      });
    }
    onChange({ release, asset });
  };
  menuProps.onClick = onClick;

  return (
    <Dropdown menu={menuProps}>
      <Button>Change Build</Button>
    </Dropdown>
  );
};

export default BuildSelector;
