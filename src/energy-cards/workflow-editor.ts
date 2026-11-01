import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { fireEvent } from "./helpers";
import { localizeText } from "./localize";
import { validateWorkflow, WORKFLOW_EDITOR_TAG } from "./workflow-config";
import type { WorkflowConfig, WorkflowGroup, WorkflowNode, WorkflowRelation, WorkflowRow } from "./workflow-config";
import type { HomeAssistant } from "./types";
import type { EditorField } from "./editor-schema";
import { EditorSchemaCache } from "./editor-schema";

type Item = WorkflowGroup | WorkflowNode | WorkflowRelation | WorkflowRow;
const field = (name: string, selector: Record<string, unknown> = { text: {} }): EditorField => ({ name, selector });
const labels: Record<string, string> = {
  title: "Title", presentation: "Presentation", id: "Stable ID", label: "Label", color: "Color (CSS value)",
  group: "Group", icon: "Icon", note: "Note", entity: "Entity", attribute: "Attribute (optional)",
  unit: "Unit override (optional)", from: "Source node", to: "Target node",
};

@customElement(WORKFLOW_EDITOR_TAG)
export class MushroomWorkflowEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public _config?: WorkflowConfig;
  @property({ type: Boolean }) public embedded = false;
  @state() private config?: WorkflowConfig;
  @state() private error = "";
  private nodeReferenceIds = new WeakMap<WorkflowNode, string>();
  private groupReferenceIds = new WeakMap<WorkflowGroup, string>();
  private readonly schemas = new EditorSchemaCache();
  private readonly computeLabel = (item: EditorField) => localizeText(this.hass, labels[item.name] ?? item.name);

  public setConfig(config: WorkflowConfig): void {
    validateWorkflow(config);
    this.config = structuredClone(config);
    this.check();
  }
  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("_config") && this._config) this.setConfig(this._config);
  }
  private check(): boolean {
    try {
      validateWorkflow(this.config!);
      this.error = "";
      return true;
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      this.error = error.message;
      return false;
    }
  }
  private commit(config: WorkflowConfig): void {
    this.config = config;
    if (this.check()) fireEvent(this, "config-changed", { config: structuredClone(config) });
  }
  private form<T extends object>(data: T, schema: EditorField[], changed: (value: T) => void) {
    return html`<ha-form .hass=${this.hass} .data=${data} .schema=${this.schemas.get(schema)}
      .computeLabel=${this.computeLabel}
      @value-changed=${(event: CustomEvent<{ value: T }>) => {
        event.stopPropagation();
        changed({ ...data, ...event.detail.value });
      }}></ha-form>`;
  }
  private select(name: string, options: Array<{ value: string; label: string }>) {
    return field(name, { select: { mode: "dropdown", options } });
  }
  private nextId(kind: "group" | "node"): string {
    const ids = new Set((kind === "group" ? this.config?.groups : this.config?.nodes)?.map(item => item.id));
    let number = 1;
    while (ids.has(`${kind}_${number}`)) number++;
    return `${kind}_${number}`;
  }
  private replaceNode(index: number, node: WorkflowNode): void {
    const config = this.config!;
    const previous = config.nodes[index];
    const referenceId = this.nodeReferenceIds.get(previous) ?? previous.id;
    const unique = Boolean(node.id.trim()) && !config.nodes.some((item, i) => i !== index && item.id === node.id);
    this.nodeReferenceIds.set(node, unique ? node.id : referenceId);
    this.commit({
      ...config, nodes: config.nodes.map((item, i) => i === index ? node : item),
      relations: unique ? (config.relations ?? []).map(edge => ({
        ...edge, from: edge.from === referenceId ? node.id : edge.from, to: edge.to === referenceId ? node.id : edge.to,
      })) : config.relations,
    });
  }
  private withGroup(node: WorkflowNode, group?: string): WorkflowNode {
    const updated = { ...node, group };
    this.nodeReferenceIds.set(updated, this.nodeReferenceIds.get(node) ?? node.id);
    return updated;
  }
  private replaceGroup(index: number, group: WorkflowGroup): void {
    const config = this.config!;
    const previous = config.groups![index];
    const referenceId = this.groupReferenceIds.get(previous) ?? previous.id;
    const unique = Boolean(group.id.trim()) && !config.groups!.some((item, i) => i !== index && item.id === group.id);
    this.groupReferenceIds.set(group, unique ? group.id : referenceId);
    this.commit({
      ...config, groups: config.groups!.map((item, i) => i === index ? group : item),
      nodes: unique ? config.nodes.map(node => node.group === referenceId ? this.withGroup(node, group.id) : node) : config.nodes,
    });
  }
  private move<T extends Item>(items: T[], index: number, direction: number): T[] {
    const next = [...items];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    return next;
  }
  private controls(index: number, count: number, label: string, move: (direction: number) => void, remove: () => void) {
    return html`<div class="controls">
      <button type="button" ?disabled=${index === 0} aria-label=${`Move ${label} up`} @click=${() => move(-1)}>↑</button>
      <button type="button" ?disabled=${index === count - 1} aria-label=${`Move ${label} down`} @click=${() => move(1)}>↓</button>
      <button type="button" aria-label=${`Remove ${label}`} @click=${remove}>${localizeText(this.hass, "Remove")}</button>
    </div>`;
  }
  private rows(node: WorkflowNode, index: number) {
    const rows = node.entities ?? [];
    const update = (entities: WorkflowRow[]) => this.replaceNode(index, { ...node, entities });
    return html`<h4>${localizeText(this.hass, "Entity rows")}</h4>
      ${rows.map((row, rowIndex) => html`<div class="row">
        ${this.form(row, [
          field("entity", { entity: {} }), field("label"), field("attribute"), field("icon", { icon: {} }), field("unit"),
        ], value => update(rows.map((item, i) => i === rowIndex ? value : item)))}
        ${this.controls(rowIndex, rows.length, `entity row ${rowIndex + 1} in ${node.label}`,
          direction => update(this.move(rows, rowIndex, direction)),
          () => update(rows.filter((_, i) => i !== rowIndex)))}
      </div>`)}
      <button type="button" @click=${() => update([...rows, { entity: "" }])}>${localizeText(this.hass, "Add entity row")}</button>`;
  }
  protected render() {
    if (!this.config) return nothing;
    const config = this.config;
    const groups = config.groups ?? [];
    const nodes = Array.isArray(config.nodes) ? config.nodes : [];
    const relations = config.relations ?? [];
    return html`<p>${localizeText(this.hass, "Define relationships and display existing entity values. This card does not calculate or execute a workflow.")}</p>
      ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}
      ${this.embedded ? nothing : html`<section><h3>${localizeText(this.hass, "Layout")}</h3>
        ${this.form({ title: config.title ?? "", presentation: config.presentation ?? "sequential" }, [
          field("title"), this.select("presentation", [
            { value: "sequential", label: "Sequential process" }, { value: "graph", label: "Relationship graph" },
          ]),
        ], value => this.commit({ ...config, ...value }))}</section>`}
      <section><h3>${localizeText(this.hass, "Groups")}</h3>
        <p>${localizeText(this.hass, "Group order defines process order. Ungrouped nodes appear last.")}</p>
        ${repeat(groups, (_, index) => index, (group, index) => html`<details open>
          <summary>${group.label || `Group ${index + 1}`}</summary>
          ${this.form(group, [field("id"), field("label"), field("color")], value => this.replaceGroup(index, value))}
          ${this.controls(index, groups.length, `group ${group.label}`,
            direction => this.commit({ ...config, groups: this.move(groups, index, direction) }),
            () => this.commit({ ...config, groups: groups.filter((_, i) => i !== index),
              nodes: nodes.map(node => node.group === (this.groupReferenceIds.get(group) ?? group.id) ? this.withGroup(node) : node) }))}
        </details>`)}
        <button type="button" @click=${() => this.commit({ ...config, groups: [...groups, { id: this.nextId("group"), label: "New group" }] })}>
          ${localizeText(this.hass, "Add group")}</button>
      </section>
      <section><h3>${localizeText(this.hass, "Nodes")}</h3>
        <p>${localizeText(this.hass, "Node order defines order within each group. Renaming IDs updates relationships; removing nodes removes their relationships.")}</p>
        ${repeat(nodes, (_, index) => index, (node, index) => html`<details open>
          <summary>${node.label || `Node ${index + 1}`}</summary>
          ${this.form({ ...node, group: node.group ?? "" }, [
            field("id"), field("label"), this.select("group", [
              { value: "", label: "Ungrouped" }, ...groups.map(group => ({ value: group.id, label: group.label })),
            ]), field("icon", { icon: {} }), field("color"), field("note", { text: { multiline: true } }),
          ], value => this.replaceNode(index, { ...value, group: value.group || undefined }))}
          ${this.rows(node, index)}
          ${this.controls(index, nodes.length, `node ${node.label}`,
            direction => this.commit({ ...config, nodes: this.move(nodes, index, direction) }),
            () => this.commit({ ...config, nodes: nodes.filter((_, i) => i !== index),
              relations: relations.filter(edge => {
                const referenceId = this.nodeReferenceIds.get(node) ?? node.id;
                return edge.from !== referenceId && edge.to !== referenceId;
              }) }))}
        </details>`)}
        <button type="button" @click=${() => this.commit({ ...config, nodes: [...nodes, { id: this.nextId("node"), label: "New node", entities: [] }] })}>
          ${localizeText(this.hass, "Add node")}</button>
      </section>
      <section><h3>${localizeText(this.hass, "Relationships")}</h3>
        ${relations.map((edge, index) => html`<details open><summary>${edge.label || `Relationship ${index + 1}`}</summary>
          ${this.form(edge, [
            this.select("from", nodes.map(node => ({ value: node.id, label: node.label }))),
            this.select("to", nodes.map(node => ({ value: node.id, label: node.label }))),
            field("label"), field("color"),
          ], value => this.commit({ ...config, relations: relations.map((item, i) => i === index ? value : item) }))}
          ${this.controls(index, relations.length, `relationship ${index + 1}`,
            direction => this.commit({ ...config, relations: this.move(relations, index, direction) }),
            () => this.commit({ ...config, relations: relations.filter((_, i) => i !== index) }))}
        </details>`)}
        <button type="button" ?disabled=${!nodes.length} @click=${() => this.commit({ ...config,
          relations: [...relations, { from: nodes[0].id, to: (nodes[1] ?? nodes[0]).id, label: "relates to" }] })}>
          ${localizeText(this.hass, "Add relationship")}</button>
      </section>`;
  }
  public static styles = css`
    :host { display: block; color: var(--primary-text-color); }
    section { margin: 16px 0; } h3 { font-size: 16px; } h4 { font-size: 14px; }
    p { color: var(--secondary-text-color); font-size: 13px; line-height: 1.5; }
    details { border: 1px solid var(--divider-color); border-radius: 12px; padding: 12px; margin-bottom: 12px; }
    summary { cursor: pointer; font-weight: 600; margin-bottom: 12px; }
    .row { border-inline-start: 2px solid var(--divider-color); padding-inline-start: 12px; margin-bottom: 16px; }
    .controls { display: flex; gap: 8px; margin: 12px 0; }
    button { background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button:disabled { opacity: .5; cursor: default; } button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .error { color: var(--error-color); border: 1px solid var(--error-color); border-radius: 8px; padding: 12px; }
  `;
}
