---
"react-design-tokens": minor
---

Add `generateStylesheet(variant, options?)` for SSR and static CSS generation.

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
