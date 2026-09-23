import type { AdditionConfig, HassEntity } from "./types";
import { migrateWasteStreamConfig } from "./waste-streams";

export const activeStates = new Set([
  "on", "open", "opening", "playing", "home", "heat", "cool", "heating",
  "cleaning", "unlocked", "active",
]);

export const stateLabel = (entity?: HassEntity): string => {
  if (!entity) return "Entity unavailable";
  const unit = entity.attributes.unit_of_measurement;
  return unit ? `${entity.state} ${String(unit)}` : entity.state.replaceAll("_", " ");
};

export const displayName = (config: AdditionConfig, entity?: HassEntity): string =>
  config.name_mode === "none" ? "" :
    config.name_mode === "entity" ? entity?.attributes.friendly_name || config.entity || "Mushroom Addition" :
      config.name || entity?.attributes.friendly_name || config.entity || "Mushroom Addition";

export const fireEvent = (
  node: HTMLElement,
  type: string,
  detail: Record<string, unknown>,
): void => {
  node.dispatchEvent(new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail,
  }));
};

export const handleAction = (
  node: HTMLElement,
  config: AdditionConfig,
  action: "tap" | "hold" | "double_tap",
): void => {
  fireEvent(node, "hass-action", { config, action });
};

export const normalizeConfig = (config: AdditionConfig): AdditionConfig => {
  const migrated = migrateLegacyConfig(config);
  const upstream = upstreamCompatibility(migrated);
  const defaultAction = migrated.navigation_path
    ? { action: "navigate", navigation_path: migrated.navigation_path }
    : { action: migrated.entity ? "more-info" : "none" };
  return {
    ...upstream,
    show_icon: upstream.show_icon ?? true,
    show_state: upstream.show_state ?? true,
    name_mode: upstream.name_mode ?? (migrated.name ? "custom" : "entity"),
    icon_type: upstream.icon_type ?? (
      migrated.use_entity_picture ? "entity-picture" :
        migrated.show_icon === false ? "none" : "icon"
    ),
    layout: upstream.layout ?? "default",
    fill_container: upstream.fill_container ?? false,
    primary_info: upstream.primary_info ?? "name",
    secondary_info: upstream.secondary_info ?? "default",
    tap_action: upstream.tap_action ?? defaultAction,
  };
};

const configuredValue = (config: AdditionConfig, pattern: RegExp): unknown =>
  Object.entries(config).find(([key, value]) => pattern.test(key) && value !== undefined)?.[1];

const upstreamCompatibility = (config: AdditionConfig): AdditionConfig => {
  const name = configuredValue(config, /_name$/);
  const icon = configuredValue(config, /_icon$/);
  const color = configuredValue(config, /_color$/);
  const controls = configuredValue(config, /_enable_(controls|buttons)$/);
  const slider = configuredValue(config, /_enable_slider$/);
  const horizontal = configuredValue(config, /_enable_horizontal$/);
  return {
    ...config,
    name: config.name ?? (typeof name === "string" ? name : undefined),
    icon: config.icon ?? (typeof icon === "string" ? icon : undefined),
    icon_color: config.icon_color ?? (typeof color === "string" ? color : undefined),
    show_controls: config.show_controls ?? (
      typeof controls === "boolean" ? controls :
        typeof slider === "boolean" ? slider : undefined
    ),
    layout: config.layout ?? (horizontal === true ? "horizontal" : undefined),
  };
};

const legacyEntityKeys = [
  "ulm_card_person_entity",
  "ulm_card_light_entity",
  "ulm_card_weather_entity",
  "ulm_card_media_player_entity",
  "ulm_card_thermostat_entity",
  "ulm_card_cover_entity",
  "ulm_card_vacuum_entity",
] as const;

export const migrateLegacyConfig = (config: AdditionConfig): AdditionConfig => {
  const wasteMigrated = migrateWasteStreamConfig(config);
  if (wasteMigrated.entity) return { ...wasteMigrated, primary_entity: undefined };
  const legacy = wasteMigrated.primary_entity ||
    legacyEntityKeys.map((key) => wasteMigrated[key]).find((value): value is string => typeof value === "string");
  return legacy
    ? { ...wasteMigrated, entity: legacy, primary_entity: undefined }
    : { ...wasteMigrated };
};
