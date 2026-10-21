import type { AdditionConfig, CatalogItem, HomeAssistant } from "./types";
import { populatedDefaultsFor } from "./defaults";
import { roomLightingSceneExample, sceneItemDefaultsFor } from "./scene-item-defaults";
import { roomItemDefaultsFor } from "./room";
import { sonosControlCount } from "./sonos-controls";
import { inferConsolePlatform, resolveConsoleEntities } from "./console";
import { readUpcomingData } from "./upcoming-media";
import { wasteStreamExamples } from "./waste-streams";

const firstMatchingEntity = (
  descriptor: CatalogItem,
  hass?: HomeAssistant,
  entities: string[] = [],
  entitiesFallback: string[] = [],
): string | undefined => {
  const available = [...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})];
  const unique = [...new Set(available)].filter((entityId) => hass?.states?.[entityId] !== undefined);
  const healthy = unique.filter((entityId) =>
    !["unavailable", "unknown"].includes(hass?.states?.[entityId]?.state.toLowerCase() ?? ""));
  for (const domain of descriptor.preferredDomains ?? []) {
    const found = healthy.find((entityId) => entityId.startsWith(`${domain}.`)) ??
      unique.find((entityId) => entityId.startsWith(`${domain}.`));
    if (found) return found;
  }
  return healthy[0] ?? unique[0];
};

const sampleName = (descriptor: CatalogItem): string =>
  descriptor.name.replace(/ (Card|Chip)$/, "");

export const miniGraphExampleEntity = (
  hass?: HomeAssistant,
  entities: string[] = [],
  entitiesFallback: string[] = [],
): string | undefined => {
  const available = [...new Set([...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})])];
  const numericSensors = available.filter(id => {
    const entity = hass?.states[id];
    return id.startsWith("sensor.") && entity !== undefined &&
      entity.state.trim() !== "" && Number.isFinite(Number(entity.state));
  });
  return numericSensors.find(id => {
    const attributes = hass!.states[id].attributes;
    return attributes.device_class === "temperature" ||
      ["°C", "°F", "K"].includes(String(attributes.unit_of_measurement ?? ""));
  }) ?? numericSensors[0] ??
    available.find(id => (id.startsWith("sensor.") || id.startsWith("binary_sensor.")) &&
      hass?.states[id] !== undefined &&
      !["unknown", "unavailable", ""].includes(hass.states[id].state.trim().toLowerCase()));
};

export const createStubConfig = (
  descriptor: CatalogItem,
  hass?: HomeAssistant,
  entities: string[] = [],
  entitiesFallback: string[] = [],
): AdditionConfig => {
  const available = [...new Set([...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})])]
    .filter((entityId) => hass?.states?.[entityId] !== undefined);
  const entityText = (entityId: string): string => {
    const state = hass?.states[entityId];
    return [
      entityId,
      state?.attributes.friendly_name,
      state?.attributes.device_class,
      state?.attributes.unit_of_measurement,
    ].filter(Boolean).join(" ").toLowerCase();
  };
  const orderedMatches = (matches: string[]): string[] => [
    ...matches.filter((entityId) =>
      !["unavailable", "unknown"].includes(hass?.states[entityId]?.state.toLowerCase() ?? "")),
    ...matches.filter((entityId) =>
      ["unavailable", "unknown"].includes(hass?.states[entityId]?.state.toLowerCase() ?? "")),
  ];
  const isHealthy = (entityId: string): boolean =>
    !["unavailable", "unknown"].includes(hass?.states[entityId]?.state.toLowerCase() ?? "");
  const findEntity = (domains: string[], terms: string[]): string | undefined =>
    orderedMatches(available.filter((entityId) =>
      domains.some((domain) => entityId.startsWith(`${domain}.`)) &&
      terms.every((term) => entityText(entityId).includes(term))))[0];
  const findEntityExcluding = (domains: string[], terms: string[], excludedTerms: string[]): string | undefined =>
    orderedMatches(available.filter((entityId) =>
      domains.some((domain) => entityId.startsWith(`${domain}.`)) &&
      terms.every((term) => entityText(entityId).includes(term)) &&
      excludedTerms.every((term) => !entityText(entityId).includes(term))))[0];
  const findHealthyEntity = (domains: string[], terms: string[], excludedTerms: string[] = []): string | undefined =>
    available.find((entityId) =>
      isHealthy(entityId) &&
      domains.some((domain) => entityId.startsWith(`${domain}.`)) &&
      terms.every((term) => entityText(entityId).split(/[^a-z0-9]+/).includes(term)) &&
      excludedTerms.every((term) => !entityText(entityId).includes(term)));
  const findEntityByDeviceClass = (
    deviceClasses: string[],
    terms: string[] = [],
    excludedTerms: string[] = [],
  ): string | undefined =>
    orderedMatches(available.filter((entityId) => {
      const state = hass?.states[entityId];
      const text = entityText(entityId);
      return entityId.startsWith("sensor.") &&
        deviceClasses.includes(String(state?.attributes.device_class ?? "")) &&
        terms.every((term) => text.includes(term)) &&
        excludedTerms.every((term) => !text.includes(term));
    }))[0];
  const discoveredPanelEntities = available
    .filter((entityId) => /^sensor\.inverter_4/i.test(entityId))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
  const findHealthyEntityByDeviceClass = (
    deviceClasses: string[],
    terms: string[] = [],
    excludedTerms: string[] = [],
  ): string | undefined =>
    available.find((entityId) => {
      const state = hass?.states[entityId];
      const text = entityText(entityId);
      return isHealthy(entityId) &&
        entityId.startsWith("sensor.") &&
        deviceClasses.includes(String(state?.attributes.device_class ?? "")) &&
        terms.every((term) => text.includes(term)) &&
        excludedTerms.every((term) => !text.includes(term));
    });
  const sonosPlayer = available
    .filter((entityId) => entityId.startsWith("media_player.") && entityText(entityId).includes("sonos"))
    .sort((left, right) => sonosControlCount(hass, right) - sonosControlCount(hass, left))[0];
  const wasteExamples = descriptor.upstreamId === "custom_card_trash"
    ? wasteStreamExamples(hass, entities, entitiesFallback) : undefined;
  const semanticPrimary =
    descriptor.upstreamId === "pi_hole_card"
      ? orderedMatches(available.filter(id => id.startsWith("switch.") && (
        /pi_hole/.test(hass?.entities?.[id]?.platform || "") || /pi.?hole/.test(entityText(id))
      )))[0] ?? orderedMatches(available.filter(id => id.startsWith("sensor.") && /pi_hole/.test(hass?.entities?.[id]?.platform || "")))[0]
      : descriptor.upstreamId === "remote_card"
      ? orderedMatches(available.filter(id => id.startsWith("media_player.") && (
        hass?.states[id]?.attributes.device_class === "tv" ||
        /samsung|android|apple_tv|roku|webostv|bravia/.test(hass?.entities?.[id]?.platform || "")
      )))[0] ?? findEntity(["remote"], [])
      : descriptor.upstreamId === "advanced_home_energy_management"
      ? findEntity(["sensor"], ["hems", "house", "consumption"]) ??
        findEntity(["sensor"], ["house", "consumption"]) ??
        findEntityByDeviceClass(["power"])
      : descriptor.upstreamId === "advanced_energy_buy_sell"
        ? findEntity(["sensor"], ["hems", "price", "overview"]) ??
          findEntity(["sensor"], ["price", "overview"]) ??
          findEntity(["sensor"], ["hems", "price"])
        : descriptor.upstreamId === "advanced_energy_panel_health"
          ? discoveredPanelEntities[0]
      : descriptor.upstreamId === "mini_graph_card"
      ? miniGraphExampleEntity(hass, entities, entitiesFallback)
        : descriptor.upstreamId === "card_battery"
              ? findEntityExcluding(["sensor"], ["battery", "level"], ["state", "charging"]) ??
                findEntityByDeviceClass(["battery"], [], ["state", "charging"])
              : descriptor.upstreamId === "custom_card_pollen"
                          ? findEntity(["sensor"], ["pollen", "grass"])
                        : descriptor.upstreamId === "custom_card_speedtest_gauges"
                          ? findEntity(["sensor"], ["speedtest", "download"]) ??
                              findEntity(["sensor"], ["download"])
                          : descriptor.upstreamId === "custom_card_tablet"
                          ? findEntity(["binary_sensor", "sensor", "switch"], ["tablet"])
                        : descriptor.upstreamId === "custom_card_nas_metrics"
                            ? findEntity(["switch", "binary_sensor"], ["nas"]) ??
                                findEntity(["switch", "binary_sensor"], ["status"])
                              : descriptor.upstreamId === "custom_card_washer"
                                ? findEntity(["sensor"], ["operation", "state"]) ??
                                  findEntity(["sensor"], ["washer", "state"])
                                : descriptor.upstreamId === "custom_card_sun"
                                  ? findEntity(["sun"], [])
                                  : descriptor.upstreamId === "custom_card_media_player_sonos"
                                        ? sonosPlayer
                                      : descriptor.upstreamId === "custom_card_printer"
                                        ? findEntity(["sensor", "binary_sensor"], ["printer"]) ??
                                          findEntity(["sensor", "binary_sensor"], ["online"])
                              : descriptor.upstreamId === "card_room"
                                ? findEntity(["light"], [])
                                : descriptor.upstreamId === "custom_card_plant"
                                      ? findEntity(["plant"], []) ?? findEntity(["sensor"], ["soil", "humidity"])
                                      : descriptor.upstreamId === "custom_card_playstation"
                                      ? findEntity(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["xbox"]) ??
                                        findEntity(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["playstation"]) ??
                                        findEntity(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["nintendo"]) ??
                                        findEntity(["media_player", "remote"], [])
                                    : undefined;
  const scenePrimary = descriptor.upstreamId === "card_scenes"
    ? findHealthyEntity(["light"], []) ??
      findHealthyEntity(["climate"], []) ??
      findHealthyEntity(["sensor"], [])
    : undefined;
  const fallbackEntity = scenePrimary ?? semanticPrimary ??
    firstMatchingEntity(descriptor, hass, entities, entitiesFallback);
  const carouselExample = descriptor.upstreamId === "custom_card_entity_carousel"
    ? roomLightingSceneExample(hass, fallbackEntity) : undefined;
  const entity = descriptor.upstreamId === "upcoming_media"
    ? orderedMatches(available.filter(id => id.startsWith("sensor.") && !readUpcomingData(hass?.states[id]).error))[0]
    : descriptor.upstreamId === "custom_card_trash" ? wasteExamples?.[0]?.entity
    : ["remote_card", "pi_hole_card"].includes(descriptor.upstreamId) ? semanticPrimary
    : carouselExample ? carouselExample.entity : fallbackEntity;
  const panelEntities = descriptor.upstreamId === "advanced_energy_panel_health"
    ? discoveredPanelEntities
    : undefined;
  const flowerEntities = descriptor.upstreamId === "custom_card_plant"
    ? {
      moisture_entity:
        (entity && hass?.states[entity]?.attributes.device_class === "moisture" ? entity : undefined) ??
        findHealthyEntityByDeviceClass(["moisture"], ["soil"]) ??
        findHealthyEntityByDeviceClass(["moisture"]),
      temperature_entity:
        findHealthyEntityByDeviceClass(["temperature"], ["soil"]) ??
        findHealthyEntityByDeviceClass(["temperature"], ["plant"]),
      humidity_entity:
        findHealthyEntityByDeviceClass(["humidity"], ["plant"]) ??
        findHealthyEntityByDeviceClass(["humidity"], ["soil"]),
      conductivity_entity:
        findHealthyEntityByDeviceClass(["conductivity"], ["plant"]) ??
        findHealthyEntity(["sensor"], ["conductivity"]),
      illuminance_entity:
        findHealthyEntityByDeviceClass(["illuminance"], ["plant"]) ??
        findHealthyEntity(["sensor"], ["plant", "illuminance"]),
      dli_entity: findHealthyEntity(["sensor"], ["dli"]),
    }
    : {};
  const flowerBars = Object.entries(flowerEntities)
    .filter(([, linkedEntity]) => linkedEntity)
    .map(([key]) => key.replace(/_entity$/, ""));
  const isText = ["text", "navigation"].includes(descriptor.family);
  const defaultVariant = descriptor.variants?.[0];
  const entityDomain = entity?.split(".", 1)[0];
  const tapAction = ["light", "switch", "input_boolean", "fan"].includes(entityDomain ?? "")
    ? { action: "toggle" }
    : { action: entity ? "more-info" : "none" };
  const inferredConsolePlatform = inferConsolePlatform(hass, entity);
  const stubTapAction = descriptor.upstreamId === "custom_card_sun" ||
    descriptor.upstreamId === "custom_card_pollen" ||
    descriptor.upstreamId === "card_welcome_scenes"
    ? { action: "none" }
    : descriptor.upstreamId === "custom_card_speedtest_gauges"
      ? {
        action: "perform-action",
        perform_action: "homeassistant.update_entity",
        target: {
          entity_id: [
            findEntity(["sensor"], ["speedtest", "download"]) ?? findEntity(["sensor"], ["download"]) ?? entity,
            findEntity(["sensor"], ["speedtest", "upload"]) ?? findEntity(["sensor"], ["upload"]),
            findEntity(["sensor"], ["speedtest", "ping"]) ?? findEntity(["sensor"], ["ping"]),
          ].filter((value): value is string => Boolean(value)),
        },
      }
      : descriptor.upstreamId === "custom_card_playstation"
        ? { action: entity ? "more-info" : "none", entity }
        : descriptor.upstreamId === "advanced_home_energy_management"
          ? { action: "navigate", navigation_path: "/hems-tower/savings-overview" }
        : descriptor.upstreamId === "custom_card_plant"
          ? { action: "more-info" }
          : tapAction;
  return {
    ...populatedDefaultsFor(descriptor, hass, entity),
    name: [
      "advanced_home_energy_management",
      "advanced_energy_buy_sell",
      "advanced_energy_panel_health",
      "custom_card_media_player_sonos",
    ].includes(descriptor.upstreamId)
      ? undefined
      : entity ? hass?.states[entity]?.attributes.friendly_name : sampleName(descriptor),
    secondary: entity ? undefined : isText ? "Example" : "Preview",
    variant: defaultVariant,
    tap_action: stubTapAction,
    show_controls: ["climate", "vacuum", "control", "media"].includes(descriptor.family)
      ? true
      : undefined,
    show_forecast: descriptor.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(descriptor.family),
    entities: descriptor.upstreamId === "mini_graph_card" && entity
      ? [entity]
      : descriptor.variants?.includes("with-sensors")
      ? entitiesFallback.slice(0, 2)
      : undefined,
    ...(wasteExamples?.length ? { waste_streams: wasteExamples } : {}),
    panel_entities: panelEntities?.length ? panelEntities : undefined,
    ...(descriptor.upstreamId === "advanced_home_energy_management"
      ? {
        grid_power_entity: findEntity(["sensor"], ["p1", "meter", "power"]),
        grid_phase_1_entity: findEntity(["sensor"], ["p1", "meter", "power", "phase", "1"]),
        grid_phase_2_entity: findEntity(["sensor"], ["p1", "meter", "power", "phase", "2"]),
        grid_phase_3_entity: findEntity(["sensor"], ["p1", "meter", "power", "phase", "3"]),
        solar_power_entity: findEntity(["sensor"], ["hems", "pv", "power"]),
        solar_forecast_entity: findEntity(["sensor"], ["energy", "production", "today"]),
        battery_level_entity: findEntity(["sensor"], ["zendure", "total", "state", "charge"]),
        battery_power_entity: findEntity(["sensor"], ["zendure", "power"]),
        battery_1_level_entity: findEntity(["sensor"], ["zendure", "1", "state", "charge"]),
        battery_1_power_entity: findEntity(["sensor"], ["zendure", "1", "power"]),
        battery_2_level_entity: findEntity(["sensor"], ["zendure", "2", "state", "charge"]),
        battery_2_power_entity: findEntity(["sensor"], ["zendure", "2", "power"]),
        battery_3_level_entity: findEntity(["sensor"], ["zendure", "3", "state", "charge"]),
        battery_3_power_entity: findEntity(["sensor"], ["zendure", "3", "power"]),
        ev_charger_power_entity: findEntity(["sensor"], ["alfen", "active", "power", "socket", "1"]),
        energy_mode_entity: findEntity(["input_select", "select"], ["zendure", "operation", "mode"]),
        energy_auto_control_entity: findEntity(["input_boolean", "binary_sensor", "switch"], ["hems", "auto", "control"]),
        electricity_price_entity: findEntity(["sensor"], ["nordpool", "kwh", "nl", "eur"]),
        tariff_markup_entity: findEntity(["sensor", "input_number"], ["hems", "rate", "markup"]),
        tariff_vat_entity: findEntity(["sensor", "input_number"], ["hems", "vat", "percentage"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_washer"
      ? {
        program_stage_entity: findEntity(["sensor", "select"], ["wasmachine", "program"]) ??
          findEntity(["sensor", "select"], ["washer", "program"]) ??
          findEntity(["sensor", "select"], ["washer", "job"]) ??
          entity,
        washer_power_entity: findEntity(["sensor", "switch"], ["wasmachine", "power"]) ??
          findEntity(["sensor", "switch"], ["washer", "power"]) ??
          findEntity(["sensor", "switch"], ["power"]),
        door_entity: findEntity(["sensor", "binary_sensor"], ["washer", "door"]) ??
          findEntity(["sensor", "binary_sensor"], ["door"]),
        finished_entity: findEntity(["sensor", "binary_sensor"], ["washer", "finished"]) ??
          findEntity(["sensor", "binary_sensor"], ["finished"]),
        ulm_custom_card_washer_machine_stop_state: "stop",
        ulm_custom_card_washer_label_idle: "idle",
        ulm_custom_card_washer_label_configuring: "configure",
        ulm_custom_card_washer_label_running: "run",
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_sun"
      ? {
        darkMode: false,
        language: hass?.language ?? "en",
        showMoon: true,
        moon_entity: findEntityExcluding(["sensor"], ["moon", "phase"], ["angle"]) ??
          findEntity(["sensor"], ["moon"]),
        moon_altitude_entity: findEntity(["sensor"], ["moon", "altitude"]),
        moon_azimuth_entity: findEntity(["sensor"], ["moon", "azimuth"]),
        moon_rising_entity: findEntity(["sensor"], ["moon", "rising"]) ??
          findEntity(["sensor"], ["moon", "rise"]),
        moon_setting_entity: findEntity(["sensor"], ["moon", "setting"]) ??
          findEntity(["sensor"], ["moon", "set"]),
        moon_next_full_moon_entity: findEntity(["sensor"], ["moon", "next", "full"]),
        moon_next_new_moon_entity: findEntity(["sensor"], ["moon", "next", "new"]),
        moon_above_horizon_entity: findEntity(["sensor", "binary_sensor"], ["moon", "above", "horizon"]),
        timeFormat: "24h",
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_tablet"
      ? {
        tablet_button_usb_entity: findEntity(["switch", "input_boolean"], ["tablet", "usb"]),
        tablet_button_motion_entity: findEntity(["switch", "input_boolean"], ["tablet", "motion"]),
        tablet_button_display_entity: findEntity(["light", "switch", "input_boolean"], ["tablet", "display"]),
        tablet_restart_entity: findEntity(["button"], ["tablet", "restart"]),
        tablet_maintenance_entity: findEntity(["switch", "input_boolean"], ["tablet", "maintenance"]),
        tablet_reload_entity: findEntity(["button"], ["tablet", "reload"]),
        tablet_ram_entity: findEntity(["sensor"], ["tablet", "ram"]),
        tablet_disk_entity: findEntity(["sensor"], ["tablet", "disk"]),
        tablet_power_entity: findEntity(["sensor", "binary_sensor", "switch"], ["tablet", "power"]),
        battery_entity: findEntity(["sensor"], ["tablet", "battery"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_nas_metrics"
      ? {
        disk_entity: findEntity(["sensor"], ["nas", "disk"]) ?? findEntity(["sensor"], ["disk"]),
        disk_name: "Disk",
        disk_icon: "mdi:harddisk",
        disk_color: "red",
        temperature_entity: findEntity(["sensor"], ["nas", "temp"]) ?? findEntity(["sensor"], ["temperature"]),
        temperature_name: "Temp",
        temperature_icon: "mdi:thermometer",
        temperature_color: "orange",
        temperature_max: 100,
        memory_entity: findEntity(["sensor"], ["nas", "memory"]) ?? findEntity(["sensor"], ["memory"]),
        memory_name: "Memory",
        memory_icon: "mdi:memory",
        memory_color: "blue",
        memory_max: 100,
        cpu_entity: findEntity(["sensor"], ["nas", "cpu"]) ?? findEntity(["sensor"], ["cpu"]),
        cpu_name: "CPU",
        cpu_icon: "mdi:cpu-64-bit",
        cpu_color: "green",
        cpu_max: 100,
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_speedtest_gauges"
      ? {
        download_entity: findEntity(["sensor"], ["speedtest", "download"]) ??
          findEntity(["sensor"], ["download"]) ?? entity,
        upload_entity: findEntity(["sensor"], ["speedtest", "upload"]) ??
          findEntity(["sensor"], ["upload"]),
        ping_entity: findEntity(["sensor"], ["speedtest", "ping"]) ??
          findEntity(["sensor"], ["ping"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_roomview"
      ? {
        entity: undefined,
        group_lights: findEntity(["group", "light"], ["lights"]),
        group_motions: findEntity(["group", "binary_sensor"], ["motions"]),
        group_doors: findEntity(["group", "binary_sensor"], ["doors"]),
        group_windows: findEntity(["group", "binary_sensor"], ["windows"]),
        group_outlets: findEntity(["group", "switch"], ["outlets"]),
        group_tv: findEntity(["group", "media_player"], ["tv"]),
        group_water: findEntity(["group", "binary_sensor"], ["water"]),
        group_windows_shutters: findEntity(["group", "cover"], ["shutters"]),
        temperature: findEntity(["sensor"], ["room", "temperature"]) ?? findEntity(["sensor"], ["temperature"]),
        humidity: findEntity(["sensor"], ["room", "humidity"]) ?? findEntity(["sensor"], ["humidity"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_welcome"
      ? {
        ulm_card_welcome_collapse: findEntity(["input_boolean"], ["welcome"]),
        ulm_weather: findEntity(["weather"], []),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_pollen"
      ? {
        trees_entity: findEntity(["sensor"], ["pollen", "trees"]) ??
          findEntity(["sensor"], ["tree", "pollen"]),
        grass_entity: findEntity(["sensor"], ["pollen", "grass"]) ??
          findEntity(["sensor"], ["grass", "pollen"]) ?? entity,
        weeds_entity: findEntity(["sensor"], ["pollen", "weeds"]) ??
          findEntity(["sensor"], ["weed", "pollen"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_plant"
      ? {
        entity,
        ulm_card_flower_entity: entity,
        ulm_card_flower_name: entity ? hass?.states[entity]?.attributes.friendly_name : "No name set",
        ulm_card_flower_show_bars: flowerBars.length ? flowerBars : ["moisture"],
        ...flowerEntities,
      }
      : {}),
    ...(descriptor.upstreamId === "card_room"
      ? {
        room_sensors: [
          findEntity(["sensor"], ["illuminance"]),
          findEntity(["sensor"], ["temperature"]),
        ]
          .filter((entityId): entityId is string => Boolean(entityId))
          .map((entityId) => roomItemDefaultsFor(hass, entityId)),
        room_status: [],
        room_secondary_parts: [],
        room_temperature_entity: findEntity(["sensor"], ["temperature"]),
        ulm_card_dynamic_color: false,
        room_light_entity: entity?.startsWith("light.") ? entity : findEntity(["light"], ["room"]) ?? findEntity(["light"], []),
      }
      : {}),
    ...(descriptor.upstreamId === "card_scenes"
      ? {
        scene_items: available
          .filter((entityId) => entityId.startsWith("scene."))
          .slice(0, 7)
          .map((entityId) => sceneItemDefaultsFor(hass, entityId)),
      }
      : {}),
    ...(descriptor.upstreamId === "card_welcome_scenes"
      ? {
        name: undefined,
        secondary: "Scenes",
        collapse_entity: findEntity(["input_boolean"], ["collapse"]) ??
          findEntity(["input_boolean"], ["dropdown"]) ??
          findEntity(["input_boolean"], []),
        scene_items: available
          .filter((entityId) => entityId.startsWith("scene."))
          .slice(0, 5)
          .map((entityId) => sceneItemDefaultsFor(hass, entityId)),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_media_player_sonos"
      ? {
        use_media_info: true,
        volume_controls: ["volume_mute", "volume_set", "volume_buttons"],
        ulm_card_media_player_power_button: true,
        media_controls: ["shuffle", "previous", "play_pause_stop", "next", "repeat"],
        collapsible_controls: true,
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_printer"
      ? {
        black_entity: findEntity(["sensor"], ["black"]),
        yellow_entity: findEntity(["sensor"], ["yellow"]),
        magenta_entity: findEntity(["sensor"], ["magenta"]),
        cyan_entity: findEntity(["sensor"], ["cyan"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_playstation"
      ? {
        console_platform: inferredConsolePlatform === "generic"
          ? "auto"
          : inferredConsolePlatform,
        console_show_artwork: true,
        console_show_controls: true,
        ...resolveConsoleEntities(hass, entity),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_entity_carousel"
      ? {
        carousel_loop: true,
        carousel_show_labels: true,
        carousel_visible_items: 7,
        carousel_initial_index: 0,
        carousel_effect: "coverflow",
        carousel_grab_cursor: true,
        carousel_centered_slides: true,
        carousel_slides_per_view: "auto",
        carousel_coverflow_rotate: 0,
        carousel_coverflow_stretch: 0,
        carousel_coverflow_depth: 400,
        carousel_coverflow_modifier: 1,
        carousel_coverflow_slide_shadows: true,
        name: carouselExample?.name,
        carousel_items: carouselExample?.items ?? [],
      }
      : {}),
  };
};
