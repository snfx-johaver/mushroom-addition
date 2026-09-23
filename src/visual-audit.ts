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

const accepted: Record<string, Partial<VisualAuditEntry>> = {
  ...acceptedDefaults,
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
