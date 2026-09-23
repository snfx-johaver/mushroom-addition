import type { CatalogItem } from "./types";

const baseCards = [
  "battery", "binary_sensor", "binary_sensor_alert", "cover", "fan", "generic",
  "generic_swap", "graph", "input_boolean", "light", "media_player", "navigate",
  "person", "power_outlet", "room", "scenes", "script", "thermostat", "title",
  "vacuum", "vertical_button", "weather", "weather_ulm", "welcome_scenes",
] as const;

const baseChips = [
  "alarm", "back", "icon_double_state", "icon_label", "icon_only", "icon_state",
  "mdi_icon_only", "mdi_icon_state", "navigate", "power_consumption",
  "presence_detection", "short_date_with_day", "temperature", "weather_date",
] as const;

const customCards = [
  "afvalophaling", "alarm_time", "apexcharts", "bar_card", "camera", "chromecast",
  "damix48_power_details", "device_tracker", "drealine_roomview",
  "eraycetinay_elapsed_time", "eraycetinay_lock", "esh_room", "esh_welcome",
  "haven_washer", "heat_pump", "homeassistant_updates", "httpedo13_sun",
  "httpedo13_thermostat", "iAbadia_battery_chip", "imswel_medias", "imswel_person",
  "input_datetime", "input_number", "irmajavi_entities", "irmajavi_speedtest",
  "irmajavi_weather", "light_colorpick", "media_player_sonos", "more_power_outlet",
  "mpse_gauge", "mpse_printer", "mpse_thermostat", "mpse_wifisignal", "nas",
  "neekster_update", "nik_clock", "nik_door", "nik_nas", "nik_tablet",
  "paddy_dwd_pollen", "paddy_waste_collection", "paddy_welcome", "person_chip",
  "person_info", "person_info_small", "playstation", "qubino", "ristou_person",
  "saxel_fan", "scenes", "schumijo_car", "schumijo_flower", "senoro_win",
  "sisimomo_printer", "speedtest_shogun160", "tpx01_aircondition",
  "vncntdev_device_tracer", "water_heater", "wilbiev_subtitle", "wilbiev_title",
  "wsly_pollen", "yagrasdemonde_lights_count",
] as const;

const customChips = [
  "group_counter", "moon", "myenedis", "simple_temp", "tesla_temperature",
  "update", "vlape_garage",
] as const;

const humanize = (id: string): string =>
  id
    .replace(/^iAbadia/, "iAbadia")
    .split("_")
    .map((word) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(word.toLowerCase())
      ? word.toUpperCase()
      : `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");

const familyFor = (id: string): string => {
  if (id === "custom_card_alarm_time") return "alarm-time";
  if (id === "custom_card_nik_door") return "door";
  if (/alarm|alert|lock/.test(id)) return "security";
  if (/navigate|back/.test(id)) return "navigation";
  if (/battery/.test(id)) return "battery";
  if (/power_outlet|more_power_outlet/.test(id)) return "control";
  if (/energy|power|gauge|speedtest|wifisignal|graph|apex|bar_card|myenedis/.test(id)) return "energy";
  if (/weather|sun|pollen|moon/.test(id)) return "weather";
  if (/scene/.test(id)) return "scene";
  if (/person|tracker|tracer|presence|room|welcome/.test(id)) return "presence";
  if (/media|chromecast|playstation/.test(id)) return "media";
  if (/thermostat|heat_pump|aircondition|temperature|simple_temp/.test(id)) return "climate";
  if (/cover|door|garage/.test(id)) return "cover";
  if (/vacuum/.test(id)) return "vacuum";
  if (/light/.test(id)) return "light";
  if (/fan|outlet|boolean|script|washer|water_heater|qubino/.test(id)) return "control";
  if (/title|subtitle|clock|date/.test(id)) return "text";
  if (/camera/.test(id)) return "camera";
  if (/sensor|elapsed|input_number|input_datetime|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(id)) return "sensor";
  return "entity";
};

export const UPSTREAM_COMMIT = "f8a9cb67a53f91367f1dffe18516aa983b463cb5";

export const UPSTREAM_VARIANTS = [
  { id: "popup_cover", component: "card_cover", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_cover.yaml" },
  { id: "popup_light", component: "card_light", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_light.yaml" },
  { id: "popup_media_player", component: "card_media_player", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_media_player.yaml" },
  { id: "popup_power_outlet", component: "card_power_outlet", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_power_outlet.yaml" },
  { id: "popup_thermostat", component: "card_thermostat", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_thermostat.yaml" },
  { id: "popup_vacuum", component: "card_vacuum", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_vacuum.yaml" },
  { id: "popup_weather", component: "card_weather", sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_weather.yaml" },
] as const;

const variants: Record<string, string[]> = {
  card_binary_sensor: ["default", "alert"],
  card_generic: ["default", "swapped"],
  card_light: ["default", "slider", "compact"],
  card_media_player: ["default", "controls", "artwork"],
  card_weather: ["compact", "forecast", "no-external-resource"],
  card_person: ["default", "small"],
  card_room: ["default", "with-sensors"],
  card_vertical_button: ["default", "custom-state"],
  card_scenes: ["list", "welcome"],
  card_cover: ["default"],
  card_power_outlet: ["default"],
  card_thermostat: ["default"],
  card_vacuum: ["default"],
  custom_card_playstation: ["ps5", "xbox"],
};

const preferredDomainsFor = (id: string, family: string): string[] => {
  if (id === "custom_card_alarm_time") return ["input_boolean"];
  if (id === "custom_card_nik_door") return ["sensor"];
  if (/alarm/.test(id)) return ["alarm_control_panel"];
  if (/lock/.test(id)) return ["lock"];
  if (/power_outlet|more_power_outlet/.test(id)) return ["switch", "light"];
  if (id.includes("binary_sensor")) return ["binary_sensor"];
  if (id.includes("battery")) return ["sensor"];
  if (id.includes("input_boolean")) return ["input_boolean"];
  if (id.includes("input_number")) return ["input_number"];
  if (id.includes("input_datetime")) return ["input_datetime"];
  if (id.includes("light")) return ["light"];
  if (/media|chromecast|playstation/.test(id)) return ["media_player", "sensor"];
  if (/thermostat|heat_pump|aircondition/.test(id)) return ["climate"];
  if (/scene/.test(id)) return ["scene"];
  if (/script/.test(id)) return ["script"];
  if (/vacuum/.test(id)) return ["vacuum"];
  if (/weather/.test(id)) return ["weather"];
  if (/person/.test(id)) return ["person", "device_tracker"];
  if (/cover|door|garage/.test(id)) return ["cover", "binary_sensor"];
  if (/fan/.test(id)) return ["fan"];
  if (/camera/.test(id)) return ["camera"];
  if (/lock/.test(id)) return ["lock"];
  if (/update/.test(id)) return ["update"];
  if (family === "battery" || family === "energy" || family === "sensor" || family === "weather") return ["sensor"];
  if (family === "control") {
    if (/fan/.test(id)) return ["fan"];
    if (/script/.test(id)) return ["script"];
    if (/washer/.test(id)) return ["switch", "sensor"];
    if (/water_heater/.test(id)) return ["water_heater"];
    return ["switch", "input_boolean", "light"];
  }
  if (family === "presence") return ["person", "device_tracker"];
  return ["sensor", "switch"];
};

const makeItem = (
  upstreamId: string,
  kind: "card" | "chip",
  sourcePath: string,
): CatalogItem => {
  const componentId = upstreamId
    .replace(/^custom_(card|chip)_/, "")
    .replace(/^(card|chip)_/, "");
  const slug = upstreamId.replaceAll("_", "-").toLowerCase();
  const tag = slug.startsWith("custom-card-") || slug.startsWith("custom-chip-")
    ? `mushroom-addition-${slug}`
    : `mushroom-addition-${kind}-${slug.replace(new RegExp(`^${kind}-`), "")}`;
  const family = familyFor(upstreamId);
  const consoleCard = upstreamId === "custom_card_playstation";
  return {
    upstreamId,
    sourcePath,
    kind,
    family,
    tag,
    name: consoleCard
      ? "PS5 / Xbox Card"
      : `${humanize(componentId)} ${kind === "chip" ? "Chip" : "Card"}`,
    description: consoleCard
      ? "Mushroom-style game console card with PS5 and Xbox modes."
      : `Mushroom-style ${humanize(componentId).toLowerCase()} ${kind}.`,
    variants: variants[upstreamId],
    preferredDomains: preferredDomainsFor(upstreamId, family),
  };
};

export const CATALOG: readonly CatalogItem[] = [
  {
    upstreamId: "chips_container",
    sourcePath: "Mushroom Cards Addition composition component",
    kind: "container",
    family: "chips",
    tag: "mushroom-addition-chips-card",
    name: "Addition Chips Card",
    description: "Compose Addition chips in a responsive row.",
  },
  ...baseCards.map((id) => {
    const sourcePaths: Partial<Record<typeof id, string>> = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml",
    };
    return makeItem(
      `card_${id}`,
      "card",
      sourcePaths[id] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${id}.yaml`,
    );
  }),
  ...baseChips.map((id) => makeItem(
    `chip_${id}`,
    "chip",
    `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_${id}.yaml`,
  )),
  ...customCards.map((id) => makeItem(
    `custom_card_${id}`,
    "card",
    `custom_cards/custom_card_${id}`,
  )),
  ...customChips.map((id) => makeItem(
    `custom_chip_${id}`,
    "chip",
    `custom_cards/custom_chip_${id}`,
  )),
] as const;

export const PUBLIC_CATALOG = CATALOG.filter((item) => item.kind !== "container");

export const getCatalogItem = (tag: string): CatalogItem | undefined =>
  CATALOG.find((item) => item.tag === tag);
