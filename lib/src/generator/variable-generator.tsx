import * as React from "react";
import { generateCssVariables, getCSSVariablesAsInlineStyle } from "./utils.ts";

/** Props for the internal {@link VariableGenerator} component. */
export type VariableGeneratorProps = {
  /** The HTML element to render as the wrapper. Defaults to `"div"`. */
  as?: keyof React.JSX.IntrinsicElements;

  children?: React.ReactNode;

  /** Flat token map to generate CSS variables from. */
  tokens: Record<string, unknown>;

  /** Active variant key, used as the `data-variant` attribute. */
  variant: string;

  /** When `true`, skips CSS variable generation entirely. */
  disableCSSVariableGeneration: boolean;

  /**
   * Function that maps a token context to a CSS variable name/value pair.
   * Return `null` to skip a token.
   */
  cssVariableGenerator: (context: {
    /** The root-level key of the token family (e.g. `"colors"`). */
    tokenFamilyKey: string;

    /** The immediate key of the token (e.g. `"base"`). */
    tokenKey: string;

    /** Dot-separated path from the family root, excluding the family key (e.g. `"primary.base"`). */
    tokenPath: string;

    /** The raw token value. */
    tokenValue: unknown;
  }) => { variableName: string; variableValue: string } | null;
};

/** A function that maps a token context to a CSS variable descriptor, or `null` to skip. */
export type CSSVariableGenerator = NonNullable<
  VariableGeneratorProps["cssVariableGenerator"]
>;

/** The return type of a {@link CSSVariableGenerator} call. */
export type GeneratedCSSVariable = ReturnType<CSSVariableGenerator>;

/** An array of {@link GeneratedCSSVariable} entries (may contain `null` for skipped tokens). */
export type GeneratedCSSVariables = Array<GeneratedCSSVariable>;

export const VariableGenerator = (props: VariableGeneratorProps) => {
  const {
    as: Tag = "div",
    children,
    tokens,
    variant,
    disableCSSVariableGeneration,
    cssVariableGenerator,
  } = props;

  const cssVariables = React.useMemo<GeneratedCSSVariables>(
    () =>
      disableCSSVariableGeneration
        ? []
        : generateCssVariables(tokens, cssVariableGenerator),
    [tokens, cssVariableGenerator, disableCSSVariableGeneration],
  );

  const cssVariableProps = React.useMemo<React.CSSProperties>(
    () =>
      disableCSSVariableGeneration
        ? {}
        : getCSSVariablesAsInlineStyle(cssVariables),
    [cssVariables, disableCSSVariableGeneration],
  );

  return (
    <Tag
      data-name="VariableGenerator"
      data-variant={variant}
      style={cssVariableProps}
    >
      {children}
    </Tag>
  );
};

VariableGenerator.displayName = "VariableGenerator";
