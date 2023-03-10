"use client";

import * as React from "react";
import { theme, ThemeProvider } from "./theming";

const RootLayout = (props: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
