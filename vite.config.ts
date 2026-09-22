import { defineConfig } from "vite";

export default defineConfig({
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
    },
  },
});
