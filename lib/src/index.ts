/**
 * react-design-tokens
 *
 * An optimized theming solution that generates CSS custom properties from
 * a typed design token map.
 */

export * from "./create-theming.tsx";
export { defaultCSSVariableGenerator } from "./generator/utils.ts";
export {
  type CSSVariableGenerator,
  type GeneratedCSSVariable,
} from "./generator/variable-generator.tsx";
