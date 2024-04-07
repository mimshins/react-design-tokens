import * as React from "react";
import { generateCssVariables, getCSSVariablesAsInlineStyle } from "./utils";

export type Props = {
  children?: React.ReactNode;
  tokens: Record<string, unknown>;
  variant: string;
  disableCSSVariableGeneration: boolean;
  cssVariableGenerator: (context: {
    tokenFamilyKey: string;
    tokenKey: string;
    tokenPath: string;
    tokenValue: unknown;
  }) => { variableName: string; variableValue: string } | null;
};

export type CSSVariableGenerator = NonNullable<Props["cssVariableGenerator"]>;
export type GeneratedCSSVariable = ReturnType<CSSVariableGenerator>;
export type GeneratedCSSVariables = Array<GeneratedCSSVariable>;

const VariableGenerator = (props: Props) => {
  const {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, disableCSSVariableGeneration],
  );

  const cssVariableProps = React.useMemo<React.CSSProperties>(
    () =>
      disableCSSVariableGeneration
        ? {}
        : getCSSVariablesAsInlineStyle(cssVariables),
    [cssVariables, disableCSSVariableGeneration],
  );

  return (
    <div
      data-name="VariantGenerator"
      data-variant={variant}
      style={cssVariableProps}
    >
      {children}
    </div>
  );
};

export default VariableGenerator;
