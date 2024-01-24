import React from "react";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { AppContext } from "../App";
import { GlobalStore } from "../globalStore";
import type { Asset, Release } from "../type/github";

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

  const onClick: MenuProps["onClick"] = ({ key }: { key: string }) => {
    const nKey = Number(key);
    let release = releases.find((r) => r.id === nKey);
    let asset;
    if (!release) {
      release = releases.find((r) => {
        asset = r.assets.find((a) => a.id === nKey);
        return !!asset;
      });
    }
    if (!release) throw "the release was not found?";
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
