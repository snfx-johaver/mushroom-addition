import type { AdditionConfig, WasteStreamConfig } from "./types";

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

export const wasteStreamsForConfig = (config: AdditionConfig): WasteStreamConfig[] => {
  if (config.waste_streams?.length) return config.waste_streams.map((stream) => ({ ...stream }));
  const isWasteCard = config.type.includes("custom-card-afvalophaling");
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
  if (config.waste_streams?.length) return config;
  const streams = wasteStreamsForConfig(config);
  return streams.length ? { ...config, waste_streams: streams } : config;
};
