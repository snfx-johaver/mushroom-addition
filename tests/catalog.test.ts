import { describe, expect, it } from "vitest";
import { CATALOG, PUBLIC_CATALOG, UPSTREAM_VARIANTS } from "../src/catalog";

describe("catalog coverage", () => {
  it("has one unique registration per upstream component", () => {
    expect(new Set(PUBLIC_CATALOG.map((item) => item.upstreamId)).size).toBe(PUBLIC_CATALOG.length);
    expect(new Set(CATALOG.map((item) => item.tag)).size).toBe(CATALOG.length);
  });

  it("covers each component family with traceable source paths", () => {
    for (const item of PUBLIC_CATALOG) {
      expect(item.sourcePath).toBeTruthy();
      expect(item.family).toBeTruthy();
      expect(item.tag).toMatch(/^mushroom-addition-/);
    }
  });

  it("includes base cards, base chips, custom cards and custom chips", () => {
    expect(PUBLIC_CATALOG.some((item) => item.upstreamId === "card_light")).toBe(true);
    expect(PUBLIC_CATALOG.some((item) => item.upstreamId === "chip_alarm")).toBe(true);
    expect(PUBLIC_CATALOG.some((item) => item.upstreamId === "custom_card_camera")).toBe(true);
    expect(PUBLIC_CATALOG.some((item) => item.upstreamId === "custom_chip_moon")).toBe(true);
  });

  it("maps every popup to an editable card variant", () => {
    expect(UPSTREAM_VARIANTS).toHaveLength(7);
    for (const variant of UPSTREAM_VARIANTS) {
      const component = PUBLIC_CATALOG.find((item) => item.upstreamId === variant.component);
      expect(component?.variants).toContain("popup");
      expect(variant.sourcePath).toContain("/popup_templates/popups/");
    }
  });
});
