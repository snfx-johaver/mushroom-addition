import { html, nothing, type TemplateResult } from "lit";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant, WeatherForecast } from "./types";
import { activeStates, displayName, stateLabel } from "./helpers";

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
const icon = (ctx: RenderContext, fallback: string): string =>
  ctx.config.icon || ctx.entity?.attributes.icon || fallback;
const iconBubble = (ctx: RenderContext, fallback: string, tone = "blue") => html`
  <span class="ulm-icon tone-${tone}"><ha-icon .icon=${icon(ctx, fallback)}></ha-icon></span>
`;
const heading = (ctx: RenderContext, secondary?: string) => html`
  <span class="ulm-copy">
    <span class="ulm-name">${displayName(ctx.config, ctx.entity)}</span>
    ${secondary ? html`<span class="ulm-label">${secondary}</span>` : nothing}
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
  return ctx.actionSurface("ulm-weather", html`
    <div class="weather-main">
      <span class="ulm-icon weather-icon tone-${tone}"><ha-icon .icon=${weatherIcon}></ha-icon></span>
      <div class="weather-summary">
        <span class="weather-temp">${temperature}</span>
        <span class="ulm-name">${displayName(ctx.config, ctx.entity)}</span>
        <span class="ulm-label weather-condition">${condition.replaceAll("-", " ")}</span>
        ${forecast[0] ? html`<span class="weather-extrema">H ${String(forecast[0].temperature ?? "—")}° · L ${String(forecast[0].templow ?? forecast[0].temperature_low ?? "—")}°</span>` : nothing}
      </div>
    </div>
    <div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${humidity}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${temperature}</span>
    </div>
    ${ctx.config.show_forecast && forecast.length ? html`
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
  return ctx.actionSurface(`ulm-row ulm-light ${on ? "is-active" : ""}`, html`
    ${iconBubble(ctx, "mdi:lightbulb", on ? "yellow" : "grey")}
    ${heading(ctx, percent === undefined ? stateLabel(ctx.entity) : `${percent}%`)}
    ${ctx.config.show_controls ? html`
      <input class="ulm-slider" type="range" min="0" max="100" .value=${String(percent ?? 0)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) => ctx.service("light", "turn_on", { entity_id: ctx.config.entity, brightness_pct: Number((event.target as HTMLInputElement).value) })}>
    ` : nothing}
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
  const picture = ctx.config.use_entity_picture ? attr(ctx.entity, "entity_picture") : undefined;
  return ctx.actionSurface("ulm-row ulm-person", html`
    ${picture ? html`<span class="person-picture" style=${`background-image:url("${String(picture)}")`}></span>` : iconBubble(ctx, "mdi:account", ctx.entity?.state === "home" ? "blue" : "green")}
    ${heading(ctx, [address ? stateLabel(address) : stateLabel(ctx.entity), eta ? `ETA ${stateLabel(eta)}` : ""].filter(Boolean).join(" · "))}
    ${battery ? html`<span class="battery-ring">${stateLabel(battery)}</span>` : html`<span class="presence-dot ${ctx.entity?.state === "home" ? "home" : "away"}"></span>`}
  `);
};

const renderBattery = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const charging = Boolean(attr(ctx.entity, "is_charging")) || String(ctx.entity?.state).includes("charging");
  const tone = value < 20 ? "red" : value < 50 ? "yellow" : "green";
  return ctx.actionSurface("ulm-battery", html`
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
  const picture = attr(ctx.entity, "entity_picture");
  const consolePlatform = ctx.config.console_platform || ctx.config.variant;
  const consoleIcon = consolePlatform === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation";
  return ctx.actionSurface("ulm-media", html`
    ${picture ? html`<span class="media-art" style=${`background-image:url("${String(picture)}")`}></span>` : iconBubble(ctx, ctx.descriptor.upstreamId === "custom_card_playstation" ? consoleIcon : "mdi:play-circle", "purple")}
    ${heading(ctx, String(attr(ctx.entity, "media_title") ?? stateLabel(ctx.entity)))}
    ${ctx.config.show_controls !== false ? html`<div class="ulm-controls">
      ${button("Previous", "mdi:skip-previous", (event) => { event.stopPropagation(); ctx.service("media_player", "media_previous_track", { entity_id: ctx.config.entity }); })}
      ${button("Play or pause", "mdi:play-pause", (event) => { event.stopPropagation(); ctx.service("media_player", "media_play_pause", { entity_id: ctx.config.entity }); })}
      ${button("Next", "mdi:skip-next", (event) => { event.stopPropagation(); ctx.service("media_player", "media_next_track", { entity_id: ctx.config.entity }); })}
    </div>` : nothing}
  `);
};

const renderCover = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-row", html`
  ${iconBubble(ctx, "mdi:window-shutter", ctx.entity?.state === "open" ? "blue" : "grey")}
  ${heading(ctx, stateLabel(ctx.entity))}
  ${ctx.config.show_controls !== false ? html`<div class="ulm-controls">
    ${button("Open", "mdi:arrow-up", (event) => { event.stopPropagation(); ctx.service("cover", "open_cover", { entity_id: ctx.config.entity }); })}
    ${button("Stop", "mdi:stop", (event) => { event.stopPropagation(); ctx.service("cover", "stop_cover", { entity_id: ctx.config.entity }); })}
    ${button("Close", "mdi:arrow-down", (event) => { event.stopPropagation(); ctx.service("cover", "close_cover", { entity_id: ctx.config.entity }); })}
  </div>` : nothing}
`);

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
  const active = activeStates.has(ctx.entity?.state ?? "");
  const consumption = linkedState(ctx, "graph_entity");
  const [domain, service] = controlService(ctx.config.entity, active ? "off" : "on");
  return ctx.actionSurface(`ulm-control-card ulm-row ${active ? "is-active" : ""}`, html`
    ${iconBubble(ctx, ctx.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", active ? "yellow" : "grey")}
    ${heading(ctx, consumption ? `${stateLabel(ctx.entity)} · ${stateLabel(consumption)}` : stateLabel(ctx.entity))}
    ${ctx.config.show_controls !== false ? button(active ? "Turn off" : "Turn on", "mdi:power", (event) => {
      event.stopPropagation();
      ctx.service(domain, service, { entity_id: ctx.config.entity });
    }) : nothing}
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

export const renderByFamily = (ctx: RenderContext): TemplateResult => {
  if (ctx.descriptor.kind === "chip") {
    const chipTone = ctx.descriptor.family === "security" ? "red"
      : ctx.descriptor.family === "weather" ? "yellow"
      : ctx.descriptor.family === "battery" ? "green"
      : ctx.descriptor.family === "energy" ? "blue"
      : "grey";
    return ctx.actionSurface(`ulm-chip chip-${ctx.descriptor.family}`, html`${iconBubble(ctx, "mdi:circle-small", chipTone)}<span>${displayName(ctx.config, ctx.entity)}</span>${ctx.config.show_state === false ? nothing : html`<b>${stateLabel(ctx.entity)}</b>`}`);
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
    case "control": return renderControl(ctx);
    case "alarm-time": return renderAlarmTime(ctx);
    case "door": return renderDoor(ctx);
    default: return renderGeneric(ctx);
  }
};
