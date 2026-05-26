import reactPlugin from "@vitejs/plugin-react";
import tsconfigPathsPlugin from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

const config = defineConfig({
  plugins: [reactPlugin(), tsconfigPathsPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: ["test.setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "src/**/index.ts",
        "src/**/types.ts",
        "src/**/coverage/**",
      ],
      thresholds: {
        "100": true,
      },
    },
  },
});

export default config;
