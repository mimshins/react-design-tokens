---
"react-design-tokens": patch
---

Pre-compute merged tokens at `create()` time instead of on every render.

Previously `useTokens()` called `shallowMerge(variantTokens, commonTokens)` on every render. Since both are static objects, the merged result for each variant is now computed once when `create()` is called and stored in a `Map`. Hook calls and `generateCSSVariablesAsInlineStyle` do a single map lookup instead.

This also removes two React contexts (`VariantTokensContext`, `CommonTokensContext`) that are no longer needed, reducing the provider nesting depth by two levels.
