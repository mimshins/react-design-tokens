"use client";

import * as React from "react";
import { getVariablesAsStyles, theme, ThemeProvider } from "./theming";

const RootLayout = (props: { children: React.ReactNode }) => (
  <html lang="en" style={getVariablesAsStyles(theme)}>
    <body>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
