import * as React from "react";
import {
  defaultCSSVariableGenerator,
  generateCssVariables,
  getCSSVariablesAsInlineStyle,
} from "./generator/utils.ts";
import {
  VariableGenerator,
  type VariableGeneratorProps,
} from "./generator/variable-generator.tsx";
import { Logger, LogLevel } from "./utils/logger.ts";
import { shallowMerge } from "./utils/shallow-merge.ts";

/** The theming client returned by {@link createTheming}. */
export type Theming<TVariants, TCommon> = {
  /**
   * A wrapper component that activates a variant for its subtree.
   *
   * Renders a DOM element (default: `<div>`) with the variant's CSS custom
   * properties injected as inline styles. All descendants can access the
   * active tokens via {@link Theming.useTokens} and the active variant key
   * via {@link Theming.useVariant}.
   *
   * @example
   * ```tsx
   * <VariantSelector variant="dark">
   *   <App />
   * </VariantSelector>
   *
   * // Custom wrapper element
   * <VariantSelector variant="dark" as="section">
   *   <App />
   * </VariantSelector>
   * ```
   */
  VariantSelector: (props: {
    /** The HTML element to render as the wrapper. Defaults to `"div"`. */
    as?: keyof React.JSX.IntrinsicElements;
    children?: React.ReactNode;
    /**
     * When `true`, CSS custom properties will not be injected as inline styles.
     * Useful when you are manually controlling CSS variables via
     * {@link Theming.generateCSSVariablesAsInlineStyle} or
     * {@link Theming.generateStylesheet}.
     * @default false
     */
    disableCSSVariableGeneration?: boolean;
    /** The variant key to activate. Must be a key of the `variants` map. */
    variant: keyof TVariants;
  }) => React.JSX.Element | null;

  /**
   * A React hook that returns the merged tokens for the active variant.
   *
   * Common tokens are shallow-merged on top of variant tokens
   * (`{ ...variantTokens, ...commonTokens }`), so common tokens take
   * precedence on key collisions.
   *
   * Must be called inside a component that is a descendant of
   * {@link Theming.VariantSelector}. Throws in development if called outside
   * a provider; returns `{}` in production.
   *
   * @example
   * ```tsx
   * const MyButton = () => {
   *   const tokens = useTokens();
   *   return <button style={{ color: `var(--${tokens.colors.primary.base})` }} />;
   * };
   * ```
   */
  useTokens: () => { [K in keyof TCommon]: TCommon[K] } & {
    [K in keyof TVariants[keyof TVariants]]: K extends keyof TCommon
      ? TCommon[K]
      : TVariants[keyof TVariants][K];
  };

  /**
   * A React hook that returns the currently active variant key.
   *
   * Must be called inside a component that is a descendant of
   * {@link Theming.VariantSelector}. Throws if called outside a provider.
   *
   * @example
   * ```tsx
   * const MyIcon = () => {
   *   const variant = useVariant(); // "dark" | "light"
   *   return <img src={variant === "dark" ? darkSrc : lightSrc} />;
   * };
   * ```
   */
  useVariant: () => keyof TVariants;

  /**
   * Generates CSS custom properties for a variant as a React inline style
   * object (`{ "--variable-name": "value" }`).
   *
   * Useful for manually controlling where CSS variables are applied, e.g.
   * on the `<html>` element for SSR hydration:
   * ```tsx
   * <html style={generateCSSVariablesAsInlineStyle("dark")} />
   * ```
   *
   * Returns `null` if the variant key is not found.
   *
   * @param variant The variant key to generate variables for.
   * @param options.disableCommonTokensGeneration Omit common tokens. Defaults to `false`.
   */
  generateCSSVariablesAsInlineStyle: (
    variant: keyof TVariants,
    options?: { disableCommonTokensGeneration?: boolean },
  ) => Record<string, string> | null;

  /**
   * Generates a CSS rule block string for a variant, suitable for use in a
   * `<style>` tag, `_document.tsx`, or a static `.css` file.
   *
   * @example
   * ```ts
   * generateStylesheet("dark")
   * // ":root {\n  --colors-primary: d1;\n  ...\n}"
   *
   * generateStylesheet("dark", { selector: "[data-theme='dark']" })
   * // "[data-theme='dark'] {\n  --colors-primary: d1;\n  ...\n}"
   * ```
   *
   * Returns `null` if the variant key is not found.
   *
   * @param variant The variant key to generate a stylesheet for.
   * @param options.selector CSS selector to wrap the declarations. Defaults to `":root"`.
   * @param options.disableCommonTokensGeneration Omit common tokens. Defaults to `false`.
   */
  generateStylesheet: (
    variant: keyof TVariants,
    options?: { selector?: string; disableCommonTokensGeneration?: boolean },
  ) => string | null;
};

/**
 * Creates a theming client from a token map.
 *
 * Accepts a `variants` map (one entry per theme) and a `common` map (tokens
 * shared across all variants). Returns {@link Theming} — a set of components,
 * hooks, and utilities scoped to your token definitions.
 *
 * Common tokens are shallow-merged on top of variant tokens
 * (`{ ...variantTokens, ...commonTokens }`). Avoid key collisions between
 * variant and common tokens, as common tokens will silently win.
 *
 * @example
 * ```ts
 * import { create } from "react-design-tokens";
 *
 * export const { VariantSelector, useTokens, useVariant, generateStylesheet } = create({
 *   variants: {
 *     dark:  { colors: { primary: "#fff" } },
 *     light: { colors: { primary: "#000" } },
 *   },
 *   common: {
 *     space: { sm: "4px", md: "8px" },
 *   },
 * });
 * ```
 *
 * @param tokens Object with `variants` and `common` token maps.
 * @param config.cssVariableGenerator Custom function to control CSS variable
 *   name/value generation. Defaults to {@link defaultCSSVariableGenerator}.
 * @param config.logLevel Minimum log level for internal warnings. Defaults to `"warn"`.
 */
export const createTheming = <
  TVariants extends Record<string, Record<string, unknown>>,
  TCommon extends Record<string, unknown>,
>(
  tokens: { variants: TVariants; common: TCommon },
  config?: {
    cssVariableGenerator?: VariableGeneratorProps["cssVariableGenerator"];
    logLevel?: LogLevel;
  },
): Theming<TVariants, TCommon> => {
  const {
    cssVariableGenerator = defaultCSSVariableGenerator,
    logLevel = LogLevel.WARN,
  } = config ?? {};

  const logger = new Logger(logLevel);

  const { common, variants } = tokens;

  type ThemingResult = Theming<TVariants, TCommon>;

  // Pre-compute merged tokens (variantTokens + common) for each variant at create() time.
  // This avoids re-running shallowMerge on every useTokens() call.
  const mergedTokensMap = new Map<
    keyof TVariants,
    ReturnType<ThemingResult["useTokens"]>
  >();

  for (const key of Object.keys(variants) as Array<keyof TVariants>) {
    mergedTokensMap.set(key, shallowMerge(variants[key], common));
  }

  const ActiveVariantContext = React.createContext<keyof TVariants | null>(
    null,
  );

  const VariantSelector: ThemingResult["VariantSelector"] = props => {
    const {
      as,
      variant,
      children,
      disableCSSVariableGeneration = false,
    } = props;

    const variantTokens = variants[variant];

    if (!variantTokens) {
      throw new Error(
        `[ReactDesignTokens] No variant found with key ${String(variant)}.`,
      );
    }

    const tokens = mergedTokensMap.get(variant)!;

    return (
      <VariableGenerator
        as={as}
        tokens={tokens}
        variant={String(variant)}
        disableCSSVariableGeneration={disableCSSVariableGeneration}
        cssVariableGenerator={cssVariableGenerator}
      >
        <ActiveVariantContext.Provider value={variant}>
          {children}
        </ActiveVariantContext.Provider>
      </VariableGenerator>
    );
  };

  const useTokens: ThemingResult["useTokens"] = () => {
    const variant = React.useContext(ActiveVariantContext);

    if (variant == null) {
      const msg =
        "[ReactDesignTokens] You must use this hook in a component that is a descendant of <VariantSelector>.";

      if (process.env["NODE_ENV"] !== "production") {
        throw new Error(msg);
      }

      logger.error(msg);

      return {} as ReturnType<ThemingResult["useTokens"]>;
    }

    return mergedTokensMap.get(variant)!;
  };

  const useVariant: ThemingResult["useVariant"] = () => {
    const variant = React.useContext(ActiveVariantContext);

    if (variant == null) {
      throw new Error(
        "[ReactDesignTokens] You must use this hook in a component that is a descendant of <VariantSelector>.",
      );
    }

    return variant;
  };

  const generateCSSVariablesAsInlineStyle: ThemingResult["generateCSSVariablesAsInlineStyle"] =
    (variant, options) => {
      const { disableCommonTokensGeneration = false } = options ?? {};

      if (!variants[variant]) {
        logger.error(
          `[ReactDesignTokens] No variant found with key ${String(variant)}.`,
        );

        return null;
      }

      const tokens = disableCommonTokensGeneration
        ? variants[variant]
        : mergedTokensMap.get(variant)!;

      const cssVariables = generateCssVariables(tokens, cssVariableGenerator);
      const inlineStyle = getCSSVariablesAsInlineStyle(cssVariables);

      return inlineStyle;
    };

  const generateStylesheet: ThemingResult["generateStylesheet"] = (
    variant,
    options,
  ) => {
    const { selector = ":root", disableCommonTokensGeneration = false } =
      options ?? {};

    const inlineStyle = generateCSSVariablesAsInlineStyle(variant, {
      disableCommonTokensGeneration,
    });

    if (!inlineStyle) return null;

    const declarations = Object.entries(inlineStyle)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");

    return `${selector} {\n${declarations}\n}`;
  };

  return {
    VariantSelector,
    useTokens,
    useVariant,
    generateCSSVariablesAsInlineStyle,
    generateStylesheet,
  };
};
