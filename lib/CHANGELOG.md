# react-design-tokens

## 2.0.1
### Patch Changes



- [`afd32e2`](https://github.com/mimshins/react-design-tokens/commit/afd32e2cb85440c8ba631d28bd9d5d89f19704b6) Thanks [@mimshins](https://github.com/mimshins)! - Update documentation to replace `create()` with `createTheming()`.

## 2.0.0
### Major Changes



- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Force a major release due to the breaking changes.


### Minor Changes



- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Add `as` prop to `VariantSelector` to control the rendered wrapper element.
  
  Previously `VariantSelector` always rendered a `<div>`, which broke flex/grid layouts and added unwanted DOM depth. You can now pass any intrinsic element:
  
  ```tsx
  // render as a <section> instead of a <div>
  <VariantSelector variant="dark" as="section">
    ...
  </VariantSelector>
  
  // render as a <span> for inline contexts
  <VariantSelector variant="dark" as="span">
    ...
  </VariantSelector>
  ```
  
  Defaults to `"div"` for backwards compatibility.


- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Add `generateStylesheet(variant, options?)` for SSR and static CSS generation.
  
  Returns a CSS string suitable for a `<style>` tag, `_document.tsx`, or a `.css` file:
  
  ```ts
  generateStylesheet("dark")
  // ":root {\n  --colors-primary-base: d1;\n  ...\n}"
  
  generateStylesheet("dark", { selector: "[data-theme='dark']" })
  // "[data-theme='dark'] {\n  --colors-primary-base: d1;\n  ...\n}"
  ```
  
  Options:
  - `selector` — CSS selector to wrap the declarations (default: `":root"`)
  - `disableCommonTokensGeneration` — omit common tokens (default: `false`)


- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Add `useVariant()` hook to read the currently active variant key.
  
  ```tsx
  const { useVariant } = create(tokens);
  
  const MyComponent = () => {
    const variant = useVariant(); // "dark" | "light"
    return <img src={variant === "dark" ? darkIcon : lightIcon} />;
  };
  ```
  
  Throws if called outside a `<VariantSelector>`.


- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Rename primary export from `createTheming` to `create`, matching the README documentation and playground usage.
  
  `createTheming` is still exported as an alias for backwards compatibility but should be considered deprecated. Update your imports:
  
  ```ts
  // before
  import { createTheming } from "react-design-tokens";
  
  // after
  import { create } from "react-design-tokens";
  ```

### Patch Changes



- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Set `displayName` on `VariantSelector` and `VariableGenerator` for clearer React DevTools component trees.



- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Fix `logLevel` config option not being optional in TypeScript.
  
  `logLevel` was typed as required but the implementation already defaulted it to `LogLevel.WARN`. Passing `{ cssVariableGenerator: myFn }` without `logLevel` was a TypeScript error.


- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Fix stale `useMemo` dependency arrays in `VariableGenerator`.
  
  `tokens` and `cssVariableGenerator` were missing from the first memo's dep array, causing CSS variables to not regenerate when those values changed. The redundant `disableCSSVariableGeneration` dep was also removed from the second memo since it is already captured transitively through `cssVariables`.


- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - Pre-compute merged tokens at `create()` time instead of on every render.
  
  Previously `useTokens()` called `shallowMerge(variantTokens, commonTokens)` on every render. Since both are static objects, the merged result for each variant is now computed once when `create()` is called and stored in a `Map`. Hook calls and `generateCSSVariablesAsInlineStyle` do a single map lookup instead.
  
  This also removes two React contexts (`VariantTokensContext`, `CommonTokensContext`) that are no longer needed, reducing the provider nesting depth by two levels.


- [`caf0f5c`](https://github.com/mimshins/react-design-tokens/commit/caf0f5c82802bc27b61aeed3f54ea3018044865d) Thanks [@mimshins](https://github.com/mimshins)! - `useTokens` no longer throws in production when called outside a `<VariantSelector>`.
  
  In development the error is still thrown to catch mistakes early. In production it returns an empty object so a misplaced hook call degrades gracefully instead of crashing the app.
