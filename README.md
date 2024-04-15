# React Design Tokens

An optimized and creative theming solution that generates CSS variables based on the tokens provided.

<hr />

## Installation

> Please note that [react](https://www.npmjs.com/package/react) >= 17 and [react-dom](https://www.npmjs.com/package/react-dom) >= 17 are peer dependencies.

Run the following script to install and save in your `package.json` dependencies:

```bash
# with npm
npm install react-design-tokens

# or with yarn
yarn add react-design-tokens

# or with pnpm
pnpm add react-design-tokens
```

<hr />

## API Documentation

The library exposes two APIs, `create` and `defaultCSSVariableGenerator`:

### 1. `create`

```ts
declare const create: (variants, config?) => {
  VariantSelector,
  useTokens,
  generateCSSVariablesAsInlineStyle,
}
```

This is the main API exposed by the library. It will take your variants map and an optional config options to create your theming client.

The `config` options are:

| Property Name | Type | Default | Description |
|---------------|------|---------|-------------|
| cssVariableGenerator | `context => ({ variableName: string; variableValue: string; } \| null)` | `defaultCSSVariableGenerator` | The function which is being used to generate CSS variables based on the provided variants map. |

The theming client consists of:

#### `<VariantSelector>`:

A wrapper component which will activate a variant for the tree it's wrapping. The properties are:

| Property Name | Type | Default | Description |
|---------------|------|---------|-------------|
| children? | `React.ReactNode` | - | The content of the component. |
| disableCSSVariableGeneration? | `boolean` | `false` | If `true`, CSS variable generation will be disabled.<br />Useful when you are manually controlling or populating CSS variables using `generateCSSVariablesAsInlineStyle`. |
| variant | `string` | - | The variant to be activated. It has to be a valid variant key that exists in the provided variants map. |

#### `useTokens()`:

A React hook to use in a component that is descendant of `<VariantSelector>` wrapper. It returns the tokens of the selected variant.

#### `generateCSSVariablesAsInlineStyle(variant)`:

A helper function to generate CSS variables in valid CSS syntax (`--variable=value`). It is helpful when you want to manually control the population of the CSS variables (e.g. Put initial tokens on html tag with `<html style={generateCSSVariablesAsInlineStyle('dark')} />`)

### 2. `defaultCSSVariableGenerator`

```ts
declare const defaultCSSVariableGenerator: (context: {
    tokenFamilyKey: string;
    tokenKey: string;
    tokenPath: string;
    tokenValue: unknown;
  }) => {
    variableName: string;
    variableValue: string;
} | null;
```

The default CSS variable generate function. The generated variables obey the following rules:
- Values that are not of type `string` or `number` will be omitted (returns `null`).
- Values of type `number` will be converted into `{tokenValue}px`.
- The generated variable format: `{ variableName: 'PATH-TO-TOKEN', variableValue: 'tokenValue' }`

#### `context.tokenFamilyKey`:

The key of a root token family.

For example, The `colors` key is a `tokenFamilyKey` in the following variants map:

```ts
{
  dark: {
    colors: {
      primary: {},
      secondary: {},
      // ...
    }
  },
  light: {
    colors: {
      primary: {},
      secondary: {},
      // ...
    }
  },
}
```

#### `context.tokenKey`:

The key (name) of the token.

#### `context.tokenValue`:

The value of the token.

#### `context.tokenPath`:

The dot-separated path to the token from which the root key has been omitted.

<hr />

## Basic Usage

To getting started, all you need to do is:

1. Create your own variants map:

```ts
// theming.ts

const variants = {
  dark: {
    colors: {
      primary: {
        base: "d1",
        hover: "d2",
        active: "d3",
        disabled: "d4",
      },
      secondary: {
        base: "d5",
        hover: "d6",
        active: "d7",
        disabled: "d8",
      },
      neutral: {
        text: {
          base: "d9",
          secondary: "d10",
          tertiary: "d11",
        },
        background: {
          base: "d12",
          container: "d13",
          elevated: "d14",
        },
      },
    },
  },
  light: {
    colors: {
      primary: {
        base: "l1",
        hover: "l2",
        active: "l3",
        disabled: "l4",
      },
      secondary: {
        base: "l5",
        hover: "l6",
        active: "l7",
        disabled: "l8",
      },
      neutral: {
        text: {
          base: "l9",
          secondary: "l10",
          tertiary: "l11",
        },
        background: {
          base: "l12",
          container: "l13",
          elevated: "l14",
        },
      },
    },
  },
};
```

2. Create a theming client:

```ts
// theming.ts

import { create } from "react-design-tokens";

const variants = {
  dark: {
    colors: {
      primary: {
        base: "d1",
        hover: "d2",
        active: "d3",
        disabled: "d4",
      },
      secondary: {
        base: "d5",
        hover: "d6",
        active: "d7",
        disabled: "d8",
      },
      neutral: {
        text: {
          base: "d9",
          secondary: "d10",
          tertiary: "d11",
        },
        background: {
          base: "d12",
          container: "d13",
          elevated: "d14",
        },
      },
    },
  },
  light: {
    colors: {
      primary: {
        base: "l1",
        hover: "l2",
        active: "l3",
        disabled: "l4",
      },
      secondary: {
        base: "l5",
        hover: "l6",
        active: "l7",
        disabled: "l8",
      },
      neutral: {
        text: {
          base: "l9",
          secondary: "l10",
          tertiary: "l11",
        },
        background: {
          base: "l12",
          container: "l13",
          elevated: "l14",
        },
      },
    },
  },
};

export const { useTokens, VariantSelector, generateCSSVariablesAsInlineStyle } = create(variants);
```

3. Use the theme variants:

```tsx
// App.tsx

import { VariantSelector } from "./theming";

const App = () => {
  return (
    <VariantSelector variant="dark">
      <LayoutComponent>
        {/* Components with dark variant tokens */}
      </LayoutComponent>
      <LayoutComponent>
        <VariantSelector variant="light">
          {/* Components with light variant tokens */}
        </VariantSelector>
      </LayoutComponent>
    </VariantSelector>
  );
}

export default App;
```

4. You can now access the tokens down the tree using `useTokens` hook. Also you have access to the generated CSS variables in your CSS.

The CSS variables generated for this variants map with default configuration set and the `dark` variant being selected is:

```
--colors-primary-base: d1;
--colors-primary-hover: d2;
--colors-primary-active: d3;
--colors-primary-disabled: d4;
--colors-secondary-base: d5;
--colors-secondary-hover: d6;
--colors-secondary-active: d7;
--colors-secondary-disabled: d8;
--colors-neutral-text-base: d9;
--colors-neutral-text-secondary: d10;
--colors-neutral-text-tertiary: d11;
--colors-neutral-background-base: d12;
--colors-neutral-background-container: d13;
--colors-neutral-background-elevated: d14;
```

## Contributing

Read the [contributing guide](https://github.com/mimshins/react-design-tokens/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

Contributing to `react-design-tokens` is about more than just issues and pull requests! There are many other ways to support the project beyond contributing to the code base.


## License

This project is licensed under the terms of the [MIT license](https://github.com/mimshins/react-design-tokens/blob/main/LICENSE).
