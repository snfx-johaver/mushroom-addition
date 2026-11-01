import { css, html, nothing, svg } from "lit";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { sharedStyles } from "../styles";
import { property, state } from "lit/decorators.js";
import { displayName, fireEvent, stateLabel, relevantHassChanged } from "./helpers";
import { renderEntityIcon } from "./entity-icon";
import { localizeText, localeDirection } from "./localize";
import { validateWorkflow, workflowStub, WORKFLOW_TAG } from "./workflow-config";
import type { WorkflowConfig, WorkflowGroup, WorkflowNode, WorkflowRow } from "./workflow-config";
import type { HomeAssistant } from "./types";
import type { AdditionConfig } from "../types";
import { normalizeConfig } from "../helpers";

interface Bounds { x: number; y: number; width: number; height: number }
interface DiagramGeometry { width: number; height: number; nodes: Record<string, Bounds> }

export class MushroomWorkflowCard extends MushroomAdditionCard {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) protected config?: WorkflowConfig;
  protected descriptor = getCatalogItem(WORKFLOW_TAG);
  @state() private geometry?: DiagramGeometry;
  private observer?: ResizeObserver;

  protected shouldUpdate(changed: Map<PropertyKey, unknown>): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }

  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): WorkflowConfig {
    return workflowStub(hass, entities, fallback);
  }
  public static async getConfigElement(): Promise<HTMLElement> { return document.createElement("mushroom-addition-editor"); }
  public setConfig(config: AdditionConfig): void {
    const normalized: WorkflowConfig = { ...config, nodes: config.nodes ??
      (config.entity ? [{ id: "source", label: "Entity", entities: [{ entity: config.entity }] }] : []) };
    validateWorkflow(normalized);
    this.config = structuredClone({ ...normalizeConfig(normalized), ...normalized,
      name: config.name ?? config.title ?? "Energy Entityworkflow" });
    this.geometry = undefined;
  }
  public getCardSize(): number { return Math.max(3, this.config?.nodes.length ?? 3); }
  public getGridOptions(): { columns: number; rows: "auto"; min_columns: number; min_rows: number } {
    return { columns: 12, rows: "auto", min_columns: 3, min_rows: 3 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.requestUpdate();
  }
  public disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  protected updated(): void {
    this.observer?.disconnect();
    if (this.config?.presentation !== "graph" || !this.isConnected) return;
    if (typeof ResizeObserver !== "undefined") {
      this.observer ??= new ResizeObserver(() => this.measure());
      this.shadowRoot?.querySelectorAll<HTMLElement>(".board, .node").forEach(element => this.observer!.observe(element));
    }
    this.measure();
  }
  private measure(): void {
    const board = this.shadowRoot?.querySelector<HTMLElement>(".board");
    if (!board || this.config?.presentation !== "graph") return;
    const origin = board.getBoundingClientRect();
    if (!origin.width || !origin.height) return;
    const nodes: Record<string, Bounds> = Object.create(null);
    this.shadowRoot?.querySelectorAll<HTMLElement>("[data-node]").forEach(element => {
      const rect = element.getBoundingClientRect();
      nodes[element.dataset.node!] = {
        x: rect.left - origin.left, y: rect.top - origin.top, width: rect.width, height: rect.height,
      };
    });
    const geometry = { width: board.scrollWidth, height: board.scrollHeight, nodes };
    if (JSON.stringify(geometry) !== JSON.stringify(this.geometry)) this.geometry = geometry;
  }

  private row(row: WorkflowRow) {
    const entity = this.hass?.states[row.entity];
    const unavailable = !entity || ["unknown", "unavailable"].includes(entity.state);
    const label = row.label || (entity && this.hass?.formatEntityName
      ? this.hass.formatEntityName(entity) : displayName({ type: this.config!.type, entity: row.entity }, entity, this.hass));
    let value = stateLabel(entity, this.hass);
    if (entity && row.attribute && !unavailable) {
      const attribute = entity.attributes[row.attribute];
      value = attribute === undefined || attribute === null
        ? localizeText(this.hass, "Attribute unavailable")
        : typeof attribute === "object" ? JSON.stringify(attribute) : String(attribute);
      if (row.unit && attribute !== undefined && attribute !== null) value += ` ${row.unit}`;
    } else if (entity && row.unit && !unavailable) {
      value = `${entity.state} ${row.unit}`;
    }
    return html`<button class="entity-row" ?disabled=${!entity}
      @click=${() => fireEvent(this, "hass-more-info", { entityId: row.entity })}
      aria-label=${`${label}: ${value}`}>
      ${row.icon ? renderEntityIcon(this.hass, entity, row.icon) : nothing}
      <span>${label}</span><strong>${value}</strong>
    </button>`;
  }
  private node(node: WorkflowNode) {
    return html`<article class="node" data-node=${node.id} style=${node.color ? `--workflow-color: ${node.color}` : ""}>
      <h3>${renderEntityIcon(this.hass, undefined, node.icon, "mdi:transit-connection-variant")}${node.label}</h3>
      ${(node.entities ?? []).map(row => this.row(row))}
      ${node.note ? html`<p>${node.note}</p>` : nothing}
    </article>`;
  }
  private groups() {
    const config = this.config!;
    const groups: Array<WorkflowGroup & { nodes: WorkflowNode[] }> = (config.groups ?? [])
      .map(group => ({ ...group, nodes: config.nodes.filter(node => node.group === group.id) }));
    const ungrouped = config.nodes.filter(node => !node.group);
    if (ungrouped.length) groups.push({ id: "", label: "", nodes: ungrouped });
    return groups;
  }
  private connectors() {
    if (!this.geometry) return nothing;
    const geometry = this.geometry;
    return svg`<svg class="connectors" width=${geometry.width} height=${geometry.height} aria-hidden="true">
      <defs><marker id="workflow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke"></path>
      </marker></defs>
      ${(this.config!.relations ?? []).map((edge, index) => {
        const from = geometry.nodes[edge.from];
        const to = geometry.nodes[edge.to];
        if (!from || !to) return nothing;
        const forward = to.x > from.x + from.width;
        const sameColumn = from.x === to.x;
        const x1 = from.x + from.width;
        const y1 = from.y + from.height / 2;
        const x2 = forward ? to.x : to.x + to.width;
        const y2 = to.y + to.height / 2;
        const lane = Math.max(x1, x2) + 20 + (index % 3) * 12;
        const bottom = geometry.height - 20 - (index % 3) * 20;
        const path = forward
          ? `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`
          : sameColumn && edge.from !== edge.to
            ? `M ${x1} ${y1} C ${lane} ${y1} ${lane} ${y2} ${x2} ${y2}`
            : `M ${x1} ${y1} L ${x1 + 16} ${y1} L ${x1 + 16} ${bottom} L ${x2 + 32} ${bottom} L ${x2 + 32} ${y2} L ${x2} ${y2}`;
        return svg`<path d=${path} style=${`stroke: ${edge.color || "var(--primary-color)"}`} marker-end="url(#workflow-arrow)"></path>
          ${edge.label ? svg`<text x=${forward ? (x1 + x2) / 2 : sameColumn && edge.from !== edge.to ? lane : (x1 + x2) / 2 + 24}
            y=${forward || sameColumn && edge.from !== edge.to ? (y1 + y2) / 2 - 6 : bottom - 6} text-anchor="middle">${edge.label}</text>` : nothing}`;
      })}
    </svg>`;
  }
  protected render() {
    if (!this.config) return nothing;
    const graph = this.config.presentation === "graph";
    return html`<ha-card class=${this.config.card_shadow ? "card-shadow" : ""} dir=${localeDirection(this.hass?.language)}>
      ${this.renderSharedHeading()}
      <div class=${graph ? "graph-scroll" : ""} tabindex=${graph ? "0" : "-1"}
        role=${graph ? "region" : nothing} aria-label=${localizeText(this.hass, "Entity workflow")}>
        <div class=${graph ? "board graph" : "board sequential"}>
          ${this.groups().map((group, index) => html`<section class="group" style=${`--workflow-color: ${group.color || "var(--primary-color)"}`}>
            ${group.label ? html`<h3>${graph ? "" : `${index + 1}. `}${group.label}</h3>` : nothing}
            ${group.nodes.map(node => this.node(node))}
          </section>`)}
          ${graph ? this.connectors() : nothing}
        </div>
      </div>
      ${(this.config.relations ?? []).length ? html`<ul class="relations" aria-label=${localizeText(this.hass, "Relationships")}>
        ${this.config.relations!.map(edge => html`<li>
          ${this.config!.nodes.find(node => node.id === edge.from)!.label}
          <span aria-hidden="true">→</span><span class="sr-only">${localizeText(this.hass, "to")}</span>
          ${this.config!.nodes.find(node => node.id === edge.to)!.label}
          ${edge.label ? html`<em> (${edge.label})</em>` : nothing}
        </li>`)}
      </ul>` : nothing}
    </ha-card>`;
  }
  public static styles = [sharedStyles, css`
    :host { display: block; min-width: 0; container-type: inline-size; --workflow-color: var(--primary-color); }
    ha-card { display: block; box-sizing: border-box; padding: 16px; color: var(--primary-text-color); }
    h2 { margin: 0 0 16px; font-size: 20px; } h3 { margin: 0 0 12px; font-size: 14px; display: flex; align-items: center; gap: 10px; }
    .board { position: relative; } .sequential { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 24px; }
    .group { border: 1px dashed var(--workflow-color); border-radius: var(--ha-card-border-radius, 12px); padding: 12px; min-width: 0; position: relative; }
    .sequential .group:not(:last-child)::after { content: "→"; position: absolute; right: -21px; top: 50%; color: var(--secondary-text-color); }
    .node { border: 1px solid var(--divider-color); border-inline-start: 3px solid var(--workflow-color); border-radius: 12px; padding: 12px; margin-top: 12px; background: var(--card-background-color, var(--ha-card-background)); }
    ha-icon, ha-state-icon { color: var(--workflow-color); --mdc-icon-size: 22px; flex-shrink: 0; }
    .entity-row { width: 100%; display: flex; align-items: center; gap: 8px; text-align: start; background: none; border: 0; border-bottom: 1px solid var(--divider-color); color: inherit; padding: 9px 0; font: inherit; font-size: 13px; cursor: pointer; }
    .entity-row:disabled { cursor: default; } .entity-row span { flex: 1; } strong { text-align: end; }
    p { color: var(--secondary-text-color); font-size: 13px; line-height: 1.6; } p, h3, .entity-row { overflow-wrap: anywhere; }
    button:focus-visible, .graph-scroll:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .graph-scroll { overflow-x: auto; max-width: 100%; } .graph { display: flex; align-items: flex-start; gap: 80px; width: max-content; padding: 8px 64px 80px 0; direction: ltr; }
    .graph .group { width: 260px; flex-shrink: 0; box-sizing: border-box; }
    .connectors { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
    .connectors path { fill: none; stroke-width: 2; } .connectors marker path { stroke: none; fill: context-stroke; }
    .connectors text { fill: var(--primary-text-color); font: 12px sans-serif; paint-order: stroke; stroke: var(--card-background-color, var(--ha-card-background)); stroke-width: 4px; }
    .relations { margin: 16px 0 0; padding-inline-start: 20px; font-size: 13px; } .relations li { margin-top: 6px; } em { color: var(--secondary-text-color); }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    @container (max-width: 590px) { .sequential { grid-template-columns: 1fr; } .sequential .group:not(:last-child)::after { content: "↓"; top: auto; right: 50%; bottom: -22px; } }
    .energy-heading { padding: 0 0 16px; width: 100%; background: none; border: 0; color: inherit; text-align: start; }
  `];
}
