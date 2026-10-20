import { html, render } from "lit";
import type { HassEntity, HomeAssistant } from "./types";

export const AREA_CONTENT_KEYS = ["alert_color", "sensor_wrap", "sensor_icons"] as const;
export interface AreaContentOptions {
  alert_color?: string;
  sensor_wrap?: boolean;
  sensor_icons?: boolean;
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
  const color = areaCssColor(options.alert_color);
  if (color) card.style.setProperty("--addition-alert-color", color);
  else card.style.removeProperty("--addition-alert-color");
  let style = root.querySelector<HTMLStyleElement>("style[data-area-content]");
  if (!style) {
    style = document.createElement("style");
    style.dataset.areaContent = "";
    style.textContent = `
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
  const hass = card.hass;
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
  :host([data-custom-color]) ha-control-button.active {
    --control-button-background-color: var(--addition-control-color);
    --control-button-icon-color: var(--addition-control-color);
  }`;
  root.append(style);
}
