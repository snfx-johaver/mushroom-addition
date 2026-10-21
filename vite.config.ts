import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const notices = [
  "THIRD_PARTY_NOTICES.md",
  "licenses/SNFX-Synology-cards-NOTICE",
  "licenses/SNFX-Synology-cards-LICENSE",
  "licenses/Material-Design-Icons-LICENSE",
  "licenses/Lit-LICENSE",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8").trim()).join("\n\n");

export default defineConfig({
  esbuild: { legalComments: "inline" },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MushroomCardsAddition",
      formats: ["es"],
      fileName: () => "mushroom-cards-addition.js",
    },
    minify: "esbuild",
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: { banner: `/*!\n${notices}\n*/` },
    },
  },
});
