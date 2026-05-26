import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { createTheming } from "./create-theming.tsx";

const tokens = {
  variants: {
    dark: { colors: { primary: "d1", secondary: "d2" } },
    light: { colors: { primary: "l1", secondary: "l2" } },
  },
  common: { space: "8px" },
};

const {
  VariantSelector,
  useTokens,
  useVariant,
  generateCSSVariablesAsInlineStyle,
  generateStylesheet,
} = createTheming(tokens);

// Helper component to read tokens inside a test
const TokenReader = () => {
  const t = useTokens();

  return <div data-testid="tokens">{JSON.stringify(t)}</div>;
};

const VariantReader = () => {
  const v = useVariant();

  return <div data-testid="variant">{String(v)}</div>;
};

describe("VariantSelector", () => {
  it("renders children", () => {
    render(
      <VariantSelector variant="dark">
        <span>child</span>
      </VariantSelector>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("renders as div by default", () => {
    const { container } = render(
      <VariantSelector variant="dark">x</VariantSelector>,
    );

    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as the element specified by `as` prop", () => {
    const { container } = render(
      <VariantSelector
        variant="dark"
        as="section"
      >
        x
      </VariantSelector>,
    );

    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("injects CSS variables as inline style", () => {
    const { container } = render(
      <VariantSelector variant="dark">x</VariantSelector>,
    );

    const el = container.firstChild as HTMLElement;

    expect(el.style.getPropertyValue("--colors-primary")).toBe("d1");
    expect(el.style.getPropertyValue("--space")).toBe("8px");
  });

  it("throws for an unknown variant", () => {
    expect(() =>
      render(<VariantSelector variant={"unknown" as never}>x</VariantSelector>),
    ).toThrow();
  });

  it("sets data-variant attribute", () => {
    const { container } = render(
      <VariantSelector variant="dark">x</VariantSelector>,
    );

    expect((container.firstChild as HTMLElement).dataset["variant"]).toBe(
      "dark",
    );
  });

  it("does not regenerate CSS variables when disableCSSVariableGeneration is true", () => {
    const { container } = render(
      <VariantSelector
        variant="dark"
        disableCSSVariableGeneration
      >
        x
      </VariantSelector>,
    );

    const el = container.firstChild as HTMLElement;

    expect(el.style.getPropertyValue("--colors-primary")).toBe("");
  });
});

describe("useTokens", () => {
  it("returns merged variant + common tokens", () => {
    render(
      <VariantSelector variant="dark">
        <TokenReader />
      </VariantSelector>,
    );
    const parsed = JSON.parse(
      screen.getByTestId("tokens").textContent ?? "{}",
    ) as Record<string, unknown>;

    expect((parsed["colors"] as Record<string, unknown>)?.["primary"]).toBe(
      "d1",
    );
    expect(parsed["space"]).toBe("8px");
  });

  it("common tokens override variant tokens on key collision", () => {
    const { VariantSelector: VS, useTokens: ut } = createTheming({
      variants: { a: { x: "variant" } },
      common: { x: "common" },
    });

    const Reader = () => {
      const t = ut();

      return <div data-testid="x">{(t as Record<string, string>)["x"]}</div>;
    };

    render(
      <VS variant="a">
        <Reader />
      </VS>,
    );

    expect(screen.getByTestId("x").textContent).toBe("common");
  });

  it("returns empty object in production when outside provider", () => {
    const original = process.env["NODE_ENV"];

    process.env["NODE_ENV"] = "production";
    const Reader = () => {
      const t = useTokens();

      return <div data-testid="t">{JSON.stringify(t)}</div>;
    };

    render(<Reader />);
    expect(screen.getByTestId("t").textContent).toBe("{}");
    process.env["NODE_ENV"] = original;
  });

  it("throws in development when outside provider", () => {
    const Reader = () => {
      useTokens();
      return null;
    };

    expect(() => render(<Reader />)).toThrow();
  });
});

describe("useVariant", () => {
  it("returns the active variant key", () => {
    render(
      <VariantSelector variant="light">
        <VariantReader />
      </VariantSelector>,
    );
    expect(screen.getByTestId("variant").textContent).toBe("light");
  });

  it("returns the nearest variant in nested selectors", () => {
    const { getAllByTestId } = render(
      <VariantSelector variant="dark">
        <VariantSelector variant="light">
          <VariantReader />
        </VariantSelector>
      </VariantSelector>,
    );

    // inner VariantReader should read "light"
    const els = getAllByTestId("variant");

    expect(els[els.length - 1]?.textContent).toBe("light");
  });

  it("throws when outside provider", () => {
    const Reader = () => {
      useVariant();
      return null;
    };

    expect(() => render(<Reader />)).toThrow();
  });
});

describe("generateCSSVariablesAsInlineStyle", () => {
  it("returns inline style object for a valid variant", () => {
    const result = generateCSSVariablesAsInlineStyle("dark");

    expect(result).toMatchObject({
      "--colors-primary": "d1",
      "--space": "8px",
    });
  });

  it("returns null for an unknown variant", () => {
    expect(generateCSSVariablesAsInlineStyle("unknown" as never)).toBeNull();
  });

  it("omits common tokens when disableCommonTokensGeneration is true", () => {
    const result = generateCSSVariablesAsInlineStyle("dark", {
      disableCommonTokensGeneration: true,
    });

    expect(result?.["--space"]).toBeUndefined();
    expect(result?.["--colors-primary"]).toBe("d1");
  });
});

describe("generateStylesheet", () => {
  it("returns a CSS string with :root selector by default", () => {
    const result = generateStylesheet("dark");

    expect(result).toMatch(/^:root \{/);
    expect(result).toContain("--colors-primary: d1;");
    expect(result).toContain("--space: 8px;");
  });

  it("uses a custom selector", () => {
    const result = generateStylesheet("dark", {
      selector: "[data-theme='dark']",
    });

    expect(result).toMatch(/^\[data-theme='dark'\] \{/);
  });

  it("returns null for an unknown variant", () => {
    expect(generateStylesheet("unknown" as never)).toBeNull();
  });

  it("omits common tokens when disableCommonTokensGeneration is true", () => {
    const result = generateStylesheet("dark", {
      disableCommonTokensGeneration: true,
    });

    expect(result).not.toContain("--space");
    expect(result).toContain("--colors-primary: d1;");
  });
});
