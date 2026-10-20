import type { AdditionConfig, EntityNameItem, HassEntity, HomeAssistant } from "./types";
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
  const welcomeScenes = type.includes("card-welcome-scenes");
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
    : sourceDefaultAction ?? { action: title || welcomeScenes ? "none" : upstream.entity ? "more-info" : "none" };
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
    show_name: upstream.show_name,
    name_mode: upstream.primary_info !== undefined || upstream.secondary_info !== undefined
      ? undefined
      : upstream.name_mode,
    icon_type: upstream.icon_type ?? (
      migrated.use_entity_picture ? "entity-picture" :
        migrated.show_icon === false ? "none" : "icon"
    ),
    layout: upstream.layout ?? "default",
    fill_container: upstream.fill_container ?? false,
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
    navigation_path: config.navigation_path,
    show_controls: config.show_controls ?? (
      typeof controls === "boolean" ? controls :
        typeof slider === "boolean" ? slider : undefined
    ),
    layout: config.layout ?? (horizontal === true ? "horizontal" : undefined),
  };
};

const legacyEntityKeys = [
  "ulm_card_media_player_entity",
  "ulm_card_graph_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_weather_metrics",
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
  if (String(config.type).includes("card-power-outlet")) {
    migrated.consumption_entity ??= entityId(config.ulm_card_power_outlet_consumption_sensor);
  }
  if (String(config.type).includes("card-room")) {
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
  if (String(config.type).includes("card-welcome-scenes")) {
    migrated.collapse_entity ??= entityId(config.ulm_card_welcome_scenes_collapse);
    if (!migrated.scene_items) {
      const sceneItems = Array.from({ length: 7 }, (_, index) => {
        const value = config[`entity_${index + 1}`];
        if (!value || typeof value !== "object") return undefined;
        const item = value as Record<string, unknown>;
        const entity = entityId(item);
        if (!entity) return undefined;
        return {
          entity,
          name: typeof item.name === "string" ? item.name : undefined,
          icon: typeof item.icon === "string" ? item.icon : undefined,
          color: typeof item.color === "string" ? item.color : undefined,
          state: typeof item.state === "string" ? item.state : undefined,
          navigation_path: typeof item.navigation_path === "string"
            ? item.navigation_path
            : typeof item.nav_path === "string"
              ? item.nav_path
              : undefined,
          service_data: item.service_data && typeof item.service_data === "object"
            ? item.service_data as Record<string, unknown>
            : undefined,
        };
      }).filter((item): item is NonNullable<typeof item> => item !== undefined);
      if (sceneItems.length) migrated.scene_items = sceneItems;
    }
  }
  if (String(config.type).includes("entity-overview")) {
    migrated.entity ??= entityId(config.ulm_custom_card_entity_overview);
    migrated.entities ??= [1, 2, 3, 4]
      .map((index) => entityId(config[`ulm_custom_card_entity_overview_entity_${index}`]))
      .filter((value): value is string => value !== undefined);
  }
  if (String(config.type).includes("internet-speed")) {
    migrated.download_entity ??= entityId(config.ulm_custom_card_internet_speed_download_speed_entity);
    migrated.upload_entity ??= entityId(config.ulm_custom_card_internet_speed_upload_speed_entity);
    migrated.ping_entity ??= entityId(config.ulm_custom_card_internet_speed_ping_entity);
    migrated.entity ??= migrated.download_entity;
  }
  if (String(config.type).includes("weather-metrics")) {
    migrated.entity ??= entityId(config.ulm_custom_card_weather_metrics);
    migrated.temperature_entity ??= entityId(config.ulm_custom_card_weather_metrics_temperature_outside);
    migrated.date_entity ??= entityId(config.ulm_custom_card_weather_metrics_date);
    migrated.entities ??= [1, 2, 3, 4]
      .map((index) => entityId(config[`ulm_custom_card_weather_metrics_entity_${index}`]))
      .filter((value): value is string => value !== undefined);
  }
  if (String(config.type).includes("custom-card-washer")) {
    migrated.entity ??= entityId(config.ulm_custom_card_washer_machine_state) ??
      entityId(config.ulm_custom_card_washer_power);
    migrated.power_entity ??= entityId(config.ulm_custom_card_washer_power);
    migrated.ulm_custom_card_washer_machine_state ??= migrated.entity;
  }
  if (String(config.type).includes("custom-card-thermostat-controls")) {
    migrated.entity ??= entityId(config.entity);
    migrated.variant ??= "buttons";
  }
  if (String(config.type).includes("media-player-sonos")) {
    migrated.entity ??= entityId(config.ulm_card_media_player_with_controls_entity);
  }
  if (String(config.type).includes("more-power-outlet")) {
    migrated.power_entity ??= entityId(
      config.custom_card_more_power_outlet_power_sensor ??
      config.ulm_card_more_power_outlet_power_sensor ??
      config.graph_entity,
    );
    migrated.energy_entity ??= entityId(
      config.custom_card_more_power_outlet_energy_sensor ??
      config.ulm_card_more_power_outlet_energy_sensor,
    );
    migrated.time_entity ??= entityId(
      config.custom_card_more_power_outlet_time_sensor ??
      config.ulm_card_more_power_outlet_time_sensor,
    );
  }
  if (String(config.type).includes("gauge")) {
    migrated.minimum ??= Number(config.ulm_card_gauge_min ?? 0);
    migrated.maximum ??= Number(config.ulm_card_gauge_max ?? 100);
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
  if (String(config.type).includes("custom-card-pollen-forecast")) {
    migrated.level_entity ??= entityId(config.level_entity);
    migrated.name ??= typeof config.ulm_custom_card_pollen_forecast_name === "string"
      ? config.ulm_custom_card_pollen_forecast_name
      : undefined;
    migrated.icon ??= typeof config.ulm_custom_card_pollen_forecast_icon === "string"
      ? config.ulm_custom_card_pollen_forecast_icon
      : undefined;
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
