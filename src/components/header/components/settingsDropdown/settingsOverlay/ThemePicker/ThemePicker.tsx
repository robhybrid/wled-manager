import React from "react";
import { MoonSunSwitch } from "/src/components/common/MoonSunSwitch/MoonSunSwitch";
import { ThemeType } from "/src/interfaces/interfaces";
import { useAppDispatch, useAppSelector } from "/src/hooks/reduxHooks";
import { setTheme } from "/src/store/slices/themeSlice";
import { setNightMode } from "/src/store/slices/nightModeSlice";

export const ThemePicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const handleClickButton = (theme: ThemeType) => {
    dispatch(setTheme(theme));
    dispatch(setNightMode(false));
  };

  return (
    <MoonSunSwitch
      isMoonActive={theme === "dark"}
      onClickMoon={() => handleClickButton("dark")}
      onClickSun={() => handleClickButton("light")}
    />
  );
};
