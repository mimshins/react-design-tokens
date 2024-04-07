import * as React from "react";
import Tokens from "./Tokens";

const RootLayout = (props: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <Tokens>{props.children}</Tokens>
    </body>
  </html>
);

export default RootLayout;
