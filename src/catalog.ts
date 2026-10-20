import type { CatalogItem } from "./types";

const baseCards = [
  "battery", "media_player",
  "room", "scenes",
  "welcome_scenes",
] as const;

const customCards = [
  "trash", "alarm_time", "bar_card",
  "roomview",
  "room_overview", "welcome",
  "washer", "sun",
  "input_datetime",
  "weather_metrics", "media_player_sonos",
  "printer",
  "nas_metrics", "tablet",
  "playstation",
  "scenes", "plant",
  "speedtest_gauges",
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
  if (/media|playstation/.test(id)) return "media";
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
  { id: "popup_media_player", component: "card_media_player", sourcePath: "reference_catalog/popups/popup_media_player.yaml" },
] as const;

const variants: Record<string, string[]> = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"],
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
  if (/media|playstation/.test(id)) return ["media_player", "sensor"];
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
  const tag = upstreamId === "custom_card_playstation"
    ? "mushroom-addition-custom-card-game-console"
    : slug.startsWith("custom-card-")
    ? `mushroom-addition-${slug}`
    : `mushroom-addition-card-${slug.replace(/^card-/, "")}`;
  const family = familyFor(upstreamId);
  const consoleCard = upstreamId === "custom_card_playstation";
  const displayNames: Partial<Record<string, string>> = {
    custom_card_trash: "Trash",
    custom_card_weather_metrics: "Weather Metrics",
    custom_card_printer: "Printer",
    custom_card_washer: "Washer-Dryer",
    custom_card_nas_metrics: "NAS",
    custom_card_tablet: "Tablet",
    custom_card_plant: "Flower",
    custom_card_pollen: "Pollen",
    custom_card_sun: "Astronomy",
    custom_card_entity_carousel: "Entity Carousel",
  };
  const displayDescriptions: Partial<Record<string, string>> = {
    custom_card_trash: "Mushroom-style trash collection schedule card.",
    custom_card_weather_metrics: "Mushroom-style weather metrics card.",
    custom_card_printer: "Mushroom-style printer status and toner level card.",
    custom_card_washer: "Mushroom-style washer and dryer program, progress, power, status, and remote control card.",
    custom_card_tablet: "Mushroom-style tablet status and maintenance card.",
    custom_card_plant: "Mushroom-style plant health card.",
    custom_card_pollen: "Mushroom-style pollen level card.",
    custom_card_sun: "Mushroom-style Sun and Moon position, phase, timing, and ephemeris card.",
    custom_card_entity_carousel: "Dependency-free swipeable entity and action carousel with cover-flow navigation.",
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
      ? "Game Console Card"
      : upstreamId === "custom_card_nas_metrics"
        ? "NAS Card"
      : `${displayNames[upstreamId] ?? humanize(componentId)} Card`,
    description: consoleCard
      ? "Mushroom-style Xbox, PlayStation, and Nintendo profile, activity, artwork, and control card."
      : upstreamId === "custom_card_nas_metrics"
        ? "Mushroom-style NAS status and utilization card."
      : displayDescriptions[upstreamId] ?? `Mushroom-style ${humanize(componentId).toLowerCase()} card.`,
    variants: variants[upstreamId],
    variantLabels: undefined,
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
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml",
    };
    return makeItem(
      `card_${id}`,
      sourcePaths[id] ?? `reference_catalog/cards/card_${id}.yaml`,
    );
  }),
  ...customCards.map((id) => makeItem(
    `custom_card_${id}`,
    `custom_cards/custom_card_${id}`,
  )),
  {
    upstreamId: "mini_graph_card",
    sourcePath: "https://github.com/kalkih/mini-graph-card",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-mini-graph-card",
    name: "Mini Graph Card",
    description: "Mushroom-style recorder history card with line and bar charts, aggregation, thresholds, and dual axes.",
    variants: ["line", "bar"],
    variantLabels: { line: "Line graph", bar: "Bar graph" },
    preferredDomains: ["sensor", "binary_sensor", "input_number"],
  },
] as const;

export const NATIVE_CATALOG: readonly CatalogItem[] = [
  makeItem("custom_card_entity_carousel", "src/entity-carousel.ts"),
  {
    upstreamId: "advanced_home_energy_management",
    sourcePath: "src/energy-management.ts",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-advanced-home-energy-management",
    name: "Advanced Energy - Home Energy Management",
    description: "Circular whole-home energy dashboard with grid, solar, battery, consumption, tariff, and panel-health intelligence.",
    preferredDomains: ["sensor"],
  },
  {
    upstreamId: "advanced_energy_buy_sell",
    sourcePath: "src/energy-buy-sell.ts",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-advanced-energy-buy-and-sell",
    name: "Advanced Energy - Energy Buy and Sell",
    description: "Mushroom-style electricity price chart with planned grid charging and energy sale periods.",
    preferredDomains: ["sensor"],
  },
  {
    upstreamId: "advanced_energy_panel_health",
    sourcePath: "src/panel-health.ts",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-advanced-energy-panel-health",
    name: "Advanced Energy - Panel Health",
    description: "Mushroom-style solar panel output summary and per-panel performance gauges.",
    preferredDomains: ["sensor"],
  },
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
] as const;

const sourceToGroup = new Map<string, ComponentGroup>();
for (const group of COMPONENT_GROUPS) {
  for (const sourceId of Object.keys(group.sources)) sourceToGroup.set(sourceId, group);
}

const canonicalIds = new Set(COMPONENT_GROUPS.map((group) => group.canonical));
export const PUBLIC_CATALOG: readonly CatalogItem[] = [
  ...UPSTREAM_CATALOG
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
    }),
  ...NATIVE_CATALOG.map((item) => ({ ...item, sourceIds: [item.upstreamId] })),
];

export interface CatalogAlias {
  upstreamId: string;
  tag: string;
  targetId: string;
  targetTag: string;
  variant?: string;
}

const generatedLegacyAliases: readonly CatalogAlias[] = UPSTREAM_CATALOG
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

export const LEGACY_ALIASES: readonly CatalogAlias[] = [
  ...generatedLegacyAliases,
  {
    upstreamId: "custom_card_playstation",
    tag: "mushroom-addition-custom-card-playstation",
    targetId: "custom_card_playstation",
    targetTag: "mushroom-addition-custom-card-game-console",
  },
];

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
