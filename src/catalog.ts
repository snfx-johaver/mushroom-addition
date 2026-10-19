import type { CatalogItem } from "./types";

const baseCards = [
  "battery", "cover", "graph", "media_player",
  "person", "room", "scenes",
  "welcome_scenes",
] as const;

const customCards = [
  "trash", "alarm_time", "apexcharts", "bar_card", "camera", "chromecast",
  "power_details", "device_tracker", "roomview",
  "room_overview", "welcome",
  "washer", "sun",
  "media_library", "person_location",
  "input_datetime", "entity_overview", "internet_speed",
  "weather_metrics", "media_player_sonos", "more_power_outlet",
  "gauge", "printer",
  "nas_metrics", "tablet",
  "pollen_forecast", "welcome_dashboard",
  "person_info", "person_info_small", "playstation", "person_tracker",
  "scenes", "vehicle_status", "plant",
  "speedtest_gauges", "better_thermostat",
  "pollen",
] as const;

const humanize = (id: string): string =>
  id
    .split("_")
    .filter((word) => word.toLowerCase() !== "ulm")
    .map((word) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(word.toLowerCase())
      ? word.toUpperCase()
      : `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");

const familyFor = (id: string): string => {
  if (id === "custom_card_bar_card") return "bar";
  if (id === "custom_card_alarm_time") return "alarm-time";
  if (/alarm|alert|lock/.test(id)) return "security";
  if (/navigate|back/.test(id)) return "navigation";
  if (/battery/.test(id)) return "battery";
  if (/power_outlet|more_power_outlet/.test(id)) return "control";
  if (/energy|power|gauge|speedtest|graph|apex|bar_card|myenedis/.test(id)) return "energy";
  if (/weather|sun|pollen|moon/.test(id)) return "weather";
  if (/scene/.test(id)) return "scene";
  if (/person|tracker|tracer|presence|room|welcome/.test(id)) return "presence";
  if (/media|chromecast|playstation/.test(id)) return "media";
  if (/thermostat|heat_pump|aircondition|temperature|simple_temp/.test(id)) return "climate";
  if (/cover|door|garage/.test(id)) return "cover";
  if (/vacuum/.test(id)) return "vacuum";
  if (/light/.test(id)) return "light";
  if (/fan|outlet|boolean|script|washer|water_heater|qubino/.test(id)) return "control";
  if (/input_number|input_datetime/.test(id)) return "sensor";
  if (/title|subtitle|clock|date/.test(id)) return "text";
  if (/camera/.test(id)) return "camera";
  if (/sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(id)) return "sensor";
  return "entity";
};

export const UPSTREAM_VARIANTS = [
  { id: "popup_cover", component: "card_cover", sourcePath: "reference_catalog/popups/popup_cover.yaml" },
  { id: "popup_media_player", component: "card_media_player", sourcePath: "reference_catalog/popups/popup_media_player.yaml" },
] as const;

const variants: Record<string, string[]> = {
  card_media_player: ["default", "controls", "artwork"],
  card_person: ["default", "small"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"],
  card_cover: ["default"],
  custom_card_media_library: ["library", "upcoming"],
  custom_card_welcome_dashboard: ["message", "weather", "news"],
  custom_card_better_thermostat: ["normal", "compact"],
};

const preferredDomainsFor = (id: string, family: string): string[] => {
  if (id === "custom_card_alarm_time") return ["input_boolean"];
  if (/alarm/.test(id)) return ["alarm_control_panel"];
  if (/lock/.test(id)) return ["lock"];
  if (/power_outlet|more_power_outlet/.test(id)) return ["switch", "light"];
  if (id.includes("binary_sensor")) return ["binary_sensor"];
  if (id.includes("battery")) return ["sensor"];
  if (id.includes("input_boolean")) return ["input_boolean"];
  if (id.includes("input_number")) return ["input_number", "counter", "select", "input_select"];
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
  sourcePath: string,
): CatalogItem => {
  const componentId = upstreamId
    .replace(/^custom_(card|chip)_/, "")
    .replace(/^(card|chip)_/, "");
  const slug = upstreamId.replaceAll("_", "-").toLowerCase();
  const tag = slug.startsWith("custom-card-")
    ? `mushroom-addition-${slug}`
    : `mushroom-addition-card-${slug.replace(/^card-/, "")}`;
  const family = familyFor(upstreamId);
  const consoleCard = upstreamId === "custom_card_playstation";
  const displayNames: Partial<Record<string, string>> = {
    custom_card_trash: "Trash",
    custom_card_entity_overview: "Entity Overview",
    custom_card_internet_speed: "Internet Speed",
    custom_card_weather_metrics: "Weather Metrics",
    custom_card_gauge: "Gauge",
    custom_card_printer: "Printer",
    custom_card_nas_metrics: "NAS",
    custom_card_tablet: "Tablet",
    custom_card_plant: "Flower",
    custom_card_pollen: "Pollen",
    custom_card_better_thermostat: "Better Thermostat",
  };
  const displayDescriptions: Partial<Record<string, string>> = {
    custom_card_trash: "Mushroom-style trash collection schedule card.",
    custom_card_entity_overview: "Mushroom-style multi-entity status card.",
    custom_card_internet_speed: "Mushroom-style internet speed and router status card.",
    custom_card_weather_metrics: "Mushroom-style weather metrics card.",
    custom_card_gauge: "Mushroom-style sensor gauge card.",
    custom_card_printer: "Mushroom-style printer status and toner level card.",
    custom_card_tablet: "Mushroom-style tablet status and maintenance card.",
    custom_card_plant: "Mushroom-style plant health card.",
    custom_card_pollen: "Mushroom-style pollen level card.",
    custom_card_better_thermostat: "Touch-friendly climate card with Better Thermostat status and controls.",
  };
  return {
    upstreamId,
    sourcePath,
    kind: "card",
    category: upstreamId.startsWith("custom_")
      ? "custom-card"
      : "default-card",
    family,
    tag,
    name: consoleCard
      ? "PS4 Card"
      : upstreamId === "custom_card_nas_metrics"
        ? "NAS Card"
      : `${displayNames[upstreamId] ?? humanize(componentId)} Card`,
    description: consoleCard
      ? "Source-faithful media artwork card for a PlayStation entity."
      : upstreamId === "custom_card_nas_metrics"
        ? "Mushroom-style NAS status and utilization card."
      : displayDescriptions[upstreamId] ?? `Mushroom-style ${humanize(componentId).toLowerCase()} card.`,
    variants: variants[upstreamId],
    variantLabels: upstreamId === "custom_card_welcome_dashboard"
      ? { message: "Welcome message", weather: "Welcome with weather", news: "Welcome with news" }
      : undefined,
    preferredDomains: preferredDomainsFor(upstreamId, family),
  };
};

export const SOURCE_ONLY_HELPERS = [
  {
    id: "custom_template_battery_info",
    reason: "Reusable implementation template, not a standalone user-facing custom card.",
    sourcePath: "custom_cards/custom_template_battery_info",
  },
] as const;

export const UPSTREAM_CATALOG: readonly CatalogItem[] = [
  ...baseCards.map((id) => {
    const sourcePaths: Partial<Record<typeof id, string>> = {
      graph: "reference_catalog/cards/card_graph.yaml",
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml",
    };
    return makeItem(
      `card_${id}`,
      sourcePaths[id] ?? `reference_catalog/cards/card_${id}.yaml`,
    );
  }),
  ...customCards.map((id) => makeItem(
    `custom_card_${id}`,
    id === "better_thermostat"
      ? "https://github.com/KartoffelToby/better-thermostat-ui-card"
      : `custom_cards/custom_card_${id}`,
  )),
] as const;

interface ComponentGroup {
  canonical: string;
  sources: Record<string, string>;
  variants: string[];
  variantLabels: Record<string, string>;
  name?: string;
  description?: string;
}

export const COMPONENT_GROUPS: readonly ComponentGroup[] = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card",
  },
  {
    canonical: "custom_card_person_info",
    sources: {
      custom_card_person_info: "full",
      custom_card_person_info_small: "small",
    },
    variants: ["full", "small"],
    variantLabels: { full: "Full person details", small: "Compact person details" },
    name: "Person Info Card",
  },
] as const;

const sourceToGroup = new Map<string, ComponentGroup>();
for (const group of COMPONENT_GROUPS) {
  for (const sourceId of Object.keys(group.sources)) sourceToGroup.set(sourceId, group);
}

const canonicalIds = new Set(COMPONENT_GROUPS.map((group) => group.canonical));
export const PUBLIC_CATALOG: readonly CatalogItem[] = UPSTREAM_CATALOG
  .filter((item) => !sourceToGroup.has(item.upstreamId) || canonicalIds.has(item.upstreamId))
  .map((item) => {
    const group = sourceToGroup.get(item.upstreamId);
    if (!group) return { ...item, sourceIds: [item.upstreamId] };
    return {
      ...item,
      name: group.name ?? item.name,
      description: group.description ?? item.description,
      variants: group.variants,
      variantLabels: group.variantLabels,
      sourceIds: Object.keys(group.sources),
    };
  });

export interface CatalogAlias {
  upstreamId: string;
  tag: string;
  targetId: string;
  targetTag: string;
  variant: string;
}

export const LEGACY_ALIASES: readonly CatalogAlias[] = UPSTREAM_CATALOG
  .filter((item) => sourceToGroup.has(item.upstreamId) && !canonicalIds.has(item.upstreamId))
  .map((item) => {
    const group = sourceToGroup.get(item.upstreamId)!;
    const target = PUBLIC_CATALOG.find((candidate) => candidate.upstreamId === group.canonical)!;
    return {
      upstreamId: item.upstreamId,
      tag: item.tag,
      targetId: target.upstreamId,
      targetTag: target.tag,
      variant: group.sources[item.upstreamId],
    };
  });

export const CATALOG: readonly CatalogItem[] = PUBLIC_CATALOG;

export const getCatalogItem = (tag: string): CatalogItem | undefined =>
  CATALOG.find((item) => item.tag === tag) ??
  (() => {
    const alias = LEGACY_ALIASES.find((item) => item.tag === tag);
    return alias ? PUBLIC_CATALOG.find((item) => item.tag === alias.targetTag) : undefined;
  })();

export const publicItemForSource = (upstreamId: string): CatalogItem | undefined => {
  const group = sourceToGroup.get(upstreamId);
  const publicId = group?.canonical ?? upstreamId;
  return PUBLIC_CATALOG.find((item) => item.upstreamId === publicId);
};

export const variantForSource = (upstreamId: string): string | undefined =>
  sourceToGroup.get(upstreamId)?.sources[upstreamId];
