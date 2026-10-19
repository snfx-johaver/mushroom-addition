import type { AdditionConfig, HomeAssistant } from "./types";

export interface SonosControlDefinition {
  configKey: string;
  domain: "switch" | "number";
  suffix: string;
  label: string;
  icon: string;
}

export const SONOS_SWITCH_CONTROLS: readonly SonosControlDefinition[] = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" },
];

export const SONOS_NUMBER_CONTROLS: readonly SonosControlDefinition[] = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" },
];

export const SONOS_CONTROLS = [...SONOS_SWITCH_CONTROLS, ...SONOS_NUMBER_CONTROLS] as const;

const objectId = (entityId: string): string => entityId.split(".", 2)[1] ?? entityId;
const normalizedPlayerId = (entityId: string): string => objectId(entityId).replace(/_\d+$/, "");
const matchesControl = (entityId: string, control: SonosControlDefinition): boolean => {
  if (!entityId.startsWith(`${control.domain}.`)) return false;
  const id = objectId(entityId);
  if (control.suffix === "surround_level" && id.endsWith("_music_surround_level")) return false;
  return id === control.suffix || id.endsWith(`_${control.suffix}`);
};
const controlCount = (entityIds: string[]): number =>
  SONOS_CONTROLS.filter((control) => entityIds.some((entityId) => matchesControl(entityId, control))).length;

export const resolveSonosControlEntities = (
  hass: HomeAssistant | undefined,
  primaryEntityId: string | undefined,
  config?: AdditionConfig,
): Record<string, string> => {
  if (!hass || !primaryEntityId) return {};
  const stateIds = Object.keys(hass.states);
  const registry = hass.entities ?? {};
  const primaryPlayerId = normalizedPlayerId(primaryEntityId);
  const playerAliases = [...new Set([primaryEntityId, ...stateIds.filter((entityId) =>
    entityId.startsWith("media_player.") && normalizedPlayerId(entityId) === primaryPlayerId)])];
  const deviceIds = [...new Set(playerAliases
    .map((entityId) => registry[entityId]?.device_id)
    .filter((deviceId): deviceId is string => typeof deviceId === "string" && deviceId.length > 0))];
  const devicePools = deviceIds.map((deviceId) => stateIds.filter((entityId) =>
    registry[entityId]?.device_id === deviceId));
  const bestDevicePool = devicePools.sort((left, right) => controlCount(right) - controlCount(left))[0] ?? [];
  const prefixPool = stateIds.filter((entityId) => {
    const domain = entityId.split(".", 1)[0];
    const id = objectId(entityId);
    return ["switch", "number"].includes(domain) &&
      (id === primaryPlayerId || id.startsWith(`${primaryPlayerId}_`));
  });
  const candidates = [...new Set([...bestDevicePool, ...prefixPool])];

  return Object.fromEntries(SONOS_CONTROLS.flatMap((control) => {
    const configured = config?.[control.configKey];
    if (typeof configured === "string" && configured.length > 0) return [[control.configKey, configured]];
    const discovered = candidates.find((entityId) => matchesControl(entityId, control));
    return discovered ? [[control.configKey, discovered]] : [];
  }));
};

export const sonosControlCount = (
  hass: HomeAssistant | undefined,
  primaryEntityId: string,
): number => Object.keys(resolveSonosControlEntities(hass, primaryEntityId)).length;
