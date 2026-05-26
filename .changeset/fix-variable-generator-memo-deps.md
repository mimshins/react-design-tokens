---
"react-design-tokens": patch
---

Fix stale `useMemo` dependency arrays in `VariableGenerator`.

`tokens` and `cssVariableGenerator` were missing from the first memo's dep array, causing CSS variables to not regenerate when those values changed. The redundant `disableCSSVariableGeneration` dep was also removed from the second memo since it is already captured transitively through `cssVariables`.
