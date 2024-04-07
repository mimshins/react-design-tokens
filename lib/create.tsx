/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import VariableGenerator, {
  defaultCSSVariableGenerator,
  generateCssVariables,
  getCSSVariablesAsInlineStyle,
  type Props as VariableGeneratorProps,
} from "./VariableGenerator";
import { Logger } from "./utils";

const create = <TVariants extends Record<string, Record<string, unknown>>>(
  variants: TVariants,
  config?: {
    cssVariableGenerator?: VariableGeneratorProps["cssVariableGenerator"];
  },
) => {
  const { cssVariableGenerator = defaultCSSVariableGenerator } = config ?? {};

  type TVariantsKeys = keyof TVariants;

  type VariantSelectorProps = {
    children?: React.ReactNode;
    disableCSSVariableGeneration?: boolean;
    variant: TVariantsKeys;
  };

  const TokensContext = React.createContext<TVariants[TVariantsKeys] | null>(
    null,
  );

  const VariantSelector = (props: VariantSelectorProps) => {
    const { variant, children, disableCSSVariableGeneration = false } = props;

    const tokens = variants[variant];

    if (!tokens) {
      Logger.error(`No variant found with key ${String(variant)}.`);

      return null;
    }

    return (
      <VariableGenerator
        tokens={tokens}
        variant={String(variant)}
        disableCSSVariableGeneration={disableCSSVariableGeneration}
        cssVariableGenerator={cssVariableGenerator}
      >
        <TokensContext.Provider value={tokens}>
          {children}
        </TokensContext.Provider>
      </VariableGenerator>
    );
  };

  const useTokens = () => {
    const tokensCtx = React.useContext(TokensContext);

    if (!tokensCtx) {
      throw new Error(
        "You must use this hook in a component that is a descendant of <VariantSelector>.",
      );
    }

    return tokensCtx;
  };

  const generateCSSVariablesAsInlineStyle = (variant: TVariantsKeys) => {
    const tokens = variants[variant];

    if (!tokens) {
      Logger.error(`No variant found with key ${String(variant)}.`);

      return null;
    }

    const cssVariables = generateCssVariables(tokens, cssVariableGenerator);
    const inlineStyle = getCSSVariablesAsInlineStyle(cssVariables);

    return inlineStyle;
  };

  return { VariantSelector, useTokens, generateCSSVariablesAsInlineStyle };
};

export default create;
