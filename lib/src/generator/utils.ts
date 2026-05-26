import { isPlainObject } from "../utils/is-plain-object.ts";
import type {
  CSSVariableGenerator,
  GeneratedCSSVariable,
  GeneratedCSSVariables,
  VariableGeneratorProps,
} from "./variable-generator.tsx";

/**
 * The default CSS variable generator used by `createTheming`.
 *
 * Rules:
 * - Non-`string`/`number` values are skipped (returns `null`).
 * - `number` values are converted to `{value}px`.
 * - Variable names are derived from the dot-separated token path:
 *   `colors.primary.base` → `--colors-primary-base`.
 */
export const defaultCSSVariableGenerator: CSSVariableGenerator = context => {
  const { tokenFamilyKey, tokenPath, tokenValue } = context;

  if (!["string", "number"].includes(typeof tokenValue)) return null;

  const pathString = tokenPath.replace(/\./g, "-").toLowerCase();
  const name = `${tokenFamilyKey.toLowerCase()}${pathString.length > 0 ? "-" : ""}${pathString}`;

  const value =
    typeof tokenValue === "number" ? `${tokenValue}px` : String(tokenValue);

  return {
    variableName: name,
    variableValue: value,
  };
};

/**
 * Recursively walks a token object and calls `generate` for each scalar leaf,
 * returning the flat array of generated CSS variable descriptors.
 */
export const generateCssVariables = (
  tokens: VariableGeneratorProps["tokens"],
  generate: CSSVariableGenerator,
): GeneratedCSSVariables => {
  const generateForParent = (
    parent: Record<string, unknown>,
    path: string[],
  ): GeneratedCSSVariables => {
    const cssVariables = Object.entries(parent).reduce(
      (result, currentEntry) => {
        const [tokenKey, tokenValue] = currentEntry;
        const newPath = [...path, tokenKey];

        if (!isPlainObject(tokenValue)) {
          const generatedCSSVariable: GeneratedCSSVariable = generate({
            /* c8 ignore next */
            tokenFamilyKey: newPath[0] ?? tokenKey,
            tokenPath: newPath.slice(1).join("."),
            tokenKey,
            tokenValue,
          });

          result.push(generatedCSSVariable);

          return result;
        }

        const parentVariables = generateForParent(tokenValue, newPath);

        result.push(...parentVariables);

        return result;
      },
      [] as GeneratedCSSVariables,
    );

    return cssVariables;
  };

  return generateForParent(tokens, []);
};

/**
 * Converts an array of generated CSS variable descriptors into a React-compatible
 * inline style object (`{ "--variable-name": "value" }`). `null` entries are skipped.
 */
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
