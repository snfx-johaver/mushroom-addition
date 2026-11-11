import { css, html, nothing, svg, type PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { energyNumber, energyTime } from "../energy-format";
import { localizeText } from "../localize";
import { energySetupNotice, relevantHassChanged } from "../energy-cards/helpers";
import type { AdditionConfig, HomeAssistant } from "../types";
import { MONITOR_CARDS, monitorKind, monitorOptions, monitorStub, validateMonitor, type MonitorConfig, type MonitorKind } from "./config";
import { flowReadings } from "./data";
const flowSceneUrl = new URL("./live-flow-scene.jpg", import.meta.url).href;

export class EnergyMonitorCard extends MushroomAdditionCard {
  @state() protected config?: MonitorConfig;
  private refresh?: number;
  protected kind: MonitorKind = "live_energy_flow";
  protected descriptor = getCatalogItem("mushroom-addition-live-energy-flow");

  static styles = [MushroomAdditionCard.styles, css`
    :host { display: block; min-width: 0; container-type: inline-size; }
    ha-card { overflow: hidden; }
    .content { box-sizing: border-box; margin: auto; padding: 18px; min-width: 0; }
    .energy-heading { padding: 0; background: none; border: 0; width: 100%; color: inherit; text-align: start; }
    .note { font-size: 11px; color: var(--secondary-text-color); line-height: 1.6; overflow-wrap: anywhere; }
    .window { margin: 12px 0; }
    .warning { color: var(--warning-color,#ef8b37); }
    .flow-scene { position: relative; margin: 18px 0; border: 1px solid var(--divider-color); border-radius: 16px; overflow: hidden; background: #e9eaec; isolation: isolate; }
    .flow-art { position: relative; aspect-ratio: 3 / 2; }
    .flow-art img, .flow-lines { display: block; width: 100%; height: 100%; position: absolute; inset: 0; }
    .flow-art img { object-fit: contain; }
    :host([dark]) .flow-art img { filter: brightness(.68) saturate(.9); }
    .flow-lines { pointer-events: none; overflow: visible; }
    .flow-cable-shadow, .flow-cable, .flow-wire, .flow-highlight { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .flow-cable-shadow { stroke: #171d25; stroke-width: 5; opacity: .18; transform: translateY(2px); filter: blur(1px); }
    .flow-cable { stroke: #343b42; stroke-width: 3.5; opacity: .9; }
    .flow-wire { stroke: var(--flow-color); opacity: .65; stroke-width: 1.8; }
    .flow-highlight { stroke: #fff; stroke-width: .65; opacity: .25; transform: translateY(-.6px); }
    .flow-line[data-state=unavailable] .flow-wire, .flow-line[data-state=absent] .flow-wire { stroke: #8a9099; stroke-dasharray: 4 6; opacity: .55; }
    .flow-line[data-state=unavailable] .flow-cable, .flow-line[data-state=absent] .flow-cable { opacity: .4; }
    .flow-current { fill: none; stroke: var(--flow-color); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1 9; filter: drop-shadow(0 0 1.5px var(--flow-color)); animation: energy-current var(--flow-duration) linear infinite; }
    .flow-line[data-direction=reverse] .flow-current { animation-direction: reverse; }
    .flow-port { fill: #28323d; stroke: #b6bec7; stroke-width: 2; }
    .flow-port-core { fill: var(--flow-color); }
    .flow-routes { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
    .flow-route-reading { flex: 1 1 180px; display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 4px 8px; min-width: 0; padding: 10px 12px; border: 1px solid var(--divider-color); border-inline-start: 3px solid var(--flow-color); border-radius: 10px; font-size: 11px; overflow-wrap: anywhere; }
    .flow-route-reading b { font-variant-numeric: tabular-nums; }
    .flow-route-reading small { grid-column: 1 / -1; color: var(--secondary-text-color); }
    .flow-readings { position: absolute; inset: 0; pointer-events: none; }
    .flow-node { position: absolute; left: var(--node-x); top: var(--node-y); transform: translateX(-50%); min-width: 100px; max-width: 24%;
      box-sizing: border-box; text-align: center; padding: 7px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--ha-card-background,var(--card-background-color,#fff)); color: var(--primary-text-color); box-shadow: 0 2px 8px #0001; overflow-wrap: anywhere; font-size: 11px; }
    .flow-node[data-key=battery], .flow-node[data-key=ev] { top: auto; bottom: 2%; }
    .flow-node b { display: block; font-size: 17px; font-weight: 500; margin: 3px 0; font-variant-numeric: tabular-nums; }
    .flow-node .node-label { color: var(--secondary-text-color); }
    .flow-node .node-label::before { content: ""; width: 6px; height: 6px; display: inline-block; border-radius: 50%; background: var(--flow-color); margin-inline-end: 4px; }
    .flow-node small { display: block; font-size: 9px; color: var(--secondary-text-color); }
    .flow-node .direction { font-size: 10px; min-height: 16px; color: var(--secondary-text-color); }
    @keyframes energy-current { to { stroke-dashoffset: -20; } }
    @media(prefers-reduced-motion:reduce) { .flow-current { animation: none; } }
    @container(max-width:599px) {
      .flow-readings { position: static; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; padding: 10px; background: var(--ha-card-background,var(--card-background-color,#fff)); }
      .flow-node { position: static; transform: none; min-width: 0; max-width: none; padding: 8px; box-shadow: none; background: var(--addition-neutral-background); }
      .flow-node[data-key=home] { grid-column: 1 / -1; }
      .flow-node small { font-size: 10px; }
    }
    @container(max-width:500px) { .content { padding: 12px; } }
  `];

  public setConfig(raw: AdditionConfig): void {
    const config = validateMonitor(raw);
    this.kind = monitorKind(config.type)!;
    this.descriptor = getCatalogItem(config.type.replace(/^custom:/, ""));
    super.setConfig(config);
  }
  public getCardSize(): number { return 12; }
  public connectedCallback(): void {
    super.connectedCallback();
    this.refresh = window.setInterval(() => this.requestUpdate(), 60000);
    this.requestUpdate();
  }
  public disconnectedCallback(): void {
    window.clearInterval(this.refresh); this.refresh = undefined;
    super.disconnectedCallback();
  }
  protected shouldUpdate(changed: PropertyValues): boolean {
    const previous = changed.get("hass") as HomeAssistant | undefined;
    return changed.size !== 1 || !changed.has("hass") || previous?.connection !== this.hass?.connection ||
      previous?.callWS !== this.hass?.callWS || relevantHassChanged(previous, this.hass, this.config);
  }
  private t(text: string) { return localizeText(this.hass, text); }
  private number(value: number, digits = 2) { return energyNumber(this.hass, value, { maximumFractionDigits: digits }); }
  private time(value: number) { return energyTime(this.hass, value); }
  private flow() {
    const options = monitorOptions(this.config!), flow = flowReadings(this.hass, options);
    const nodes = [
      { key: "grid", name: "Grid", value: flow.grid, label: (flow.grid.value ?? 0) >= 0 ? "Importing" : "Exporting",
        path: "M150 221 L211 257 Q225 266 225 285 L225 366 Q225 386 245 397 L432 486 Q448 493 462 480 L502 445 L502 397", color: "#2196f3", x: 14, y: 38 },
      { key: "solar", name: "Solar", value: flow.solar, label: "Production",
        path: "M852 221 L790 264 Q775 274 768 294 L736 380 Q732 394 713 403 L556 478 Q541 486 525 474 L502 459 L502 397", color: "#e5a817", x: 88, y: 40 },
      { key: "home", name: "Home", value: flow.home, label: options.deriveHome ? "Calculated" : "Measured",
        path: "", color: "#36a269", x: 49, y: 69 },
      { key: "battery", name: "Battery", value: flow.battery, label: (flow.battery.value ?? 0) >= 0 ? "Charging" : "Discharging",
        path: "M195 523 L232 501 L428 466 Q450 462 471 445 L502 422 L502 397", color: "#9b6ee4", x: 17, y: 85 },
      { key: "ev", name: "EV power", value: flow.ev, label: "Charging",
        path: "M502 397 L502 449 Q502 469 526 479 L694 560 Q710 568 710 582 Q710 590 730 590 L900 590 Q918 590 933 572 L950 552 L950 532 Q950 519 929 506", color: "#11a8a2", x: 83, y: 85 },
    ];
    const direct = [
      { key: "solarToEv", name: "Solar to EV", source: options.solarToEv, value: flow.solarToEv, color: "#e5a817",
        path: "M852 221 L957 279 Q974 289 974 311 L974 461 Q974 482 955 492 L929 506" },
      { key: "batteryToEv", name: "Battery to EV", source: options.batteryToEv, value: flow.batteryToEv, color: "#9b6ee4",
        path: "M195 523 L343 609 Q365 621 391 621 L935 621 Q976 621 976 580 L976 548 Q976 531 959 522 L929 506" },
    ].filter(route => route.source.entity);
    const routes = [...nodes.filter(node => node.path), ...direct];
    return html`<div class="flow-scene" role="group" aria-label=${this.t("Live Energy Flow")}>
      <div class="flow-art"><img src=${flowSceneUrl} width="1536" height="1024" alt="" loading="lazy" decoding="async">
        <svg class="flow-lines" viewBox="0 0 1000 667" aria-hidden="true" focusable="false">
          ${routes.map(node => {
            const value = node.value.value;
            const status = node.value.absent ? "absent" : value === undefined ? "unavailable" : value === 0 ? "idle" : "flowing";
            return svg`<g class="flow-line" data-key=${node.key} data-state=${status}
              data-direction=${value !== undefined && (node.key === "battery" ? value > 0 : value < 0) ? "reverse" : "forward"}
              style=${`--flow-color:${node.color};--flow-duration:${Math.max(.7, 3.8 - Math.log2(1 + Math.abs(value ?? 0)) * .65)}s`}>
              <path class="flow-cable-shadow" d=${node.path} vector-effect="non-scaling-stroke"></path>
              <path class="flow-cable" d=${node.path} vector-effect="non-scaling-stroke"></path>
              <path class="flow-wire" d=${node.path} vector-effect="non-scaling-stroke"></path>
              <path class="flow-highlight" d=${node.path} vector-effect="non-scaling-stroke"></path>
              ${status === "flowing" ? svg`<path class="flow-current" d=${node.path} pathLength="100" vector-effect="non-scaling-stroke"></path>` : nothing}
            </g>`;
          })}
          ${[[150, 221, "#2196f3"], [852, 221, "#e5a817"], [195, 523, "#9b6ee4"], [929, 506, "#11a8a2"], [502, 397, "#36a269"]].map(([x, y, color]) => svg`
            <g style=${`--flow-color:${color}`}><circle class="flow-port" cx=${x} cy=${y} r="5" vector-effect="non-scaling-stroke"></circle>
            <circle class="flow-port-core" cx=${x} cy=${y} r="2"></circle></g>`)}
        </svg>
      </div>
      <div class="flow-readings">${nodes.map(node => html`<div class="flow-node" data-key=${node.key}
        style=${`--node-x:${node.x}%;--node-y:${node.y}%;--flow-color:${node.color}`}>
        <div class="node-label">${this.t(node.name)}</div>
        <b>${node.value.value === undefined ? "—" : `${this.number(Math.abs(node.value.value))} kW`}</b>
        <div class="direction" aria-label=${this.t(node.value.value === undefined ? "Unavailable" : node.label)}>
          ${node.value.absent ? this.t("Not installed") : node.value.value === undefined ? this.t(node.value.error || "Unavailable")
            : node.value.value === 0 ? this.t("Idle") : this.t(node.label)}</div>
        ${node.value.updated ? html`<small>${this.t("Updated")}: ${this.time(node.value.updated)}</small>` : nothing}
      </div>`)}</div>
    </div>
    ${direct.length ? html`<div class="flow-routes">${direct.map(route => html`<div class="flow-route-reading" data-key=${route.key} style=${`--flow-color:${route.color}`}>
      <span>${this.t(route.name)}</span><b>${route.value.value === undefined ? "—" : `${this.number(route.value.value)} kW`}</b>
      <small>${route.value.value === undefined ? this.t(route.value.error || "Unavailable") : route.value.value === 0 ? this.t("Idle") : this.t("Measured")}
        ${route.value.updated ? html` · ${this.t("Updated")}: ${this.time(route.value.updated)}` : nothing}</small>
    </div>`)}</div><p class="note">${this.t("Direct EV routes use separate measurements, not estimated allocations.")}</p>` : nothing}
    ${flow.mismatch ? html`<p class="warning" role="status">${this.t("Energy balance mismatch")}: ${this.number(flow.residual!)} kW</p>` : nothing}
    <p class="note">${this.t("Flows show directions at the electrical boundary, not allocations between individual sources.")}</p>
    ${options.ev.entity ? html`<p class="note">${this.t("EV power is shown separately and is never added to or subtracted from the home total.")}</p>` : nothing}`;
  }
  protected render() {
    if (!this.config) return nothing;
    const options = monitorOptions(this.config);
    return html`<ha-card><div class="content" style=${`max-width:${options.maxContentWidth ? `${options.maxContentWidth}px` : "none"}`}>
      ${this.renderSharedHeading()}
      ${[options.home, options.grid, options.solar, options.battery, options.ev].some(source => source.entity) ? nothing : energySetupNotice(this.hass)}
      ${this.flow()}
    </div></ha-card>`;
  }
}

for (const definition of MONITOR_CARDS) {
  const kind = definition.id;
  class RegisteredEnergyMonitor extends EnergyMonitorCard {
    protected kind = kind;
    protected descriptor = getCatalogItem(definition.tag);
    public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []) { return monitorStub(kind, hass, [...entities, ...fallback]); }
  }
  if (!customElements.get(definition.tag)) customElements.define(definition.tag, RegisteredEnergyMonitor);
}
