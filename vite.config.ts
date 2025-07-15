/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      exclude: [
        // Arquivos de configuração
        "tailwind.config.js",
        "postcss.config.js",
        "vite.config.ts",
        "vitest.config.ts",
        "eslint.config.js",
        "tsconfig*.json",

        // Arquivos de entrada e setup
        "main.tsx",
        "src/main.tsx",
        "src/test/setup.ts",
        "src/vite-env.d.ts",

        // Arquivos de tipos
        "**/*.d.ts",
        "src/types/**",

        // Arquivos de build e dependências
        "dist/**",
        "build/**",
        "node_modules/**",

        // Arquivos de testes
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "src/__tests__/**",

        // Arquivos de assets
        "src/assets/**",
        "public/**",

        // Mock API
        "mock-api/**",

        // Arquivos de configuração do projeto
        "*.config.js",
        "*.config.ts",
        "yarn.lock",
        "package.json",
        "README.md",
        ".nvmrc",
        ".gitignore",
      ],
      reporter: ["text", "json", "html"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
