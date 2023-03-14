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

## API

The exposed APIs:

- `createTheming(defaultTheme, config?) => { useTheme, ThemeProvider }`\
The main exposed API which will return:\
`useTheme`: A React Hook to hook into the provided theme object.\
`ThemeProvider`: A React Context Provider to provide the theme object down the tree and also populate the generated CSS variables for it's children.
  - `defaultTheme`\
  The default theme which will be used as `ThemeContext`'s default value.
  - `config` [optional]\
  The theming configuration object.
    - `config.cssVariableGenerator` [optional]\
    The function which is being used to generate CSS variables based on the provided theme object.
    - `config.initializeVariablesOnHTMLRoot` [optional | default: `false`]\
    If set to `true`, initial `<ThemeProvider>` will attach CSS variables to the HTML element (Also known as `:root`).

- `defaultCssVariableGenerator(tokenFamilyKey, tokenPath, tokenValue)`\
The default CSS variable generate function. The generated variables obey the following rules:\
1- Values that are not of type `string` or `number` will be omitted.\
2- `number` values will be converted into `{tokenValue}px`.\
3- Overall variable string: `{path-to-token}: {tokenValue}`
  - `tokenFamilyKey`\
  The key of a root token family.
  - `tokenPath`\
  The dot-separated path to the token from which the root key has been omitted.
  - `tokenValue`\
  The value of the token.


<hr />

## Basic Usage

To getting started, all you need to do is:

1. Create your own theme:
```ts
// theming.ts

export const theme = {
  colors: {
    primary: {
      base: "1",
      hover: "2",
      active: "3",
      disabled: "4"
    },
    secondary: {
      base: "5",
      hover: "6",
      active: "7",
      disabled: "8"
    },
    neutral: {
      text: {
        base: "9",
        secondary: "10",
        tertiary: "11"
      },
      background: {
        base: "12",
        container: "13",
        elevated: "14"
      }
    }
  },
  dark: 1
};

export type Theme = typeof theme;
```

2. Create a theming client for your theme: \
(We recommend to create a theming for each theme object)
```ts
// theming.ts
import { createTheming } from "react-design-tokens";

export const theme = {
  colors: {
    primary: {
      base: "1",
      hover: "2",
      active: "3",
      disabled: "4"
    },
    secondary: {
      base: "5",
      hover: "6",
      active: "7",
      disabled: "8"
    },
    neutral: {
      text: {
        base: "9",
        secondary: "10",
        tertiary: "11"
      },
      background: {
        base: "12",
        container: "13",
        elevated: "14"
      }
    }
  },
  dark: 1
};

export type Theme = typeof theme;

export const { ThemeProvider, useTheme } = createTheming(theme);
```

3. Provide the theme:
```tsx
// App.tsx

import { ThemeProvider, theme } from "./theming";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Components */}
    </ThemeProvider>
  );
}

export default App;
```

4. You can now access the `theme` object down the tree using `useTheme` hook. Also you have access to the generated CSS variables in your CSS.

The CSS variables generated for this theme with default configuration are as follows:
```
--colors-primary-base: 1;
--colors-primary-hover: 2;
--colors-primary-active: 3;
--colors-primary-disabled: 4;
--colors-secondary-base: 5;
--colors-secondary-hover: 6;
--colors-secondary-active: 7;
--colors-secondary-disabled: 8;
--colors-neutral-text-base: 9;
--colors-neutral-text-secondary: 10;
--colors-neutral-text-tertiary: 11;
--colors-neutral-background-base: 12;
--colors-neutral-background-container: 13;
--colors-neutral-background-elevated: 14;
--dark: 1px;
```

<hr />

## Notes

- You can only access the CSS variables in a sub-tree which is being wrapped with `ThemeProvider`. (In other words, each sub-tree has it's own CSS variables)

- Inner theme objects will be merged with outer theme objects. So to override an outer theme, just provide the tokens you want to change in the child-tree:
```tsx
<ThemeProvider theme={theme}>
  <ThemeProvider
    theme={{ colors: { neutral: { text: { tertiary: "#000" } } } }}  
  >
  </ThemeProvider>
</ThemeProvider>
```

<hr />

## Contributing

Read the [contributing guide](https://github.com/mimshins/react-design-tokens/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes.

Contributing to `react-design-tokens` is about more than just issues and pull requests! There are many other ways to support the project beyond contributing to the code base.


## License

This project is licensed under the terms of the [MIT license](https://github.com/mimshins/react-design-tokens/blob/main/LICENSE).
