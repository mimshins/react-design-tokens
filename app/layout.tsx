"use client";

import * as React from "react";
import { getVariablesAsStyles, theme, ThemeProvider } from "./theming";

const ssrCssVariables = getVariablesAsStyles(theme);

const RootLayout = (props: { children: React.ReactNode }) => (
  <html lang="en" style={ssrCssVariables}>
    <body>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
