import { describe, expect, it } from "vitest";
import { CATALOG, publicItemForSource, PUBLIC_CATALOG, UPSTREAM_CATALOG } from "../src/catalog";
import { upstreamEditorSchemaFor } from "../src/editor-schema";
import { PARITY_BY_ID, PARITY_ENTRIES } from "../src/parity.generated";
import { EXAMPLE_CATALOG_IDS } from "../src/example-catalog";
import { isRemovedPopupOption, supportedUpstreamOption } from "../src/supported-options";

describe("upstream parity manifest", () => {
  it("has one source-derived mapping per documented upstream source", () => {
    expect(PARITY_ENTRIES).toHaveLength(UPSTREAM_CATALOG.length);
    expect(new Set(PARITY_ENTRIES.map((entry) => entry.upstreamId)).size).toBe(UPSTREAM_CATALOG.length);
    for (const source of UPSTREAM_CATALOG) {
      const parity = PARITY_BY_ID.get(source.upstreamId);
      const publicItem = publicItemForSource(source.upstreamId)!;
      expect(parity, source.upstreamId).toBeDefined();
      expect(parity?.rendererId).toBe(publicItem.upstreamId);
      expect(parity?.layoutProfile).not.toBe("generic");
      expect(parity?.sourceDigest).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("exposes every implemented upstream option and no nonfunctional switches", () => {
    for (const source of UPSTREAM_CATALOG) {
      const item = publicItemForSource(source.upstreamId)!;
      const parity = PARITY_BY_ID.get(source.upstreamId)!;
      const editorFields = new Set(upstreamEditorSchemaFor(item).map((field) => field.name));
      const variables = parity.variables.map((variable) => variable.name);
      expect(new Set(variables).size, item.upstreamId).toBe(variables.length);
      for (const variable of variables) {
        expect(editorFields.has(variable), `${item.upstreamId}: ${variable}`)
          .toBe(supportedUpstreamOption(item, variable));
      }
    }
  });

  it("preserves upstream defaults and assigns precise graphical selectors", () => {
    const binary = PARITY_BY_ID.get("card_binary_sensor")!;
    const variable = (name: string) => binary.variables.find((entry) => entry.name === name);
    expect(variable("ulm_card_binary_sensor_color")?.selector).toBe("color");
    expect(variable("ulm_card_binary_sensor_icon")?.selector).toBe("icon");
    expect(variable("ulm_card_binary_sensor_name")?.selector).toBe("text");
    expect(variable("ulm_card_binary_sensor_force_background_color")?.selector).toBe("boolean");
    const battery = PARITY_BY_ID.get("card_battery")!;
    expect(battery.variables.find((entry) => entry.name === "ulm_card_battery_battery_level_danger")?.defaultValue)
      .toBe("<null>");
  });

  it("removes unsupported popup options from every graphical editor", () => {
    for (const item of PUBLIC_CATALOG) {
      expect(upstreamEditorSchemaFor(item).some((field) => isRemovedPopupOption(field.name))).toBe(false);
      expect(item.variants?.includes("popup")).not.toBe(true);
    }
  });

  it("records every external frontend dependency as an item-specific deviation", () => {
    for (const parity of PARITY_ENTRIES) {
      const externalDependencies = parity.dependencies.filter((dependency) => dependency !== "button-card");
      expect(parity.deviations.length, parity.upstreamId).toBeGreaterThanOrEqual(externalDependencies.length);
    }
  });

  it("defines exactly one fixture for every public card", () => {
    expect(EXAMPLE_CATALOG_IDS).toHaveLength(CATALOG.length);
    expect(new Set(EXAMPLE_CATALOG_IDS).size).toBe(CATALOG.length);
    expect(new Set(EXAMPLE_CATALOG_IDS)).toEqual(new Set(CATALOG.map((item) => item.upstreamId)));
  });
});
