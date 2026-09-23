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
  const type = String(migrated.type);
  const title = type.includes("card-title");
  const welcomeScenes = type.includes("card-welcome-scenes");
  const weather = type.includes("card-weather");
  const nativeWeather = type.includes("card-weather-ulm") || migrated.variant === "native";
  const clockSwitchEnabled = type.includes("custom-card-nik-clock") &&
    upstream.ulm_custom_card_nik_clock_switch_enable === true &&
    typeof upstream.clock_switch_entity === "string";
  const sourceDefaultAction =
    type.includes("custom-card-httpedo13-sun") || type.includes("custom-card-httpedo13-thermostat")
      ? { action: "none" }
      : undefined;
  const qubinoTarget = String(upstream.type).includes("custom-card-qubino")
    ? upstream.qubino_more_info_entity ?? upstream.entity
    : undefined;
  const sourceDisablesTap = /(?:wsly-pollen|yagrasdemonde-lights-count)/.test(type);
  const speedtestEntities = [
    upstream.download_entity,
    upstream.upload_entity,
    upstream.ping_entity,
  ].filter((value): value is string => typeof value === "string");
  const isSpeedtest = String(upstream.type).includes("speedtest-shogun160");
  const isWilbievTitle = upstream.variant === "divider-title";
  const isWilbievSubtitle = upstream.variant === "divider-subtitle";
  const defaultAction = clockSwitchEnabled
    ? {
      action: "perform-action",
      perform_action: "input_boolean.toggle",
      target: { entity_id: upstream.clock_switch_entity },
    }
    : type.includes("custom-card-nik-clock")
      ? { action: "none" }
      : isSpeedtest
    ? {
      action: "perform-action",
      perform_action: "homeassistant.update_entity",
      target: { entity_id: speedtestEntities },
    }
    : isWilbievSubtitle || (isWilbievTitle && !upstream.navigation_path)
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
    show_controls: upstream.show_controls ?? (type.includes("card-vacuum") ? true : undefined),
    show_forecast: upstream.show_forecast ?? (weather ? !nativeWeather : undefined),
    hold_action: upstream.hold_action ?? (
      type.includes("custom-card-neekster-update")
        ? { action: "more-info" }
        : String(upstream.type).includes("water-heater") && upstream.entity
        ? { action: "more-info" }
        : upstream.variant === "small" && typeof upstream.ulm_card_person_battery_entity === "string"
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
  "ulm_card_imswel_person_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_irmajavi_entities",
  "ulm_custom_card_irmajavi_weather",
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
          nav_path: typeof item.nav_path === "string" ? item.nav_path : undefined,
          service_data: item.service_data && typeof item.service_data === "object"
            ? item.service_data as Record<string, unknown>
            : undefined,
        };
      }).filter((item): item is NonNullable<typeof item> => item !== undefined);
      if (sceneItems.length) migrated.scene_items = sceneItems;
    }
  }
  if (String(config.type).includes("card-vertical-button")) {
    migrated.active_state ??= typeof config.ulm_card_vertical_button_state === "string"
      ? config.ulm_card_vertical_button_state
      : "on";
    migrated.icon_color ??= typeof config.ulm_card_vertical_button_color === "string"
      ? config.ulm_card_vertical_button_color
      : "blue";
  }
  if (String(config.type).includes("imswel-person")) {
    migrated.entity ??= entityId(config.ulm_card_imswel_person_entity);
    migrated.wifi_tracker_entity ??= entityId(config.ulm_card_imswel_person_wifi_tracker);
    migrated.gps_tracker_entity ??= entityId(config.ulm_card_imswel_person_gps_tracker);
    migrated.findmy_script_entity ??= entityId(config.ulm_card_imswel_person_findmy_script);
    migrated.use_entity_picture ??= config.ulm_card_imswel_person_use_entity_picture === true;
  }
  if (String(config.type).includes("irmajavi-entities")) {
    migrated.entity ??= entityId(config.ulm_custom_card_irmajavi_entities);
    migrated.entities ??= [1, 2, 3, 4]
      .map((index) => entityId(config[`ulm_custom_card_irmajavi_entities_entity_${index}`]))
      .filter((value): value is string => value !== undefined);
  }
  if (String(config.type).includes("irmajavi-speedtest")) {
    migrated.download_entity ??= entityId(config.ulm_custom_card_irmajavi_speedtest_download_speed_entity);
    migrated.upload_entity ??= entityId(config.ulm_custom_card_irmajavi_speedtest_upload_speed_entity);
    migrated.ping_entity ??= entityId(config.ulm_custom_card_irmajavi_speedtest_ping_entity);
    migrated.entity ??= migrated.download_entity;
  }
  if (String(config.type).includes("irmajavi-weather")) {
    migrated.entity ??= entityId(config.ulm_custom_card_irmajavi_weather);
    migrated.temperature_entity ??= entityId(config.ulm_custom_card_irmajavi_weather_temperature_outside);
    migrated.date_entity ??= entityId(config.ulm_custom_card_irmajavi_weather_date);
    migrated.entities ??= [1, 2, 3, 4]
      .map((index) => entityId(config[`ulm_custom_card_irmajavi_weather_entity_${index}`]))
      .filter((value): value is string => value !== undefined);
  }
  if (String(config.type).includes("custom-card-haven-washer")) {
    migrated.entity ??= entityId(config.ulm_custom_card_washer_machine_state) ??
      entityId(config.ulm_custom_card_washer_power);
    migrated.power_entity ??= entityId(config.ulm_custom_card_washer_power);
    migrated.ulm_custom_card_washer_machine_state ??= migrated.entity;
  }
  if (String(config.type).includes("custom-card-httpedo13-thermostat")) {
    migrated.entity ??= entityId(config.entity);
    migrated.variant ??= "buttons";
  }
  if (String(config.type).includes("custom-card-iabadia-battery-chip")) {
    migrated.entity ??= entityId(config.ulm_custom_card_iAbadia_battery_chip_entity);
  }
  if (String(config.type).includes("custom-card-imswel-medias")) {
    const platform = typeof config.ulm_custom_card_imswel_medias_platform === "string"
      ? config.ulm_custom_card_imswel_medias_platform
      : undefined;
    migrated.variant ??= !platform || platform === "plex" ? "library" : "upcoming";
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
  if (String(config.type).includes("mpse-gauge")) {
    migrated.minimum ??= Number(config.ulm_card_mpse_gauge_min ?? 0);
    migrated.maximum ??= Number(config.ulm_card_mpse_gauge_max ?? 100);
  }
  if (String(config.type).includes("mpse-printer")) {
    migrated.black_entity ??= entityId(config.ulm_card_printer_black_name);
    migrated.yellow_entity ??= entityId(config.ulm_card_printer_yellow_name);
    migrated.magenta_entity ??= entityId(config.ulm_card_printer_magenta_name);
    migrated.cyan_entity ??= entityId(config.ulm_card_printer_cyan_name);
  }
  if (String(config.type).includes("paddy-welcome")) {
    migrated.time_entity ??= entityId(config.ulm_custom_card_paddy_welcome_time);
    migrated.weather_entity ??= entityId(config.ulm_custom_card_paddy_welcome_weather_provider) ??
      entityId(config.ulm_weather);
    migrated.news_entities ??= Array.isArray(config.ulm_custom_card_paddy_welcome_news_entities)
      ? config.ulm_custom_card_paddy_welcome_news_entities.flatMap((item) => {
        const id = entityId(item);
        return id ? [id] : [];
      })
      : undefined;
    migrated.variant ??= migrated.news_entities?.length
      ? "news"
      : migrated.weather_entity
        ? "weather"
        : "message";
  }
  if (String(config.type).includes("person-chip")) {
    migrated.entity ??= entityId(config.ulm_custom_card_person_chip_entity);
    migrated.use_entity_picture ??= true;
  }
  if (String(config.type).includes("custom-card-qubino")) {
    migrated.qubino_more_info_entity ??= entityId(config.more_info_entity) ??
      entityId(config.ulm_custom_card_qubino_more_info_entity);
  }
  if (String(config.type).includes("ristou-person")) {
    migrated.ulm_custom_card_ristou_camera_entity_light ??= entityId(config.ulm_card_ristou_person_camera);
    migrated.ulm_custom_card_ristou_camera_entity_dark ??= entityId(config.ulm_card_ristou_person_camera);
    migrated.ulm_custom_card_ristou_map_enable ??= typeof config.ulm_card_ristou_person_show_map === "boolean"
      ? config.ulm_card_ristou_person_show_map
      : undefined;
  }
  if (String(config.type).includes("wsly-pollen")) {
    migrated.trees_entity ??= entityId(config.custom_card_wsly_pollen_tree);
    migrated.grass_entity ??= entityId(config.custom_card_wsly_pollen_grass);
    migrated.weeds_entity ??= entityId(config.custom_card_wsly_pollen_weed);
  }
  if (String(config.type).includes("speedtest-shogun160")) {
    migrated.download_entity ??= entityId(config.ulm_custom_card_speedtest_download_speed_entity) ??
      migrated.entity;
    migrated.upload_entity ??= entityId(config.ulm_custom_card_speedtest_upload_speed_entity);
    migrated.ping_entity ??= entityId(config.ulm_custom_card_speedtest_ping_entity);
    migrated.entity = entityId(migrated.download_entity);
  }
  if (String(config.type).includes("vncntdev-device-tracer")) {
    migrated.name ??= typeof config.custom_card_vncntdev_device_tracker_name === "string"
      ? config.custom_card_vncntdev_device_tracker_name
      : undefined;
    migrated.icon ??= typeof config.custom_card_vncntdev_device_tracker_icon === "string"
      ? config.custom_card_vncntdev_device_tracker_icon
      : undefined;
  }
  if (String(config.type).includes("wilbiev-title")) {
    migrated.name ??= typeof config.ulm_custom_card_wilbiev_title_name === "string"
      ? config.ulm_custom_card_wilbiev_title_name
      : undefined;
    migrated.navigation_path ??= typeof config.ulm_custom_card_wilbiev_title_nav === "string"
      ? config.ulm_custom_card_wilbiev_title_nav
      : undefined;
  }
  if (String(config.type).includes("wilbiev-subtitle")) {
    migrated.name ??= typeof config.ulm_custom_card_wilbiev_subtitle_name === "string"
      ? config.ulm_custom_card_wilbiev_subtitle_name
      : typeof config.ulm_custom_card_wilbiev_title_name === "string"
        ? config.ulm_custom_card_wilbiev_title_name
        : undefined;
  }
  if (String(config.type).includes("custom-card-nas")) {
    migrated.entity ??= entityId(config.ulm_custom_card_nas_sensor);
  }
  if (String(config.type).includes("custom-card-nik-clock")) {
    migrated.clock_switch_entity ??= entityId(config.ulm_custom_card_nik_clock_switch);
  }
  if (String(config.type).includes("custom-card-nik-door")) {
    migrated.name ??= typeof config.ulm_custom_card_entity_1_name === "string"
      ? config.ulm_custom_card_entity_1_name
      : undefined;
    migrated.lock_entity ??= entityId(config.ulm_custom_card_entity_1_lock);
    migrated.battery_entity ??= entityId(config.ulm_custom_card_entity_1_lock_battery);
  }
  if (String(config.type).includes("custom-card-paddy-dwd-pollen")) {
    migrated.level_entity ??= entityId(config.level_entity);
    migrated.name ??= typeof config.ulm_custom_card_paddy_dwd_pollen_name === "string"
      ? config.ulm_custom_card_paddy_dwd_pollen_name
      : undefined;
    migrated.icon ??= typeof config.ulm_custom_card_paddy_dwd_pollen_icon === "string"
      ? config.ulm_custom_card_paddy_dwd_pollen_icon
      : undefined;
  }
  return migrated;
};
