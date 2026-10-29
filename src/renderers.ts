import { html, nothing, svg, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import type { ActionConfig, AdditionConfig, AdditionItemConfig, CatalogItem, HassEntity, HomeAssistant, WeatherForecast } from "./types";
import { controlActions } from "./control-actions";
import { localize, localizeText } from "./localize";
import { ROOM_STATUS_KINDS, ROOM_STATUS_LIMIT, roomEntityIcon, roomEntityUnavailable, roomItemDefaultsFor, roomLightEntity, roomLightRgb, roomSecondary, roomStatusActive, roomStatusIcon, roomStatusKind } from "./room";
import { activeStates, cssUrl, displayName, fireEvent, hasOnOffState, stateLabel } from "./helpers";
import { wasteStreamsForConfig } from "./waste-streams";
import { defaultIconFor } from "./defaults";
import { renderEntityIcon } from "./entity-icon";
import { resolveColor } from "./colors";
import { rangeProgress, updateRangeProgress } from "./control-styles";
import {
  resolveSonosControlEntities,
  SONOS_NUMBER_CONTROLS,
  SONOS_SWITCH_CONTROLS,
  SONOS_MEDIA_FEATURES,
} from "./sonos-controls";
import { FLOWER_BARS, flowerBarsForConfig, flowerEntityConfigKey, type FlowerBarKey } from "./flower";
import {
  consolePlatformPresentation,
  inferConsolePlatform,
  resolveConsoleEntities,
} from "./console";
import {
  energyArcPath,
  energyBarPath,
  formatPower,
  numericEntityState,
  powerEntityWatts,
  tariffIntervals,
} from "./energy-management";
import { energyPriceBounds, energyPriceSlots, energyTradeResult, formatEnergyPrice } from "./energy-buy-sell";
import type { EnergyTradeSelection } from "./energy-buy-sell";
import { inverterPanelEntities, panelGaugeColor, panelGaugePercent, summarizePanels } from "./panel-health";
import "./entity-carousel";
import { areaSceneItems } from "./light-area";
import { readUpcomingData, upcomingItems } from "./upcoming-media";
import "./remote-card";
import "./pi-hole";
import "./stock";

export interface RenderContext {
  config: AdditionConfig;
  descriptor: CatalogItem;
  hass: HomeAssistant;
  entity?: HassEntity;
  forecast?: WeatherForecast[];
  presentation: { rendered: boolean };
  actionSurface: (classes: string, content: TemplateResult, style?: string) => TemplateResult;
  service: (domain: string, service: string, data?: Record<string, unknown>) => void;
}

const attr = (entity: HassEntity | undefined, key: string): unknown => entity?.attributes[key];
const timeGreeting = (hass: HomeAssistant, hour: number): string =>
  localize(hass, hour < 12 ? "ui.greeting_morning" : hour < 18 ? "ui.greeting_afternoon" : "ui.greeting_evening");
const numeric = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const sourceIconBubble = (
  ctx: RenderContext,
  iconName: string,
  color: string,
  active: boolean,
  extraClass = "",
) => {
  if (ctx.config.icon_type === "none") return nothing;
  const picture = ctx.config.icon_type === "entity-picture" ? attr(ctx.entity, "entity_picture") : undefined;
  return picture
    ? html`<span class="ulm-icon entity-picture ${extraClass}" style=${styleMap({ backgroundImage: cssUrl(picture) })}></span>`
    : html`<span class="ulm-icon source-icon ${active ? "is-source-active" : ""} ${extraClass}"
        style=${`--source-color:${color}`}>
        ${renderEntityIcon(ctx.hass, ctx.entity, ctx.config.icon ||
          (ctx.descriptor.upstreamId === "card_battery" ? ctx.entity?.attributes.icon || iconName : undefined), iconName)}
      </span>`;
};

const configuredEntity = (ctx: RenderContext, key: string): HassEntity | undefined => {
  const entityId = configured<string>(ctx, key);
  return entityId ? ctx.hass.states[entityId] : undefined;
};

const batteryIcon = (level: number | undefined, infix: string): string => {
  if (level === undefined) return "mdi:battery-off";
  if (level <= 0 && !infix) return "mdi:battery-alert-variant-outline";
  if (level >= 100) return "mdi:battery";
  if (level <= 0) return `mdi:battery${infix}-outline`;
  const step = Math.max(10, Math.min(90, Math.round(level / 10) * 10));
  return `mdi:battery${infix}-${step}`;
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
const icon = (ctx: RenderContext, fallback: string): string =>
  ctx.config.icon || ctx.entity?.attributes.icon || defaultIconFor(ctx.descriptor, ctx.entity) || fallback;
const iconBubble = (ctx: RenderContext, fallback: string, tone = "blue", extraClass = "") => {
  if (ctx.config.icon_type === "none") return nothing;
  const picture = ctx.config.icon_type === "entity-picture" ? attr(ctx.entity, "entity_picture") : undefined;
  return picture
    ? html`<span class="ulm-icon entity-picture ${extraClass}" style=${styleMap({ backgroundImage: cssUrl(picture) })}></span>`
    : html`<span class="ulm-icon tone-${tone} ${extraClass}">${renderEntityIcon(ctx.hass, ctx.entity, ctx.config.icon, fallback)}</span>`;
};
const relativeTime = (ctx: RenderContext, timestamp: string): TemplateResult =>
  html`<ha-relative-time .hass=${ctx.hass} .datetime=${timestamp}>${new Date(timestamp).toLocaleString(ctx.hass.language)}</ha-relative-time>`;
const selectedSecondary = (ctx: RenderContext, recommended?: string | TemplateResult): string | TemplateResult | undefined => {
  switch (ctx.config.secondary_info) {
    case "none": return undefined;
    case "name": return displayName(ctx.config, ctx.entity, ctx.hass);
    case "state": return stateLabel(ctx.entity, ctx.hass);
    case "last-changed": return ctx.entity?.last_changed
      ? relativeTime(ctx, ctx.entity.last_changed)
      : localizeText(ctx.hass, "Last changed unavailable");
    case "last-updated": return ctx.entity?.last_updated
      ? relativeTime(ctx, ctx.entity.last_updated)
      : localizeText(ctx.hass, "Last updated unavailable");
    default: return ctx.config.secondary || recommended;
  }
};
const selectedPrimary = (ctx: RenderContext, recommended?: string): string | TemplateResult => {
  switch (ctx.config.primary_info) {
    case "none": return "";
    case "state": return stateLabel(ctx.entity, ctx.hass);
    case "last-changed": return ctx.entity?.last_changed
      ? relativeTime(ctx, ctx.entity.last_changed)
      : localizeText(ctx.hass, "Last changed unavailable");
    case "last-updated": return ctx.entity?.last_updated
      ? relativeTime(ctx, ctx.entity.last_updated)
      : localizeText(ctx.hass, "Last updated unavailable");
    default: return displayName(ctx.config, ctx.entity, ctx.hass) || recommended || "";
  }
};
const presentationValues = (
  ctx: RenderContext,
  recommendedSecondary?: string | TemplateResult,
  recommendedPrimary?: string,
): { primary?: string | TemplateResult; secondary?: string | TemplateResult } => {
  ctx.presentation.rendered = true;
  const configuredName = displayName(ctx.config, ctx.entity, ctx.hass);
  const hasMushroomName = ctx.config.name !== undefined && typeof ctx.config.name !== "string";
  return {
    primary: (
      ctx.config.primary_info === undefined
        ? (hasMushroomName && configuredName ? configuredName : recommendedPrimary ?? configuredName)
        : selectedPrimary(ctx, recommendedPrimary)
    ) || undefined,
    secondary: ctx.config.secondary_info === undefined
      ? recommendedSecondary
      : selectedSecondary(ctx, recommendedSecondary),
  };
};
const heading = (ctx: RenderContext, recommendedSecondary?: string | TemplateResult, recommendedPrimary?: string) => html`
  ${(() => {
    const information = presentationValues(ctx, recommendedSecondary, recommendedPrimary);
    return html`
  <span class="ulm-copy shared-presentation">
    ${information.primary ? html`<span class="ulm-name">${information.primary}</span>` : nothing}
    ${information.secondary
      ? html`<span class="ulm-label">${information.secondary}</span>`
      : nothing}
  </span>
    `;
  })()}
`;
const valueThenName = (ctx: RenderContext, value = stateLabel(ctx.entity, ctx.hass)) => html`
  <span class="value-first">${heading(ctx, displayName(ctx.config, ctx.entity, ctx.hass), value)}</span>
`;

const cardHeading = (
  ctx: RenderContext,
  secondary = stateLabel(ctx.entity, ctx.hass),
  primary = ctx.descriptor.name,
): TemplateResult => html`
  <div class="card-heading">
    ${iconBubble(ctx, defaultIconFor(ctx.descriptor, ctx.entity))}
    ${heading(ctx, secondary, primary)}
  </div>
`;

export const renderAutomaticPresentation = (ctx: RenderContext): TemplateResult =>
  html`<div class="automatic-presentation">${cardHeading(ctx)}</div>`;
const button = (label: string, iconName: string, handler: (event: Event) => void, disabled = false) => html`
  <button class="ulm-control" aria-label=${label} ?disabled=${disabled}
    @pointerdown=${(event: Event) => event.stopPropagation()} @click=${handler}>
    <ha-icon .icon=${iconName}></ha-icon>
  </button>
`;
const holdButton = (
  label: string,
  content: TemplateResult,
  tap: () => void,
  hold: () => void,
  disabled = false,
) => {
  let timer: number | undefined;
  let held = false;
  const cancel = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
  };
  return html`
    <button class="ulm-control hold-control" aria-label=${label} ?disabled=${disabled}
      @pointerdown=${(event: Event) => {
        event.stopPropagation();
        held = false;
        timer = window.setTimeout(() => {
          held = true;
          hold();
        }, 500);
      }}
      @pointerup=${(event: Event) => { event.stopPropagation(); cancel(); }}
      @pointercancel=${cancel}
      @click=${(event: Event) => {
        event.stopPropagation();
        if (!held) tap();
        held = false;
      }}>
      ${content}
    </button>
  `;
};
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
  exceptional: ["mdi:weather-sunny-alert", "red"],
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
    ${heading(ctx, charging ? localizeText(ctx.hass, "Charging") : localizeText(ctx.hass, "Battery level"))}
    <span class="battery-value">${Math.round(value)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, value))}%`}></i></span>
  `);
};

const renderDefaultBattery = (ctx: RenderContext): TemplateResult => {
  const attribute = configured<string>(ctx, "ulm_card_battery_attribute");
  const rawLevel = attribute ? attr(ctx.entity, attribute) : ctx.entity?.state;
  const value = numeric(rawLevel);
  const batteryState = configuredEntity(ctx, "ulm_card_battery_battery_state_entity_id");
  const chargerType = configuredEntity(ctx, "ulm_card_battery_charger_type_entity_id");
  const stateCharging = batteryState?.state.toLowerCase() === "charging";
  const chargerState = chargerType?.state.toLowerCase();
  const infix = chargerState === "wireless"
    ? "-charging-wireless"
    : stateCharging || ["charging", "ac", "usb"].includes(chargerState ?? "")
      ? "-charging"
      : "";
  const configuredWarning = numeric(ctx.config.battery_warning_threshold) ??
    configured<number>(ctx, "ulm_card_battery_battery_level_warning") ?? 50;
  const configuredLow = numeric(ctx.config.battery_low_threshold) ??
    configured<number>(ctx, "ulm_card_battery_battery_level_danger") ?? 20;
  const configuredCritical = numeric(ctx.config.battery_critical_threshold) ?? 10;
  const [critical, low, warning] = [configuredCritical, configuredLow, configuredWarning]
    .map((threshold) => Math.max(0, Math.min(100, threshold)))
    .sort((left, right) => left - right);
  const color = value === undefined || value <= critical
    ? configuredColor(
      ctx.config.battery_critical_color ??
        configured<string>(ctx, "ulm_card_battery_color_battery_level_danger"),
      "var(--google-red, #f44336)",
    )
    : value <= low
      ? configuredColor(ctx.config.battery_low_color, "var(--google-orange, #ff9800)")
      : value <= warning
        ? configuredColor(
          ctx.config.battery_warning_color ??
            configured<string>(ctx, "ulm_card_battery_color_battery_level_warning"),
          "var(--google-yellow, #fbc02d)",
        )
        : configuredColor(
          ctx.config.battery_healthy_color ??
            configured<string>(ctx, "ulm_card_battery_color_battery_level_ok"),
          "var(--google-green, #43a047)",
        );
  const animate = configured<boolean>(ctx, "ulm_card_battery_charging_animation") === true && stateCharging;
  const displayLevel = value === undefined ? stateLabel(ctx.entity, ctx.hass) : `${Math.round(value)}%`;
  return ctx.actionSurface(`ulm-row ulm-default-battery ${animate ? "is-charging" : ""}`, html`
    ${sourceIconBubble(ctx, batteryIcon(value, infix), color, true)}
    <span class="value-first">${heading(ctx, displayName(ctx.config, ctx.entity, ctx.hass), displayLevel)}</span>
  `);
};

const configuredColor = resolveColor;

const sparkline = (
  ctx: RenderContext,
  filled = false,
  entity = ctx.entity,
  color?: string,
  fillColor = color,
) => {
  const values = Array.isArray(attr(entity, "history"))
    ? (attr(entity, "history") as unknown[]).map(Number).filter(Number.isFinite).slice(-12)
    : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) =>
    `${(index / Math.max(1, values.length - 1)) * 100},${36 - ((value - min) / Math.max(1, max - min)) * 32}`).join(" ");
  const area = `0,40 ${points} 100,40`;
  const style = color
    ? `--sparkline-color:${color};--sparkline-fill-color:${fillColor ?? color}`
    : "";
  return html`<svg class="sparkline ${filled ? "is-filled" : ""}" style=${style} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${filled ? html`<polygon points=${area}></polygon>` : nothing}
    <polyline points=${points}></polyline>
  </svg>`;
};

const renderMetric = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-metric", html`
  <div class="metric-heading">${iconBubble(ctx, ctx.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${heading(ctx, ctx.entity?.attributes.unit_of_measurement ? String(ctx.entity.attributes.unit_of_measurement) : localizeText(ctx.hass, "Current value"))}<span class="metric-value">${stateLabel(ctx.entity, ctx.hass)}</span></div>
  ${ctx.config.show_graph !== false ? sparkline(ctx) : nothing}
  ${(linkedState(ctx, "min_entity") || linkedState(ctx, "max_entity")) ? html`<div class="metric-extremes"><span>${localize(ctx.hass, "ui.renderer.minimum_value", { value: stateLabel(linkedState(ctx, "min_entity"), ctx.hass) })}</span><span>${localize(ctx.hass, "ui.renderer.maximum_value", { value: stateLabel(linkedState(ctx, "max_entity"), ctx.hass) })}</span></div>` : nothing}
`);

const runItemAction = (event: Event, ctx: RenderContext, item: AdditionItemConfig): void => {
  const navigationPath = item.navigation_path || item.nav_path;
  if (navigationPath) {
    runControlAction(event, ctx, { action: "navigate", navigation_path: navigationPath }, item.entity);
    return;
  }
  const action = item.tap_action;
  if (action) {
    runControlAction(event, ctx, action, item.entity);
    return;
  }
  const [domain, objectId] = item.entity.split(".", 2);
  if (domain === "scene") ctx.service("scene", "turn_on", { entity_id: item.entity });
  else if (domain === "media_player") ctx.service("media_player", "media_play_pause", { entity_id: item.entity });
  else if (domain === "input_select") {
    ctx.service("input_select", "select_option", {
      entity_id: item.entity,
      option: item.state,
      ...(item.service_data ?? {}),
    });
  } else if (domain === "script") ctx.service("script", objectId || "turn_on", { entity_id: item.entity, ...(item.service_data ?? {}) });
  else ctx.service("homeassistant", "toggle", { entity_id: item.entity, ...(item.service_data ?? {}) });
};

const sceneItemActive = (item: AdditionItemConfig, entity?: HassEntity): boolean =>
  item.active_state
    ? entity?.state === item.active_state
    : item.state
      ? entity?.state === item.state
      : activeStates.has(entity?.state ?? "");

const renderScene = (ctx: RenderContext): TemplateResult => {
  const sceneItems: AdditionItemConfig[] = (
    ctx.config.scene_items?.length
      ? ctx.config.scene_items
      : (ctx.config.entities?.length ? ctx.config.entities : ctx.config.entity ? [ctx.config.entity] : [])
        .map((entity) => ({ entity }))
  ).filter((item) => item.entity);
  const buttonsOnly = ctx.config.scene_buttons_only === true;
  if (buttonsOnly) ctx.presentation.rendered = true;
  const sourceGrid = ctx.descriptor.upstreamId === "card_scenes" && ctx.config.variant === "scene-grid";
  const visibleItems = sceneItems;
  const perRow = Math.max(1, Math.min(24, Math.floor(Number(ctx.config.scenes_per_row)) || (sourceGrid ? 5 : 6)));
  const collapseEntity = ctx.config.collapse_entity ? ctx.hass.states[ctx.config.collapse_entity] : undefined;
  const collapsed = !buttonsOnly && (ctx.config.collapsed === true || collapseEntity?.state === "on");
  return ctx.actionSurface(`ulm-scenes ${sourceGrid ? "source-scene-grid" : "scene-pills"} ${ctx.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""} ${buttonsOnly ? "scene-buttons-only" : ""}`, html`
    ${collapsed ? nothing : html`<div class="scene-grid" style=${`--scenes-per-row:${perRow}`}>${visibleItems.map((item) => {
      const entity = ctx.hass.states[item.entity];
      const off = hasOnOffState(entity) && !sceneItemActive(item, entity);
      const color = configuredColor(item.color, "rgb(var(--ulm-purple))");
      const entityPicture = item.icon_type === "entity-picture"
        ? attr(entity, "entity_picture")
        : undefined;
      const name = item.name || item.label || displayName({ type: "", entity: item.entity }, entity, ctx.hass);
      return html`
      <button aria-label=${name} title=${name} @pointerdown=${(event: Event) => event.stopPropagation()} @click=${(event: Event) => {
        event.stopPropagation();
        if (sourceGrid && !item.tap_action) {
          const domain = item.entity.split(".", 1)[0];
          ctx.service(
            domain === "automation" ? "automation" : "homeassistant",
            domain === "automation" ? "trigger" : "turn_on",
            { entity_id: item.entity },
          );
        } else {
          runItemAction(event, ctx, item);
        }
      }} style=${`--item-color:${color}`} class="scene-button ${off ? "is-off" : "is-active"}">
        <i>${entityPicture
          ? html`<span class="scene-entity-picture" style=${styleMap({ backgroundImage: cssUrl(entityPicture) })}></span>`
          : html`<ha-icon .icon=${item.icon || entity?.attributes.icon || "mdi:palette"}></ha-icon>`
        }</i>
        <span>${name}</span>
      </button>`;
    })}</div>`}
  `);
};

const renderSecurity = (ctx: RenderContext): TemplateResult => {
  const armed = ctx.entity?.state.startsWith("armed") || ctx.entity?.state === "locked";
  return ctx.actionSurface(`ulm-security ${armed ? "is-armed" : ""}`, html`
    ${iconBubble(ctx, armed ? "mdi:shield-lock" : "mdi:shield-off", armed ? "green" : "red")}
    ${heading(ctx, stateLabel(ctx.entity, ctx.hass))}
    ${ctx.config.show_controls ? html`<span class="security-status">${armed ? localizeText(ctx.hass, "Secured") : localizeText(ctx.hass, "Attention")}</span>` : nothing}
  `);
};

const renderNavigation = (ctx: RenderContext): TemplateResult => ctx.actionSurface("ulm-navigation", html`
  ${iconBubble(ctx, ctx.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${heading(ctx, ctx.config.secondary || ctx.config.navigation_path || localizeText(ctx.hass, "Navigate"))}
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
    ${heading(ctx, consumption ? `${stateLabel(ctx.entity, ctx.hass)} · ${stateLabel(consumption, ctx.hass)}` : stateLabel(ctx.entity, ctx.hass))}
    ${controlEntityId && ctx.config.show_controls !== false ? button(active ? localizeText(ctx.hass, "Turn off") : localizeText(ctx.hass, "Turn on"), "mdi:power", (event) => {
      event.stopPropagation();
      ctx.service(domain, service, { entity_id: controlEntityId });
    }) : nothing}
  `);
};

const renderRoom = (ctx: RenderContext): TemplateResult => {
  const sensorItems: AdditionItemConfig[] = (
    ctx.config.room_sensors !== undefined
      ? ctx.config.room_sensors
      : (ctx.config.entities ?? []).map((entity) => ({ entity }))
  ).filter((item) => item.entity).slice(0, 4);
  const roomLabel = roomSecondary(ctx.config, ctx.hass);
  const headingContext = { ...ctx, config: { ...ctx.config, secondary_info: undefined } };
  const light = roomLightEntity(ctx.config, ctx.hass);
  const rgb = ctx.config.ulm_card_dynamic_color === true ? roomLightRgb(ctx.hass, light) : undefined;
  const statusItems = (ctx.config.room_status ?? []).slice(0, ROOM_STATUS_LIMIT).filter((item) => item.entity);
  return ctx.actionSurface(`ulm-room ulm-source-room ${rgb ? "dynamic-color" : ""} ${ctx.entity?.state === "unavailable" ? "is-unavailable" : ""}`, html`
    <div class="room-main">
      <div class="room-copy">${heading(headingContext, roomLabel)}
      ${statusItems.length ? html`<div class="room-status" role="group" aria-label=${localize(ctx.hass, "room_status")}>
        ${statusItems.map((item) => {
          const entity = ctx.hass.states[item.entity];
          const kind = item.kind && ROOM_STATUS_KINDS.includes(item.kind) ? item.kind : roomStatusKind(entity);
          const unavailable = roomEntityUnavailable(entity);
          const active = roomStatusActive(entity, kind);
          const label = `${displayName({ type: "", entity: item.entity }, entity, ctx.hass)} · ${localize(ctx.hass, `room_status_${kind}`)}: ${localize(ctx.hass, unavailable ? "room_status_unavailable" : active ? "room_status_active" : "room_status_inactive")} (${stateLabel(entity, ctx.hass)})`;
          return html`<button class="room-status-indicator kind-${kind} ${unavailable ? "is-unavailable" : active ? "is-active" : "is-inactive"}"
            type="button" aria-label=${label} title=${label} ?disabled=${unavailable}
            ${controlActions({ type: ctx.config.type, entity: item.entity, tap_action: { action: "more-info" } })}>
            <ha-icon .icon=${entity?.attributes.icon || roomStatusIcon(kind, active)}></ha-icon>
          </button>`;
        })}
      </div>` : nothing}
      </div>
      <span class="ulm-icon tone-blue">${renderEntityIcon(ctx.hass, ctx.entity, ctx.config.icon, "mdi:sofa-single")}</span>
      ${ctx.entity?.state === "unavailable"
        ? html`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>`
        : nothing}
    </div>
    ${sensorItems.length ? html`<div class="room-entities">${sensorItems.map((item) => {
      const entity = ctx.hass.states[item.entity];
      const defaults = roomItemDefaultsFor(ctx.hass, item.entity);
      const active = !roomEntityUnavailable(entity) && entity?.state === (item.active_state || defaults.active_state);
      const color = configuredColor(item.color, "rgb(var(--ulm-blue))");
      const entityPicture = item.icon_type === "entity-picture"
        ? attr(entity, "entity_picture")
        : undefined;
      return html`<button
        class="metric-pill room-sensor ${active ? "is-active" : ""}"
        type="button"
        ?disabled=${roomEntityUnavailable(entity)}
        style=${`--item-color:${color}`}
        aria-label=${item.name || item.label || displayName({ type: "", entity: item.entity }, entity, ctx.hass)}
        ${controlActions({
          type: ctx.config.type, entity: item.entity,
          tap_action: item.tap_action ?? defaults.tap_action,
          hold_action: item.hold_action ?? defaults.hold_action,
          double_tap_action: item.double_tap_action ?? defaults.double_tap_action,
        })}
      >${entityPicture
        ? html`<span class="room-sensor-picture" style=${styleMap({ backgroundImage: cssUrl(entityPicture) })}></span>`
        : html`<ha-icon .icon=${item.icon || roomEntityIcon(entity, item.entity)}></ha-icon>`
      }<span class="room-sensor-label">${stateLabel(entity, ctx.hass)}</span></button>`;
    })}</div>` : nothing}
  `, rgb ? `--room-rgb:${rgb.join(",")};` : "");
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
      ${heading(ctx, stateLabel(ctx.entity, ctx.hass))}
    </div>
    ${details.length ? html`<div class="detail-grid">${details.map((entity) => html`
      <span class="metric-pill"><ha-icon .icon=${entity.attributes.icon ?? "mdi:circle-small"}></ha-icon>${stateLabel(entity, ctx.hass)}</span>
    `)}</div>` : nothing}
  `);
};

const renderScheduleCard = (ctx: RenderContext): TemplateResult => {
  const details = configuredEntities(ctx);
  return ctx.actionSurface("ulm-schedule-card", html`
    <div class="ulm-row">
      ${iconBubble(ctx, /pollen/.test(ctx.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${heading(ctx, stateLabel(ctx.entity, ctx.hass))}
    </div>
    <div class="schedule-list">${(details.length ? details : ctx.entity ? [ctx.entity] : []).slice(0, 4).map((entity) => html`
      <span><b>${displayName({ type: "", entity: entity.entity_id }, entity, ctx.hass)}</b><small>${stateLabel(entity, ctx.hass)}</small></span>
    `)}</div>
  `);
};

const renderDeviceStatus = (ctx: RenderContext): TemplateResult => {
  const value = numeric(ctx.entity?.state);
  const details = configuredEntities(ctx);
  return ctx.actionSurface("ulm-device-status", html`
    <div class="ulm-row">
      ${iconBubble(ctx, /printer/.test(ctx.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(ctx.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(ctx.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", value !== undefined && value < 20 ? "red" : "blue")}
      ${heading(ctx, stateLabel(ctx.entity, ctx.hass))}
      ${value !== undefined ? html`<b class="device-value">${Math.round(value)}${String(ctx.entity?.attributes.unit_of_measurement ?? "")}</b>` : nothing}
    </div>
    ${value !== undefined ? html`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, value))}%`}></i></span>` : nothing}
    ${details.length ? html`<div class="detail-grid">${details.map((entity) => html`<span class="metric-pill">${stateLabel(entity, ctx.hass)}</span>`)}</div>` : nothing}
  `);
};

const renderAlarmTime = (ctx: RenderContext): TemplateResult => {
  const time = linkedState(ctx, "datetime_entity");
  return ctx.actionSurface(`ulm-control-card ulm-row ${activeStates.has(ctx.entity?.state ?? "") ? "is-active" : ""}`, html`
    ${iconBubble(ctx, "mdi:alarm", activeStates.has(ctx.entity?.state ?? "") ? "yellow" : "grey")}
    ${heading(ctx, time ? stateLabel(time, ctx.hass) : stateLabel(ctx.entity, ctx.hass))}
    ${ctx.config.show_controls !== false ? button(activeStates.has(ctx.entity?.state ?? "") ? localizeText(ctx.hass, "Disable alarm") : localizeText(ctx.hass, "Enable alarm"), "mdi:power", (event) => {
      event.stopPropagation();
      ctx.service("input_boolean", activeStates.has(ctx.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: ctx.config.entity });
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

const renderTrash = (ctx: RenderContext): TemplateResult => {
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
  const collectionDate = (entity?: HassEntity): string | undefined => {
    if (!entity || emptySummaryStates.has(entity.state.trim().toLowerCase()) || ["—", "–"].includes(entity.state.trim())) return undefined;
    if (entity.entity_id.startsWith("calendar.")) {
      const dateValue = attr(entity, "start_time") ?? attr(entity, "start") ?? attr(entity, "end_time");
      if (typeof dateValue === "string") {
        const date = new Date(dateValue);
        if (!Number.isNaN(date.getTime())) {
          return new Intl.DateTimeFormat(ctx.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
        }
      }
      return undefined;
    }
    return entity.state;
  };
  return ctx.actionSurface("custom-waste-card", html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, "mdi:trash-can-outline", "green")}
      ${heading(ctx, configured<string>(ctx, "ulm_volgende_ophaling") ||
        [today ? localize(ctx.hass, "ui.renderer.today", { value: today }) : "", tomorrow ? localize(ctx.hass, "ui.renderer.tomorrow", { value: tomorrow }) : ""].filter(Boolean).join(" · ") ||
        undefined, localizeText(ctx.hass, "Next collections"))}
    </div>
    <div class="waste-grid">${rows.map((stream) => {
      const entity = stream.entity ? ctx.hass.states[stream.entity] : undefined;
      const date = collectionDate(entity);
      if (ctx.config.hide_unknown_dates === true && date === undefined) return nothing;
      return html`<span class="waste-row" style=${`--waste-color:${configuredColor(stream.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${stream.icon || "mdi:trash-can"}></ha-icon>
        <b>${stream.label || entity?.attributes.friendly_name || stream.entity}</b>
        <small>${date ?? "—"}</small>
      </span>`;
    })}</div>
  `);
};

const helperTime = (entity: HassEntity | undefined): { label: string; minutes: number } | undefined => {
  if (!entity || entity.attributes.has_time === false) return undefined;
  const match = /^(?:\d{4}-\d{2}-\d{2} )?([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/.exec(entity.state);
  return match ? { label: `${match[1]}:${match[2]}`, minutes: Number(match[1]) * 60 + Number(match[2]) } : undefined;
};

const renderAlarmTimeCard = (ctx: RenderContext): TemplateResult => {
  const timeEntity = entityFromConfig(ctx, "ulm_card_alarm_time_datetime") ?? linkedState(ctx, "datetime_entity");
  const step = numeric(configured(ctx, "ulm_card_alarm_time_step")) ?? 15;
  const time = helperTime(timeEntity);
  const setMinutes = (delta: number) => {
    if (!time) return;
    const total = ((time.minutes + delta) % 1440 + 1440) % 1440;
    ctx.service("input_datetime", "set_datetime", {
      entity_id: timeEntity?.entity_id,
      time: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`,
    });
  };
  const unavailable = !time;
  const collapsed = configured<boolean>(ctx, "ulm_card_alarm_time_collapse") === true &&
    !activeStates.has(ctx.entity?.state ?? "");
  const active = activeStates.has(ctx.entity?.state ?? "");
  const alarmColor = configuredColor(
    configured<string>(ctx, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))",
  );
  return ctx.actionSurface(`custom-alarm-time ${configured<boolean>(ctx, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, html`
    <div class="custom-card-heading">
      ${sourceIconBubble(ctx, configured<string>(ctx, "ulm_card_alarm_time_icon") || "mdi:alarm", alarmColor, active)}
      ${heading(ctx, stateLabel(ctx.entity, ctx.hass))}
    </div>
    ${collapsed ? nothing : html`<div class="alarm-time-controls">
      ${button(localize(ctx.hass, "ui.renderer.earlier", { minutes: step }), "mdi:minus", (event) => { event.stopPropagation(); setMinutes(-step); }, unavailable)}
      <b>${time?.label ?? stateLabel(timeEntity, ctx.hass)}</b>
      ${button(localize(ctx.hass, "ui.renderer.later", { minutes: step }), "mdi:plus", (event) => { event.stopPropagation(); setMinutes(step); }, unavailable)}
    </div>`}
  `);
};

const renderWelcome = (ctx: RenderContext): TemplateResult => {
  const collapse = entityFromConfig(ctx, "ulm_card_welcome_collapse");
  const weather = entityFromConfig(ctx, "ulm_weather");
  const weatherIcon = ctx.config.welcome_weather_icon_type === "icon"
    ? ctx.config.welcome_weather_icon || "mdi:weather-partly-cloudy"
    : weatherIcons[weather?.state ?? ""]?.[0] ?? "mdi:weather-partly-cloudy";
  const weatherInfo = (mode: NonNullable<AdditionConfig["welcome_weather_primary_info"]>): string => {
    if (mode === "none") return "";
    if (mode === "date") {
      const format = ctx.config.welcome_weather_date_format;
      const options: Intl.DateTimeFormatOptions = format && format !== "month_day"
        ? { dateStyle: format } : { month: "short", day: "numeric" };
      return new Intl.DateTimeFormat(ctx.hass.language, { ...options, timeZone: ctx.hass.config?.time_zone }).format(new Date());
    }
    if (mode === "name") return weather ? displayName({ type: "", entity: weather.entity_id }, weather, ctx.hass) : stateLabel(undefined, ctx.hass);
    if (mode === "temperature" && weather && !["unknown", "unavailable"].includes(weather.state)) {
      const temperature = attr(weather, "temperature");
      if (typeof temperature === "number" && Number.isFinite(temperature)) {
        const unit = String(attr(weather, "temperature_unit") || ctx.hass.config?.unit_system?.temperature || "");
        return `${new Intl.NumberFormat(ctx.hass.language, { maximumFractionDigits: 1 }).format(temperature)}${unit}`;
      }
    }
    return stateLabel(weather, ctx.hass);
  };
  const weatherPrimary = weatherInfo(ctx.config.welcome_weather_primary_info ?? "temperature");
  const weatherSecondary = weatherInfo(ctx.config.welcome_weather_secondary_info ?? "date");
  const weatherAction = ctx.config.welcome_weather_tap_action ?? { action: "more-info" };
  const collapsed = collapse?.state === "on";
  const items = (ctx.config.scene_items ?? []).filter((item) => item.entity || item.navigation_path || item.nav_path || item.tap_action);
  const welcomePerRow = Math.max(1, Math.min(24, Math.floor(Number(ctx.config.scenes_per_row)) || 5));
  const people = ctx.config.show_people === true
    ? [...new Set(ctx.config.people_entities ?? [])].flatMap((id) => ctx.hass.states[id] ?? [])
    : [];
  return ctx.actionSurface("custom-welcome", html`
    <div class="welcome-toolbar">
      <button aria-label="${localizeText(ctx.hass, "Toggle welcome navigation")}" ?disabled=${!collapse}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => { event.stopPropagation(); if (collapse) ctx.service("input_boolean", "toggle", { entity_id: collapse.entity_id }); }}>
        <ha-icon .icon=${collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
      </button>
      <button class="welcome-weather" aria-label="${[localizeText(ctx.hass, "Weather information"), weatherPrimary, weatherSecondary].filter(Boolean).join(", ")}"
        ?disabled=${weatherAction.action === "none" || (weatherAction.action === "more-info" && !weather)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => runControlAction(event, ctx, weatherAction, weather?.entity_id)}>
        ${ctx.config.welcome_weather_icon_type === "none" ? nothing : html`<ha-icon .icon=${weatherIcon}></ha-icon>`}
        ${weatherPrimary || weatherSecondary ? html`<span class="welcome-weather-copy">
          ${weatherPrimary ? html`<span class="welcome-weather-primary">${weatherPrimary}</span>` : nothing}
          ${weatherSecondary ? html`<span class="welcome-weather-secondary">${weatherSecondary}</span>` : nothing}
        </span>` : nothing}
      </button>
      <button aria-label="${localizeText(ctx.hass, "Dashboard settings")}" @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => runControlAction(event, ctx, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${heading(ctx, timeGreeting(ctx.hass, new Date().getHours()))}</div>
    ${people.length ? html`<div class="welcome-people">
      ${[people.filter((p) => p.state === "home"), people.filter((p) => p.state !== "home")].map((group, side) => html`
        <div class="welcome-people-group ${side ? "is-away" : "is-home"}">${group.map((person) => {
          const picture = attr(person, "entity_picture");
          const kind = person.state === "home" ? "home" : person.state === "not_home" ? "not-home" : person.state === "unknown" ? "unknown" : "zone";
          const name = displayName({ type: "", entity: person.entity_id }, person, ctx.hass);
          return html`<button class="people-chip people-${kind}" title=${name}
            aria-label=${`${name}: ${stateLabel(person, ctx.hass)}`}
            @pointerdown=${(event: Event) => event.stopPropagation()}
            @click=${(event: Event) => runControlAction(event, ctx, { action: "more-info" }, person.entity_id)}>
            ${typeof picture === "string" && picture
              ? html`<span class="people-avatar" style=${styleMap({ backgroundImage: cssUrl(picture) })}></span>`
              : html`<span class="people-avatar"><ha-icon .icon=${String(person.attributes.icon || "mdi:account")}></ha-icon></span>`}
            ${side ? html`<span class="people-state">${stateLabel(person, ctx.hass)}</span>` : nothing}
          </button>`;
        })}</div>`)}
    </div>` : nothing}
    ${collapsed ? nothing : html`<div class="welcome-items" style=${`--scenes-per-row:${welcomePerRow}`}>${items.map((item, index) => {
      const entity = item.entity ? ctx.hass.states[item.entity] : undefined;
      const off = hasOnOffState(entity) && !sceneItemActive(item, entity);
      const entityPicture = item.icon_type === "entity-picture" ? attr(entity, "entity_picture") : undefined;
      const name = item.name || item.label || (entity ? displayName({ type: "", entity: item.entity }, entity, ctx.hass)
        : localize(ctx.hass, "ui.renderer.item", { number: index + 1 }));
      return html`
      <button class="scene-button ${off ? "is-off" : "is-active"}" style=${`--item-color:${configuredColor(item.color, "rgb(var(--ulm-blue))")}`}
        aria-label=${name} title=${name}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => { event.stopPropagation(); runItemAction(event, ctx, item); }}>
        <i>${entityPicture
          ? html`<span class="scene-entity-picture" style=${styleMap({ backgroundImage: cssUrl(entityPicture) })}></span>`
          : html`<ha-icon .icon=${item.icon || entity?.attributes.icon || "mdi:circle"}></ha-icon>`}</i><small>${name}</small>
      </button>
    `;
    })}</div>`}
  `);
};

const cachedSceneItems = (ctx: RenderContext): AdditionItemConfig[] => {
  if (ctx.config.carousel_items) return ctx.config.carousel_items;
  return areaSceneItems(ctx.hass, ctx.config.entity);
};

const renderLight = (ctx: RenderContext): TemplateResult => {
  const entity = ctx.entity;
  const unavailable = !entity || ["unavailable", "unknown"].includes(entity.state);
  const on = entity?.state === "on";
  const rgb = attr(entity, "rgb_color");
  const color = on && ctx.config.use_light_color !== false && Array.isArray(rgb) && rgb.length === 3 ? `rgb(${rgb.join(",")})` : on ? "rgb(var(--ulm-yellow))" : "rgb(var(--ulm-grey))";
  const modes = attr(entity, "supported_color_modes");
  const dimmable = Array.isArray(modes) ? modes.some((mode) => mode !== "onoff") : attr(entity, "brightness") !== undefined;
  const hasMode = (...wanted: string[]) => Array.isArray(modes) && modes.some((mode) => wanted.includes(String(mode)));
  const kelvinMin = numeric(attr(entity, "min_color_temp_kelvin")) ?? 2000;
  const kelvinMax = numeric(attr(entity, "max_color_temp_kelvin")) ?? 6500;
  const kelvin = numeric(attr(entity, "color_temp_kelvin")) ?? Math.round((kelvinMin + kelvinMax) / 2);
  const hs = attr(entity, "hs_color");
  const hue = Array.isArray(hs) ? Number(hs[0]) || 0 : 0;
  const saturation = Array.isArray(hs) ? Number(hs[1]) || 100 : 100;
  const fullCollapsed = ctx.config.full_collapse_controls === true && !on;
  const showControls = !fullCollapsed && !(ctx.config.collapsible_controls === true && !on);
  const showBrightness = showControls && ctx.config.light_show_brightness !== false && dimmable;
  const showTemp = showControls && ctx.config.show_color_temp_control === true && hasMode("color_temp");
  const showHue = showControls && ctx.config.show_color_control === true && hasMode("hs", "xy", "rgb", "rgbw", "rgbww");
  const rawBrightness = numeric(attr(entity, "brightness"));
  const brightness = on && rawBrightness !== undefined ? Math.max(1, Math.round(rawBrightness / 255 * 100)) : 0;
  const controlButtons = ([[showBrightness, "brightness", "mdi:brightness-4", "Brightness"], [showTemp, "temp", "mdi:thermometer", "Color temperature control"], [showHue, "hue", "mdi:palette", "Color control"]] as const)
    .filter(([visible]) => visible).map(([, key, icon, label]) => [key, icon, label] as const);
  const controlCount = controlButtons.length;
  const stateText = on && dimmable && rawBrightness !== undefined ? `${brightness}%` : stateLabel(entity, ctx.hass);
  const stop = (event: Event) => event.stopPropagation();
  const members = fullCollapsed || ctx.config.light_show_members === false ? [] : [...new Set(
    Array.isArray(attr(entity, "entity_id")) ? (attr(entity, "entity_id") as unknown[]).filter((id): id is string => typeof id === "string") : [],
  )].filter((id) => id.startsWith("light.")).flatMap((id) => ctx.hass.states[id] ?? []);
  const perRow = Math.max(1, Math.min(12, Math.floor(Number(ctx.config.light_members_per_row)) || 4));
  const scenes = fullCollapsed || ctx.config.light_show_scenes === false ? [] :
    cachedSceneItems(ctx).map((item) => ({
      ...item,
      tap_action: item.tap_action ?? (item.entity?.startsWith("scene.")
        ? { action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: item.entity } }
        : undefined),
    }));
  const carouselConfig: AdditionConfig = {
    ...ctx.config,
    carousel_items: scenes,
    carousel_loop: true,
    carousel_show_header: false,
    carousel_show_labels: true,
    carousel_visible_items: 16,
    carousel_initial_index: 0,
    carousel_effect: ctx.config.carousel_effect ?? "coverflow",
    carousel_grab_cursor: true,
    carousel_centered_slides: true,
    carousel_slides_per_view: "auto",
    carousel_coverflow_rotate: 0,
    carousel_coverflow_stretch: ctx.config.carousel_coverflow_stretch ?? 44,
    carousel_coverflow_depth: ctx.config.carousel_coverflow_depth ?? 400,
    carousel_coverflow_modifier: 1,
    carousel_coverflow_slide_shadows: true,
    carousel_navigation: false,
    carousel_pagination: false,
    carousel_scrollbar: false,
    carousel_button_width: ctx.config.carousel_button_width ?? 82,
    carousel_button_height: ctx.config.carousel_button_height ?? 62,
    carousel_icon_size: ctx.config.carousel_icon_size ?? 28,
  };
  return ctx.actionSurface("custom-light", html`
    <div class="card-heading">
      ${sourceIconBubble(ctx, defaultIconFor(ctx.descriptor, entity), color, on)}
      ${heading(ctx, stateText)}
    </div>
    ${controlCount ? html`
      <div class="light-controls">
        ${controlCount > 1 ? html`
          <div class="light-control-buttons">
            ${controlButtons.map(([key, icon, label]) => html`
              <button class="light-control-button" data-ctl=${key} aria-label=${localizeText(ctx.hass, label)} title=${localizeText(ctx.hass, label)}
                @pointerdown=${stop} @pointerup=${stop}
                @click=${(event: Event) => {
                  stop(event);
                  const button = event.currentTarget as HTMLElement;
                  button.closest<HTMLElement>(".light-controls")?.setAttribute("data-control", key);
                }}>
                <ha-icon .icon=${icon}></ha-icon>
              </button>`)}
          </div>` : nothing}
    ${showBrightness ? html`
      <input class="mushroom-range light-slider light-brightness" type="range" min="1" max="100" step="1" .value=${String(brightness)}
        style=${`--range-color:${color};--range-progress:${rangeProgress(brightness, 1, 100)}`}
        aria-label=${localizeText(ctx.hass, "Brightness")} ?disabled=${unavailable}
        @pointerdown=${stop} @pointerup=${stop} @click=${stop} @keydown=${stop}
        @input=${updateRangeProgress}
        @change=${(event: Event) => {
          stop(event);
          ctx.service("light", "turn_on", {
            entity_id: entity?.entity_id,
            brightness_pct: Number((event.currentTarget as HTMLInputElement).value),
          });
        }}>` : nothing}
    ${showTemp ? html`
      <input class="mushroom-range light-slider light-gradient light-color-temp" type="range" min="${kelvinMin}" max="${kelvinMax}" step="50" .value=${String(kelvin)}
        style=${`--range-color:transparent;--range-progress:0%;--light-gradient:linear-gradient(to right,#ff9d3a,#ffe3b8,#ffffff,#cfe0ff,#9bbcff)`}
        aria-label=${localizeText(ctx.hass, "Color temperature control")} ?disabled=${unavailable}
        @pointerdown=${stop} @pointerup=${stop} @click=${stop} @keydown=${stop}
        @change=${(event: Event) => {
          stop(event);
          ctx.service("light", "turn_on", { entity_id: entity?.entity_id, color_temp_kelvin: Number((event.currentTarget as HTMLInputElement).value) });
        }}>` : nothing}
    ${showHue ? html`
      <input class="mushroom-range light-slider light-gradient light-color-hue" type="range" min="0" max="360" step="1" .value=${String(hue)}
        style=${`--range-color:transparent;--range-progress:0%;--light-gradient:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)`}
        aria-label=${localizeText(ctx.hass, "Color control")} ?disabled=${unavailable}
        @pointerdown=${stop} @pointerup=${stop} @click=${stop} @keydown=${stop}
        @change=${(event: Event) => {
          stop(event);
          ctx.service("light", "turn_on", { entity_id: entity?.entity_id, hs_color: [Number((event.currentTarget as HTMLInputElement).value), saturation] });
        }}>` : nothing}
      </div>` : nothing}
    ${members.length ? html`
      <details class="light-pulldown" ?open=${ctx.config.light_members_expanded === true}
        @pointerdown=${stop} @pointerup=${stop} @click=${stop} @dblclick=${stop} @keydown=${stop}>
        <summary>
          <span>${localize(ctx.hass, "lights_in_group")} (${members.filter((m) => m.state === "on").length}/${members.length})</span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="light-members" style=${`--light-members-per-row:${perRow}`}>
          ${members.map((member) => {
            const memberOn = member.state === "on";
            const memberRgb = attr(member, "rgb_color");
            const memberColor = memberOn && Array.isArray(memberRgb) && memberRgb.length === 3
              ? `rgb(${memberRgb.join(",")})` : "rgb(var(--ulm-yellow))";
            const name = displayName({ type: "", entity: member.entity_id }, member, ctx.hass);
            return html`
              <button class="scene-button light-member ${memberOn ? "is-active" : "is-off"}"
                style=${`--item-color:${memberColor}`} aria-label=${name} title=${name} aria-pressed=${memberOn}
                ?disabled=${["unavailable", "unknown"].includes(member.state)}
                @pointerdown=${stop}
                @click=${(event: Event) => { stop(event); ctx.service("light", "toggle", { entity_id: member.entity_id }); }}>
                <i><ha-icon .icon=${String(member.attributes.icon || "mdi:lightbulb")}></ha-icon></i><small>${name}</small>
              </button>`;
          })}
        </div>
      </details>` : nothing}
    ${scenes.length ? html`
      <details class="light-pulldown light-scenes"
        @pointerdown=${stop} @pointerup=${stop} @click=${stop} @dblclick=${stop} @keydown=${stop}>
        <summary>
          <span>${localizeText(ctx.hass, "Scenes")} (${scenes.length})</span>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </summary>
        <mushroom-addition-entity-carousel .hass=${ctx.hass} .config=${carouselConfig}></mushroom-addition-entity-carousel>
      </details>` : nothing}
  `);
};

const renderWasher = (ctx: RenderContext): TemplateResult => {
  const power = entityFromConfig(ctx, "washer_power_entity") ??
    entityFromConfig(ctx, "power_entity") ??
    entityFromConfig(ctx, "ulm_custom_card_washer_power");
  const machine = entityFromConfig(ctx, "ulm_custom_card_washer_machine_state") ??
    ctx.entity;
  const progress = entityFromConfig(ctx, "ulm_custom_card_washer_job_progress");
  const job = entityFromConfig(ctx, "program_stage_entity") ??
    entityFromConfig(ctx, "ulm_custom_card_washer_job_state") ??
    machine;
  const remote = entityFromConfig(ctx, "ulm_custom_card_washer_remote_control");
  const delayed = entityFromConfig(ctx, "ulm_custom_card_washer_delayed_start");
  const delayedTime = entityFromConfig(ctx, "ulm_custom_card_washer_delayed_starttime");
  const door = entityFromConfig(ctx, "door_entity");
  const finished = entityFromConfig(ctx, "finished_entity");
  const programSelect = entityFromConfig(ctx, "program_select_entity");
  const programOptions = Array.isArray(programSelect?.attributes.options)
    ? (programSelect.attributes.options as unknown[]).map(String)
    : [];
  if (programSelect && !programOptions.includes(programSelect.state)) programOptions.unshift(programSelect.state);
  const powerSwitch = entityFromConfig(ctx, "power_switch_entity");
  const stopState = configured<string>(ctx, "ulm_custom_card_washer_machine_stop_state") ?? "stop";
  const powered = powerSwitch
    ? powerSwitch.state === "on"
    : power
    ? !["off", "unavailable", "unknown", "0"].includes(power.state.toLowerCase())
    : machine
      ? !["off", "unavailable", "unknown"].includes(machine.state.toLowerCase())
      : true;
  const stopped = !machine || machine.state === stopState || machine.state === "off";
  const remoteEnabled = ["true", "on", "enabled"].includes(remote?.state.toLowerCase() ?? "");
  const delayedEnabled = delayed?.state === "on";
  const percent = Math.max(0, Math.min(100, numeric(progress?.state) ?? 0));
  const configuredStages = configured<Record<string, { name?: string; icon?: string }>>(
    ctx,
    "ulm_custom_card_washer_job_states",
  );
  const stages = Object.values(configuredStages ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" },
  }).filter((stage) => stage.name && stage.icon).slice(0, 5);
  const activeStage = stages.findIndex((stage) =>
    stage.name?.toLowerCase() === job?.state.toLowerCase());
  const label = !powered
    ? configured<string>(ctx, "ulm_custom_card_washer_label_idle") ?? "idle"
    : !stopped
      ? configured<string>(ctx, "ulm_custom_card_washer_label_running") ?? "run"
      : remoteEnabled && delayedEnabled
        ? configured<string>(ctx, "ulm_custom_card_washer_label_configuring") ?? "configure"
        : configured<string>(ctx, "ulm_custom_card_washer_label_idle") ?? "idle";
  const actionFor = (key: string): ActionConfig =>
    configured<ActionConfig>(ctx, key) ?? { action: "none" };
  const runWasherAction = (event: Event, action: ActionConfig): void =>
    runControlAction(event, ctx, action, typeof action.entity === "string" ? action.entity : ctx.config.entity);
  const timeValue = delayedTime?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number);
  const setDelayedMinutes = (event: Event, delta: number): void => {
    event.stopPropagation();
    if (!delayedTime || !timeValue) return;
    const total = ((timeValue[0] * 60 + timeValue[1] + delta) % 1440 + 1440) % 1440;
    ctx.service("input_datetime", "set_datetime", {
      entity_id: delayedTime.entity_id,
      time: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`,
    });
  };
  const primaryAction = stopped
    ? actionFor("ulm_custom_card_washer_start_action")
    : actionFor("ulm_custom_card_washer_pause_action");
  const stopAction = actionFor("ulm_custom_card_washer_stop_action");
  return ctx.actionSurface("custom-washer", html`
    <div class="custom-card-heading washer-heading">
      ${iconBubble(ctx, "mdi:washing-machine", powered ? "blue" : "grey")}
      ${heading(ctx, label)}
      ${power ? html`<b class="washer-power">${stateLabel(power, ctx.hass)}</b>` : nothing}
    </div>
    ${powered && stages.length ? html`
      <div class="washer-stages" style=${`--washer-stage-count:${stages.length}`}>
        ${stages.map((stage, index) => html`
          <span class=${activeStage === index ? "is-active" : ""} title=${stage.name ?? ""}>
            <ha-icon .icon=${stage.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : nothing}
    ${powered && progress ? html`
      <div class="washer-progress">
        <span style=${`width:${percent}%`}></span>
        <b>${Math.round(percent)}%</b>
      </div>
    ` : nothing}
    ${programSelect ? html`
      <select class="washer-program" aria-label=${localizeText(ctx.hass, "Program selection")}
        ?disabled=${!powered || ["unavailable", "unknown"].includes(programSelect.state)}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => event.stopPropagation()}
        @change=${(event: Event) => {
          event.stopPropagation();
          ctx.service(programSelect.entity_id.split(".")[0], "select_option", {
            entity_id: programSelect.entity_id,
            option: (event.target as HTMLSelectElement).value,
          });
        }}>
        ${programOptions.map((option) => html`
          <option value=${option} ?selected=${option === programSelect.state}>${option}</option>
        `)}
      </select>
    ` : nothing}
    ${(powered && remoteEnabled) || powerSwitch ? html`
      <div class="washer-controls">
        ${powerSwitch ? button(
          localizeText(ctx.hass, "Toggle power"),
          "mdi:power",
          (event) => runControlAction(event, ctx, { action: "toggle" }, powerSwitch.entity_id),
          powerSwitch.state === "unavailable",
        ) : nothing}
        ${powered && remoteEnabled ? html`${button(
          stopped ? localizeText(ctx.hass, "Start washer") : localizeText(ctx.hass, "Pause washer"),
          stopped ? "mdi:play" : "mdi:pause",
          (event) => runWasherAction(event, primaryAction),
          primaryAction.action === "none",
        )}
        ${button(
          localizeText(ctx.hass, "Stop washer"),
          "mdi:stop",
          (event) => runWasherAction(event, stopAction),
          stopped || stopAction.action === "none",
        )}
        ${delayed ? button(
          delayedEnabled ? localizeText(ctx.hass, "Disable delayed start") : localizeText(ctx.hass, "Enable delayed start"),
          "mdi:alarm",
          (event) => runControlAction(event, ctx, { action: "toggle" }, delayed.entity_id),
          !stopped,
        ) : nothing}` : nothing}
      </div>
    ` : nothing}
    ${powered && remoteEnabled && delayedEnabled && delayedTime ? html`
      <div class="washer-delay-controls">
        ${button(localizeText(ctx.hass, "Move delayed start 15 minutes earlier"), "mdi:arrow-down", (event) => setDelayedMinutes(event, -15))}
        <button class="washer-delay-time" aria-label="${localizeText(ctx.hass, "Move delayed start 1 minute later")}"
          @pointerdown=${(event: Event) => event.stopPropagation()}
          @click=${(event: Event) => setDelayedMinutes(event, 1)}>${delayedTime.state}</button>
        ${button(localizeText(ctx.hass, "Move delayed start 15 minutes later"), "mdi:arrow-up", (event) => setDelayedMinutes(event, 15))}
      </div>
    ` : nothing}
    ${(door || finished || remote) ? html`
      <div class="washer-status">
        ${door ? html`<span><ha-icon icon="mdi:door"></ha-icon>${stateLabel(door, ctx.hass)}</span>` : nothing}
        ${finished ? html`<span><ha-icon icon="mdi:check-circle"></ha-icon>${stateLabel(finished, ctx.hass)}</span>` : nothing}
        ${remote ? html`<span><ha-icon icon="mdi:remote"></ha-icon>${stateLabel(remote, ctx.hass)}</span>` : nothing}
      </div>
    ` : nothing}
  `);
};

const astronomyMetricEntity = (
  ctx: RenderContext,
  configKey: string,
  metric: string,
): HassEntity | undefined => configuredEntity(ctx, configKey) ??
  Object.values(ctx.hass.states).find((entity) =>
    String(attr(entity, "metric") ?? "").toLowerCase() === metric &&
    ["moon", "sky"].includes(String(attr(entity, "body") ?? "").toLowerCase()));

const orbitPositionStyle = (
  azimuth: number | undefined,
  altitude: number | undefined,
  prefix: "sun" | "moon",
): string => {
  const normalizedAzimuth = azimuth === undefined ? 180 : ((azimuth % 360) + 360) % 360;
  const normalizedAltitude = Math.max(-90, Math.min(90, altitude ?? 0));
  const x = normalizedAzimuth / 360 * 100;
  const horizonY = 62 / 90 * 100;
  const y = normalizedAltitude >= 0
    ? horizonY - normalizedAltitude / 90 * (horizonY - 4)
    : horizonY + Math.abs(normalizedAltitude) / 90 * (96 - horizonY);
  return `--${prefix}-x:${x.toFixed(2)}%;--${prefix}-y:${y.toFixed(2)}%`;
};

const moonPhaseIcon = (phase: string): string => ({
  new_moon: "mdi:moon-new",
  waxing_crescent: "mdi:moon-waxing-crescent",
  first_quarter: "mdi:moon-first-quarter",
  waxing_gibbous: "mdi:moon-waxing-gibbous",
  full_moon: "mdi:moon-full",
  waning_gibbous: "mdi:moon-waning-gibbous",
  last_quarter: "mdi:moon-last-quarter",
  waning_crescent: "mdi:moon-waning-crescent",
})[phase] ?? "mdi:moon-waning-crescent";

const renderSunCard = (ctx: RenderContext): TemplateResult => {
  const rising = attr(ctx.entity, "next_rising");
  const setting = attr(ctx.entity, "next_setting");
  const dawn = attr(ctx.entity, "next_dawn") ?? rising;
  const noon = attr(ctx.entity, "next_noon");
  const dusk = attr(ctx.entity, "next_dusk") ?? setting;
  const locale = configured<string>(ctx, "language") || ctx.hass.language || "en";
  const hour12 = configured<string>(ctx, "timeFormat") === "12h";
  const format = (value: unknown) => {
    const date = new Date(String(value ?? ""));
    return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12,
    }).format(date);
  };
  const elevation = numeric(attr(ctx.entity, "elevation"));
  const azimuth = numeric(attr(ctx.entity, "azimuth"));
  const title = configured<string>(ctx, "title");
  const moonPhase = configuredEntity(ctx, "moon_entity") ??
    ctx.hass.states["sensor.moon"] ??
    Object.values(ctx.hass.states).find((entity) =>
      String(attr(entity, "device_class") ?? "") === "enum" &&
      `${entity.entity_id} ${String(attr(entity, "friendly_name") ?? "")}`.toLowerCase().includes("moon"));
  const moonAltitude = astronomyMetricEntity(ctx, "moon_altitude_entity", "altitude");
  const moonAzimuth = astronomyMetricEntity(ctx, "moon_azimuth_entity", "azimuth");
  const moonRising = configuredEntity(ctx, "moon_rising_entity") ??
    astronomyMetricEntity(ctx, "moon_rising_entity", "next_rising") ??
    astronomyMetricEntity(ctx, "moon_rising_entity", "moonrise");
  const moonSetting = configuredEntity(ctx, "moon_setting_entity") ??
    astronomyMetricEntity(ctx, "moon_setting_entity", "next_setting") ??
    astronomyMetricEntity(ctx, "moon_setting_entity", "moonset");
  const moonNextFull = astronomyMetricEntity(ctx, "moon_next_full_moon_entity", "next_full_moon");
  const moonNextNew = astronomyMetricEntity(ctx, "moon_next_new_moon_entity", "next_new_moon");
  const moonHorizon = astronomyMetricEntity(ctx, "moon_above_horizon_entity", "is_moon_above_horizon");
  const moonEntities = [
    moonPhase, moonAltitude, moonAzimuth, moonRising, moonSetting, moonNextFull, moonNextNew, moonHorizon,
  ];
  const showMoon = configured<boolean>(ctx, "showMoon") !== false && moonEntities.some(Boolean);
  const moonNumber = (entity: HassEntity | undefined, maximumFractionDigits = 2): string => {
    if (!entity || ["unknown", "unavailable"].includes(entity.state)) return "—";
    const value = numeric(entity.state);
    if (value === undefined) return stateLabel(entity, ctx.hass);
    const unit = String(attr(entity, "unit_of_measurement") ?? "");
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value)}${unit ? ` ${unit}` : ""}`;
  };
  const moonDate = (entity: HassEntity | undefined): string => {
    if (!entity || ["unknown", "unavailable"].includes(entity.state)) return "—";
    const value = new Date(entity.state);
    return Number.isNaN(value.getTime())
      ? stateLabel(entity, ctx.hass)
      : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(value);
  };
  const moonPhaseState = moonPhase?.state ?? "unknown";
  const moonAltitudeValue = numeric(moonAltitude?.state);
  const moonAzimuthValue = numeric(moonAzimuth?.state);
  const moonAbove = moonHorizon
    ? ["on", "true", "above_horizon"].includes(moonHorizon.state.toLowerCase())
    : (moonAltitudeValue ?? -1) >= 0;
  return ctx.actionSurface(`custom-sun-card ${configured<boolean>(ctx, "darkMode") ? "is-dark" : ""}`, html`
    ${title ? html`<b class="sun-title">${title}</b>` : nothing}
    <div class="astronomy-times">
      <span><small>${localizeText(ctx.hass, "Sunrise")}</small><b>${format(rising)}</b></span>
      <span><small>${localizeText(ctx.hass, "Moonrise")}</small><b>${format(moonRising?.state)}</b></span>
      <span><small>${localizeText(ctx.hass, "Moonset")}</small><b>${format(moonSetting?.state)}</b></span>
      <span><small>${localizeText(ctx.hass, "Sunset")}</small><b>${format(setting)}</b></span>
    </div>
    <div class="sun-arc astronomy-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${orbitPositionStyle(azimuth, elevation, "sun")}></span>
      ${showMoon && (moonAltitude || moonAzimuth) ? html`
        <span class=${`moon-marker astronomy-moon-marker ${moonAbove ? "is-above" : "is-below"}`}
          style=${orbitPositionStyle(moonAzimuthValue, moonAltitudeValue, "moon")}>
          <ha-icon .icon=${moonPhaseIcon(moonPhaseState)}></ha-icon>
        </span>
      ` : nothing}
    </div>
    <div class="sun-footer"><span><small>${localizeText(ctx.hass, "Dawn")}</small><b>${format(dawn)}</b></span><span><small>${localizeText(ctx.hass, "Solar noon")}</small><b>${format(noon)}</b></span><span><small>${localizeText(ctx.hass, "Dusk")}</small><b>${format(dusk)}</b></span></div>
    <div class="astronomy-position-rows">
      <div>
        <b>${localizeText(ctx.hass, "Sun:")}</b>
        <span>${localizeText(ctx.hass, "Azimuth")}<strong>${azimuth ?? "—"}°</strong></span>
        <span>${localizeText(ctx.hass, "Elevation")}<strong>${elevation ?? "—"}°</strong></span>
      </div>
      ${showMoon ? html`
        <div>
          <b>${localizeText(ctx.hass, "Moon:")}</b>
          <span>${localizeText(ctx.hass, "Azimuth")}<strong>${moonNumber(moonAzimuth)}</strong></span>
          <span>${localizeText(ctx.hass, "Elevation")}<strong>${moonNumber(moonAltitude)}</strong></span>
        </div>
      ` : nothing}
    </div>
    ${showMoon ? html`
      <section class="moon-section">
        <div class="moon-heading">
          <span class="moon-symbol"><ha-icon .icon=${moonPhaseIcon(moonPhaseState)}></ha-icon></span>
          <span class="moon-copy">
            <b>${localizeText(ctx.hass, "Moon")}</b>
            <small>${stateLabel(moonPhase, ctx.hass)} · ${moonAbove ? localizeText(ctx.hass, "Above horizon") : localizeText(ctx.hass, "Below horizon")}</small>
          </span>
        </div>
        <div class="moon-metrics">
          ${moonNextFull ? html`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-full"}></ha-icon><span><small>${localizeText(ctx.hass, "Next full Moon")}</small><b>${moonDate(moonNextFull)}</b></span></span>` : nothing}
          ${moonNextNew ? html`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-new"}></ha-icon><span><small>${localizeText(ctx.hass, "Next new Moon")}</small><b>${moonDate(moonNextNew)}</b></span></span>` : nothing}
        </div>
      </section>
    ` : nothing}
  `);
};

const renderInputDateTime = (ctx: RenderContext): TemplateResult => {
  const time = helperTime(ctx.entity);
  const available = Boolean(time);
  const step = Math.max(1, Math.min(720, Math.round(numeric(ctx.config.datetime_step) ?? 15)));
  const manual = ctx.config.datetime_manual_entry !== false;
  const singleRow = ctx.config.datetime_single_row === true;
  const setTotal = (minutes: number) => {
    const total = ((minutes % 1440) + 1440) % 1440;
    ctx.service("input_datetime", "set_datetime", {
      entity_id: ctx.config.entity,
      time: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`,
    });
  };
  const setMinutes = (delta: number) => {
    if (time) setTotal(time.minutes + delta);
  };
  const typed = (event: Event) => {
    event.stopPropagation();
    const match = /^(\d{2}):(\d{2})/.exec((event.target as HTMLInputElement).value);
    if (match) setTotal(Number(match[1]) * 60 + Number(match[2]));
  };
  const stop = (event: Event) => event.stopPropagation();
  const middle = manual
    ? html`<input class="ulm-control datetime-input" type="time" aria-label=${time?.label ?? "Time"}
        .value=${time?.label ?? ""} ?disabled=${!available} step=${step * 60}
        @pointerdown=${stop} @click=${stop} @keydown=${stop} @change=${typed}>`
    : holdButton(
      localizeText(ctx.hass, "One minute later; hold for one minute earlier"),
      html`<b>${time?.label ?? stateLabel(ctx.entity, ctx.hass)}</b>`,
      () => setMinutes(1),
      () => setMinutes(-1),
      !available,
    );
  const heading_ = html`${iconBubble(ctx, "mdi:calendar-clock", "green")}${heading(ctx, stateLabel(ctx.entity, ctx.hass))}`;
  const controls = html`
      ${button(step === 15 ? localizeText(ctx.hass, "15 minutes earlier") : `${step} minutes earlier`, "mdi:arrow-down", (event) => { event.stopPropagation(); setMinutes(-step); }, !available)}
      ${middle}
      ${button(step === 15 ? localizeText(ctx.hass, "15 minutes later") : `${step} minutes later`, "mdi:arrow-up", (event) => { event.stopPropagation(); setMinutes(step); }, !available)}`;
  return ctx.actionSurface("custom-input-datetime", singleRow
    ? html`<div class="input-datetime-row">
        <div class="custom-card-heading">${heading_}</div>
        <div class="input-datetime-controls">${controls}</div>
      </div>`
    : html`
    <div class="custom-card-heading">${heading_}</div>
    <div class="input-datetime-controls">${controls}</div>
  `);
};

const renderSonos = (ctx: RenderContext): TemplateResult => {
  const state = ctx.entity?.state;
  const unavailable = !ctx.entity || state === "unavailable" || state === "unknown";
  const controlsEntityId = configured<string>(ctx, "ulm_card_media_player_player_controls_entity") || ctx.config.entity;
  const controlsEntity = controlsEntityId ? ctx.hass.states[controlsEntityId] : undefined;
  const controlsState = controlsEntity?.state;
  const controlsUnavailable = !controlsEntityId?.startsWith("media_player.") || !controlsEntity ||
    ["unavailable", "unknown"].includes(controlsState ?? "");
  const collapsed = ctx.config.collapsible_controls === true &&
    (controlsUnavailable || ["off", "standby"].includes(controlsState ?? "") ||
      (ctx.config.ulm_card_media_player_idle_off === true && controlsState === "idle"));
  const stopEvent = (event: Event) => event.stopPropagation();
  const features = attr(controlsEntity, "supported_features");
  // Older integrations may omit the bitmask; an explicit zero must still hide controls.
  const supports = (feature: number): boolean =>
    features === undefined || (Number(features) & feature) !== 0;
  const volumeControls = ctx.config.volume_controls ?? ["volume_buttons"];
  const mediaControls = ctx.config.media_controls ?? ["play_pause_stop"];
  const mediaService = (service: string, data: Record<string, unknown> = {}) => {
    if (!controlsUnavailable) ctx.service("media_player", service, { entity_id: controlsEntityId, ...data });
  };
  const mediaButton = (label: string, iconName: string, service: string, data?: Record<string, unknown>) =>
    button(label, iconName, (event) => { stopEvent(event); mediaService(service, data); }, controlsUnavailable);
  const powerOn = ["off", "standby"].includes(controlsState ?? "") || controlsUnavailable;
  const showPower = ctx.config.ulm_card_media_player_power_button ?? mediaControls.includes("on_off");
  const playbackPower = !supports(SONOS_MEDIA_FEATURES.turnOn | SONOS_MEDIA_FEATURES.turnOff);
  const powerService = supports(powerOn ? SONOS_MEDIA_FEATURES.turnOn : SONOS_MEDIA_FEATURES.turnOff)
    ? powerOn ? "turn_on" : "turn_off"
    : playbackPower && ["playing", "paused", "buffering"].includes(controlsState ?? "") && supports(SONOS_MEDIA_FEATURES.stop)
      ? "media_stop"
      : playbackPower && ["idle", "on", "off", "standby"].includes(controlsState ?? "") && supports(SONOS_MEDIA_FEATURES.play)
        ? "media_play" : undefined;
  const powerLabel = powerService === "media_stop" ? localizeText(ctx.hass, "Standby (stop playback)")
    : powerService === "media_play" ? localizeText(ctx.hass, "Resume playback") : powerOn ? localizeText(ctx.hass, "Turn on") : localizeText(ctx.hass, "Turn off");
  const powerControl = showPower && powerService
    ? mediaButton(powerLabel, "mdi:power", powerService)
    : nothing;
  const playing = controlsState === "playing";
  const playbackService = features === undefined
    ? "media_play_pause"
    : playing && supports(SONOS_MEDIA_FEATURES.pause)
      ? "media_pause"
      : !playing && supports(SONOS_MEDIA_FEATURES.play)
        ? "media_play"
        : supports(SONOS_MEDIA_FEATURES.stop) ? "media_stop" : undefined;
  const playbackControl = mediaControls.includes("play_pause_stop") && playbackService
    ? mediaButton(
      playbackService === "media_stop" ? localizeText(ctx.hass, "Stop") : features === undefined ? localizeText(ctx.hass, "Play or pause") : playing ? localizeText(ctx.hass, "Pause") : localizeText(ctx.hass, "Play"),
      playbackService === "media_stop" ? "mdi:stop" : playing ? "mdi:pause" : "mdi:play",
      playbackService,
    ) : nothing;
  const volumeButtons = volumeControls.includes("volume_buttons") &&
    supports(SONOS_MEDIA_FEATURES.volumeStep | SONOS_MEDIA_FEATURES.volumeSet);
  const repeat = String(attr(controlsEntity, "repeat") ?? "off");
  const repeatNext = repeat === "off" ? "all" : repeat === "all" ? "one" : "off";
  const muted = attr(controlsEntity, "is_volume_muted") === true;
  const picture = configured<boolean>(ctx, "ulm_card_media_player_enable_art") === false
    ? undefined
    : attr(ctx.entity, "entity_picture");
  const volumeLevel = Math.max(0, Math.min(1, numeric(attr(controlsEntity, "volume_level")) ?? 0));
  const volume = Math.round(volumeLevel * 100);
  const volumeStep = numeric(ctx.config.ulm_card_media_player_enable_volume_adjust);
  const steppedVolume = volumeStep !== undefined && volumeStep > 0 && supports(SONOS_MEDIA_FEATURES.volumeSet);
  const volumeButton = (up: boolean) => mediaButton(
    up ? localizeText(ctx.hass, "Volume up") : localizeText(ctx.hass, "Volume down"), up ? "mdi:volume-plus" : "mdi:volume-minus",
    steppedVolume ? "volume_set" : up ? "volume_up" : "volume_down",
    steppedVolume ? { volume_level: Math.max(0, Math.min(1, volumeLevel + (up ? 1 : -1) * volumeStep)) } : undefined,
  );
  const source = attr(ctx.entity, "source");
  const title = ctx.config.use_media_info ? attr(ctx.entity, "media_title") : undefined;
  const artist = ctx.config.use_media_info || ctx.config.ulm_card_media_player_more_info === true
    ? attr(ctx.entity, "media_artist") : undefined;
  const album = ctx.config.ulm_card_media_player_more_info === true ? attr(ctx.entity, "media_album_name") : undefined;
  const mediaDetails = [artist, album].filter(Boolean).join(" · ");
  const label = mediaDetails || (source && !["idle", "paused", "unavailable", "unknown"].includes(state ?? "")
    ? String(source) : stateLabel(ctx.entity, ctx.hass));
  const mediaContext = { ...ctx, config: { ...ctx.config,
    primary_info: title && !ctx.config.name && [undefined, "default", "name"].includes(ctx.config.primary_info)
      ? undefined : ctx.config.primary_info,
    secondary_info: (title || mediaDetails) && !ctx.config.secondary && [undefined, "default", "state"].includes(ctx.config.secondary_info)
      ? undefined : ctx.config.secondary_info,
  } };
  const controls = resolveSonosControlEntities(ctx.hass, ctx.config.entity, ctx.config);
  const switches = SONOS_SWITCH_CONTROLS.flatMap((control) => {
    const entityId = controls[control.configKey];
    const entity = entityId ? ctx.hass.states[entityId] : undefined;
    return entity ? [{ control, entity }] : [];
  });
  const numbers = SONOS_NUMBER_CONTROLS.flatMap((control) => {
    const entityId = controls[control.configKey];
    const entity = entityId ? ctx.hass.states[entityId] : undefined;
    return entity ? [{ control, entity }] : [];
  });
  const shortcuts = (ctx.config.shortcuts?.buttons ?? []).filter((shortcut) =>
    typeof shortcut.id === "string" && shortcut.id.trim().length > 0);
  const shortcutColumns = Math.min(8, Math.max(1, Math.round(ctx.config.shortcuts?.columns ?? 4)));
  const detailsAlwaysVisible = configured<boolean>(ctx, "sonos_details_always_visible") === true;
  const detailsContent = html`
    ${switches.length ? html`<div class="sonos-switches">
      ${switches.map(({ control, entity }) => html`
        <button class=${entity.state === "on" ? "is-active" : ""} aria-pressed=${entity.state === "on"}
          ?disabled=${unavailable || ["unavailable", "unknown"].includes(entity.state)}
          @click=${(event: Event) => {
            event.stopPropagation();
            if (!unavailable && !["unavailable", "unknown"].includes(entity.state)) {
              ctx.service("homeassistant", "toggle", { entity_id: entity.entity_id });
            }
          }}>
          <ha-icon .icon=${control.icon}></ha-icon>
          <span>${localizeText(ctx.hass, control.label)}</span>
        </button>
      `)}
    </div>` : nothing}
    ${numbers.length ? html`<div class="sonos-sliders">
      ${numbers.map(({ control, entity }) => {
        const value = numeric(entity.state) ?? 0;
        const min = numeric(attr(entity, "min")) ?? -100;
        const max = numeric(attr(entity, "max")) ?? 100;
        const step = numeric(attr(entity, "step")) ?? 1;
        return html`
          <label>
            <ha-icon .icon=${control.icon}></ha-icon>
            <span>${localizeText(ctx.hass, control.label)}</span>
            <input class="mushroom-range" type="range" min=${min} max=${max} step=${step} .value=${String(value)}
              style=${`--range-color:rgb(var(--ulm-blue));--range-progress:${rangeProgress(value, min, max)}`}
              @input=${updateRangeProgress}
              ?disabled=${unavailable || ["unavailable", "unknown"].includes(entity.state)}
              aria-label=${localizeText(ctx.hass, control.label)}
              @change=${(event: Event) => {
                event.stopPropagation();
                if (unavailable || ["unavailable", "unknown"].includes(entity.state)) return;
                ctx.service("number", "set_value", {
                  entity_id: entity.entity_id,
                  value: Number((event.currentTarget as HTMLInputElement).value),
                });
              }}>
            <output>${value}</output>
          </label>
        `;
      })}
    </div>` : nothing}
  `;
  return ctx.actionSurface(`custom-sonos ${picture ? "has-art" : ""}`, html`
    ${picture ? html`<span class="media-art" style=${styleMap({ backgroundImage: cssUrl(picture) })}></span>` : nothing}
    <div class="custom-card-heading">
      ${iconBubble(ctx, "mdi:speaker", ctx.entity?.state === "playing" ? "green" : "grey")}
      ${heading(mediaContext, label, title && !ctx.config.name ? String(title) : undefined)}
    </div>
    <div class="sonos-controls"
      @pointerdown=${stopEvent} @pointerup=${stopEvent} @pointercancel=${stopEvent}
      @click=${stopEvent} @dblclick=${stopEvent} @keydown=${stopEvent} @keyup=${stopEvent}>
      ${powerControl}
      ${!collapsed ? html`
        ${volumeControls.includes("volume_mute") && supports(SONOS_MEDIA_FEATURES.volumeMute)
          ? html`<button class="ulm-control" aria-label=${muted ? localizeText(ctx.hass, "Unmute") : localizeText(ctx.hass, "Mute")} aria-pressed=${muted}
              ?disabled=${controlsUnavailable} @click=${() => mediaService("volume_mute", { is_volume_muted: !muted })}>
              <ha-icon .icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </button>` : nothing}
        ${volumeButtons ? volumeButton(false) : nothing}
        ${mediaControls.includes("shuffle") && supports(SONOS_MEDIA_FEATURES.shuffle)
          ? html`<button class="ulm-control" aria-label="${localizeText(ctx.hass, "Shuffle")}" aria-pressed=${attr(controlsEntity, "shuffle") === true}
              ?disabled=${controlsUnavailable} @click=${() => mediaService("shuffle_set", { shuffle: attr(controlsEntity, "shuffle") !== true })}>
              <ha-icon icon="mdi:shuffle"></ha-icon>
            </button>` : nothing}
        ${mediaControls.includes("previous") && supports(SONOS_MEDIA_FEATURES.previous)
          ? mediaButton(localizeText(ctx.hass, "Previous track"), "mdi:skip-previous", "media_previous_track") : nothing}
        ${playbackControl}
        ${mediaControls.includes("next") && supports(SONOS_MEDIA_FEATURES.next)
          ? mediaButton(localizeText(ctx.hass, "Next track"), "mdi:skip-next", "media_next_track") : nothing}
        ${mediaControls.includes("repeat") && supports(SONOS_MEDIA_FEATURES.repeat)
          ? mediaButton(localize(ctx.hass, "ui.renderer.repeat", { mode: localizeText(ctx.hass, repeat === "off" ? "Off" : repeat === "one" ? "One" : "All") }), repeat === "one" ? "mdi:repeat-once" : repeat === "off" ? "mdi:repeat-off" : "mdi:repeat",
            "repeat_set", { repeat: repeatNext }) : nothing}
        ${mediaControls.includes("sources") ? button(localizeText(ctx.hass, "Sources and details"), "mdi:playlist-music",
          (event) => runControlAction(event, ctx, { action: "more-info" }, controlsEntityId), controlsUnavailable) : nothing}
        ${volumeButtons ? volumeButton(true) : nothing}
        ${volumeControls.includes("volume_set") && supports(SONOS_MEDIA_FEATURES.volumeSet)
          ? html`<label class="sonos-volume">
              <input class="mushroom-range" type="range" min="0" max="100" step="1" .value=${String(volume)}
                style=${`--range-color:rgb(var(--ulm-blue));--range-progress:${rangeProgress(volume, 0, 100)}`}
                @input=${updateRangeProgress}
                aria-label="${localizeText(ctx.hass, "Volume level")}" ?disabled=${controlsUnavailable}
                @change=${(event: Event) => {
                  stopEvent(event);
                  mediaService("volume_set", {
                    volume_level: Math.max(0, Math.min(100, Number((event.currentTarget as HTMLInputElement).value))) / 100,
                  });
                }}>
              <output>${volume}%</output>
            </label>` : nothing}
      ` : nothing}
    </div>
    ${!collapsed && (switches.length || numbers.length) ? html`
      ${detailsAlwaysVisible
        ? html`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(event: Event) => event.stopPropagation()}
            @click=${stopEvent} @dblclick=${stopEvent} @keydown=${stopEvent} @keyup=${stopEvent}
            @pointerup=${stopEvent} @pointercancel=${stopEvent}>
            ${detailsContent}
          </div>`
        : html`<details class="sonos-details" @pointerdown=${(event: Event) => event.stopPropagation()}
            @click=${stopEvent} @dblclick=${stopEvent} @keydown=${stopEvent} @keyup=${stopEvent}
            @pointerup=${stopEvent} @pointercancel=${stopEvent}>
            <summary>
              <span>${localizeText(ctx.hass, "More details")}</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${detailsContent}
          </details>`}
    ` : nothing}
    ${!collapsed && shortcuts.length ? html`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${shortcutColumns}`}
        @pointerdown=${stopEvent} @pointerup=${stopEvent} @pointercancel=${stopEvent}
        @click=${stopEvent} @dblclick=${stopEvent} @keydown=${stopEvent} @keyup=${stopEvent}>
        ${shortcuts.map((shortcut, index) => html`
          <button
            aria-label=${shortcut.name || localize(ctx.hass, "ui.renderer.shortcut", { number: index + 1 })}
            title=${shortcut.name || shortcut.id || ""}
            ?disabled=${unavailable}
            @click=${(event: Event) => {
              event.stopPropagation();
              if (unavailable) return;
              ctx.service("media_player", "play_media", {
                entity_id: ctx.config.entity,
                media_content_type: shortcut.type || "playlist",
                media_content_id: shortcut.id,
              });
            }}>
            <ha-icon .icon=${shortcut.icon || "mdi:playlist-music"}></ha-icon>
            ${shortcut.name ? html`<span>${shortcut.name}</span>` : nothing}
          </button>
        `)}
      </div>
    ` : nothing}
  `);
};

const renderPrinter = (ctx: RenderContext): TemplateResult => {
  const details = [
    linkedState(ctx, "black_entity"),
    linkedState(ctx, "yellow_entity"),
    linkedState(ctx, "magenta_entity"),
    linkedState(ctx, "cyan_entity"),
  ];
  const colors = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return ctx.actionSurface("custom-printer", html`
    <div class="custom-card-heading">
      ${iconBubble(ctx, "mdi:printer", ctx.entity?.state === "idle" ? "grey" : "blue")}
      ${heading(ctx, stateLabel(ctx.entity, ctx.hass))}
    </div>
    <div class="toner-bars">${details.map((entity, index) => {
      if (!entity) return nothing;
      const value = Math.max(0, Math.min(100, numeric(entity.state) ?? 0));
      return html`<span style=${`--toner:${colors[index]};--level:${value}%`}><i><em></em><b>${stateLabel(entity, ctx.hass)}</b></i></span>`;
    })}</div>
  `);
};

const renderNasMetrics = (ctx: RenderContext): TemplateResult => {
  const disk = linkedState(ctx, "disk_entity") ?? entityFromConfig(ctx, "entity_4");
  const temperature = linkedState(ctx, "temperature_entity") ?? entityFromConfig(ctx, "entity_1");
  const memory = linkedState(ctx, "memory_entity") ?? entityFromConfig(ctx, "entity_2");
  const cpu = linkedState(ctx, "cpu_entity") ?? entityFromConfig(ctx, "entity_3");
  const online = !["off", "unavailable", "unknown"].includes(ctx.entity?.state ?? "");
  const colorValue = (key: string, fallback: string): string => {
    return configuredColor(
      configured<string>(ctx, key),
      configuredColor(fallback, fallback),
    );
  };
  const hasConfiguredColor = (key: string): boolean => Boolean(configured<string>(ctx, key));
  const legacyMax = (key: string): number | undefined => {
    const value = ctx.config[key];
    return value && typeof value === "object" && "max_value" in value ? numeric(value.max_value) : undefined;
  };
  const ring = (entity: HassEntity | undefined, radius: number, color: string, max = 100) => {
    const value = Math.max(0, Math.min(max, numeric(entity?.state) ?? 0));
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - value / max);
    return svg`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${radius}
      fill="none" stroke=${color} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${circumference} stroke-dashoffset=${offset}></circle>`;
  };
  const status = ctx.entity?.state === "on" ? localizeText(ctx.hass, "Access") : stateLabel(ctx.entity, ctx.hass);
  const statusTile = html`
    <button class="nas-metrics-tile status-tile" aria-label="${localizeText(ctx.hass, "Open NAS status")}"
      @pointerdown=${(event: Event) => event.stopPropagation()}
      @click=${(event: Event) => runControlAction(event, ctx, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>${localizeText(ctx.hass, "Status")}</b><small>${status}</small></span>
    </button>`;
  if (!online) return ctx.actionSurface("custom-nas-metrics is-off", html`<div class="nas-metrics-top">${statusTile}</div>`);
  return ctx.actionSurface("custom-nas-metrics is-on", html`
    <div class="nas-metrics-top">
      ${statusTile}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${hasConfiguredColor("disk_color") ? "" : "tone-red"}`}
          style=${hasConfiguredColor("disk_color")
            ? `color:${colorValue("disk_color", "red")};background:color-mix(in srgb, ${colorValue("disk_color", "red")} 18%, transparent)`
            : ""}>
          <ha-icon .icon=${configured<string>(ctx, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${configured<string>(ctx, "disk_name") || localizeText(ctx.hass, "Disk")}</b><small>${stateLabel(disk, ctx.hass)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${hasConfiguredColor("temperature_color") ? "" : "tone-orange"} style=${hasConfiguredColor("temperature_color") ? `color:${colorValue("temperature_color", "orange")}` : ""}><ha-icon .icon=${configured<string>(ctx, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${configured<string>(ctx, "temperature_name") || localizeText(ctx.hass, "Temp")}</b><small>${stateLabel(temperature, ctx.hass)}</small></span></span>
        <span><i class=${hasConfiguredColor("memory_color") ? "" : "tone-blue"} style=${hasConfiguredColor("memory_color") ? `color:${colorValue("memory_color", "blue")}` : ""}><ha-icon .icon=${configured<string>(ctx, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${configured<string>(ctx, "memory_name") || localizeText(ctx.hass, "Memory")}</b><small>${stateLabel(memory, ctx.hass)}</small></span></span>
        <span><i class=${hasConfiguredColor("cpu_color") ? "" : "tone-green"} style=${hasConfiguredColor("cpu_color") ? `color:${colorValue("cpu_color", "green")}` : ""}><ha-icon .icon=${configured<string>(ctx, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${configured<string>(ctx, "cpu_name") || localizeText(ctx.hass, "CPU")}</b><small>${stateLabel(cpu, ctx.hass)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="${localizeText(ctx.hass, "NAS temperature, memory, and CPU utilization")}">
        ${[58, 48, 38].map((radius) => svg`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${radius}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${ring(temperature, 58, colorValue("temperature_color", "orange"), numeric(configured(ctx, "temperature_max")) ?? legacyMax("entity_1") ?? 100)}
        ${ring(memory, 48, colorValue("memory_color", "blue"), numeric(configured(ctx, "memory_max")) ?? legacyMax("entity_2") ?? 100)}
        ${ring(cpu, 38, colorValue("cpu_color", "green"), numeric(configured(ctx, "cpu_max")) ?? legacyMax("entity_3") ?? 100)}
      </svg>
    </div>
  `);
};

const renderTablet = (ctx: RenderContext): TemplateResult => {
  const batteryEntity = linkedState(ctx, "battery_entity");
  const battery = Math.max(0, Math.min(100, numeric(batteryEntity?.state) ?? 0));
  const controls = [
    ["tablet_button_usb_entity", "mdi:usb", "green", localizeText(ctx.hass, "Toggle USB")],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", localizeText(ctx.hass, "Toggle motion")],
    ["tablet_button_display_entity", "mdi:monitor", "green", localizeText(ctx.hass, "Toggle display")],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", localizeText(ctx.hass, "Restart tablet")],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", localizeText(ctx.hass, "Toggle maintenance mode")],
    ["tablet_reload_entity", "mdi:reload", "blue", localizeText(ctx.hass, "Reload tablet")],
  ] as const;
  const metricCandidates: Array<readonly [string, HassEntity | undefined]> = [
    [localizeText(ctx.hass, "RAM"), linkedState(ctx, "tablet_ram_entity")],
    [localizeText(ctx.hass, "Disk"), linkedState(ctx, "tablet_disk_entity")],
    [localizeText(ctx.hass, "Power"), linkedState(ctx, "tablet_power_entity")],
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
  const status = ctx.entity?.state === "on" ? localizeText(ctx.hass, "Access") : stateLabel(ctx.entity, ctx.hass);
  const activateTabletControl = (event: Event, entity?: HassEntity): void => {
    event.stopPropagation();
    if (!entity) return;
    const domain = entity.entity_id.split(".")[0];
    if (domain === "button") ctx.service("button", "press", { entity_id: entity.entity_id });
    else ctx.service("homeassistant", "toggle", { entity_id: entity.entity_id });
  };
  return ctx.actionSurface("custom-tablet", html`
    <div class="tablet-header">
      ${iconBubble(ctx, "mdi:tablet", "blue", "tablet-icon")}
      ${heading(ctx, status)}
    </div>
    ${configuredControls.length ? html`<div class="tablet-controls">${configuredControls.map(([controlIcon, tone, label, entity]) => {
      const unavailable = entity.state.toLowerCase() === "unavailable";
      return html`<button class="tone-${tone} ${activeStates.has(entity.state) ? "is-active" : ""}"
        aria-label=${label} ?disabled=${unavailable}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => activateTabletControl(event, entity)}>
        <ha-icon .icon=${controlIcon}></ha-icon>
      </button>`;
    })}</div>` : nothing}
    ${metricEntities.length ? html`<div class="tablet-metrics">${metricEntities.map(([label, entity]) => html`
      <span class=${entity.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${stateLabel(entity, ctx.hass)}</b><small>${label}</small></span>
    `)}</div>` : nothing}
    ${batteryEntity ? html`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${stateLabel(batteryEntity, ctx.hass)}</b><small>${localizeText(ctx.hass, "Battery")}</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${battery}%`}></i><b><span>${battery}%</span></b></div>` : nothing}
  `);
};

const renderConsoleCard = (ctx: RenderContext): TemplateResult => {
  const state = ctx.entity?.state ?? "unknown";
  const resolved = resolveConsoleEntities(ctx.hass, ctx.config.entity, ctx.config);
  const linked = (key: string): HassEntity | undefined => {
    const entityId = resolved[key];
    return entityId ? ctx.hass.states[entityId] : undefined;
  };

  const platform = inferConsolePlatform(ctx.hass, ctx.config.entity, ctx.config);
  const presentation = consolePlatformPresentation(platform);
  const followers = linked("followers_entity");
  const following = linked("following_entity");
  const friends = linked("friends_entity");
  const primaryStat = linked("primary_stat_entity");
  const secondaryStat = linked("secondary_stat_entity");
  const nowPlaying = linked("now_playing_entity");
  const gamerpic = linked("gamerpic_entity");
  const artworkEntity = linked("artwork_entity");
  const power = linked("console_power_entity");
  const picture = attr(gamerpic, "entity_picture") ?? attr(ctx.entity, "entity_picture");
  const artwork = configured<boolean>(ctx, "console_show_artwork") === false
    ? undefined
    : attr(artworkEntity, "entity_picture") ??
      attr(ctx.entity, "media_image_url") ??
      attr(ctx.entity, "entity_picture");
  const activeArtwork = Boolean(artwork);
  const playing = nowPlaying && !["unknown", "unavailable", "none", ""].includes(nowPlaying.state.toLowerCase())
    ? stateLabel(nowPlaying, ctx.hass)
    : String(attr(ctx.entity, "media_title") ?? "");
  const consoleName = displayName(ctx.config, ctx.entity, ctx.hass);
  const social = [
    { entity: followers, icon: "mdi:account-arrow-left", label: localizeText(ctx.hass, "Followers") },
    { entity: following, icon: "mdi:account-arrow-right", label: localizeText(ctx.hass, "Following") },
    { entity: friends, icon: "mdi:account-multiple", label: localizeText(ctx.hass, "Friends") },
  ].filter(({ entity }) => entity);
  const stats = [
    {
      entity: primaryStat,
      icon: configured<string>(ctx, "primary_stat_icon") || (platform === "xbox" ? "mdi:microsoft-xbox" : "mdi:trophy"),
    },
    {
      entity: secondaryStat,
      icon: configured<string>(ctx, "secondary_stat_icon") || "mdi:podium",
    },
  ].filter(({ entity }) => entity);
  const powerDomain = power?.entity_id.split(".", 1)[0];
  const powerOn = power && !["off", "standby", "unavailable", "unknown"].includes(power.state);
  const togglePower = (event: Event): void => {
    event.stopPropagation();
    if (!power || !powerDomain) return;
    if (powerDomain === "switch") {
      ctx.service("homeassistant", "toggle", { entity_id: power.entity_id });
      return;
    }
    ctx.service(powerDomain, powerOn ? "turn_off" : "turn_on", { entity_id: power.entity_id });
  };
  return ctx.actionSurface(`custom-console-card platform-${platform} state-${state} ${activeArtwork ? "has-artwork" : ""}`, html`
    ${activeArtwork ? html`<div class="console-backdrop" style=${styleMap({ backgroundImage: cssUrl(artwork) })}></div>` : nothing}
    <div class="console-content">
      <div class="card-heading console-header">
        ${ctx.config.icon_type !== "none" ? html`
          <span class="console-logo ${picture && ctx.config.icon_type !== "icon" ? "has-picture" : ""}"
            style=${styleMap({ backgroundImage: picture && ctx.config.icon_type !== "icon" ? cssUrl(picture) : undefined })}>
            ${picture && ctx.config.icon_type !== "icon" ? nothing : renderEntityIcon(ctx.hass, ctx.entity, ctx.config.icon, presentation.icon)}
          </span>
        ` : nothing}
        ${heading(ctx, playing || stateLabel(ctx.entity, ctx.hass), consoleName)}
        ${stats.length ? html`<span class="console-top-stats">
          ${stats.map(({ entity, icon }) => html`
            <span title=${String(attr(entity, "friendly_name") ?? "")}>
              <ha-icon .icon=${icon}></ha-icon>
              <b>${stateLabel(entity, ctx.hass)}</b>
            </span>
          `)}
        </span>` : nothing}
      </div>
      ${social.length ? html`<div class="console-social">
        ${social.map(({ entity, icon, label }) => html`
          <span class="console-social-item" title=${label}><ha-icon .icon=${icon}></ha-icon><b>${entity?.state}</b></span>
        `)}
      </div>` : nothing}
      ${configured<boolean>(ctx, "console_show_controls") !== false && power ? html`
        <div class="console-controls">
          <button aria-label=${powerOn ? localizeText(ctx.hass, "Turn console off") : localizeText(ctx.hass, "Turn console on")}
            @pointerdown=${(event: Event) => event.stopPropagation()}
            @click=${togglePower}>
            <ha-icon .icon=${powerOn ? "mdi:power" : "mdi:power-standby"}></ha-icon>
            <span>${powerOn ? localizeText(ctx.hass, "Power off") : localizeText(ctx.hass, "Power on")}</span>
          </button>
        </div>
      ` : nothing}
    </div>
  `);
};

const renderEntityCarousel = (ctx: RenderContext): TemplateResult => {
  const showPresentation = ctx.config.carousel_show_header ?? [
    ctx.config.name,
    ctx.config.primary_info,
    ctx.config.secondary_info,
    ctx.config.icon,
    ctx.config.show_name === true ? true : undefined,
  ].some((value) => value !== undefined);
  return html`
    <ha-card class="mushroom-addition-card entity-carousel-card">
      ${showPresentation ? html`
        <div class="metric-heading entity-carousel-presentation">
          ${sourceIconBubble(ctx, icon(ctx, "mdi:view-carousel"), "var(--primary-color)", true)}
          ${heading(ctx, stateLabel(ctx.entity, ctx.hass), ctx.config.name ? displayName(ctx.config, ctx.entity, ctx.hass) : ctx.descriptor.name)}
        </div>
      ` : nothing}
      <mushroom-addition-entity-carousel
        .hass=${ctx.hass}
        .config=${ctx.config}>
      </mushroom-addition-entity-carousel>
    </ha-card>
  `;
};

const renderAdvancedHomeEnergyManagement = (ctx: RenderContext): TemplateResult => {
  ctx.presentation.rendered = true;
  const config = ctx.config;
  const showPresentation = [
    config.name,
    config.primary_info,
    config.secondary_info,
    config.icon,
    config.icon_type,
  ].some((value) => value !== undefined);
  const home = powerEntityWatts(ctx.hass, config.entity) ?? 0;
  const grid = powerEntityWatts(ctx.hass, config.grid_power_entity) ?? 0;
  const phases = [
    config.grid_phase_1_entity,
    config.grid_phase_2_entity,
    config.grid_phase_3_entity,
  ].map((entityId) => powerEntityWatts(ctx.hass, entityId) ?? 0);
  const solar = powerEntityWatts(ctx.hass, config.solar_power_entity) ?? 0;
  const forecast = numericEntityState(ctx.hass, config.solar_forecast_entity) ?? 0;
  const battery = powerEntityWatts(ctx.hass, config.battery_power_entity) ?? 0;
  const batteryLevel = Math.max(0, Math.min(100,
    numericEntityState(ctx.hass, config.battery_level_entity) ?? 0));
  const ev = powerEntityWatts(ctx.hass, config.ev_charger_power_entity) ?? 0;
  const batteries = [1, 2, 3].map((index) => ({
    level: numericEntityState(ctx.hass, configured<string>(ctx, `battery_${index}_level_entity`)) ?? 0,
    power: powerEntityWatts(ctx.hass, configured<string>(ctx, `battery_${index}_power_entity`)) ?? 0,
  }));
  const modeRaw = config.energy_mode_entity
    ? ctx.hass.states[config.energy_mode_entity]?.state ?? "-"
    : "-";
  const modeNames: Record<string, string> = {
    "Smart Matching": config.mode_solar_first_label ?? localizeText(ctx.hass, "Solar first"),
    "Dynamic Smart Matching": config.mode_smart_saving_label ?? localizeText(ctx.hass, "Smart saving"),
    "Dynamic Trading + Smart Matching": config.mode_smart_trading_label ?? localizeText(ctx.hass, "Smart trading"),
  };
  const automatic = config.energy_auto_control_entity
    ? ctx.hass.states[config.energy_auto_control_entity]?.state === "on"
    : false;
  const modeLabel = `${modeNames[modeRaw] ?? modeRaw} · ${
    automatic ? config.energy_auto_label ?? localizeText(ctx.hass, "Auto") : config.energy_manual_label ?? localizeText(ctx.hass, "Manual")
  }`;
  const batteryState = battery > 20
    ? `${config.energy_charge_label ?? localizeText(ctx.hass, "Charging")} ${formatPower(battery)}`
    : battery < -20
      ? `${config.energy_discharge_label ?? localizeText(ctx.hass, "Discharging")} ${formatPower(battery)}`
      : config.energy_idle_label ?? localizeText(ctx.hass, "Idle");
  const gridLabel = grid > 20
    ? config.energy_grid_import_label ?? localizeText(ctx.hass, "GRID · Import")
    : grid < -20
      ? config.energy_grid_export_label ?? localizeText(ctx.hass, "GRID · Export")
      : config.energy_grid_label ?? localizeText(ctx.hass, "GRID");
  const importColor = config.import_color ?? "#ff9f43";
  const exportColor = config.export_color ?? "#4cd98b";
  const batteryColor = config.battery_color ?? "#3b82f6";
  const solarColor = config.solar_color ?? "#f5c542";
  const homeColor = config.home_color ?? "#3b82f6";
  const gridColor = grid > 20 ? importColor : exportColor;
  const time = new Date().toLocaleTimeString(ctx.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const track = (radius: number, start: number, end: number) => svg`
    <path d=${energyArcPath(radius, start, end)} class="hems-track"></path>
  `;
  const bar = (
    radius: number,
    start: number,
    end: number,
    fraction: number,
    color: string,
    fromEnd = false,
  ) => {
    const path = energyBarPath(radius, start, end, fraction, fromEnd);
    return path ? svg`<path d=${path} stroke=${color} class="hems-bar"></path>` : nothing;
  };
  const tariffEntity = config.electricity_price_entity
    ? ctx.hass.states[config.electricity_price_entity]
    : undefined;
  const intervals = tariffIntervals(
    tariffEntity,
    numericEntityState(ctx.hass, config.tariff_markup_entity) ?? 0,
    numericEntityState(ctx.hass, config.tariff_vat_entity) ?? 0,
  );
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const dayStart = startOfDay.getTime();
  const dayDuration = 86_400_000;
  const now = Date.now();
  const currentInterval = intervals.find((interval) => now >= interval.start && now < interval.end);
  const priceColor = (price: number): string => {
    if (price < 0) return config.price_negative_color ?? "#0288d1";
    if (price < (config.price_low_threshold ?? 0.18)) return config.price_low_color ?? "#2e7d32";
    if (price < (config.price_medium_threshold ?? 0.26)) return config.price_medium_color ?? "#9ccc65";
    if (price < (config.price_high_threshold ?? 0.34)) return config.price_high_color ?? "#fdd835";
    if (price < (config.price_critical_threshold ?? 0.42)) return config.import_color ?? "#fb8c00";
    return config.price_critical_color ?? "#e53935";
  };
  const formatTime = (value: number): string =>
    new Date(value).toLocaleTimeString(ctx.hass.language ?? "nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return ctx.actionSurface("advanced-energy-management", html`
    ${showPresentation ? html`
      <div class="hems-presentation">${cardHeading(ctx)}</div>
    ` : nothing}
    <svg class="hems-flow" viewBox="0 0 760 650" role="img" aria-label="${localizeText(ctx.hass, "Advanced home energy live flow")}">
      <circle cx="380" cy="300" r="80" class="hems-track hems-battery-track"></circle>
      ${bar(80, 0, Math.min(batteryLevel, 99.9) * 3.6, 1, batteryColor)}
      <text x="380" y="270" class="hems-muted hems-center">${localizeText(ctx.hass, "▮ Battery")}</text>
      <text x="380" y="318" class="hems-battery-value hems-center">${Math.round(batteryLevel)}%</text>
      <text x="380" y="346" class="hems-muted hems-center">${batteryState}</text>
      <text x="380" y="125" class="hems-time hems-muted hems-center">${time}</text>

      ${config.show_grid_phases !== false ? [250, 270, 290].map((radius, index) => svg`
        ${track(radius, 272, 352)}
        ${bar(radius, 272, 352, Math.abs(phases[index]) / (config.grid_phase_scale_max ?? 3000),
          phases[index] < 0 ? exportColor : importColor)}
      `) : nothing}
      <text x="180" y="185" class="hems-muted">${gridLabel}</text>
      <text x="180" y="228" class="hems-main-value" fill=${gridColor}>⚡ ${formatPower(grid)}</text>
      ${config.show_grid_phases !== false ? phases.map((phase, index) => svg`
        <text x="180" y=${258 + index * 22} class="hems-detail hems-muted">
          L${index + 1} ${phase >= 0 ? "↓" : "↑"} ${formatPower(phase)}
        </text>
      `) : nothing}

      ${track(265, 188, 262)}
      ${bar(265, 188, 262, solar / (config.solar_scale_max ?? 6000), solarColor, true)}
      <text x="180" y="395" class="hems-muted">${config.energy_solar_label ?? localizeText(ctx.hass, "Solar Panels")}</text>
      <text x="180" y="437" class="hems-main-value">☀️ ${formatPower(solar)}</text>
      <text x="180" y="465" class="hems-detail hems-muted">
        ${config.energy_forecast_label ?? localizeText(ctx.hass, "Expected")} ${forecast.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })} kWh
      </text>

      ${config.show_battery_units !== false ? [250, 270, 290].map((radius, index) => svg`
        ${track(radius, 8, 88)}
        ${bar(radius, 8, 88,
          Math.abs(batteries[index].power) / (config.battery_unit_scale_max ?? 2400),
          batteries[index].power > 0 ? batteryColor : importColor, true)}
      `) : nothing}
      <text x="585" y="185" class="hems-muted hems-end">${config.energy_battery_label ?? localizeText(ctx.hass, "Battery")}</text>
      ${config.show_battery_units !== false ? batteries.map((unit, index) => svg`
        <text x="585" y=${224 + index * 22} class="hems-detail hems-muted hems-end">
          ${index + 1} <tspan fill=${batteryColor} font-weight="600">${Math.round(unit.level)}%</tspan>
          ${unit.power > 20 ? "↑" : unit.power < -20 ? "↓" : ""} ${formatPower(unit.power)}
        </text>
      `) : nothing}

      ${track(265, 98, 172)}
      ${bar(265, 98, 172, home / (config.home_scale_max ?? 4000), homeColor)}
      <text x="585" y="395" class="hems-muted hems-end">${config.energy_home_label ?? localizeText(ctx.hass, "HOME")}</text>
      <text x="585" y="437" class="hems-main-value hems-end">${formatPower(home)} ⌂</text>
      <text x="585" y="465" class="hems-detail hems-muted hems-end">
        🚗 ${config.energy_ev_label ?? localizeText(ctx.hass, "EV charger")} ${formatPower(ev)}
      </text>
      <text x="380" y="522" class="hems-mode hems-muted hems-center">${modeLabel} ▾</text>

      ${config.show_tariff_timeline !== false && intervals.length ? svg`
        ${intervals.map((interval) => {
          const x = 90 + 580 * (interval.start - dayStart) / dayDuration;
          const width = Math.max(580 * (interval.end - interval.start) / dayDuration, 1);
          return svg`<rect x=${x} y="588" width=${width} height="14"
            fill=${priceColor(interval.price)} opacity=".8"></rect>`;
        })}
        ${currentInterval ? svg`
          <text x="90" y="574" class="hems-muted">
            ${formatTime(currentInterval.start)} – ${formatTime(currentInterval.end)}
          </text>
          <text x="670" y="574" class="hems-price hems-end"
            fill=${priceColor(currentInterval.price)}>
            ${Math.round(currentInterval.price * 100)} cents
          </text>
        ` : nothing}
        <rect x=${90 + 580 * (now - dayStart) / dayDuration - 1.5} y="584"
          width="3" height="22" rx="1.5" class="hems-now"></rect>
        ${[0, 6, 12, 18, 24].map((hour) => svg`
          <text x=${90 + 580 * hour / 24} y="624" class="hems-hour hems-muted hems-center">
            ${String(hour % 24).padStart(2, "0")}
          </text>
        `)}
      ` : nothing}
    </svg>
  `);
};

const ENERGY_SERIES = [
  { kind: 0, fallback: "Price" },
  { kind: 1, fallback: "Planned grid charge" },
  { kind: 2, fallback: "Planned sell" },
  { kind: 3, fallback: "Possible sell" },
] as const;

const energyCardHeading = (ctx: RenderContext, title: string, secondary: string) => {
  return cardHeading(ctx, secondary, title);
};

const renderEnergyBuySell = (ctx: RenderContext): TemplateResult => {
  const entity = ctx.entity;
  const slots = energyPriceSlots(entity);
  const spanHours = Math.max(1, numeric(ctx.config.buy_sell_graph_span) ?? 36);
  const now = Date.now();
  const start = ctx.config.buy_sell_span_start !== "now"
    ? new Date(new Date(now).setHours(0, 0, 0, 0)).getTime()
    : now;
  const end = start + spanHours * 60 * 60 * 1000;
  const visibleSlots = slots.filter(({ timestamp }) => timestamp >= start && timestamp < end);
  const minimum = numeric(ctx.config.buy_sell_min_value);
  const maximum = numeric(ctx.config.buy_sell_max_value);
  const bounds = energyPriceBounds(visibleSlots, minimum, maximum);
  const plotLeft = 58;
  const plotRight = 700;
  const plotTop = 22;
  const plotBottom = 254;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const x = (timestamp: number) => plotLeft + ((timestamp - start) / (end - start)) * plotWidth;
  const y = (value: number) =>
    plotBottom - ((value - bounds.minimum) / (bounds.maximum - bounds.minimum)) * plotHeight;
  const priceDecimals = Math.max(0, Math.min(6, Math.floor(numeric(ctx.config.buy_sell_price_decimals) ?? 3)));
  const pointDuration = (index: number) => {
    const next = visibleSlots[index + 1]?.timestamp;
    const duration = next ? next - visibleSlots[index].timestamp : 30 * 60 * 1000;
    return Math.max(60 * 1000, Math.min(duration, 6 * 60 * 60 * 1000));
  };
  const axisDecimals = Math.max(0, Math.min(6, Math.floor(numeric(ctx.config.buy_sell_axis_decimals) ?? 2)));
  const chartColors = ENERGY_SERIES.map((_, index) =>
    configuredColor(configured<string>(ctx, [
      "buy_sell_price_color",
      "buy_sell_charge_color",
      "buy_sell_planned_sell_color",
      "buy_sell_possible_sell_color",
    ][index]), ["#78909c", "#43a047", "#fb8c00", "#ffcc80"][index]));
  const nowColor = configuredColor(
    configured<string>(ctx, "buy_sell_now_color"),
    "var(--primary-text-color)",
  );
  const interval = 4 * 60 * 60 * 1000;
  const tickTimes: number[] = [];
  for (let timestamp = start; timestamp <= end; timestamp += interval) tickTimes.push(timestamp);
  if (tickTimes.at(-1) !== end) tickTimes.push(end);
  const timeLabel = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const legendKeys = [
    "buy_sell_price_label",
    "buy_sell_charge_label",
    "buy_sell_planned_sell_label",
    "buy_sell_possible_sell_label",
  ] as const;
  const legendLabels = ENERGY_SERIES.map(({ fallback }, index) =>
    String(ctx.config[legendKeys[index]] || localizeText(ctx.hass, fallback)));
  const tradeEnergyEntity = ctx.config.buy_sell_trade_energy_entity;
  const tradeEnergy = tradeEnergyEntity
    ? Number(ctx.hass.states[tradeEnergyEntity]?.state)
    : Number(ctx.config.buy_sell_trade_energy ?? 10);
  const tradePower = Number(ctx.config.buy_sell_trade_power ?? 7.2);
  const tradeEfficiency = Number(ctx.config.buy_sell_trade_efficiency ?? 86);
  const feedInFee = Number(ctx.config.buy_sell_feed_in_fee ?? 0);
  const trade = tradeEnergyEntity && (!Number.isFinite(tradeEnergy) || tradeEnergy <= 0)
    ? { error: `Minimum trade size entity ${tradeEnergyEntity} must provide a positive numeric kWh value.` }
    : energyTradeResult(slots, {
      energy: tradeEnergy,
      power: tradePower,
      efficiency: tradeEfficiency,
      fee: feedInFee,
      slotMinutes: Number(ctx.config.buy_sell_slot_minutes ?? 15),
    });
  const signedMoney = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
  const tradeTime = (timestamp: number) => new Date(timestamp).toLocaleString(
    ctx.hass.language ?? "en-GB",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
  );
  const tradeRow = (label: string, selection: EnergyTradeSelection, color: string) => html`
    <tr>
      <th scope="row"><span class="energy-result-kind" style=${`--energy-result-color:${color}`}><i></i>${label}</span></th>
      <td title=${selection.slots.map((slot) => `${tradeTime(slot.start)} – ${tradeTime(slot.end)}`).join("; ")}>
        ${tradeTime(selection.slots[0].start)} – ${tradeTime(selection.slots.at(-1)!.end)}
        (${selection.slots.length} slots)
      </td>
      <td>${selection.averagePrice.toFixed(3)}</td>
      <td>${selection.energy.toFixed(1)}</td>
      <td>${signedMoney(selection.amount)}</td>
    </tr>
  `;

  return ctx.actionSurface("energy-buy-sell-card", html`
      ${energyCardHeading(ctx, String(ctx.config.buy_sell_title || localizeText(ctx.hass, "Buy and sell moments (all-in €/kWh)")), localizeText(ctx.hass, "Price timeline"))}
      <div class="energy-buy-sell-chart" style=${`height:${Math.max(120, Math.min(700, numeric(ctx.config.buy_sell_chart_height) ?? 300))}px`} role="img"
        aria-label=${localize(ctx.hass, "ui.renderer.energy_chart", { hours: spanHours })}>
        <svg viewBox="0 0 720 314" preserveAspectRatio="none" aria-hidden="true">
          ${Array.from({ length: 5 }, (_, index) => {
            const value = bounds.maximum - (bounds.maximum - bounds.minimum) * index / 4;
            const yPos = plotTop + plotHeight * index / 4;
            return svg`
              ${ctx.config.buy_sell_show_grid !== false ? svg`
                <line x1=${plotLeft} y1=${yPos} x2=${plotRight} y2=${yPos} class="energy-chart-grid"></line>
              ` : nothing}
              <text x=${plotLeft - 8} y=${yPos + 4} text-anchor="end" class="energy-chart-tick">
                ${formatEnergyPrice(value, axisDecimals)}
              </text>
            `;
          })}
          <text x="14" y=${(plotTop + plotBottom) / 2} text-anchor="middle"
            transform=${`rotate(-90 14 ${(plotTop + plotBottom) / 2})`} class="energy-chart-axis-title">${ctx.config.buy_sell_axis_label || "€/kWh"}</text>
          ${tickTimes.map((timestamp) => {
            const xPos = x(timestamp);
            return svg`
              <line x1=${xPos} y1=${plotBottom} x2=${xPos} y2=${plotBottom + 4} class="energy-chart-axis"></line>
              <text x=${xPos} y=${plotBottom + 20} text-anchor="middle" class="energy-chart-tick">
                ${timeLabel(timestamp)}
              </text>
            `;
          })}
          ${visibleSlots.map((slot, index) => {
            const seriesIndex = slot.kind;
            const color = chartColors[seriesIndex];
            const valueY = y(slot.price);
            const zeroY = y(Math.max(bounds.minimum, Math.min(0, bounds.maximum)));
            const left = x(slot.timestamp);
            const right = x(Math.min(end, slot.timestamp + pointDuration(index)));
            const barWidth = Math.max(1, (right - left) * 0.88);
            const top = Math.min(valueY, zeroY);
            const height = Math.max(1, Math.abs(valueY - zeroY));
            return svg`
              <rect x=${left} y=${top} width=${barWidth} height=${height}
                rx=${Math.max(0, Math.min(16, numeric(ctx.config.buy_sell_bar_radius) ?? 2))}
                fill=${color} opacity="0.88">
                <title>${`${legendLabels[seriesIndex]}: ${formatEnergyPrice(slot.price, priceDecimals)} ${ctx.config.buy_sell_axis_label || "€/kWh"}`}</title>
              </rect>
            `;
          })}
          ${visibleSlots.length === 0 ? svg`
            <text x=${(plotLeft + plotRight) / 2} y=${(plotTop + plotBottom) / 2}
              text-anchor="middle" class="energy-chart-empty">${localizeText(ctx.hass, "No price slots available")}</text>
          ` : nothing}
          ${ctx.config.buy_sell_show_now !== false && now >= start && now <= end ? svg`
            <line x1=${x(now)} y1=${plotTop} x2=${x(now)} y2=${plotBottom + 4}
              class="energy-chart-now" style=${`stroke:${nowColor}`}></line>
            <text x=${x(now)} y=${plotTop - 7} text-anchor="middle" class="energy-chart-now-label"
              style=${`fill:${nowColor}`}>
              ${ctx.config.buy_sell_now_label || localizeText(ctx.hass, "Now")}
            </text>
          ` : nothing}
        </svg>
      </div>
      ${ctx.config.buy_sell_show_legend !== false ? html`<div class="energy-chart-legend">
        ${ENERGY_SERIES.map(({ kind }, index) => html`
          <span class="energy-chart-legend-item">
            <span class="energy-chart-legend-swatch" style=${`--energy-series-color:${chartColors[index]}`}></span>
            ${legendLabels[kind]}
          </span>
        `)}
      </div>` : nothing}
      ${ctx.config.buy_sell_show_result !== false ? html`
        <details class="energy-buy-sell-result"
          @pointerdown=${(event: Event) => event.stopPropagation()}
          @click=${(event: Event) => event.stopPropagation()}
          @dblclick=${(event: Event) => event.stopPropagation()}
          @keydown=${(event: Event) => event.stopPropagation()}>
          <summary>${localizeText(ctx.hass, "Buy and sell result")}<ha-icon icon="mdi:chevron-down"></ha-icon></summary>
          ${"error" in trade ? html`<p class="energy-card-empty" role="status">${trade.error}</p>` : html`
            <div class="energy-result-table-scroll" tabindex="0" role="region" aria-label="${localizeText(ctx.hass, "Buy and sell estimate")}">
              <table class="energy-result-table">
                <thead><tr><th scope="col">${localizeText(ctx.hass, "Action")}</th><th scope="col">${localizeText(ctx.hass, "Slots")}</th><th scope="col">${localizeText(ctx.hass, "avg €/kWh")}</th><th scope="col">kWh</th><th scope="col">€</th></tr></thead>
                <tbody>${tradeRow(localizeText(ctx.hass, "Buy"), trade.buy, chartColors[1])}${tradeRow(localizeText(ctx.hass, "Sell"), trade.sell, chartColors[2])}</tbody>
              </table>
            </div>
            <p class="energy-result-net">${localize(ctx.hass, "ui.renderer.net_result", { energy: Number(tradeEnergy.toFixed(2)), net: signedMoney(trade.net) })}</p>
            <p class="energy-result-note">
              Calculated for the minimum trade size (${Number(tradeEnergy.toFixed(2))} kWh):
              the cheapest slots to buy and the most expensive remaining slots to sell,
              at ${tradePower} kW, over all published prices.
              Buy kWh = sold kWh ÷ round-trip efficiency (${tradeEfficiency}%).
              Sell is revenue after the feed-in fee (${feedInFee} €/kWh).
              Slots may be non-contiguous; the displayed times span the selected slots, not a continuous schedule.
              The final slot may be partially used. This estimate does not enforce buy-before-sell order,
              battery capacity or available charge; the real plan follows Smart saving / Smart trading.
            </p>
          `}
        </details>
      ` : nothing}
  `);
};

const renderPanelHealth = (ctx: RenderContext): TemplateResult => {
  const configuredEntities = Array.isArray(ctx.config.panel_entities) ? ctx.config.panel_entities : undefined;
  const panels = inverterPanelEntities(
    ctx.hass.states,
    configuredEntities,
    ctx.config.entity,
  );
  const summary = summarizePanels(panels);
  const maxOutput = Math.max(1, numeric(ctx.config.panel_gauge_max) ?? 350);
  const thresholds = [0, 1, 2, 3, 4, 5].map((index) =>
    numeric(ctx.config[`panel_segment_${index}`]) ?? [0, 80, 150, 230, 300, maxOutput][index]);
  const gaugeColors = thresholds.map((_, index) =>
    configuredColor(configured<string>(ctx, `panel_color_${index}`), [
      "#b0bec5", "#ffa726", "#d4e157", "#66bb6a", "#2e7d32", "#2e7d32",
    ][index]));
  const warningMinimum = numeric(ctx.config.panel_warning_average_min) ?? 30;
  const lowOutputPercent = (numeric(ctx.config.panel_low_output_percent) ?? 60) / 100;
  const warning = summary.averageOutput > warningMinimum && !!summary.weakest &&
    summary.weakest.value < summary.averageOutput * lowOutputPercent;
  const inactive = summary.activeCount < panels.length;
  const status = panels.length === 0
    ? localizeText(ctx.hass, "No panel sensors are selected.")
    : warning
    ? localize(ctx.hass, "ui.renderer.weak_panel", { panel: summary.weakest!.id, percent: Math.round(lowOutputPercent * 100) })
    : inactive
      ? localize(ctx.hass, "ui.renderer.inactive_panels", { count: panels.length - summary.activeCount })
      : localizeText(ctx.hass, "All panels are within the expected range of each other.");
  const statusIcon = panels.length === 0
    ? "mdi:information-outline"
    : warning || inactive
      ? "mdi:alert-circle-outline"
      : "mdi:check-circle-outline";
  const statusTone = warning ? "warning" : inactive || panels.length === 0 ? "muted" : "success";
  const summaryRows: Array<[string, string]> = [
    [localizeText(ctx.hass, "Panels reporting"), `${summary.activeCount} / ${panels.length}`],
    [localizeText(ctx.hass, "Combined output"), `${Math.round(summary.totalOutput)} W`],
    [localizeText(ctx.hass, "Average per panel"), `${Math.round(summary.averageOutput)} W`],
    [localizeText(ctx.hass, "Best panel"), summary.best ? `${summary.best.id} · ${Math.round(summary.best.value)} W` : "—"],
    [localizeText(ctx.hass, "Weakest panel"), summary.weakest ? `${summary.weakest.id} · ${Math.round(summary.weakest.value)} W` : "—"],
    [localizeText(ctx.hass, "Best-to-weakest spread"), `${Math.round(summary.spread)} W`],
  ];

  return ctx.actionSurface("panel-health-card", html`
      ${energyCardHeading(ctx, String(ctx.config.panel_health_title || localizeText(ctx.hass, "Panel health")), localizeText(ctx.hass, "Solar panel output"))}
      ${ctx.config.panel_show_summary !== false ? html`<div class="panel-health-summary">
        ${summaryRows.map(([label, value]) => html`
          <div class="panel-health-summary-row"><span>${label}</span><strong>${value}</strong></div>
        `)}
      </div>` : nothing}
      <div class=${`panel-health-status panel-health-status-${statusTone}`} role="status">
        <ha-icon icon=${statusIcon}></ha-icon><span>${status}</span>
      </div>
      ${panels.length && ctx.config.panel_show_gauges !== false ? html`
        <div class="panel-health-gauges">
          ${panels.map((panel) => {
            const percent = panelGaugePercent(panel.value, maxOutput);
            const color = panelGaugeColor(panel.value, thresholds, gaugeColors);
            const circumference = 2 * Math.PI * 37;
            const progress = circumference * percent / 100;
            const panelName = displayName({
              ...ctx.config,
              entity: panel.entity.entity_id,
            }, panel.entity, ctx.hass) || panel.id;
            return html`
              <button class="panel-health-gauge" type="button"
                aria-label=${localize(ctx.hass, "ui.renderer.panel_watts", { name: panelName, value: Math.round(panel.value) })}
                @click=${(event: Event) => runControlAction(event, ctx, { action: "more-info" }, panel.entity.entity_id)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-track"></circle>
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-value"
                    style=${`--panel-gauge-color:${color};--panel-gauge-progress:${progress};--panel-gauge-circumference:${circumference}`}
                    stroke-dasharray=${`${progress} ${circumference}`}></circle>
                  <text x="50" y="51" text-anchor="middle" class="panel-health-gauge-value-label">
                    ${Math.round(panel.value)}
                  </text>
                </svg>
                <span class="panel-health-gauge-name">${panelName}</span>
              </button>
            `;
          })}
        </div>
      ` : panels.length ? nothing : html`
        <div class="energy-card-empty">${localizeText(ctx.hass, "Select panel sensors in the card editor, or add sensors with entity IDs beginning with sensor.inverter_4.")}</div>
      `}
  `);
};

const renderFlower = (ctx: RenderContext): TemplateResult => {
  const plant = entityFromConfig(ctx, "ulm_card_flower_entity") ?? ctx.entity;
  const problem = plant?.state === "problem";
  const definitionFor = (key: FlowerBarKey) => FLOWER_BARS.find((definition) => definition.key === key)!;
  const metrics = flowerBarsForConfig(ctx.config).flatMap((key) => {
    const definition = definitionFor(key);
    const raw = attr(plant, key);
    const info = typeof raw === "object" && raw !== null
      ? raw as Record<string, unknown>
      : undefined;
    const explicitEntity = entityFromConfig(ctx, flowerEntityConfigKey(key));
    const linkedEntityId = typeof info?.sensor === "string"
      ? info.sensor
      : typeof raw === "string" && ctx.hass.states[raw]
        ? raw
        : undefined;
    const linkedEntity = explicitEntity ?? (linkedEntityId ? ctx.hass.states[linkedEntityId] : undefined);
    const plantDeviceClass = String(attr(plant, "device_class") ?? "");
    const primaryMatches = plant?.entity_id.startsWith("sensor.") && (
      plantDeviceClass === key ||
      (key === "moisture" && (!plantDeviceClass || plantDeviceClass === "humidity"))
    );
    const sourceEntity = linkedEntity ?? (primaryMatches ? plant : undefined);
    const value = numeric(sourceEntity?.state) ?? numeric(info?.current) ?? numeric(raw);
    if (value === undefined) return [];
    const minimum = numeric(info?.min) ?? numeric(attr(sourceEntity, "min")) ?? definition.min;
    const maximum = numeric(info?.max) ?? numeric(attr(sourceEntity, "max")) ?? definition.max;
    const percent = Math.max(0, Math.min(100, ((value - minimum) / Math.max(1, maximum - minimum)) * 100));
    const display = sourceEntity ? stateLabel(sourceEntity, ctx.hass) : String(value);
    return [{ key, definition, sourceEntity, value, percent, display }];
  });
  return ctx.actionSurface("custom-plant", html`
    <button class="flower-heading" aria-label="${localizeText(ctx.hass, "Open plant details")}"
      @pointerdown=${(event: Event) => event.stopPropagation()}
      @click=${(event: Event) => runControlAction(event, ctx, { action: "more-info" }, plant?.entity_id)}>
      ${iconBubble(ctx, problem ? "mdi:alert-circle" : "mdi:flower", problem ? "red" : "green")}
      ${heading(ctx, problem
        ? configured<string>(ctx, "ulm_custom_card_plant_problem") || localizeText(ctx.hass, "Problem")
        : configured<string>(ctx, "ulm_custom_card_plant_correct") || localizeText(ctx.hass, "Healthy"))}
    </button>
    ${metrics.length ? html`<div class="flower-bars">${metrics.map(({ key, definition, sourceEntity, percent, display }) => {
      const label = `${localizeText(ctx.hass, definition.label)}: ${display}`;
      return html`<span data-flower-bar=${key} title=${label} aria-label=${label}>
        <ha-icon .icon=${definition.icon}></ha-icon>
        <i><em style=${`width:${percent}%`}></em></i>
        ${sourceEntity ? html`<output>${display}</output>` : nothing}
      </span>`;
    })}</div>` : nothing}
  `);
};

const renderSpeedtestGauges = (ctx: RenderContext): TemplateResult => {
  const round = configured<boolean>(ctx, "ulm_custom_card_speedtest_round") === true;
  const metric = (
    entityKey: string,
    upstreamKey: string,
    label: string,
    iconName: string,
    colorKey: string,
    fallbackColor: string,
    maxKey: string,
    fallbackMax: number,
    allowRound: boolean,
  ) => {
    const entity = entityFromConfig(ctx, entityKey) ?? entityFromConfig(ctx, upstreamKey);
    const value = numeric(entity?.state);
    const max = Math.max(1, configured<number>(ctx, maxKey) ?? fallbackMax);
    const percent = Math.max(0, Math.min(100, ((value ?? 0) / max) * 100));
    const shownValue = value === undefined ? "—" : allowRound && round ? String(Math.round(value)) : entity!.state;
    const unit = entity?.attributes.unit_of_measurement;
    const color = configuredColor(configured<string>(ctx, colorKey), fallbackColor);
    return html`
      <div class="speedtest-metric" style=${`--speedtest-color:${color};--speedtest-value:${percent}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${iconName}></ha-icon><b>${shownValue}${unit ? ` ${String(unit)}` : ""}</b><small>${label}</small></span>
      </div>`;
  };
  return ctx.actionSurface("custom-speedtest-gauges", html`
    <div class="speedtest-three">
      ${metric("download_entity", "ulm_custom_card_speedtest_download_speed_entity", localizeText(ctx.hass, "Download"), "mdi:download",
        "ulm_custom_card_speedtest_download_speed_color", "rgb(var(--rgb-yellow, 255, 235, 59))", "ulm_custom_card_speedtest_download_speed_max", 100, true)}
      ${metric("upload_entity", "ulm_custom_card_speedtest_upload_speed_entity", localizeText(ctx.hass, "Upload"), "mdi:upload",
        "ulm_custom_card_speedtest_upload_speed_color", "rgb(var(--rgb-blue, 33, 150, 243))", "ulm_custom_card_speedtest_upload_speed_max", 40, true)}
      ${metric("ping_entity", "ulm_custom_card_speedtest_ping_entity", localizeText(ctx.hass, "Ping"), "mdi:wan",
        "ulm_custom_card_speedtest_ping_color", "rgb(var(--rgb-green, 76, 175, 80))", "ulm_custom_card_speedtest_ping_max", 85, false)}
    </div>
  `);
};

const renderPollen = (ctx: RenderContext): TemplateResult => {
  const items = [
    {
      entity: linkedState(ctx, "trees_entity"),
      name: configured<string>(ctx, "custom_card_pollen_tree_name"),
      icon: configured<string>(ctx, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree",
    },
    {
      entity: linkedState(ctx, "grass_entity"),
      name: configured<string>(ctx, "custom_card_pollen_grass_name"),
      icon: configured<string>(ctx, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass",
    },
    {
      entity: linkedState(ctx, "weeds_entity"),
      name: configured<string>(ctx, "custom_card_pollen_weed_name"),
      icon: configured<string>(ctx, "custom_card_pollen_weed_icon"),
      kind: "weed",
      fallbackIcon: "mdi:flower-pollen",
    },
  ];
  const severity = (state?: string): { label: string; color: string; extreme: boolean } => {
    const normalized = state?.toLowerCase() ?? "none";
    const colors: Record<string, string> = {
      none: "rgba(var(--color-grey, 158, 158, 158), 1)",
      very_low: "rgba(var(--color-green, 76, 175, 80), 1)",
      low: "rgb(241, 196, 15)",
      medium: "rgb(243, 156, 18)",
      high: "rgb(231, 76, 60)",
      very_high: "rgba(var(--color-pink, 233, 30, 99), 1)",
    };
    return {
      label: localize(ctx.hass, `ui.pollen_${Object.hasOwn(colors, normalized) ? normalized : "none"}`),
      color: colors[normalized] ?? colors.none,
      extreme: normalized === "very_high",
    };
  };
  const extraRows = ctx.config.show_extra_pollen === true
    ? (ctx.config.pollen_extra ?? [])
      .filter((stream) => stream.enabled !== false && stream.entity)
      .map((stream) => ({ stream, entity: ctx.hass.states[stream.entity!] }))
    : [];
  return ctx.actionSurface("custom-pollen", html`
    <div class="pollen-heading">${cardHeading(ctx)}</div>
    ${items.map((item) => {
      const state = severity(item.entity?.state);
      const name = item.name || item.entity?.attributes.friendly_name || localize(ctx.hass, `ui.pollen_${item.kind}`);
      const iconName = item.icon || item.entity?.attributes.icon || item.fallbackIcon;
      return html`<button class="pollen-item" style=${`--pollen:${state.color}`}
        ?disabled=${!item.entity}
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => item.entity && runControlAction(event, ctx, { action: "more-info" }, item.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${iconName}></ha-icon>
          ${state.extreme ? html`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : nothing}
        </span>
        <b>${name}</b><small>${item.entity ? state.label : localizeText(ctx.hass, "Entity unavailable")}</small>
      </button>`;
    })}
    ${extraRows.length ? html`<div class="waste-grid pollen-extra">${extraRows.map(({ stream, entity }) => {
      const known = entity && ["none", "very_low", "low", "medium", "high", "very_high"].includes(entity.state.toLowerCase());
      const level = known ? severity(entity.state) : undefined;
      const unit = entity?.attributes.unit_of_measurement;
      const shown = !entity ? localizeText(ctx.hass, "Entity unavailable")
        : level ? level.label : `${entity.state}${unit ? ` ${String(unit)}` : ""}`;
      const color = configuredColor(stream.color, level?.color ?? "rgb(var(--rgb-green, 76, 175, 80))");
      return html`<span class="waste-row pollen-extra-row" style=${`--waste-color:${color}`} role="button" tabindex="0"
        @pointerdown=${(event: Event) => event.stopPropagation()}
        @click=${(event: Event) => entity && runControlAction(event, ctx, { action: "more-info" }, entity.entity_id)}>
        <ha-icon .icon=${stream.icon || entity?.attributes.icon || "mdi:flower-pollen"}></ha-icon>
        <b>${stream.label || entity?.attributes.friendly_name || stream.entity}</b>
        <small>${shown}</small>
      </span>`;
    })}</div>` : nothing}
  `);
};

const renderGeneric = (ctx: RenderContext): TemplateResult => {
  const active = activeStates.has(ctx.entity?.state ?? "");
  const color = "rgb(var(--rgb-blue, 33, 150, 243))";
  return ctx.actionSurface("ulm-row", html`
    ${sourceIconBubble(ctx, icon(ctx, "mdi:information-outline"), color, active)}
    ${valueThenName(ctx)}
  `, `--source-color:${color}`);
};

export const renderByFamily = (ctx: RenderContext): TemplateResult => {
  switch (ctx.descriptor.upstreamId) {
    case "stock_card":
      return ctx.actionSurface("stock-card", html`${cardHeading(ctx, ctx.config.secondary, displayName(ctx.config, ctx.entity, ctx.hass) || ctx.descriptor.name)}
        <mushroom-addition-stock .hass=${ctx.hass} .config=${ctx.config}></mushroom-addition-stock>`);
    case "remote_card":
      return ctx.actionSurface("remote-card", html`${cardHeading(ctx, stateLabel(ctx.entity, ctx.hass), displayName(ctx.config, ctx.entity, ctx.hass) || ctx.descriptor.name)}
        <mushroom-addition-remote .hass=${ctx.hass} .config=${ctx.config}></mushroom-addition-remote>`);
    case "pi_hole_card": {
      const header = ctx.config.pihole_show_header === false ? nothing
        : cardHeading(ctx, stateLabel(ctx.entity, ctx.hass), displayName(ctx.config, ctx.entity, ctx.hass) || ctx.descriptor.name);
      ctx.presentation.rendered = true;
      return ctx.actionSurface("pi-hole-card", html`${header}<mushroom-addition-pi-hole .hass=${ctx.hass} .config=${ctx.config}></mushroom-addition-pi-hole>`);
    }
    case "upcoming_media": {
      const data = readUpcomingData(ctx.entity, ctx.config.upcoming_data_attribute);
      if (ctx.config.upcoming_hide_empty && !data.error && !upcomingItems(data, ctx.config).length) return html``;
      return ctx.actionSurface("upcoming-card", html`${cardHeading(ctx, stateLabel(ctx.entity, ctx.hass), displayName(ctx.config, ctx.entity, ctx.hass) || ctx.descriptor.name)}
        <mushroom-addition-upcoming-media .hass=${ctx.hass} .config=${ctx.config}></mushroom-addition-upcoming-media>`);
    }
    case "card_battery": return renderDefaultBattery(ctx);
    case "custom_card_trash": return renderTrash(ctx);
    case "custom_card_alarm_time": return renderAlarmTimeCard(ctx);
    case "custom_card_welcome": return renderWelcome(ctx);
    case "custom_card_washer": return renderWasher(ctx);
    case "custom_card_sun": return renderSunCard(ctx);
    case "custom_card_input_datetime": return renderInputDateTime(ctx);
    case "custom_card_media_player_sonos": return renderSonos(ctx);
    case "custom_card_printer": return renderPrinter(ctx);
    case "custom_card_nas_metrics": return renderNasMetrics(ctx);
    case "custom_card_tablet": return renderTablet(ctx);
    case "custom_card_playstation": return renderConsoleCard(ctx);
    case "custom_card_entity_carousel": return renderEntityCarousel(ctx);
    case "custom_card_light": return renderLight(ctx);
    case "advanced_home_energy_management": return renderAdvancedHomeEnergyManagement(ctx);
    case "advanced_energy_buy_sell": return renderEnergyBuySell(ctx);
    case "advanced_energy_panel_health": return renderPanelHealth(ctx);
    case "custom_card_plant": return renderFlower(ctx);
    case "custom_card_speedtest_gauges": return renderSpeedtestGauges(ctx);
    case "custom_card_pollen": return renderPollen(ctx);
    case "card_room":
      return renderRoom(ctx);
  }
  if (/trash/.test(ctx.descriptor.upstreamId)) return renderScheduleCard(ctx);
  if (/printer/.test(ctx.descriptor.upstreamId)) return renderDeviceStatus(ctx);
  if (/plant|entity_overview/.test(ctx.descriptor.upstreamId)) {
    return renderDetailCard(ctx, /plant/.test(ctx.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  }
  switch (ctx.descriptor.family) {
    case "scene": return renderScene(ctx);
    case "battery": return renderBattery(ctx);
    case "energy":
    case "sensor": return renderMetric(ctx);
    case "media": return renderSonos(ctx);
    case "security": return renderSecurity(ctx);
    case "navigation": return renderNavigation(ctx);
    case "control": return renderControl(ctx);
    case "alarm-time": return renderAlarmTime(ctx);
    default: return renderGeneric(ctx);
  }
};
