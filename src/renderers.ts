import { html, nothing, type TemplateResult } from "lit";
import type { AdditionConfig, AdditionItemConfig, CatalogItem, HassEntity, HomeAssistant, WeatherForecast } from "./types";
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
const valueThenName = (ctx: RenderContext, value = stateLabel(ctx.entity)) => html`
  <span class="ulm-copy value-first">
    <span class="ulm-name">${value}</span>
    <span class="ulm-label">${displayName(ctx.config, ctx.entity)}</span>
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
  if (!native) {
    const first = forecast[0];
    const high = first?.temperature ?? attr(ctx.entity, "temperature");
    const low = first?.templow ?? first?.temperature_low ?? "—";
    const wind = attr(ctx.entity, "wind_speed") ?? "—";
    const windUnit = attr(ctx.entity, "wind_speed_unit") ?? "";
    return ctx.actionSurface("ulm-weather legacy-weather", html`
      <div class="legacy-weather-current">
        <ha-icon .icon=${weatherIcon}></ha-icon>
        <span><b>${temperature}</b><small>${condition.replaceAll("-", " ")}</small></span>
      </div>
      <div class="legacy-weather-details">
        <b>${String(low)}° / ${String(high)}°</b>
        <span><ha-icon icon="mdi:weather-windy"></ha-icon>${String(wind)} ${String(windUnit)}</span>
      </div>
    `);
  }
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
    <div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${humidity}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${temperature}</span>
    </div>
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

const renderDefaultBattery = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const charging = Boolean(attr(ctx.entity, "is_charging"));
  const danger = configured<number>(ctx, "ulm_card_battery_battery_level_danger") ?? 20;
  const warning = configured<number>(ctx, "ulm_card_battery_battery_level_warning") ?? 50;
  const tone = value < danger ? "red" : value < warning ? "yellow" : "green";
  return ctx.actionSurface("ulm-row ulm-default-battery", html`
    ${iconBubble(ctx, charging ? "mdi:battery-charging" : "mdi:battery", tone)}
    ${valueThenName(ctx, `${Math.round(value)}%`)}
  `);
};

const configuredColor = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  if (/^(?:#|rgb|hsl|var\(|color\()/i.test(value)) return value;
  return `rgba(var(--color-${value}), 1)`;
};

const renderBarCard = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const min = numeric(configured(ctx, "ulm_custom_card_bar_card_min")) ?? 0;
  const max = numeric(configured(ctx, "ulm_custom_card_bar_card_max")) ?? 100;
  const range = max - min;
  const percentage = range > 0 ? Math.max(0, Math.min(100, ((value - min) / range) * 100)) : 0;
  const showHeader = configured<boolean>(ctx, "ulm_custom_card_bar_card_show_icon") !== false;
  const showValue = configured<boolean>(ctx, "ulm_custom_card_bar_card_value") === true;
  const showIndicator = configured<boolean>(ctx, "ulm_custom_card_bar_card_indicator") === true;
  const barColor = configuredColor(
    configured<string>(ctx, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)",
  );
  const iconColor = configuredColor(
    configured<string>(ctx, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)",
  );
  const barIcon = configured<string>(ctx, "ulm_custom_card_bar_card_icon") ||
    ctx.config.icon || ctx.entity?.attributes.icon || "mdi:chart-bar";
  const name = configured<string>(ctx, "ulm_custom_card_bar_card_name") ||
    displayName(ctx.config, ctx.entity);
  const valueText = stateLabel(ctx.entity);
  return ctx.actionSurface(`minimalist-bar-card ${showHeader ? "has-header" : "bar-only"}`, html`
    ${showHeader ? html`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${iconColor}`}>
          <ha-icon .icon=${barIcon}></ha-icon>
        </span>
        <span class="bar-card-copy">
          <b class="bar-card-primary-value">${valueText}</b>
          <span class="bar-card-name">${name}</span>
        </span>
      </div>
    ` : nothing}
    <div class="bar-card-track" style=${`--bar-fill:${barColor}`}>
      <span class="bar-card-fill" style=${`width:${percentage}%`}></span>
      ${showIndicator ? html`<span class="bar-card-indicator" style=${`left:${percentage}%`}></span>` : nothing}
      ${showValue ? html`<b class="bar-card-inside-value">${valueText}</b>` : nothing}
    </div>
  `);
};

const sparkline = (ctx: RenderContext, filled = false) => {
  const values = Array.isArray(attr(ctx.entity, "history"))
    ? (attr(ctx.entity, "history") as unknown[]).map(Number).filter(Number.isFinite).slice(-12)
    : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) =>
    `${(index / Math.max(1, values.length - 1)) * 100},${36 - ((value - min) / Math.max(1, max - min)) * 32}`).join(" ");
  const area = `0,40 ${points} 100,40`;
  return html`<svg class="sparkline ${filled ? "is-filled" : ""}" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${filled ? html`<polygon points=${area}></polygon>` : nothing}
    <polyline points=${points}></polyline>
  </svg>`;
};

const renderMetric = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-metric", html`
  <div class="metric-heading">${iconBubble(ctx, ctx.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${heading(ctx, ctx.entity?.attributes.unit_of_measurement ? String(ctx.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${stateLabel(ctx.entity)}</span></div>
  ${ctx.config.show_graph !== false ? sparkline(ctx) : nothing}
  ${(linkedState(ctx, "min_entity") || linkedState(ctx, "max_entity")) ? html`<div class="metric-extremes"><span>Min ${stateLabel(linkedState(ctx, "min_entity"))}</span><span>Max ${stateLabel(linkedState(ctx, "max_entity"))}</span></div>` : nothing}
`);

const runItemAction = (ctx: RenderContext, item: AdditionItemConfig): void => {
  const action = item.tap_action;
  const service = action?.service ?? action?.perform_action;
  if ((action?.action === "call-service" || action?.action === "perform-action") && service) {
    const [domain, serviceName] = service.split(".", 2);
    if (domain && serviceName) {
      ctx.service(domain, serviceName, {
        entity_id: item.entity,
        ...(action.service_data ?? action.data ?? {}),
      });
      return;
    }
  }
  ctx.service("scene", "turn_on", { entity_id: item.entity });
};

const renderScene = (ctx: RenderContext): TemplateResult => {
  const sceneItems: AdditionItemConfig[] = (
    ctx.config.scene_items?.length
      ? ctx.config.scene_items
      : (ctx.config.entities?.length ? ctx.config.entities : ctx.config.entity ? [ctx.config.entity] : [])
        .map((entity) => ({ entity }))
  ).filter((item) => item.entity).slice(0, 6);
  const welcome = ctx.descriptor.upstreamId === "card_welcome_scenes";
  const collapseEntity = ctx.config.collapse_entity ? ctx.hass.states[ctx.config.collapse_entity] : undefined;
  const collapsed = ctx.config.collapsed === true || collapseEntity?.state === "on";
  return ctx.actionSurface(`ulm-scenes ${welcome ? "welcome-scenes" : "scene-pills"}`, html`
    ${welcome ? html`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
          event.stopPropagation();
          if (ctx.config.collapse_entity) {
            ctx.service("input_boolean", "toggle", { entity_id: ctx.config.collapse_entity });
          }
        }}><ha-icon .icon=${collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date("2026-02-18"))}</span>
        <span class="welcome-toolbar-button"><ha-icon icon="mdi:cog"></ha-icon></span>
      </div>
      <div class="welcome-heading"><b>${ctx.config.name || "Good day!"}</b><span>${ctx.config.secondary || "Scenes"}</span></div>
    ` : nothing}
    ${collapsed ? nothing : html`<div class="scene-grid">${sceneItems.map((item) => {
      const entity = ctx.hass.states[item.entity];
      const active = entity?.state === (item.active_state || "on") || entity?.state === "playing";
      const color = configuredColor(item.color, "rgb(var(--ulm-purple))");
      return html`
      <button class="scene-button" @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
        event.stopPropagation();
        runItemAction(ctx, item);
      }} style=${`--item-color:${color}`} class="scene-button ${active ? "is-active" : ""}">
        <i><ha-icon .icon=${item.icon || entity?.attributes.icon || "mdi:palette"}></ha-icon></i>
        <span>${item.name || displayName({ type: "", entity: item.entity }, entity)}</span>
      </button>`;
    })}</div>`}
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
  return ctx.actionSurface(`ulm-cover ${configured<boolean>(ctx, "ulm_card_cover_enable_horizontal") ? "is-horizontal" : ""}`, html`
  <div class="ulm-row">
    ${iconBubble(ctx, "mdi:window-shutter", ctx.entity?.state === "open" ? "blue" : "grey")}
    ${heading(ctx, stateLabel(ctx.entity))}
  </div>
  ${controllable && ctx.config.show_controls !== false ? html`<div class="ulm-controls cover-controls">
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

const renderDefaultVacuum = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-default-vacuum", html`
  <div class="vacuum-summary">
    ${iconBubble(ctx, "mdi:robot-vacuum", ctx.entity?.state === "cleaning" ? "blue" : "grey")}
    ${heading(ctx, stateLabel(ctx.entity))}
    <span class="vacuum-battery">${String(attr(ctx.entity, "battery_level") ?? "—")}%</span>
  </div>
  <div class="vacuum-actions">
    ${button("Stop", "mdi:stop", (event) => { event.stopPropagation(); ctx.service("vacuum", "stop", { entity_id: ctx.config.entity }); })}
    ${button("Return home", "mdi:home", (event) => { event.stopPropagation(); ctx.service("vacuum", "return_to_base", { entity_id: ctx.config.entity }); })}
    ${button("Locate", "mdi:map-marker", (event) => { event.stopPropagation(); ctx.service("vacuum", "locate", { entity_id: ctx.config.entity }); })}
    ${button("Start", "mdi:robot-vacuum", (event) => { event.stopPropagation(); ctx.service("vacuum", "start", { entity_id: ctx.config.entity }); })}
  </div>
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

const renderDefaultNavigation = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-row ulm-default-navigation", html`
  ${iconBubble(ctx, ctx.config.icon || "mdi:navigation", "blue")}
  ${heading(ctx, ctx.config.secondary)}
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
    </div>
    ${slider ? html`<div class="ulm-fan-slider" style=${`--fan-level:${percentage}%`}>
      <i></i>
      <input type="range"
        min=${String(configured<number>(ctx, "ulm_card_fan_slider_min") ?? 0)}
        max=${String(configured<number>(ctx, "ulm_card_fan_slider_max") ?? 100)}
        .value=${String(percentage)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) => ctx.service("fan", "set_percentage", {
          entity_id: ctx.config.entity,
          percentage: Number((event.target as HTMLInputElement).value),
        })}>
    </div>` : nothing}
    ${oscillation ? html`<div class="ulm-controls">${button("Toggle oscillation", configured<string>(ctx, "ulm_card_fan_button_icon") ?? "mdi:rotate-3d-variant", (event) => {
      event.stopPropagation();
      ctx.service("fan", "oscillate", { entity_id: ctx.config.entity, oscillating: attr(ctx.entity, "oscillating") !== true });
    })}</div>` : nothing}
  `);
};

const renderRoom = (ctx: RenderContext): TemplateResult => {
  const sensorItems: AdditionItemConfig[] = (
    ctx.config.room_sensors?.length
      ? ctx.config.room_sensors
      : (ctx.config.entities ?? []).map((entity) => ({ entity }))
  ).filter((item) => item.entity).slice(0, 4);
  return ctx.actionSurface("ulm-room", html`
    <div class="room-main">
      ${heading(ctx, stateLabel(ctx.entity))}
      ${iconBubble(ctx, "mdi:sofa", activeStates.has(ctx.entity?.state ?? "") ? "yellow" : "blue")}
    </div>
    ${sensorItems.length ? html`<div class="room-entities">${sensorItems.map((item) => {
      const entity = ctx.hass.states[item.entity];
      const active = entity?.state === (item.active_state || "on");
      const color = configuredColor(item.color, "rgb(var(--ulm-blue))");
      return html`<button
        class="metric-pill room-sensor ${active ? "is-active" : ""}"
        style=${`--item-color:${color}`}
        aria-label=${item.name || displayName({ type: "", entity: item.entity }, entity)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => {
          event.stopPropagation();
          const action = item.tap_action;
          const service = action?.service ?? action?.perform_action;
          if (service) {
            const [domain, serviceName] = service.split(".", 2);
            if (domain && serviceName) ctx.service(domain, serviceName, { entity_id: item.entity, ...(action?.service_data ?? action?.data ?? {}) });
          }
        }}
      ><ha-icon .icon=${item.icon || entity?.attributes.icon || "mdi:circle-small"}></ha-icon><span>${item.name || stateLabel(entity)}</span></button>`;
    })}</div>` : nothing}
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

const entityFromConfig = (ctx: RenderContext, ...keys: string[]): HassEntity | undefined => {
  const entityId = configured<string>(ctx, ...keys);
  return entityId ? ctx.hass.states[entityId] : undefined;
};

const renderWasteCollection = (ctx: RenderContext): TemplateResult => {
  const rows = [
    ["Restafval", "mdi:trash-can", "ulm_card_datum_rest"],
    ["GFT", "mdi:leaf", "ulm_card_datum_gft"],
    ["Papier", "mdi:newspaper", "ulm_card_datum_papier"],
    ["PMD", "mdi:recycle", "ulm_card_datum_pmd"],
    ["Glas", "mdi:bottle-soda", "ulm_card_datum_glas"],
  ] as const;
  return ctx.actionSurface("custom-waste-card", html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, "mdi:trash-can-outline", "green")}
      ${heading(ctx, configured<string>(ctx, "ulm_volgende_ophaling") || "Next collection")}
    </div>
    <div class="waste-grid">${rows.map(([label, rowIcon, key]) => {
      const configuredValue = configured<string>(ctx, key);
      const entity = configuredValue ? ctx.hass.states[configuredValue] : undefined;
      const value = entity ? stateLabel(entity) : configuredValue || (label === "Restafval" ? stateLabel(ctx.entity) : "—");
      return html`<span class="waste-row"><ha-icon .icon=${rowIcon}></ha-icon><b>${label}</b><small>${value}</small></span>`;
    })}</div>
  `);
};

const renderAlarmTimeCard = (ctx: RenderContext): TemplateResult => {
  const timeEntity = entityFromConfig(ctx, "ulm_card_alarm_time_datetime") ?? linkedState(ctx, "datetime_entity");
  const step = numeric(configured(ctx, "ulm_card_alarm_time_step")) ?? 15;
  const current = timeEntity?.state || "00:00:00";
  const [hours, minutes] = current.split(":").map(Number);
  const setMinutes = (delta: number) => {
    const total = ((hours || 0) * 60 + (minutes || 0) + delta + 1440) % 1440;
    ctx.service("input_datetime", "set_datetime", {
      entity_id: timeEntity?.entity_id,
      time: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`,
    });
  };
  return ctx.actionSurface("custom-alarm-time", html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, configured<string>(ctx, "ulm_card_alarm_time_icon") || "mdi:alarm", "grey")}
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    <div class="alarm-time-controls">
      ${button(`Earlier by ${step} minutes`, "mdi:minus", (event) => { event.stopPropagation(); setMinutes(-step); })}
      <b>${current.slice(0, 5)}</b>
      ${button(`Later by ${step} minutes`, "mdi:plus", (event) => { event.stopPropagation(); setMinutes(step); })}
    </div>
  `);
};

const renderApexCharts = (ctx: RenderContext): TemplateResult => {
  const series = [ctx.entity, ...configuredEntities(ctx)].filter((entity): entity is HassEntity => Boolean(entity)).slice(0, 3);
  const colors = ["green", "red", "orange"];
  return ctx.actionSurface("custom-apexcharts", html`
    <div class="apex-legend">${series.map((entity, index) => html`
      <span class="apex-series tone-${colors[index]}">
        <i><ha-icon .icon=${entity.attributes.icon || ["mdi:download", "mdi:lan-pending", "mdi:upload"][index]}></ha-icon></i>
        <b>${displayName({ type: "", entity: entity.entity_id }, entity)}</b>
        <small>${stateLabel(entity)}</small>
      </span>
    `)}</div>
    <div class="apex-chart">${sparkline(ctx)}<span class="apex-grid-line line-1"></span><span class="apex-grid-line line-2"></span><span class="apex-grid-line line-3"></span></div>
  `);
};

const renderChromecast = (ctx: RenderContext): TemplateResult => ctx.actionSurface("custom-chromecast", html`
  <div class="custom-card-heading">
    ${iconBubble(ctx, "mdi:cast", "blue")}
    ${heading(ctx, stateLabel(ctx.entity))}
  </div>
  <div class="chromecast-controls">
    ${button("Power", "mdi:power", (event) => { event.stopPropagation(); ctx.service("media_player", ctx.entity?.state === "off" ? "turn_on" : "turn_off", { entity_id: ctx.config.entity }); })}
    ${button("Play or pause", "mdi:play", (event) => { event.stopPropagation(); ctx.service("media_player", "media_play_pause", { entity_id: ctx.config.entity }); })}
    ${button("Source", "mdi:video-input-hdmi", (event) => { event.stopPropagation(); })}
  </div>
`);

const renderPowerDetails = (ctx: RenderContext): TemplateResult => {
  const hours = numeric(configured(ctx, "ulm_card_power_details_hours")) ?? ctx.config.graph_hours ?? 2;
  return ctx.actionSurface("custom-power-details", html`
    <div class="power-details-heading">
      ${iconBubble(ctx, "mdi:flash", "grey")}
      ${heading(ctx, `${hours === 1 ? "In the last hour" : `In the last ${hours} hours`}`)}
    </div>
    <b class="power-details-value">${stateLabel(ctx.entity)}</b>
    <div class="power-details-chart">${sparkline(ctx, true)}</div>
  `);
};

const trackerIcon = (type: string | undefined): string =>
  type === "bluetooth" ? "mdi:bluetooth" : type === "wifi" ? "mdi:wifi" : "mdi:crosshairs-gps";

const renderDeviceTrackerCard = (ctx: RenderContext): TemplateResult => {
  const tracker1 = entityFromConfig(ctx, "ulm_custom_card_device_tracker_tracker_1_entity") ?? ctx.entity;
  const tracker2 = entityFromConfig(ctx, "ulm_custom_card_device_tracker_tracker_2_entity");
  const present = [tracker1, tracker2].filter(Boolean).some((entity) => entity?.state === "home");
  return ctx.actionSurface("custom-device-tracker", html`
    <span class="device-tracker-icon">
      <ha-icon .icon=${configured<string>(ctx, "ulm_custom_card_device_tracker_icon") || "mdi:cellphone"}></ha-icon>
      ${tracker1 ? html`<i class="tracker-badge tracker-one"><ha-icon .icon=${trackerIcon(configured(ctx, "ulm_custom_card_device_tracker_tracker_1_type"))}></ha-icon></i>` : nothing}
      ${tracker2 ? html`<i class="tracker-badge tracker-two"><ha-icon .icon=${trackerIcon(configured(ctx, "ulm_custom_card_device_tracker_tracker_2_type"))}></ha-icon></i>` : nothing}
    </span>
    <span class="ulm-copy"><b class="ulm-name">${displayName(ctx.config, ctx.entity)}</b><span class="ulm-label">${present ? "Present" : stateLabel(ctx.entity)}</span></span>
  `);
};

const renderRoomView = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  const humidity = details.find((entity) => entity.entity_id.includes("humidity"));
  const light = details.find((entity) => entity.entity_id.startsWith("light."));
  const presence = details.find((entity) => entity.entity_id.startsWith("binary_sensor."));
  return ctx.actionSurface("custom-room-view", html`
    <div class="room-view-summary">
      <span class="room-view-icon"><ha-icon icon="mdi:sofa"></ha-icon><i>!</i></span>
      <span><b>${stateLabel(ctx.entity)}</b>${humidity ? html`<small><ha-icon icon="mdi:water-percent"></ha-icon>${stateLabel(humidity)}</small>` : nothing}</span>
    </div>
    <div class="room-view-status"><ha-icon icon="mdi:door"></ha-icon>${presence?.state === "on" ? html`<i>1</i>` : nothing}</div>
    <div class="room-view-actions">
      <span><ha-icon icon="mdi:lightbulb-off"></ha-icon></span>
      <span class=${light?.state === "on" ? "is-active" : ""}><ha-icon icon="mdi:lightbulb"></ha-icon>${light?.state === "on" ? html`<i>1</i>` : nothing}</span>
      <span><ha-icon icon="mdi:television"></ha-icon><i>1</i></span>
    </div>
  `);
};

const relativeDuration = (entity: HassEntity | undefined): string => {
  const raw = entity?.state;
  if (!raw || (!raw.includes("-") && !raw.includes("T"))) return stateLabel(entity);
  const then = raw ? Date.parse(raw) : Number.NaN;
  if (Number.isFinite(then)) {
    const minutes = Math.max(0, Math.floor((Date.now() - then) / 60_000));
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ${hours % 24} hours ago`;
  }
  return stateLabel(entity);
};

const renderElapsedTime = (ctx: RenderContext): TemplateResult => ctx.actionSurface("custom-elapsed-time", html`
  ${iconBubble(ctx, "mdi:timer-sand", "grey")}
  <span class="ulm-copy"><b class="ulm-name">${displayName(ctx.config, ctx.entity)}</b><span class="ulm-label">${relativeDuration(ctx.entity)}</span></span>
`);

const renderErayLock = (ctx: RenderContext): TemplateResult => {
  const door = entityFromConfig(ctx, "ulm_custom_card_eraycetinay_lock_door_open");
  const battery = entityFromConfig(ctx, "ulm_custom_card_eraycetinay_lock_battery_level") ?? linkedState(ctx, "battery_entity");
  const locked = ctx.entity?.state === "locked";
  const low = numeric(battery?.state) !== undefined && Number(battery?.state) <= (numeric(configured(ctx, "ulm_custom_card_eraycetinay_lock_battery_warning")) ?? 20);
  return ctx.actionSurface(`custom-eray-lock ${locked ? "is-locked" : "is-unlocked"}`, html`
    <span class="eray-lock-icon"><ha-icon .icon=${locked ? "mdi:lock" : "mdi:lock-open"}></ha-icon>
      ${door?.state === "on" ? html`<i class="door-badge"><ha-icon icon="mdi:door-open"></ha-icon></i>` : nothing}
      ${low ? html`<i class="battery-badge"><ha-icon icon="mdi:battery-alert"></ha-icon></i>` : nothing}
    </span>
    ${heading(ctx, stateLabel(ctx.entity))}
  `);
};

const renderEshWelcome = (ctx: RenderContext): TemplateResult => {
  const items = configuredEntities(ctx).slice(0, 5);
  const defaults = [
    ["mdi:home", "House", "blue"],
    ["mdi:lightbulb", "Lights", "yellow"],
    ["mdi:shield", "Secure", "green"],
    ["mdi:radiator", "Climate", "purple"],
    ["mdi:flask", "Lab", "red"],
  ];
  return ctx.actionSurface("custom-esh-welcome", html`
    <div class="esh-welcome-toolbar">
      <span><ha-icon icon="mdi:chevron-up"></ha-icon></span>
      <span><ha-icon icon="mdi:thermometer"></ha-icon></span>
      <span><ha-icon icon="mdi:cog"></ha-icon></span>
    </div>
    <b class="esh-greeting">Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},<br>${ctx.config.name || displayName(ctx.config, ctx.entity)}!</b>
    <div class="esh-welcome-items">${defaults.map(([itemIcon, label, tone], index) => html`
      <span class="tone-${tone}"><i><ha-icon .icon=${items[index]?.attributes.icon || itemIcon}></ha-icon></i><small>${items[index] ? displayName({ type: "", entity: items[index].entity_id }, items[index]) : label}</small></span>
    `)}</div>
  `);
};

const renderWasher = (ctx: RenderContext): TemplateResult => {
  const progress = entityFromConfig(ctx, "ulm_custom_card_washer_job_progress");
  const job = entityFromConfig(ctx, "ulm_custom_card_washer_job_state");
  const remote = entityFromConfig(ctx, "ulm_custom_card_washer_remote_control");
  const running = /run|wash|dry/i.test(job?.state || ctx.entity?.state || "");
  const percent = numeric(progress?.state) ?? (running ? 45 : 0);
  const stages = ["mdi:water-boiler", "mdi:waves", "mdi:water", "mdi:fan"];
  return ctx.actionSurface("custom-washer", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:washing-machine", "blue")}${heading(ctx, job ? stateLabel(job) : stateLabel(ctx.entity))}</div>
    <div class="washer-stages">${stages.map((stage, index) => html`<span class=${percent >= index * 25 ? "is-active" : ""}><ha-icon .icon=${stage}></ha-icon></span>`)}</div>
    <div class="washer-controls">
      ${button("Pause", "mdi:pause", (event) => { event.stopPropagation(); })}
      ${button("Stop", "mdi:stop", (event) => { event.stopPropagation(); })}
      ${button("Delay start", "mdi:alarm", (event) => { event.stopPropagation(); })}
    </div>
    ${remote ? html`<span class="washer-remote">${stateLabel(remote)}</span>` : nothing}
  `);
};

const renderHeatPump = (ctx: RenderContext): TemplateResult => {
  const target = numeric(attr(ctx.entity, "temperature")) ?? 20;
  const step = numeric(attr(ctx.entity, "target_temp_step")) ?? 0.5;
  const modes = [
    ["off", "mdi:power"], ["heat", "mdi:fire"], ["cool", "mdi:snowflake"],
    ["heat_cool", "mdi:sync"], ["dry", "mdi:water"], ["fan_only", "mdi:fan"],
  ];
  return ctx.actionSurface("custom-heat-pump", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:thermostat", ctx.entity?.state === "heat" ? "red" : "grey")}${heading(ctx, `${attr(ctx.entity, "current_temperature") ?? "—"}° · ${attr(ctx.entity, "hvac_action") ?? stateLabel(ctx.entity)}`)}</div>
    <div class="heat-pump-target">
      ${button("Decrease temperature", "mdi:arrow-down", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: target - step }); })}
      <b>${target}°C</b>
      ${button("Increase temperature", "mdi:arrow-up", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: target + step }); })}
    </div>
    <div class="heat-pump-modes">${modes.map(([mode, modeIcon]) => html`
      <button class=${ctx.entity?.state === mode ? "is-active" : ""} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
        event.stopPropagation();
        ctx.service("climate", "set_hvac_mode", { entity_id: ctx.config.entity, hvac_mode: mode });
      }}><ha-icon .icon=${modeIcon}></ha-icon></button>
    `)}</div>
  `);
};

const updateEntityFor = (ctx: RenderContext, key: string, needle: string): HassEntity | undefined =>
  entityFromConfig(ctx, key) ??
  Object.values(ctx.hass.states).find((entity) => entity.entity_id.startsWith("update.") && entity.entity_id.includes(needle));

const renderHomeAssistantUpdates = (ctx: RenderContext): TemplateResult => {
  const rows = [
    ["Supervisor", updateEntityFor(ctx, "ulm_card_homeassistant_supervisor", "supervisor")],
    ["Core", entityFromConfig(ctx, "ulm_card_homeassistant_core") ?? ctx.entity],
    ["OS", updateEntityFor(ctx, "ulm_card_homeassistant_os", "operating_system")],
  ] as const;
  const hasUpdate = rows.some(([, entity]) => entity?.state === "on");
  return ctx.actionSurface("custom-ha-updates", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:home-assistant", hasUpdate ? "blue" : "grey")}${heading(ctx, hasUpdate ? "Updates available" : "No updates available")}</div>
    <div class="ha-update-list">${rows.map(([label, entity]) => html`
      <span><b>${label}</b><small>${String(attr(entity, "installed_version") ?? stateLabel(entity))}${entity?.state === "on" ? ` → ${String(attr(entity, "latest_version") ?? "new")}` : ""}</small></span>
    `)}</div>
    <div class="ha-update-actions"><ha-icon icon="mdi:file-document"></ha-icon><ha-icon icon="mdi:cog"></ha-icon><ha-icon icon="mdi:update"></ha-icon></div>
  `);
};

const renderSunCard = (ctx: RenderContext): TemplateResult => {
  const rising = attr(ctx.entity, "next_rising");
  const setting = attr(ctx.entity, "next_setting");
  const format = (value: unknown) => {
    const date = new Date(String(value ?? ""));
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const above = ctx.entity?.state === "above_horizon";
  return ctx.actionSurface("custom-sun-card", html`
    <div class="sun-times"><span><small>Sunrise</small><b>${format(rising)}</b></span><span><small>Sunset</small><b>${format(setting)}</b></span></div>
    <div class="sun-arc"><svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><circle cx=${above ? "170" : "28"} cy=${above ? "18" : "70"} r="10"></circle><line x1="0" y1="62" x2="300" y2="62"></line></svg></div>
    <div class="sun-footer"><span><small>Dawn</small><b>${format(rising)}</b></span><span><small>Solar noon</small><b>12:00</b></span><span><small>Dusk</small><b>${format(setting)}</b></span></div>
  `);
};

const renderCompactThermostat = (ctx: RenderContext): TemplateResult => {
  const heating = attr(ctx.entity, "hvac_action") === "heating";
  const target = numeric(attr(ctx.entity, "temperature")) ?? 20;
  return ctx.actionSurface(`custom-compact-thermostat ${heating ? "is-heating" : ""}`, html`
    <div class="custom-card-heading">${iconBubble(ctx, heating ? "mdi:radiator" : "mdi:radiator-off", "red")}${heading(ctx, stateLabel(ctx.entity))}<b>${attr(ctx.entity, "current_temperature") ?? "—"}°</b></div>
    <div class="compact-thermostat-controls">
      ${button("Decrease temperature", "mdi:minus", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: target - 0.5 }); })}
      <b>${target}°</b>
      ${button("Increase temperature", "mdi:plus", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: target + 0.5 }); })}
    </div>
  `);
};

const renderBatteryChipCard = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const danger = numeric(configured(ctx, "ulm_custom_card_iAbadia_battery_chip_danger")) ?? 10;
  const warning = numeric(configured(ctx, "ulm_custom_card_iAbadia_battery_chip_warning")) ?? 20;
  const tone = value <= danger ? "red" : value <= warning ? "yellow" : "green";
  return ctx.actionSurface(`custom-battery-chip tone-${tone}`, html`
    <ha-icon .icon=${configured<string>(ctx, "ulm_custom_card_iAbadia_battery_chip_icon") || ctx.config.icon || "mdi:battery"}></ha-icon>
  `);
};

const renderMediaLibrary = (ctx: RenderContext): TemplateResult => {
  const data = Array.isArray(attr(ctx.entity, "data")) ? attr(ctx.entity, "data") as Array<Record<string, unknown>> : [];
  const index = Math.max(1, numeric(configured(ctx, "ulm_custom_card_imswel_medias_index")) ?? 1);
  const media = data[index] ?? data.find((item) => item.title) ?? {};
  const picture = media.fanart || media.poster || attr(ctx.entity, "entity_picture");
  const platform = configured<string>(ctx, "ulm_custom_card_imswel_medias_platform") || "plex";
  return ctx.actionSurface("custom-media-library", html`
    ${picture ? html`<span class="media-library-art" style=${`background-image:url("${String(picture)}")`}></span>` : html`<span class="media-library-art"><ha-icon icon="mdi:movie-open"></ha-icon></span>`}
    <span class="media-library-overlay">
      <span class="media-platform"><ha-icon .icon=${platform === "sonarr" ? "mdi:television-classic" : platform === "radarr" ? "mdi:movie" : "mdi:plex"}></ha-icon></span>
      <span class="ulm-copy">
        <b class="ulm-name">${String(media.title ?? attr(ctx.entity, "media_title") ?? displayName(ctx.config, ctx.entity))}</b>
        <span class="ulm-label">${String(media.episode ?? media.release ?? `${platform} · ${stateLabel(ctx.entity)}`)}</span>
      </span>
    </span>
  `);
};

const renderImswelPerson = (ctx: RenderContext): TemplateResult => {
  const gps = entityFromConfig(ctx, "ulm_card_imswel_person_gps_tracker");
  const wifi = entityFromConfig(ctx, "ulm_card_imswel_person_wifi_tracker");
  const findScript = configured<string>(ctx, "ulm_card_imswel_person_findmy_script");
  return ctx.actionSurface("custom-imswel-person", html`
    <div class="imswel-person-main">${attr(ctx.entity, "entity_picture")
      ? html`<span class="person-picture" style=${`background-image:url("${String(attr(ctx.entity, "entity_picture"))}")`}></span>`
      : iconBubble(ctx, "mdi:account", ctx.entity?.state === "home" ? "blue" : "grey")}
      ${heading(ctx, stateLabel(ctx.entity))}
      ${linkedState(ctx, "battery_entity") ? html`<b>${stateLabel(linkedState(ctx, "battery_entity"))}</b>` : nothing}
    </div>
    <div class="imswel-person-trackers">
      <span><ha-icon icon="mdi:crosshairs-gps"></ha-icon>${stateLabel(gps)}</span>
      <span><ha-icon icon="mdi:wifi"></ha-icon>${stateLabel(wifi)}</span>
      <button @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
        event.stopPropagation();
        if (findScript) ctx.service("script", "turn_on", { entity_id: findScript });
      }}><ha-icon icon="mdi:cellphone-marker"></ha-icon></button>
    </div>
  `);
};

const renderInputDateTime = (ctx: RenderContext): TemplateResult => {
  const state = ctx.entity?.state || "00:00:00";
  const time = state.split(" ").at(-1) || "00:00:00";
  const [hours, minutes] = time.split(":").map(Number);
  const setMinutes = (delta: number) => {
    const total = ((hours || 0) * 60 + (minutes || 0) + delta + 1440) % 1440;
    ctx.service("input_datetime", "set_datetime", {
      entity_id: ctx.config.entity,
      time: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`,
    });
  };
  return ctx.actionSurface("custom-input-datetime", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:calendar-clock", "green")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="input-datetime-controls">
      ${button("Earlier", "mdi:arrow-down", (event) => { event.stopPropagation(); setMinutes(-15); })}
      <b>${time.slice(0, 5)}</b>
      ${button("Later", "mdi:arrow-up", (event) => { event.stopPropagation(); setMinutes(15); })}
    </div>
  `);
};

const renderInputNumberCard = (ctx: RenderContext): TemplateResult => {
  const domain = ctx.config.entity?.split(".", 1)[0] ?? "input_number";
  const decrement = domain === "counter" ? ["counter", "decrement"]
    : domain === "select" ? ["select", "select_previous"]
      : domain === "input_select" ? ["input_select", "select_previous"]
        : ["input_number", "decrement"];
  const increment = domain === "counter" ? ["counter", "increment"]
    : domain === "select" ? ["select", "select_next"]
      : domain === "input_select" ? ["input_select", "select_next"]
        : ["input_number", "increment"];
  return ctx.actionSurface("custom-input-number", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:tune-variant", "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="input-number-controls">
      ${button("Previous value", "mdi:arrow-down", (event) => {
        event.stopPropagation();
        if (domain === "number") {
          const step = numeric(attr(ctx.entity, "step")) ?? 1;
          ctx.service("number", "set_value", { entity_id: ctx.config.entity, value: (numeric(ctx.entity?.state) ?? 0) - step });
        } else ctx.service(decrement[0], decrement[1], { entity_id: ctx.config.entity });
      })}
      <b>${stateLabel(ctx.entity)}</b>
      ${button("Next value", "mdi:arrow-up", (event) => {
        event.stopPropagation();
        if (domain === "number") {
          const step = numeric(attr(ctx.entity, "step")) ?? 1;
          ctx.service("number", "set_value", { entity_id: ctx.config.entity, value: (numeric(ctx.entity?.state) ?? 0) + step });
        } else ctx.service(increment[0], increment[1], { entity_id: ctx.config.entity });
      })}
    </div>
  `);
};

const renderIrmajaviEntities = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx).slice(0, 4);
  return ctx.actionSurface("custom-irmajavi-entities", html`
    <div class="irmajavi-header">${iconBubble(ctx, configured<string>(ctx, "ulm_custom_card_irmajavi_entities_icon") || "mdi:alien", "purple")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="irmajavi-four">${details.map((entity, index) => html`
      <span><b>${configured<string>(ctx, `ulm_custom_card_irmajavi_entities_name_${index + 1}`) || displayName({ type: "", entity: entity.entity_id }, entity)}</b><small>${stateLabel(entity)}</small></span>
    `)}</div>
  `);
};

const renderIrmajaviSpeedtest = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  const download = entityFromConfig(ctx, "ulm_custom_card_irmajavi_speedtest_download_speed_entity") ?? ctx.entity;
  const upload = entityFromConfig(ctx, "ulm_custom_card_irmajavi_speedtest_upload_speed_entity") ?? details[0];
  const ping = entityFromConfig(ctx, "ulm_custom_card_irmajavi_speedtest_ping_entity") ?? details[1];
  return ctx.actionSurface("custom-irmajavi-speedtest", html`
    <div class="speedtest-router">${iconBubble(ctx, "mdi:router-wireless", "blue")}<span class="ulm-copy"><b class="ulm-name">${configured<string>(ctx, "ulm_custom_card_irmajavi_speedtest_name") || "Router"}</b><span class="ulm-label">${configured<string>(ctx, "ulm_custom_card_irmajavi_speedtest_model") || "Internet connection"}</span></span></div>
    <button class="speedtest-action" @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
      event.stopPropagation();
      for (const entity of [download, upload, ping]) if (entity) ctx.service("homeassistant", "update_entity", { entity_id: entity.entity_id });
    }}><ha-icon icon="mdi:speedometer"></ha-icon><span>Internet speed test</span></button>
    <div class="speedtest-metrics">
      ${[["Download", download], ["Upload", upload], ["Ping", ping]].map(([label, entity]) => html`<span><small>${label}</small><b>${stateLabel(entity as HassEntity | undefined)}</b></span>`)}
    </div>
  `);
};

const renderIrmajaviWeather = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx).slice(0, 4);
  const temperature = linkedState(ctx, "temperature_entity");
  const condition = ctx.entity?.state || "unknown";
  const weatherIcon = weatherIcons[condition]?.[0] || "mdi:weather-partly-cloudy";
  return ctx.actionSurface("custom-irmajavi-weather", html`
    <div class="irmajavi-weather-header">
      <span class="weather-emoji"><ha-icon .icon=${weatherIcon}></ha-icon></span>
      <span class="ulm-copy"><b class="ulm-name">${new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(new Date())}</b><span class="ulm-label">${condition.replaceAll("-", " ")}</span></span>
      <b>${temperature ? stateLabel(temperature) : `${attr(ctx.entity, "temperature") ?? "—"}°`}</b>
    </div>
    <div class="irmajavi-four">${details.map((entity) => html`<span><b>${displayName({ type: "", entity: entity.entity_id }, entity)}</b><small>${stateLabel(entity)}</small></span>`)}</div>
  `);
};

const renderLightColorPick = (ctx: RenderContext): TemplateResult => {
  const on = ctx.entity?.state === "on";
  const brightness = numeric(attr(ctx.entity, "brightness"));
  const percent = brightness === undefined ? 0 : Math.round(brightness / 2.55);
  const colors = [[255,255,255], [255,0,0], [0,110,255], [0,190,90], [220,0,220], [0,210,220]];
  return ctx.actionSurface("custom-light-colorpick", html`
    <div class="light-colorpick-top">
      <div class="light-header ${on ? "is-active" : ""}">${iconBubble(ctx, "mdi:lightbulb", on ? "yellow" : "grey")}${heading(ctx, `${stateLabel(ctx.entity)} · ${percent}%`)}</div>
      <div class="ulm-light-slider" style=${`--light-rgb:255,193,7;--light-level:${percent}%`}><i></i><input type="range" min="0" max="100" .value=${String(percent)} @pointerdown=${(event: Event) => event.stopPropagation()} @change=${(event: Event) => ctx.service("light", "turn_on", { entity_id: ctx.config.entity, brightness_pct: Number((event.target as HTMLInputElement).value) })}></div>
    </div>
    ${on ? html`<div class="light-color-swatches">${colors.map((rgb) => html`<button style=${`--swatch:rgb(${rgb.join(",")})`} aria-label=${`Set color ${rgb.join(",")}`} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => { event.stopPropagation(); ctx.service("light", "turn_on", { entity_id: ctx.config.entity, rgb_color: rgb, transition: numeric(configured(ctx, "ulm_card_light_colorpick_transition")) ?? 1 }); }}></button>`)}</div>` : nothing}
  `);
};

const renderSonos = (ctx: RenderContext): TemplateResult => {
  const volume = Math.round((numeric(attr(ctx.entity, "volume_level")) ?? 0) * 100);
  return ctx.actionSurface("custom-sonos", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:speaker", ctx.entity?.state === "playing" ? "green" : "grey")}${heading(ctx, `${attr(ctx.entity, "source") ?? stateLabel(ctx.entity)} · ${volume}%`)}</div>
    <div class="sonos-controls">
      ${button("Volume down", "mdi:volume-minus", (event) => { event.stopPropagation(); ctx.service("media_player", "volume_down", { entity_id: ctx.config.entity }); })}
      ${button("Play or pause", ctx.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (event) => { event.stopPropagation(); ctx.service("media_player", "media_play_pause", { entity_id: ctx.config.entity }); })}
      ${button("Volume up", "mdi:volume-plus", (event) => { event.stopPropagation(); ctx.service("media_player", "volume_up", { entity_id: ctx.config.entity }); })}
    </div>
  `);
};

const renderMorePowerOutlet = (ctx: RenderContext): TemplateResult => {
  const power = entityFromConfig(ctx, "ulm_card_more_power_outlet_power_sensor") ?? linkedState(ctx, "graph_entity");
  const energy = entityFromConfig(ctx, "ulm_card_more_power_outlet_energy_sensor");
  const elapsed = entityFromConfig(ctx, "ulm_card_more_power_outlet_time_sensor");
  const details = [power ? stateLabel(power) : "", energy ? stateLabel(energy) : "", elapsed ? stateLabel(elapsed) : ""].filter(Boolean).join(" · ");
  return ctx.actionSurface("custom-more-power-outlet", html`
    ${iconBubble(ctx, "mdi:power-socket-eu", ctx.entity?.state === "on" ? "yellow" : "grey")}
    ${heading(ctx, details || stateLabel(ctx.entity))}
  `);
};

const renderDualGauge = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const min = numeric(configured(ctx, "ulm_card_mpse_gauge_min")) ?? 0;
  const max = numeric(configured(ctx, "ulm_card_mpse_gauge_max")) ?? 100;
  const gauge = Math.max(0, Math.min(100, ((value - min) / Math.max(1, max - min)) * 100));
  return ctx.actionSurface("custom-dual-gauge", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:gauge", "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${gauge * 1.8}deg`}>
      <i></i>
      <span><b>${stateLabel(ctx.entity)}</b><small>${min} - ${max}</small></span>
    </div>
  `);
};

const renderMpsePrinter = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx).slice(0, 4);
  const colors = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return ctx.actionSurface("custom-mpse-printer", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:printer", ctx.entity?.state === "idle" ? "grey" : "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="toner-bars">${details.map((entity, index) => {
      const value = Math.max(0, Math.min(100, numeric(entity.state) ?? 0));
      return html`<span style=${`--toner:${colors[index]};--level:${value}%`}><i><em></em><b>${stateLabel(entity)}</b></i></span>`;
    })}</div>
  `);
};

const renderWifiSignal = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? -100;
  const signalIcon = value >= -50 ? "mdi:wifi-strength-4" : value >= -60 ? "mdi:wifi-strength-3" : value >= -70 ? "mdi:wifi-strength-2" : value >= -80 ? "mdi:wifi-strength-1" : "mdi:wifi-strength-off";
  return ctx.actionSurface("custom-wifi-signal", html`${iconBubble(ctx, signalIcon, "blue")}${heading(ctx, `${value} dBm`)}`);
};

const renderNasInfo = (ctx: RenderContext): TemplateResult => ctx.actionSurface("custom-nas-info", html`
  ${iconBubble(ctx, "mdi:nas", "blue")}
  ${heading(ctx, `${configured<string>(ctx, "ulm_custom_card_nas_text") || ""} ${stateLabel(ctx.entity)}${configured<string>(ctx, "ulm_custom_card_nas_unit", "ulm_custom_cad_nas_unit") || ""}`.trim())}
`);

const renderNeeksterUpdate = (ctx: RenderContext): TemplateResult => {
  const updateAvailable = ctx.entity?.state !== "off";
  const controls = configured<boolean>(ctx, "ulm_custom_card_neekster_update_enable_controls") === true;
  return ctx.actionSurface("custom-neekster-update", html`
    <div class="custom-card-heading">${iconBubble(ctx, updateAvailable ? "mdi:cloud-download" : "mdi:cloud-check", updateAvailable ? "yellow" : "green")}${heading(ctx, updateAvailable ? "Update available" : "Up to date")}</div>
    ${controls && updateAvailable ? html`<div class="update-controls">
      ${button("Install update", "mdi:update", (event) => { event.stopPropagation(); ctx.service("update", "install", { entity_id: ctx.config.entity }); })}
      ${button("Skip update", "mdi:skip-next", (event) => { event.stopPropagation(); ctx.service("update", "skip", { entity_id: ctx.config.entity }); })}
    </div>` : nothing}
  `);
};

const renderNikClock = (ctx: RenderContext): TemplateResult => {
  const now = new Date();
  return ctx.actionSurface("custom-nik-clock", html`
    <b>${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b>
    <span>${now.toLocaleDateString(ctx.hass.language, { weekday: "long", day: "numeric", month: "long" })}</span>
  `);
};

const renderNikDoor = (ctx: RenderContext): TemplateResult => {
  const lock = linkedState(ctx, "lock_entity");
  const battery = linkedState(ctx, "battery_entity");
  const batteryValue = numeric(battery?.state) ?? 0;
  return ctx.actionSurface("custom-nik-door", html`
    <div class="nik-door-heading">
      <span class="nik-door-icon"><ha-icon .icon=${ctx.entity?.state === "on" ? "mdi:door-open" : "mdi:door-closed"}></ha-icon><i class=${batteryValue <= 40 ? "is-low" : ""}><ha-icon .icon=${batteryValue <= 40 ? "mdi:battery-alert" : "mdi:battery"}></ha-icon></i></span>
      ${heading(ctx, `${stateLabel(ctx.entity)} · ${stateLabel(lock)}`)}
    </div>
    <div class="nik-door-controls">
      ${button("Unlock", "mdi:lock-open", (event) => { event.stopPropagation(); if (lock) ctx.service("lock", "unlock", { entity_id: lock.entity_id }); })}
      ${button("Lock", "mdi:lock", (event) => { event.stopPropagation(); if (lock) ctx.service("lock", "lock", { entity_id: lock.entity_id }); })}
    </div>
  `);
};

const renderNikNas = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx).slice(0, 4);
  const online = !["off", "unavailable", "unknown"].includes(ctx.entity?.state ?? "");
  if (!online) return ctx.actionSurface("custom-nik-nas is-off", html`${iconBubble(ctx, "mdi:nas", "grey")}${heading(ctx, stateLabel(ctx.entity))}`);
  return ctx.actionSurface("custom-nik-nas is-on", html`
    <div class="nik-nas-header">${iconBubble(ctx, "mdi:nas", "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="nik-nas-metrics">${details.slice(0, 3).map((entity, index) => html`<span class=${`metric-${index + 1}`}><b>${stateLabel(entity)}</b><small>${displayName({ type: "", entity: entity.entity_id }, entity)}</small></span>`)}</div>
    <div class="nik-nas-chart" style=${`--gauge:${Math.max(0, Math.min(100, numeric(details[0]?.state) ?? 0)) * 3.6}deg`}><ha-icon icon="mdi:nas"></ha-icon></div>
  `);
};

const renderNikTablet = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  const battery = numeric(ctx.entity?.state) ?? 0;
  return ctx.actionSurface("custom-nik-tablet", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:tablet", "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="tablet-status-row">${details.slice(0, 3).map((entity) => html`<span>${stateLabel(entity)}</span>`)}</div>
    <div class="tablet-action-row"><button><ha-icon icon="mdi:restart"></ha-icon></button><button><ha-icon icon="mdi:reload"></ha-icon></button><button><ha-icon icon="mdi:wrench"></ha-icon></button></div>
    <div class="tablet-parameter-row">${details.slice(3, 6).map((entity) => html`<span><small>${displayName({ type: "", entity: entity.entity_id }, entity)}</small><b>${stateLabel(entity)}</b></span>`)}</div>
    <div class="tablet-battery"><i style=${`width:${battery}%`}></i><b>${battery}%</b></div>
  `);
};

const pollenSeverity = (value: number): [string, string] => {
  if (value >= 6) return ["Very high", "#d32f2f"];
  if (value >= 5) return ["High", "#f44336"];
  if (value >= 4) return ["Medium", "#ff9800"];
  if (value >= 3) return ["Moderate", "#fbc02d"];
  if (value >= 2) return ["Low", "#8bc34a"];
  if (value >= 1) return ["Very low", "#c5e1a5"];
  return ["None", "#9e9e9e"];
};

const renderPaddyPollen = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const [label, color] = pollenSeverity(value);
  return ctx.actionSurface("custom-paddy-pollen", html`
    <span class="pollen-icon" style=${`--pollen:${color}`}><ha-icon .icon=${ctx.config.icon || "mdi:flower-pollen"}></ha-icon></span>
    ${valueThenName(ctx, label)}
  `);
};

const renderPaddyWaste = (ctx: RenderContext): TemplateResult => {
  const days = numeric(attr(ctx.entity, "daysTo"));
  const warning = days === 0 || days === 1 || ctx.entity?.state === "unavailable";
  return ctx.actionSurface(`custom-paddy-waste ${warning ? "is-warning" : ""}`, html`
    <span class="paddy-waste-icon">${iconBubble(ctx, "mdi:trash-can", warning ? "red" : "green")}${warning ? html`<i><ha-icon icon="mdi:alert"></ha-icon></i>` : nothing}</span>
    ${valueThenName(ctx)}
  `);
};

const renderPaddyWelcome = (ctx: RenderContext): TemplateResult => {
  const hour = new Date().getHours();
  const greeting = hour >= 18 ? "Good evening" : hour >= 12 ? "Good afternoon" : hour >= 5 ? "Good morning" : "Hello";
  const weather = entityFromConfig(ctx, "ulm_weather") ?? Object.values(ctx.hass.states).find((entity) => entity.entity_id.startsWith("weather."));
  return ctx.actionSurface("custom-paddy-welcome", html`
    <b>${greeting}, ${ctx.config.name || displayName(ctx.config, ctx.entity)}!</b>
    ${weather ? html`<span><ha-icon .icon=${weatherIcons[weather.state]?.[0] || "mdi:weather-partly-cloudy"}></ha-icon>${attr(weather, "temperature") ?? "—"}° · ${weather.state.replaceAll("-", " ")}</span>` : nothing}
  `);
};

const renderPersonChip = (ctx: RenderContext): TemplateResult => {
  const picture = ctx.config.use_entity_picture ? attr(ctx.entity, "entity_picture") : undefined;
  return ctx.actionSurface("custom-person-chip", html`
    ${picture ? html`<span class="person-chip-picture" style=${`background-image:url("${String(picture)}")`}></span>` : html`<span><ha-icon icon="mdi:face-man"></ha-icon></span>`}
    <b>${stateLabel(ctx.entity)}</b>
  `);
};

const renderPersonInfo = (ctx: RenderContext): TemplateResult => {
  const small = ctx.config.variant === "small";
  const trackers = configuredEntities(ctx);
  const picture = String(attr(ctx.entity, "entity_picture") || "");
  if (small) return ctx.actionSurface("custom-person-info-small is-compact", html`
    <span class="person-info-avatar" style=${picture ? `background-image:url("${picture}")` : ""}><ha-icon icon="mdi:account"></ha-icon></span>
    ${heading(ctx, `${stateLabel(ctx.entity)}${trackers[0] ? ` · ${stateLabel(trackers[0])}` : ""}`)}
  `);
  const battery = entityFromConfig(ctx, "ulm_card_person_battery") ?? linkedState(ctx, "battery_entity") ?? trackers[0];
  const distance = entityFromConfig(ctx, "ulm_card_person_distance") ?? trackers[1];
  const zone = entityFromConfig(ctx, "ulm_card_person_zone") ?? trackers[2];
  return ctx.actionSurface("custom-person-info", html`
    <div class="person-info-main">
      <span class="person-info-avatar" style=${picture ? `background-image:url("${picture}")` : ""}><ha-icon icon="mdi:account"></ha-icon></span>
      ${heading(ctx, stateLabel(ctx.entity))}
      <span class="person-info-status">${ctx.entity?.state === "home" ? "Home" : ctx.entity?.state || "Unknown"}</span>
    </div>
    <div class="person-info-details">
      <span><ha-icon icon="mdi:battery"></ha-icon><b>${stateLabel(battery)}</b><small>Battery</small></span>
      <span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${stateLabel(distance)}</b><small>Distance</small></span>
      <span><ha-icon icon="mdi:map-marker-radius"></ha-icon><b>${stateLabel(zone)}</b><small>Zone</small></span>
    </div>
  `);
};

const renderConsoleCard = (ctx: RenderContext): TemplateResult => {
  const platform = configured<string>(ctx, "console_platform", "platform", "console_type", "variant") === "xbox" ? "xbox" : "playstation";
  const playing = ctx.entity?.state === "on" || ctx.entity?.state === "playing";
  const background = configured<string>(ctx, "ulm_custom_card_console_background", "ulm_card_playstation_background");
  return ctx.actionSurface(`custom-console-card platform-${platform}`, html`
    ${background ? html`<div class="console-backdrop" style=${`background-image:url("${background}")`}></div>` : nothing}
    <div class="console-content">
      <span class="console-logo"><ha-icon .icon=${platform === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation"}></ha-icon></span>
      ${heading(ctx, `${playing ? "Playing" : stateLabel(ctx.entity)}${attr(ctx.entity, "source") ? ` · ${String(attr(ctx.entity, "source"))}` : ""}`)}
      <button @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => { event.stopPropagation(); ctx.service("media_player", playing ? "turn_off" : "turn_on", { entity_id: ctx.config.entity }); }}><ha-icon .icon=${playing ? "mdi:power" : "mdi:play"}></ha-icon></button>
    </div>
  `);
};

const renderQubino = (ctx: RenderContext): TemplateResult => {
  const power = entityFromConfig(ctx, "ulm_custom_card_qubino_power") ?? configuredEntities(ctx)[0];
  return ctx.actionSurface("custom-qubino", html`
    ${iconBubble(ctx, ctx.entity?.state === "on" ? "mdi:radiator" : "mdi:radiator-disabled", ctx.entity?.state === "on" ? "red" : "grey")}
    ${heading(ctx, `${stateLabel(ctx.entity)}${power ? ` · ${stateLabel(power)}` : ""}`)}
    <button @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => { event.stopPropagation(); ctx.service("switch", "toggle", { entity_id: ctx.config.entity }); }}><ha-icon icon="mdi:power"></ha-icon></button>
  `);
};

const renderRistouPerson = (ctx: RenderContext): TemplateResult => {
  const picture = String(attr(ctx.entity, "entity_picture") || "");
  const camera = entityFromConfig(ctx, "ulm_card_ristou_person_camera");
  const cameraPicture = camera ? String(attr(camera, "entity_picture") || `/api/camera_proxy/${camera.entity_id}`) : "";
  const map = configured<boolean>(ctx, "ulm_card_ristou_person_show_map") === true;
  return ctx.actionSurface("custom-ristou-person", html`
    <div class="ristou-person-main">
      <span class="person-info-avatar" style=${picture ? `background-image:url("${picture}")` : ""}><ha-icon icon="mdi:account"></ha-icon></span>
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    ${cameraPicture ? html`<div class="ristou-camera" style=${`background-image:url("${cameraPicture}")`}></div>` : nothing}
    ${map ? html`<div class="ristou-map"><ha-icon icon="mdi:map-marker-path"></ha-icon><span>${stateLabel(ctx.entity)}</span></div>` : nothing}
  `);
};

const renderSaxelFan = (ctx: RenderContext): TemplateResult => {
  const on = ctx.entity?.state === "on";
  const percentage = numeric(attr(ctx.entity, "percentage")) ?? 0;
  const presets = Array.isArray(attr(ctx.entity, "preset_modes")) ? attr(ctx.entity, "preset_modes") as string[] : [];
  return ctx.actionSurface("custom-saxel-fan", html`
    <div class="custom-card-heading">${iconBubble(ctx, "mdi:fan", on ? "blue" : "grey", on ? "spin" : undefined)}${heading(ctx, `${stateLabel(ctx.entity)} · ${percentage}%`)}</div>
    <div class="fan-speed-row">${[33, 66, 100].map((value, index) => html`<button class=${percentage >= value - 10 ? "is-active" : ""} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => { event.stopPropagation(); ctx.service("fan", "set_percentage", { entity_id: ctx.config.entity, percentage: value }); }}><ha-icon .icon=${`mdi:fan-speed-${index + 1}`}></ha-icon></button>`)}</div>
    ${presets.length ? html`<div class="fan-preset-row">${presets.slice(0, 4).map((preset) => html`<button class=${attr(ctx.entity, "preset_mode") === preset ? "is-active" : ""} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => { event.stopPropagation(); ctx.service("fan", "set_preset_mode", { entity_id: ctx.config.entity, preset_mode: preset }); }}>${preset}</button>`)}</div>` : nothing}
  `);
};

const renderCustomScenes = (ctx: RenderContext): TemplateResult => {
  const scenes = configuredEntities(ctx).slice(0, 5);
  return ctx.actionSurface("custom-scenes-grid", html`
    ${scenes.map((entity, index) => html`
      <button @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => { event.stopPropagation(); ctx.service(entity.entity_id.split(".")[0], "turn_on", { entity_id: entity.entity_id }); }}>
        <span style=${`--tone:${["255,193,7","33,150,243","156,39,176","76,175,80","244,67,54"][index]}`}><ha-icon .icon=${String(attr(entity, "icon") || "mdi:palette")}></ha-icon></span>
        <small>${displayName({ type: "", entity: entity.entity_id }, entity)}</small>
      </button>
    `)}
  `);
};

const renderCar = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  const fuel = entityFromConfig(ctx, "ulm_custom_card_schumijo_car_fuel") ?? details[0];
  const range = entityFromConfig(ctx, "ulm_custom_card_schumijo_car_range") ?? ctx.entity;
  const lock = entityFromConfig(ctx, "ulm_custom_card_schumijo_car_lock") ?? details.find((entity) => entity.entity_id.startsWith("lock.")) ?? details[2];
  return ctx.actionSurface("custom-schumijo-car", html`
    <div class="car-hero">${iconBubble(ctx, "mdi:car", "blue")}${heading(ctx, stateLabel(ctx.entity))}<ha-icon .icon=${lock?.state === "locked" ? "mdi:lock" : "mdi:lock-open"}></ha-icon></div>
    <div class="car-metrics"><span><ha-icon icon="mdi:gas-station"></ha-icon><b>${stateLabel(fuel)}</b></span><span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${stateLabel(range)}</b></span></div>
  `);
};

const renderFlower = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  const moisture = entityFromConfig(ctx, "ulm_custom_card_schumijo_flower_moisture") ?? ctx.entity;
  const conductivity = entityFromConfig(ctx, "ulm_custom_card_schumijo_flower_conductivity") ?? details[0];
  const temperature = entityFromConfig(ctx, "ulm_custom_card_schumijo_flower_temperature") ?? details[1];
  const brightness = entityFromConfig(ctx, "ulm_custom_card_schumijo_flower_brightness") ?? details[2];
  return ctx.actionSurface("custom-schumijo-flower", html`
    <div class="flower-heading">${iconBubble(ctx, "mdi:flower", "green")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="flower-metrics">${[["mdi:water-percent", moisture], ["mdi:flash", conductivity], ["mdi:thermometer", temperature], ["mdi:white-balance-sunny", brightness]].map(([icon, entity]) => html`<span><ha-icon .icon=${icon as string}></ha-icon><b>${stateLabel(entity as HassEntity | undefined)}</b></span>`)}</div>
  `);
};

const renderSenoroWindow = (ctx: RenderContext): TemplateResult => {
  const open = ctx.entity?.state === "on";
  const battery = entityFromConfig(ctx, "ulm_custom_card_senoro_win_battery") ?? configuredEntities(ctx)[0];
  return ctx.actionSurface(`custom-senoro-window ${open ? "is-open" : ""}`, html`
    ${iconBubble(ctx, open ? "mdi:window-open-variant" : "mdi:window-closed-variant", open ? "red" : "green")}
    ${heading(ctx, stateLabel(ctx.entity))}
    <span class="window-battery"><ha-icon icon="mdi:battery"></ha-icon>${stateLabel(battery)}</span>
  `);
};

const renderSisimomoPrinter = (ctx: RenderContext): TemplateResult => {
  const cartridges = configuredEntities(ctx).slice(0, 6);
  const colors = ["#111", "#111", "#ffdf55", "#ef4778", "#4a86db", "#8b69bc"];
  const labels = ["BK", "B", "Y", "M", "C", "PB"];
  return ctx.actionSurface("custom-sisimomo-printer", html`
    <div class="printer-summary">${iconBubble(ctx, "mdi:printer", "blue")}${heading(ctx, stateLabel(ctx.entity))}</div>
    <div class="printer-cartridges">${cartridges.map((entity, index) => {
      const value = Math.max(0, Math.min(100, numeric(entity.state) ?? 0));
      return html`<span style=${`--cartridge:${colors[index]};--level:${value}%`}><small>${labels[index]}</small><i><em></em></i><b>${stateLabel(entity)}</b></span>`;
    })}</div>
  `);
};

const renderSpeedtestShogun = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  const metrics = [ctx.entity, ...details].filter(Boolean).slice(0, 3) as HassEntity[];
  return ctx.actionSurface("custom-speedtest-shogun", html`
    <div class="speedtest-three">${metrics.map((entity, index) => html`<span><ha-icon .icon=${["mdi:download", "mdi:upload", "mdi:timer-outline"][index]}></ha-icon><b>${stateLabel(entity)}</b><small>${displayName({ type: "", entity: entity.entity_id }, entity)}</small></span>`)}</div>
    <div class="speedtest-chart">${sparkline(ctx)}</div>
  `);
};

const renderTpxAircondition = (ctx: RenderContext): TemplateResult => {
  const current = numeric(attr(ctx.entity, "current_temperature"));
  const target = numeric(attr(ctx.entity, "temperature"));
  const fan = String(attr(ctx.entity, "fan_mode") || "");
  const swing = String(attr(ctx.entity, "swing_mode") || "");
  return ctx.actionSurface("custom-tpx-aircondition", html`
    <div class="aircondition-main">${iconBubble(ctx, "mdi:air-conditioner", ctx.entity?.state === "off" ? "grey" : "blue")}${heading(ctx, `${current ?? "—"}° · ${ctx.entity?.state || "unknown"}`)}<b>${target ?? "—"}°</b></div>
    <div class="aircondition-controls">
      ${button("Decrease", "mdi:minus", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: (target ?? 20) - 0.5 }); })}
      <span><ha-icon icon="mdi:fan"></ha-icon>${fan || "Auto"}</span>
      <span><ha-icon icon="mdi:arrow-up-down"></ha-icon>${swing || "Off"}</span>
      ${button("Increase", "mdi:plus", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: (target ?? 20) + 0.5 }); })}
    </div>
  `);
};

const renderDeviceTracer = (ctx: RenderContext): TemplateResult => {
  const person = entityFromConfig(ctx, "ulm_custom_card_vncntdev_device_tracer_person");
  const battery = entityFromConfig(ctx, "ulm_custom_card_vncntdev_device_tracer_battery") ?? configuredEntities(ctx)[0];
  const source = entityFromConfig(ctx, "ulm_custom_card_vncntdev_device_tracer_source") ?? configuredEntities(ctx)[1];
  return ctx.actionSurface("custom-device-tracer", html`
    <span class="device-tracer-icon"><ha-icon icon="mdi:cellphone-marker"></ha-icon></span>
    ${heading(ctx, `${stateLabel(ctx.entity)}${person ? ` · ${stateLabel(person)}` : ""}`)}
    <div class="device-tracer-meta"><span><ha-icon icon="mdi:battery"></ha-icon>${stateLabel(battery)}</span><span><ha-icon icon="mdi:crosshairs-gps"></ha-icon>${stateLabel(source)}</span></div>
  `);
};

const renderWaterHeater = (ctx: RenderContext): TemplateResult => {
  const current = numeric(attr(ctx.entity, "current_temperature"));
  const target = numeric(attr(ctx.entity, "temperature")) ?? numeric(ctx.entity?.state);
  return ctx.actionSurface("custom-water-heater", html`
    <div class="water-heater-top">${iconBubble(ctx, "mdi:water-boiler", ctx.entity?.state === "off" ? "grey" : "red")}${heading(ctx, `Current ${current ?? "—"}°`)}<b>${target ?? "—"}°</b></div>
    <div class="water-heater-controls">
      ${button("Decrease temperature", "mdi:minus", (event) => { event.stopPropagation(); ctx.service("water_heater", "set_temperature", { entity_id: ctx.config.entity, temperature: (target ?? 50) - 1 }); })}
      <span>${stateLabel(ctx.entity)}</span>
      ${button("Increase temperature", "mdi:plus", (event) => { event.stopPropagation(); ctx.service("water_heater", "set_temperature", { entity_id: ctx.config.entity, temperature: (target ?? 50) + 1 }); })}
    </div>
  `);
};

const renderCustomTitle = (ctx: RenderContext): TemplateResult => {
  const subtitle = ctx.config.variant === "divider-subtitle";
  return html`<div class=${`custom-wilbiev-title ${subtitle ? "is-subtitle" : ""}`}><span></span><b>${ctx.config.name || (subtitle ? "Subtitle" : "Title")}</b><span></span></div>`;
};

const renderWslyPollen = (ctx: RenderContext): TemplateResult => {
  const details = [ctx.entity, ...configuredEntities(ctx)].filter(Boolean).slice(0, 3) as HassEntity[];
  return ctx.actionSurface("custom-wsly-pollen", html`
    ${details.map((entity, index) => {
      const [label, color] = pollenSeverity(numeric(entity.state) ?? 0);
      return html`<span style=${`--pollen:${color}`}><ha-icon .icon=${["mdi:tree", "mdi:grass", "mdi:flower-pollen"][index]}></ha-icon><b>${stateLabel(entity)}</b><small>${label}</small></span>`;
    })}
  `);
};

const renderLightsCount = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state) ?? 0;
  const kind = configured<string>(ctx, "ulm_custom_card_yagrasdemonde_lights_count_type") || "light";
  const icons: Record<string, string> = { light: value === 0 ? "mdi:lightbulb-outline" : "mdi:lightbulb-on", switch: "mdi:toggle-switch", cover: "mdi:blinds" };
  const noun = value === 1 ? kind : `${kind}s`;
  return ctx.actionSurface("custom-lights-count", html`${iconBubble(ctx, icons[kind] || icons.light, value > 0 ? "yellow" : "grey")}${heading(ctx, `${value} ${noun} on`)}`);
};

const renderGeneric = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-row", html`
  ${iconBubble(ctx, "mdi:information-outline", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
  ${valueThenName(ctx)}
`);

const renderGenericSwap = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-row ulm-generic-swap", html`
  ${valueThenName(ctx)}
  ${iconBubble(ctx, "mdi:information-outline", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
`);

const renderTitle = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-title", html`
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
  `);
};

const renderSimpleDefault = (ctx: RenderContext, fallbackIcon: string, tone = "blue"): TemplateResult =>
  ctx.actionSurface("ulm-row ulm-simple-default", html`
    ${iconBubble(ctx, fallbackIcon, activeStates.has(ctx.entity?.state ?? "") ? tone : "grey")}
    ${heading(ctx, stateLabel(ctx.entity))}
  `);

const renderDefaultGraph = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-default-graph", html`
  <div class="metric-heading">${iconBubble(ctx, "mdi:chart-line", "red")}${valueThenName(ctx)}</div>
  ${sparkline(ctx, true)}
`);

export const renderByFamily = (ctx: RenderContext): TemplateResult => {
  switch (ctx.descriptor.upstreamId) {
    case "card_battery": return renderDefaultBattery(ctx);
    case "card_binary_sensor": return renderBinary(ctx, ctx.config.variant === "alert");
    case "card_graph": return renderDefaultGraph(ctx);
    case "card_input_boolean": return renderSimpleDefault(ctx, "mdi:toggle-switch", "blue");
    case "card_navigate": return renderDefaultNavigation(ctx);
    case "card_power_outlet": return renderSimpleDefault(ctx, "mdi:power-socket-eu", "yellow");
    case "card_script": return renderSimpleDefault(ctx, "mdi:script-text", "blue");
    case "card_title": return renderTitle(ctx);
    case "card_vacuum": return renderDefaultVacuum(ctx);
    case "card_vertical_button": return renderVerticalButton(ctx);
    case "card_generic": return ctx.config.variant === "swapped" ? renderGenericSwap(ctx) : renderGeneric(ctx);
    case "custom_card_afvalophaling": return renderWasteCollection(ctx);
    case "custom_card_alarm_time": return renderAlarmTimeCard(ctx);
    case "custom_card_apexcharts": return renderApexCharts(ctx);
    case "custom_card_chromecast": return renderChromecast(ctx);
    case "custom_card_damix48_power_details": return renderPowerDetails(ctx);
    case "custom_card_device_tracker": return renderDeviceTrackerCard(ctx);
    case "custom_card_drealine_roomview": return renderRoomView(ctx);
    case "custom_card_eraycetinay_elapsed_time": return renderElapsedTime(ctx);
    case "custom_card_eraycetinay_lock": return renderErayLock(ctx);
    case "custom_card_esh_welcome": return renderEshWelcome(ctx);
    case "custom_card_haven_washer": return renderWasher(ctx);
    case "custom_card_heat_pump": return renderHeatPump(ctx);
    case "custom_card_homeassistant_updates": return renderHomeAssistantUpdates(ctx);
    case "custom_card_httpedo13_sun": return renderSunCard(ctx);
    case "custom_card_httpedo13_thermostat": return renderCompactThermostat(ctx);
    case "custom_card_iAbadia_battery_chip": return renderBatteryChipCard(ctx);
    case "custom_card_imswel_medias": return renderMediaLibrary(ctx);
    case "custom_card_imswel_person": return renderImswelPerson(ctx);
    case "custom_card_input_datetime": return renderInputDateTime(ctx);
    case "custom_card_input_number": return renderInputNumberCard(ctx);
    case "custom_card_irmajavi_entities": return renderIrmajaviEntities(ctx);
    case "custom_card_irmajavi_speedtest": return renderIrmajaviSpeedtest(ctx);
    case "custom_card_irmajavi_weather": return renderIrmajaviWeather(ctx);
    case "custom_card_light_colorpick": return renderLightColorPick(ctx);
    case "custom_card_media_player_sonos": return renderSonos(ctx);
    case "custom_card_more_power_outlet": return renderMorePowerOutlet(ctx);
    case "custom_card_mpse_gauge": return renderDualGauge(ctx);
    case "custom_card_mpse_printer": return renderMpsePrinter(ctx);
    case "custom_card_mpse_thermostat": return renderCompactThermostat(ctx);
    case "custom_card_mpse_wifisignal": return renderWifiSignal(ctx);
    case "custom_card_nas": return renderNasInfo(ctx);
    case "custom_card_neekster_update": return renderNeeksterUpdate(ctx);
    case "custom_card_nik_clock": return renderNikClock(ctx);
    case "custom_card_nik_door": return renderNikDoor(ctx);
    case "custom_card_nik_nas": return renderNikNas(ctx);
    case "custom_card_nik_tablet": return renderNikTablet(ctx);
    case "custom_card_paddy_dwd_pollen": return renderPaddyPollen(ctx);
    case "custom_card_paddy_waste_collection": return renderPaddyWaste(ctx);
    case "custom_card_paddy_welcome": return renderPaddyWelcome(ctx);
    case "custom_card_person_chip": return renderPersonChip(ctx);
    case "custom_card_person_info":
    case "custom_card_person_info_small": return renderPersonInfo(ctx);
    case "custom_card_playstation": return renderConsoleCard(ctx);
    case "custom_card_qubino": return renderQubino(ctx);
    case "custom_card_ristou_person": return renderRistouPerson(ctx);
    case "custom_card_saxel_fan": return renderSaxelFan(ctx);
    case "custom_card_scenes": return renderCustomScenes(ctx);
    case "custom_card_schumijo_car": return renderCar(ctx);
    case "custom_card_schumijo_flower": return renderFlower(ctx);
    case "custom_card_senoro_win": return renderSenoroWindow(ctx);
    case "custom_card_sisimomo_printer": return renderSisimomoPrinter(ctx);
    case "custom_card_speedtest_shogun160": return renderSpeedtestShogun(ctx);
    case "custom_card_tpx01_aircondition": return renderTpxAircondition(ctx);
    case "custom_card_vncntdev_device_tracer": return renderDeviceTracer(ctx);
    case "custom_card_water_heater": return renderWaterHeater(ctx);
    case "custom_card_wilbiev_title":
    case "custom_card_wilbiev_subtitle": return renderCustomTitle(ctx);
    case "custom_card_wsly_pollen": return renderWslyPollen(ctx);
    case "custom_card_yagrasdemonde_lights_count": return renderLightsCount(ctx);
    case "card_room":
    case "custom_card_esh_room":
      return renderRoom(ctx);
  }
  if (/afval/.test(ctx.descriptor.upstreamId)) return renderScheduleCard(ctx);
  if (/printer/.test(ctx.descriptor.upstreamId)) return renderDeviceStatus(ctx);
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
    case "bar": return renderBarCard(ctx);
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
