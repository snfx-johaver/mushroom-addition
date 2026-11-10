import { css, html, nothing, type PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { MushroomAdditionCard } from "./card";
import { getCatalogItem } from "./catalog";
import { localize, localizeText } from "./localize";
import { renderAutomaticPresentation, type RenderContext } from "./renderers";
import { readTodo, safeTodoUid, sortTodo, TODO_FEATURE, TODO_SORT_OPTIONS, todoEntities, todoStub, todoSupports, validateTodo, type TodoChecklistItem, type TodoItem, type TodoSort } from "./todo";
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
  @state() private sort?: TodoSort;
  @state() private expandedChecklists = new Set<string>();
  @state() private quickTask = "";
  @state() private newStep = "";
  @state() private deletingStep?: string;
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
    .task { flex:1; min-width:0; padding-block:6px; overflow-wrap:anywhere; line-height:20px; }
    .task b { font-size:var(--mush-card-primary-font-size,14px); font-weight:500; }
    .completed b { text-decoration:line-through; color:var(--secondary-text-color); }
    .completed .task-title { text-decoration:line-through; color:var(--secondary-text-color); }
    .description { white-space:pre-wrap; margin:4px 0 0; font-size:12px; color:var(--secondary-text-color); }
    time, .hint, .status { font-size:12px; color:var(--secondary-text-color); overflow-wrap:anywhere; }
    .status { padding-block:10px; }
    [role=alert] { color:var(--error-color); }
    .icon-button { display:inline-flex; align-items:center; justify-content:center;
      box-sizing:border-box; padding:6px; min-width:32px; min-height:32px; height:32px; flex-shrink:0; }
    ha-icon { --mdc-icon-size:15px; }
    .row-actions { display:flex; flex-wrap:wrap; gap:4px; }
    .row-actions:empty { display:none; }
    form { display:grid; gap:10px; padding:12px; margin-block:10px; border-radius:12px; background:var(--secondary-background-color,var(--addition-neutral-background)); }
    label { display:grid; gap:5px; font-size:13px; }
    input, textarea, select { box-sizing:border-box; width:100%; min-width:0; border:1px solid var(--divider-color,rgba(127,127,127,.3));
      border-radius:8px; padding:10px; background:var(--card-background-color); }
    .sort { display:flex; gap:6px; align-items:center; min-width:0; }
    .sort select { width:auto; padding:8px; }
    .completed-group { margin-top:8px; }
    .completed-group > summary { cursor:pointer; padding-block:8px; font-size:13px; color:var(--secondary-text-color); }
    .checklist { margin-top:4px; }
    .checklist-count { display:block; font-size:12px; color:var(--secondary-text-color); }
    .task-title { background:none; padding:0; min-height:0; border-radius:0; text-align:start; font:inherit; }
    .task-title:disabled { opacity:1; }
    .task-list { max-height:60vh; overflow:auto; min-height:0; overscroll-behavior:contain; }
    form.quick-add { display:flex; align-items:center; gap:8px; margin:8px 0 0; padding:8px; }
    .quick-add input { flex:1; }
    .step-editor { min-width:0; margin:0; border:1px solid var(--divider-color); border-radius:8px; padding:8px; }
    .step-editor li { align-items:center; }
    .step-editor li > span { flex:1; min-width:0; overflow-wrap:anywhere; }
    .step-add { display:flex; gap:8px; align-items:center; margin-top:8px; }
    .editor-header { display:flex; justify-content:flex-end; }
    .checklist li { align-items:center; padding-block:2px; border:0; }
    .checklist span { font-size:12px; line-height:18px; }
    .checklist .checked { text-decoration:line-through; color:var(--secondary-text-color); }
    .confirmation { display:flex; gap:6px; flex-wrap:wrap; margin-block:6px; }
    @container (max-width:360px) {
      .task-row { flex-wrap:wrap; }
      .row-actions { margin-inline-start:40px; flex-basis:calc(100% - 40px); }
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
    this.sort = undefined;
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
    this.expandedChecklists = new Set();
    this.quickTask = "";
    this.newStep = "";
    this.deletingStep = undefined;
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
    this.newStep = "";
    this.deletingStep = undefined;
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
    const draft = this.draft;
    void this.updateComplete.then(() => {
      if (this.draft !== draft) return;
      const scroller = this.renderRoot.querySelector<HTMLElement>(".task-list");
      if (scroller) scroller.scrollTop = 0;
      this.renderRoot.querySelector<HTMLInputElement>("[name=summary]")?.focus({ preventScroll: true });
    });
  }
  private async mutate(service: "add_item" | "update_item" | "remove_item", data: Record<string, unknown>, item?: TodoItem, quick = false): Promise<void> {
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
      if (!quick) this.draft = undefined;
      if (quick) this.quickTask = "";
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
  private canUpdateChecklist(item: TodoItem): boolean {
    return this.canChangeChecklist(item, "update_todo_checklist_item");
  }
  private canChangeChecklist(item: TodoItem, service: string): boolean {
    return this.writable && this.config?.todo_allow_edit !== false && safeTodoUid(item, this.items) &&
      this.supports(TODO_FEATURE.update) && Array.isArray(this.hass?.states[this.selected]?.attributes.all_todos) &&
      Boolean(this.hass?.services?.ms365_todo?.[service]) &&
      (service !== "new_todo_checklist_item" || this.config?.todo_allow_add !== false && this.supports(TODO_FEATURE.create)) &&
      (service !== "delete_todo_checklist_item" || this.config?.todo_allow_delete !== false && this.supports(TODO_FEATURE.delete));
  }
  private toggleChecklist(item: TodoItem, step: TodoChecklistItem): Promise<void> {
    return this.changeChecklist(item, "update_todo_checklist_item",
      { status: step.checked ? "needs_action" : "completed" }, step);
  }
  private async changeChecklist(item: TodoItem,
    service: "update_todo_checklist_item" | "new_todo_checklist_item" | "delete_todo_checklist_item",
    data: Record<string, unknown>, step?: TodoChecklistItem): Promise<void> {
    if (!this.canChangeChecklist(item, service) || !this.hass) return;
    const generation = ++this.generation, entity = this.selected, hass = this.hass;
    this.busy = true;
    let written = false;
    try {
      const latest = await readTodo(hass, entity);
      if (!this.current(generation, entity)) return;
      const parent = latest.find(row => row.uid === item.uid);
      const currentStep = step && parent?.checklist?.find(row => row.id === step.id);
      if (!parent || !safeTodoUid(parent, latest) || parent.status !== item.status ||
        step && (!currentStep || currentStep.name !== step.name || currentStep.checked !== step.checked)) {
        this.items = latest;
        this.error = "Task changed or has no safe UID. Refresh before editing.";
        return;
      }
      if (this.config?.todo_allow_edit === false || !this.supports(TODO_FEATURE.update) ||
        !this.hass?.services?.ms365_todo?.[service] ||
        service === "new_todo_checklist_item" && (this.config?.todo_allow_add === false || !this.supports(TODO_FEATURE.create)) ||
        service === "delete_todo_checklist_item" && (this.config?.todo_allow_delete === false || !this.supports(TODO_FEATURE.delete))) throw new Error("Unsupported action");
      await hass.callService("ms365_todo", service, {
        ...data, entity_id: entity, todo_id: item.uid, ...(step ? { checklist_item_id: step.id } : {}),
      });
      written = true;
      if (!this.current(generation, entity)) return;
      if (service === "new_todo_checklist_item") this.newStep = "";
      this.deletingStep = undefined;
      const refreshed = await readTodo(this.hass, entity);
      if (this.current(generation, entity)) { this.items = refreshed; this.loaded = true; }
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
    const sorted = sortTodo(this.items, this.sort ?? this.config.todo_sort ?? "list", this.hass.language);
    const active = sorted.filter(item => item.status !== "completed");
    const completed = sorted.filter(item => item.status === "completed");
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
          <label class="sort">${t("Sort tasks")}<select .value=${this.sort ?? this.config.todo_sort ?? "list"}
            @change=${(event: Event) => { this.sort = (event.target as HTMLSelectElement).value as TodoSort; }}>
            ${TODO_SORT_OPTIONS.map(option => html`<option value=${option.value}>${t(option.label)}</option>`)}
          </select></label>
          <div class="actions">
            <button class="icon-button refresh" aria-label=${t("Refresh")} title=${t("Refresh")}
              ?disabled=${this.loading || this.busy} @click=${() => void this.refresh()}><ha-icon .icon=${"mdi:refresh"}></ha-icon></button>
            ${this.supports(TODO_FEATURE.create) && this.config.todo_allow_add !== false ? html`
              <button class="icon-button primary add" aria-label=${t("Add task")} title=${t("Add task")}
                ?disabled=${!this.writable} @click=${() => this.openDraft()}><ha-icon .icon=${"mdi:plus"}></ha-icon></button>` : nothing}
          </div>
        </div>
        ${this.loading || this.busy ? html`<p role="status" class="status">${t(this.busy ? "Saving task…" : "Loading tasks…")}</p>` : nothing}
        ${this.error ? html`<p role="alert" class="status">${t(this.error)}</p>` : nothing}
        <div class="task-list" role="region" aria-label=${t("To-do lists")} tabindex="0">
        ${this.draft ? this.renderForm() : nothing}
        ${this.loaded && !active.length ? html`<p class="status">${t("No tasks to show.")}</p>` : nothing}
        <ul aria-label=${entity?.attributes.friendly_name ?? t("To-do")}>${active.map(item => this.renderItem(item))}</ul>
        ${this.loaded && this.config.todo_show_completed !== false ? html`
          <details class="completed-group"><summary>${t("Completed tasks")} (${completed.length})</summary>
            ${completed.length ? html`<ul aria-label=${t("Completed tasks")}>${completed.map(item => this.renderItem(item))}</ul>`
              : html`<p class="hint">${t("No completed tasks supplied by this list.")}</p>`}
          </details>` : nothing}
        </div>
        ${this.supports(TODO_FEATURE.create) && this.config.todo_allow_add !== false ? html`
          <form class="quick-add" @submit=${(event: SubmitEvent) => {
            event.preventDefault();
            if (this.quickTask.trim()) void this.mutate("add_item", { item: this.quickTask.trim() }, undefined, true);
          }}>
            <input name="quick-task" aria-label=${t("Add task")} placeholder=${t("Add task")} .value=${this.quickTask}
              ?disabled=${this.busy} @input=${(event: Event) => { this.quickTask = (event.target as HTMLInputElement).value; }}>
            <button type="submit" class="icon-button primary" aria-label=${t("Add task")} title=${t("Add task")}
              ?disabled=${!this.writable || !this.quickTask.trim()}><ha-icon .icon=${"mdi:plus"}></ha-icon></button>
          </form>` : nothing}`}
    </ha-card>`;
  }
  private renderItem(item: TodoItem) {
    const t = (text: string) => localizeText(this.hass, text);
    const safe = safeTodoUid(item, this.items);
    const checklistKey = safe ? `uid:${item.uid}` : `index:${this.items.indexOf(item)}`;
    const checklistId = `checklist-${this.items.indexOf(item)}`;
    const expanded = this.expandedChecklists.has(checklistKey);
    const editable = this.supports(TODO_FEATURE.update) && this.config!.todo_allow_edit !== false && this.writable && safe;
    return html`<li class=${`task-row${item.status === "completed" ? " completed" : ""}`}
      @click=${(event: MouseEvent) => {
        if (editable && !event.composedPath().some(node => node instanceof Element &&
          node.matches("button, input, select, textarea, a, .checklist"))) this.openDraft(item);
      }}>
            <button class="icon-button complete" aria-label=${`${t(item.status === "completed" ? "Mark incomplete" : "Complete task")}: ${item.summary}`}
              aria-pressed=${item.status === "completed"} ?disabled=${!this.writable || !safe || !this.supports(TODO_FEATURE.update)}
              @click=${() => void this.mutate("update_item", { status: item.status === "completed" ? "needs_action" : "completed" }, item)}>
              <ha-icon .icon=${item.status === "completed" ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}></ha-icon></button>
            <div class="task"><b><button type="button" class="task-title" ?disabled=${!editable}
              @click=${() => this.openDraft(item)}>${item.summary}</button></b>
              ${item.checklist?.length ? html`<span class="checklist-count">${localize(this.hass, "ui.release.{completed} of {total}",
                { completed: item.checklist.filter(step => step.checked).length, total: item.checklist.length })}</span>` : nothing}
              ${item.description?.trim() ? html`<p class="description">${item.description.trim()}</p>` : nothing}
              ${item.due ? html`<time datetime=${item.due}>${t("Due")}: ${this.dueLabel(item.due)}</time>` : nothing}
              ${item.checklist?.length ? html`
                <ul id=${checklistId} class="checklist" aria-label=${t("Subtasks")} ?hidden=${!expanded}>
                ${item.checklist.map(step => html`<li>
                  <button class="icon-button checklist-complete" aria-label=${`${t(step.checked ? "Mark incomplete" : "Complete task")}: ${step.name}`}
                    aria-pressed=${step.checked} ?disabled=${!this.canUpdateChecklist(item)}
                    @click=${() => void this.toggleChecklist(item, step)}>
                    <ha-icon .icon=${step.checked ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon>
                  </button><span class=${step.checked ? "checked" : ""}>${step.name}</span>
                </li>`)}
              </ul>` : nothing}
              ${!safe ? html`<div class="hint">${t("Task changed or has no safe UID. Refresh before editing.")}</div>` : nothing}
              ${this.deleting !== undefined && this.deleting === item.uid ? html`<div class="confirmation">
                <span>${t("Delete this task?")}</span>
                <button ?disabled=${!this.writable} @click=${() => void this.mutate("remove_item", {}, this.deleteBase)}>${t("Delete")}</button>
                <button ?disabled=${this.busy} @click=${() => { this.deleting = undefined; }}>${t("Cancel")}</button>
              </div>` : nothing}
            </div>
            <div class="row-actions">
              ${item.checklist?.length ? html`
                <button type="button" class="icon-button checklist-toggle" aria-label=${`${t("Subtasks")}: ${item.summary}`}
                  title=${t("Subtasks")} aria-expanded=${expanded} aria-controls=${checklistId}
                  @click=${() => {
                    const next = new Set(this.expandedChecklists);
                    if (expanded) next.delete(checklistKey); else next.add(checklistKey);
                    this.expandedChecklists = next;
                  }}><ha-icon .icon=${expanded ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon></button>` : nothing}
              ${this.supports(TODO_FEATURE.update) && this.config!.todo_allow_edit !== false ? html`<button class="icon-button edit"
                aria-label=${`${t("Edit")}: ${item.summary}`} ?disabled=${!this.writable || !safe} @click=${() => this.openDraft(item)}>
                <ha-icon .icon=${"mdi:pencil-outline"}></ha-icon></button>` : nothing}
              ${this.supports(TODO_FEATURE.delete) && this.config!.todo_allow_delete !== false ? html`<button class="icon-button delete"
                aria-label=${`${t("Delete")}: ${item.summary}`} ?disabled=${!this.writable || !safe} @click=${() => { this.deleting = item.uid; this.deleteBase = { ...item }; }}>
                <ha-icon .icon=${"mdi:delete-outline"}></ha-icon></button>` : nothing}
            </div>
          </li>`;
  }
  private renderForm() {
    const draft = this.draft!, t = (text: string) => localizeText(this.hass, text);
    const field = (key: keyof Draft, event: Event) => {
      this.draft = { ...draft, [key]: (event.target as HTMLInputElement).value };
    };
    return html`<form @submit=${(event: SubmitEvent) => this.save(event)}>
      <div class="editor-header"><button type="button" class="icon-button editor-close"
        aria-label=${t("Cancel")} title=${t("Cancel")} ?disabled=${this.busy}
        @click=${() => { this.draft = undefined; }}><ha-icon .icon=${"mdi:close"}></ha-icon></button></div>
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
      ${this.draftBase ? this.renderStepEditor(this.items.find(item => item.uid === this.draftBase?.uid) ?? this.draftBase) : nothing}
      <div class="actions"><button type="submit" class="primary" ?disabled=${!this.writable || !draft.summary.trim()}>${t("Save")}</button>
        <button type="button" ?disabled=${this.busy} @click=${() => { this.draft = undefined; }}>${t("Cancel")}</button></div>
    </form>`;
  }
  private renderStepEditor(item: TodoItem) {
    const t = (text: string) => localizeText(this.hass, text);
    if (!Array.isArray(this.hass?.states[this.selected]?.attributes.all_todos) && !item.checklist?.length) return nothing;
    return html`<fieldset class="step-editor"><legend>${t("Subtasks")}</legend>
      <p class="hint">${t("Subtask changes are saved immediately.")}</p>
      ${item.checklist?.length ? html`<p class="hint">${t("This integration cannot rename existing subtasks.")}</p>` : nothing}
      <ul>${item.checklist?.map(step => html`<li>
        <button type="button" class="icon-button step-complete" aria-label=${`${t(step.checked ? "Mark incomplete" : "Complete task")}: ${step.name}`}
          aria-pressed=${step.checked} ?disabled=${!this.canUpdateChecklist(item)} @click=${() => void this.toggleChecklist(item, step)}>
          <ha-icon .icon=${step.checked ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}></ha-icon></button>
        <span>${step.name}</span>
        ${this.deletingStep === step.id ? html`<div class="confirmation"><span>${t("Delete this task?")}</span>
          <button type="button" ?disabled=${!this.canChangeChecklist(item, "delete_todo_checklist_item")}
            @click=${() => void this.changeChecklist(item, "delete_todo_checklist_item", {}, step)}>${t("Delete")}</button>
          <button type="button" ?disabled=${this.busy} @click=${() => { this.deletingStep = undefined; }}>${t("Cancel")}</button></div>`
        : this.hass?.services?.ms365_todo?.delete_todo_checklist_item ? html`
          <button type="button" class="icon-button step-delete" aria-label=${`${t("Delete")}: ${step.name}`}
            ?disabled=${!this.canChangeChecklist(item, "delete_todo_checklist_item")} @click=${() => { this.deletingStep = step.id; }}>
            <ha-icon .icon=${"mdi:delete-outline"}></ha-icon></button>` : nothing}
      </li>`)}</ul>
      ${this.hass?.services?.ms365_todo?.new_todo_checklist_item ? html`<div class="step-add">
        <input name="new-checklist" aria-label=${t("Subtasks")} placeholder=${t("Subtasks")} .value=${this.newStep}
          ?disabled=${this.busy} @input=${(event: Event) => { this.newStep = (event.target as HTMLInputElement).value; }}
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === "Enter") { event.preventDefault(); if (this.newStep.trim()) void this.changeChecklist(item, "new_todo_checklist_item", { name: this.newStep.trim() }); }
          }}>
        <button type="button" class="icon-button step-add-button" aria-label=${`${t("Add task")}: ${t("Subtasks")}`}
          ?disabled=${!this.canChangeChecklist(item, "new_todo_checklist_item") || !this.newStep.trim()}
          @click=${() => void this.changeChecklist(item, "new_todo_checklist_item", { name: this.newStep.trim() })}>
          <ha-icon .icon=${"mdi:plus"}></ha-icon></button></div>` : nothing}
    </fieldset>`;
  }
}
