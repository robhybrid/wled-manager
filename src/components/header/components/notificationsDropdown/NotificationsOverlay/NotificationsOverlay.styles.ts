import styled from "styled-components";
import { BaseButton } from "/src/components/common/BaseButton/BaseButton";
import { media } from "/src/styles/themes/constants";
import { BaseDivider } from "/src/components/common/BaseDivider/BaseDivider";
import { BaseTypography } from "/src/components/common/BaseTypography/BaseTypography";

export const NoticesOverlayMenu = styled.div`
  max-width: 15rem;

  @media only screen and ${media.md} {
    max-width: 25rem;
  }
`;

export const SplitDivider = styled(BaseDivider)`
  margin: 0 0.5rem;
`;

export const LinkBtn = styled(BaseButton)`
  &.ant-btn {
    padding: 0;
    font-size: 0.875rem;
    height: unset;
    line-height: unset;
  }
`;

export const Btn = styled(BaseButton)`
  width: 100%;
`;

export const Text = styled(BaseTypography.Text)`
  display: block;
  text-align: center;
`;
