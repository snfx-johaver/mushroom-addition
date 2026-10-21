import { html, render } from "lit";
import type { HassEntity, HomeAssistant } from "./types";
import { roomLightRgb } from "./room";

export const AREA_CONTENT_KEYS = ["alert_color", "sensor_wrap", "sensor_icons", "use_light_color", "light_entity"] as const;
export interface AreaContentOptions {
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
    `;
    root.append(style);
  }
  const info = root.querySelector("ha-tile-info");
  if (!info) return;
  const container = root.querySelector("ha-tile-container") as (HTMLElement & { fixedInfoHeight: boolean }) | null;
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

export function applyNativeControlColor(group: HTMLElement, color?: string): void {
  const cssColor = areaCssColor(color);
  if (cssColor) group.style.setProperty("--addition-control-color", cssColor);
  else group.style.removeProperty("--addition-control-color");
  const root = group.shadowRoot;
  if (!root || root.querySelector("style[data-area-color]")) return;
  const style = document.createElement("style");
  style.dataset.areaColor = "";
  style.textContent = `:host([data-custom-color]) ha-control-button {
    --control-button-icon-color: var(--addition-control-color);
    --control-button-focus-color: var(--addition-control-color);
  }
  ha-control-button:not(.active) {
    --control-button-background-color: var(--disabled-color, var(--secondary-text-color));
    --control-button-background-opacity: .14;
  }
  :host([data-custom-color]) ha-control-button.active {
    --control-button-background-color: var(--addition-control-color);
    --control-button-icon-color: var(--addition-control-color);
  }`;
  root.append(style);
}
