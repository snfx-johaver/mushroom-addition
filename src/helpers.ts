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
  const defaultAction = upstream.navigation_path
    ? { action: "navigate", navigation_path: upstream.navigation_path }
    : { action: upstream.entity ? "more-info" : "none" };
  const roomDoubleTap = String(config.type).includes("card-room") &&
    upstream.input_select_entity &&
    upstream.input_select_option
    ? {
      action: "perform-action",
      perform_action: "input_select.select_option",
      target: { entity_id: upstream.input_select_entity },
      data: { option: upstream.input_select_option },
    }
    : undefined;
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
    hold_action: upstream.hold_action ?? (
      upstream.variant === "small" && typeof upstream.ulm_card_person_battery_entity === "string"
        ? { action: "more-info", entity: upstream.ulm_card_person_battery_entity }
        : undefined
    ),
    double_tap_action: upstream.double_tap_action ?? roomDoubleTap,
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
    name: config.name ?? (
      typeof config.ulm_card_navigate_title === "string" ? config.ulm_card_navigate_title :
        typeof name === "string" ? name : undefined
    ),
    icon: config.icon ?? (
      typeof config.ulm_card_navigate_icon === "string" ? config.ulm_card_navigate_icon :
        typeof icon === "string" ? icon : undefined
    ),
    icon_color: config.icon_color ?? (typeof color === "string" ? color : undefined),
    navigation_path: config.navigation_path ?? (
      typeof config.ulm_card_navigate_path === "string" ? config.ulm_card_navigate_path : undefined
    ),
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
  "ulm_card_graph_entity",
] as const;

export const migrateLegacyConfig = (config: AdditionConfig): AdditionConfig => {
  const wasteMigrated = migrateWasteStreamConfig(config);
  const legacy = wasteMigrated.primary_entity ||
    legacyEntityKeys.map((key) => wasteMigrated[key]).find((value): value is string => typeof value === "string");
  const entityId = (value: unknown): string | undefined => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "entity_id" in value && typeof value.entity_id === "string") {
      return value.entity_id;
    }
    return undefined;
  };
  const migrated: AdditionConfig = {
    ...wasteMigrated,
    entity: wasteMigrated.entity ?? legacy,
    primary_entity: undefined,
  };
  if (String(config.type).includes("card-person")) {
    migrated.battery_entity ??= entityId(config.ulm_card_person_battery);
    migrated.eta_entity ??= entityId(config.ulm_card_person_eta);
    migrated.address_entity ??= entityId(config.ulm_address);
    migrated.use_entity_picture ??= typeof config.ulm_card_person_use_entity_picture === "boolean"
      ? config.ulm_card_person_use_entity_picture
      : undefined;
  }
  if (String(config.type).includes("card-power-outlet")) {
    migrated.consumption_entity ??= entityId(config.ulm_card_power_outlet_consumption_sensor);
  }
  if (String(config.type).includes("card-room")) {
    migrated.input_select_entity ??= entityId(config.ulm_input_select);
    migrated.input_select_option ??= typeof config.ulm_input_select_option === "string"
      ? config.ulm_input_select_option
      : undefined;
  }
  if (String(config.type).includes("card-thermostat")) {
    migrated.fan_entity ??= entityId(config.ulm_card_thermostat_fan_entity);
    migrated.thermostat_minimum_temp_spread ??= typeof config.ulm_card_thermostat_minimum_temp_spread === "number"
      ? config.ulm_card_thermostat_minimum_temp_spread
      : undefined;
    migrated.thermostat_temp_step ??= typeof config.ulm_card_thermostat_temp_step === "number"
      ? config.ulm_card_thermostat_temp_step
      : undefined;
  }
  if (String(config.type).includes("nik-nas")) {
    migrated.temperature_entity ??= entityId(config.entity_1);
    migrated.memory_entity ??= entityId(config.entity_2);
    migrated.cpu_entity ??= entityId(config.entity_3);
    migrated.disk_entity ??= entityId(config.entity_4);
  }
  if (String(config.type).includes("nik-tablet")) {
    migrated.entity ??= entityId(config.ulm_custom_card_nik_tablet_main);
    migrated.battery_entity ??= entityId(config.ulm_custom_card_nik_tablet_battery);
    migrated.tablet_button_usb_entity ??= entityId(config.ulm_custom_card_nik_tablet_button1);
    migrated.tablet_button_motion_entity ??= entityId(config.ulm_custom_card_nik_tablet_button2);
    migrated.tablet_button_display_entity ??= entityId(config.ulm_custom_card_nik_tablet_button3);
    migrated.tablet_restart_entity ??= entityId(config.ulm_custom_card_nik_tablet_restart);
    migrated.tablet_reload_entity ??= entityId(config.ulm_custom_card_nik_tablet_reload);
    migrated.tablet_maintenance_entity ??= entityId(config.ulm_custom_card_nik_tablet_maintenance);
    migrated.tablet_ram_entity ??= entityId(config.ulm_custom_card_nik_tablet_par1);
    migrated.tablet_disk_entity ??= entityId(config.ulm_custom_card_nik_tablet_par2);
    migrated.tablet_power_entity ??= entityId(config.ulm_custom_card_nik_tablet_par3);
  }
  return migrated;
};
