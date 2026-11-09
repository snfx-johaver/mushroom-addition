import { css, html, nothing, type PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { MushroomAdditionCard } from "./card";
import { getCatalogItem } from "./catalog";
import { localizeText } from "./localize";
import { renderAutomaticPresentation, type RenderContext } from "./renderers";
import { readTodo, safeTodoUid, TODO_FEATURE, todoEntities, todoStub, todoSupports, validateTodo, type TodoItem } from "./todo";
import type { AdditionConfig, HomeAssistant } from "./types";

type Draft = { uid?: string; summary: string; description: string; due: string; dueType: "date" | "datetime" };

export class MushroomTodoCard extends MushroomAdditionCard {
  protected descriptor = getCatalogItem("mushroom-addition-todo");
  @state() private selected = "";
  @state() private items: TodoItem[] = [];
  @state() private loading = false;
  @state() private busy = false;
  @state() private loaded = false;
  @state() private error = "";
  @state() private draft?: Draft;
  @state() private showCompleted?: boolean;
  @state() private deleting?: string;
  private generation = 0;
  private timer?: ReturnType<typeof setInterval>;
  private sourceHass?: HomeAssistant;
  private stateEntity?: unknown;
  private wasConnected?: boolean;
  private originalDue = "";
  private draftBase?: TodoItem;
  private deleteBase?: TodoItem;

  static styles = [MushroomAdditionCard.styles, css`
    :host { display:block; min-width:0; }
    ha-card.mushroom-addition-card { height:auto; padding:12px; }
    .todo-heading .automatic-presentation { margin:0; }
    .toolbar, .tabs, .actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .toolbar { justify-content:space-between; margin-block:10px; }
    .tabs { margin-block:10px; }
    button, input, textarea, select { font:inherit; color:var(--primary-text-color); }
    button { border:0; border-radius:var(--mush-control-border-radius,12px); padding:10px 12px;
      background:var(--secondary-background-color,var(--addition-neutral-background)); cursor:pointer; min-height:40px; }
    button[aria-pressed=true], button.primary { background:rgba(var(--rgb-primary-color,33,150,243),.16); color:var(--primary-color); }
    button:disabled { opacity:.45; cursor:default; }
    button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
      outline:2px solid var(--primary-color); outline-offset:2px; }
    ul { list-style:none; margin:0; padding:0; }
    li { display:flex; align-items:flex-start; gap:8px; padding-block:8px; border-bottom:1px solid var(--divider-color,rgba(127,127,127,.2)); }
    .task { flex:1; min-width:0; padding-block:6px; overflow-wrap:anywhere; }
    .task b { font-size:var(--mush-card-primary-font-size,14px); font-weight:500; }
    .completed b { text-decoration:line-through; color:var(--secondary-text-color); }
    .description { white-space:pre-wrap; margin-block:4px; font-size:12px; color:var(--secondary-text-color); }
    time, .hint, .status { font-size:12px; color:var(--secondary-text-color); overflow-wrap:anywhere; }
    .status { padding-block:10px; }
    [role=alert] { color:var(--error-color); }
    .icon-button { padding:8px; min-width:40px; flex-shrink:0; }
    ha-icon { --mdc-icon-size:20px; }
    .row-actions { display:flex; flex-wrap:wrap; gap:4px; }
    .row-actions:empty { display:none; }
    form { display:grid; gap:10px; padding:12px; margin-block:10px; border-radius:12px; background:var(--secondary-background-color,var(--addition-neutral-background)); }
    label { display:grid; gap:5px; font-size:13px; }
    input, textarea, select { box-sizing:border-box; width:100%; min-width:0; border:1px solid var(--divider-color,rgba(127,127,127,.3));
      border-radius:8px; padding:10px; background:var(--card-background-color); }
    input[type=checkbox] { width:20px; height:20px; accent-color:var(--primary-color); }
    .completed-toggle { display:flex; align-items:center; gap:6px; }
    .confirmation { display:flex; gap:6px; flex-wrap:wrap; margin-block:6px; }
    @container (max-width:360px) {
      li { flex-wrap:wrap; }
      .row-actions { margin-inline-start:48px; flex-basis:calc(100% - 48px); }
    }
    :host { container-type:inline-size; }
    :host([fill-container]) { height:100%; }
    .fill-container { min-height:100%; box-sizing:border-box; }
  `];

  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): AdditionConfig {
    return todoStub(hass, entities, fallback);
  }
  public getCardSize(): number { return 2 + Math.min(this.items.length, 12); }
  public setConfig(config: AdditionConfig): void {
    validateTodo(config);
    this.invalidate();
    this.selected = todoEntities(config)[0] ?? "";
    this.showCompleted = undefined;
    super.setConfig(config);
  }
  public connectedCallback(): void {
    super.connectedCallback();
    this.timer = setInterval(() => { if (!this.busy && !this.loading) void this.refresh(); }, 30000);
    this.requestUpdate();
  }
  public disconnectedCallback(): void {
    clearInterval(this.timer);
    this.invalidate();
    this.sourceHass = undefined;
    super.disconnectedCallback();
  }
  private invalidate(): void {
    this.generation++;
    this.items = [];
    this.loaded = false;
    this.loading = false;
    this.busy = false;
    this.error = "";
    this.draft = undefined;
    this.draftBase = undefined;
    this.deleteBase = undefined;
    this.deleting = undefined;
  }
  private get available(): boolean {
    const entity = this.hass?.states[this.selected];
    return !!entity && !["unknown", "unavailable"].includes(entity.state) &&
      this.hass?.connection?.connected !== false;
  }
  private supports(feature: number): boolean {
    return todoSupports(this.hass?.states[this.selected], feature);
  }
  private get writable(): boolean { return this.available && this.loaded && !this.loading && !this.busy && !this.error; }
  protected willUpdate(changed?: PropertyValues): void {
    super.willUpdate();
    this.toggleAttribute("fill-container", this.config?.fill_container === true);
    if (!this.isConnected || !this.hass) return;
    const previous = this.sourceHass;
    const transportChanged = !previous || previous.connection !== this.hass.connection || previous.callWS !== this.hass.callWS;
    const availabilityChanged = this.wasConnected !== this.available;
    const entity = this.hass.states[this.selected];
    const entityChanged = entity !== this.stateEntity;
    this.sourceHass = this.hass;
    this.stateEntity = entity;
    this.wasConnected = this.available;
    if (transportChanged || availabilityChanged) this.invalidate();
    if ((changed?.has("config") || changed?.has("selected") || transportChanged || availabilityChanged || entityChanged) &&
        !this.busy && !this.loading) void this.refresh();
  }
  private current(generation: number, entity: string): boolean {
    return this.isConnected && generation === this.generation && entity === this.selected && this.available;
  }
  private async refresh(): Promise<void> {
    if (!this.isConnected || !this.hass || !this.available || this.busy) return;
    const generation = ++this.generation, entity = this.selected;
    this.loading = true;
    try {
      const items = await readTodo(this.hass, entity);
      if (!this.current(generation, entity)) return;
      this.items = items;
      this.loaded = true;
      this.error = "";
    } catch {
      if (this.current(generation, entity)) { this.error = "Unable to load tasks. Check connection and permissions."; this.loaded = false; }
    } finally {
      if (generation === this.generation) this.loading = false;
    }
  }
  private select(entity: string): void {
    this.invalidate();
    this.selected = entity;
    void this.refresh();
  }
  private openDraft(item?: TodoItem): void {
    this.draftBase = item ? { ...item } : undefined;
    const dueType = item?.due?.includes("T") ? "datetime" : "date";
    let due = item?.due ?? "";
    if (due && dueType === "datetime") {
      const date = new Date(due);
      if (Number.isFinite(date.getTime())) {
        due = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      } else due = "";
    }
    this.draft = { uid: item?.uid, summary: item?.summary ?? "", description: item?.description ?? "", due,
      dueType: this.supports(TODO_FEATURE[dueType]) ? dueType : this.supports(TODO_FEATURE.date) ? "date" : "datetime" };
    this.originalDue = due;
  }
  private async mutate(service: "add_item" | "update_item" | "remove_item", data: Record<string, unknown>, item?: TodoItem): Promise<void> {
    if (service !== "add_item" && !item) return;
    const feature = service === "add_item" ? TODO_FEATURE.create : service === "remove_item" ? TODO_FEATURE.delete : TODO_FEATURE.update;
    const allowed = service === "add_item" ? this.config?.todo_allow_add !== false :
      service === "remove_item" ? this.config?.todo_allow_delete !== false :
        !("rename" in data) || this.config?.todo_allow_edit !== false;
    if (!this.writable || !this.hass || !allowed || !this.supports(feature)) return;
    const generation = ++this.generation, entity = this.selected, hass = this.hass;
    this.busy = true;
    let written = false;
    try {
      // Re-read before writing: duplicate titles are allowed; ambiguous UID/summary collisions are not.
      const latest = await readTodo(hass, entity);
      if (!this.current(generation, entity)) return;
      if (!this.supports(feature)) throw new Error("Unsupported action");
      if (item) {
        const found = latest.find(row => row.uid === item.uid);
        if (!found || !safeTodoUid(found, latest) || found.summary !== item.summary ||
            found.status !== item.status || found.description !== item.description || found.due !== item.due) {
          this.items = latest;
          this.error = "Task changed or has no safe UID. Refresh before editing.";
          return;
        }
      }
      await hass.callService("todo", service, { ...data, entity_id: entity, ...(item ? { item: item.uid } : {}) });
      written = true;
      if (!this.current(generation, entity)) return;
      this.draft = undefined;
      this.deleting = undefined;
      const refreshed = await readTodo(hass, entity);
      if (!this.current(generation, entity)) return;
      this.items = refreshed;
      this.loaded = true;
    } catch {
      if (this.current(generation, entity)) this.error = written
        ? "Change sent. Refresh to verify the task list."
        : "Unable to change task. Check connection and permissions, then refresh before retrying.";
    } finally {
      if (generation === this.generation) this.busy = false;
    }
  }
  private save(event: SubmitEvent): void {
    event.preventDefault();
    const draft = this.draft;
    if (!draft?.summary.trim()) return;
    const item = this.draftBase;
    if (draft.uid && !item) return;
    const data: Record<string, unknown> = item ? { rename: draft.summary.trim() } : { item: draft.summary.trim() };
    if (this.supports(TODO_FEATURE.description) && (!item || draft.description !== (item.description ?? ""))) {
      data.description = draft.description || null;
    }
    if (draft.due && (!item || draft.due !== this.originalDue)) {
      if (this.supports(TODO_FEATURE[draft.dueType])) {
        data[draft.dueType === "date" ? "due_date" : "due_datetime"] =
          draft.dueType === "date" ? draft.due : new Date(draft.due).toISOString();
      }
    } else if (!draft.due && item?.due) {
      const dueType = item.due.includes("T") ? "datetime" : "date";
      if (this.supports(TODO_FEATURE[dueType])) data[dueType === "date" ? "due_date" : "due_datetime"] = null;
    }
    void this.mutate(item ? "update_item" : "add_item", data, item);
  }
  private dueLabel(due: string): string {
    const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(due) ? `${due}T00:00:00` : due);
    if (!Number.isFinite(date.getTime())) return due;
    return new Intl.DateTimeFormat(this.hass?.language, {
      dateStyle: "medium", ...(due.includes("T") ? { timeStyle: "short" as const } : {}),
    }).format(date);
  }
  protected render() {
    if (!this.config || !this.hass || !this.descriptor) return nothing;
    const t = (text: string) => localizeText(this.hass, text);
    const ids = todoEntities(this.config), entity = this.hass.states[this.selected];
    const completed = this.showCompleted ?? this.config.todo_show_completed !== false;
    const visible = this.items.filter(item => completed || item.status !== "completed");
    const context: RenderContext = {
      config: { ...this.config, entity: this.selected,
        secondary_info: this.config.secondary_info ?? "none" },
      descriptor: this.descriptor, hass: this.hass, entity, presentation: { rendered: false },
      actionSurface: (_classes, content) => content,
      service: (domain, service, data) => void this.hass?.callService(domain, service, data),
    };
    return html`<ha-card class="mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}${this.config.fill_container ? " fill-container" : ""}" aria-busy=${this.loading || this.busy}>
      ${this.renderSharedSurface("todo-heading", renderAutomaticPresentation(context, {
        primary: typeof this.config.name === "string" ? this.config.name : entity?.attributes.friendly_name || t("To-do"),
      }))}
      ${ids.length > 1 ? html`<nav class="tabs" aria-label=${t("To-do lists")}>${ids.map(id => html`
        <button aria-pressed=${id === this.selected} ?disabled=${this.busy} @click=${() => this.select(id)}>
          ${this.hass!.states[id]?.attributes.friendly_name ?? id}</button>`)}</nav>` : nothing}
      ${!ids.length ? html`<p class="status">${t("Select to-do lists in the card editor.")}</p>` :
        !this.available ? html`<p class="status" role="alert">${t("Unavailable")}</p>` : html`
        <div class="toolbar">
          <label class="completed-toggle"><input type="checkbox" .checked=${completed}
            @change=${(event: Event) => { this.showCompleted = (event.target as HTMLInputElement).checked; }}>${t("Show completed tasks")}</label>
          <div class="actions">
            <button ?disabled=${this.loading || this.busy} @click=${() => void this.refresh()}>${t("Refresh")}</button>
            ${this.supports(TODO_FEATURE.create) && this.config.todo_allow_add !== false ? html`
              <button class="primary" ?disabled=${!this.writable} @click=${() => this.openDraft()}>${t("Add task")}</button>` : nothing}
          </div>
        </div>
        ${this.loading || this.busy ? html`<p role="status" class="status">${t(this.busy ? "Saving task…" : "Loading tasks…")}</p>` : nothing}
        ${this.error ? html`<p role="alert" class="status">${t(this.error)}</p>` : nothing}
        ${this.draft ? this.renderForm() : nothing}
        ${this.loaded && !visible.length ? html`<p class="status">${t("No tasks to show.")}</p>` : nothing}
        <ul aria-label=${entity?.attributes.friendly_name ?? t("To-do")}>${visible.map(item => {
          const safe = safeTodoUid(item, this.items);
          return html`<li class=${item.status === "completed" ? "completed" : ""}>
            <button class="icon-button complete" aria-label=${`${t(item.status === "completed" ? "Mark incomplete" : "Complete task")}: ${item.summary}`}
              aria-pressed=${item.status === "completed"} ?disabled=${!this.writable || !safe || !this.supports(TODO_FEATURE.update)}
              @click=${() => void this.mutate("update_item", { status: item.status === "completed" ? "needs_action" : "completed" }, item)}>
              <ha-icon .icon=${item.status === "completed" ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}></ha-icon></button>
            <div class="task"><b>${item.summary}</b>
              ${item.description ? html`<p class="description">${item.description}</p>` : nothing}
              ${item.due ? html`<time datetime=${item.due}>${t("Due")}: ${this.dueLabel(item.due)}</time>` : nothing}
              ${!safe ? html`<div class="hint">${t("Task changed or has no safe UID. Refresh before editing.")}</div>` : nothing}
              ${this.deleting !== undefined && this.deleting === item.uid ? html`<div class="confirmation">
                <span>${t("Delete this task?")}</span>
                <button ?disabled=${!this.writable} @click=${() => void this.mutate("remove_item", {}, this.deleteBase)}>${t("Delete")}</button>
                <button ?disabled=${this.busy} @click=${() => { this.deleting = undefined; }}>${t("Cancel")}</button>
              </div>` : nothing}
            </div>
            <div class="row-actions">
              ${this.supports(TODO_FEATURE.update) && this.config!.todo_allow_edit !== false ? html`<button class="icon-button edit"
                aria-label=${`${t("Edit")}: ${item.summary}`} ?disabled=${!this.writable || !safe} @click=${() => this.openDraft(item)}>
                <ha-icon .icon=${"mdi:pencil-outline"}></ha-icon></button>` : nothing}
              ${this.supports(TODO_FEATURE.delete) && this.config!.todo_allow_delete !== false ? html`<button class="icon-button delete"
                aria-label=${`${t("Delete")}: ${item.summary}`} ?disabled=${!this.writable || !safe} @click=${() => { this.deleting = item.uid; this.deleteBase = { ...item }; }}>
                <ha-icon .icon=${"mdi:delete-outline"}></ha-icon></button>` : nothing}
            </div>
          </li>`;
        })}</ul>`}
    </ha-card>`;
  }
  private renderForm() {
    const draft = this.draft!, t = (text: string) => localizeText(this.hass, text);
    const field = (key: keyof Draft, event: Event) => {
      this.draft = { ...draft, [key]: (event.target as HTMLInputElement).value };
    };
    return html`<form @submit=${(event: SubmitEvent) => this.save(event)}>
      <label>${t("Task")}<input name="summary" required .value=${draft.summary} ?disabled=${this.busy}
        @input=${(event: Event) => field("summary", event)}></label>
      ${this.supports(TODO_FEATURE.description) ? html`<label>${t("Description")}<textarea name="description"
        .value=${draft.description} ?disabled=${this.busy} @input=${(event: Event) => field("description", event)}></textarea></label>` : nothing}
      ${this.supports(TODO_FEATURE.date) || this.supports(TODO_FEATURE.datetime) ? html`
        ${this.supports(TODO_FEATURE.date) && this.supports(TODO_FEATURE.datetime) ? html`<label>${t("Due")}
          <select .value=${draft.dueType} ?disabled=${this.busy} @change=${(event: Event) => {
            this.draft = { ...draft, due: "", dueType: (event.target as HTMLSelectElement).value as Draft["dueType"] };
          }}><option value="date">${t("Date")}</option><option value="datetime">${t("Date and time")}</option></select></label>` : nothing}
        <label>${t(draft.dueType === "date" ? "Date" : "Date and time")}<input name="due"
          type=${draft.dueType === "date" ? "date" : "datetime-local"} .value=${draft.due} ?disabled=${this.busy}
          @input=${(event: Event) => field("due", event)}></label>` : nothing}
      <div class="actions"><button type="submit" class="primary" ?disabled=${!this.writable || !draft.summary.trim()}>${t("Save")}</button>
        <button type="button" ?disabled=${this.busy} @click=${() => { this.draft = undefined; }}>${t("Cancel")}</button></div>
    </form>`;
  }
}
