import {
  publicItemForSource,
  UPSTREAM_CATALOG,
  variantForSource,
} from "./catalog";

export type VisualAuditStatus = "pending" | "accepted" | "deviation";

export interface VisualAuditEntry {
  sourceId: string;
  publicId: string;
  variant?: string;
  category: "default-card" | "custom-card";
  rendererId: string;
  compositionId: string;
  sourcePath: string;
  referenceScreenshot?: string;
  fixturePath: string;
  fixtureId: string;
  artifactPath?: string;
  themes: readonly ("light" | "dark")[];
  widths: readonly number[];
  requiredRegions: readonly string[];
  forbiddenRegions: readonly string[];
  status: VisualAuditStatus;
  inspectedAt?: string;
  deviations: readonly string[];
}

const defaultReferences: Record<string, string> = {
  card_battery: "card_battery.png",
  card_binary_sensor: "card_binary_sensor.png",
  card_binary_sensor_alert: "card_binary_sensor_alert.png",
  card_cover: "card_cover_controls.png",
  card_fan: "card_fan_slider.png",
  card_generic: "card_generic.png",
  card_generic_swap: "card_generic_swap.png",
  card_graph: "card_graph.png",
  card_input_boolean: "card_input_boolean.png",
  card_light: "card_light_combi.png",
  card_media_player: "card_media_player_art_controls.png",
  card_navigate: "card_navigate.png",
  card_person: "card_person.png",
  card_power_outlet: "card_power_outlet.png",
  card_room: "room-card.png",
  card_scenes: "card_scenes.png",
  card_script: "card_script.png",
  card_thermostat: "card_thermostat_with_controls.png",
  card_title: "card_title.png",
  card_vacuum: "card_vacuum_cleaning.png",
  card_vertical_button: "card_example.png",
  card_weather: "card_weather.png",
  card_weather_ulm: "card_weather_ulm.png",
  card_welcome_scenes: "card_welcome_scenes.png",
};

const defaultStructures: Record<string, { required: string[]; forbidden: string[] }> = {
  card_battery: { required: ["ulm-default-battery", "value-first"], forbidden: ["battery-track", "sparkline"] },
  card_binary_sensor: { required: ["ulm-binary", "ulm-icon"], forbidden: ["sparkline", "ulm-controls"] },
  card_binary_sensor_alert: { required: ["ulm-binary", "variant-alert"], forbidden: ["sparkline", "ulm-controls"] },
  card_cover: { required: ["ulm-cover", "cover-controls"], forbidden: ["sparkline"] },
  card_fan: { required: ["ulm-fan", "ulm-fan-slider"], forbidden: ["sparkline"] },
  card_generic: { required: ["value-first", "ulm-icon"], forbidden: ["sparkline", "ulm-controls"] },
  card_generic_swap: { required: ["ulm-generic-swap", "value-first"], forbidden: ["sparkline", "ulm-controls"] },
  card_graph: { required: ["ulm-default-graph", "sparkline", "is-filled"], forbidden: ["ulm-light-slider"] },
  card_input_boolean: { required: ["ulm-simple-default", "ulm-icon"], forbidden: ["sparkline", "ulm-controls"] },
  card_light: { required: ["ulm-light-card", "ulm-light-slider"], forbidden: ["sparkline"] },
  card_media_player: { required: ["ulm-media", "media-art", "ulm-controls"], forbidden: ["sparkline"] },
  card_navigate: { required: ["ulm-default-navigation", "ulm-icon"], forbidden: ["sparkline", "weather-forecast"] },
  card_person: { required: ["ulm-person", "presence-dot"], forbidden: ["sparkline", "ulm-controls"] },
  card_power_outlet: { required: ["ulm-simple-default", "ulm-icon"], forbidden: ["sparkline", "ulm-controls"] },
  card_room: { required: ["ulm-room", "room-main", "room-sensor"], forbidden: ["sparkline", "scene-grid"] },
  card_scenes: { required: ["scene-pills", "scene-grid", "scene-button"], forbidden: ["sparkline", "room-main"] },
  card_script: { required: ["ulm-simple-default", "ulm-icon"], forbidden: ["sparkline", "ulm-controls"] },
  card_thermostat: { required: ["ulm-climate", "climate-target"], forbidden: ["sparkline"] },
  card_title: { required: ["ulm-title", "ulm-copy"], forbidden: ["ulm-icon", "sparkline"] },
  card_vacuum: { required: ["ulm-default-vacuum", "vacuum-actions"], forbidden: ["sparkline"] },
  card_vertical_button: { required: ["ulm-vertical-button", "ulm-icon"], forbidden: ["sparkline"] },
  card_weather: { required: ["legacy-weather", "legacy-weather-current", "legacy-weather-details"], forbidden: ["ulm-light-slider"] },
  card_weather_ulm: { required: ["ulm-weather", "weather-metrics"], forbidden: ["legacy-weather", "ulm-light-slider"] },
  card_welcome_scenes: { required: ["welcome-scenes", "welcome-toolbar", "scene-grid"], forbidden: ["sparkline", "room-main"] },
};

const acceptedDefaults = Object.fromEntries(Object.entries(defaultStructures).map(([sourceId, structure]) => [
  sourceId,
  {
    compositionId: `default:${sourceId}:${structure.required[0]}`,
    referenceScreenshot: `.tmp-ui-minimalist/docs/assets/img/ulm_cards/${defaultReferences[sourceId]}`,
    fixturePath: "demo/default-card-comparison.html",
    artifactPath: `docs/assets/visual-audit/${sourceId}-comparison.png`,
    themes: ["light"],
    widths: [320],
    requiredRegions: structure.required,
    forbiddenRegions: structure.forbidden,
    status: "accepted",
    inspectedAt: "2026-09-23",
    deviations: [
      "The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons.",
    ],
  } satisfies Partial<VisualAuditEntry>,
]));

const customStructures: Record<string, string[]> = {
  custom_card_afvalophaling: ["custom-waste-card", "waste-grid"],
  custom_card_alarm_time: ["custom-alarm-time", "alarm-time-controls"],
  custom_card_apexcharts: ["custom-apexcharts", "apex-chart"],
  custom_card_camera: ["ulm-camera", "camera-caption"],
  custom_card_chromecast: ["custom-chromecast", "chromecast-controls"],
  custom_card_damix48_power_details: ["custom-power-details", "power-details-chart"],
  custom_card_device_tracker: ["custom-device-tracker", "device-tracker-icon"],
  custom_card_drealine_roomview: ["custom-room-view", "room-view-actions"],
  custom_card_eraycetinay_elapsed_time: ["custom-elapsed-time", "ulm-label"],
  custom_card_eraycetinay_lock: ["custom-eray-lock", "eray-lock-icon"],
  custom_card_esh_room: ["ulm-room", "room-main"],
  custom_card_esh_welcome: ["custom-esh-welcome", "esh-welcome-items"],
  custom_card_haven_washer: ["custom-washer", "washer-stages"],
  custom_card_heat_pump: ["custom-heat-pump", "heat-pump-modes"],
  custom_card_homeassistant_updates: ["custom-ha-updates", "ha-update-list"],
  custom_card_httpedo13_sun: ["custom-sun-card", "sun-arc"],
  custom_card_httpedo13_thermostat: ["custom-compact-thermostat", "compact-thermostat-controls"],
  custom_card_iAbadia_battery_chip: ["custom-battery-chip"],
  custom_card_imswel_medias: ["custom-media-library", "media-library-overlay"],
  custom_card_imswel_person: ["custom-imswel-person", "imswel-person-trackers"],
  custom_card_input_datetime: ["custom-input-datetime", "input-datetime-controls"],
  custom_card_input_number: ["custom-input-number", "input-number-controls"],
  custom_card_irmajavi_entities: ["custom-irmajavi-entities", "irmajavi-four"],
  custom_card_irmajavi_speedtest: ["custom-irmajavi-speedtest", "speedtest-metrics"],
  custom_card_irmajavi_weather: ["custom-irmajavi-weather", "irmajavi-weather-header"],
  custom_card_light_colorpick: ["custom-light-colorpick", "light-color-swatches"],
  custom_card_media_player_sonos: ["custom-sonos", "sonos-controls"],
  custom_card_more_power_outlet: ["custom-more-power-outlet"],
  custom_card_mpse_gauge: ["custom-dual-gauge", "dual-gauge"],
  custom_card_mpse_printer: ["custom-mpse-printer", "toner-bars"],
  custom_card_mpse_thermostat: ["custom-compact-thermostat", "compact-thermostat-controls"],
  custom_card_mpse_wifisignal: ["custom-wifi-signal"],
  custom_card_nas: ["custom-nas-info"],
  custom_card_neekster_update: ["custom-neekster-update", "custom-card-heading"],
  custom_card_nik_clock: ["custom-nik-clock"],
  custom_card_nik_door: ["custom-nik-door", "nik-door-controls"],
  custom_card_nik_nas: ["custom-nik-nas", "nik-nas-metrics"],
  custom_card_nik_tablet: ["custom-nik-tablet", "tablet-status-row"],
  custom_card_paddy_dwd_pollen: ["custom-paddy-pollen", "pollen-icon"],
  custom_card_paddy_waste_collection: ["custom-paddy-waste", "paddy-waste-icon"],
  custom_card_paddy_welcome: ["custom-paddy-welcome"],
  custom_card_person_chip: ["custom-person-chip"],
  custom_card_person_info: ["custom-person-info", "person-info-details"],
  custom_card_person_info_small: ["custom-person-info-small", "is-compact"],
  custom_card_playstation: ["custom-console-card", "console-content"],
  custom_card_qubino: ["custom-qubino"],
  custom_card_ristou_person: ["custom-ristou-person", "ristou-person-main"],
  custom_card_saxel_fan: ["custom-saxel-fan", "fan-speed-row"],
  custom_card_scenes: ["ulm-scenes", "scene-grid"],
  custom_card_schumijo_car: ["custom-schumijo-car", "car-metrics"],
  custom_card_schumijo_flower: ["custom-schumijo-flower", "flower-metrics"],
  custom_card_senoro_win: ["custom-senoro-window", "window-battery"],
  custom_card_sisimomo_printer: ["custom-sisimomo-printer", "printer-cartridges"],
  custom_card_speedtest_shogun160: ["custom-speedtest-shogun", "speedtest-three"],
  custom_card_tpx01_aircondition: ["custom-tpx-aircondition", "aircondition-controls"],
  custom_card_vncntdev_device_tracer: ["custom-device-tracer", "device-tracer-meta"],
  custom_card_water_heater: ["custom-water-heater", "water-heater-controls"],
  custom_card_wilbiev_subtitle: ["ulm-title", "variant-divider-subtitle"],
  custom_card_wilbiev_title: ["ulm-title", "variant-divider-title"],
  custom_card_wsly_pollen: ["custom-wsly-pollen"],
  custom_card_yagrasdemonde_lights_count: ["custom-lights-count"],
};

const customReferences: Record<string, string> = {
  custom_card_afvalophaling: "custom_card_afvalophaling_1.png",
  custom_card_apexcharts: "custom_card_apexcharts_line.png",
  custom_card_camera: "screenshot_custom_camera1.png",
  custom_card_damix48_power_details: "custom_power_details.png",
  custom_card_device_tracker: "custom_card_device_tracker.png",
  custom_card_drealine_roomview: "custom_card_drealine_roomview_1.png",
  custom_card_eraycetinay_elapsed_time: "custom_card_eraycetinay_elapsed_time.png",
  custom_card_eraycetinay_lock: "custom_card_eraycetinay_lock.png",
  custom_card_esh_room: "custom_card_esh_room_light.png",
  custom_card_esh_welcome: "custom_card_esh_welcome_light.png",
  custom_card_haven_washer: "custom_card_haven_washer_running.png",
  custom_card_homeassistant_updates: "ulm_cards/card_homeassistant_updates.png",
  custom_card_httpedo13_sun: "sun-card.png",
  custom_card_httpedo13_thermostat: "thermostat_white_with_heating_ui.png",
  custom_card_iAbadia_battery_chip: "custom_card_iAbadia_battery_chip.png",
  custom_card_imswel_person: "custom_card_imswel_person.gif",
  custom_card_input_datetime: "card_input_datetime.png",
  custom_card_input_number: "card_input_number.png",
  custom_card_irmajavi_entities: "screenshot_irmajavi_entities_card.jpg",
  custom_card_irmajavi_speedtest: "screenshot_irmajavi_speedtest_card.jpg",
  custom_card_irmajavi_weather: "screenshot_irmajavi_weather_card.jpg",
  custom_card_media_player_sonos: "media_player_sonos.png",
  custom_card_mpse_gauge: "custom_gauge.png",
  custom_card_mpse_printer: "custom_printer.png",
  custom_card_mpse_thermostat: "custom_thermostat.png",
  custom_card_mpse_wifisignal: "custom_wifisignal.png",
  custom_card_nas: "custom_card_nas.png",
  custom_card_neekster_update: "custom_card_neekster_update.png",
  custom_card_nik_clock: "custom_card_nik_clock.png",
  custom_card_nik_door: "custom_card_nik_door.png",
  custom_card_nik_nas: "custom_card_nik_nas_on.png",
  custom_card_nik_tablet: "custom_card_nik_tablet_1.png",
  custom_card_person_info: "custom_card_person_info.png",
  custom_card_person_info_small: "custom_card_person_info_small_light.png",
  custom_card_ristou_person: "custom_card_ristou_person/custom_card_ristou_person_light.png",
  custom_card_saxel_fan: "custom_fan_light_theme.png",
  custom_card_scenes: "card_scenes.png",
  custom_card_schumijo_car: "car.png",
  custom_card_schumijo_flower: "flower.png",
  custom_card_senoro_win: "senoro_win_card.png",
  custom_card_sisimomo_printer: "custom_card_sisimomo_printer.png",
  custom_card_vncntdev_device_tracer: "custom_device_tracer.jpg",
  custom_card_wilbiev_subtitle: "custom_card_wilbiev_subtitle.png",
  custom_card_wilbiev_title: "custom_card_wilbiev_title.png",
  custom_card_wsly_pollen: "custom_card_wsly_pollen_light.png",
  custom_card_yagrasdemonde_lights_count: "screenshot_light_count_lights.png",
};

const acceptedCustoms = Object.fromEntries(Object.entries(customStructures).map(([sourceId, requiredRegions]) => [
  sourceId,
  {
    compositionId: `custom:${sourceId}:${requiredRegions[0]}`,
    referenceScreenshot: `.tmp-ui-minimalist/docs/assets/img/${customReferences[sourceId] ?? "cards.png"}`,
    fixturePath: "demo/custom-card-comparison.html",
    artifactPath: "docs/assets/visual-audit/custom-cards-complete-comparison.png",
    themes: ["light"],
    widths: [320],
    requiredRegions,
    forbiddenRegions: ["ulm-metric", "ulm-detail-card", "ulm-device-status", "ulm-schedule-card", "ulm-helper-card"],
    status: "accepted",
    inspectedAt: "2026-09-23",
    deviations: customReferences[sourceId]
      ? ["The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons."]
      : ["No dedicated upstream screenshot exists; composition was checked against the pinned YAML structure and documentation variables."],
  } satisfies Partial<VisualAuditEntry>,
]));

const accepted: Record<string, Partial<VisualAuditEntry>> = {
  ...acceptedDefaults,
  ...acceptedCustoms,
  custom_card_bar_card: {
    compositionId: "bar-card:compact-header-progress",
    referenceScreenshot: ".tmp-ui-minimalist/docs/assets/img/screenshot_bar_card.png",
    fixturePath: "demo/bar-card-comparison.html",
    artifactPath: "docs/assets/visual-audit/custom-card-bar-card-comparison.png",
    themes: ["dark"],
    widths: [237],
    requiredRegions: [
      "minimalist-bar-card",
      "bar-card-header",
      "bar-card-icon",
      "bar-card-primary-value",
      "bar-card-name",
      "bar-card-track",
      "bar-card-fill",
    ],
    forbiddenRegions: ["sparkline", "metric-extremes", "ulm-metric"],
    status: "accepted",
    inspectedAt: "2026-09-23",
    deviations: [
      "The standalone comparison fixture uses abbreviated icon stubs; Home Assistant renders the configured MDI glyphs.",
    ],
  },
};

export const VISUAL_AUDIT: readonly VisualAuditEntry[] = UPSTREAM_CATALOG.map((source) => {
  const item = publicItemForSource(source.upstreamId);
  if (!item) throw new Error(`${source.upstreamId} has no public card mapping.`);
  if (source.category !== "default-card" && source.category !== "custom-card") {
    throw new Error(`${source.upstreamId} is not a card source.`);
  }
  const variant = variantForSource(source.upstreamId);
  const baseline: VisualAuditEntry = {
    sourceId: source.upstreamId,
    publicId: item.upstreamId,
    variant,
    category: source.category,
    rendererId: item.upstreamId,
    compositionId: `${item.upstreamId}${variant ? `:${variant}` : ""}`,
    sourcePath: source.sourcePath,
    fixturePath: "demo/index.html",
    fixtureId: source.upstreamId,
    themes: ["light", "dark"],
    widths: [237, 360],
    requiredRegions: [],
    forbiddenRegions: [],
    status: "pending",
    deviations: [],
  };
  return { ...baseline, ...accepted[source.upstreamId] };
});

export const visualAuditProgress = (): { accepted: number; total: number } => ({
  accepted: VISUAL_AUDIT.filter((entry) => entry.status === "accepted").length,
  total: VISUAL_AUDIT.length,
});
