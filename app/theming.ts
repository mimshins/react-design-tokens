import { createTheming } from "../lib";

export const theme = {
  colors: {
    primary: {
      base: "1",
      hover: "2",
      active: "3",
      disabled: "4"
    },
    secondary: {
      base: "5",
      hover: "6",
      active: "7",
      disabled: "8"
    },
    neutral: {
      text: {
        base: "9",
        secondary: "10",
        tertiary: "11"
      },
      background: {
        base: "12",
        container: "13",
        elevated: "14"
      }
    }
  }
};

const tokenFamilyNameMap: Record<keyof typeof theme, string> = {
  colors: "color"
};

export const { ThemeProvider, useTheme } = createTheming<typeof theme>({
  cssVariableGenerator: (tokenFamilyKey, tokenPath, tokenValue) => {
    if (!["string", "number"].includes(typeof tokenValue)) return null;

    const segments = tokenPath
      .split(".")
      .filter(Boolean)
      .map(s => s.toLowerCase());

    return {
      variable: `${tokenFamilyNameMap[tokenFamilyKey].toLowerCase()}${
        segments.length > 0 ? "-".concat(segments.join("-")) : ""
      }`,
      value:
        typeof tokenValue === "number" ? `${tokenValue}px` : String(tokenValue)
    };
  }
});
