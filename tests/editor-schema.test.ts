import { describe, expect, it } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { editorHelper, localize } from "../src/localize";
import { upstreamEditorSchemaFor } from "../src/editor-schema";

describe("family editor schemas", () => {
  it("uses one canonical primary entity selector in every card editor", () => {
    for (const item of CATALOG.filter((entry) => entry.kind !== "container")) {
      const schema = editorSchemaFor(item);
      expect(schema.filter((field) => field.name === "entity")).toHaveLength(
        item.family === "navigation" || item.family === "text" ? 0 : 1,
      );
      expect(schema.some((field) => field.name === "primary_entity")).toBe(false);
    }
  });

  it("gives weather unique, domain-filtered fields", () => {
    const weather = CATALOG.find((item) => item.upstreamId === "card_weather")!;
    const schema = editorSchemaFor(weather);
    expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining([
      "entity", "temperature_entity", "humidity_entity", "show_forecast",
    ]));
    expect(schema).not.toContainEqual(expect.objectContaining({ name: "battery_entity" }));
    expect(schema.find((field) => field.name === "entity")?.selector).toEqual({
      entity: { domain: ["weather"] },
    });
  });

  it("uses distinct schemas for every major family", () => {
    const families = ["weather", "climate", "light", "scene", "presence", "battery", "energy", "sensor", "media", "cover", "vacuum", "security", "navigation"];
    const signatures = families.map((family) => {
      const item = CATALOG.find((entry) => entry.family === family)!;
      return editorSchemaFor(item).map((field) => field.name).join(",");
    });
    expect(new Set(signatures).size).toBeGreaterThanOrEqual(9);
  });

  it("maps every registration to a known renderer/editor family", () => {
    const supported = new Set([
      "weather", "climate", "light", "scene", "presence", "battery", "energy",
      "sensor", "media", "cover", "vacuum", "security", "navigation", "chips",
      "text", "camera", "control", "alarm-time", "door", "entity",
    ]);
    for (const item of CATALOG) expect(supported.has(item.family)).toBe(true);
  });

  it("maps specialized cards to the correct primary domains", () => {
    const byId = (id: string) => CATALOG.find((item) => item.upstreamId === id)!;
    expect(byId("card_power_outlet")).toMatchObject({
      family: "control",
      preferredDomains: ["switch", "light"],
    });
    expect(byId("card_welcome_scenes").family).toBe("scene");
    expect(byId("chip_alarm").preferredDomains).toEqual(["alarm_control_panel"]);
    expect(byId("custom_card_alarm_time")).toMatchObject({
      family: "alarm-time",
      preferredDomains: ["input_boolean"],
    });
    expect(editorSchemaFor(byId("custom_card_alarm_time")).map((field) => field.name))
      .toContain("datetime_entity");
    expect(byId("custom_card_nik_door")).toMatchObject({
      family: "door",
      preferredDomains: ["sensor"],
    });
    expect(editorSchemaFor(byId("custom_card_nik_door")).map((field) => field.name))
      .toEqual(expect.arrayContaining(["lock_entity", "battery_entity"]));
  });

  it("gives every advanced editor option a user-friendly label and explanation", () => {
    for (const item of CATALOG) {
      for (const field of upstreamEditorSchemaFor(item)) {
        const label = localize(undefined, field.name);
        expect(label).not.toMatch(/\bUlm\b/i);
        expect(label).not.toContain("_");
        expect(label).not.toMatch(/\bEnable\b/i);
        expect(editorHelper(field.name)).toBeTruthy();
      }
    }
  });

  it("explains every standard editor field", () => {
    const selfExplanatory = new Set(["entities"]);
    for (const item of CATALOG) {
      for (const field of editorSchemaFor(item)) {
        if (!selfExplanatory.has(field.name)) expect(editorHelper(field.name)).toBeTruthy();
      }
    }
  });

  it("uses dropdowns for finite weather choices and percentage sliders for ranges", () => {
    const weather = CATALOG.find((item) => item.upstreamId === "card_weather")!;
    const weatherFields = upstreamEditorSchemaFor(weather);
    expect(weatherFields.find((field) => field.name === "ulm_card_weather_primary_info")?.selector)
      .toMatchObject({ select: { mode: "dropdown" } });
    expect(weatherFields.find((field) => field.name === "ulm_card_weather_secondary_info")?.selector)
      .toMatchObject({ select: { mode: "dropdown" } });

    const light = CATALOG.find((item) => item.upstreamId === "card_light")!;
    expect(upstreamEditorSchemaFor(light)
      .find((field) => field.name === "ulm_card_light_brightness_medium")?.selector)
      .toEqual({ number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } });
  });

  it("provides Mushroom-style presentation controls on every card editor", () => {
    const expected = [
      "name_mode", "name", "icon", "icon_type", "layout",
      "fill_container", "primary_info", "secondary_info",
    ];
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const schema = editorSchemaFor(item);
      expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining(expected));
      for (const name of ["name_mode", "icon_type", "layout", "primary_info", "secondary_info"]) {
        expect(schema.find((field) => field.name === name)?.selector).toHaveProperty("select");
      }
    }
  });
});
