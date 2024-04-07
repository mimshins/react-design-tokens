import { create } from "../lib";

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
    boolean: true,
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
    boolean: false,
  },
};

export const { VariantSelector, useTokens } = create(variants);
