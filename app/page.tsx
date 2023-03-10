"use client";

import { ThemeProvider } from "./theming";

const Page = () => {
  return (
    <ThemeProvider
      theme={{ colors: { neutral: { text: { tertiary: "#000" } } } }}
    >
      <h1>Dev Page</h1>
    </ThemeProvider>
  );
};

export default Page;
