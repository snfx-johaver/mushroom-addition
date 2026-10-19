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

  it("includes default and custom cards", () => {
    expect(PUBLIC_CATALOG.some((item) => item.upstreamId === "card_graph")).toBe(true);
    expect(PUBLIC_CATALOG.some((item) => item.upstreamId === "custom_card_camera")).toBe(true);
    expect(PUBLIC_CATALOG.find((item) => item.upstreamId === "custom_card_better_thermostat"))
      .toMatchObject({ variants: ["normal", "compact"], preferredDomains: ["climate"] });
  });

  it("matches the documented source counts and keeps the custom card catalog public", () => {
    const sourceCount = (category: string) =>
      UPSTREAM_CATALOG.filter((item) => item.category === category).length;
    expect(sourceCount("default-card")).toBe(6);
    expect(sourceCount("custom-card")).toBe(29);
    expect(PUBLIC_CATALOG.filter((item) => item.category === "custom-card")).toHaveLength(28);
  });

  it("keeps removed contributor names out of renamed public card metadata", () => {
    const renamedSources = [
      "custom_card_trash",
      "custom_card_entity_overview",
      "custom_card_internet_speed",
      "custom_card_weather_metrics",
      "custom_card_gauge",
      "custom_card_printer",
      "custom_card_nas_metrics",
      "custom_card_tablet",
      "custom_card_plant",
      "custom_card_pollen",
    ];
    const renamedItems = PUBLIC_CATALOG.filter((candidate) => renamedSources.includes(candidate.upstreamId));
    expect(renamedItems.map((item) => item.name)).toEqual([
      "Trash Card",
      "Entity Overview Card",
      "Internet Speed Card",
      "Weather Metrics Card",
      "Gauge Card",
      "Printer Card",
      "NAS Card",
      "Tablet Card",
      "Flower Card",
      "Pollen Card",
    ]);
  });

  it("keeps implementation helpers out of the public picker", () => {
    for (const helper of SOURCE_ONLY_HELPERS) {
      expect(UPSTREAM_CATALOG.some((item) => item.upstreamId === helper.id)).toBe(false);
      expect(PUBLIC_CATALOG.some((item) => item.upstreamId === helper.id)).toBe(false);
    }
  });

  it("groups only explicit same-goal sources and preserves hidden migration aliases", () => {
    expect(LEGACY_ALIASES).toHaveLength(
      COMPONENT_GROUPS.reduce((total, group) => total + Object.keys(group.sources).length - 1, 0),
    );
    for (const alias of LEGACY_ALIASES) {
      expect(PUBLIC_CATALOG.some((item) => item.tag === alias.tag)).toBe(false);
      expect(CATALOG.some((item) => item.tag === alias.targetTag)).toBe(true);
    }
  });

  it("inventories upstream popups without exposing nonfunctional variants", () => {
    expect(UPSTREAM_VARIANTS).toHaveLength(1);
    for (const variant of UPSTREAM_VARIANTS) {
      const component = PUBLIC_CATALOG.find((item) => item.upstreamId === variant.component);
      expect(component?.variants).not.toContain("popup");
      expect(variant.sourcePath).toContain("/popups/");
    }
  });
});
