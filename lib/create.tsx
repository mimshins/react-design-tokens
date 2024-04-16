/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import VariableGenerator, {
  defaultCSSVariableGenerator,
  generateCssVariables,
  getCSSVariablesAsInlineStyle,
  type Props as VariableGeneratorProps,
} from "./VariableGenerator";
import { Logger, shallowMerge } from "./utils";

const create = <
  TVariants extends Record<string, Record<string, unknown>>,
  TCommon extends Record<string, unknown>,
>(
  tokens: { variants: TVariants; common: TCommon },
  config?: {
    cssVariableGenerator?: VariableGeneratorProps["cssVariableGenerator"];
  },
) => {
  const { cssVariableGenerator = defaultCSSVariableGenerator } = config ?? {};

  const { common, variants } = tokens;

  type TVariantsKeys = keyof TVariants;

  type VariantSelectorProps = {
    children?: React.ReactNode;
    disableCSSVariableGeneration?: boolean;
    variant: TVariantsKeys;
  };

  const VariantTokensContext = React.createContext<
    TVariants[TVariantsKeys] | null
  >(null);

  const CommonTokensContext = React.createContext<TCommon | null>(null);

  const VariantSelector = (props: VariantSelectorProps) => {
    const { variant, children, disableCSSVariableGeneration = false } = props;

    const commonTokens = React.useContext(CommonTokensContext);

    const variantTokens = variants[variant];

    const tokens = React.useMemo<Record<string, unknown>>(() => {
      if (!variantTokens) return {};

      if (commonTokens) return variantTokens;

      return shallowMerge(variantTokens, common);
    }, [commonTokens, variantTokens]);

    if (!variantTokens) {
      Logger.error(`No variant found with key ${String(variant)}.`);

      return null;
    }

    const renderContent = () => {
      if (commonTokens) return children;

      return (
        <CommonTokensContext.Provider value={common}>
          {children}
        </CommonTokensContext.Provider>
      );
    };

    return (
      <VariableGenerator
        tokens={tokens}
        variant={String(variant)}
        disableCSSVariableGeneration={disableCSSVariableGeneration}
        cssVariableGenerator={cssVariableGenerator}
      >
        <VariantTokensContext.Provider value={variantTokens}>
          {renderContent()}
        </VariantTokensContext.Provider>
      </VariableGenerator>
    );
  };

  const useTokens = () => {
    const variantTokens = React.useContext(VariantTokensContext);
    const commonTokens = React.useContext(CommonTokensContext);

    if (!variantTokens || !commonTokens) {
      throw new Error(
        "You must use this hook in a component that is a descendant of <VariantSelector>.",
      );
    }

    const tokens = React.useMemo(
      () => shallowMerge(variantTokens, commonTokens),
      [variantTokens, commonTokens],
    );

    return tokens;
  };

  const generateCSSVariablesAsInlineStyle = (
    variant: TVariantsKeys,
    options?: { disableCommonTokensGeneration?: boolean },
  ) => {
    const { disableCommonTokensGeneration = false } = options ?? {};

    const variantTokens = variants[variant];

    if (!variantTokens) {
      Logger.error(`No variant found with key ${String(variant)}.`);

      return null;
    }

    const tokens = disableCommonTokensGeneration
      ? variantTokens
      : shallowMerge(variantTokens, common);

    const cssVariables = generateCssVariables(tokens, cssVariableGenerator);
    const inlineStyle = getCSSVariablesAsInlineStyle(cssVariables);

    return inlineStyle;
  };

  return { VariantSelector, useTokens, generateCSSVariablesAsInlineStyle };
};

export default create;
