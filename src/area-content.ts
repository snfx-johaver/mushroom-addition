import { html, render } from "lit";
import type { HassEntity, HomeAssistant } from "./types";
import { roomLightRgb } from "./room";
import { airQualityStatus } from "./air-quality";
import { localizeText } from "./localize";
import { stateLabel } from "./helpers";

export const AREA_CONTENT_KEYS = ["alert_color", "sensor_wrap", "sensor_icons", "use_light_color", "light_entity", "camera_privacy_entity", "status_air_quality_entity", "status_light_entity", "status_motion_entities", "area_buttons_per_row", "area_button_shadow"] as const;
export interface AreaContentOptions {
  camera_privacy_entity?: string;
  status_air_quality_entity?: string;
  status_light_entity?: string;
  status_motion_entities?: string[];
  area_buttons_per_row?: number;
  area_button_shadow?: boolean;
  alert_color?: string;
  sensor_wrap?: boolean;
  sensor_icons?: boolean;
  use_light_color?: boolean;
  /** Legacy only; accents are derived from the selected area. */
  light_entity?: string;
}
interface NativeContentCard extends HTMLElement {
  hass?: HomeAssistant;
  _config?: Record<string, unknown>;
  _computeSensorsDisplay?: () => string | undefined;
  _groupedSensorEntityIds?: (entities: HomeAssistant["entities"], area: string, classes: string[], excludes?: string[]) => Map<string, string[]>;
  _domainEntityIds?: (entities: HomeAssistant["entities"], area: string, domains: string[], excludes?: string[]) => string[];
}

export const areaCssColor = (color?: string): string | undefined =>
  !color || ["default", "state"].includes(color) ? undefined
    : /^(#|rgb|hsl|var\(|color\()/.test(color) ? color : `var(--${color}-color, ${color})`;

// Keep native aggregation and formatting authoritative; only the secondary slot is enhanced.
export function applyAreaContent(card: NativeContentCard, options: AreaContentOptions): void {
  const root = card.shadowRoot;
  if (!root) return;
  const hass = card.hass;
  card.style.setProperty("--addition-area-button-shadow", options.area_button_shadow === false
    ? "none" : "var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12))");
  const area = card._config?.area;
  let rgb: number[] | undefined;
  if (options.use_light_color && hass && typeof area === "string") {
    const excludes = card._config?.exclude_entities as string[] | undefined;
    const ids = card._domainEntityIds?.(hass.entities, area, ["light"], excludes) ??
      Object.keys(hass.states).filter(id => {
        const entry = hass.entities?.[id];
        const entityArea = entry?.area_id ?? (entry?.device_id ? hass.devices?.[entry.device_id]?.area_id : undefined);
        return entityArea === area;
      });
    for (const id of [...ids].sort()) {
      if (!id.startsWith("light.") || excludes?.includes(id)) continue;
      rgb = roomLightRgb(hass, hass.states[id]);
      if (rgb) break;
    }
  }
  card.toggleAttribute("data-light-accent", Boolean(rgb));
  if (rgb) card.style.setProperty("--addition-room-rgb", rgb.join(","));
  else card.style.removeProperty("--addition-room-rgb");
  const color = areaCssColor(options.alert_color);
  if (color) card.style.setProperty("--addition-alert-color", color);
  else card.style.removeProperty("--addition-alert-color");
  let style = root.querySelector<HTMLStyleElement>("style[data-area-content]");
  if (!style) {
    style = document.createElement("style");
    style.dataset.areaContent = "";
    style.textContent = `
      :host([data-light-accent]) ha-card {
        background: linear-gradient(rgba(var(--addition-room-rgb), .12), rgba(var(--addition-room-rgb), .12)),
          var(--ha-card-background, var(--card-background-color));
        --tile-color: rgb(var(--addition-room-rgb)) !important;
      }
      .header .alerts .alert { background-color: var(--addition-alert-color, var(--orange-color)); }
      ha-tile-icon .alert-badge { --tile-badge-background-color: var(--addition-alert-color, var(--orange-color)); }
      ha-tile-info:has(.addition-sensors) { min-width: 0; }
      ha-tile-container:has(.addition-sensors.wrap) {
        --ha-tile-info-min-height: auto;
        --ha-tile-info-primary-min-height: auto;
      }
      .addition-sensors { display:flex; align-items:center; gap:4px 8px; min-width:0;
        max-width:100%; overflow:hidden; white-space:nowrap; }
      .addition-sensors.wrap { flex-wrap:wrap; overflow:visible; white-space:normal; }
      .addition-sensor { display:inline-flex; align-items:center; gap:4px; min-width:0; }
      .addition-sensor .value { overflow-wrap:anywhere; }
      .addition-sensor ha-state-icon { flex:none; --mdc-icon-size:14px;
        color:var(--secondary-text-color); }
      ha-card[data-area-compact] { height:auto !important; justify-content:flex-start; }
      ha-card[data-area-compact] ha-tile-container { height:auto !important; }
      ha-tile-container > hui-card-features[slot="features"] { box-sizing:border-box; padding-top:8px; }
      ha-tile-container[data-area-status] { position:relative; container-type:inline-size; }
      ha-tile-container[data-area-status] ha-tile-info { position:static !important; }
      ha-tile-container[data-area-status]:not([data-area-activity]) ha-tile-info > [slot="primary"]:not(.addition-area-status) {
        max-width:min(100%, max(0px, calc(100cqw - 224px))); }
      ha-tile-container[data-area-status] > hui-card-features[slot="features-inline"] {
        box-sizing:border-box; padding-top:24px; }
      .addition-area-status { display:flex; align-items:center; gap:8px; overflow:hidden; white-space:nowrap;
        position:absolute; top:auto; left:auto; right:10px; width:auto;
        max-width:min(150px, max(0px, calc(100cqw - 90px))); padding:0; color:var(--secondary-text-color);
        font-size:var(--mush-card-secondary-font-size, 12px); line-height:16px; }
      .addition-area-status > span { display:inline-flex; align-items:center; gap:4px; flex:none; min-width:0; }
      .addition-area-status > .status-quality { flex:0 1 auto; }
      .addition-area-status .status-label { overflow:hidden; text-overflow:ellipsis; }
      .addition-area-status ha-icon { flex:none; --mdc-icon-size:14px; color:var(--status-color); }
      ha-tile-container[data-area-activity] ha-tile-info > [slot="primary"]:not(.addition-area-status) {
        max-width:min(100%, max(40px, calc(100cqw - 294px))); }
      [data-area-activity] .addition-area-status {
        max-width:min(220px, max(0px, calc(100cqw - 150px))); }
      .addition-area-status > .status-motion { flex:0 1 auto; overflow:hidden; }
      .status-motion ha-relative-time { overflow:hidden; text-overflow:ellipsis; }
      @container (max-width:400px) {
        ha-tile-container[data-area-activity] ha-tile-info > [slot="primary"]:not(.addition-area-status) {
          max-width:min(100%, max(0px, calc(100cqw - 250px))); }
        [data-area-activity] .addition-area-status .status-quality .status-label { display:none; }
      }
      @container (max-width:260px) {
        ha-tile-container[data-area-status] ha-tile-info > [slot="primary"]:not(.addition-area-status) {
          max-width:min(100%, max(0px, calc(100cqw - 140px))); }
        .addition-area-status .status-quality .status-label { display:none; }
      }
    `;
    root.append(style);
  }
  const surface = root.querySelector("ha-card");
  surface?.toggleAttribute("data-area-compact", card._config?.display_type === "compact");
  const info = root.querySelector("ha-tile-info");
  const container = root.querySelector("ha-tile-container") as (HTMLElement & { fixedInfoHeight: boolean }) | null;
  const motionIds = [...new Set(options.status_motion_entities ?? [])];
  const showStatus = Boolean(info && hass && (options.status_air_quality_entity || options.status_light_entity || motionIds.length));
  container?.toggleAttribute("data-area-status", showStatus);
  container?.toggleAttribute("data-area-activity", Boolean(showStatus && motionIds.length));
  if (container?.shadowRoot && !container.shadowRoot.querySelector("style[data-area-status-layout]")) {
    const layoutStyle = document.createElement("style");
    layoutStyle.dataset.areaStatusLayout = "";
    layoutStyle.textContent = `
      :host .container { box-sizing:border-box; padding-top:10px; }
      :host([data-area-status]) .content { position:static !important; align-items:flex-start !important; }
    `;
    container.shadowRoot.append(layoutStyle);
  }
  let status = info?.querySelector<HTMLDivElement>(":scope > .addition-area-status");
  if (info && hass && showStatus) {
    if (!status) {
      status = document.createElement("div");
      status.className = "addition-area-status";
      status.slot = "primary";
      info.append(status);
    }
    const quality = options.status_air_quality_entity
      ? airQualityStatus(hass, { type: "", entity: options.status_air_quality_entity }) : undefined;
    const light = options.status_light_entity ? hass.states[options.status_light_entity] : undefined;
    const brightness = light?.state === "on" && typeof light.attributes.brightness === "number" &&
      light.attributes.brightness >= 0 && light.attributes.brightness <= 255
      ? `${Math.round(light.attributes.brightness / 255 * 100)}%` : undefined;
    const lightColor = roomLightRgb(hass, light);
    const lightIconColor = light?.state !== "on" ? "var(--secondary-text-color)"
      : lightColor ? `rgb(${lightColor.join(",")})` : "var(--state-light-active-color, var(--amber-color, orange))";
    render(html`${motionIds.map(id => {
      const sensor = hass.states[id];
      const available = sensor && ["on", "off"].includes(sensor.state);
      const timestamp = available && sensor.last_changed && Number.isFinite(Date.parse(sensor.last_changed))
        ? sensor.last_changed : undefined;
      const active = available && sensor.state === "on";
      const occupancy = ["occupancy", "presence"].includes(String(sensor?.attributes.device_class));
      const icon = typeof sensor?.attributes.icon === "string" ? sensor.attributes.icon
        : occupancy ? active ? "mdi:home-account" : "mdi:home-outline"
          : active ? "mdi:motion-sensor" : "mdi:motion-sensor-off";
      const label = sensor?.attributes.friendly_name ?? id;
      return html`<span class="status-motion" title=${`${label}: ${stateLabel(sensor, hass)}`}
        style=${`--status-color:${active ? "var(--state-binary_sensor-active-color, var(--amber-color, orange))" : "var(--secondary-text-color)"}`}>
        <ha-icon .icon=${icon}></ha-icon>${timestamp
          ? html`<ha-relative-time .hass=${hass} .datetime=${timestamp}></ha-relative-time>`
          : html`<span class="status-label">${stateLabel(available ? { ...sensor, state: "unknown" } : sensor, hass)}</span>`}</span>`;
    })}${quality ? html`<span class="status-quality" title=${`${localizeText(hass, "Air Quality")}: ${localizeText(hass, quality.name)}`}
      style=${`--status-color:var(--${quality.color}-color, ${quality.color})`}>
      <ha-icon .icon=${quality.icon}></ha-icon><span class="status-label">${localizeText(hass, quality.name)}</span></span>` : ""}
      ${options.status_light_entity ? html`<span class="status-light" title=${localizeText(hass, "Brightness")}
        style=${`--status-color:${lightIconColor}`}>
        <ha-icon .icon=${"mdi:lightbulb-on"}></ha-icon>${brightness ?? "—"}</span>` : ""}`, status);
  } else status?.remove();
  if (!info) return;
  if (container) {
    const config = card._config;
    container.fixedInfoHeight = !options.sensor_wrap && config?.display_type === "compact"
      && (card as NativeContentCard & { layout?: string }).layout === "grid"
      && (config.grid_options as { rows?: string } | undefined)?.rows !== "auto";
  }
  let slot = info.querySelector<HTMLDivElement>(".addition-sensors");
  if (!options.sensor_wrap && !options.sensor_icons) {
    slot?.remove();
    return;
  }
  const config = card._config;
  if (!config || !hass || !card._computeSensorsDisplay || !card._groupedSensorEntityIds) {
    throw new Error("This Home Assistant frontend cannot enhance Area sensor content. Disable sensor wrapping/icons or update Home Assistant.");
  }
  const areaId = String(config.area);
  const classes = (config.sensor_classes ?? []) as string[];
  const excludes = config.exclude_entities as string[] | undefined;
  const groups = card._groupedSensorEntityIds(hass.entities, areaId, classes, excludes);
  const sensors = classes.flatMap((sensorClass) => {
    const proxy = new Proxy(card, {
      get: (target, key) => key === "_config" ? { ...config, sensor_classes: [sensorClass] } : Reflect.get(target, key, target),
    });
    const value = card._computeSensorsDisplay!.call(proxy);
    if (!value) return [];
    const area = hass.areas?.[areaId];
    const override = area?.[`${sensorClass}_entity_id`];
    const ids = typeof override === "string" ? [override] : groups.get(sensorClass) ?? [];
    let entity = ids.map(id => hass.states[id]).find(state =>
      state && !["unknown", "unavailable"].includes(state.state));
    if (!entity && ["temperature", "humidity"].includes(sensorClass)) {
      const domains = sensorClass === "temperature" ? ["climate"] : ["climate", "humidifier"];
      const ids = card._domainEntityIds?.(hass.entities, areaId, domains, excludes) ?? [];
      entity = ids.map(id => hass.states[id]).find(state => state?.attributes[`current_${sensorClass}`] != null);
    }
    // Attribute-only climate values still use the requested sensor class's native icon.
    const stateObj: HassEntity = entity?.entity_id.startsWith("sensor.") ? entity
      : { entity_id: `sensor.area_${sensorClass}`, state: value, attributes: { device_class: sensorClass } };
    return [{ sensorClass, value, stateObj }];
  });
  if (!slot) {
    slot = document.createElement("div");
    slot.slot = "secondary";
    slot.className = "addition-sensors";
    info.append(slot);
  }
  slot.classList.toggle("wrap", Boolean(options.sensor_wrap));
  render(html`${sensors.map(({ sensorClass, value, stateObj }) => html`
    <span class="addition-sensor" title=${sensorClass.replaceAll("_", " ")}>
      ${options.sensor_icons ? html`<ha-state-icon .hass=${hass} .stateObj=${stateObj}
        ._config=${hass.config} ._connection=${hass.connection} ._entities=${hass.entities}></ha-state-icon>` : ""}
      <span class="value">${value}</span>
    </span>`)}`, slot);
}

export function applyNativeControlColor(group: HTMLElement, color?: string, perRow = 6): void {
  const cssColor = areaCssColor(color);
  if (cssColor) group.style.setProperty("--addition-control-color", cssColor);
  else group.style.removeProperty("--addition-control-color");
  const root = group.shadowRoot;
  if (!root) return;
  const nativeButtons = root.querySelector("ha-control-button-group");
  if (nativeButtons instanceof HTMLElement) {
    nativeButtons.style.setProperty("--area-native-controls-per-row",
      String(Math.max(1, Math.min(nativeButtons.querySelectorAll("ha-control-button").length, perRow))));
  }
  if (nativeButtons?.shadowRoot && !nativeButtons.shadowRoot.querySelector("style[data-area-grid]")) {
    const grid = document.createElement("style");
    grid.dataset.areaGrid = "";
    grid.textContent = `.container { display:grid; height:auto; gap:8px;
      grid-template-columns:repeat(var(--area-native-controls-per-row, 6), minmax(0, 1fr)); }
      ::slotted(*) { width:100% !important; height:var(--feature-height, 42px) !important;
        margin:0 !important; }`;
    nativeButtons.shadowRoot.append(grid);
    (nativeButtons as HTMLElement).style.height = "auto";
  }
  if (root.querySelector("style[data-area-color]")) return;
  const style = document.createElement("style");
  style.dataset.areaColor = "";
  style.textContent = `:host([data-custom-color]) ha-control-button {
    --control-button-icon-color: var(--addition-control-color);
    --control-button-focus-color: var(--addition-control-color);
  }
  ha-control-button, ha-control-button.active {
    --control-button-background-color: var(--mush-control-bg, rgba(var(--rgb-primary-text-color, 128,128,128), .05));
    --control-button-background-opacity: 1;
    --control-button-border-radius: var(--ha-card-border-radius, 12px);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--addition-area-button-shadow, var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12)));
  }
  ha-control-button:not(.active) {
    --control-button-icon-color: var(--secondary-text-color);
  }
  ha-control-button > ha-state-icon, ha-control-button > ha-domain-icon {
    display:grid; place-items:center; width:36px; height:36px; border-radius:50%;
    background:color-mix(in srgb, var(--control-button-icon-color) 18%, transparent);
  }
  :host([data-custom-color]) ha-control-button.active {
    --control-button-icon-color: var(--addition-control-color);
  }
  ha-control-button:hover:not([disabled]) {
    --control-button-background-color: color-mix(in srgb, var(--primary-text-color) 13%, var(--card-background-color));
  }`;
  root.append(style);
}
