import React, { useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { BaseButton } from "/src/components/common/BaseButton/BaseButton";
import { BaseBadge } from "/src/components/common/BaseBadge/BaseBadge";
import { NotificationsOverlay } from "/src/components/header/components/notificationsDropdown/NotificationsOverlay/NotificationsOverlay";
import {
  notifications as fetchedNotifications,
  Notification,
} from "/src/api/notifications.api";
import { HeaderActionWrapper } from "/src/components/header/Header.styles";
import { BasePopover } from "/src/components/common/BasePopover/BasePopover";

export const NotificationsDropdown: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(fetchedNotifications);
  const [isOpened, setOpened] = useState(false);

  return (
    <BasePopover
      trigger="click"
      content={
        <NotificationsOverlay
          notifications={notifications}
          setNotifications={setNotifications}
        />
      }
      onOpenChange={setOpened}
    >
      <HeaderActionWrapper>
        <BaseButton
          type={isOpened ? "ghost" : "text"}
          icon={
            <BaseBadge dot>
              <BellOutlined />
            </BaseBadge>
          }
        />
      </HeaderActionWrapper>
    </BasePopover>
  );
};
