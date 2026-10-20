import { describe, expect, it } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { editorHelper, localize } from "../src/localize";
import { upstreamEditorSchemaFor } from "../src/editor-schema";
import { additionalEditorSchemaFor } from "../src/editor-schema";
import { populatedDefaultsFor } from "../src/defaults";
import type { EditorField } from "../src/editor-schema";

const flattenSchema = (schema: EditorField[]): EditorField[] =>
  schema.flatMap((field) => field.schema ? flattenSchema(field.schema) : field);

describe("family editor schemas", () => {
  it("uses one canonical primary entity selector in every card editor", () => {
    for (const item of CATALOG) {
      const schema = editorSchemaFor(item);
      expect(schema.filter((field) => field.name === "entity")).toHaveLength(
        item.family === "navigation" ||
          item.upstreamId === "card_scenes" ||
          item.family === "text"
          ? 0
          : 1,
      );
      expect(schema.some((field) => field.name === "primary_entity")).toBe(false);
    }
  });

  it("exposes readable battery intelligence controls in the main editor", () => {
    const battery = CATALOG.find((item) => item.upstreamId === "card_battery")!;
    const fields = editorSchemaFor(battery).map((field) => field.name);
    expect(fields).toEqual(expect.arrayContaining([
      "battery_warning_threshold",
      "battery_low_threshold",
      "battery_critical_threshold",
      "battery_healthy_color",
      "battery_warning_color",
      "battery_low_color",
      "battery_critical_color",
    ]));
    expect(upstreamEditorSchemaFor(battery).map((field) => field.name)).not.toEqual(expect.arrayContaining([
      "ulm_card_battery_battery_level_danger",
      "ulm_card_battery_battery_level_warning",
      "ulm_card_battery_color_battery_level_danger",
    ]));
  });  it("maps every registration to a known renderer/editor family", () => {
    const supported = new Set([
      "weather", "climate", "scene", "presence", "battery", "energy",
      "sensor", "media", "cover", "security", "navigation",
      "text", "camera", "control", "alarm-time", "door", "entity", "bar",
    ]);
    for (const item of CATALOG) expect(supported.has(item.family)).toBe(true);
  });

  it("keeps tablet selectors canonical and executable", () => {
    const tablet = CATALOG.find((item) => item.upstreamId === "custom_card_tablet")!;
    const schema = editorSchemaFor(tablet);
    expect(schema.find((field) => field.name === "tablet_button_motion_entity")?.selector).toEqual({
      entity: { domain: ["switch", "input_boolean"] },
    });
    expect(schema.find((field) => field.name === "tablet_button_display_entity")?.selector).toEqual({
      entity: { domain: ["light", "switch", "input_boolean"] },
    });
  });

  it("keeps the NAS editor limited to functioning controls", () => {
    const nas = CATALOG.find((item) => item.upstreamId === "custom_card_nas_metrics")!;
    const fields = editorSchemaFor(nas).map((field) => field.name);
    expect(nas.name).toBe("NAS Card");
    expect(fields).not.toContain("chart_type");
    expect(fields).not.toContain("graph_span");
    expect(fields).toEqual(expect.arrayContaining([
      "disk_entity",
      "temperature_entity",
      "temperature_max",
      "memory_entity",
      "memory_max",
      "cpu_entity",
      "cpu_max",
    ]));
  });

  it("exposes Better Thermostat climate controls and optional sensors", () => {
    const thermostat = CATALOG.find((item) => item.upstreamId === "custom_card_better_thermostat")!;
    const schema = flattenSchema(editorSchemaFor(thermostat));
    expect(schema.find((field) => field.name === "entity")?.selector).toEqual({
      entity: { domain: ["climate"] },
    });
    expect(schema.find((field) => field.name === "variant")?.selector).toMatchObject({
      select: { options: [{ value: "normal" }, { value: "compact" }] },
    });
    expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining([
      "window_sensor",
      "humidity_entity",
      "battery_entity",
      "show_temperature_control",
      "show_hvac_modes",
      "show_presets",
      "show_status",
      "thermostat_temp_step",
      "low_battery_threshold",
    ]));
  });

  it("exposes clear welcome-scene collapse controls", () => {
    const welcome = CATALOG.find((item) => item.upstreamId === "card_welcome_scenes")!;
    const schema = editorSchemaFor(welcome);
    expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining([
      "collapse_entity", "collapsed",
    ]));
    expect(schema.find((field) => field.name === "entity")?.selector).toEqual({
      entity: {},
    });
    expect(schema.find((field) => field.name === "settings_path")?.selector).toEqual({
      navigation: {},
    });
  });

  it("gives every advanced editor option a user-friendly label and explanation", () => {
    for (const item of CATALOG) {
      for (const field of upstreamEditorSchemaFor(item)) {
        const label = localize(undefined, field.name);
        expect(label).not.toMatch(/\bUlm\b/i);
        expect(label).not.toContain("_");
        expect(label).not.toMatch(/\bEnable\b/i);
        expect(editorHelper(field.name)).toBeTruthy();
        expect(editorHelper(field.name)).not.toMatch(/\bulm\b/i);
      }
    }
  });

  it("does not expose internal ULM prefixes in any editor label", () => {
    for (const item of CATALOG) {
      for (const field of [...editorSchemaFor(item), ...upstreamEditorSchemaFor(item)]) {
        expect(localize(undefined, field.name)).not.toMatch(/\bUlm\b/i);
        expect(editorHelper(field.name) ?? "").not.toMatch(/\bUlm\b/i);
      }
      expect(item.name).not.toMatch(/\bUlm\b/i);
      expect(item.description).not.toMatch(/\bUlm\b/i);
    }
  });

  it("gives every color picker a visible default without duplicate controls", () => {
    for (const item of CATALOG) {
      const colorFields = flattenSchema([
        ...editorSchemaFor(item),
        ...upstreamEditorSchemaFor(item),
      ]).filter((field) => field.selector?.ui_color);
      const names = colorFields.map((field) => field.name);
      expect(new Set(names).size, `${item.upstreamId} has duplicate color controls`).toBe(names.length);
      for (const field of colorFields) {
        const selector = field.selector as { ui_color?: { default_color?: string } };
        expect(
          selector.ui_color?.default_color,
          `${item.upstreamId}.${field.name} needs a default color`,
        ).toBeTruthy();
      }
    }
  });

  it("uses clear labels for camera controls", () => {
    expect(localize(undefined, "show_name")).toBe("Show name");
    expect(localize(undefined, "camera_view")).toBe("Camera view");
    expect(localize(undefined, "fit_mode")).toBe("Image fit");
    expect(localize(undefined, "aspect_ratio")).toBe("Aspect ratio");
    expect(localize(undefined, "image_height")).toBe("Custom image height");
    expect(localize(undefined, "ulm_language")).not.toMatch(/\bUlm\b/i);
  });

  it("explains every standard editor field", () => {
    const selfExplanatory = new Set(["entities"]);
    for (const item of CATALOG) {
      for (const field of flattenSchema(editorSchemaFor(item))) {
        if (!selfExplanatory.has(field.name)) expect(editorHelper(field.name)).toBeTruthy();
      }
    }
  });

  it("provides Mushroom-style presentation controls on every card editor", () => {
    const expected = [
      "name", "layout", "multiline_secondary",
      "fill_container", "primary_info", "secondary_info",
    ];
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const schema = editorSchemaFor(item);
      const flattened = flattenSchema(schema);
      expect(flattened.map((field) => field.name)).toEqual(expect.arrayContaining(expected));
      expect(flattened.map((field) => field.name)).not.toContain("name_mode");
      const hasConfigurableIcon = flattened.some((field) => field.name === "icon");
      for (const name of [
        "layout", "primary_info", "secondary_info",
        ...(hasConfigurableIcon ? ["icon_type"] : []),
      ]) {
        expect(flattened.find((field) => field.name === name)?.selector).toHaveProperty("select");
      }
      expect(flattened.find((field) => field.name === "multiline_secondary")?.selector)
        .toHaveProperty("boolean");
      const name = flattened.find((field) => field.name === "name");
      expect(name).toMatchObject({
        selector: { entity_name: {} },
        context: { entity: "entity" },
      });

      const icon = flattened.find((field) => field.name === "icon");
      if (hasConfigurableIcon) expect(icon?.context).toEqual({ icon_entity: "entity" });
      else expect(flattened.map((field) => field.name)).not.toContain("icon_type");
      const presentationStart = schema.findIndex((field) => field.name === "name");
      const entityIndex = schema.findIndex((field) => field.name === "entity");
      expect(presentationStart).toBe(entityIndex >= 0 ? entityIndex + 1 : 0);
      expect(schema.slice(
        presentationStart,
        presentationStart + (hasConfigurableIcon ? 6 : 5),
      ).map((field) => field.name))
        .toEqual(hasConfigurableIcon
          ? ["name", "icon", "layout", "multiline_secondary", "fill_container", ""]
          : ["name", "layout", "multiline_secondary", "fill_container", ""]);
      const layoutField = flattened.find((field) => field.name === "layout");
      expect(layoutField).toMatchObject({
        selector: {
          select: {
            mode: "box",
            options: [
              {
                value: "horizontal",
                image: {
                  src: "/static/images/form/tile_content_layout_horizontal.svg",
                  src_dark: "/static/images/form/tile_content_layout_horizontal_dark.svg",
                },
              },
              {
                value: "vertical",
                image: {
                  src: "/static/images/form/tile_content_layout_vertical.svg",
                  src_dark: "/static/images/form/tile_content_layout_vertical_dark.svg",
                },
              },
            ],
          },
        },
      });
      expect(schema[presentationStart + (hasConfigurableIcon ? 5 : 4)]).toMatchObject({
        type: "grid",
        schema: hasConfigurableIcon
          ? [{ name: "primary_info" }, { name: "secondary_info" }, { name: "icon_type" }]
          : [{ name: "primary_info" }, { name: "secondary_info" }],
      });
    }
  });

  it("leaves optional Mushroom presentation fields empty for newly created cards", () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const defaults = populatedDefaultsFor(item);
      expect(defaults.layout).toBe("default");
      expect(defaults.primary_info).toBeUndefined();
      expect(defaults.secondary_info).toBeUndefined();
    }
  });

  it("provides a multi-select and one linked entity per selected Flower bar", () => {
    const flower = CATALOG.find((item) => item.upstreamId === "custom_card_plant")!;
    const schema = flattenSchema(editorSchemaFor(flower, {
      type: `custom:${flower.tag}`,
      entity: "sensor.soil_moisture",
      ulm_card_flower_show_bars: ["temperature", "moisture"],
    }));
    expect(schema.find((field) => field.name === "ulm_card_flower_show_bars")?.selector)
      .toMatchObject({
        select: {
          multiple: true,
          options: expect.arrayContaining([
            { value: "temperature", label: "Temperature" },
            { value: "moisture", label: "Moisture" },
            { value: "conductivity", label: "Conductivity" },
          ]),
        },
      });
    expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining([
      "temperature_entity",
      "moisture_entity",
    ]));
    expect(schema.map((field) => field.name)).not.toEqual(expect.arrayContaining([
      "humidity_entity",
      "conductivity_entity",
      "illuminance_entity",
      "dli_entity",
      "ulm_card_flower_entity",
    ]));
  });

  it("does not repeat main editor fields in additional appearance and controls", () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const configured = new Set(flattenSchema(editorSchemaFor(item)).map((field) => field.name));
      expect(additionalEditorSchemaFor(item).filter((field) => configured.has(field.name))).toEqual([]);
    }
    const speedtest = CATALOG.find((item) => item.upstreamId === "custom_card_speedtest_gauges")!;
    expect(additionalEditorSchemaFor(speedtest)).toEqual([]);
  });

  it("gives Bar Card only its source-specific controls", () => {
    const bar = CATALOG.find((item) => item.upstreamId === "custom_card_bar_card")!;
    expect(bar.family).toBe("bar");
    const core = editorSchemaFor(bar).map((field) => field.name);
    expect(core).not.toEqual(expect.arrayContaining(["show_graph", "min_entity", "max_entity"]));
    expect(upstreamEditorSchemaFor(bar).map((field) => field.name)).toEqual(expect.arrayContaining([
      "ulm_custom_card_bar_card_color",
      "ulm_custom_card_bar_card_icon",
      "ulm_custom_card_bar_card_icon_color",
      "ulm_custom_card_bar_card_indicator",
      "ulm_custom_card_bar_card_min",
      "ulm_custom_card_bar_card_max",
      "ulm_custom_card_bar_card_show_icon",
      "ulm_custom_card_bar_card_value",
    ]));
  });

  it("gives Waste Collection semantic stream controls without graph settings", () => {
    const waste = CATALOG.find((item) => item.upstreamId === "custom_card_trash")!;
    const core = editorSchemaFor(waste);
    expect(core.find((field) => field.name === "entity")?.selector).toEqual({
      entity: { domain: ["sensor", "calendar"] },
    });
    expect(core.find((field) => field.name === "today_entity")?.selector).toEqual({
      entity: { domain: ["sensor"] },
    });
    expect(core.find((field) => field.name === "tomorrow_entity")?.selector).toEqual({
      entity: { domain: ["sensor"] },
    });
    expect(core.map((field) => field.name)).toEqual(expect.arrayContaining([
      "show_today",
      "show_tomorrow",
    ]));
    expect(core.map((field) => field.name)).not.toContain("show_graph");
  });
});
