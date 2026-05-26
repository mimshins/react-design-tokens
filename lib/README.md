# react-design-tokens

An optimized theming solution that generates CSS custom properties from a typed
design token map.

<hr />

## Installation

> Requires [react](https://www.npmjs.com/package/react) >= 16.8 and
> [react-dom](https://www.npmjs.com/package/react-dom) >= 16.8 as peer
> dependencies.

```bash
# npm
npm install react-design-tokens

# yarn
yarn add react-design-tokens

# pnpm
pnpm add react-design-tokens
```

<hr />

## Quick Start

```ts
// theming.ts
import { createTheming } from "react-design-tokens";

export const { VariantSelector, useTokens, useVariant, generateStylesheet } =
  createTheming({
    variants: {
      dark: {
        colors: {
          primary: { base: "#fff", hover: "#eee" },
          background: "#111",
        },
      },
      light: {
        colors: {
          primary: { base: "#000", hover: "#333" },
          background: "#fff",
        },
      },
    },
    common: {
      space: { sm: "4px", md: "8px", lg: "16px" },
      fontFamily: "Inter, sans-serif",
    },
  });
```

```tsx
// App.tsx
import { VariantSelector } from "./theming.ts";

const App = () => (
  <VariantSelector variant="dark">
    <Layout />
  </VariantSelector>
);
```

```tsx
// Button.tsx
import { useTokens } from "./theming.ts";

const Button = () => {
  const tokens = useTokens();
  return (
    <button style={{ color: `var(--${tokens.colors.primary.base})` }}>
      Click me
    </button>
  );
};
```

<hr />

## API

### `createTheming(tokens, config?)`

```ts
declare const create: <TVariants, TCommon>(
  tokens: { variants: TVariants; common: TCommon },
  config?: {
    cssVariableGenerator?: CSSVariableGenerator;
    logLevel?: LogLevel;
  },
) => Theming<TVariants, TCommon>;
```

The main entry point. Accepts your token map and returns a fully-typed theming
client.

**`tokens`**

| Field      | Type                                      | Description                        |
| ---------- | ----------------------------------------- | ---------------------------------- |
| `variants` | `Record<string, Record<string, unknown>>` | One entry per theme variant.       |
| `common`   | `Record<string, unknown>`                 | Tokens shared across all variants. |

Common tokens are shallow-merged on top of variant tokens
(`{ ...variantTokens, ...commonTokens }`). Common tokens take precedence on key
collisions — avoid overlapping keys.

**`config`**

| Option                 | Type                   | Default                       | Description                                                    |
| ---------------------- | ---------------------- | ----------------------------- | -------------------------------------------------------------- |
| `cssVariableGenerator` | `CSSVariableGenerator` | `defaultCSSVariableGenerator` | Custom function to control CSS variable name/value generation. |
| `logLevel`             | `LogLevel`             | `"warn"`                      | Minimum log level for internal warnings.                       |

---

### `VariantSelector`

A wrapper component that activates a variant for its subtree. Renders a DOM
element with the variant's CSS custom properties injected as inline styles.

```tsx
<VariantSelector variant="dark">
  <App />
</VariantSelector>

// Custom wrapper element
<VariantSelector variant="dark" as="section">
  <App />
</VariantSelector>
```

| Prop                           | Type                          | Default | Description                                                                                                   |
| ------------------------------ | ----------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `variant`                      | `keyof TVariants`             | —       | The variant to activate.                                                                                      |
| `as`                           | `keyof JSX.IntrinsicElements` | `"div"` | The HTML element to render as the wrapper.                                                                    |
| `children`                     | `React.ReactNode`             | —       | Content of the component.                                                                                     |
| `disableCSSVariableGeneration` | `boolean`                     | `false` | When `true`, CSS variables are not injected as inline styles. Useful when you control CSS variables manually. |

---

### `useTokens()`

A React hook that returns the merged tokens for the active variant. Must be
called inside a descendant of `<VariantSelector>`.

```tsx
const MyComponent = () => {
  const tokens = useTokens();
  // tokens.colors.primary.base, tokens.space.sm, etc.
};
```

Throws in development if called outside a `<VariantSelector>`. Returns `{}` in
production for graceful degradation.

---

### `useVariant()`

A React hook that returns the currently active variant key. Must be called
inside a descendant of `<VariantSelector>`.

```tsx
const MyIcon = () => {
  const variant = useVariant(); // "dark" | "light"
  return <img src={variant === "dark" ? darkSrc : lightSrc} />;
};
```

---

### `generateCSSVariablesAsInlineStyle(variant, options?)`

Generates CSS custom properties for a variant as a React inline style object
(`{ "--variable-name": "value" }`). Returns `null` if the variant key is not
found.

```tsx
// Useful for SSR — apply initial variables on the html element
<html style={generateCSSVariablesAsInlineStyle("dark")} />
```

| Option                          | Type      | Default | Description                         |
| ------------------------------- | --------- | ------- | ----------------------------------- |
| `disableCommonTokensGeneration` | `boolean` | `false` | Omit common tokens from the output. |

---

### `generateStylesheet(variant, options?)`

Generates a CSS rule block string for a variant, suitable for a `<style>` tag,
`_document.tsx`, or a static `.css` file. Returns `null` if the variant key is
not found.

```ts
generateStylesheet("dark");
// ":root {\n  --colors-primary-base: #fff;\n  ...\n}"

generateStylesheet("dark", { selector: "[data-theme='dark']" });
// "[data-theme='dark'] {\n  --colors-primary-base: #fff;\n  ...\n}"
```

| Option                          | Type      | Default   | Description                            |
| ------------------------------- | --------- | --------- | -------------------------------------- |
| `selector`                      | `string`  | `":root"` | CSS selector to wrap the declarations. |
| `disableCommonTokensGeneration` | `boolean` | `false`   | Omit common tokens from the output.    |

---

### `defaultCSSVariableGenerator`

```ts
declare const defaultCSSVariableGenerator: CSSVariableGenerator;
```

The default CSS variable generator. Rules:

- Values that are not `string` or `number` are skipped (returns `null`).
- `number` values are converted to `{value}px`.
- Variable names are derived from the dot-separated token path with the family
  key as prefix: `colors.primary.base` → `--colors-primary-base`

You can pass a custom generator to `create()` to override this behavior:

```ts
create(tokens, {
  cssVariableGenerator: ({ tokenFamilyKey, tokenPath, tokenValue }) => {
    if (typeof tokenValue !== "string") return null;
    return {
      variableName: `my-prefix-${tokenFamilyKey}-${tokenPath.replace(/\./g, "-")}`,
      variableValue: tokenValue,
    };
  },
});
```

The generator receives a context object:

| Field            | Type      | Description                                                                                |
| ---------------- | --------- | ------------------------------------------------------------------------------------------ |
| `tokenFamilyKey` | `string`  | Root-level key of the token family (e.g. `"colors"`).                                      |
| `tokenKey`       | `string`  | Immediate key of the token (e.g. `"base"`).                                                |
| `tokenPath`      | `string`  | Dot-separated path from the family root, excluding the family key (e.g. `"primary.base"`). |
| `tokenValue`     | `unknown` | The raw token value.                                                                       |

---

### Types

```ts
/** Function that maps a token context to a CSS variable descriptor, or null to skip. */
type CSSVariableGenerator = (context: {
  tokenFamilyKey: string;
  tokenKey: string;
  tokenPath: string;
  tokenValue: unknown;
}) => { variableName: string; variableValue: string } | null;

/** The return type of a CSSVariableGenerator call. */
type GeneratedCSSVariable = ReturnType<CSSVariableGenerator>;
```

<hr />

## CSS Variables

Given the following token map with the default generator and the `dark` variant
active:

```ts
const tokens = {
  variants: {
    dark: {
      colors: {
        primary: { base: "#fff", hover: "#eee" },
      },
    },
  },
  common: {
    space: { sm: "4px", md: "8px" },
  },
};
```

The generated CSS variables are:

```css
--colors-primary-base: #fff;
--colors-primary-hover: #eee;
--space-sm: 4px;
--space-md: 8px;
```

<hr />

## SSR / Next.js

Use `generateCSSVariablesAsInlineStyle` or `generateStylesheet` to apply the
initial theme on the server without a flash of unstyled content:

```tsx
// app/layout.tsx (Next.js App Router)
import { generateCSSVariablesAsInlineStyle } from "./theming.ts";

export default function RootLayout({ children }) {
  return (
    <html style={generateCSSVariablesAsInlineStyle("dark")}>
      <body>{children}</body>
    </html>
  );
}
```

Or inject a `<style>` block:

```tsx
import { generateStylesheet } from "./theming.ts";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: generateStylesheet("dark") ?? "" }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

<hr />

## Nested Variants

`VariantSelector` components can be nested to apply different variants to
different subtrees:

```tsx
<VariantSelector variant="dark">
  <Header />
  <VariantSelector variant="light">
    <Sidebar />
  </VariantSelector>
  <Main />
</VariantSelector>
```

<hr />

## Contributing

Read the
[contributing guide](https://github.com/mimshins/react-design-tokens/blob/main/CONTRIBUTING.md)
to learn about the development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

[MIT](https://github.com/mimshins/react-design-tokens/blob/main/LICENSE)
