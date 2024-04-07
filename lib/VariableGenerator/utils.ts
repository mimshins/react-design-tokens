import { isPlainObject } from "../utils";
import type {
  CSSVariableGenerator,
  GeneratedCSSVariable,
  GeneratedCSSVariables,
  Props,
} from "./VariableGenerator";

export const defaultCSSVariableGenerator: CSSVariableGenerator = context => {
  const { tokenFamilyKey, tokenPath, tokenValue } = context;

  if (!["string", "number"].includes(typeof tokenValue)) return null;

  const pathString = tokenPath.replaceAll(".", "-").toLowerCase();
  const name = `${tokenFamilyKey.toLowerCase()}${pathString.length > 0 ? "-" : ""}${pathString}`;

  const value =
    typeof tokenValue === "number" ? `${tokenValue}px` : String(tokenValue);

  return {
    variableName: name,
    variableValue: value,
  };
};

export const generateCssVariables = (
  tokens: Props["tokens"],
  generate: CSSVariableGenerator,
): GeneratedCSSVariables => {
  const variables: GeneratedCSSVariables[] = [];

  const recurse = (
    parent: Record<string, unknown>,
    path: string[],
  ): GeneratedCSSVariables => {
    const cssVariables = Object.entries(parent).reduce(
      (result, currentEntry) => {
        const [tokenKey, tokenValue] = currentEntry;
        const newPath = [...path, tokenKey];

        if (!isPlainObject(tokenValue)) {
          const generatedCSSVariable: GeneratedCSSVariable = generate({
            tokenFamilyKey: newPath[0] ?? tokenKey,
            tokenPath: newPath.slice(1).join("."),
            tokenKey,
            tokenValue,
          });

          result.push(generatedCSSVariable);

          return result;
        }

        return recurse(tokenValue, newPath);
      },
      [] as GeneratedCSSVariables,
    );

    variables.push(cssVariables);

    return cssVariables;
  };

  recurse(tokens, []);

  return variables.flat();
};

export const getCSSVariablesAsInlineStyle = (
  variables: GeneratedCSSVariables,
) => {
  const inlineStyle = variables.reduce(
    (result, variable) => {
      if (variable) {
        result[`--${variable.variableName}`] = variable.variableValue;
      }

      return result;
    },
    {} as Record<string, string>,
  );

  return inlineStyle;
};
