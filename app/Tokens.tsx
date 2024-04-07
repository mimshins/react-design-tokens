"use client";

import * as React from "react";
import { VariantSelector } from "./theming";

type Props = {
  children?: React.ReactNode;
};

const Tokens = (props: Props) => {
  const { children } = props;

  return <VariantSelector variant="light">{children}</VariantSelector>;
};

export default Tokens;
