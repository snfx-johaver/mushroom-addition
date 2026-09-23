import { html, nothing, type TemplateResult } from "lit";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant, WeatherForecast } from "./types";
import { activeStates, displayName, stateLabel } from "./helpers";
import { defaultIconFor } from "./defaults";

export interface RenderContext {
  config: AdditionConfig;
  descriptor: CatalogItem;
  hass: HomeAssistant;
  entity?: HassEntity;
  forecast?: WeatherForecast[];
  actionSurface: (classes: string, content: TemplateResult) => TemplateResult;
  service: (domain: string, service: string, data?: Record<string, unknown>) => void;
}

const attr = (entity: HassEntity | undefined, key: string): unknown => entity?.attributes[key];
const numeric = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const linkedState = (ctx: RenderContext, key: keyof AdditionConfig): HassEntity | undefined => {
  const entityId = ctx.config[key];
  return typeof entityId === "string" ? ctx.hass.states[entityId] : undefined;
};
const configured = <T>(ctx: RenderContext, ...keys: string[]): T | undefined => {
  for (const key of keys) {
    if (ctx.config[key] !== undefined) return ctx.config[key] as T;
  }
  return undefined;
};
const enabled = (ctx: RenderContext, canonical: keyof AdditionConfig, ...upstreamKeys: string[]): boolean =>
  configured<boolean>(ctx, String(canonical), ...upstreamKeys) === true;
const icon = (ctx: RenderContext, fallback: string): string =>
  ctx.config.icon || ctx.entity?.attributes.icon || defaultIconFor(ctx.descriptor, ctx.entity) || fallback;
const iconBubble = (ctx: RenderContext, fallback: string, tone = "blue", extraClass = "") => {
  if (ctx.config.icon_type === "none" || ctx.config.show_icon === false) return nothing;
  const picture = ctx.config.icon_type === "entity-picture" ? attr(ctx.entity, "entity_picture") : undefined;
  return picture
    ? html`<span class="ulm-icon entity-picture ${extraClass}" style=${`background-image:url("${String(picture)}")`}></span>`
    : html`<span class="ulm-icon tone-${tone} ${extraClass}"><ha-icon .icon=${icon(ctx, fallback)}></ha-icon></span>`;
};
const selectedSecondary = (ctx: RenderContext, recommended?: string): string | undefined => {
  switch (ctx.config.secondary_info) {
    case "none": return undefined;
    case "name": return displayName(ctx.config, ctx.entity);
    case "state": return stateLabel(ctx.entity);
    case "last-changed": return ctx.entity?.last_changed
      ? new Date(ctx.entity.last_changed).toLocaleString()
      : "Last changed unavailable";
    default: return ctx.config.secondary || recommended;
  }
};
const selectedPrimary = (ctx: RenderContext): string => {
  if (ctx.config.primary_info === "none") return "";
  if (ctx.config.primary_info === "state") return stateLabel(ctx.entity);
  return displayName(ctx.config, ctx.entity);
};
const heading = (ctx: RenderContext, recommendedSecondary?: string) => html`
  <span class="ulm-copy">
    ${selectedPrimary(ctx) ? html`<span class="ulm-name">${selectedPrimary(ctx)}</span>` : nothing}
    ${selectedSecondary(ctx, recommendedSecondary)
      ? html`<span class="ulm-label">${selectedSecondary(ctx, recommendedSecondary)}</span>`
      : nothing}
  </span>
`;
const button = (label: string, iconName: string, handler: (event: Event) => void) => html`
  <button class="ulm-control" aria-label=${label} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${handler}>
    <ha-icon .icon=${iconName}></ha-icon>
  </button>
`;

const weatherIcons: Record<string, [string, string]> = {
  "clear-night": ["mdi:weather-night", "yellow"],
  cloudy: ["mdi:weather-cloudy", "blue"],
  fog: ["mdi:weather-fog", "grey"],
  hail: ["mdi:weather-hail", "blue"],
  lightning: ["mdi:weather-lightning", "yellow"],
  "lightning-rainy": ["mdi:weather-lightning-rainy", "blue"],
  partlycloudy: ["mdi:weather-partly-cloudy", "yellow"],
  pouring: ["mdi:weather-pouring", "blue"],
  rainy: ["mdi:weather-rainy", "blue"],
  snowy: ["mdi:weather-snowy", "blue"],
  "snowy-rainy": ["mdi:weather-snowy-rainy", "blue"],
  sunny: ["mdi:weather-sunny", "yellow"],
  windy: ["mdi:weather-windy", "grey"],
};

const renderWeather = (ctx: RenderContext): TemplateResult => {
  const condition = ctx.entity?.state ?? "unknown";
  const [weatherIcon, tone] = weatherIcons[condition] ?? ["mdi:weather-partly-cloudy", "grey"];
  const temperatureEntity = linkedState(ctx, "temperature_entity");
  const humidityEntity = linkedState(ctx, "humidity_entity");
  const temperature = stateLabel(temperatureEntity) !== "Entity unavailable"
    ? stateLabel(temperatureEntity)
    : `${attr(ctx.entity, "temperature") ?? "—"}${attr(ctx.entity, "temperature_unit") ?? "°"}`;
  const humidity = stateLabel(humidityEntity) !== "Entity unavailable"
    ? stateLabel(humidityEntity)
    : `${attr(ctx.entity, "humidity") ?? "—"}%`;
  const forecast = ctx.forecast?.slice(0, 4) ?? [];
  const native = ctx.config.variant === "native";
  const backdrop = configured<boolean>(ctx, "ulm_card_weather_backdrop") === true;
  const primaryInfo = configured<string>(ctx, "ulm_card_weather_primary_info") ?? "extrema";
  const secondaryInfo = configured<string>(ctx, "ulm_card_weather_secondary_info") ?? "precipitation";
  return ctx.actionSurface(`ulm-weather ${backdrop ? "has-backdrop" : ""}`, html`
    <div class="weather-main">
      <span class="ulm-icon weather-icon tone-${tone}"><ha-icon .icon=${weatherIcon}></ha-icon></span>
      <div class="weather-summary">
        <span class="weather-temp">${temperature}</span>
        <span class="ulm-name">${displayName(ctx.config, ctx.entity)}</span>
        <span class="ulm-label weather-condition">${condition.replaceAll("-", " ")}</span>
        ${!native && forecast[0] && primaryInfo === "extrema" ? html`<span class="weather-extrema">H ${String(forecast[0].temperature ?? "—")}° · L ${String(forecast[0].templow ?? forecast[0].temperature_low ?? "—")}°</span>` : nothing}
        ${!native && secondaryInfo === "precipitation" && forecast[0]?.precipitation_probability !== undefined
          ? html`<span class="weather-extrema">${forecast[0].precipitation_probability}% precipitation</span>`
          : secondaryInfo === "precipitation" && forecast[0]?.precipitation !== undefined
            ? html`<span class="weather-extrema">${forecast[0].precipitation}${String(attr(ctx.entity, "precipitation_unit") ?? " mm")} precipitation</span>`
            : nothing}
      </div>
    </div>
    ${native ? nothing : html`<div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${humidity}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${temperature}</span>
    </div>`}
    ${!native && ctx.config.show_forecast && forecast.length ? html`
      <div class="weather-forecast">
        ${forecast.map((period) => {
          const state = String(period.condition ?? "cloudy");
          return html`<span><ha-icon .icon=${weatherIcons[state]?.[0] ?? "mdi:weather-cloudy"}></ha-icon><b>${String(period.temperature ?? "—")}°</b></span>`;
        })}
      </div>
    ` : nothing}
  `);
};

const renderLight = (ctx: RenderContext): TemplateResult => {
  const on = ctx.entity?.state === "on";
  const brightness = numeric(attr(ctx.entity, "brightness"));
  const percent = brightness === undefined ? undefined : Math.round(brightness / 2.55);
  const slider = enabled(ctx, "show_controls", "ulm_card_light_enable_slider");
  const buttons = configured<boolean>(ctx, "ulm_card_light_enable_buttons") === true;
  const collapsed = configured<boolean>(ctx, "ulm_card_light_enable_collapse") === true && !on;
  const horizontal = ctx.config.layout === "horizontal" ||
    configured<boolean>(ctx, "ulm_card_light_enable_horizontal") === true;
  const low = configured<number>(ctx, "ulm_card_light_brightness_low") ?? 1;
  const medium = configured<number>(ctx, "ulm_card_light_brightness_medium") ?? 50;
  const high = configured<number>(ctx, "ulm_card_light_brightness_high") ?? 100;
  const min = configured<number>(ctx, "ulm_card_light_enable_slider_minSet") ?? 0;
  const max = configured<number>(ctx, "ulm_card_light_enable_slider_maxSet") ?? 100;
  const entityColor = configured<boolean>(ctx, "ulm_card_light_enable_color") === true
    ? attr(ctx.entity, "rgb_color")
    : undefined;
  const rgb = Array.isArray(entityColor) && entityColor.length >= 3
    ? entityColor.slice(0, 3).map(Number).join(",")
    : "255,152,0";
  const forceBackground = configured<boolean>(ctx, "ulm_card_light_force_background_color") === true && on;
  const lightStyle = `--light-rgb:${rgb};${forceBackground ? `background:rgba(${rgb},.2);` : ""}`;
  return ctx.actionSurface(`ulm-light-card ${horizontal ? "is-horizontal" : ""} ${collapsed ? "is-collapsed" : ""}`, html`
    <div class="light-header ${on ? "is-active" : ""}" style=${lightStyle}>
      ${iconBubble(ctx, "mdi:lightbulb", on ? "yellow" : "grey", "light-icon")}
      ${heading(ctx, percent === undefined ? stateLabel(ctx.entity) : `${stateLabel(ctx.entity)} · ${percent}%`)}
    </div>
    ${!collapsed && slider ? html`
      <div class="ulm-light-slider" style=${`${lightStyle}--light-level:${Math.max(0, Math.min(100, percent ?? 0))}%;`}>
        <i></i>
        <input type="range" .min=${String(min)} .max=${String(max)} .value=${String(percent ?? 0)}
          aria-label="Brightness"
          @pointerdown=${(event: Event) => event.stopPropagation()}
          @click=${(event: Event) => event.stopPropagation()}
          @change=${(event: Event) => ctx.service("light", "turn_on", { entity_id: ctx.config.entity, brightness_pct: Number((event.target as HTMLInputElement).value) })}>
      </div>
    ` : nothing}
    ${!collapsed && buttons ? html`<div class="ulm-controls brightness-presets">
      ${[low, medium, high].map((brightness) => button(`${brightness}% brightness`, "mdi:brightness-6", (event) => {
        event.stopPropagation();
        ctx.service("light", "turn_on", { entity_id: ctx.config.entity, brightness_pct: brightness });
      }))}
    </div>` : nothing}
  `);
};

const renderClimate = (ctx: RenderContext): TemplateResult => {
  const current = attr(ctx.entity, "current_temperature") ?? "—";
  const target = attr(ctx.entity, "temperature") ?? "—";
  const humidity = linkedState(ctx, "humidity_entity");
  return ctx.actionSurface("ulm-climate", html`
    <div class="climate-top">
      ${iconBubble(ctx, "mdi:thermostat", activeStates.has(ctx.entity?.state ?? "") ? "red" : "blue")}
      ${heading(ctx, `${ctx.entity?.state ?? "unknown"} · ${current}°`)}
      <span class="climate-target">${target}°</span>
    </div>
    ${humidity ? html`<span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${stateLabel(humidity)}</span>` : nothing}
    ${ctx.config.show_controls ? html`<div class="ulm-controls">
      ${button("Decrease temperature", "mdi:minus", (event) => {
        event.stopPropagation();
        ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: Number(target) - 0.5 });
      })}
      ${button("Increase temperature", "mdi:plus", (event) => {
        event.stopPropagation();
        ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: Number(target) + 0.5 });
      })}
    </div>` : nothing}
  `);
};

const renderPerson = (ctx: RenderContext): TemplateResult => {
  const battery = linkedState(ctx, "battery_entity");
  const eta = linkedState(ctx, "eta_entity");
  const address = linkedState(ctx, "address_entity");
  const picture = ctx.config.icon_type === "entity-picture" || ctx.config.use_entity_picture
    ? attr(ctx.entity, "entity_picture")
    : undefined;
  const compact = ctx.config.variant === "small";
  return ctx.actionSurface(`ulm-row ulm-person ${compact ? "is-compact" : ""}`, html`
    ${picture ? html`<span class="person-picture" style=${`background-image:url("${String(picture)}")`}></span>` : iconBubble(ctx, "mdi:account", ctx.entity?.state === "home" ? "blue" : "green")}
    ${heading(ctx, [address ? stateLabel(address) : stateLabel(ctx.entity), eta ? `ETA ${stateLabel(eta)}` : ""].filter(Boolean).join(" · "))}
    ${compact ? nothing : battery ? html`<span class="battery-ring">${stateLabel(battery)}</span>` : html`<span class="presence-dot ${ctx.entity?.state === "home" ? "home" : "away"}"></span>`}
  `);
};

const renderBattery = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const charging = Boolean(attr(ctx.entity, "is_charging")) || String(ctx.entity?.state).includes("charging");
  const danger = configured<number>(ctx, "ulm_card_battery_battery_level_danger") ?? 20;
  const warning = configured<number>(ctx, "ulm_card_battery_battery_level_warning") ?? 50;
  const tone = value < danger ? "red" : value < warning ? "yellow" : "green";
  const animate = configured<boolean>(ctx, "ulm_card_battery_charging_animation") === true && charging;
  return ctx.actionSurface(`ulm-battery ${animate ? "is-charging" : ""}`, html`
    ${iconBubble(ctx, charging ? "mdi:battery-charging" : "mdi:battery", tone)}
    ${heading(ctx, charging ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(value)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, value))}%`}></i></span>
  `);
};

const sparkline = (ctx: RenderContext) => {
  const values = Array.isArray(attr(ctx.entity, "history"))
    ? (attr(ctx.entity, "history") as unknown[]).map(Number).filter(Number.isFinite).slice(-12)
    : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) =>
    `${(index / Math.max(1, values.length - 1)) * 100},${36 - ((value - min) / Math.max(1, max - min)) * 32}`).join(" ");
  return html`<svg class="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points=${points}></polyline></svg>`;
};

const renderMetric = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-metric", html`
  <div class="metric-heading">${iconBubble(ctx, ctx.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${heading(ctx, ctx.entity?.attributes.unit_of_measurement ? String(ctx.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${stateLabel(ctx.entity)}</span></div>
  ${ctx.config.show_graph !== false ? sparkline(ctx) : nothing}
  ${(linkedState(ctx, "min_entity") || linkedState(ctx, "max_entity")) ? html`<div class="metric-extremes"><span>Min ${stateLabel(linkedState(ctx, "min_entity"))}</span><span>Max ${stateLabel(linkedState(ctx, "max_entity"))}</span></div>` : nothing}
`);

const renderScene = (ctx: RenderContext): TemplateResult => {
  const scenes = (ctx.config.entities?.length ? ctx.config.entities : ctx.config.entity ? [ctx.config.entity] : []).slice(0, 6);
  return ctx.actionSurface("ulm-scenes", html`
    ${heading(ctx, `${scenes.length} scenes`)}
    <div class="scene-grid">${scenes.map((entityId) => html`
      <button class="scene-button" @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
        event.stopPropagation();
        ctx.service("scene", "turn_on", { entity_id: entityId });
      }}><ha-icon icon="mdi:palette"></ha-icon><span>${displayName({ type: "", entity: entityId }, ctx.hass.states[entityId])}</span></button>
    `)}</div>
  `);
};

const renderMedia = (ctx: RenderContext): TemplateResult => {
  const picture = configured<boolean>(ctx, "ulm_card_media_player_enable_art") === false
    ? undefined
    : attr(ctx.entity, "entity_picture");
  const consolePlatform = ctx.config.console_platform || ctx.config.variant;
  const consoleIcon = consolePlatform === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation";
  const controllable = ctx.config.entity?.startsWith("media_player.") === true;
  return ctx.actionSurface("ulm-media", html`
    ${picture ? html`<span class="media-art" style=${`background-image:url("${String(picture)}")`}></span>` : iconBubble(ctx, ctx.descriptor.upstreamId === "custom_card_playstation" ? consoleIcon : "mdi:play-circle", "purple")}
    ${heading(ctx, String(attr(ctx.entity, "media_title") ?? stateLabel(ctx.entity)))}
    ${controllable && (ctx.config.show_controls !== false || configured<boolean>(ctx, "ulm_card_media_player_enable_controls") === true) ? html`<div class="ulm-controls">
      ${button("Previous", "mdi:skip-previous", (event) => { event.stopPropagation(); ctx.service("media_player", "media_previous_track", { entity_id: ctx.config.entity }); })}
      ${button("Play or pause", "mdi:play-pause", (event) => { event.stopPropagation(); ctx.service("media_player", "media_play_pause", { entity_id: ctx.config.entity }); })}
      ${button("Next", "mdi:skip-next", (event) => { event.stopPropagation(); ctx.service("media_player", "media_next_track", { entity_id: ctx.config.entity }); })}
    </div>` : nothing}
    ${controllable && configured<boolean>(ctx, "ulm_card_media_player_enable_volume_slider") === true ? html`
      <input class="ulm-slider" type="range" min="0" max="100"
        .value=${String(Math.round(Number(attr(ctx.entity, "volume_level") ?? 0) * 100))}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) => ctx.service("media_player", "volume_set", {
          entity_id: ctx.config.entity,
          volume_level: Number((event.target as HTMLInputElement).value) / 100,
        })}>
    ` : nothing}
  `);
};

const renderCover = (ctx: RenderContext): TemplateResult => {
  const controllable = ctx.config.entity?.startsWith("cover.") === true;
  return ctx.actionSurface(`ulm-row ${configured<boolean>(ctx, "ulm_card_cover_enable_horizontal") ? "is-horizontal" : ""}`, html`
  ${iconBubble(ctx, "mdi:window-shutter", ctx.entity?.state === "open" ? "blue" : "grey")}
  ${heading(ctx, stateLabel(ctx.entity))}
  ${controllable && ctx.config.show_controls !== false ? html`<div class="ulm-controls">
    ${button("Open", "mdi:arrow-up", (event) => { event.stopPropagation(); ctx.service("cover", "open_cover", { entity_id: ctx.config.entity }); })}
    ${button("Stop", "mdi:stop", (event) => { event.stopPropagation(); ctx.service("cover", "stop_cover", { entity_id: ctx.config.entity }); })}
    ${button("Close", "mdi:arrow-down", (event) => { event.stopPropagation(); ctx.service("cover", "close_cover", { entity_id: ctx.config.entity }); })}
  </div>` : nothing}
  ${controllable && configured<boolean>(ctx, "ulm_card_cover_enable_slider") === true ? html`
    <input class="ulm-slider" type="range"
      min=${String(configured<number>(ctx, "ulm_card_cover_slider_min") ?? 0)}
      max=${String(configured<number>(ctx, "ulm_card_cover_slider_max") ?? 100)}
      .value=${String(attr(ctx.entity, "current_position") ?? 0)}
      @pointerdown=${(event: Event) => event.stopPropagation()}
      @change=${(event: Event) => ctx.service("cover", "set_cover_position", {
        entity_id: ctx.config.entity,
        position: Number((event.target as HTMLInputElement).value),
      })}>
  ` : nothing}
  `);
};

const renderVacuum = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-vacuum", html`
  ${iconBubble(ctx, "mdi:robot-vacuum", ctx.entity?.state === "cleaning" ? "blue" : "grey")}
  ${heading(ctx, stateLabel(ctx.entity))}
  <span class="metric-pill"><ha-icon icon="mdi:battery"></ha-icon>${String(attr(ctx.entity, "battery_level") ?? "—")}%</span>
  ${ctx.config.show_controls !== false ? html`<div class="ulm-controls">
    ${button("Start", "mdi:play", (event) => { event.stopPropagation(); ctx.service("vacuum", "start", { entity_id: ctx.config.entity }); })}
    ${button("Pause", "mdi:pause", (event) => { event.stopPropagation(); ctx.service("vacuum", "pause", { entity_id: ctx.config.entity }); })}
    ${button("Return home", "mdi:home-map-marker", (event) => { event.stopPropagation(); ctx.service("vacuum", "return_to_base", { entity_id: ctx.config.entity }); })}
  </div>` : nothing}
`);

const renderSecurity = (ctx: RenderContext): TemplateResult => {
  const armed = ctx.entity?.state.startsWith("armed") || ctx.entity?.state === "locked";
  return ctx.actionSurface(`ulm-security ${armed ? "is-armed" : ""}`, html`
    ${iconBubble(ctx, armed ? "mdi:shield-lock" : "mdi:shield-off", armed ? "green" : "red")}
    ${heading(ctx, stateLabel(ctx.entity))}
    ${ctx.config.show_controls ? html`<span class="security-status">${armed ? "Secured" : "Attention"}</span>` : nothing}
  `);
};

const renderNavigation = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-navigation", html`
  ${iconBubble(ctx, ctx.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${heading(ctx, ctx.config.secondary || ctx.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`);

const controlService = (entityId: string | undefined, action: "on" | "off"): [string, string] => {
  const domain = entityId?.split(".", 1)[0] ?? "homeassistant";
  if (domain === "script") return ["script", action === "on" ? "turn_on" : "turn_off"];
  if (domain === "fan") return ["fan", action === "on" ? "turn_on" : "turn_off"];
  if (domain === "water_heater") return ["water_heater", action === "on" ? "turn_on" : "turn_off"];
  return [domain === "input_boolean" ? "input_boolean" : "homeassistant", action === "on" ? "turn_on" : "turn_off"];
};

const renderControl = (ctx: RenderContext): TemplateResult => {
  const configuredControlEntity = configured<string>(
    ctx,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity",
  );
  const primaryDomain = ctx.config.entity?.split(".", 1)[0];
  const controlEntityId = configuredControlEntity || (
    ["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(primaryDomain ?? "")
      ? ctx.config.entity
      : undefined
  );
  const controlEntity = controlEntityId ? ctx.hass.states[controlEntityId] : undefined;
  const active = activeStates.has(controlEntity?.state ?? ctx.entity?.state ?? "");
  const consumption = linkedState(ctx, "graph_entity");
  const [domain, service] = controlService(controlEntityId, active ? "off" : "on");
  return ctx.actionSurface(`ulm-control-card ulm-row ${active ? "is-active" : ""}`, html`
    ${iconBubble(ctx, ctx.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", active ? "yellow" : "grey")}
    ${heading(ctx, consumption ? `${stateLabel(ctx.entity)} · ${stateLabel(consumption)}` : stateLabel(ctx.entity))}
    ${controlEntityId && ctx.config.show_controls !== false ? button(active ? "Turn off" : "Turn on", "mdi:power", (event) => {
      event.stopPropagation();
      ctx.service(domain, service, { entity_id: controlEntityId });
    }) : nothing}
  `);
};

const renderFan = (ctx: RenderContext): TemplateResult => {
  const active = ctx.entity?.state === "on";
  const percentage = numeric(attr(ctx.entity, "percentage")) ?? 0;
  const slider = configured<boolean>(ctx, "ulm_card_fan_enable_slider") === true;
  const oscillation = configured<boolean>(ctx, "ulm_card_fan_enable_button") === true;
  return ctx.actionSurface(`ulm-control-card ulm-fan ${active ? "is-active" : ""}`, html`
    <div class="ulm-row">
      ${iconBubble(ctx, "mdi:fan", active ? "blue" : "grey")}
      ${heading(ctx, `${stateLabel(ctx.entity)}${percentage ? ` · ${percentage}%` : ""}`)}
      ${button(active ? "Turn off" : "Turn on", "mdi:power", (event) => {
        event.stopPropagation();
        ctx.service("fan", active ? "turn_off" : "turn_on", { entity_id: ctx.config.entity });
      })}
    </div>
    ${slider ? html`<input class="ulm-slider" type="range"
      min=${String(configured<number>(ctx, "ulm_card_fan_slider_min") ?? 0)}
      max=${String(configured<number>(ctx, "ulm_card_fan_slider_max") ?? 100)}
      .value=${String(percentage)}
      @pointerdown=${(event: Event) => event.stopPropagation()}
      @change=${(event: Event) => ctx.service("fan", "set_percentage", {
        entity_id: ctx.config.entity,
        percentage: Number((event.target as HTMLInputElement).value),
      })}>` : nothing}
    ${oscillation ? html`<div class="ulm-controls">${button("Toggle oscillation", configured<string>(ctx, "ulm_card_fan_button_icon") ?? "mdi:rotate-3d-variant", (event) => {
      event.stopPropagation();
      ctx.service("fan", "oscillate", { entity_id: ctx.config.entity, oscillating: attr(ctx.entity, "oscillating") !== true });
    })}</div>` : nothing}
  `);
};

const renderRoom = (ctx: RenderContext): TemplateResult => {
  const entities = (ctx.config.entities ?? []).map((entityId) => ctx.hass.states[entityId]).filter(Boolean);
  return ctx.actionSurface("ulm-room", html`
    <div class="ulm-row">
      ${iconBubble(ctx, "mdi:sofa", activeStates.has(ctx.entity?.state ?? "") ? "yellow" : "blue")}
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    ${entities.length ? html`<div class="room-entities">${entities.map((entity) => html`
      <span class="metric-pill"><ha-icon .icon=${entity.attributes.icon ?? "mdi:circle-small"}></ha-icon>${stateLabel(entity)}</span>
    `)}</div>` : nothing}
  `);
};

const renderCamera = (ctx: RenderContext): TemplateResult => {
  const picture = attr(ctx.entity, "entity_picture");
  return ctx.actionSurface("ulm-camera", html`
    ${picture ? html`<img src=${String(picture)} alt=${displayName(ctx.config, ctx.entity)}>` : html`
      <div class="camera-placeholder">${iconBubble(ctx, "mdi:camera", "blue")}</div>
    `}
    <div class="camera-caption">${heading(ctx, stateLabel(ctx.entity))}</div>
  `);
};

const configuredEntities = (ctx: RenderContext): HassEntity[] => {
  const ids = Object.entries(ctx.config)
    .filter(([key, value]) =>
      typeof value === "string" &&
      value !== ctx.config.entity &&
      /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(key))
    .map(([, value]) => value as string);
  return [...new Set([...(ctx.config.entities ?? []), ...ids])]
    .map((entityId) => ctx.hass.states[entityId])
    .filter((entity): entity is HassEntity => Boolean(entity))
    .slice(0, 6);
};

const renderDetailCard = (ctx: RenderContext, iconName: string, tone = "blue"): TemplateResult => {
  const details = configuredEntities(ctx);
  return ctx.actionSurface("ulm-detail-card", html`
    <div class="ulm-row">
      ${iconBubble(ctx, iconName, tone)}
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    ${details.length ? html`<div class="detail-grid">${details.map((entity) => html`
      <span class="metric-pill"><ha-icon .icon=${entity.attributes.icon ?? "mdi:circle-small"}></ha-icon>${stateLabel(entity)}</span>
    `)}</div>` : nothing}
  `);
};

const renderScheduleCard = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  return ctx.actionSurface("ulm-schedule-card", html`
    <div class="ulm-row">
      ${iconBubble(ctx, /pollen/.test(ctx.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    <div class="schedule-list">${(details.length ? details : ctx.entity ? [ctx.entity] : []).slice(0, 4).map((entity) => html`
      <span><b>${displayName({ type: "", entity: entity.entity_id }, entity)}</b><small>${stateLabel(entity)}</small></span>
    `)}</div>
  `);
};

const renderDeviceStatus = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state);
  const details = configuredEntities(ctx);
  return ctx.actionSurface("ulm-device-status", html`
    <div class="ulm-row">
      ${iconBubble(ctx, /printer/.test(ctx.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(ctx.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(ctx.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", value !== undefined && value < 20 ? "red" : "blue")}
      ${heading(ctx, stateLabel(ctx.entity))}
      ${value !== undefined ? html`<b class="device-value">${Math.round(value)}${String(ctx.entity?.attributes.unit_of_measurement ?? "")}</b>` : nothing}
    </div>
    ${value !== undefined ? html`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, value))}%`}></i></span>` : nothing}
    ${details.length ? html`<div class="detail-grid">${details.map((entity) => html`<span class="metric-pill">${stateLabel(entity)}</span>`)}</div>` : nothing}
  `);
};

const renderInputNumber = (ctx: RenderContext): TemplateResult => {
  const min = numeric(attr(ctx.entity, "min")) ?? 0;
  const max = numeric(attr(ctx.entity, "max")) ?? 100;
  const value = numeric(ctx.entity?.state) ?? min;
  return ctx.actionSurface("ulm-helper-card", html`
    <div class="ulm-row">${iconBubble(ctx, "mdi:tune-variant", "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <input class="ulm-slider" type="range" .min=${String(min)} .max=${String(max)} .value=${String(value)}
      @pointerdown=${(event: Event) => event.stopPropagation()}
      @change=${(event: Event) => ctx.service("input_number", "set_value", {
        entity_id: ctx.config.entity,
        value: Number((event.target as HTMLInputElement).value),
      })}>
  `);
};

const renderGauge = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const min = configured<number>(ctx, "ulm_card_gauge_min", "ulm_custom_card_mpse_gauge_min") ?? 0;
  const max = configured<number>(ctx, "ulm_card_gauge_max", "ulm_custom_card_mpse_gauge_max") ?? 100;
  const percentage = Math.max(0, Math.min(100, ((value - min) / Math.max(1, max - min)) * 100));
  return ctx.actionSurface("ulm-gauge-card", html`
    <span class="gauge-ring" style=${`--gauge:${percentage * 3.6}deg`}><b>${stateLabel(ctx.entity)}</b></span>
    ${heading(ctx, `${min} – ${max}`)}
  `);
};

const renderAlarmTime = (ctx: RenderContext): TemplateResult => {
  const time = linkedState(ctx, "datetime_entity");
  return ctx.actionSurface(`ulm-control-card ulm-row ${activeStates.has(ctx.entity?.state ?? "") ? "is-active" : ""}`, html`
    ${iconBubble(ctx, "mdi:alarm", activeStates.has(ctx.entity?.state ?? "") ? "yellow" : "grey")}
    ${heading(ctx, time ? stateLabel(time) : stateLabel(ctx.entity))}
    ${ctx.config.show_controls !== false ? button(activeStates.has(ctx.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (event) => {
      event.stopPropagation();
      ctx.service("input_boolean", activeStates.has(ctx.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: ctx.config.entity });
    }) : nothing}
  `);
};

const renderDoor = (ctx: RenderContext): TemplateResult => {
  const lock = linkedState(ctx, "lock_entity");
  const battery = linkedState(ctx, "battery_entity");
  const locked = lock?.state === "locked";
  return ctx.actionSurface("ulm-row ulm-door", html`
    ${iconBubble(ctx, locked ? "mdi:door-closed-lock" : "mdi:door-open", locked ? "green" : "red")}
    ${heading(ctx, [stateLabel(ctx.entity), lock ? stateLabel(lock) : "", battery ? stateLabel(battery) : ""].filter(Boolean).join(" · "))}
    ${lock && ctx.config.show_controls !== false ? button(locked ? "Unlock" : "Lock", locked ? "mdi:lock-open" : "mdi:lock", (event) => {
      event.stopPropagation();
      ctx.service("lock", locked ? "unlock" : "lock", { entity_id: ctx.config.lock_entity });
    }) : nothing}
  `);
};

const renderGeneric = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-row", html`
  ${iconBubble(ctx, "mdi:information-outline", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
  ${heading(ctx, ctx.config.secondary || stateLabel(ctx.entity))}
`);

const renderGenericSwap = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-row ulm-generic-swap", html`
  ${heading(ctx, ctx.config.secondary || stateLabel(ctx.entity))}
  ${iconBubble(ctx, "mdi:information-outline", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
`);

const renderTitle = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-title", html`
  ${ctx.config.icon ? iconBubble(ctx, "mdi:format-title", "blue") : nothing}
  ${heading(ctx, ctx.config.secondary)}
`);

const renderVerticalButton = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-vertical-button", html`
  ${iconBubble(ctx, "mdi:gesture-tap-button", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
  ${heading(ctx, ctx.config.secondary || stateLabel(ctx.entity))}
`);

const renderBinary = (ctx: RenderContext, alert = false): TemplateResult => {
  const active = ctx.entity?.state === "on";
  const showLastChanged = configured<boolean>(ctx,
    alert ? "ulm_card_binary_sensor_alert_show_last_changed" : "ulm_card_binary_sensor_show_last_changed") === true;
  return ctx.actionSurface(`ulm-row ulm-binary ${active ? "is-active" : ""} ${alert && active ? "is-alert" : ""}`, html`
    ${iconBubble(ctx, alert && active ? "mdi:alert" : "mdi:radiobox-marked", active ? (alert ? "red" : "blue") : "grey")}
    ${heading(ctx, showLastChanged && ctx.entity?.last_changed ? new Date(ctx.entity.last_changed).toLocaleString() : stateLabel(ctx.entity))}
    ${alert && active ? html`<span class="security-status">Alert</span>` : nothing}
  `);
};

const renderChip = (ctx: RenderContext): TemplateResult => {
  const id = ctx.descriptor.upstreamId;
  const tone = ctx.descriptor.family === "security" ? "red"
    : ctx.descriptor.family === "weather" ? "yellow"
    : ctx.descriptor.family === "battery" ? "green"
    : ctx.descriptor.family === "energy" ? "blue"
    : "grey";
  if (id === "chip_navigate" && ctx.config.variant === "back") {
    return ctx.actionSurface("ulm-chip chip-navigation", html`${iconBubble(ctx, "mdi:arrow-left", "blue")}<span>${displayName(ctx.config, ctx.entity)}</span>`);
  }
  if (/short_date|weather_date|nik_clock/.test(id)) {
    return ctx.actionSurface("ulm-chip chip-date", html`${iconBubble(ctx, "mdi:calendar-clock", tone)}<span>${new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date())}</span>`);
  }
  if (/icon_only|mdi_icon_only/.test(id)) {
    return ctx.actionSurface("ulm-chip chip-icon-only", html`${iconBubble(ctx, "mdi:circle-small", tone)}`);
  }
  if (id === "chip_icon_double_state") {
    const second = linkedState(ctx, "graph_entity");
    return ctx.actionSurface("ulm-chip chip-double-state", html`${iconBubble(ctx, "mdi:circle-small", tone)}<b>${stateLabel(ctx.entity)}</b><b>${stateLabel(second)}</b>`);
  }
  if (/temperature|simple_temp|tesla_temperature/.test(id)) {
    return ctx.actionSurface("ulm-chip chip-temperature", html`${iconBubble(ctx, "mdi:thermometer", tone)}<b>${stateLabel(ctx.entity)}</b>`);
  }
  if (/presence|person/.test(id)) {
    return ctx.actionSurface("ulm-chip chip-presence", html`${iconBubble(ctx, "mdi:account", ctx.entity?.state === "home" ? "blue" : "grey")}<span>${displayName(ctx.config, ctx.entity)}</span>`);
  }
  return ctx.actionSurface(`ulm-chip chip-${ctx.descriptor.family}`, html`${iconBubble(ctx, "mdi:circle-small", tone)}<span>${displayName(ctx.config, ctx.entity)}</span>${ctx.config.show_state === false ? nothing : html`<b>${stateLabel(ctx.entity)}</b>`}`);
};

export const renderByFamily = (ctx: RenderContext): TemplateResult => {
  if (ctx.descriptor.kind === "chip") return renderChip(ctx);
  switch (ctx.descriptor.upstreamId) {
    case "card_binary_sensor": return renderBinary(ctx, ctx.config.variant === "alert");
    case "card_title": return renderTitle(ctx);
    case "card_vertical_button": return renderVerticalButton(ctx);
    case "card_generic": return ctx.config.variant === "swapped" ? renderGenericSwap(ctx) : renderGeneric(ctx);
    case "custom_card_input_datetime": return renderDetailCard(ctx, "mdi:calendar-clock", "blue");
    case "card_room":
    case "custom_card_esh_room":
    case "custom_card_drealine_roomview": return renderRoom(ctx);
  }
  if (/afval|waste_collection|pollen/.test(ctx.descriptor.upstreamId)) return renderScheduleCard(ctx);
  if (/printer|nik_nas|nik_tablet|haven_washer|homeassistant_updates|neekster_update/.test(ctx.descriptor.upstreamId)) return renderDeviceStatus(ctx);
  if (ctx.descriptor.upstreamId === "custom_card_input_number") return renderInputNumber(ctx);
  if (/gauge/.test(ctx.descriptor.upstreamId)) return renderGauge(ctx);
  if (/schumijo_(car|flower)|irmajavi_entities|damix48_power_details/.test(ctx.descriptor.upstreamId)) {
    return renderDetailCard(ctx, /car/.test(ctx.descriptor.upstreamId) ? "mdi:car" : /flower/.test(ctx.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  }
  switch (ctx.descriptor.family) {
    case "weather": return renderWeather(ctx);
    case "climate": return renderClimate(ctx);
    case "light": return renderLight(ctx);
    case "scene": return renderScene(ctx);
    case "presence": return renderPerson(ctx);
    case "battery": return renderBattery(ctx);
    case "energy":
    case "sensor": return renderMetric(ctx);
    case "media": return renderMedia(ctx);
    case "cover": return renderCover(ctx);
    case "vacuum": return renderVacuum(ctx);
    case "security": return renderSecurity(ctx);
    case "navigation": return renderNavigation(ctx);
    case "control": return ctx.config.entity?.startsWith("fan.") ? renderFan(ctx) : renderControl(ctx);
    case "alarm-time": return renderAlarmTime(ctx);
    case "door": return renderDoor(ctx);
    case "camera": return renderCamera(ctx);
    default: return renderGeneric(ctx);
  }
};
