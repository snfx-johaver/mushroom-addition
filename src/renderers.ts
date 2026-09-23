import { html, nothing, svg, type TemplateResult } from "lit";
import type { ActionConfig, AdditionConfig, AdditionItemConfig, CatalogItem, HassEntity, HomeAssistant, WeatherForecast } from "./types";
import { activeStates, displayName, fireEvent, stateLabel } from "./helpers";
import { wasteStreamsForConfig } from "./waste-streams";
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
const button = (label: string, iconName: string, handler: (event: Event) => void, disabled = false) => html`
  <button class="ulm-control" aria-label=${label} ?disabled=${disabled}
    @pointerdown=${(event: Event) => event.stopPropagation()} @click=${handler}>
    <ha-icon .icon=${iconName}></ha-icon>
  </button>
`;
const runControlAction = (
  event: Event,
  ctx: RenderContext,
  action: ActionConfig,
  entity = ctx.config.entity,
): void => {
  event.stopPropagation();
  fireEvent(event.currentTarget as HTMLElement, "hass-action", {
    config: { type: ctx.config.type, entity, tap_action: action },
    action: "tap",
  });
};

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
  const horizontalWide = configured<boolean>(ctx, "ulm_card_light_enable_horizontal_wide") === true;
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
  return ctx.actionSurface(`ulm-light-card ${horizontal ? "is-horizontal" : ""} ${horizontalWide ? "is-horizontal-wide" : ""} ${collapsed ? "is-collapsed" : ""}`, html`
    <div class="light-header ${on ? "is-active" : ""}" style=${lightStyle}>
      ${iconBubble(ctx, "mdi:lightbulb", on ? "yellow" : "grey", "light-icon")}
      ${heading(ctx, on && percent !== undefined ? `${percent}%` : stateLabel(ctx.entity))}
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

const sparkline = (ctx: RenderContext, filled = false, entity = ctx.entity) => {
  const values = Array.isArray(attr(entity, "history"))
    ? (attr(entity, "history") as unknown[]).map(Number).filter(Number.isFinite).slice(-12)
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
  const controlsEntity = configured<string>(ctx, "ulm_card_media_player_player_controls_entity") || ctx.config.entity;
  const controlsState = controlsEntity ? ctx.hass.states[controlsEntity] : ctx.entity;
  const controllable = controlsEntity?.startsWith("media_player.") === true;
  const collapsed = configured<boolean>(ctx, "ulm_card_media_player_collapsible") === true && (
    ["off", "standby"].includes(ctx.entity?.state ?? "") ||
    (configured<boolean>(ctx, "ulm_card_media_player_idle_off") === true && ctx.entity?.state === "idle")
  );
  const showControls = !collapsed && (
    ctx.config.show_controls === true ||
    configured<boolean>(ctx, "ulm_card_media_player_enable_controls") === true
  );
  const volumeStep = configured<number>(ctx, "ulm_card_media_player_enable_volume_adjust") ||
    (attr(controlsState, "device_class") === "speaker" ? .05 :
      attr(controlsState, "device_class") === "tv" ? .01 : .025);
  const volume = Number(attr(controlsState, "volume_level") ?? 0);
  const sourceAction: ActionConfig = { action: "more-info" };
  return ctx.actionSurface(`ulm-media ${picture ? "has-art" : ""} ${collapsed ? "is-collapsed" : ""}`, html`
    ${picture ? html`<span class="media-art" style=${`background-image:url("${String(picture)}")`}></span>` : nothing}
    <div class="media-summary">
      ${iconBubble(ctx, ctx.descriptor.upstreamId === "custom_card_playstation" ? consoleIcon : "mdi:speaker", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
      ${heading(ctx, configured<boolean>(ctx, "ulm_card_media_player_more_info") === true
        ? [attr(ctx.entity, "media_artist"), attr(ctx.entity, "media_album_name")].filter(Boolean).join(" · ") || stateLabel(ctx.entity)
        : String(attr(ctx.entity, "media_album_name") ?? attr(ctx.entity, "media_artist") ?? stateLabel(ctx.entity)))}
    </div>
    ${configured<boolean>(ctx, "ulm_card_media_player_power_button") === true ? html`
      <div class="media-power">${button("Toggle power", "mdi:power", (event) => {
        event.stopPropagation();
        ctx.service("homeassistant", "toggle", { entity_id: ctx.config.entity });
      })}</div>
    ` : nothing}
    ${controllable && showControls ? html`<div class="ulm-controls media-controls">
      ${button("Previous", "mdi:skip-previous", (event) => { event.stopPropagation(); ctx.service("media_player", "media_previous_track", { entity_id: controlsEntity }); })}
      ${button(ctx.entity?.state === "playing" ? "Pause" : "Play", ctx.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (event) => {
        event.stopPropagation();
        ctx.service("media_player", "media_play_pause", { entity_id: controlsEntity });
      })}
      ${button("Next", "mdi:skip-next", (event) => { event.stopPropagation(); ctx.service("media_player", "media_next_track", { entity_id: controlsEntity }); })}
      ${button("Sources", "mdi:playlist-music", (event) => runControlAction(event, ctx, sourceAction, controlsEntity))}
    </div>` : nothing}
    ${controllable && !collapsed && configured<boolean>(ctx, "ulm_card_media_player_enable_volume_slider") === true ? html`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(volume * 100))}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) => ctx.service("media_player", "volume_set", {
          entity_id: controlsEntity,
          volume_level: Number((event.target as HTMLInputElement).value) / 100,
        })}>
    ` : nothing}
    ${controllable && !collapsed && configured<boolean>(ctx, "ulm_card_media_player_enable_volume_buttons") === true ? html`
      <div class="ulm-controls media-volume-buttons">
        ${button("Mute or unmute", "mdi:volume-mute", (event) => {
          event.stopPropagation();
          ctx.service("media_player", "volume_mute", {
            entity_id: controlsEntity,
            is_volume_muted: attr(controlsState, "is_volume_muted") !== true,
          });
        })}
        ${button("Volume down", "mdi:volume-minus", (event) => {
          event.stopPropagation();
          ctx.service("media_player", "volume_set", {
            entity_id: controlsEntity,
            volume_level: Math.max(0, volume - volumeStep),
          });
        })}
        ${button("Volume up", "mdi:volume-plus", (event) => {
          event.stopPropagation();
          ctx.service("media_player", "volume_set", {
            entity_id: controlsEntity,
            volume_level: Math.min(1, volume + volumeStep),
          });
        })}
      </div>
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

const renderDefaultNavigation = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-default-navigation", html`
  ${iconBubble(ctx, ctx.config.icon || "mdi:navigation", "blue")}
  <span class="navigation-label">${ctx.config.name || "Navigate"}</span>
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
  const picture = attr(ctx.entity, "entity_picture") ||
    (ctx.entity?.entity_id.startsWith("camera.") ? `/api/camera_proxy/${ctx.entity.entity_id}` : undefined);
  const showTitle = configured<boolean>(ctx, "ulm_custom_card_camera_title") === true;
  const cameraName = configured<string>(ctx, "ulm_custom_card_camera_name") || displayName(ctx.config, ctx.entity);
  const cameraLabel = configured<string>(ctx, "ulm_custom_card_camera_label") || stateLabel(ctx.entity);
  const aspectRatio = configured<string>(ctx, "ulm_custom_card_camera_aspect_ratio");
  return ctx.actionSurface(`ulm-camera ${showTitle ? "has-title" : "image-only"}`, html`
    ${showTitle ? html`<div class="camera-title">
      ${iconBubble(ctx, ctx.config.icon || "mdi:camera", "blue")}
      <span class="ulm-copy"><b class="ulm-name">${cameraName}</b><span class="ulm-label">${cameraLabel}</span></span>
    </div>` : nothing}
    ${picture ? html`<img src=${String(picture)} alt=${cameraName} style=${aspectRatio ? `aspect-ratio:${aspectRatio}` : ""}>` : html`
      <div class="camera-placeholder">${iconBubble(ctx, "mdi:camera", "blue")}</div>
    `}
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
  const value = configured<unknown>(ctx, ...keys);
  const entityId = typeof value === "string"
    ? value
    : value && typeof value === "object" && "entity_id" in value && typeof value.entity_id === "string"
      ? value.entity_id
      : undefined;
  return entityId ? ctx.hass.states[entityId] : undefined;
};

const renderWasteCollection = (ctx: RenderContext): TemplateResult => {
  const rows = wasteStreamsForConfig(ctx.config).filter((stream) => stream.enabled !== false && stream.entity);
  const emptySummaryStates = new Set([
    "", "unknown", "unavailable", "none", "no", "geen", "clear", "cleared", "null", "-", "n/a", "na",
    "nothing", "no collection", "no collections", "geen afval", "geen ophaling", "geen ophalingen",
  ]);
  const summaryValue = (entityId: string | undefined, enabled: boolean | undefined): string | undefined => {
    if (enabled !== true || !entityId) return undefined;
    const state = ctx.hass.states[entityId]?.state?.trim();
    if (!state || emptySummaryStates.has(state.toLowerCase())) return undefined;
    const normalized = state.replaceAll("_", " ").replace(/\s+/g, " ");
    return normalized.charAt(0).toLocaleUpperCase(ctx.hass.language) + normalized.slice(1);
  };
  const today = summaryValue(ctx.config.today_entity, ctx.config.show_today);
  const tomorrow = summaryValue(ctx.config.tomorrow_entity, ctx.config.show_tomorrow);
  const collectionDate = (entity?: HassEntity): string => {
    if (!entity || ["unknown", "unavailable", "none", "geen"].includes(entity.state.toLowerCase())) return "—";
    if (entity.entity_id.startsWith("calendar.")) {
      const dateValue = attr(entity, "start_time") ?? attr(entity, "start") ?? attr(entity, "end_time");
      if (typeof dateValue === "string") {
        const date = new Date(dateValue);
        if (!Number.isNaN(date.getTime())) {
          return new Intl.DateTimeFormat(ctx.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
        }
      }
    }
    return entity.state;
  };
  return ctx.actionSurface("custom-waste-card", html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, "mdi:trash-can-outline", "green")}
      <span class="ulm-copy">
        <span class="ulm-name">${ctx.config.name || configured<string>(ctx, "ulm_volgende_ophaling") || "Next collections"}</span>
        ${today || tomorrow ? html`
          <span class="ulm-label waste-summary">
            ${today ? html`<span>Today: ${today}</span>` : nothing}
            ${tomorrow ? html`<span>Tomorrow: ${tomorrow}</span>` : nothing}
          </span>
        ` : nothing}
      </span>
    </div>
    <div class="waste-grid">${rows.map((stream) => {
      const entity = stream.entity ? ctx.hass.states[stream.entity] : undefined;
      return html`<span class="waste-row" style=${`--waste-color:${stream.color || "#43a047"}`}>
        <ha-icon .icon=${stream.icon || "mdi:trash-can"}></ha-icon>
        <b>${stream.label || entity?.attributes.friendly_name || stream.entity}</b>
        <small>${collectionDate(entity)}</small>
      </span>`;
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
  const unavailable = !timeEntity || ["unknown", "unavailable"].includes(timeEntity.state.toLowerCase());
  const collapsed = configured<boolean>(ctx, "ulm_card_alarm_time_collapse") === true &&
    !activeStates.has(ctx.entity?.state ?? "");
  return ctx.actionSurface(`custom-alarm-time ${configured<boolean>(ctx, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, configured<string>(ctx, "ulm_card_alarm_time_icon") || "mdi:alarm", "grey")}
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    ${collapsed ? nothing : html`<div class="alarm-time-controls">
      ${button(`Earlier by ${step} minutes`, "mdi:minus", (event) => { event.stopPropagation(); setMinutes(-step); }, unavailable)}
      <b>${current.slice(0, 5)}</b>
      ${button(`Later by ${step} minutes`, "mdi:plus", (event) => { event.stopPropagation(); setMinutes(step); }, unavailable)}
    </div>`}
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
    <div class="apex-chart">${series.map((entity, index) =>
      html`<span class="apex-line tone-${colors[index]}">${sparkline(ctx, false, entity)}</span>`)}
      <span class="apex-grid-line line-1"></span><span class="apex-grid-line line-2"></span><span class="apex-grid-line line-3"></span>
    </div>
  `);
};

const renderChromecast = (ctx: RenderContext): TemplateResult => {
  const unavailable = !ctx.entity || ctx.entity.state === "unavailable";
  const playing = ctx.entity?.state === "playing";
  return ctx.actionSurface("custom-chromecast", html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, "mdi:cast", unavailable ? "grey" : "blue")}
      ${heading(ctx, stateLabel(ctx.entity))}
    </div>
    <div class="chromecast-controls">
      ${button("Toggle power", "mdi:power", (event) => { event.stopPropagation(); ctx.service("media_player", "toggle", { entity_id: ctx.config.entity }); }, unavailable)}
      ${button("Play or pause", playing ? "mdi:pause" : "mdi:play", (event) => { event.stopPropagation(); ctx.service("media_player", "media_play_pause", { entity_id: ctx.config.entity }); }, unavailable)}
      ${button("Toggle input", "mdi:video-input-hdmi", (event) => { event.stopPropagation(); ctx.service("media_player", "toggle", { entity_id: ctx.config.entity }); }, unavailable)}
    </div>
  `);
};

const renderPowerDetails = (ctx: RenderContext): TemplateResult => {
  const hours = numeric(configured(ctx, "ulm_card_power_details_hours")) ?? ctx.config.graph_hours ?? 2;
  const chartHeight = numeric(configured(ctx, "ulm_card_power_details_height")) ?? 180;
  const graphEntity = entityFromConfig(ctx, "ulm_card_power_details_entity") ?? ctx.entity;
  return ctx.actionSurface("custom-power-details", html`
    <div class="power-details-content" style=${`min-height:${chartHeight + 66}px`}>
      <div class="power-details-heading">
        ${iconBubble(ctx, "mdi:flash", "grey")}
        ${heading(ctx, `${hours === 1 ? "In the last hour" : `In the last ${hours} hours`}`)}
      </div>
      <b class="power-details-value">${stateLabel(graphEntity)}</b>
      <div class="power-details-chart" style=${`height:${chartHeight}px`}>${sparkline(ctx, true, graphEntity)}</div>
    </div>
  `);
};

const trackerIcon = (type: string | undefined, home: boolean): string =>
  type === "bluetooth" ? (home ? "mdi:bluetooth" : "mdi:bluetooth-off") :
    type === "lan" || type === "wifi" ? (home ? "mdi:lan-connect" : "mdi:lan-disconnect") :
      home ? "mdi:home-variant" : "mdi:home-minus";

const renderDeviceTrackerCard = (ctx: RenderContext): TemplateResult => {
  const tracker1 = entityFromConfig(ctx, "ulm_custom_card_device_tracker_tracker_1_entity") ?? ctx.entity;
  const tracker2 = entityFromConfig(ctx, "ulm_custom_card_device_tracker_tracker_2_entity");
  return ctx.actionSurface("custom-device-tracker", html`
    <span class="device-tracker-icon">
      <ha-icon .icon=${configured<string>(ctx, "ulm_custom_card_device_tracker_icon") || "mdi:cellphone"}></ha-icon>
      ${tracker1 ? html`<i class="tracker-badge tracker-one ${tracker1.state === "home" ? "is-home" : "is-away"}" title=${stateLabel(tracker1)}><ha-icon .icon=${trackerIcon(configured(ctx, "ulm_custom_card_device_tracker_tracker_1_type"), tracker1.state === "home")}></ha-icon></i>` : nothing}
      ${tracker2 ? html`<i class="tracker-badge tracker-two ${tracker2.state === "home" ? "is-home" : "is-away"}" title=${stateLabel(tracker2)}><ha-icon .icon=${trackerIcon(configured(ctx, "ulm_custom_card_device_tracker_tracker_2_type"), tracker2.state === "home")}></ha-icon></i>` : nothing}
    </span>
    <span class="ulm-copy"><b class="ulm-name">${displayName(ctx.config, ctx.entity)}</b><span class="ulm-label">${ctx.entity?.state === "home" ? "Present" : ctx.entity?.state === "not_home" ? "Away" : stateLabel(ctx.entity)}</span></span>
  `);
};

const groupMembers = (ctx: RenderContext, entity: HassEntity | undefined): HassEntity[] => {
  const ids = attr(entity, "entity_id");
  return Array.isArray(ids)
    ? ids.map(String).map((id) => ctx.hass.states[id]).filter((state): state is HassEntity => Boolean(state))
    : entity ? [entity] : [];
};

const renderRoomView = (ctx: RenderContext): TemplateResult => {
  const named = (key: string): HassEntity | undefined => entityFromConfig(ctx, key);
  const temperature = named("temperature");
  const humidity = named("humidity");
  const groups = {
    doors: named("group_doors"), windows: named("group_windows"), motions: named("group_motions"),
    water: named("group_water"), lights: named("group_lights"), shutters: named("group_windows_shutters"),
    outlets: named("group_outlets"), tv: named("group_tv"),
  };
  const lowBatteries = Object.values(groups).flatMap((group) => groupMembers(ctx, group))
    .filter((entity) => (numeric(attr(entity, "battery")) ?? 101) <= 20);
  const unavailable = Object.values(groups).flatMap((group) => groupMembers(ctx, group))
    .filter((entity) => entity.state === "unavailable");
  const countOn = (entity: HassEntity | undefined): number =>
    groupMembers(ctx, entity).filter((member) => member.state === "on" || member.state === "open").length;
  const moreInfo = (event: Event, entity?: HassEntity): void => {
    if (entity) runControlAction(event, ctx, { action: "more-info" }, entity.entity_id);
  };
  const toggle = (event: Event, entity?: HassEntity): void => {
    if (entity && entity.state !== "unavailable") runControlAction(event, ctx, { action: "toggle" }, entity.entity_id);
  };
  const sensorSlots = [
    [groups.doors, "mdi:door-open"], [groups.windows, "mdi:window-open-variant"],
    [groups.motions, "mdi:motion-sensor"], [groups.water, "mdi:water"],
  ] as const;
  const deviceSlots = [
    [groups.lights, groups.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    [groups.shutters, groups.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    [groups.outlets, groups.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    [groups.tv, groups.tv?.state === "on" ? "mdi:television" : "mdi:television-off"],
  ] as const;
  return ctx.actionSurface("custom-room-view", html`
    <div class="room-view-summary" @click=${(event: Event) => moreInfo(event, temperature ?? humidity)}>
      <span class="room-view-icon"><ha-icon .icon=${ctx.config.icon || "mdi:home-variant-outline"}></ha-icon>${unavailable.length ? html`<i>${unavailable.length}</i>` : nothing}</span>
      <span><b><ha-icon icon="mdi:thermometer"></ha-icon>${stateLabel(temperature)}</b><small><ha-icon icon="mdi:water-percent"></ha-icon>${stateLabel(humidity)}</small></span>
    </div>
    <div class="room-view-status">
      ${sensorSlots.map(([entity, sensorIcon]) => entity && countOn(entity) ? html`<button aria-label=${displayName({ type: "", entity: entity.entity_id }, entity)} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => moreInfo(event, entity)}><ha-icon .icon=${sensorIcon}></ha-icon>${countOn(entity) > 1 ? html`<i>${countOn(entity)}</i>` : nothing}</button>` : nothing)}
      ${lowBatteries.length ? html`<button aria-label="Low batteries" @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => moreInfo(event, lowBatteries[0])}><ha-icon icon="mdi:battery-20"></ha-icon><i>${lowBatteries.length}</i></button>` : nothing}
      ${!sensorSlots.some(([entity]) => countOn(entity)) && !lowBatteries.length ? html`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : nothing}
    </div>
    <div class="room-view-actions">
      ${deviceSlots.map(([entity, deviceIcon]) => entity ? html`
        <button class=${entity.state === "on" ? "is-active" : ""} aria-label=${displayName({ type: "", entity: entity.entity_id }, entity)}
          ?disabled=${entity.state === "unavailable"} @pointerdown=${(event: Event) => event.stopPropagation()}
          @dblclick=${(event: Event) => toggle(event, entity)} @click=${(event: Event) => event.stopPropagation()}>
          <ha-icon .icon=${entity.state === "unavailable" ? "mdi:exclamation-thick" : deviceIcon}></ha-icon>
          ${countOn(entity) ? html`<i>${countOn(entity)}</i>` : nothing}
        </button>` : nothing)}
    </div>
  `);
};

const relativeDuration = (entity: HassEntity | undefined): string => {
  if (!entity) return "Entity unavailable";
  const hasDate = attr(entity, "has_date") === true;
  const hasTime = attr(entity, "has_time") === true;
  let then: number;
  if (hasDate) then = Date.parse(entity.state.replace(" ", "T"));
  else {
    const [stateHour, stateMinute, stateSecond] = entity.state.split(":").map(Number);
    const date = new Date();
    date.setHours(
      numeric(attr(entity, "hour")) ?? stateHour,
      numeric(attr(entity, "minute")) ?? stateMinute,
      numeric(attr(entity, "second")) ?? stateSecond ?? 0,
      0,
    );
    then = date.getTime();
  }
  if (!Number.isFinite(then)) return stateLabel(entity);
  const difference = Date.now() - then;
  const days = Math.trunc(difference / 86_400_000);
  const hours = Math.trunc(Math.abs(difference) / 3_600_000 % 24);
  const minutes = Math.trunc(Math.abs(difference) / 60_000 % 60);
  const parts: string[] = [];
  if (hasDate && days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hasTime && hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (hasTime && !hasDate && minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  return parts.length ? `${parts.join(" ")} ago` : "just now";
};

const renderElapsedTime = (ctx: RenderContext): TemplateResult => ctx.actionSurface("custom-elapsed-time", html`
  ${iconBubble(ctx, "mdi:timer-sand", "grey")}
  <span class="ulm-copy"><b class="ulm-name">${displayName(ctx.config, ctx.entity)}</b><span class="ulm-label">${relativeDuration(ctx.entity)}</span></span>
`);

const renderErayLock = (ctx: RenderContext): TemplateResult => {
  const door = entityFromConfig(ctx, "ulm_custom_card_eraycetinay_lock_door_open");
  const battery = entityFromConfig(ctx, "ulm_custom_card_eraycetinay_lock_battery_level") ?? linkedState(ctx, "battery_entity");
  const state = ctx.entity?.state;
  const locked = state === "locked";
  const binaryBattery = configured<boolean>(ctx, "ulm_custom_card_eraycetinay_lock_battery_sensor_binary") === true;
  const binaryLowState = configured<string>(ctx, "ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state") ?? "on";
  const warning = numeric(configured(ctx, "ulm_custom_card_eraycetinay_lock_battery_warning")) ?? 20;
  const critical = numeric(configured(ctx, "ulm_custom_card_eraycetinay_lock_battery_warning_low")) ?? 5;
  const batteryValue = numeric(battery?.state);
  const low = binaryBattery ? battery?.state === binaryLowState : batteryValue !== undefined && batteryValue <= warning;
  const criticalLow = !binaryBattery && batteryValue !== undefined && batteryValue <= critical;
  const tapControl = configured<boolean>(ctx, "ulm_custom_card_eraycetinay_lock_tap_control") === true;
  const onlyOpen = configured<boolean>(ctx, "ulm_custom_card_eraycetinay_lock_only_open") === true;
  const activate = (event: Event): void => {
    event.stopPropagation();
    if (!ctx.config.entity) return;
    if (!tapControl) return runControlAction(event, ctx, { action: "more-info" }, ctx.config.entity);
    if (onlyOpen) ctx.service("lock", "open", { entity_id: ctx.config.entity });
    else if (state === "locked") ctx.service("lock", "unlock", { entity_id: ctx.config.entity });
    else if (state === "unlocked") ctx.service("lock", "lock", { entity_id: ctx.config.entity });
  };
  return ctx.actionSurface(`custom-eray-lock ${locked ? "is-locked" : "is-unlocked"}`, html`
    <button class="eray-lock-control" aria-label=${tapControl ? onlyOpen ? "Open lock" : locked ? "Unlock" : "Lock" : "More information"}
      ?disabled=${!ctx.entity || (tapControl && !onlyOpen && !["locked", "unlocked"].includes(state ?? ""))}
      @pointerdown=${(event: Event) => event.stopPropagation()} @click=${activate}>
      <span class="eray-lock-icon"><ha-icon .icon=${locked ? "mdi:lock" : "mdi:lock-open"}></ha-icon>
        ${locked && door?.state === "on" ? html`<i class="door-badge" title="Door is open while locked"><ha-icon icon="mdi:door-open"></ha-icon></i>` : nothing}
        ${low ? html`<i class="battery-badge ${criticalLow ? "is-critical" : ""}" title=${binaryBattery ? "Battery is low" : `Battery is at ${batteryValue}%`}><ha-icon icon="mdi:battery-low"></ha-icon></i>` : nothing}
      </span>
      ${heading(ctx, stateLabel(ctx.entity))}
    </button>
  `);
};

const renderEshWelcome = (ctx: RenderContext): TemplateResult => {
  const collapse = entityFromConfig(ctx, "ulm_card_esh_welcome_collapse");
  const weather = entityFromConfig(ctx, "ulm_weather");
  const collapsed = collapse?.state === "on";
  const items = Array.from({ length: 5 }, (_, index) => index + 1).map((index) => ({
    nav: configured<string>(ctx, `nav_${index}`),
    icon: configured<string>(ctx, `icon_${index}`) || "mdi:circle",
    name: configured<string>(ctx, `name_${index}`) || `Item ${index}`,
    color: configured<string>(ctx, `color_${index}`) || "blue",
  })).filter((item) => item.nav);
  return ctx.actionSurface("custom-esh-welcome", html`
    <div class="esh-welcome-toolbar">
      <button aria-label="Toggle welcome navigation" ?disabled=${!collapse}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => { event.stopPropagation(); if (collapse) ctx.service("input_boolean", "toggle", { entity_id: collapse.entity_id }); }}>
        <ha-icon .icon=${collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
      </button>
      <button aria-label="Weather information" ?disabled=${!weather}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => { if (weather) runControlAction(event, ctx, { action: "more-info" }, weather.entity_id); }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => runControlAction(event, ctx, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <b class="esh-greeting">Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},<br>${ctx.config.name || displayName(ctx.config, ctx.entity)}!</b>
    ${collapsed ? nothing : html`<div class="esh-welcome-items">${items.map((item) => html`
      <button class="tone-${item.color}" aria-label=${item.name}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => runControlAction(event, ctx, { action: "navigate", navigation_path: item.nav })}>
        <i><ha-icon .icon=${item.icon}></ha-icon></i><small>${item.name}</small>
      </button>
    `)}</div>`}
  `);
};

const renderEshRoom = (ctx: RenderContext): TemplateResult => {
  const light = entityFromConfig(ctx, "ulm_custom_card_esh_room_light_entity");
  const climate = entityFromConfig(ctx, "ulm_custom_card_esh_room_climate_entity");
  const cover = entityFromConfig(ctx, "ulm_custom_card_esh_room_cover_entity");
  const lightOn = light?.state === "on";
  const brightness = numeric(attr(light, "brightness"));
  const label = ctx.config.secondary || (light
    ? lightOn && brightness ? `${Math.round(brightness / 2.55)}%` : stateLabel(light)
    : stateLabel(ctx.entity));
  const rgb = attr(light, "rgb_color");
  const dynamic = configured<boolean>(ctx, "ulm_card_dynamic_color") === true && lightOn && Array.isArray(rgb);
  const toggle = (event: Event, entity?: HassEntity): void => {
    if (entity) runControlAction(event, ctx, { action: "toggle" }, entity.entity_id);
  };
  const control = (entity: HassEntity, kind: "light" | "climate" | "cover") => {
    const iconName = kind === "light"
      ? configured<string>(ctx, lightOn ? "ulm_card_esh_room_light_icon_on" : "ulm_card_esh_room_light_icon_off") || (lightOn ? "mdi:lightbulb" : "mdi:lightbulb-off")
      : kind === "cover"
        ? configured<string>(ctx, entity.state === "closed" ? "ulm_card_esh_room_cover_icon_closed" : "ulm_card_esh_room_cover_icon_open") || (entity.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open")
        : ({ auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[entity.state] ?? "mdi:thermostat");
    return html`<button class="esh-room-control ${kind} state-${entity.state}" aria-label=${displayName({ type: "", entity: entity.entity_id }, entity)}
      ?disabled=${entity.state === "unavailable"} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => toggle(event, entity)}>
      <ha-icon .icon=${iconName}></ha-icon>
    </button>`;
  };
  return ctx.actionSurface(`custom-esh-room ${lightOn ? "light-on" : ""} ${dynamic ? "dynamic-color" : ""}`, html`
    <div class="esh-room-main" style=${dynamic ? `--room-rgb:${rgb.slice(0, 3).join(",")};` : ""}>
      ${iconBubble(ctx, "mdi:sofa", lightOn ? "yellow" : "grey")}
      <span class="ulm-copy"><b class="ulm-name">${displayName(ctx.config, ctx.entity)}</b><span class="ulm-label">${label}</span></span>
    </div>
    <div class="esh-room-controls">
      ${light ? control(light, "light") : nothing}
      ${cover ? control(cover, "cover") : climate ? control(climate, "climate") : nothing}
    </div>
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
  const current = ctx.entity?.state ?? "off";
  const supportedModes = Array.isArray(attr(ctx.entity, "hvac_modes"))
    ? attr(ctx.entity, "hvac_modes") as string[]
    : ["off", "heat", "cool", "heat_cool", "dry", "fan_only"];
  const fanModes = Array.isArray(attr(ctx.entity, "fan_modes"))
    ? attr(ctx.entity, "fan_modes") as string[]
    : [];
  const modes = [
    { mode: "off", icon: "mdi:power", label: current === "off" ? "Turn on" : "Turn off", tone: "grey" },
    { mode: "heat", icon: "mdi:fire", label: "Heat mode", tone: "red" },
    { mode: "cool", icon: "mdi:snowflake", label: "Cool mode", tone: "blue" },
    { mode: "heat_cool", icon: "mdi:sync", label: "Automatic mode", tone: "green" },
    { mode: "dry", icon: "mdi:water", label: "Dry mode", tone: "orange" },
    { mode: "fan_only", icon: "mdi:fan", label: "Fan mode", tone: "purple" },
  ] as const;
  const modeIcon = current === "off"
    ? "mdi:thermostat"
    : modes.find(({ mode }) => mode === current)?.icon ?? "mdi:thermostat";
  const modeTone = modes.find(({ mode }) => mode === current)?.tone ?? "grey";
  const temperature = attr(ctx.entity, "current_temperature");
  const action = String(attr(ctx.entity, "hvac_action") ?? current).replaceAll("_", " ");
  const activateMode = (event: Event, mode: string): void => {
    event.stopPropagation();
    if (!ctx.config.entity) return;
    if (mode === "off") {
      if (current === "off") {
        const nextMode = supportedModes.find((candidate) => candidate !== "off");
        if (nextMode) ctx.service("climate", "set_hvac_mode", { entity_id: ctx.config.entity, hvac_mode: nextMode });
        else ctx.service("climate", "turn_on", { entity_id: ctx.config.entity });
      } else if (supportedModes.includes("off")) {
        ctx.service("climate", "set_hvac_mode", { entity_id: ctx.config.entity, hvac_mode: "off" });
      } else {
        ctx.service("climate", "turn_off", { entity_id: ctx.config.entity });
      }
      return;
    }
    if (mode === "fan_only" && !supportedModes.includes("fan_only") && fanModes.length) {
      ctx.service("climate", "set_fan_mode", { entity_id: ctx.config.entity, fan_mode: fanModes[0] });
      return;
    }
    ctx.service("climate", "set_hvac_mode", { entity_id: ctx.config.entity, hvac_mode: mode });
  };
  return ctx.actionSurface("custom-heat-pump", html`
    <div class="heat-pump-header">
      <span class="heat-pump-icon tone-${modeTone}"><ha-icon .icon=${modeIcon}></ha-icon></span>
      <span class="ulm-copy">
        <span class="ulm-name">${displayName(ctx.config, ctx.entity)}</span>
        <span class="ulm-label">${temperature ?? "null"}° • ${current.replaceAll("_", " ")} (${action})</span>
      </span>
    </div>
    <div class="heat-pump-target">
      ${button("Decrease target temperature", "mdi:arrow-down", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: target - step }); })}
      <b>${target}°C</b>
      ${button("Increase target temperature", "mdi:arrow-up", (event) => { event.stopPropagation(); ctx.service("climate", "set_temperature", { entity_id: ctx.config.entity, temperature: target + step }); })}
    </div>
    <div class="heat-pump-modes">${modes.map(({ mode, icon: controlIcon, label, tone }) => {
      const supported = mode === "off" || supportedModes.includes(mode) || (mode === "fan_only" && fanModes.length > 0);
      return html`
      <button
        aria-label=${label}
        class="tone-${tone} ${current === mode ? "is-active" : ""}"
        ?disabled=${!supported}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => activateMode(event, mode)}
      ><ha-icon .icon=${controlIcon}></ha-icon></button>
    `})}</div>
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
  const hasUpdate = rows.some(([, entity]) => ["on", "true"].includes(entity?.state.toLowerCase() ?? ""));
  const availableEntities = rows.map(([, entity]) => entity).filter((entity): entity is HassEntity =>
    Boolean(entity && !["unknown", "unavailable"].includes(entity.state.toLowerCase())));
  const detailsEntity = availableEntities.find((entity) => ["on", "true"].includes(entity.state.toLowerCase())) ??
    availableEntities[0];
  const version = (entity?: HassEntity): string => {
    if (!entity) return "Unavailable";
    const installed = String(attr(entity, "installed_version") ?? entity.state);
    const latest = attr(entity, "latest_version");
    return ["on", "true"].includes(entity.state.toLowerCase()) && latest
      ? `${installed} → ${String(latest)}`
      : installed;
  };
  return ctx.actionSurface("custom-ha-updates", html`
    <div class="ha-updates-summary">
      <span class="ha-updates-icon ${hasUpdate ? "has-update" : ""}">
        <ha-icon icon="mdi:home-assistant"></ha-icon>
        ${hasUpdate ? html`<span class="ha-updates-badge"><ha-icon icon="mdi:party-popper"></ha-icon></span>` : nothing}
      </span>
      <span class="ulm-copy">
        <span class="ulm-name">${hasUpdate ? "Updates available!" : "No updates available"}</span>
        <span class="ha-update-list">${rows.map(([label, entity]) => html`
          <span><b>${label}:</b> ${version(entity)}</span>
        `)}</span>
      </span>
    </div>
    <div class="ha-update-actions">
      <button aria-label="Open Home Assistant release notes" @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => runControlAction(event, ctx, { action: "url", url_path: "https://www.home-assistant.io/latest-release-notes/" })}>
        <ha-icon icon="mdi:file-document"></ha-icon>
      </button>
      <button aria-label="Open update settings" @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => runControlAction(event, ctx, { action: "navigate", navigation_path: "/config/updates" })}>
        <ha-icon icon="mdi:cog"></ha-icon>
      </button>
      <button aria-label="Open available update" ?disabled=${!detailsEntity}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => detailsEntity && runControlAction(event, ctx, { action: "more-info" }, detailsEntity.entity_id)}>
        <ha-icon icon="mdi:update"></ha-icon>
      </button>
    </div>
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
  const disk = linkedState(ctx, "disk_entity") ?? entityFromConfig(ctx, "entity_4");
  const temperature = linkedState(ctx, "temperature_entity") ?? entityFromConfig(ctx, "entity_1");
  const memory = linkedState(ctx, "memory_entity") ?? entityFromConfig(ctx, "entity_2");
  const cpu = linkedState(ctx, "cpu_entity") ?? entityFromConfig(ctx, "entity_3");
  const online = !["off", "unavailable", "unknown"].includes(ctx.entity?.state ?? "");
  const colorValue = (key: string, fallback: string): string => {
    const value = configured<string>(ctx, key) || fallback;
    return {
      red: "#ff3b49",
      orange: "#ff8a00",
      yellow: "#ffb300",
      blue: "#4267ff",
      green: "#00c968",
    }[value] ?? value;
  };
  const configuredColor = (key: string): string | undefined => configured<string>(ctx, key);
  const legacyMax = (key: string): number | undefined => {
    const value = ctx.config[key];
    return value && typeof value === "object" && "max_value" in value ? numeric(value.max_value) : undefined;
  };
  const ring = (entity: HassEntity | undefined, radius: number, color: string, max = 100) => {
    const value = Math.max(0, Math.min(max, numeric(entity?.state) ?? 0));
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - value / max);
    return svg`<circle class="nik-nas-ring-value" cx="70" cy="70" r=${radius}
      fill="none" stroke=${color} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${circumference} stroke-dashoffset=${offset}></circle>`;
  };
  const status = ctx.entity?.state === "on" ? "Access" : stateLabel(ctx.entity);
  const statusTile = html`
    <button class="nik-nas-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(event: Event) => event.stopPropagation()}
      @click=${(event: Event) => runControlAction(event, ctx, { action: "more-info" })}>
      <span class="nik-nas-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${status}</small></span>
    </button>`;
  if (!online) return ctx.actionSurface("custom-nik-nas is-off", html`<div class="nik-nas-top">${statusTile}</div>`);
  return ctx.actionSurface("custom-nik-nas is-on", html`
    <div class="nik-nas-top">
      ${statusTile}
      <div class="nik-nas-tile disk-tile">
        <span class=${`nik-nas-tile-icon ${configuredColor("disk_color") ? "" : "tone-red"}`}
          style=${configuredColor("disk_color")
            ? `color:${colorValue("disk_color", "red")};background:color-mix(in srgb, ${colorValue("disk_color", "red")} 18%, transparent)`
            : ""}>
          <ha-icon .icon=${configured<string>(ctx, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${configured<string>(ctx, "disk_name") || "Disk"}</b><small>${stateLabel(disk)}</small></span>
      </div>
    </div>
    <div class="nik-nas-body">
      <div class="nik-nas-metrics">
        <span><i class=${configuredColor("temperature_color") ? "" : "tone-orange"} style=${configuredColor("temperature_color") ? `color:${colorValue("temperature_color", "orange")}` : ""}><ha-icon .icon=${configured<string>(ctx, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${configured<string>(ctx, "temperature_name") || "Temp"}</b><small>${stateLabel(temperature)}</small></span></span>
        <span><i class=${configuredColor("memory_color") ? "" : "tone-blue"} style=${configuredColor("memory_color") ? `color:${colorValue("memory_color", "blue")}` : ""}><ha-icon .icon=${configured<string>(ctx, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${configured<string>(ctx, "memory_name") || "Memory"}</b><small>${stateLabel(memory)}</small></span></span>
        <span><i class=${configuredColor("cpu_color") ? "" : "tone-green"} style=${configuredColor("cpu_color") ? `color:${colorValue("cpu_color", "green")}` : ""}><ha-icon .icon=${configured<string>(ctx, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${configured<string>(ctx, "cpu_name") || "CPU"}</b><small>${stateLabel(cpu)}</small></span></span>
      </div>
      <svg class="nik-nas-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((radius) => svg`<circle class="nik-nas-ring-track" cx="70" cy="70" r=${radius}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${ring(temperature, 58, colorValue("temperature_color", "orange"), numeric(configured(ctx, "temperature_max")) ?? legacyMax("entity_1") ?? 100)}
        ${ring(memory, 48, colorValue("memory_color", "blue"), numeric(configured(ctx, "memory_max")) ?? legacyMax("entity_2") ?? 100)}
        ${ring(cpu, 38, colorValue("cpu_color", "green"), numeric(configured(ctx, "cpu_max")) ?? legacyMax("entity_3") ?? 100)}
      </svg>
    </div>
  `);
};

const renderNikTablet = (ctx: RenderContext): TemplateResult => {
  const batteryEntity = linkedState(ctx, "battery_entity");
  const battery = Math.max(0, Math.min(100, numeric(batteryEntity?.state) ?? 0));
  const controls = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"],
  ] as const;
  const metricCandidates: Array<readonly [string, HassEntity | undefined]> = [
    ["RAM", linkedState(ctx, "tablet_ram_entity")],
    ["Disk", linkedState(ctx, "tablet_disk_entity")],
    ["Power", linkedState(ctx, "tablet_power_entity")],
  ];
  const metricEntities: Array<readonly [string, HassEntity]> = metricCandidates.flatMap(
    ([label, entity]) => entity ? [[label, entity] as const] : [],
  );
  const configuredControls: Array<readonly [string, string, string, HassEntity]> = controls.flatMap(
    ([key, controlIcon, tone, label]) => {
      const entity = linkedState(ctx, key);
      return entity ? [[controlIcon, tone, label, entity] as const] : [];
    },
  );
  const status = ctx.entity?.state === "on" ? "Access" : stateLabel(ctx.entity);
  const activateTabletControl = (event: Event, entity?: HassEntity): void => {
    event.stopPropagation();
    if (!entity) return;
    const domain = entity.entity_id.split(".")[0];
    if (domain === "button") ctx.service("button", "press", { entity_id: entity.entity_id });
    else ctx.service("homeassistant", "toggle", { entity_id: entity.entity_id });
  };
  return ctx.actionSurface("custom-nik-tablet", html`
    <div class="nik-tablet-header">
      <span class="nik-tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      <span class="ulm-copy"><span class="ulm-name">${displayName(ctx.config, ctx.entity)}</span><span class="ulm-label">${status}</span></span>
    </div>
    ${configuredControls.length ? html`<div class="nik-tablet-controls">${configuredControls.map(([controlIcon, tone, label, entity]) => {
      const unavailable = entity.state.toLowerCase() === "unavailable";
      return html`<button class="tone-${tone} ${activeStates.has(entity.state) ? "is-active" : ""}"
        aria-label=${label} ?disabled=${unavailable}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => activateTabletControl(event, entity)}>
        <ha-icon .icon=${controlIcon}></ha-icon>
      </button>`;
    })}</div>` : nothing}
    ${metricEntities.length ? html`<div class="nik-tablet-metrics">${metricEntities.map(([label, entity]) => html`
      <span class=${entity.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${stateLabel(entity)}</b><small>${label}</small></span>
    `)}</div>` : nothing}
    ${batteryEntity ? html`<div class="nik-tablet-battery-row">
      <span class="nik-tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${stateLabel(batteryEntity)}</b><small>Battery</small></span>
    </div>
    <div class="nik-tablet-battery-bar"><i style=${`width:${battery}%`}></i><b>${battery}%</b></div>` : nothing}
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
  const battery = entityFromConfig(ctx, "ulm_card_person_battery_entity") ?? linkedState(ctx, "battery_entity");
  const batteryState = entityFromConfig(ctx, "ulm_card_person_battery_state_entity");
  const driving = entityFromConfig(ctx, "ulm_card_person_driving_entity");
  const zone1 = entityFromConfig(ctx, "ulm_card_person_zone1");
  const zone2 = entityFromConfig(ctx, "ulm_card_person_zone2");
  const address = entityFromConfig(ctx, "ulm_address");
  const locality = entityFromConfig(ctx, "ulm_address_locality");
  const commute = entityFromConfig(ctx, "ulm_card_person_commute_entity");
  const usePicture = configured<boolean>(ctx, "ulm_card_person_use_entity_picture", "use_entity_picture") ?? small;
  const picture = usePicture ? String(attr(ctx.entity, "entity_picture") || "") : "";
  const batteryLevel = numeric(battery?.state);
  const charging = batteryState?.state.toLowerCase() === "charging";
  const danger = configured<number>(ctx, "ulm_card_battery_battery_level_danger") ?? 15;
  const warning = configured<number>(ctx, "ulm_card_battery_battery_level_warning") ?? 30;
  const batteryTone = batteryLevel === undefined ? "grey" : batteryLevel <= danger ? "red" : batteryLevel <= warning ? "yellow" : "green";
  const batteryIcon = batteryLevel === undefined ? "mdi:battery-off" :
    charging ? "mdi:battery-charging" :
      batteryLevel >= 95 ? "mdi:battery" :
        batteryLevel < 10 ? "mdi:battery-outline" :
          `mdi:battery-${Math.floor(batteryLevel / 10) * 10}`;
  const personState = ctx.entity?.state ?? "unknown";
  const zoneForState = [zone1, zone2].find((zone) => zone?.attributes.friendly_name === personState);
  const drivingNow = driving?.state === "on";
  const badgeIcon = drivingNow ? "mdi:car" :
    personState === "home" ? "mdi:home-variant" :
      zoneForState ? String(attr(zoneForState, "icon") || "mdi:map-marker") : "mdi:home-minus";
  const badgeTone = drivingNow ? "red" : personState === "home" ? "blue" : "yellow";
  const location = address ? stateLabel(address) :
    locality && typeof attr(locality, "Locality") === "string" ? String(attr(locality, "Locality")) :
      drivingNow ? `Driving - ${personState.replaceAll("_", " ")}` :
        personState.replaceAll("_", " ");
  const avatar = html`
    <span class="person-info-avatar ${picture ? "has-picture" : ""}" style=${picture ? `background-image:url("${picture}")` : ""}>
      ${picture ? nothing : html`<ha-icon .icon=${configured<string>(ctx, "ulm_card_person_icon") || "mdi:face-man"}></ha-icon>`}
      <i class="person-info-badge tone-${badgeTone}"><ha-icon .icon=${badgeIcon}></ha-icon></i>
    </span>`;
  if (small) return ctx.actionSurface("custom-person-info-small is-compact", html`
    <div class="person-info-small-top">
      ${avatar}
      <span class="person-info-small-battery tone-${batteryTone}">
        <ha-icon .icon=${batteryIcon}></ha-icon>
      </span>
    </div>
    <span class="person-info-small-copy">
      <b>${displayName(ctx.config, ctx.entity)}</b>
      <small>${location}</small>
    </span>
  `);
  const multiline = configured<boolean>(ctx, "ulm_multiline") ?? true;
  return ctx.actionSurface(`custom-person-info ${multiline ? "is-multiline" : "is-inline"}`, html`
    <div class="person-info-main">
      ${avatar}
      <span class="ulm-copy">
        <span class="ulm-name">${displayName(ctx.config, ctx.entity)}</span>
        <span class="ulm-label">${location}</span>
      </span>
    </div>
    <div class="person-info-details">
      ${battery ? html`<span class="person-info-detail tone-${batteryTone}"><ha-icon .icon=${batteryIcon}></ha-icon><b>${batteryLevel ?? "—"}%</b></span>` : nothing}
      ${commute ? html`<span class="person-info-detail commute-detail"><ha-icon .icon=${configured<string>(ctx, "ulm_card_person_cummute_icon") || "mdi:car"}></ha-icon><b>${stateLabel(commute)}${commute.attributes.unit_of_measurement ? "" : " min"}</b></span>` : nothing}
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

const renderGeneric = (ctx: RenderContext): TemplateResult => ctx.actionSurface(`ulm-row ulm-generic ${configured<boolean>(ctx, "ulm_card_generic_force_background_color") === true ? "force-background" : ""}`, html`
  ${iconBubble(ctx, "mdi:information-outline", activeStates.has(ctx.entity?.state ?? "") ? "blue" : "grey")}
  ${valueThenName(ctx)}
`);

const renderGenericSwap = (ctx: RenderContext): TemplateResult => ctx.actionSurface(`ulm-row ulm-generic-swap ${configured<boolean>(ctx, "ulm_card_generic_swap_force_background_color") === true ? "force-background" : ""}`, html`
  ${heading(ctx, stateLabel(ctx.entity))}
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
    case "card_light": return renderLight(ctx);
    case "card_media_player": return renderMedia(ctx);
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
    case "custom_card_esh_room": return renderEshRoom(ctx);
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
