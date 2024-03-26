import { createTheming, defaultCssVariableGenerator } from "../lib";

export const theme = {
  colors: {
    primary: {
      base: "1",
      hover: "2",
      active: "3",
      disabled: "4",
    },
    secondary: {
      base: "5",
      hover: "6",
      active: "7",
      disabled: "8",
    },
    neutral: {
      text: {
        base: "9",
        secondary: "10",
        tertiary: "11",
      },
      background: {
        base: "12",
        container: "13",
        elevated: "14",
      },
    },
  },
  dark: 1,
};

const tokenFamilyNameMap: Record<keyof typeof theme, string> = {
  colors: "color",
  dark: "dark",
};

export const { ThemeProvider, useTheme, getVariablesAsStyles } = createTheming(
  theme,
  {
    initializeVariablesOnHTMLRoot: true,
    cssVariableGenerator: (tokenFamilyKey, tokenPath, tokenValue) =>
      defaultCssVariableGenerator(
        tokenFamilyNameMap[tokenFamilyKey].toLowerCase(),
        tokenPath,
        tokenValue,
      ),
  },
);
