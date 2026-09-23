import { describe, expect, it } from "vitest";
import {
  CATALOG, COMPONENT_GROUPS, LEGACY_ALIASES, publicItemForSource,
  PUBLIC_CATALOG, SOURCE_ONLY_HELPERS, UPSTREAM_CATALOG, UPSTREAM_VARIANTS,
} from "../src/catalog";

describe("catalog coverage", () => {
  it("has one unique public registration and maps every documented source once", () => {
    expect(new Set(PUBLIC_CATALOG.map((item) => item.upstreamId)).size).toBe(PUBLIC_CATALOG.length);
    expect(new Set(CATALOG.map((item) => item.tag)).size).toBe(CATALOG.length);
    expect(new Set(UPSTREAM_CATALOG.map((item) => item.upstreamId)).size).toBe(UPSTREAM_CATALOG.length);
    for (const source of UPSTREAM_CATALOG) expect(publicItemForSource(source.upstreamId)).toBeDefined();
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

  it("matches the documented source counts and keeps 50+ custom cards public", () => {
    const sourceCount = (category: string) =>
      UPSTREAM_CATALOG.filter((item) => item.category === category).length;
    expect(sourceCount("default-card")).toBe(24);
    expect(sourceCount("default-chip")).toBe(12);
    expect(sourceCount("custom-card")).toBe(62);
    expect(sourceCount("custom-chip")).toBe(7);
    expect(PUBLIC_CATALOG.filter((item) => item.category === "custom-card")).toHaveLength(58);
  });

  it("keeps implementation helpers out of the public picker", () => {
    for (const helper of SOURCE_ONLY_HELPERS) {
      expect(UPSTREAM_CATALOG.some((item) => item.upstreamId === helper.id)).toBe(false);
      expect(PUBLIC_CATALOG.some((item) => item.upstreamId === helper.id)).toBe(false);
    }
  });

  it("groups only explicit same-goal sources and preserves hidden migration aliases", () => {
    expect(COMPONENT_GROUPS.find((group) => group.canonical === "custom_card_person_info")?.sources)
      .toEqual({
        custom_card_person_info: "full",
        custom_card_person_info_small: "small",
      });
    expect(LEGACY_ALIASES).toHaveLength(
      COMPONENT_GROUPS.reduce((total, group) => total + Object.keys(group.sources).length - 1, 0),
    );
    for (const alias of LEGACY_ALIASES) {
      expect(PUBLIC_CATALOG.some((item) => item.tag === alias.tag)).toBe(false);
      expect(CATALOG.some((item) => item.tag === alias.targetTag)).toBe(true);
    }
  });

  it("inventories upstream popups without exposing nonfunctional variants", () => {
    expect(UPSTREAM_VARIANTS).toHaveLength(7);
    for (const variant of UPSTREAM_VARIANTS) {
      const component = PUBLIC_CATALOG.find((item) => item.upstreamId === variant.component);
      expect(component?.variants).not.toContain("popup");
      expect(variant.sourcePath).toContain("/popup_templates/popups/");
    }
  });
});
