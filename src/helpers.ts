import type { AdditionConfig, EntityNameItem, HassEntity, HomeAssistant } from "./types";
import { migrateWasteStreamConfig } from "./waste-streams";
import { getCatalogItem } from "./catalog";
import { cardIconKeys } from "./entity-icon";
import { localizeText } from "./localize";

export const activeStates = new Set([
  "on", "open", "opening", "playing", "home", "heat", "cool", "heating",
  "cleaning", "unlocked", "active",
]);

export const cssUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value) return undefined;
  const escaped = [...value].map((character) => {
    const codePoint = character.codePointAt(0) ?? 0xfffd;
    return codePoint <= 0x1f || codePoint === 0x7f || character === '"' || character === "\\"
      ? `\\${(codePoint || 0xfffd).toString(16)} `
      : character;
  }).join("");
  return `url("${escaped}")`;
};

export const stateLabel = (entity?: HassEntity, hass?: HomeAssistant): string => {
  if (!entity) return localizeText(hass, "Entity unavailable");
  if (hass?.formatEntityState) return hass.formatEntityState(entity);
  const unit = entity.attributes.unit_of_measurement;
  return unit ? `${entity.state} ${String(unit)}` : entity.state.replaceAll("_", " ");
};

const textOnlyName = (name: EntityNameItem | EntityNameItem[] | string): string | undefined => {
  if (typeof name === "string") return name;
  const items = Array.isArray(name) ? name : [name];
  return items.every((item) => item.type === "text")
    ? items.map((item) => item.text ?? "").join(" ")
    : undefined;
};

export const displayName = (
  config: AdditionConfig,
  entity?: HassEntity,
  hass?: HomeAssistant,
): string => {
  const hasMushroomName = config.name !== undefined && typeof config.name !== "string";
  if (hasMushroomName && entity && hass?.formatEntityName) {
    return hass.formatEntityName(entity, config.name);
  }
  if (hasMushroomName) {
    return textOnlyName(config.name!) || entity?.attributes.friendly_name || config.entity || "";
  }
  if (config.name_mode === "none") return "";
  if (config.name_mode === "entity") {
    return entity?.attributes.friendly_name || config.entity || "";
  }
  if (config.name && entity && hass?.formatEntityName) {
    return hass.formatEntityName(entity, config.name);
  }
  const configuredName = config.name ? textOnlyName(config.name) : undefined;
  return configuredName || entity?.attributes.friendly_name || config.entity || "";
};

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
  const type = String(migrated.type);
  const title = type.includes("card-title");
  const weather = type.includes("card-weather");
  const nativeWeather = type.includes("card-weather-ulm") || migrated.variant === "native";
  const sourceDefaultAction =
    type.includes("custom-card-sun") || type.includes("custom-card-thermostat-controls")
      ? { action: "none" }
      : undefined;
  const qubinoTarget = String(upstream.type).includes("custom-card-qubino")
    ? upstream.qubino_more_info_entity ?? upstream.entity
    : undefined;
  const sourceDisablesTap = type.endsWith("custom-card-pollen");
  const speedtestEntities = [
    upstream.download_entity,
    upstream.upload_entity,
    upstream.ping_entity,
  ].filter((value): value is string => typeof value === "string");
  const isSpeedtest = String(upstream.type).includes("speedtest-gauges");
  const isDividerTitle = upstream.variant === "divider-title";
  const isDividerSubtitle = upstream.variant === "divider-subtitle";
  const defaultAction = isSpeedtest
    ? {
      action: "perform-action",
      perform_action: "homeassistant.update_entity",
      target: { entity_id: speedtestEntities },
    }
    : isDividerSubtitle || (isDividerTitle && !upstream.navigation_path)
      ? { action: "none" }
      : sourceDisablesTap
        ? { action: "none" }
        : qubinoTarget
          ? { action: "more-info", entity: qubinoTarget }
      : upstream.navigation_path
    ? { action: "navigate", navigation_path: upstream.navigation_path }
    : sourceDefaultAction ?? { action: title ? "none" : upstream.entity ? "more-info" : "none" };
  const roomDoubleTap = type.includes("card-room") && !type.endsWith("mushroom-addition-card-room") &&
    upstream.input_select_entity && upstream.input_select_option
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
    show_name: upstream.show_name,
    name_mode: upstream.primary_info !== undefined || upstream.secondary_info !== undefined
      ? undefined
      : upstream.name_mode,
    icon_type: upstream.icon_type ?? (
      migrated.use_entity_picture ? "entity-picture" :
        migrated.show_icon === false ? "none" :
          /custom-card-(game-console|playstation)$/.test(type) ? "entity-picture" : "icon"
    ),
    layout: upstream.layout ?? "default",
    fill_container: upstream.fill_container ?? false,
    card_shadow: upstream.card_shadow ?? false,
    primary_info: upstream.primary_info,
    secondary_info: upstream.secondary_info,
    tap_action: upstream.tap_action ?? defaultAction,
    show_controls: upstream.show_controls ?? (type.includes("card-vacuum") ? true : undefined),
    show_forecast: upstream.show_forecast ?? (weather ? !nativeWeather : undefined),
    hold_action: upstream.hold_action ?? (
      String(upstream.type).includes("water-heater") && upstream.entity
        ? { action: "more-info" }
        : undefined
    ),
    double_tap_action: upstream.double_tap_action ?? roomDoubleTap,
  };
};

const configuredValue = (config: AdditionConfig, pattern: RegExp): unknown =>
  Object.entries(config).find(([key, value]) => pattern.test(key) && value !== undefined)?.[1];

const upstreamCompatibility = (config: AdditionConfig): AdditionConfig => {
  const name = configuredValue(config, /_name$/);
  const item = getCatalogItem(config.type.replace(/^custom:/, ""));
  const icon = cardIconKeys(item)
    .map(key => config[key]).find(value => typeof value === "string" && value);
  const color = configuredValue(config, /_color$/);
  const controls = configuredValue(config, /_enable_(controls|buttons)$/);
  const slider = configuredValue(config, /_enable_slider$/);
  const horizontal = configuredValue(config, /_enable_horizontal$/);
  return {
    ...config,
    name: config.name ?? (typeof name === "string" ? name : undefined),
    icon: config.icon ?? (typeof icon === "string" ? icon : undefined),
    icon_color: config.icon_color ?? (typeof color === "string" ? color : undefined),
    navigation_path: config.navigation_path,
    show_controls: config.show_controls ?? (
      typeof controls === "boolean" ? controls :
        typeof slider === "boolean" ? slider : undefined
    ),
    layout: config.layout ?? (horizontal === true ? "horizontal" : undefined),
  };
};

export const clearCardIcon = (config: AdditionConfig): AdditionConfig => {
  const next = { ...config };
  for (const key of cardIconKeys(getCatalogItem(config.type.replace(/^custom:/, "")))) delete next[key];
  return next;
};

const legacyEntityKeys = [
  "ulm_card_media_player_entity",
  "ulm_card_input_number_entity",
] as const;

export const migrateRoomLightConfig = (config: AdditionConfig): AdditionConfig => {
  if (!config.type.endsWith("mushroom-addition-card-room")) return config;
  const migrated = { ...config };
  if (migrated.room_light_entity === undefined && migrated.room_brightness_entity !== undefined) {
    migrated.room_light_entity = migrated.room_brightness_entity;
  }
  delete migrated.room_brightness_entity;
  return migrated;
};

export const migrateWelcomeItems = (config: AdditionConfig): AdditionConfig => {
  if (!String(config.type).includes("welcome")) return config;
  const record = config as unknown as Record<string, unknown>;
  const slots = Array.from({ length: 5 }, (_, index) => index + 1);
  if (!slots.some((slot) => record[`nav_${slot}`] !== undefined)) return config;
  const migrated = { ...record };
  if (!config.scene_items?.length) {
    const text = (value: unknown): string | undefined => typeof value === "string" && value ? value : undefined;
    migrated.scene_items = slots.filter((slot) => text(record[`nav_${slot}`])).map((slot) => ({
      entity: "",
      navigation_path: text(record[`nav_${slot}`]),
      icon: text(record[`icon_${slot}`]),
      name: text(record[`name_${slot}`]),
      color: text(record[`color_${slot}`]) ?? "blue",
    }));
  }
  for (const slot of slots) {
    for (const prefix of ["nav", "icon", "name", "color"]) delete migrated[`${prefix}_${slot}`];
  }
  return migrated as unknown as AdditionConfig;
};

const activeStateEntityDomains = new Set([
  "automation", "binary_sensor", "climate", "cover", "fan", "humidifier", "input_boolean", "light",
  "lock", "media_player", "remote", "siren", "switch", "vacuum", "valve", "water_heater",
]);

export const hasOnOffState = (entity?: HassEntity): boolean => {
  if (!entity) return false;
  const domain = entity.entity_id.split(".", 1)[0];
  if (["script", "scene", "button"].includes(domain)) return false;
  return activeStateEntityDomains.has(domain) || ["on", "off"].includes(entity.state);
};

export const migrateLegacyConfig = (config: AdditionConfig): AdditionConfig => {
  const wasteMigrated = migrateWasteStreamConfig(migrateRoomLightConfig(migrateWelcomeItems(config)));
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
  if (String(config.type).includes("card-power-outlet")) {
    migrated.consumption_entity ??= entityId(config.ulm_card_power_outlet_consumption_sensor);
  }
  if (String(config.type).includes("card-room") && !String(config.type).endsWith("mushroom-addition-card-room")) {
    migrated.input_select_entity ??= entityId(config.ulm_input_select);
    migrated.input_select_option ??= typeof config.ulm_input_select_option === "string"
      ? config.ulm_input_select_option
      : undefined;
  }
  if (String(config.type).includes("nas-metrics")) {
    migrated.temperature_entity ??= entityId(config.entity_1);
    migrated.memory_entity ??= entityId(config.entity_2);
    migrated.cpu_entity ??= entityId(config.entity_3);
    migrated.disk_entity ??= entityId(config.entity_4);
  }
  if (String(config.type).includes("tablet")) {
    migrated.entity ??= entityId(config.ulm_custom_card_tablet_main);
    migrated.battery_entity ??= entityId(config.ulm_custom_card_tablet_battery);
    migrated.tablet_button_usb_entity ??= entityId(config.ulm_custom_card_tablet_button1);
    migrated.tablet_button_motion_entity ??= entityId(config.ulm_custom_card_tablet_button2);
    migrated.tablet_button_display_entity ??= entityId(config.ulm_custom_card_tablet_button3);
    migrated.tablet_restart_entity ??= entityId(config.ulm_custom_card_tablet_restart);
    migrated.tablet_reload_entity ??= entityId(config.ulm_custom_card_tablet_reload);
    migrated.tablet_maintenance_entity ??= entityId(config.ulm_custom_card_tablet_maintenance);
    migrated.tablet_ram_entity ??= entityId(config.ulm_custom_card_tablet_par1);
    migrated.tablet_disk_entity ??= entityId(config.ulm_custom_card_tablet_par2);
    migrated.tablet_power_entity ??= entityId(config.ulm_custom_card_tablet_par3);
  }
  if (String(config.type).includes("custom-card-washer")) {
    migrated.entity ??= entityId(config.ulm_custom_card_washer_machine_state) ??
      entityId(config.ulm_custom_card_washer_power);
    migrated.program_stage_entity ??= entityId(config.ulm_custom_card_washer_job_state) ??
      migrated.entity;
    migrated.washer_power_entity ??= migrated.power_entity ??
      entityId(config.ulm_custom_card_washer_power);
    migrated.power_entity ??= migrated.washer_power_entity;
  }
  if (String(config.type).includes("custom-card-thermostat-controls")) {
    migrated.entity ??= entityId(config.entity);
    migrated.variant ??= "buttons";
  }
  if (String(config.type).includes("media-player-sonos")) {
    migrated.entity ??= entityId(config.ulm_card_media_player_with_controls_entity);
  }
  if (String(config.type).includes("printer")) {
    migrated.black_entity ??= entityId(config.ulm_card_printer_black_name);
    migrated.yellow_entity ??= entityId(config.ulm_card_printer_yellow_name);
    migrated.magenta_entity ??= entityId(config.ulm_card_printer_magenta_name);
    migrated.cyan_entity ??= entityId(config.ulm_card_printer_cyan_name);
  }
  if (String(config.type).endsWith("custom-card-pollen")) {
    migrated.trees_entity ??= entityId(config.custom_card_pollen_tree);
    migrated.grass_entity ??= entityId(config.custom_card_pollen_grass);
    migrated.weeds_entity ??= entityId(config.custom_card_pollen_weed);
  }
  if (String(config.type).includes("speedtest-gauges")) {
    migrated.download_entity ??= entityId(config.ulm_custom_card_speedtest_download_speed_entity) ??
      migrated.entity;
    migrated.upload_entity ??= entityId(config.ulm_custom_card_speedtest_upload_speed_entity);
    migrated.ping_entity ??= entityId(config.ulm_custom_card_speedtest_ping_entity);
    migrated.entity = entityId(migrated.download_entity);
  }
  if (String(config.type).includes("custom-card-scenes") || (
    String(config.type).includes("card-scenes") && config.variant === "scene-grid"
  )) {
    const legacyItems = Array.from({ length: 5 }, (_, index) => {
      const value = config[`entity_${index + 1}`];
      if (typeof value === "string") return { entity: value };
      if (!value || typeof value !== "object" || !("entity_id" in value) || typeof value.entity_id !== "string") {
        return undefined;
      }
      const item = value as Record<string, unknown> & { entity_id: string };
      return {
        entity: item.entity_id,
        icon: typeof item.icon === "string" ? item.icon : undefined,
        color: typeof item.icon_color === "string" ? item.icon_color : undefined,
        name: typeof item.name === "string" ? item.name : undefined,
      };
    }).filter((item): item is NonNullable<typeof item> => Boolean(item));
    if (!migrated.scene_items?.length && legacyItems.length) migrated.scene_items = legacyItems;
  }
  if (String(config.type).includes("plant")) {
    migrated.entity ??= entityId(config.ulm_card_flower_entity);
    migrated.ulm_card_flower_entity ??= migrated.entity;
  }
  return migrated;
};
