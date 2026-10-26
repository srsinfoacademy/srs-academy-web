import path from "node:path";

import { defineConfig } from "vitest/config";

/** Unit tests for pure modules. `@/` resolves to src/ like the app's tsconfig paths. */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["src/**/*.test.ts"], environment: "node", passWithNoTests: true },
});
