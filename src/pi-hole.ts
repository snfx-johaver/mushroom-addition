import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { AdditionConfig, HassEntity, HomeAssistant, PiHoleMetric, PiHoleSection } from "./types";
import { handleAction } from "./helpers";
import { resolveColor } from "./colors";
import { upcomingSize } from "./upcoming-media";
import { MushroomMiniGraphCard } from "./mini-graph";
import type { MiniGraphCardConfig } from "./mini-graph";
import { localize, localizeText } from "./localize";

export const PIHOLE_METRICS: Record<PiHoleMetric, { name: string; icon: string; keys: string[]; unit?: string }> = {
  queries: { name: "DNS queries", icon: "mdi:dns", keys: ["dns_queries_today", "dns_queries", "queries_today"] },
  blocked: { name: "Ads blocked", icon: "mdi:shield-check-outline", keys: ["ads_blocked_today", "ads_blocked", "blocked_queries"] },
  percentage: { name: "Blocked", icon: "mdi:percent", keys: ["ads_percentage_blocked_today", "percent_ads_blocked", "ads_percentage_today", "percentage_blocked"], unit: "%" },
  domains: { name: "Domains blocked", icon: "mdi:block-helper", keys: ["domains_blocked", "domains_being_blocked", "gravity_size"] },
  clients: { name: "Clients", icon: "mdi:devices", keys: ["dns_unique_clients", "unique_clients", "active_clients"] },
  cached: { name: "Cached queries", icon: "mdi:database-clock-outline", keys: ["dns_queries_cached", "queries_cached", "queries_cached_today"] },
  forwarded: { name: "Forwarded queries", icon: "mdi:arrow-decision-outline", keys: ["dns_queries_forwarded", "queries_forwarded", "queries_forwarded_today"] },
  cpu: { name: "CPU usage", icon: "mdi:cpu-64-bit", keys: ["cpu_use", "cpu_usage", "cpu_percent"], unit: "%" },
  memory: { name: "Memory usage", icon: "mdi:memory", keys: ["memory_use", "memory_usage", "memory_percent"], unit: "%" },
  temperature: { name: "Temperature", icon: "mdi:thermometer", keys: ["cpu_temperature", "temperature"] },
};
export const PIHOLE_SECTIONS: Record<PiHoleSection, string> = {
  statistics: "Statistics", blocking: "Blocking switches", pause: "Pause blocking",
  controls: "Maintenance controls", sensors: "Diagnostics", chart: "System load history", versions: "Versions",
};
export const PIHOLE_DEFAULTS = {
  pihole_metrics: ["queries", "blocked", "percentage", "domains", "clients"] as PiHoleMetric[],
  pihole_sections: ["statistics", "blocking", "pause", "controls", "sensors", "chart", "versions"] as PiHoleSection[],
  pihole_collapsed_sections: ["controls", "sensors", "versions"] as PiHoleSection[],
  pihole_pause_durations: ["60", "300", "900"],
  pihole_pause_service: "auto", pihole_duration_field: "duration", pihole_duration_format: "seconds",
  pihole_columns: 2, pihole_accent_color: "green", pihole_chart_hours: 24, pihole_chart_height: 120,
  pihole_chart_metrics: ["cpu", "memory"] as Array<"cpu" | "memory">, pihole_show_header: true,
} satisfies Partial<AdditionConfig>;

const available = (entity?: HassEntity): entity is HassEntity =>
  !!entity && !["unknown", "unavailable"].includes(entity.state);
export const piHoleEntities = (hass: HomeAssistant | undefined, config: AdditionConfig): HassEntity[] => {
  if (!hass) return [];
  const deviceIds = config.pihole_device_ids?.length ? config.pihole_device_ids
    : config.entity && hass.entities?.[config.entity]?.device_id ? [hass.entities[config.entity].device_id!] : [];
  const explicit = new Set([config.entity, ...(config.pihole_entity_order ?? []), ...Object.values(config.pihole_metric_entities ?? {}).flat()]);
  const hidden = new Set(config.pihole_hidden_entities ?? []);
  const order = config.pihole_entity_order ?? [];
  return Object.values(hass.states).filter(entity => !hidden.has(entity.entity_id) &&
    (explicit.has(entity.entity_id) || deviceIds.includes(hass.entities?.[entity.entity_id]?.device_id || "")))
    .sort((a, b) => {
      const left = order.indexOf(a.entity_id), right = order.indexOf(b.entity_id);
      return (left < 0 ? Infinity : left) - (right < 0 ? Infinity : right) || a.entity_id.localeCompare(b.entity_id);
    });
};
export const piHoleMetricEntities = (hass: HomeAssistant | undefined, config: AdditionConfig): Record<PiHoleMetric, HassEntity[]> => {
  const pool = piHoleEntities(hass, config);
  const groups = [...new Set(pool.map(entity => hass?.entities?.[entity.entity_id]?.device_id || ""))];
  return Object.fromEntries(Object.entries(PIHOLE_METRICS).map(([key, metric]) => {
    const override = config.pihole_metric_entities?.[key as PiHoleMetric];
    const entities = override !== undefined ? override.map(id => hass?.states[id] ?? { entity_id: id, state: "unavailable", attributes: {} })
      : groups.flatMap(device => {
        const candidates = pool.filter(entity => entity.entity_id.startsWith("sensor.") && (hass?.entities?.[entity.entity_id]?.device_id || "") === device);
        const match = candidates.find(entity => metric.keys.includes(hass?.entities?.[entity.entity_id]?.translation_key || "")) ??
          candidates.find(entity => metric.keys.some(suffix => entity.entity_id.endsWith(`_${suffix}`)));
        return match ? [match] : [];
      });
    return [key, entities];
  })) as Record<PiHoleMetric, HassEntity[]>;
};
const numberState = (entity: HassEntity): number | undefined => {
  if (!available(entity) || !entity.state.trim()) return undefined;
  const number = Number(entity.state);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};
export const piHoleMetricValue = (key: PiHoleMetric, entities: Record<PiHoleMetric, HassEntity[]>, hass?: HomeAssistant): number | undefined => {
  const values = (metric: PiHoleMetric): number[] | undefined => {
    const states = entities[metric].map(numberState);
    return states.length && states.every((value): value is number => value !== undefined) ? states : undefined;
  };
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  if (key === "percentage") {
    const queries = values("queries"), blocked = values("blocked");
    const devices = (metric: PiHoleMetric) => entities[metric].map(entity => hass?.entities?.[entity.entity_id]?.device_id);
    const queryDevices = devices("queries"), blockedDevices = devices("blocked");
    const paired = queries && blocked && queries.length === blocked.length &&
      queryDevices.every(device => !!device && blockedDevices.includes(device)) &&
      new Set(queryDevices).size === queryDevices.length && new Set(blockedDevices).size === blockedDevices.length;
    if (paired && sum(blocked) <= sum(queries)) return sum(queries) > 0 ? 100 * sum(blocked) / sum(queries) : 0;
  }
  const states = values(key);
  if (!states) return undefined;
  if (["percentage", "cpu", "memory"].includes(key)) return states.every(value => value <= 100) ? sum(states) / states.length : undefined;
  if (key === "temperature") return Math.max(...states);
  return sum(states);
};
export const piHoleDuration = (value: number | string): number | undefined => {
  const raw = String(value).trim().toLowerCase();
  const clock = /^(\d+):([0-5]\d):([0-5]\d)$/.exec(raw);
  if (clock) {
    const seconds = Number(clock[1]) * 3600 + Number(clock[2]) * 60 + Number(clock[3]);
    return Number.isSafeInteger(seconds) && seconds > 0 ? seconds : undefined;
  }
  if (/^\d+$/.test(raw)) {
    const seconds = Number(raw);
    return Number.isSafeInteger(seconds) && seconds > 0 ? seconds : undefined;
  }
  let seconds = 0;
  const remainder = raw.replace(/(\d+)\s*([dhms])/g, (_, number: string, unit: string) => {
    seconds += Number(number) * ({ d: 86400, h: 3600, m: 60, s: 1 }[unit] ?? 0);
    return "";
  }).replace(/[:\s]/g, "");
  return !remainder && Number.isSafeInteger(seconds) && seconds > 0 ? seconds : undefined;
};
const durationString = (seconds: number): string =>
  [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, "0")).join(":");
export const piHolePauseService = (hass: HomeAssistant | undefined, config: AdditionConfig, entity: HassEntity): string | undefined => {
  const requested = config.pihole_pause_service;
  if (requested === "custom") return config.pihole_pause_action ? "custom" : undefined;
  if (requested && requested !== "auto") {
    const [domain, service] = requested.split(".");
    return hass?.services?.[domain]?.[service] ? requested : undefined;
  }
  const platform = hass?.entities?.[entity.entity_id]?.platform;
  return platform && ["pi_hole", "pi_hole_v6"].includes(platform) && hass?.services?.[platform]?.disable ? `${platform}.disable` : undefined;
};

@customElement("mushroom-addition-pi-hole")
export class MushroomPiHole extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @state() private target = "all";
  @state() private error?: string;
  private chart?: MushroomMiniGraphCard;
  private chartKey?: string;
  private holdTimer?: number;
  private tapTimer?: number;
  private held = false;

  public static styles = css`
    :host { display: block; width: 100%; min-width: 0; color: var(--primary-text-color); }
    .sections { display: grid; gap: 12px; }
    details { min-width: 0; }
    summary { cursor: pointer; font-size: 14px; font-weight: 600; padding: 8px 0; }
    .statistics { display: grid; grid-template-columns: repeat(var(--columns), minmax(0, 1fr)); gap: 8px; }
    button { font: inherit; color: inherit; cursor: pointer; }
    button.metric, button.entity, button.duration { box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12)); }
    .metric { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 3px 8px; text-align: left; padding: 12px; border: 0; border-radius: 14px; background: var(--secondary-background-color); min-width: 0; }
    .metric ha-icon { --mdc-icon-size: 22px; color: var(--accent); grid-row: span 2; align-self: center; }
    .value { font-size: 16px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
    .label { color: var(--secondary-text-color); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .list, .pause { display: grid; gap: 8px; }
    .entity { display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box; min-height: 44px; padding: 8px 10px; border: 0; border-radius: 12px; background: var(--secondary-background-color); text-align: left; min-width: 0; font-size: 12px; }
    .entity ha-icon { --mdc-icon-size: 22px; color: var(--accent); flex-shrink: 0; }
    .entity .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entity .state { color: var(--secondary-text-color); }
    .entity.active { background: color-mix(in srgb, var(--accent) 12%, var(--secondary-background-color)); }
    .durations { display: flex; flex-wrap: wrap; gap: 8px; }
    .duration { flex: 1; padding: 10px; min-width: 64px; border: 0; border-radius: 12px; background: var(--secondary-background-color); font-size: 12px; }
    select { width: 100%; padding: 9px; border: 1px solid var(--divider-color); border-radius: 10px; font: inherit; font-size: 12px; color: var(--primary-text-color); background: var(--card-background-color, var(--ha-card-background)); }
    button:disabled { opacity: .55; cursor: default; }
    button:focus-visible, select:focus-visible, summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .message { color: var(--secondary-text-color); font-size: 12px; line-height: 1.5; }
    [role="alert"] { color: var(--error-color, #db4437); }
    @container (max-width: 270px) { .statistics { grid-template-columns: minmax(0, 1fr); } }
  `;
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearTimers();
  }
  protected willUpdate(changes: PropertyValues): void {
    if (changes.has("config")) { this.target = "all"; this.error = undefined; this.clearTimers(); }
  }
  private get pool(): HassEntity[] { return piHoleEntities(this.hass, this.config!); }
  private get switches(): HassEntity[] { return this.pool.filter(entity => entity.entity_id.startsWith("switch.")); }
  private get targets(): HassEntity[] {
    return this.switches.filter(entity => available(entity) && (this.target === "all" || this.target === entity.entity_id));
  }
  protected render() {
    if (!this.config) return nothing;
    const config = this.config, pool = this.pool, sections = config.pihole_sections ?? PIHOLE_DEFAULTS.pihole_sections;
    const mapped = piHoleMetricEntities(this.hass, config);
    return html`<div class="sections" style=${styleMap({
      "--accent": resolveColor(config.pihole_accent_color, "var(--primary-color)"),
      "--columns": String(upcomingSize(config.pihole_columns, 2, 1, 4)),
    })} @click=${this.stop} @dblclick=${this.stop} @pointerdown=${this.stop} @keydown=${this.stop}>
      ${!pool.length ? html`<div class="message" role="alert">${localize(this.hass, "message.choose_pihole")}</div>` : nothing}
      ${this.error ? html`<div class="message" role="alert">${this.error}</div>` : nothing}
      ${sections.map(section => {
        const content = this.renderSection(section, mapped);
        return content === nothing ? nothing : html`<details .open=${!(config.pihole_collapsed_sections ?? PIHOLE_DEFAULTS.pihole_collapsed_sections).includes(section)}>
          <summary>${localizeText(this.hass, PIHOLE_SECTIONS[section])}</summary>${content}
        </details>`;
      })}
    </div>`;
  }
  private renderSection(section: PiHoleSection, mapped: Record<PiHoleMetric, HassEntity[]>) {
    const config = this.config!;
    if (section === "statistics") return html`<div class="statistics">${(config.pihole_metrics ?? PIHOLE_DEFAULTS.pihole_metrics).map(key => {
      const definition = PIHOLE_METRICS[key], value = piHoleMetricValue(key, mapped, this.hass);
      const entity = mapped[key][0] || (key === "percentage" ? mapped.queries[0] : undefined);
      const unit = definition.unit || (key === "temperature" ? entity?.attributes.unit_of_measurement || "" : "");
      return html`<button class="metric" ?disabled=${!entity} aria-label=${`${localizeText(this.hass, definition.name)}: ${value ?? localizeText(this.hass, "unavailable")}`}
        @pointerdown=${() => this.metricHold(entity)} @pointerup=${this.clearHold} @pointercancel=${this.clearHold} @pointerleave=${this.clearHold}
        @click=${(event: MouseEvent) => { if (event.detail < 2) this.metricTap(entity); }} @dblclick=${() => this.metricDoubleTap(entity)}>
        <ha-icon .icon=${definition.icon}></ha-icon><span class="value">${value === undefined ? "--" : value.toLocaleString(this.hass?.language, { maximumFractionDigits: definition.unit ? 1 : 0 })}${value === undefined ? "" : unit}</span>
        <span class="label">${localizeText(this.hass, definition.name)}</span>
      </button>`;
    })}</div>`;
    if (section === "blocking") return this.switches.length ? html`<div class="list">${this.switches.map(entity => html`
      <button class="entity ${entity.state === "on" ? "active" : ""}" ?disabled=${!available(entity)} aria-label=${localize(this.hass, "ui.toggle", { name: entity.attributes.friendly_name || entity.entity_id })}
        @click=${() => void this.call("switch", entity.state === "on" ? "turn_off" : "turn_on", { entity_id: entity.entity_id })}>
        <ha-icon .icon=${entity.state === "on" ? "mdi:shield-check" : "mdi:shield-off-outline"}></ha-icon>
        <span class="name">${entity.attributes.friendly_name || entity.entity_id}</span><span class="state">${localize(this.hass, available(entity) ? entity.state === "on" ? "ui.blocking" : "ui.paused" : "ui.unavailable")}</span>
      </button>`)}</div>` : nothing;
    if (section === "pause") {
      if (!this.switches.length) return nothing;
      const targets = this.targets;
      const supported = targets.length > 0 && targets.every(entity => !!piHolePauseService(this.hass, config, entity));
      return html`<div class="pause">
        <select aria-label=${localize(this.hass, "message.pause_target")} .value=${this.target} @change=${(event: Event) => { this.target = (event.target as HTMLSelectElement).value; }}>
          <option value="all">${localize(this.hass, "message.all_switches")}</option>
          ${this.switches.map(entity => html`<option value=${entity.entity_id} ?disabled=${!available(entity)}>${entity.attributes.friendly_name || entity.entity_id}</option>`)}
        </select>
        ${!supported ? html`<div class="message">${localize(this.hass, "message.pause_backend")}</div>` : nothing}
        <div class="durations">${(config.pihole_pause_durations ?? PIHOLE_DEFAULTS.pihole_pause_durations).map(duration => {
          const seconds = piHoleDuration(duration);
          return html`<button class="duration" ?disabled=${!supported || seconds === undefined} @click=${() => seconds && void this.pause(seconds)}>
            ${seconds === undefined ? localize(this.hass, "message.invalid_duration", { duration }) : seconds % 3600 === 0 ? `${seconds / 3600} h` : seconds % 60 === 0 ? `${seconds / 60} min` : `${seconds} s`}
          </button>`;
        })}</div>
      </div>`;
    }
    const entities = this.pool.filter(entity => section === "controls" ? entity.entity_id.startsWith("button.")
      : section === "versions" ? entity.entity_id.startsWith("update.")
        : section === "sensors" ? /^(sensor|binary_sensor)\./.test(entity.entity_id) && !Object.values(mapped).flat().some(metric => metric.entity_id === entity.entity_id)
          : false);
    if (["controls", "sensors", "versions"].includes(section)) return entities.length ? html`<div class="list">${entities.map(entity => html`
      <button class="entity" ?disabled=${entity.entity_id.startsWith("button.") ? entity.state === "unavailable" : !available(entity)} @click=${() => this.entityAction(entity)}>
        <ha-icon .icon=${entity.attributes.icon || (section === "controls" ? "mdi:tools" : section === "versions" ? "mdi:update" : "mdi:information-outline")}></ha-icon>
        <span class="name">${entity.attributes.friendly_name || entity.entity_id}</span>
        <span class="state">${section === "controls" ? localize(this.hass, "ui.run") : section === "versions" ? String(entity.attributes.installed_version || entity.state) : `${entity.state}${entity.attributes.unit_of_measurement || ""}`}</span>
      </button>`)}</div>` : nothing;
    if (section === "chart") {
      const entities = (config.pihole_chart_metrics ?? PIHOLE_DEFAULTS.pihole_chart_metrics).flatMap(metric => mapped[metric]);
      return entities.length ? html`<div class="chart"></div>` : nothing;
    }
    return nothing;
  }
  protected updated(): void {
    const slot = this.shadowRoot?.querySelector(".chart");
    if (!slot || !this.hass || !this.config) return;
    const mapped = piHoleMetricEntities(this.hass, this.config);
    const entities = (this.config.pihole_chart_metrics ?? PIHOLE_DEFAULTS.pihole_chart_metrics).flatMap(key => mapped[key].map(entity => entity.entity_id));
    const config: MiniGraphCardConfig = {
      type: "custom:mushroom-addition-mini-graph-card", entities, hours_to_show: upcomingSize(this.config.pihole_chart_hours, 24, 1, 168),
      height: upcomingSize(this.config.pihole_chart_height, 120, 80, 300), lower_bound: 0, upper_bound: 100,
      show: { name: false, icon: false, state: false, legend: true, fill: false, points: false },
    };
    const key = JSON.stringify(config);
    if (!this.chart) {
      this.chart = document.createElement("mushroom-addition-mini-graph-card") as MushroomMiniGraphCard;
      this.chart.style.setProperty("--ha-card-border-width", "0px");
      this.chart.style.setProperty("--ha-card-box-shadow", "none");
    }
    if (key !== this.chartKey) { this.chart.setConfig(config); this.chartKey = key; }
    this.chart.hass = this.hass;
    if (this.chart.parentElement !== slot) slot.append(this.chart);
  }
  private async pause(seconds: number): Promise<void> {
    for (const entity of this.targets) {
      const service = piHolePauseService(this.hass, this.config!, entity);
      if (!service) { this.error = localize(this.hass, "message.pause_service"); return; }
      if (service === "custom") {
        const action = this.config!.pihole_pause_action!;
        handleAction(this, { ...this.config!, entity: action.entity || entity.entity_id, tap_action: {
          ...action, data: { ...action.data, [this.config?.pihole_duration_field || "duration"]: this.config?.pihole_duration_format === "duration" ? durationString(seconds) : seconds },
        } }, "tap");
      } else {
        const [domain, name] = service.split(".");
        if (!await this.call(domain, name, { entity_id: [entity.entity_id], duration: durationString(seconds) })) return;
      }
    }
  }
  private async call(domain: string, service: string, data: Record<string, unknown>): Promise<boolean> {
    if (!this.hass) return false;
    this.error = undefined;
    try {
      await this.hass.callService(domain, service, data);
      return true;
    } catch (error) {
      this.error = localize(this.hass, "message.pihole_failed", { error: error instanceof Error ? error.message : String(error) });
      console.warn("Mushroom Addition: Pi-hole action failed", error);
      return false;
    }
  }
  private entityAction(entity: HassEntity): void {
    handleAction(this, { ...this.config!, entity: entity.entity_id, tap_action: entity.entity_id.startsWith("button.")
      ? { action: "perform-action", perform_action: "button.press", target: { entity_id: entity.entity_id }, confirmation: { text: localize(this.hass, "ui.confirm_run", { name: entity.attributes.friendly_name || entity.entity_id }) } }
      : { action: "more-info" } }, "tap");
  }
  private metricAction(entity: HassEntity | undefined, gesture: "tap" | "hold" | "double_tap"): void {
    if (!entity) return;
    const action = this.config?.[`pihole_metric_${gesture}_action`];
    handleAction(this, { ...this.config!, entity: entity.entity_id, [`${gesture}_action`]: action || { action: gesture === "tap" ? "more-info" : "none" } }, gesture);
  }
  private metricHold(entity?: HassEntity): void {
    this.held = false;
    if (this.config?.pihole_metric_hold_action?.action && this.config.pihole_metric_hold_action.action !== "none") {
      this.holdTimer = window.setTimeout(() => { this.held = true; this.metricAction(entity, "hold"); }, 500);
    }
  }
  private metricTap(entity?: HassEntity): void {
    if (this.held) { this.held = false; return; }
    if (this.config?.pihole_metric_double_tap_action?.action && this.config.pihole_metric_double_tap_action.action !== "none") {
      if (this.tapTimer !== undefined) window.clearTimeout(this.tapTimer);
      this.tapTimer = window.setTimeout(() => this.metricAction(entity, "tap"), 300);
    } else this.metricAction(entity, "tap");
  }
  private metricDoubleTap(entity?: HassEntity): void {
    const action = this.config?.pihole_metric_double_tap_action;
    if (!action?.action || action.action === "none") return;
    if (this.tapTimer !== undefined) window.clearTimeout(this.tapTimer);
    this.metricAction(entity, "double_tap");
  }
  private readonly clearHold = (): void => { if (this.holdTimer !== undefined) window.clearTimeout(this.holdTimer); this.holdTimer = undefined; };
  private clearTimers(): void {
    this.clearHold();
    if (this.tapTimer !== undefined) window.clearTimeout(this.tapTimer);
    this.tapTimer = undefined; this.held = false;
  }
  private readonly stop = (event: Event): void => { event.stopPropagation(); };
}
