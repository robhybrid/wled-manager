import React, { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { BaseButton } from "/src/components/common/BaseButton/BaseButton";
import { HeaderActionWrapper } from "/src/components/header/Header.styles";
import { SettingsOverlay } from "./settingsOverlay/SettingsOverlay/SettingsOverlay";
import { BasePopover } from "/src/components/common/BasePopover/BasePopover";

export const SettingsDropdown: React.FC = () => {
  const [isOpened, setOpened] = useState(false);

  return (
    <BasePopover
      content={<SettingsOverlay />}
      trigger="click"
      onOpenChange={setOpened}
    >
      <HeaderActionWrapper>
        <BaseButton
          type={isOpened ? "ghost" : "text"}
          icon={<SettingOutlined />}
        />
      </HeaderActionWrapper>
    </BasePopover>
  );
};
