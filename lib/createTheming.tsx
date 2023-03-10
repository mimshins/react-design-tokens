/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { deepMerge, isPlainObject } from "./helpers";

type AnyObject = Record<keyof any, any>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends AnyObject ? DeepPartial<T[P]> : T[P];
};

interface ThemeProviderProps<T> {
  children: React.ReactNode;
  theme: DeepPartial<T>;
}

interface CSSVariableProviderProps<T> {
  children: React.ReactNode;
  theme: DeepPartial<T>;
}

interface ThemingConfig<T> {
  cssVariableGenerator?: (
    tokenFamilyKey: keyof T,
    tokenPath: string,
    tokenValue: unknown
  ) => { variable: string; value: string } | null;
}

export const defaultCssVariableGenerator = (
  tokenFamilyKey: string,
  tokenPath: string,
  tokenValue: unknown
) => {
  if (!["string", "number"].includes(typeof tokenValue)) return null;

  const segments = tokenPath
    .split(".")
    .filter(Boolean)
    .map(s => s.toLowerCase());

  return {
    variable: `${tokenFamilyKey.toLowerCase()}${
      segments.length > 0 ? "-".concat(segments.join("-")) : ""
    }`,
    value:
      typeof tokenValue === "number" ? `${tokenValue}px` : String(tokenValue)
  };
};

const createTheming = <T extends AnyObject>(config?: ThemingConfig<T>) => {
  const { cssVariableGenerator = defaultCssVariableGenerator } = config ?? {};

  const ThemeContext = React.createContext<T | null>(null);

  const useTheme = (): T | null => React.useContext(ThemeContext);

  const generateCssVariables = (
    theme: AnyObject,
    path: string[] = []
  ): Array<{ variable: string; value: string } | null> => {
    return Object.entries(theme)
      .map(([key, value]) => {
        const newPath = [...path, key];

        if (!isPlainObject(value)) {
          return cssVariableGenerator(
            newPath[0] ?? key,
            newPath.slice(1).join("."),
            value
          );
        }

        return generateCssVariables(value as AnyObject, newPath);
      })
      .flat();
  };

  const CSSVariableProvider = (props: CSSVariableProviderProps<T>) => {
    const { children, theme } = props;

    const generatedVariables = React.useMemo(
      () => generateCssVariables(theme),
      [theme]
    );

    const refCallback = (node: HTMLDivElement | null) => {
      if (!node) return;
      generatedVariables.forEach(v => {
        if (!v) return;

        node.style.setProperty(`--${v.variable}`, v.value);
      });
    };

    return (
      <div ref={refCallback} data-name="CSSVariableProvider">
        {children}
      </div>
    );
  };

  const ThemeProvider = (props: ThemeProviderProps<T>): JSX.Element => {
    const { children, theme: localTheme } = props;

    const outerTheme = useTheme();

    const theme = React.useMemo<T>(
      () => (outerTheme ? deepMerge(outerTheme, localTheme) : localTheme) as T,
      [localTheme, outerTheme]
    );

    return (
      <ThemeContext.Provider value={theme}>
        <CSSVariableProvider theme={localTheme}>{children}</CSSVariableProvider>
      </ThemeContext.Provider>
    );
  };

  return { useTheme, ThemeProvider };
};

export default createTheming;
