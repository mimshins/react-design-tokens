import { describe, expect, it } from "vitest";
import {
  defaultCSSVariableGenerator,
  generateCssVariables,
  getCSSVariablesAsInlineStyle,
} from "./utils.ts";

describe("defaultCSSVariableGenerator", () => {
  const ctx = (tokenValue: unknown) => ({
    tokenFamilyKey: "colors",
    tokenKey: "base",
    tokenPath: "primary.base",
    tokenValue,
  });

  it("generates a variable name from the token path", () => {
    const result = defaultCSSVariableGenerator(ctx("red"));

    expect(result?.variableName).toBe("colors-primary-base");
  });

  it("converts numbers to px values", () => {
    const result = defaultCSSVariableGenerator(ctx(16));

    expect(result?.variableValue).toBe("16px");
  });

  it("passes string values through", () => {
    const result = defaultCSSVariableGenerator(ctx("red"));

    expect(result?.variableValue).toBe("red");
  });

  it("returns null for non-scalar values", () => {
    expect(defaultCSSVariableGenerator(ctx({}))).toBeNull();
    expect(defaultCSSVariableGenerator(ctx([]))).toBeNull();
    expect(defaultCSSVariableGenerator(ctx(true))).toBeNull();
    expect(defaultCSSVariableGenerator(ctx(null))).toBeNull();
  });

  it("handles top-level token (empty tokenPath)", () => {
    const result = defaultCSSVariableGenerator({
      tokenFamilyKey: "space",
      tokenKey: "space",
      tokenPath: "",
      tokenValue: "8px",
    });

    expect(result?.variableName).toBe("space");
  });
});

describe("generateCssVariables", () => {
  it("recursively traverses nested tokens", () => {
    const tokens = { colors: { primary: { base: "red" } } };
    const result = generateCssVariables(tokens, defaultCSSVariableGenerator);

    expect(result).toContainEqual({
      variableName: "colors-primary-base",
      variableValue: "red",
    });
  });

  it("skips non-scalar leaf values (returns null entry)", () => {
    const tokens = { colors: { obj: { nested: {} } } };
    // deeply nested empty object — no scalar leaves, so no variables
    const result = generateCssVariables(tokens, defaultCSSVariableGenerator);

    expect(result.every(v => v === null)).toBe(true);
  });
});

describe("getCSSVariablesAsInlineStyle", () => {
  it("converts generated variables to inline style object", () => {
    const variables = [
      { variableName: "colors-primary-base", variableValue: "red" },
    ];

    const result = getCSSVariablesAsInlineStyle(variables);

    expect(result).toEqual({ "--colors-primary-base": "red" });
  });

  it("skips null entries", () => {
    const result = getCSSVariablesAsInlineStyle([null]);

    expect(result).toEqual({});
  });
});
