import type { AdditionConfig, CatalogItem } from "./types";
import { PARITY_BY_ID } from "./parity.generated";
import { supportedUpstreamOption } from "./supported-options";
import { variantForSource } from "./catalog";

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
const booleanOptions = new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
]);
const numericBoxOptions = new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
]);
const homeAssistantUpdateEntities = new Set([
  "ulm_card_homeassistant_entity",
  "ulm_card_homeassistant_core",
  "ulm_card_homeassistant_supervisor",
  "ulm_card_homeassistant_os",
]);
const personInfoEntities = new Set([
  "ulm_card_person_entity",
  "ulm_card_person_zone1",
  "ulm_card_person_zone2",
  "ulm_address",
  "ulm_address_locality",
  "ulm_card_person_driving_entity",
  "ulm_card_person_battery_entity",
  "ulm_card_person_battery_state_entity",
  "ulm_card_person_commute_entity",
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

const presentation = (): EditorField[] => [
  select("name_mode", [
    { value: "entity", label: "Use entity name" },
    { value: "custom", label: "Use custom name" },
    { value: "none", label: "Hide name" },
  ]),
  text("name"),
  { name: "icon", selector: { icon: {} } },
  select("icon_type", [
    { value: "icon", label: "Icon" },
    { value: "entity-picture", label: "Entity picture" },
    { value: "none", label: "No icon" },
  ]),
  select("layout", [
    { value: "default", label: "Automatic" },
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
  ]),
  toggle("fill_container"),
  select("primary_info", [
    { value: "name", label: "Name" },
    { value: "state", label: "State" },
    { value: "none", label: "None" },
  ]),
  select("secondary_info", [
    { value: "default", label: "Recommended card information" },
    { value: "state", label: "State" },
    { value: "name", label: "Name" },
    { value: "last-changed", label: "Last changed" },
    { value: "none", label: "None" },
  ]),
];

const common = (item: CatalogItem): EditorField[] => [
  entity(item.preferredDomains),
  ...(item.variants?.length ? [select("variant", item.variants.map((variant) => ({
    value: variant,
    label: item.variantLabels?.[variant] ?? variant.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
  })))] : []),
  ...presentation(),
];

const schemas: Record<string, (item: CatalogItem, config?: AdditionConfig) => EditorField[]> = {
  weather: (item) => [
    ...common(item),
    entity(["sensor"], "temperature_entity"),
    entity(["sensor"], "humidity_entity"),
    toggle("show_forecast"),
  ],
  climate: (item) => [...common(item), entity(["sensor"], "humidity_entity"), toggle("show_controls")],
  light: (item) => [...common(item)],
  scene: (item) => [
    ...common(item),
    ...(item.upstreamId === "card_welcome_scenes"
      ? [entity(["input_boolean"], "collapse_entity"), toggle("collapsed")]
      : []),
  ],
  presence: (item, config) => [
    ...common(item),
    ...(item.upstreamId === "card_room" ? [] : [
    ...(config?.variant === "small" ? [] : [
      entity(["sensor"], "battery_entity"),
      entity(["sensor"], "eta_entity"),
      entity(["sensor"], "address_entity"),
    ]),
    toggle("use_entity_picture"),
    ]),
  ],
  battery: (item) => [...common(item)],
  bar: (item) => [...common(item)],
  energy: (item) => [...common(item), entity(["sensor"], "min_entity"), entity(["sensor"], "max_entity"), toggle("show_graph")],
  sensor: (item) => [...common(item), toggle("show_graph")],
  media: (item) => [...common(item), toggle("show_controls"), ...(item.upstreamId === "custom_card_playstation" ? [{ name: "console_platform", selector: { select: { options: ["ps5", "xbox"] } } }] : [])],
  cover: (item) => [...common(item), toggle("show_controls")],
  vacuum: (item) => [...common(item), toggle("show_controls")],
  security: (item) => [...common(item)],
  navigation: (item) => [
    ...(item.variants?.length ? [select("variant", item.variants.map((variant) => ({
      value: variant,
      label: item.variantLabels?.[variant] ?? variant,
    })))] : []),
    ...presentation(),
    text("navigation_path"),
  ],
  text: () => [...presentation(), text("secondary")],
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

export const editorSchemaFor = (item: CatalogItem, config?: AdditionConfig): EditorField[] => [
  ...(item.upstreamId === "custom_card_afvalophaling"
    ? [
      entity(["sensor", "calendar"]),
      toggle("show_today"),
      entity(["sensor"], "today_entity"),
      toggle("show_tomorrow"),
      entity(["sensor"], "tomorrow_entity"),
      ...presentation(),
    ]
    : item.upstreamId === "custom_card_nik_nas"
      ? [
        entity(["binary_sensor", "sensor", "switch"]),
        entity(["sensor"], "disk_entity"),
        entity(["sensor"], "temperature_entity"),
        entity(["sensor"], "memory_entity"),
        entity(["sensor"], "cpu_entity"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_homeassistant_updates"
        ? [
        entity(["update", "sensor", "binary_sensor"]),
        entity(["update", "sensor", "binary_sensor"], "ulm_card_homeassistant_core"),
        entity(["update", "sensor", "binary_sensor"], "ulm_card_homeassistant_supervisor"),
        entity(["update", "sensor", "binary_sensor"], "ulm_card_homeassistant_os"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_nik_tablet"
      ? [
          entity(["binary_sensor", "sensor", "switch"]),
          entity(["switch", "input_boolean"], "tablet_button_usb_entity"),
          entity(["switch", "input_boolean"], "tablet_button_motion_entity"),
          entity(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
          entity(["button"], "tablet_restart_entity"),
          entity(["switch", "input_boolean"], "tablet_maintenance_entity"),
          entity(["button"], "tablet_reload_entity"),
          entity(["sensor"], "tablet_ram_entity"),
          entity(["sensor"], "tablet_disk_entity"),
          entity(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
          entity(["sensor"], "battery_entity"),
          ...presentation(),
        ]
        : item.upstreamId === "custom_card_person_info"
          ? [
            entity(["person"]),
            ...(item.variants?.length ? [select("variant", item.variants.map((variant) => ({
              value: variant,
              label: item.variantLabels?.[variant] ?? variant,
            })))] : []),
            toggle("ulm_card_person_use_entity_picture"),
            entity(["zone"], "ulm_card_person_zone1"),
            entity(["zone"], "ulm_card_person_zone2"),
            ...(config?.variant === "small"
              ? []
              : [
                entity(["sensor"], "ulm_card_person_commute_entity"),
                { name: "ulm_card_person_cummute_icon", selector: { icon: {} } },
                toggle("ulm_multiline"),
              ]),
            entity(["sensor"], "ulm_address"),
            entity(["sensor"], "ulm_address_locality"),
            entity(["binary_sensor"], "ulm_card_person_driving_entity"),
            entity(["sensor"], "ulm_card_person_battery_entity"),
            entity(["sensor", "binary_sensor"], "ulm_card_person_battery_state_entity"),
            number("ulm_card_battery_battery_level_danger", 0, 100),
            number("ulm_card_battery_battery_level_warning", 0, 100),
            ...presentation(),
          ]
    : (schemas[item.family] ?? schemas.entity)(item, config)),
  action("tap_action"),
  action("hold_action"),
  action("double_tap_action"),
];

export const upstreamEditorSchemaFor = (item: CatalogItem, config?: AdditionConfig): EditorField[] => {
  const selectedSources = config?.variant
    ? (item.sourceIds ?? [item.upstreamId]).filter((sourceId) =>
      variantForSource(sourceId) === config.variant || (
        sourceId === item.upstreamId && variantForSource(sourceId) === undefined
      ))
    : (item.sourceIds ?? [item.upstreamId]);
  const variables = [...new Map(
    selectedSources
      .flatMap((sourceId) => PARITY_BY_ID.get(sourceId)?.variables ?? [])
      .map((variable) => [variable.name, variable]),
  ).values()];
  return variables
    .filter((variable) => supportedUpstreamOption(item, variable.name))
    .filter((variable) => !(item.upstreamId === "custom_card_homeassistant_updates" &&
      variable.name === "ulm_card_homeassistant_entity"))
    .filter((variable) => !(item.upstreamId === "custom_card_person_info" && (
      personInfoEntities.has(variable.name) ||
      variable.name === "ulm_card_person_use_entity_picture" ||
      variable.name === "ulm_card_person_cummute_icon" ||
      variable.name === "ulm_multiline" ||
      variable.name === "ulm_card_battery_battery_level_danger" ||
      variable.name === "ulm_card_battery_battery_level_warning"
    )))
    .map((variable) => {
    if (item.upstreamId === "custom_card_homeassistant_updates" && homeAssistantUpdateEntities.has(variable.name)) {
      return entity(["update", "sensor", "binary_sensor"], variable.name);
    }
    if (item.upstreamId === "custom_card_person_info" && personInfoEntities.has(variable.name)) {
      const domains =
        variable.name === "ulm_card_person_entity" ? ["person"] :
          variable.name.startsWith("ulm_card_person_zone") ? ["zone"] :
            variable.name === "ulm_card_person_driving_entity" ? ["binary_sensor"] :
              ["sensor", "binary_sensor"];
      return entity(domains, variable.name);
    }
    const choices = choiceOptions[variable.name];
    if (choices) return select(variable.name, choices);
    if (booleanOptions.has(variable.name)) return toggle(variable.name);
    if (numericBoxOptions.has(variable.name)) return number(variable.name, -100000, 100000);
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
