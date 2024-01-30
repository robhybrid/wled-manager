import React from "react";
import { ProfileOverlay } from "../ProfileOverlay/ProfileOverlay";
import { useAppSelector } from "/src/hooks/reduxHooks";
import { useResponsive } from "/src/hooks/useResponsive";
import * as S from "./ProfileDropdown.styles";
import { BasePopover } from "/src/components/common/BasePopover/BasePopover";
import { BaseCol } from "/src/components/common/BaseCol/BaseCol";
import { BaseRow } from "/src/components/common/BaseRow/BaseRow";
import { BaseAvatar } from "/src/components/common/BaseAvatar/BaseAvatar";

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive();

  const user = useAppSelector((state) => state.user.user);

  return user ? (
    <BasePopover content={<ProfileOverlay />} trigger="click">
      <S.ProfileDropdownHeader as={BaseRow} gutter={[10, 10]} align="middle">
        <BaseCol>
          <BaseAvatar src={user.imgUrl} alt="User" shape="circle" size={40} />
        </BaseCol>
        {isTablet && (
          <BaseCol>
            <span>{`${user.firstName} ${user.lastName[0]}`}</span>
          </BaseCol>
        )}
      </S.ProfileDropdownHeader>
    </BasePopover>
  ) : null;
};
