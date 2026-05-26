"use client";

import { VariantSelector } from "./theming.ts";

const Page = () => {
  return (
    <>
      <span>Light</span>
      <VariantSelector variant="dark">
        <span>Dark</span>
      </VariantSelector>
    </>
  );
};

export default Page;
