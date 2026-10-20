import type { AdditionConfig, CatalogItem, HomeAssistant } from "./types";
import { populatedDefaultsFor } from "./defaults";
import { sceneItemDefaultsFor } from "./scene-item-defaults";
import { sonosControlCount } from "./sonos-controls";
import { inferConsolePlatform, resolveConsoleEntities } from "./console";

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
  const semanticPrimary =
    descriptor.upstreamId === "mini_graph_card"
      ? findEntityByDeviceClass(["temperature"]) ??
        findEntityByDeviceClass(["power", "energy"]) ??
        findEntity(["sensor"], [])
      : descriptor.upstreamId === "card_graph"
        ? findEntity(["sensor"], ["cv", "plug", "power"]) ??
          findEntityByDeviceClass(["power", "energy"])
        : descriptor.upstreamId === "card_media_player"
            ? findEntity(["media_player"], ["office", "joris", "tv"])
            : descriptor.upstreamId === "card_battery"
              ? findEntityExcluding(["sensor"], ["battery", "level"], ["state", "charging"]) ??
                findEntityByDeviceClass(["battery"], [], ["state", "charging"])
              : descriptor.upstreamId === "custom_card_pollen_forecast"
                        ? findEntity(["sensor"], ["pollen", "grass", "level"]) ??
                          findEntity(["sensor"], ["pollen", "grass"]) ??
                          findEntity(["sensor"], ["pollen"])
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
                                      : descriptor.upstreamId === "custom_card_more_power_outlet"
                                        ? findEntity(["switch", "light"], ["outlet"]) ??
                                          findEntity(["switch", "light"], ["plug"])
                                      : descriptor.upstreamId === "custom_card_printer"
                                        ? findEntity(["sensor", "binary_sensor"], ["printer"]) ??
                                          findEntity(["sensor", "binary_sensor"], ["online"])
                                      : descriptor.upstreamId === "custom_card_internet_speed"
                                ? findEntity(["sensor"], ["download"])
                              : descriptor.upstreamId === "custom_card_weather_metrics"
                                ? findEntity(["weather"], [])
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
    ? findHealthyEntity(["light"], ["office", "joris"]) ??
      findHealthyEntity(["light"], []) ??
      findHealthyEntity(["climate"], []) ??
      findHealthyEntity(["sensor"], [])
    : undefined;
  const entity = scenePrimary ?? semanticPrimary ??
    firstMatchingEntity(descriptor, hass, entities, entitiesFallback);
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
  const uniqueEntities = (candidates: Array<string | undefined>, limit: number): string[] =>
    [...new Set(candidates.filter((value): value is string => Boolean(value)))].slice(0, limit);
  const weatherTemperature = findEntity(["sensor"], ["outdoor", "temperature"]) ??
    findEntity(["sensor"], ["outside", "temperature"]) ??
    findEntity(["sensor"], ["garden", "temperature"]) ??
    findEntityByDeviceClass(["temperature"], [], ["battery", "cpu", "soil"]);
  const weatherDate = findEntity(["sensor"], ["date", "time"]) ??
    findEntity(["sensor"], ["time", "date"]) ??
    findEntity(["sensor"], ["date"]);
  const weatherMetricCandidates: Array<[string | undefined, string]> = [
    [findHealthyEntityByDeviceClass(["humidity"]), "Humidity"],
    [
      findHealthyEntityByDeviceClass(["wind_speed"]) ??
        findHealthyEntity(["sensor"], ["wind", "speed"]) ??
        findHealthyEntity(["sensor"], ["wind"]),
      "Wind",
    ],
    [
      findHealthyEntityByDeviceClass(["atmospheric_pressure"]) ??
        findHealthyEntity(["sensor"], ["barometric", "pressure"]) ??
        findHealthyEntity(["sensor"], ["pressure"], ["blood"]),
      "Pressure",
    ],
    [
      findHealthyEntityByDeviceClass(["precipitation", "precipitation_intensity"]) ??
        findHealthyEntity(["sensor"], ["precipitation"]) ??
        findHealthyEntity(["sensor"], ["rain"]),
      "Precipitation",
    ],
    [findHealthyEntity(["sensor"], ["visibility"]), "Visibility"],
    [findHealthyEntity(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [findHealthyEntity(["sensor"], ["uv", "index"]), "UV index"],
    [findHealthyEntityByDeviceClass(["illuminance"]), "Light level"],
    [findHealthyEntity(["sensor"], ["dew", "point"]), "Dew point"],
  ];
  const inferredConsolePlatform = inferConsolePlatform(hass, entity);
  const weatherMetrics = weatherMetricCandidates.filter(
    ([entityId], index, candidates) =>
      Boolean(entityId) && candidates.findIndex(([candidate]) => candidate === entityId) === index,
  ).slice(0, 4) as Array<[string, string]>;
  const overviewEntities = uniqueEntities([
    findEntityByDeviceClass(["temperature"]),
    findEntityByDeviceClass(["humidity"]),
    findEntityByDeviceClass(["power", "energy"]),
    findEntityByDeviceClass(["battery"]),
    ...available.filter((entityId) => entityId.startsWith("sensor.")),
  ], 4);
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
        : descriptor.upstreamId === "custom_card_plant"
          ? { action: "more-info" }
          : tapAction;
  return {
    ...populatedDefaultsFor(descriptor, hass, entity),
    name: entity ? hass?.states[entity]?.attributes.friendly_name : sampleName(descriptor),
    secondary: entity ? undefined : isText ? "Example" : "Preview",
    variant: defaultVariant,
    tap_action: stubTapAction,
    show_controls: ["climate", "vacuum", "control"].includes(descriptor.family) ||
      (descriptor.family === "media" && descriptor.upstreamId !== "card_media_player")
      ? true
      : undefined,
    show_forecast: descriptor.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(descriptor.family),
    ulm_custom_card_bar_card_value: descriptor.family === "bar" ? true : undefined,
    entities: descriptor.upstreamId === "mini_graph_card" && entity
      ? [entity]
      : descriptor.variants?.includes("with-sensors")
      ? entitiesFallback.slice(0, 2)
      : undefined,
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
        showAzimuth: false,
        showElevation: false,
        showMoon: true,
        moon_entity: findEntityExcluding(["sensor"], ["moon", "phase"], ["angle"]) ??
          findEntity(["sensor"], ["moon"]),
        moon_altitude_entity: findEntity(["sensor"], ["moon", "altitude"]),
        moon_azimuth_entity: findEntity(["sensor"], ["moon", "azimuth"]),
        moon_right_ascension_entity: findEntity(["sensor"], ["moon", "right", "ascension"]),
        moon_declination_entity: findEntity(["sensor"], ["moon", "declination"]),
        moon_distance_entity: findEntity(["sensor"], ["moon", "distance"]),
        moon_angular_diameter_entity: findEntity(["sensor"], ["moon", "angular", "diameter"]),
        moon_phase_angle_entity: findEntity(["sensor"], ["moon", "phase", "angle"]),
        moon_illumination_entity: findEntity(["sensor"], ["moon", "illumination"]),
        moon_next_full_moon_entity: findEntity(["sensor"], ["moon", "next", "full"]),
        moon_next_new_moon_entity: findEntity(["sensor"], ["moon", "next", "new"]),
        moon_above_horizon_entity: findEntity(["sensor", "binary_sensor"], ["moon", "above", "horizon"]),
        timeFormat: "24h",
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_pollen_forecast"
      ? {
        entity: findEntity(["sensor"], ["pollen", "grass", "level"]) ?? entity,
        level_entity: findEntity(["sensor"], ["pollen", "grass", "level"]),
        pollen_language: "en",
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
    ...(descriptor.upstreamId === "custom_card_room_overview"
      ? {
        ulm_custom_card_room_overview_light_entity: findEntity(["light"], ["room"]) ?? findEntity(["light"], []),
        ulm_custom_card_room_overview_climate_entity: findEntity(["climate"], ["room"]) ?? findEntity(["climate"], []),
        ulm_custom_card_room_overview_cover_entity: findEntity(["cover"], ["room"]) ?? findEntity(["cover"], []),
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
          .map((entityId) => ({ entity: entityId })),
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
    ...(descriptor.upstreamId === "custom_card_internet_speed"
      ? {
        download_entity: findEntity(["sensor"], ["download"]) ?? entity,
        upload_entity: findEntity(["sensor"], ["upload"]),
        ping_entity: findEntity(["sensor"], ["ping"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_entity_overview"
      ? {
        entities: overviewEntities,
        ...Object.fromEntries(overviewEntities.flatMap((entityId, index) => [
          [`ulm_custom_card_entity_overview_entity_${index + 1}`, entityId],
          [`ulm_custom_card_entity_overview_name_${index + 1}`,
            hass?.states[entityId]?.attributes.friendly_name ?? `Entity ${index + 1}`],
        ])),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_weather_metrics"
      ? {
        entity: findEntity(["weather"], []) ?? entity,
        temperature_entity: weatherTemperature,
        date_entity: weatherDate,
        entities: weatherMetrics.map(([entityId]) => entityId),
        ulm_custom_card_weather_metrics: findEntity(["weather"], []) ?? entity,
        ulm_custom_card_weather_metrics_temperature_outside: weatherTemperature,
        ulm_custom_card_weather_metrics_date: weatherDate,
        ...Object.fromEntries(weatherMetrics.flatMap(([entityId, label], index) => [
          [`ulm_custom_card_weather_metrics_entity_${index + 1}`, entityId],
          [`ulm_custom_card_weather_metrics_name_${index + 1}`, label],
        ])),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_media_player_sonos"
      ? {
        ulm_card_media_player_with_controls_name: entity
          ? hass?.states[entity]?.attributes.friendly_name
          : "No name set",
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_more_power_outlet"
      ? {
        power_entity: findEntity(["sensor"], ["power"]),
        energy_entity: findEntity(["sensor"], ["energy"]),
        time_entity: findEntity(["sensor"], ["time"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_gauge"
      ? { minimum: 0, maximum: 100 }
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
        carousel_items: uniqueEntities(entitiesFallback, 7).map((carouselEntity) => ({
          entity: carouselEntity,
          name: hass?.states[carouselEntity]?.attributes.friendly_name,
          icon: hass?.states[carouselEntity]?.attributes.icon,
          color: "primary",
          tap_action: { action: "more-info" },
          hold_action: { action: "none" },
        })),
      }
      : {}),
  };
};
