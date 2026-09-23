import type { CatalogItem } from "./types";
import { PARITY_BY_ID } from "./parity.generated";
import { supportedUpstreamOption } from "./supported-options";

export interface EditorField {
  name: string;
  selector: Record<string, unknown>;
}

const entity = (domains?: string[], name = "entity"): EditorField => ({
  name,
  selector: { entity: domains?.length ? { domain: domains } : {} },
});
const text = (name: string): EditorField => ({ name, selector: { text: {} } });
const toggle = (name: string): EditorField => ({ name, selector: { boolean: {} } });
const number = (name: string, min = 1, max = 168): EditorField => ({
  name,
  selector: { number: { min, max, mode: "box" } },
});
const action = (name: string): EditorField => ({ name, selector: { ui_action: {} } });
const select = (name: string, options: Array<{ value: string; label: string }>): EditorField => ({
  name,
  selector: { select: { mode: "dropdown", options } },
});

const percentageOptions = new Set([
  "ulm_card_light_enable_slider_minSet",
  "ulm_card_light_enable_slider_maxSet",
  "ulm_card_light_brightness_low",
  "ulm_card_light_brightness_medium",
  "ulm_card_light_brightness_high",
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning",
  "ulm_card_cover_slider_min",
  "ulm_card_cover_slider_max",
  "ulm_card_fan_slider_min",
  "ulm_card_fan_slider_max",
]);

const choiceOptions: Record<string, Array<{ value: string; label: string }>> = {
  ulm_card_weather_primary_info: [
    { value: "extrema", label: "Today's high and low temperatures" },
    { value: "none", label: "Do not show extra information" },
  ],
  ulm_card_weather_secondary_info: [
    { value: "precipitation", label: "Precipitation chance or amount" },
    { value: "none", label: "Do not show extra information" },
  ],
};

const common = (item: CatalogItem): EditorField[] => [
  entity(item.preferredDomains),
  text("name"),
  { name: "icon", selector: { icon: {} } },
];

const schemas: Record<string, (item: CatalogItem) => EditorField[]> = {
  weather: (item) => [
    ...common(item),
    entity(["sensor"], "temperature_entity"),
    entity(["sensor"], "humidity_entity"),
    toggle("show_forecast"),
  ],
  climate: (item) => [...common(item), entity(["sensor"], "humidity_entity"), toggle("show_controls")],
  light: (item) => [...common(item)],
  scene: (item) => [...common(item), { name: "entities", selector: { entity: { domain: ["scene"], multiple: true } } }],
  presence: (item) => [...common(item), entity(["sensor"], "battery_entity"), entity(["sensor"], "eta_entity"), entity(["sensor"], "address_entity"), toggle("use_entity_picture")],
  battery: (item) => [...common(item)],
  energy: (item) => [...common(item), entity(["sensor"], "min_entity"), entity(["sensor"], "max_entity"), toggle("show_graph")],
  sensor: (item) => [...common(item), toggle("show_graph")],
  media: (item) => [...common(item), toggle("show_controls"), ...(item.upstreamId === "custom_card_playstation" ? [{ name: "console_platform", selector: { select: { options: ["ps5", "xbox"] } } }] : [])],
  cover: (item) => [...common(item), toggle("show_controls")],
  vacuum: (item) => [...common(item), toggle("show_controls")],
  security: (item) => [...common(item)],
  navigation: () => [text("name"), { name: "icon", selector: { icon: {} } }, text("navigation_path")],
  chips: () => [],
  text: () => [text("name"), text("secondary"), { name: "icon", selector: { icon: {} } }],
  camera: (item) => [...common(item)],
  control: (item) => [
    ...common(item),
    ...(/power_outlet|more_power_outlet/.test(item.upstreamId) ? [entity(["sensor"], "graph_entity"), toggle("show_graph")] : []),
    toggle("show_controls"),
  ],
  "alarm-time": (item) => [...common(item), entity(["input_datetime"], "datetime_entity"), toggle("show_controls")],
  door: (item) => [...common(item), entity(["lock"], "lock_entity"), entity(["sensor"], "battery_entity"), toggle("show_controls")],
  entity: (item) => [...common(item), text("secondary")],
};

export const editorSchemaFor = (item: CatalogItem): EditorField[] => [
  ...(schemas[item.family] ?? schemas.entity)(item),
  action("tap_action"),
  action("hold_action"),
  action("double_tap_action"),
];

export const upstreamEditorSchemaFor = (item: CatalogItem): EditorField[] => {
  const parity = PARITY_BY_ID.get(item.upstreamId);
  if (!parity) return [];
  return parity.variables.filter((variable) => supportedUpstreamOption(item, variable.name)).map((variable) => {
    const choices = choiceOptions[variable.name];
    if (choices) return select(variable.name, choices);
    if (percentageOptions.has(variable.name)) {
      return {
        name: variable.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } },
      };
    }
    switch (variable.selector) {
      case "entity": return entity(undefined, variable.name);
      case "entity-multiple": return {
        name: variable.name,
        selector: { entity: { multiple: true } },
      };
      case "action": return action(variable.name);
      case "icon": return { name: variable.name, selector: { icon: {} } };
      case "color": return { name: variable.name, selector: { ui_color: {} } };
      case "boolean": return toggle(variable.name);
      case "number": return number(variable.name, -100000, 100000);
      case "object": return { name: variable.name, selector: { object: {} } };
      default: return text(variable.name);
    }
  });
};
