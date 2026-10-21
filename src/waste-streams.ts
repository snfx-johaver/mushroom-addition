import type { AdditionConfig, HomeAssistant, WasteStreamConfig } from "./types";

export interface WasteStreamPreset extends Required<Pick<WasteStreamConfig, "preset" | "label" | "icon" | "color">> {
  legacyKey?: string;
  enabledByDefault: boolean;
}

export const WASTE_STREAM_PRESETS: readonly WasteStreamPreset[] = [
  { preset: "residual", label: "Residual waste", icon: "mdi:trash-can", color: "#43a047", legacyKey: "ulm_card_datum_rest", enabledByDefault: true },
  { preset: "paper", label: "Paper", icon: "mdi:newspaper-variant", color: "#1e88e5", legacyKey: "ulm_card_datum_papier", enabledByDefault: true },
  { preset: "packaging", label: "Packaging / PMD", icon: "mdi:recycle", color: "#f9a825", legacyKey: "ulm_card_datum_pmd", enabledByDefault: true },
  { preset: "organic", label: "Organic / GFT", icon: "mdi:leaf", color: "#7cb342", legacyKey: "ulm_card_datum_gft", enabledByDefault: true },
  { preset: "glass", label: "Glass", icon: "mdi:bottle-soda", color: "#00897b", legacyKey: "ulm_card_datum_glas", enabledByDefault: true },
  { preset: "bulky", label: "Bulky waste", icon: "mdi:sofa", color: "#8d6e63", enabledByDefault: false },
  { preset: "toxic", label: "Small toxic waste", icon: "mdi:biohazard", color: "#e53935", enabledByDefault: false },
  { preset: "christmas-tree", label: "Christmas tree", icon: "mdi:pine-tree", color: "#2e7d32", enabledByDefault: false },
  { preset: "branches", label: "Branches", icon: "mdi:forest", color: "#558b2f", enabledByDefault: false },
  { preset: "textile", label: "Textile", icon: "mdi:tshirt-crew", color: "#8e24aa", enabledByDefault: false },
];

const streamFromPreset = (
  preset: WasteStreamPreset,
  entity?: string,
  enabled = preset.enabledByDefault,
): WasteStreamConfig => ({
  preset: preset.preset,
  enabled,
  entity,
  label: preset.label,
  icon: preset.icon,
  color: preset.color,
});

export const defaultWasteStreams = (): WasteStreamConfig[] =>
  WASTE_STREAM_PRESETS.map((preset) => streamFromPreset(preset));

export const wasteStreamExamples = (
  hass?: HomeAssistant,
  entities: string[] = [],
  entitiesFallback: string[] = [],
): WasteStreamConfig[] => {
  const terms: Record<string, RegExp> = {
    residual: /\b(residual|restafval|restafvalzak|rest|general waste|household waste|rubbish)\b/,
    paper: /\b(paper|papier|cardboard|karton)\b/,
    packaging: /\b(packaging|pmd|plastic|plastics|verpakking|verpakkingen)\b/,
    organic: /\b(organic|gft|bio|biowaste|compost|groente|tuinafval)\b/,
    glass: /\b(glass|glas)\b/,
    bulky: /\b(bulky|grofvuil|groot huisvuil)\b/,
    toxic: /\b(toxic|kca|chemisch)\b/,
    "christmas-tree": /\b(christmas|kerstboom|kerstbomen)\b/,
    branches: /\b(branches|takken|snoeiafval)\b/,
    textile: /\b(textile|textiles|textiel)\b/,
  };
  const available = [...new Set([...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})])];
  return available.flatMap(id => {
    const entity = hass?.states[id];
    if (!entity || !/^(sensor|calendar)\./.test(id) ||
      ["", "unknown", "unavailable", "none", "null"].includes(entity.state.trim().toLowerCase())) return [];
    const text = [id, entity.attributes.friendly_name].filter(Boolean).join(" ").toLowerCase().replaceAll("_", " ");
    const platform = hass?.entities?.[id]?.platform ?? "";
    const collection = /\b(waste|trash|garbage|rubbish|recycling|recycle|afval(?:wijzer|info|beheer)?|ophaling|ophaaldag|inzameling|vuilnis)\b/.test(text) ||
      /waste|trash|afval|garbage/.test(platform);
    if (!collection || /\b(today|tomorrow|vandaag|morgen|update|updated|last update|days until|dagen tot)\b/.test(text)) return [];
    const preset = WASTE_STREAM_PRESETS.find(candidate => terms[candidate.preset]?.test(text));
    if (preset) return [{ ...streamFromPreset(preset, id, true), label: String(entity.attributes.friendly_name || preset.label) }];
    return [{
      enabled: true,
      entity: id,
      label: String(entity.attributes.friendly_name || id),
      icon: typeof entity.attributes.icon === "string" ? entity.attributes.icon : "mdi:trash-can",
      color: "#43a047",
    }];
  }).slice(0, 6);
};

export const wasteStreamsForConfig = (config: AdditionConfig): WasteStreamConfig[] => {
  if (config.waste_streams?.length) return config.waste_streams.map((stream) => ({ ...stream }));
  const isWasteCard = config.type.includes("custom-card-trash");
  const hasLegacyStreams = WASTE_STREAM_PRESETS.some((preset) =>
    preset.legacyKey && typeof config[preset.legacyKey] === "string");
  if (!isWasteCard && !hasLegacyStreams) return [];
  return WASTE_STREAM_PRESETS.map((preset, index) => {
    const legacyEntity = preset.legacyKey && typeof config[preset.legacyKey] === "string"
      ? config[preset.legacyKey] as string
      : undefined;
    const entity = legacyEntity ?? (index === 0 ? config.entity : undefined);
    return streamFromPreset(preset, entity, entity ? true : preset.enabledByDefault);
  });
};

export const migrateWasteStreamConfig = (config: AdditionConfig): AdditionConfig => {
  const isWasteCard = config.type.includes("custom-card-trash");
  const todayEntity = config.today_entity ??
    (typeof config.ulm_card_ophaling_vandaag === "string" ? config.ulm_card_ophaling_vandaag : undefined);
  const tomorrowEntity = config.tomorrow_entity ??
    (typeof config.ulm_card_ophaling_morgen === "string" ? config.ulm_card_ophaling_morgen : undefined);
  if (!isWasteCard && !todayEntity && !tomorrowEntity) return config;
  const streams = config.waste_streams?.length ? config.waste_streams : wasteStreamsForConfig(config);
  return {
    ...config,
    waste_streams: streams.length ? streams : config.waste_streams,
    today_entity: todayEntity,
    tomorrow_entity: tomorrowEntity,
    show_today: config.show_today ?? Boolean(todayEntity),
    show_tomorrow: config.show_tomorrow ?? Boolean(tomorrowEntity),
  };
};
