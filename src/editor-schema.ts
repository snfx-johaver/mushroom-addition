import type { AdditionConfig, CatalogItem, HomeAssistant } from "./types";
import { upcomingDataAttributes } from "./upcoming-media";
import { PARITY_BY_ID } from "./parity.generated";
import { canonicalNameOptions, isReplacedUpstreamOption, supportedUpstreamOption } from "./supported-options";
import { variantForSource } from "./catalog";
import { FLOWER_BARS, flowerBarsForConfig, flowerEntityConfigKey } from "./flower";
import { REMOTE_KEYS } from "./remote-card";
import { PIHOLE_METRICS, PIHOLE_SECTIONS } from "./pi-hole";
import { STOCK_METRICS, STOCK_RANGES, stockUsesBackend } from "./stock-data";

export interface EditorField {
  name: string;
  selector?: Record<string, unknown>;
  type?: "grid";
  schema?: EditorField[];
  context?: Record<string, string>;
  presentation?: boolean;
}

const entity = (domains?: string[], name = "entity"): EditorField => ({
  name,
  selector: { entity: domains?.length ? { domain: domains } : {} },
});
const text = (name: string): EditorField => ({ name, selector: { text: {} } });
const navigation = (name: string): EditorField => ({ name, selector: { navigation: {} } });
const toggle = (name: string): EditorField => ({ name, selector: { boolean: {} } });
const number = (name: string, min = 1, max = 168, step?: number): EditorField => ({
  name,
  selector: { number: { min, max, mode: "box", ...(step === undefined ? {} : { step }) } },
});
const percentage = (name: string): EditorField => ({
  name,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } },
});
const action = (name: string): EditorField => ({ name, selector: { ui_action: {} } });
const select = (name: string, options: Array<{ value: string; label: string }>): EditorField => ({
  name,
  selector: { select: { mode: "dropdown", options } },
});
const colorDefaults: Record<string, string> = {
  pihole_accent_color: "green",
  remote_accent_color: "blue",
  upcoming_flag_color: "var(--primary-color)",
  upcoming_title_color: "var(--primary-text-color)",
  upcoming_line1_color: "var(--secondary-text-color)",
  upcoming_line2_color: "var(--secondary-text-color)",
  upcoming_line3_color: "var(--secondary-text-color)",
  upcoming_line4_color: "var(--secondary-text-color)",
  battery_healthy_color: "green",
  battery_warning_color: "yellow",
  battery_low_color: "orange",
  battery_critical_color: "red",
  ulm_card_media_player_color: "blue",
  ulm_card_alarm_time_color: "blue",
  disk_color: "red",
  temperature_color: "orange",
  memory_color: "blue",
  cpu_color: "green",
  ulm_custom_card_speedtest_download_speed_color: "yellow",
  ulm_custom_card_speedtest_upload_speed_color: "blue",
  ulm_custom_card_speedtest_ping_color: "green",
  import_color: "#ff9f43",
  export_color: "#4cd98b",
  solar_color: "#f5c542",
  battery_color: "#3b82f6",
  home_color: "#3b82f6",
  price_negative_color: "#0288d1",
  price_low_color: "#2e7d32",
  price_medium_color: "#9ccc65",
  price_high_color: "#fdd835",
  price_critical_color: "#e53935",
  buy_sell_price_color: "#78909c",
  buy_sell_charge_color: "#43a047",
  buy_sell_planned_sell_color: "#fb8c00",
  buy_sell_possible_sell_color: "#ffcc80",
  buy_sell_now_color: "var(--primary-text-color)",
  panel_color_0: "#b0bec5",
  panel_color_1: "#ffa726",
  panel_color_2: "#d4e157",
  panel_color_3: "#66bb6a",
  panel_color_4: "#2e7d32",
  panel_color_5: "#2e7d32",
};
const color = (name: string): EditorField => ({
  name,
  selector: {
    ui_color: {
      default_color: colorDefaults[name],
      ...(/^(var\(|#)/.test(colorDefaults[name] ?? "") ? {
        extra_options: [{
          value: colorDefaults[name],
          label: colorDefaults[name].startsWith("var(") ? "Automatic" : colorDefaults[name],
          display_color: colorDefaults[name],
        }],
      } : {}),
    },
  },
});
const presentationField = (field: EditorField): EditorField => ({ ...field, presentation: true });
const presentationGrid = (schema: EditorField[]): EditorField => ({
  type: "grid",
  name: "",
  schema,
  presentation: true,
});

const percentageOptions = new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning",
]);
const booleanOptions = new Set([
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color",
]);
const numericBoxOptions = new Set([
  "ulm_card_media_player_enable_volume_adjust",
]);
const certifiedCoreVariables = new Set([
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_entity",
  "ulm_card_input_number_name",
  "ulm_custom_card_metrics_entitites_name",
]);

const choiceOptions: Record<string, Array<{ value: string; label: string }>> = {
};

const presentation = (room = false): EditorField[] => [
  presentationField({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" },
  }),
  presentationField({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" },
  }),
  presentationField({
    name: "layout",
    selector: {
      select: {
        mode: "box",
        options: ["horizontal", "vertical"].map((value) => ({
          value,
          label: value === "horizontal" ? "Horizontal" : "Vertical",
          image: {
            src: `/static/images/form/tile_content_layout_${value}.svg`,
            src_dark: `/static/images/form/tile_content_layout_${value}_dark.svg`,
            flip_rtl: true,
          },
        })),
      },
    },
  }),
  presentationField(toggle("multiline_secondary")),
  presentationField(toggle("fill_container")),
  presentationField(toggle("card_shadow")),
  presentationGrid([
    select("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" },
    ]),
    select("secondary_info", [
      ...(room ? [
        { value: "default", label: "Automatic (feature labels)" },
        { value: "custom", label: "Custom text" },
        { value: "composed", label: "Composed (primary entity values)" },
      ] : []),
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" },
    ]),
    select("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" },
    ]),
  ]),
];

const fixedIconSources = new Set([
  "card_room",
  "custom_card_welcome",
]);

const removeUnsupportedIconFields = (fields: EditorField[]): EditorField[] =>
  fields.flatMap((field) => {
    if (field.name === "icon" || field.name === "icon_type") return [];
    if (!field.schema) return [field];
    return [{ ...field, schema: removeUnsupportedIconFields(field.schema) }];
  });

const arrangePresentation = (fields: EditorField[]): EditorField[] => {
  if (!fields.some((field) => field.presentation)) return fields;
  const presentationFields = fields.filter((field) => field.presentation);
  const presentationNames = new Set(["name", "icon"]);
  const remaining = fields.filter((field) =>
    !field.presentation &&
    !presentationNames.has(field.name) &&
    !canonicalNameOptions.has(field.name));
  const entityIndex = remaining.findIndex((field) => field.name === "entity");
  if (entityIndex < 0) return [...presentationFields, ...remaining];
  const [primaryEntity] = remaining.splice(entityIndex, 1);
  return [primaryEntity, ...presentationFields, ...remaining];
};
const withoutPresentationMarker = (value: EditorField): EditorField => {
  const field = { ...value };
  delete field.presentation;
  return field;
};

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
  scene: (item) => common(item),
  presence: (item, config) => [
    ...common(item),
    ...(item.upstreamId === "card_room" ? [] : [
    ...(config?.variant === "small" ? [] : [
      entity(["sensor"], "battery_entity"),
      entity(["sensor"], "eta_entity"),
      entity(["sensor"], "address_entity"),
    ]),
    ]),
  ],
  battery: (item) => [
    ...common(item),
    percentage("battery_warning_threshold"),
    percentage("battery_low_threshold"),
    percentage("battery_critical_threshold"),
    color("battery_healthy_color"),
    color("battery_warning_color"),
    color("battery_low_color"),
    color("battery_critical_color"),
  ],
  energy: (item) => [...common(item), entity(["sensor"], "min_entity"), entity(["sensor"], "max_entity"), toggle("show_graph")],
  sensor: (item) => [...common(item), toggle("show_graph")],
  media: (item) => [...common(item), toggle("show_controls")],
  cover: (item) => [...common(item), toggle("show_controls")],
  security: (item) => [...common(item)],
  navigation: (item) => [
    ...(item.variants?.length ? [select("variant", item.variants.map((variant) => ({
      value: variant,
      label: item.variantLabels?.[variant] ?? variant,
    })))] : []),
    ...presentation(),
    navigation("navigation_path"),
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

export const editorSchemaFor = (item: CatalogItem, config?: AdditionConfig, hass?: HomeAssistant): EditorField[] => {
  if (item.upstreamId === "stock_card") return [
    ...(config?.stock_source === "stock_market_deluxe" ? [] : [entity(["sensor"])]),
    ...presentation(),
    select("stock_source", [{ value: "entity", label: "Home Assistant entities (any provider)" },
      { value: "yahoo", label: "Yahoo Finance (Mushroom Addition Market Data backend)" },
      { value: "stock_market_deluxe", label: "Stock Market Deluxe integration" }]),
    text("stock_symbol"), text("stock_currency"),
    number("stock_shares", 0, 100000000, 0.001),
    number("stock_interval", 180, 86400),
    select("stock_range", STOCK_RANGES.filter(range => range !== "5Y" || config?.stock_source !== "stock_market_deluxe")
      .map(value => ({ value, label: value }))),
    toggle("stock_show_position"), toggle("stock_show_statistics"),
    ...(stockUsesBackend(config) ? [toggle("stock_show_volume"), toggle("stock_show_trends")] : []),
    ...(config?.stock_source === "stock_market_deluxe" ? [] : STOCK_METRICS.flatMap(([key]) => [
        entity(["sensor", "input_number"], `stock_${key}_entity`),
        text(`stock_${key}_attribute`),
      ])),
    action("tap_action"), action("hold_action"), action("double_tap_action"),
  ];
  if (item.upstreamId === "pi_hole_card") return [
    entity(["switch", "sensor", "binary_sensor"]),
    ...presentation(),
    { name: "pihole_device_ids", selector: { device: { multiple: true } } },
    toggle("pihole_show_header"),
    { name: "pihole_metrics", selector: { select: { multiple: true, mode: "dropdown", options: Object.entries(PIHOLE_METRICS).map(([value, metric]) => ({ value, label: metric.name })) } } },
    { name: "pihole_collapsed_sections", selector: { select: { multiple: true, mode: "dropdown", options: Object.entries(PIHOLE_SECTIONS).map(([value, label]) => ({ value, label })) } } },
    { name: "pihole_hidden_entities", selector: { entity: { multiple: true } } },
    { name: "pihole_pause_durations", selector: { select: { multiple: true, custom_value: true, mode: "dropdown", options: [{ value: "30", label: "30 seconds" }, { value: "60", label: "1 minute" }, { value: "300", label: "5 minutes" }, { value: "900", label: "15 minutes" }, { value: "3600", label: "1 hour" }] } } },
    select("pihole_pause_service", [{ value: "auto", label: "Automatic (integration and service availability)" }, { value: "pi_hole.disable", label: "Pi-hole v5 / Home Assistant core" }, { value: "pi_hole_v6.disable", label: "Pi-hole v6" }, { value: "custom", label: "Custom Home Assistant action" }]),
    ...(config?.pihole_pause_service === "custom" ? [
      action("pihole_pause_action"), text("pihole_duration_field"),
      select("pihole_duration_format", [{ value: "seconds", label: "Number of seconds" }, { value: "duration", label: "HH:MM:SS duration" }]),
    ] : []),
    number("pihole_columns", 1, 4), color("pihole_accent_color"),
    { name: "pihole_chart_metrics", selector: { select: { multiple: true, mode: "dropdown", options: [{ value: "cpu", label: "CPU usage (%)" }, { value: "memory", label: "Memory usage (%)" }] } } },
    number("pihole_chart_hours", 1, 168), number("pihole_chart_height", 80, 300),
    action("pihole_metric_tap_action"), action("pihole_metric_hold_action"), action("pihole_metric_double_tap_action"),
  ];
  if (item.upstreamId === "remote_card") {
    return [
      entity(["media_player", "remote"]),
      ...presentation(),
      entity(["remote"], "remote_entity"), entity(["media_player"], "remote_media_entity"),
      select("remote_transport", [{ value: "auto", label: "Automatic (paired remote or Samsung)" }, { value: "remote", label: "Remote: send command" }, { value: "samsung", label: "Samsung: media player key codes" }]),
      select("remote_preset", [{ value: "auto", label: "Automatic" }, { value: "generic", label: "Generic remote" }, { value: "android_tv", label: "Android / Google TV" }, { value: "apple_tv", label: "Apple TV" }, { value: "roku", label: "Roku" }, { value: "samsung", label: "Samsung TV" }]),
      text("remote_device"),
      select("remote_navigation", [{ value: "touchpad", label: "Touchpad" }, { value: "buttons", label: "Directional buttons" }, { value: "both", label: "Touchpad and buttons" }]),
      select("remote_volume", [{ value: "slider", label: "Slider and mute" }, { value: "buttons", label: "Buttons and mute" }, { value: "both", label: "Slider, buttons and mute" }]),
      number("remote_volume_step", 1, 20),
      { name: "remote_button_size", selector: { number: { min: 32, max: 64, step: 2, mode: "slider", unit_of_measurement: "px" } } },
      { name: "remote_touchpad_height", selector: { number: { min: 80, max: 280, step: 4, mode: "slider", unit_of_measurement: "px" } } },
      color("remote_accent_color"),
      select("remote_haptics", [{ value: "all", label: "Buttons and volume slider" }, { value: "buttons", label: "Buttons only" }, { value: "slider", label: "Volume slider only" }, { value: "none", label: "Off" }]),
      select("remote_double_tap", [{ value: "back", label: "Back" }, { value: "home", label: "Home" }, { value: "menu", label: "Menu" }, { value: "custom", label: "Custom key code" }, { value: "disabled", label: "Disabled (immediate single tap)" }]),
      ...(config?.remote_double_tap === "custom" ? [text("remote_double_tap_command")] : []),
      { name: "remote_swipe_distance", selector: { number: { min: 12, max: 80, step: 2, mode: "slider", unit_of_measurement: "px" } } },
      { name: "remote_power_controls", selector: { select: { multiple: true, mode: "dropdown", options: REMOTE_KEYS.filter(key => ["power", "home", "back", "menu", "info"].includes(key.value)) } } },
      { name: "remote_playback_controls", selector: { select: { multiple: true, mode: "dropdown", options: REMOTE_KEYS.filter(key => ["previous", "play_pause", "stop", "next", "rewind", "forward"].includes(key.value)) } } },
    ];
  }
  if (item.upstreamId === "upcoming_media") {
    const mediaAttributes = ["title", "episode", "number", "airdate", "aired", "rating", "runtime", "studio", "genres", "flag", "artist", "album", "channel"];
    const attributeChoice = (name: string): EditorField => ({
      name, selector: { select: { mode: "dropdown", custom_value: true, options: mediaAttributes.map(value => ({ value, label: value === "airdate" ? "Air date" : value[0].toUpperCase() + value.slice(1) })) } },
    });
    return [
      entity(["sensor"]),
      ...presentation(),
      select("upcoming_data_attribute", [...new Set([
        "data", ...upcomingDataAttributes(config?.entity ? hass?.states[config.entity] : undefined),
      ])].map(value => ({ value, label: value }))),
      select("upcoming_image_style", [{ value: "poster", label: "Poster beside text" }, { value: "fanart", label: "Full-width artwork" }]),
      number("upcoming_max_items", 1, 50),
      { name: "upcoming_item_height", selector: { number: { min: 80, max: 320, step: 4, mode: "slider", unit_of_measurement: "px" } } },
      { name: "upcoming_corner_radius", selector: { number: { min: 0, max: 32, mode: "slider", unit_of_measurement: "px" } } },
      toggle("upcoming_overflow"),
      ...(config?.upcoming_overflow ? [number("upcoming_max_columns", 1, 6)] : [
        select("upcoming_collapse_mode", [{ value: "none", label: "Show all" }, { value: "count", label: "Show first items, expand the rest" }, { value: "matching", label: "Matching items first, expand the rest" }]),
        ...(config?.upcoming_collapse_mode === "count" ? [number("upcoming_collapse_count", 1, 50)] : []),
        ...(config?.upcoming_collapse_mode === "matching" ? [attributeChoice("upcoming_group_attribute"), text("upcoming_group_value")] : []),
      ]),
      { name: "upcoming_sort_by", selector: { select: { mode: "dropdown", custom_value: true, options: [{ value: "", label: "Sensor order" }, ...mediaAttributes.map(value => ({ value, label: value === "airdate" ? "Air date" : value[0].toUpperCase() + value.slice(1) }))] } } },
      toggle("upcoming_sort_ascending"),
      attributeChoice("upcoming_filter_attribute"),
      ...(config?.upcoming_filter_attribute ? [
        select("upcoming_filter_match", [{ value: "contains", label: "Contains" }, { value: "exact", label: "Equals" }]),
        text("upcoming_filter_value"),
      ] : []),
      select("upcoming_flag_filter", [{ value: "all", label: "All media" }, { value: "flagged", label: "Flagged only" }, { value: "unflagged", label: "Unflagged only" }]),
      toggle("upcoming_show_flag"),
      ...(config?.upcoming_show_flag !== false ? [
        { name: "upcoming_flag_icon", selector: { icon: {} } }, text("upcoming_flag_label"), color("upcoming_flag_color"),
      ] : []),
      toggle("upcoming_hide_empty"),
      select("upcoming_clock", [{ value: "locale", label: "Home Assistant language default" }, { value: "12", label: "12-hour" }, { value: "24", label: "24-hour" }]),
      { name: "upcoming_date_format", selector: { select: { mode: "dropdown", custom_value: true, options: [
        { value: "locale", label: "Localized date" }, { value: "dd/mm/yyyy", label: "Day / month / year" },
        { value: "mm/dd/yyyy", label: "Month / day / year" }, { value: "yyyy-mm-dd", label: "Year - month - day" },
      ] } } },
      ...["title", "line1", "line2", "line3", "line4"].map(line => ({
        type: "grid" as const, name: "", schema: [text(`upcoming_${line}_text`), color(`upcoming_${line}_color`)],
      })),
      number("upcoming_title_size", 12, 24),
      number("upcoming_line_size", 10, 18),
      toggle("upcoming_box_shadows"), toggle("upcoming_text_shadows"), toggle("upcoming_transparency"),
      toggle("upcoming_tooltips"),
      ...(config?.upcoming_tooltips ? [number("upcoming_tooltip_delay", 0, 3000, 50)] : []),
      select("upcoming_item_behavior", [{ value: "automatic", label: "Open media / trailer automatically" }, { value: "more-info", label: "Sensor more information" }, { value: "action", label: "Custom Home Assistant action" }, { value: "none", label: "No action" }]),
      ...(config?.upcoming_item_behavior === "action" ? [action("upcoming_item_action")] : [
        toggle("upcoming_trailers"), toggle("upcoming_links"), text("upcoming_url"),
      ]),
    ];
  }
  if (item.upstreamId === "mini_graph_card") {
    return [
      entity(["sensor", "binary_sensor", "input_number"]),
      ...presentation().filter((field) =>
        field.name !== "layout" && field.name !== "multiline_secondary" && field.name !== "fill_container"),
      select("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" },
        { value: "radial", label: "Circular rings" },
        { value: "scatter", label: "Scatter plot" },
        { value: "pie", label: "Pie chart" },
        { value: "donut", label: "Donut chart" },
      ]),
      select("aggregate_func", [
        { value: "avg", label: "Average" },
        { value: "median", label: "Median" },
        { value: "min", label: "Minimum" },
        { value: "max", label: "Maximum" },
        { value: "first", label: "First value" },
        { value: "last", label: "Last value" },
        { value: "sum", label: "Sum" },
        { value: "delta", label: "Range (maximum minus minimum)" },
        { value: "diff", label: "Difference (last minus first)" },
      ]),
      select("group_by", [
        { value: "interval", label: "Dynamic interval" },
        { value: "hour", label: "Hour" },
        { value: "date", label: "Date" },
      ]),
      number("hours_to_show", 1, 8760),
      number("points_per_hour", 0.01, 60),
      number("update_interval", 1, 86400),
      toggle("cache"),
      number("height", 0, 1000),
      number("line_width", 1, 20),
      number("bar_spacing", 0, 50),
      toggle("smoothing"),
      toggle("animate"),
      toggle("logarithmic"),
      number("value_factor", -12, 12),
      number("decimals", 0, 12),
      toggle("hour24"),
      number("font_size", 25, 300),
      number("font_size_header", 8, 48),
      select("align_header", [
        { value: "default", label: "Automatic" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ]),
      select("align_icon", [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "state", label: "Beside state" },
      ]),
      select("align_state", [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ]),
      text("unit"),
      text("icon_image"),
      text("lower_bound"),
      text("upper_bound"),
      number("min_bound_range", 0, 1000000),
      text("lower_bound_secondary"),
      text("upper_bound_secondary"),
      number("min_bound_range_secondary", 0, 1000000),
      select("color_thresholds_transition", [
        { value: "smooth", label: "Smooth gradient" },
        { value: "hard", label: "Hard color steps" },
      ]),
      toggle("group"),
      select("mini_graph_show_state", [
        { value: "current", label: "Current state" },
        { value: "last", label: "Last graph value" },
        { value: "hidden", label: "Hidden" },
      ]),
      select("mini_graph_show_fill", [
        { value: "solid", label: "Solid fill" },
        { value: "fade", label: "Faded fill" },
        { value: "hidden", label: "No fill" },
      ]),
      select("mini_graph_show_points", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" },
      ]),
      select("mini_graph_show_labels", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" },
      ]),
      select("mini_graph_show_labels_secondary", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" },
      ]),
      toggle("mini_graph_show_legend"),
      toggle("mini_graph_show_top_labels"),
      toggle("mini_graph_show_average"),
      toggle("mini_graph_show_extrema"),
      toggle("mini_graph_name_adaptive_color"),
      toggle("mini_graph_icon_adaptive_color"),
      toggle("mini_graph_loading_indicator"),
      action("tap_action"),
      action("hold_action"),
      action("double_tap_action"),
    ];
  }
  const fields: EditorField[] = [
    ...(item.upstreamId === "advanced_home_energy_management"
      ? [
        entity(["sensor"]),
        entity(["sensor"], "grid_power_entity"),
        entity(["sensor"], "grid_phase_1_entity"),
        entity(["sensor"], "grid_phase_2_entity"),
        entity(["sensor"], "grid_phase_3_entity"),
        entity(["sensor"], "solar_power_entity"),
        entity(["sensor"], "solar_forecast_entity"),
        entity(["sensor"], "battery_level_entity"),
        entity(["sensor"], "battery_power_entity"),
        entity(["sensor"], "battery_1_level_entity"),
        entity(["sensor"], "battery_1_power_entity"),
        entity(["sensor"], "battery_2_level_entity"),
        entity(["sensor"], "battery_2_power_entity"),
        entity(["sensor"], "battery_3_level_entity"),
        entity(["sensor"], "battery_3_power_entity"),
        entity(["sensor"], "ev_charger_power_entity"),
        entity(["sensor", "select", "input_select"], "energy_mode_entity"),
        entity(["binary_sensor", "input_boolean", "switch"], "energy_auto_control_entity"),
        entity(["sensor", "input_number"], "electricity_price_entity"),
        entity(["sensor", "input_number"], "tariff_markup_entity"),
        entity(["sensor", "input_number"], "tariff_vat_entity"),
        text("energy_grid_label"),
        text("energy_grid_import_label"),
        text("energy_grid_export_label"),
        text("energy_solar_label"),
        text("energy_battery_label"),
        text("energy_home_label"),
        text("energy_forecast_label"),
        text("energy_ev_label"),
        text("energy_charge_label"),
        text("energy_discharge_label"),
        text("energy_idle_label"),
        text("energy_auto_label"),
        text("energy_manual_label"),
        text("mode_solar_first_label"),
        text("mode_smart_saving_label"),
        text("mode_smart_trading_label"),
        number("grid_phase_scale_max", 100, 100000),
        number("solar_scale_max", 100, 100000),
        number("battery_unit_scale_max", 100, 100000),
        number("home_scale_max", 100, 100000),
        number("price_low_threshold", -10, 10),
        number("price_medium_threshold", -10, 10),
        number("price_high_threshold", -10, 10),
        number("price_critical_threshold", -10, 10),
        toggle("show_grid_phases"),
        toggle("show_battery_units"),
        toggle("show_tariff_timeline"),
        color("import_color"),
        color("export_color"),
        color("solar_color"),
        color("battery_color"),
        color("home_color"),
        color("price_negative_color"),
        color("price_low_color"),
        color("price_medium_color"),
        color("price_high_color"),
        color("price_critical_color"),
        ...presentation(),
      ]
    : item.upstreamId === "card_room"
      ? [
        entity(),
        toggle("label_use_temperature"),
        entity(["sensor", "climate"], "room_temperature_entity"),
        toggle("label_use_brightness"),
        entity(["light"], "room_light_entity"),
        toggle("ulm_card_dynamic_color"),
        ...presentation(true),
        text("secondary"),
      ]
    : item.upstreamId === "card_scenes"
      ? [
        entity(),
        ...(item.variants?.length ? [select("variant", item.variants.map((variant) => ({
          value: variant,
          label: item.variantLabels?.[variant] ?? variant,
        })))] : []),
        toggle("scene_buttons_only"),
        number("scenes_per_row", 1, 24),
        ...presentation(),
      ]
  : item.upstreamId === "custom_card_trash"
    ? [
      entity(["sensor", "calendar"]),
      toggle("hide_unknown_dates"),
      toggle("show_today"),
      entity(["sensor"], "today_entity"),
      toggle("show_tomorrow"),
      entity(["sensor"], "tomorrow_entity"),
      ...presentation(),
    ]
    : item.upstreamId === "custom_card_entity_carousel"
      ? [
        entity(),
        toggle("carousel_show_header"),
        ...presentation(),
        toggle("carousel_loop"),
        toggle("carousel_show_labels"),
        number("carousel_initial_index", 0, 50),
        { name: "carousel_button_width", selector: { number: { min: 32, max: 160, step: 1, mode: "slider", unit_of_measurement: "px" } } },
        { name: "carousel_button_height", selector: { number: { min: 32, max: 160, step: 1, mode: "slider", unit_of_measurement: "px" } } },
        { name: "carousel_icon_size", selector: { number: { min: 12, max: 96, step: 1, mode: "slider", unit_of_measurement: "px" } } },
        select("carousel_effect", [
          { value: "coverflow", label: "Coverflow" },
          { value: "slide", label: "Slide" },
          { value: "fade", label: "Fade" },
          { value: "cube", label: "Cube" },
          { value: "flip", label: "Flip" },
        ]),
        toggle("carousel_navigation"),
        toggle("carousel_pagination"),
        select("carousel_pagination_type", [
          { value: "bullets", label: "Dots" },
          { value: "fraction", label: "Item count" },
          { value: "progressbar", label: "Progress bar" },
        ]),
        toggle("carousel_scrollbar"),
        toggle("carousel_grab_cursor"),
        toggle("carousel_centered_slides"),
        select("carousel_slides_per_view", [
          { value: "auto", label: "Automatic" },
          ...Array.from({ length: 11 }, (_, index) => ({
            value: String(index + 1),
            label: String(index + 1),
          })),
        ]),
        number("carousel_coverflow_rotate", -180, 180),
        number("carousel_coverflow_stretch", -200, 200),
        number("carousel_coverflow_depth", 0, 1000),
        number("carousel_coverflow_modifier", 0, 5),
        toggle("carousel_coverflow_slide_shadows"),
      ]
    : item.upstreamId === "custom_card_playstation"
      ? [
        entity(["binary_sensor", "media_player", "remote", "sensor", "switch"]),
        select("console_platform", [
          { value: "auto", label: "Automatic" },
          { value: "xbox", label: "Xbox" },
          { value: "playstation", label: "PlayStation" },
          { value: "nintendo", label: "Nintendo" },
        ]),
        toggle("console_show_artwork"),
        toggle("console_show_controls"),
        entity(["sensor"], "followers_entity"),
        entity(["sensor"], "following_entity"),
        entity(["sensor"], "friends_entity"),
        entity(["sensor", "number", "input_number"], "primary_stat_entity"),
        { name: "primary_stat_icon", selector: { icon: {} } },
        entity(["sensor", "number", "input_number"], "secondary_stat_entity"),
        { name: "secondary_stat_icon", selector: { icon: {} } },
        entity(["sensor"], "now_playing_entity"),
        entity(["image", "camera"], "gamerpic_entity"),
        entity(["image", "camera"], "artwork_entity"),
        entity(["remote", "media_player", "switch"], "console_power_entity"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_alarm_time"
      ? [
        entity(["input_boolean", "switch"]),
        entity(["input_datetime"], "datetime_entity"),
        number("ulm_card_alarm_time_step", 1, 180),
        toggle("ulm_card_alarm_time_collapse"),
        toggle("ulm_card_alarm_time_horizontal"),
        { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
        color("ulm_card_alarm_time_color"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_media_player_sonos"
      ? [
        entity(["media_player"]),
        ...presentation(),
        toggle("ulm_card_media_player_enable_art"),
        toggle("use_media_info"),
        toggle("ulm_card_media_player_more_info"),
        toggle("ulm_card_media_player_power_button"),
        entity(["media_player"], "ulm_card_media_player_player_controls_entity"),
        { name: "ulm_card_media_player_enable_volume_adjust", selector: { number: { min: 0.01, max: 1, step: 0.01, mode: "box" } } },
        { name: "volume_controls", selector: { select: { multiple: true, mode: "list", options: [
          { value: "volume_mute", label: "Mute" },
          { value: "volume_set", label: "Volume slider and percentage" },
          { value: "volume_buttons", label: "Volume buttons" },
        ] } } },
        { name: "media_controls", selector: { select: { multiple: true, mode: "list", options: [
          { value: "shuffle", label: "Shuffle" },
          { value: "previous", label: "Previous track" },
          { value: "play_pause_stop", label: "Play/pause/stop" },
          { value: "next", label: "Next track" },
          { value: "repeat", label: "Repeat mode" },
          { value: "sources", label: "Sources and details" },
        ] } } },
        toggle("collapsible_controls"),
        toggle("ulm_card_media_player_idle_off"),
        toggle("sonos_details_always_visible"),
        entity(["switch"], "crossfade_entity"),
        entity(["switch"], "night_sound_entity"),
        entity(["switch"], "speech_enhancement_entity"),
        entity(["switch"], "subwoofer_entity"),
        entity(["switch"], "surrounds_entity"),
        entity(["switch"], "loudness_entity"),
        entity(["switch"], "surround_full_entity"),
        entity(["number"], "audio_delay_entity"),
        entity(["number"], "balance_entity"),
        entity(["number"], "bass_entity"),
        entity(["number"], "treble_entity"),
        entity(["number"], "sub_gain_entity"),
        entity(["number"], "surround_level_entity"),
        entity(["number"], "music_surround_level_entity"),
      ]
    : item.upstreamId === "custom_card_printer"
      ? [
        entity(["sensor", "binary_sensor"]),
        entity(["sensor"], "black_entity"),
        entity(["sensor"], "yellow_entity"),
        entity(["sensor"], "magenta_entity"),
        entity(["sensor"], "cyan_entity"),
        ...presentation(),
      ]
    : item.upstreamId === "advanced_energy_buy_sell"
      ? [
        entity(["sensor"]),
        text("buy_sell_title"),
        number("buy_sell_graph_span", 1, 168),
        select("buy_sell_span_start", [
          { value: "day", label: "Start at midnight" },
          { value: "now", label: "Start now" },
        ]),
        number("buy_sell_update_interval", 1, 120),
        number("buy_sell_chart_height", 120, 700),
        number("buy_sell_min_value", -10, 10),
        number("buy_sell_max_value", -10, 10),
        number("buy_sell_price_decimals", 0, 6),
        number("buy_sell_axis_decimals", 0, 4),
        number("buy_sell_bar_radius", 0, 16),
        text("buy_sell_axis_label"),
        text("buy_sell_price_label"),
        color("buy_sell_price_color"),
        text("buy_sell_charge_label"),
        color("buy_sell_charge_color"),
        text("buy_sell_planned_sell_label"),
        color("buy_sell_planned_sell_color"),
        text("buy_sell_possible_sell_label"),
        color("buy_sell_possible_sell_color"),
        toggle("buy_sell_show_now"),
        text("buy_sell_now_label"),
        color("buy_sell_now_color"),
        toggle("buy_sell_show_legend"),
        toggle("buy_sell_show_grid"),
        toggle("buy_sell_show_result"),
        number("buy_sell_trade_energy", 0.1, 1000, 0.01),
        entity(["input_number", "number", "sensor"], "buy_sell_trade_energy_entity"),
        number("buy_sell_trade_power", 0.1, 1000, 0.01),
        number("buy_sell_trade_efficiency", 1, 100, 0.1),
        number("buy_sell_feed_in_fee", 0, 10, 0.001),
        number("buy_sell_slot_minutes", 1, 1440),
        ...presentation(),
      ]
    : item.upstreamId === "advanced_energy_panel_health"
      ? [
        entity(["sensor"]),
        {
          name: "panel_entities",
          selector: { entity: { domain: ["sensor"], multiple: true } },
        },
        text("panel_health_title"),
        toggle("panel_show_summary"),
        toggle("panel_show_gauges"),
        number("panel_gauge_max", 1, 100000),
        number("panel_warning_average_min", 0, 100000),
        number("panel_low_output_percent", 1, 100),
        number("panel_segment_1", 0, 100000),
        number("panel_segment_2", 0, 100000),
        number("panel_segment_3", 0, 100000),
        number("panel_segment_4", 0, 100000),
        color("panel_color_0"),
        color("panel_color_1"),
        color("panel_color_2"),
        color("panel_color_3"),
        color("panel_color_4"),
        color("panel_color_5"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_welcome"
      ? [
        entity(["person"]),
        entity(["input_boolean"], "ulm_card_welcome_collapse"),
        entity(["weather"], "ulm_weather"),
        select("welcome_weather_icon_type", [
          { value: "automatic", label: "Automatic" }, { value: "icon", label: "Icon" }, { value: "none", label: "None" },
        ]),
        ...(config?.welcome_weather_icon_type === "icon" ? [{ name: "welcome_weather_icon", selector: { icon: {} } }] : []),
        ...["primary", "secondary"].map(line => select(`welcome_weather_${line}_info`, [
          { value: "temperature", label: "Temperature" }, { value: "state", label: "State" },
          { value: "date", label: "Date" }, { value: "name", label: "Name" }, { value: "none", label: "None" },
        ])),
        select("welcome_weather_date_format", [
          { value: "month_day", label: new Intl.DateTimeFormat(hass?.language, { month: "short", day: "numeric", timeZone: hass?.config?.time_zone }).format(new Date()) },
          ...(["short", "medium", "long", "full"] as const).map(dateStyle => ({
            value: dateStyle,
            label: new Intl.DateTimeFormat(hass?.language, { dateStyle, timeZone: hass?.config?.time_zone }).format(new Date()),
          })),
        ]),
        action("welcome_weather_tap_action"),
        number("scenes_per_row", 1, 24),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_plant"
      ? [
        entity(["plant", "sensor"]),
        text("ulm_card_flower_species"),
        {
          name: "ulm_card_flower_show_bars",
          selector: {
            select: {
              multiple: true,
              options: FLOWER_BARS.map(({ key, label }) => ({ value: key, label })),
            },
          },
        },
        ...flowerBarsForConfig(config).map((key) =>
          entity(["sensor", "number", "input_number"], flowerEntityConfigKey(key))),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_washer"
      ? [
        entity(["sensor", "switch", "binary_sensor"]),
        entity(["sensor", "select"], "program_stage_entity"),
        entity(["sensor", "switch"], "washer_power_entity"),
        entity(["select", "input_select"], "program_select_entity"),
        entity(["switch", "input_boolean"], "power_switch_entity"),
        entity(["sensor", "binary_sensor"], "door_entity"),
        entity(["sensor", "binary_sensor"], "finished_entity"),
        entity(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
        entity(["sensor"], "ulm_custom_card_washer_job_progress"),
        entity(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
        entity(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
        text("ulm_custom_card_washer_machine_stop_state"),
        { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
        text("ulm_custom_card_washer_label_idle"),
        text("ulm_custom_card_washer_label_configuring"),
        text("ulm_custom_card_washer_label_running"),
        action("ulm_custom_card_washer_start_action"),
        action("ulm_custom_card_washer_pause_action"),
        action("ulm_custom_card_washer_stop_action"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_sun"
      ? [
        entity(["sun"]),
        text("title"),
        select("language", [
          { value: "en", label: "English" },
          { value: "de", label: "German" },
          { value: "es", label: "Spanish" },
          { value: "fr", label: "French" },
          { value: "nl", label: "Dutch" },
          { value: "pl", label: "Polish" },
        ]),
        select("timeFormat", [
          { value: "24h", label: "24-hour time" },
          { value: "12h", label: "12-hour time" },
        ]),
        toggle("darkMode"),
        toggle("showMoon"),
        entity(["sensor"], "moon_entity"),
        entity(["sensor"], "moon_altitude_entity"),
        entity(["sensor"], "moon_azimuth_entity"),
        entity(["sensor"], "moon_rising_entity"),
        entity(["sensor"], "moon_setting_entity"),
        entity(["sensor"], "moon_next_full_moon_entity"),
        entity(["sensor"], "moon_next_new_moon_entity"),
        entity(["sensor", "binary_sensor"], "moon_above_horizon_entity"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_pollen"
      ? [
        entity(["sensor"]),
        entity(["sensor"], "trees_entity"),
        text("custom_card_pollen_tree_name"),
        { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
        entity(["sensor"], "grass_entity"),
        text("custom_card_pollen_grass_name"),
        { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
        entity(["sensor"], "weeds_entity"),
        text("custom_card_pollen_weed_name"),
        { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_speedtest_gauges"
      ? [
        entity(["sensor"]),
        entity(["sensor"], "download_entity"),
        color("ulm_custom_card_speedtest_download_speed_color"),
        number("ulm_custom_card_speedtest_download_speed_max", 1, 100000),
        entity(["sensor"], "upload_entity"),
        color("ulm_custom_card_speedtest_upload_speed_color"),
        number("ulm_custom_card_speedtest_upload_speed_max", 1, 100000),
        entity(["sensor"], "ping_entity"),
        color("ulm_custom_card_speedtest_ping_color"),
        number("ulm_custom_card_speedtest_ping_max", 1, 100000),
        toggle("ulm_custom_card_speedtest_round"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_nas_metrics"
      ? [
        entity(["binary_sensor", "sensor", "switch"]),
        entity(["sensor"], "disk_entity"),
      text("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      color("disk_color"),
      entity(["sensor"], "temperature_entity"),
      text("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      color("temperature_color"),
      number("temperature_max", 1, 100000),
      entity(["sensor"], "memory_entity"),
      text("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      color("memory_color"),
      number("memory_max", 1, 100000),
      entity(["sensor"], "cpu_entity"),
      text("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      color("cpu_color"),
      number("cpu_max", 1, 100000),
      ...presentation(),
    ]
    : item.upstreamId === "custom_card_input_datetime"
      ? [
        entity(["input_datetime"]),
        number("datetime_step", 1, 720),
        toggle("datetime_single_row"),
        toggle("datetime_manual_entry"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_tablet"
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
      : (schemas[item.family] ?? schemas.entity)(item, config)),
  ];
  const supportedFields = fixedIconSources.has(item.upstreamId)
    ? removeUnsupportedIconFields(fields)
    : fields;
  return [
    ...arrangePresentation(supportedFields).map(withoutPresentationMarker),
    action("tap_action"),
    action("hold_action"),
    action("double_tap_action"),
  ];
};

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
    .filter((variable) => !isReplacedUpstreamOption(item, variable.name))
    .filter((variable) => !certifiedCoreVariables.has(variable.name))
    .map((variable) => {
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
      case "color": return color(variable.name);
      case "boolean": return toggle(variable.name);
      case "number": return number(variable.name, -100000, 100000);
      case "object": return { name: variable.name, selector: { object: {} } };
      default: return text(variable.name);
    }
  });
};

const schemaFieldNames = (fields: EditorField[]): Set<string> =>
  new Set(fields.flatMap((field) =>
    field.schema ? [...schemaFieldNames(field.schema)] : field.name ? [field.name] : []));

export const additionalEditorSchemaFor = (
  item: CatalogItem,
  config?: AdditionConfig,
  configuredSchema?: EditorField[],
): EditorField[] => {
  const configuredFields = schemaFieldNames(configuredSchema ?? editorSchemaFor(item, config));
  return upstreamEditorSchemaFor(item, config)
    .filter((field) => !configuredFields.has(field.name));
};
