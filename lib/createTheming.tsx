/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { deepMerge, isPlainObject, useIsomorphicLayoutEffect } from "./helpers";

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
  isInitialTheme: boolean;
}

interface ThemingConfig<T> {
  initializeVariablesOnHTMLRoot?: boolean;
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

  const pathString = tokenPath.replaceAll(".", "-").toLowerCase();

  return {
    variable: `${tokenFamilyKey.toLowerCase()}${
      pathString.length > 0 ? "-".concat(pathString) : ""
    }`,
    value:
      typeof tokenValue === "number" ? `${tokenValue}px` : String(tokenValue)
  };
};

const createTheming = <T extends AnyObject>(
  defaultTheme: T,
  config?: ThemingConfig<T>
) => {
  const {
    cssVariableGenerator = defaultCssVariableGenerator,
    initializeVariablesOnHTMLRoot = false
  } = config ?? {};

  const ThemeContext = React.createContext<T>({
    ...defaultTheme,
    __viaProvider: false
  });

  const useTheme = (): T => React.useContext(ThemeContext);

  type GeneratedCSSVariables = Array<{
    variable: string;
    value: string;
  } | null>;

  const generateCssVariables = (
    theme: AnyObject,
    path: string[] = []
  ): GeneratedCSSVariables =>
    Object.entries(theme)
      .map(([key, value]) => {
        const newPath = [...path, key];

        if (key === "__viaProvider") return null;

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

  const convertVariablesToStyles = (
    generatedVariables: GeneratedCSSVariables
  ) =>
    generatedVariables.reduce((result, v) => {
      if (v) result[`--${v.variable}`] = v.value;
      return result;
    }, {} as Record<string, string>);

  const getVariablesAsStyles = (theme: DeepPartial<T>) =>
    convertVariablesToStyles(generateCssVariables(theme));

  const attachVariables = (
    node: HTMLElement,
    generatedVariables: GeneratedCSSVariables
  ) => {
    generatedVariables.forEach(v => {
      if (!v) return;
      node.style.setProperty(`--${v.variable}`, v.value);
    });
  };

  const detachVariables = (
    node: HTMLElement,
    generatedVariables: GeneratedCSSVariables
  ) => {
    generatedVariables.forEach(v => {
      if (!v) return;
      node.style.removeProperty(`--${v.variable}`);
    });
  };

  const CSSVariableProvider = (props: CSSVariableProviderProps<T>) => {
    const { children, theme, isInitialTheme } = props;

    const generatedVariables = React.useMemo(
      () => generateCssVariables(theme),
      [theme]
    );

    const willAttachOnHTMLRoot =
      isInitialTheme && initializeVariablesOnHTMLRoot;

    const variablesAsStyles = React.useMemo(
      () =>
        !willAttachOnHTMLRoot
          ? convertVariablesToStyles(generatedVariables)
          : undefined,
      [generatedVariables, willAttachOnHTMLRoot]
    );

    useIsomorphicLayoutEffect(() => {
      if (!willAttachOnHTMLRoot) return;

      attachVariables(document.documentElement, generatedVariables);

      return () => {
        detachVariables(document.documentElement, generatedVariables);
      };
    }, [generatedVariables, willAttachOnHTMLRoot]);

    return (
      <div
        style={variablesAsStyles}
        data-name="CSSVariableProvider"
        data-attached-on-html-root={willAttachOnHTMLRoot ? "" : undefined}
      >
        {children}
      </div>
    );
  };

  const ThemeProvider = (props: ThemeProviderProps<T>): JSX.Element => {
    const { children, theme: localTheme } = props;

    const outerTheme = useTheme();

    const isInitialTheme = !outerTheme.__viaProvider;

    const theme = React.useMemo(() => {
      const theme = isInitialTheme
        ? (localTheme as T)
        : (deepMerge(outerTheme, localTheme) as T);

      // @ts-expect-error internal property of AnyObject
      theme.__viaProvider = true;

      return theme;
    }, [localTheme, outerTheme, isInitialTheme]);

    return (
      <ThemeContext.Provider value={theme}>
        <CSSVariableProvider theme={localTheme} isInitialTheme={isInitialTheme}>
          {children}
        </CSSVariableProvider>
      </ThemeContext.Provider>
    );
  };

  return {
    useTheme,
    ThemeProvider,
    getVariablesAsStyles
  };
};

export default createTheming;
