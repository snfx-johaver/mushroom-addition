import type { AdditionConfig, CatalogItem } from "./types";
import { PARITY_BY_ID } from "./parity.generated";
import { canonicalNameOptions, isReplacedUpstreamOption, supportedUpstreamOption } from "./supported-options";
import { variantForSource } from "./catalog";
import { FLOWER_BARS, flowerBarsForConfig, flowerEntityConfigKey } from "./flower";

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
const number = (name: string, min = 1, max = 168): EditorField => ({
  name,
  selector: { number: { min, max, mode: "box" } },
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
  battery_healthy_color: "green",
  battery_warning_color: "yellow",
  battery_low_color: "orange",
  battery_critical_color: "red",
  ulm_card_graph_color: "red",
  ulm_card_graph_icon_color: "red",
  ulm_card_media_player_color: "blue",
  ulm_card_alarm_time_color: "blue",
  ulm_custom_card_bar_card_color: "blue",
  ulm_custom_card_bar_card_icon_color: "grey",
  ulm_custom_card_internet_speed_color: "blue",
  disk_color: "red",
  temperature_color: "orange",
  memory_color: "blue",
  cpu_color: "green",
  ulm_custom_card_speedtest_download_speed_color: "yellow",
  ulm_custom_card_speedtest_upload_speed_color: "blue",
  ulm_custom_card_speedtest_ping_color: "green",
};
const color = (name: string): EditorField => ({
  name,
  selector: { ui_color: { default_color: colorDefaults[name] } },
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
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color",
]);
const numericBoxOptions = new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
  "ulm_card_graph_hours",
  "ulm_card_graph_line_width",
  "ulm_card_graph_points",
  "ulm_card_media_player_enable_volume_adjust",
]);
const certifiedCoreVariables = new Set([
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_entity",
  "ulm_card_input_number_name",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_entity_overview_entity_1",
  "ulm_custom_card_entity_overview_entity_2",
  "ulm_custom_card_entity_overview_entity_3",
  "ulm_custom_card_entity_overview_entity_4",
  "ulm_custom_card_entity_overview_icon",
  "ulm_custom_card_entity_overview_name",
  "ulm_custom_card_entity_overview_name_1",
  "ulm_custom_card_entity_overview_name_2",
  "ulm_custom_card_entity_overview_name_3",
  "ulm_custom_card_entity_overview_name_4",
  "ulm_custom_card_metrics_entitites_name",
  "ulm_custom_card_internet_speed_color",
  "ulm_custom_card_internet_speed_download_speed_entity",
  "ulm_custom_card_internet_speed_ping_entity",
  "ulm_custom_card_internet_speed_router_model",
  "ulm_custom_card_internet_speed_router_name",
  "ulm_custom_card_internet_speed_upload_speed_entity",
  "ulm_custom_card_weather_metrics",
  "ulm_custom_card_weather_metrics_date",
  "ulm_custom_card_weather_metrics_entity_1",
  "ulm_custom_card_weather_metrics_entity_2",
  "ulm_custom_card_weather_metrics_entity_3",
  "ulm_custom_card_weather_metrics_entity_4",
  "ulm_custom_card_weather_metrics_name_1",
  "ulm_custom_card_weather_metrics_name_2",
  "ulm_custom_card_weather_metrics_name_3",
  "ulm_custom_card_weather_metrics_name_4",
  "ulm_custom_card_weather_metrics_temperature_outside",
]);

const choiceOptions: Record<string, Array<{ value: string; label: string }>> = {
};

const presentation = (): EditorField[] => [
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
  presentationGrid([
    select("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" },
    ]),
    select("secondary_info", [
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
  "card_scenes",
  "card_welcome_scenes",
  "custom_card_bar_card",
  "custom_card_roomview",
  "custom_card_welcome",
  "custom_card_sun",
  "custom_card_entity_overview",
  "custom_card_internet_speed",
  "custom_card_weather_metrics",
  "custom_card_nas_metrics",
  "custom_card_tablet",
  "custom_card_pollen_forecast",
  "custom_card_playstation",
  "custom_card_speedtest_gauges",
  "custom_card_pollen",
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
  scene: (item) => [
    ...(item.upstreamId === "card_welcome_scenes"
      ? [entity(), ...presentation()]
      : common(item)),
    ...(item.upstreamId === "card_welcome_scenes"
      ? [
        entity(["input_boolean"], "collapse_entity"),
        entity(["weather"], "weather_entity"),
        navigation("settings_path"),
        toggle("collapsed"),
      ]
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
  bar: (item) => [...common(item)],
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

export const editorSchemaFor = (item: CatalogItem, config?: AdditionConfig): EditorField[] => {
  if (item.upstreamId === "mini_graph_card") {
    return [
      entity(["sensor", "binary_sensor", "input_number"]),
      ...presentation(),
      select("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" },
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
    ...(item.upstreamId === "card_room"
      ? [
        entity(),
        toggle("label_use_temperature"),
        toggle("label_use_brightness"),
        entity(["input_select"], "input_select_entity"),
        text("input_select_option"),
        ...presentation(),
      ]
    : item.upstreamId === "card_scenes"
      ? [
        entity(),
        ...(item.variants?.length ? [select("variant", item.variants.map((variant) => ({
          value: variant,
          label: item.variantLabels?.[variant] ?? variant,
        })))] : []),
        toggle("scene_buttons_only"),
        ...presentation(),
      ]
  : item.upstreamId === "custom_card_trash"
    ? [
      entity(["sensor", "calendar"]),
      toggle("show_today"),
      entity(["sensor"], "today_entity"),
      toggle("show_tomorrow"),
      entity(["sensor"], "tomorrow_entity"),
      ...presentation(),
    ]
    : item.upstreamId === "custom_card_entity_carousel"
      ? [
        entity(),
        ...presentation(),
        toggle("carousel_loop"),
        toggle("carousel_show_labels"),
        number("carousel_initial_index", 0, 50),
        select("carousel_effect", [
          { value: "coverflow", label: "Coverflow" },
          { value: "slide", label: "Slide" },
        ]),
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
    : item.upstreamId === "custom_card_better_thermostat"
      ? [
        entity(["climate"]),
        select("variant", [
          { value: "normal", label: "Normal" },
          { value: "compact", label: "Compact" },
        ]),
        ...presentation(),
        entity(["binary_sensor"], "window_sensor"),
        entity(["sensor"], "humidity_entity"),
        entity(["sensor"], "battery_entity"),
        toggle("show_controls"),
        toggle("show_temperature_control"),
        toggle("show_humidity"),
        toggle("show_hvac_modes"),
        toggle("show_presets"),
        toggle("show_status"),
        toggle("collapsible_controls"),
        number("thermostat_temp_step", 0.1, 5),
        percentage("low_battery_threshold"),
      ]
    : item.upstreamId === "custom_card_media_player_sonos"
      ? [
        entity(["media_player"]),
        ...presentation(),
        toggle("ulm_card_media_player_enable_art"),
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
    : item.upstreamId === "custom_card_more_power_outlet"
      ? [
        entity(["switch", "light"]),
        entity(["sensor"], "power_entity"),
        entity(["sensor"], "energy_entity"),
        entity(["sensor"], "time_entity"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_gauge"
      ? [
        entity(["sensor"]),
        number("minimum", -100000, 100000),
        number("maximum", -100000, 100000),
        ...presentation(),
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
    : item.upstreamId === "custom_card_pollen_forecast"
      ? [
        entity(["sensor"]),
        entity(["sensor"], "level_entity"),

        { name: "ulm_custom_card_pollen_forecast_icon", selector: { icon: {} } },
        select("pollen_language", [
          { value: "en", label: "English" },
          { value: "de", label: "German" },
          { value: "es", label: "Spanish" },
          { value: "pl", label: "Polish" },
        ]),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_roomview"
      ? [
        entity(item.preferredDomains),
        entity(["group", "light"], "group_lights"),
        entity(["group", "binary_sensor"], "group_motions"),
        entity(["group", "binary_sensor"], "group_doors"),
        entity(["group", "binary_sensor"], "group_windows"),
        entity(["group", "switch"], "group_outlets"),
        entity(["group", "media_player"], "group_tv"),
        entity(["group", "binary_sensor"], "group_water"),
        entity(["group", "cover"], "group_windows_shutters"),
        entity(["sensor"], "temperature"),
        entity(["sensor"], "humidity"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_room_overview"
      ? [
        entity(),
        entity(["light"], "ulm_custom_card_room_overview_light_entity"),
        entity(["climate"], "ulm_custom_card_room_overview_climate_entity"),
        entity(["cover"], "ulm_custom_card_room_overview_cover_entity"),
        { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
        { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
        { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
        { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
        toggle("ulm_card_dynamic_color"),
        text("secondary"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_welcome"
      ? [
        entity(["person"]),
        entity(["input_boolean"], "ulm_card_welcome_collapse"),
        entity(["weather"], "ulm_weather"),
        ...Array.from({ length: 5 }, (_, index) => index + 1).flatMap((index) => [
          text(`nav_${index}`),
          { name: `icon_${index}`, selector: { icon: {} } },
          text(`name_${index}`),
          select(`color_${index}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((value) => ({
            value,
            label: value[0].toUpperCase() + value.slice(1),
          }))),
        ]),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_vehicle_status"
      ? [
        entity(["device_tracker", "sensor"]),
        entity(["device_tracker", "sensor"], "ulm_card_vehicle_status_tracker"),
        entity(["lock", "binary_sensor"], "ulm_card_vehicle_status_lock"),
        entity(["sensor"], "ulm_card_vehicle_status_energy_level"),
        entity(["sensor"], "ulm_card_vehicle_status_range"),
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
        entity(["sensor", "switch", "binary_sensor"], "power_entity"),
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
        toggle("showAzimuth"),
        toggle("showElevation"),
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
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_entity_overview"
      ? [
        entity(),
        { name: "ulm_custom_card_entity_overview_icon", selector: { icon: {} } },

        ...[1, 2, 3, 4].flatMap((index) => [
          entity(undefined, `ulm_custom_card_entity_overview_entity_${index}`),
          text(`ulm_custom_card_entity_overview_name_${index}`),
        ]),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_internet_speed"
      ? [
        entity(["sensor"]),
        entity(["sensor"], "download_entity"),
        entity(["sensor"], "upload_entity"),
        entity(["sensor"], "ping_entity"),
        text("ulm_custom_card_internet_speed_router_name"),
        text("ulm_custom_card_internet_speed_router_model"),
        color("ulm_custom_card_internet_speed_color"),
        ...presentation(),
      ]
    : item.upstreamId === "custom_card_weather_metrics"
      ? [
        entity(["weather"]),
        entity(["sensor"], "temperature_entity"),
        entity(["sensor"], "date_entity"),
        ...[1, 2, 3, 4].flatMap((index) => [
          entity(undefined, `ulm_custom_card_weather_metrics_entity_${index}`),
          text(`ulm_custom_card_weather_metrics_name_${index}`),
        ]),
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

export const additionalEditorSchemaFor = (item: CatalogItem, config?: AdditionConfig): EditorField[] => {
  const configuredFields = schemaFieldNames(editorSchemaFor(item, config));
  return upstreamEditorSchemaFor(item, config)
    .filter((field) => !configuredFields.has(field.name));
};
