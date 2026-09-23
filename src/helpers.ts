import type { AdditionConfig, HassEntity } from "./types";

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
    show_icon: true,
    show_state: true,
    layout: "horizontal",
    tap_action: defaultAction,
    ...upstream,
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
  if (config.entity) return { ...config, primary_entity: undefined };
  const legacy = config.primary_entity ||
    legacyEntityKeys.map((key) => config[key]).find((value): value is string => typeof value === "string");
  return legacy ? { ...config, entity: legacy, primary_entity: undefined } : { ...config };
};
