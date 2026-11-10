import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { MushroomTodoCard } from "../src/todo-card";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { getCatalogItem } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { populatedDefaultsFor } from "../src/defaults";
import { localizeText, SUPPORTED_LOCALES } from "../src/localize";
import { todoDetailTranslations, todoGuidanceTranslations, todoListTranslations, todoTranslations } from "../src/translations/todo";
import { readTodo, safeTodoUid, sortTodo, TODO_FEATURE, TODO_TYPE, todoStub, todoSupports, validateTodo, type TodoItem } from "../src/todo";

const task = (extra: Partial<TodoItem> = {}): TodoItem => ({ uid: "uid-1", summary: "Task one", status: "needs_action", ...extra });
const source = (features = 119, rows: TodoItem[] = [task()]): HomeAssistant => ({
  language: "en", states: {
    "todo.microsoft": { entity_id: "todo.microsoft", state: "1", attributes: { friendly_name: "Microsoft", supported_features: features } },
    "todo.other": { entity_id: "todo.other", state: "0", attributes: { supported_features: 0 } },
  },
  callWS: vi.fn(async () => ({ items: rows })) as HomeAssistant["callWS"],
  callService: vi.fn(async () => undefined),
});
const config = (extra: Partial<AdditionConfig> = {}): AdditionConfig => ({ type: TODO_TYPE, entity: "todo.microsoft", ...extra });
async function settle(card: MushroomTodoCard) {
  for (let i = 0; i < 10; i++) { await Promise.resolve(); await card.updateComplete; }
}
async function mount(hass = source(), extra: Partial<AdditionConfig> = {}) {
  const card = document.createElement(TODO_TYPE.slice(7)) as MushroomTodoCard;
  card.setConfig(config(extra)); card.hass = hass; document.body.append(card);
  await settle(card); return card;
}
const button = (card: MushroomTodoCard, label: string) => [...card.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")]
  .find(node => node.textContent!.trim() === label || node.getAttribute("aria-label") === label)!;
async function input(card: MushroomTodoCard, name: string, value: string) {
  const node = card.shadowRoot!.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
  node.value = value; node.dispatchEvent(new Event("input", { bubbles: true })); await settle(card);
}
async function submit(card: MushroomTodoCard) {
  card.shadowRoot!.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); await settle(card);
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("to-do API, capabilities and picker", () => {
  it("registers an original frontend card and selects only a healthy todo stub", () => {
    const hass = source();
    hass.states["todo.microsoft"].state = "unavailable";
    expect(todoStub(hass, ["todo.missing", "sensor.example", "todo.microsoft"]).entity).toBe("todo.other");
    expect(todoStub()).toEqual({ type: TODO_TYPE, todo_show_completed: true });
    const descriptor = getCatalogItem(TODO_TYPE.slice(7))!;
    expect(createStubConfig(descriptor, hass)).toEqual(todoStub(hass));
    expect(window.customCards?.find(row => row.type === TODO_TYPE.slice(7))?.preview).toBe(false);
    expect(customElements.get(TODO_TYPE.slice(7))).toBeDefined();
  });
  it("uses a single shared editor schema with shadow and all task options", () => {
    const descriptor = getCatalogItem(TODO_TYPE.slice(7))!;
    const flatten = (rows: EditorField[]): EditorField[] => rows.flatMap(row => row.schema ? flatten(row.schema) : [row]);
    const rows = flatten(editorSchemaFor(descriptor, config(), source()));
    const names = rows.map(row => row.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of ["entity", "todo_entities", "card_shadow", "layout", "icon_type", "primary_info", "todo_show_completed",
      "todo_allow_add", "todo_allow_edit", "todo_allow_delete", "todo_sort"]) expect(names).toContain(name);
    expect(rows.find(row => row.name === "todo_entities")?.selector).toEqual({ entity: { domain: ["todo"], multiple: true } });
    expect(populatedDefaultsFor(descriptor).todo_allow_add).toBe(true);
    expect(() => validateTodo(config({ entity: "sensor.no" }))).toThrow();
    expect(() => validateTodo(config({ todo_entities: ["todo.valid", "sensor.no"] }))).toThrow();
    expect(() => validateTodo(config({ todo_allow_add: "true" as unknown as boolean }))).toThrow();
    expect(() => validateTodo(config({ todo_sort: "created" as AdditionConfig["todo_sort"] }))).toThrow();
  });
  it("reads exact HA websocket API and never falls back to task titles", async () => {
    const hass = source(); await readTodo(hass, "todo.microsoft");
    expect(hass.callWS).toHaveBeenCalledWith({ type: "todo/item/list", entity_id: "todo.microsoft" });
    const fallback = { ...hass, callWS: undefined, connection: { sendMessagePromise: hass.callWS!, subscribeMessage: vi.fn() } };
    await expect(readTodo(fallback, "todo.microsoft")).resolves.toEqual([task()]);
    expect(safeTodoUid(task({ uid: undefined }), [task({ uid: undefined })])).toBe(false);
    const item = task(), duplicateTitle = task({ uid: "uid-2" });
    expect(safeTodoUid(item, [item, duplicateTitle])).toBe(true);
    expect(safeTodoUid(item, [item, task({ uid: "uid-2", summary: item.uid! })])).toBe(false);
    expect(safeTodoUid(item, [item, task()])).toBe(false);
  });
  it("recognizes Microsoft's 119 mask without implying unsupported ordering", () => {
    const entity = source().states["todo.microsoft"];
    for (const flag of Object.values(TODO_FEATURE)) expect(todoSupports(entity, flag)).toBe(true);
    expect(todoSupports(entity, 8)).toBe(false);
    expect(todoSupports({ ...entity, attributes: {} }, TODO_FEATURE.create)).toBe(false);
  });
  it("provides complete messages in all 33 supported languages", () => {
    expect(Object.keys(todoTranslations).sort()).toEqual([...SUPPORTED_LOCALES].sort());
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(todoTranslations[locale])).toEqual(Object.keys(todoTranslations.en));
      for (const text of Object.values(todoTranslations[locale])) expect(text.trim()).not.toBe("");
      expect(localizeText({ language: locale } as HomeAssistant, "Add task")).toBe(todoTranslations[locale]["ui.release.Add task"]);
      expect(Object.keys(todoGuidanceTranslations[locale])).toEqual(Object.keys(todoGuidanceTranslations.en));
      expect(Object.keys(todoListTranslations[locale])).toEqual(Object.keys(todoListTranslations.en));
      expect(Object.keys(todoDetailTranslations[locale])).toEqual(Object.keys(todoDetailTranslations.en));
      for (const [key, text] of Object.entries(todoDetailTranslations[locale])) {
        expect(localizeText({ language: locale } as HomeAssistant, todoDetailTranslations.en[key])).toBe(text);
      }
      for (const [key, text] of Object.entries(todoListTranslations[locale])) {
        expect(localizeText({ language: locale } as HomeAssistant, todoListTranslations.en[key])).toBe(text);
      }
    }
  });
});

describe("Microsoft To Do operations", () => {
  const checklistSource = () => {
    const hass = source();
    hass.states["todo.microsoft"].attributes.all_todos = [{
      todo_id: "uid-1", subject: "Task one", checklist_items: [
        { id: "step-1", name: "First step", is_checked: false },
        { id: "step-2", name: "Done step", is_checked: true },
      ],
    }];
    hass.services = { ms365_todo: {
      update_todo_checklist_item: { fields: {} },
      new_todo_checklist_item: { fields: {} },
      delete_todo_checklist_item: { fields: {} },
    } };
    return hass;
  };
  it("matches subitems by UID and toggles only the selected step using the existing MS365 service", async () => {
    const hass = checklistSource(), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-toggle")!.click(); await settle(card);
    const steps = card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".checklist-complete");
    expect(steps).toHaveLength(2);
    expect(card.shadowRoot!.querySelector(".checklist .checked")?.textContent).toBe("Done step");
    expect(steps[0].disabled).toBe(false);
    steps[0].click(); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("ms365_todo", "update_todo_checklist_item", {
      entity_id: "todo.microsoft", todo_id: "uid-1", checklist_item_id: "step-1", status: "completed",
    });
    card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".checklist-complete")[1].click(); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("ms365_todo", "update_todo_checklist_item", {
      entity_id: "todo.microsoft", todo_id: "uid-1", checklist_item_id: "step-2", status: "needs_action",
    });
  });
  it("collapses subtasks by default and preserves button expansion across refreshes", async () => {
    const hass = checklistSource(), card = await mount(hass);
    const toggle = () => card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-toggle")!;
    const list = () => card.shadowRoot!.querySelector<HTMLUListElement>(".checklist")!;
    expect(toggle().closest(".row-actions")?.querySelector(".edit")).not.toBeNull();
    expect(card.shadowRoot!.querySelector(".checklist-count")?.textContent).toBe("1 of 2");
    expect(toggle().getAttribute("aria-expanded")).toBe("false");
    expect(toggle().getAttribute("aria-controls")).toBe(list().id);
    expect(list().hidden).toBe(true);
    toggle().click(); await settle(card);
    expect(toggle().getAttribute("aria-expanded")).toBe("true");
    expect(list().hidden).toBe(false);
    button(card, "Refresh").click(); await settle(card);
    expect(list().hidden).toBe(false);
    toggle().click(); await settle(card);
    expect(list().hidden).toBe(true);
    toggle().click(); await settle(card);
    card.setConfig(config()); await settle(card);
    expect(list().hidden).toBe(true);
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("shows steps read-only without the provider service or edit capability", async () => {
    const hass = checklistSource();
    hass.services = {};
    const card = await mount(hass);
    expect(card.shadowRoot!.querySelector(".checklist")?.textContent).toContain("First step");
    expect(card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-complete")!.disabled).toBe(true);
    hass.services = { ms365_todo: { update_todo_checklist_item: { fields: {} } } };
    card.setConfig(config({ todo_allow_edit: false })); await settle(card);
    expect(card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-complete")!.disabled).toBe(true);
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("opens the editor from a title or row without completing the task or intercepting controls", async () => {
    const hass = checklistSource(), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".task-title")!.click(); await settle(card);
    expect(card.shadowRoot!.querySelector<HTMLInputElement>("[name=summary]")?.value).toBe("Task one");
    expect(card.shadowRoot!.querySelector(".step-editor")?.textContent).toContain("First step");
    button(card, "Cancel").click(); await settle(card);
    card.shadowRoot!.querySelector<HTMLElement>(".task-row")!.click(); await settle(card);
    expect(card.shadowRoot!.querySelector("[name=summary]")).not.toBeNull();
    button(card, "Cancel").click(); await settle(card);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-toggle")!.click(); await settle(card);
    expect(card.shadowRoot!.querySelector("[name=summary]")).toBeNull();
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("adds and confirms deletion of subtasks in the task editor using exact provider IDs", async () => {
    const hass = checklistSource(), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    await input(card, "summary", "Unsaved parent edit");
    await input(card, "new-checklist", "  New step  ");
    card.shadowRoot!.querySelector<HTMLButtonElement>(".step-add-button")!.click(); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("ms365_todo", "new_todo_checklist_item",
      { entity_id: "todo.microsoft", todo_id: "uid-1", name: "New step" });
    expect(card.shadowRoot!.querySelector<HTMLInputElement>("[name=new-checklist]")!.value).toBe("");
    expect(card.shadowRoot!.querySelector<HTMLInputElement>("[name=summary]")!.value).toBe("Unsaved parent edit");
    card.shadowRoot!.querySelector<HTMLButtonElement>(".step-delete")!.click(); await settle(card);
    expect(hass.callService).toHaveBeenCalledTimes(1);
    button(card, "Delete").click(); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("ms365_todo", "delete_todo_checklist_item",
      { entity_id: "todo.microsoft", todo_id: "uid-1", checklist_item_id: "step-1" });
    expect(card.shadowRoot!.querySelector(".step-editor")?.textContent).toContain("cannot rename existing subtasks");
  });
  it("gates subtask creation and deletion and rejects stale subtask deletion", async () => {
    const hass = checklistSource(), card = await mount(hass, { todo_allow_add: false, todo_allow_delete: false });
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    await input(card, "new-checklist", "New");
    expect(card.shadowRoot!.querySelector<HTMLButtonElement>(".step-add-button")!.disabled).toBe(true);
    expect(card.shadowRoot!.querySelector<HTMLButtonElement>(".step-delete")!.disabled).toBe(true);
    card.setConfig(config()); await settle(card);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".step-delete")!.click(); await settle(card);
    const metadata = hass.states["todo.microsoft"].attributes.all_todos as { checklist_items: { name: string }[] }[];
    metadata[0].checklist_items[0].name = "Changed remotely";
    button(card, "Delete").click(); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Task changed");
  });
  it("keeps the bottom quick-add input outside the scrolling list and retains failed input", async () => {
    const hass = source(), card = await mount(hass);
    const form = card.shadowRoot!.querySelector<HTMLFormElement>("form.quick-add")!;
    expect(form.closest(".task-list")).toBeNull();
    expect(form.previousElementSibling?.classList.contains("task-list")).toBe(true);
    await input(card, "quick-task", "  Quick task  ");
    vi.mocked(hass.callService).mockRejectedValueOnce(new Error("denied"));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); await settle(card);
    expect(card.shadowRoot!.querySelector<HTMLInputElement>("[name=quick-task]")!.value).toBe("  Quick task  ");
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Unable to change");
    button(card, "Refresh").click(); await settle(card);
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("todo", "add_item",
      { entity_id: "todo.microsoft", item: "Quick task" });
    expect(card.shadowRoot!.querySelector<HTMLInputElement>("[name=quick-task]")!.value).toBe("");
  });
  it("refuses ambiguous metadata, invalid steps, and stale step updates", async () => {
    const hass = checklistSource();
    const metadata = hass.states["todo.microsoft"].attributes.all_todos as { checklist_items: { id: string; name: string; is_checked: boolean }[] }[];
    hass.states["todo.microsoft"].attributes.all_todos = [metadata[0], metadata[0]];
    expect((await readTodo(hass, "todo.microsoft"))[0].checklist).toBeUndefined();
    hass.states["todo.microsoft"].attributes.all_todos = metadata;
    metadata[0].checklist_items[1].id = "step-1";
    await expect(readTodo(hass, "todo.microsoft")).rejects.toThrow("Invalid to-do checklist");
    metadata[0].checklist_items[1].id = "step-2";
    const card = await mount(hass);
    metadata[0].checklist_items[0].is_checked = true;
    card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-complete")!.click(); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Task changed");
  });
  it("reports step write errors without exposing provider text", async () => {
    const hass = checklistSource(), card = await mount(hass);
    vi.mocked(hass.callService).mockRejectedValue(new Error("private provider text"));
    card.shadowRoot!.querySelector<HTMLButtonElement>(".checklist-complete")!.click(); await settle(card);
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Unable to change");
    expect(card.shadowRoot!.textContent).not.toContain("private provider");
  });
  it("sorts active/completed groups independently without changing the provider list", async () => {
    const rows = [
      task({ uid: "z", summary: "Zulu", due: "2026-11-12" }),
      task({ uid: "c", summary: "Completed", status: "completed", due: "2026-11-01" }),
      task({ uid: "a", summary: "Alpha", due: "2026-11-11" }),
      task({ uid: "b", summary: "Beta" }),
    ];
    expect(sortTodo(rows, "due").map(r => r.uid)).toEqual(["c", "a", "z", "b"]);
    expect(sortTodo([...rows, task({ uid: "bad", due: "invalid" })], "due").at(-1)?.uid).toBe("bad");
    expect(sortTodo(rows, "list")).toEqual(rows);
    const hass = source(119, rows), card = await mount(hass, { todo_sort: "due" });
    const activeNames = () => [...card.shadowRoot!.querySelectorAll(".task-list > ul > li .task > b")].map(e => e.textContent);
    expect(activeNames()).toEqual(["Alpha", "Zulu", "Beta"]);
    const select = card.shadowRoot!.querySelector<HTMLSelectElement>(".sort select")!;
    select.value = "summary"; select.dispatchEvent(new Event("change")); await settle(card);
    expect(activeNames()).toEqual(["Alpha", "Beta", "Zulu"]);
    expect(card.shadowRoot!.querySelector(".completed-group ul b")?.textContent).toBe("Completed");
    expect(rows[0].summary).toBe("Zulu");
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("removes whitespace-only descriptions, offers icon actions, and explains missing completed tasks", async () => {
    const card = await mount(source(119, [task({ description: " \n\n " })]));
    expect(card.shadowRoot!.querySelector(".description")).toBeNull();
    for (const [label, icon] of [["Refresh", "mdi:refresh"], ["Add task", "mdi:plus"]]) {
      expect(button(card, label).title).toBe(label);
      expect((button(card, label).querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe(icon);
    }
    expect(card.shadowRoot!.querySelector(".completed-group .hint")?.textContent).toContain("No completed tasks supplied");
    const styles = String((customElements.get(TODO_TYPE.slice(7)) as typeof import("../src/todo-card").MushroomTodoCard).styles.at(-1));
    expect(styles).toContain("--mdc-icon-size:15px");
    expect(styles).toContain("min-width:32px; min-height:32px; height:32px");
    expect(styles).toContain("padding-block:8px");
  });
  it("renders a responsive readable list, completion state, description and due date", async () => {
    const card = await mount(source(119, [task({ description: "<script>private</script>\nDetails", due: "2026-11-09" }), task({ uid: "uid-2", status: "completed" })]), { card_shadow: true });
    expect(card.shadowRoot!.querySelectorAll("li")).toHaveLength(2);
    expect(card.shadowRoot!.querySelector("script")).toBeNull();
    expect(card.shadowRoot!.querySelector("time")?.getAttribute("datetime")).toBe("2026-11-09");
    expect(card.shadowRoot!.querySelector("ha-card")?.classList.contains("card-shadow")).toBe(true);
    expect(card.shadowRoot!.querySelector(".completed")).not.toBeNull();
    const group = card.shadowRoot!.querySelector<HTMLDetailsElement>(".completed-group")!;
    expect(group.open).toBe(false);
    expect(group.querySelector("summary")?.textContent).toContain("(1)");
    expect(group.querySelectorAll("li")).toHaveLength(1);
    group.open = true;
    button(card, "Refresh").click(); await settle(card);
    expect(group.open).toBe(true);
    card.setConfig(config({ todo_show_completed: false })); await settle(card);
    expect(card.shadowRoot!.querySelector(".completed-group")).toBeNull();
    expect(card.shadowRoot!.querySelectorAll("li")).toHaveLength(1);
  });
  it("adds a task with supported description and date, and waits for authoritative refresh", async () => {
    const hass = source(), card = await mount(hass);
    button(card, "Add task").click(); await settle(card);
    await input(card, "summary", "  New task  "); await input(card, "description", "Details");
    await input(card, "due", "2026-11-10"); await submit(card);
    expect(hass.callService).toHaveBeenCalledExactlyOnceWith("todo", "add_item",
      { entity_id: "todo.microsoft", item: "New task", description: "Details", due_date: "2026-11-10" });
    expect(card.shadowRoot!.querySelector("form:not(.quick-add)")).toBeNull();
    // The test provider still returns the old task: no optimistic/phantom item.
    expect(card.shadowRoot!.querySelectorAll("li")).toHaveLength(1);
    expect(hass.callWS).toHaveBeenCalledTimes(3);
  });
  it("completes and reopens by UID despite duplicate summaries", async () => {
    const hass = source(119, [task(), task({ uid: "uid-2", status: "completed" })]);
    const card = await mount(hass);
    const complete = card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".complete");
    complete[1].click(); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("todo", "update_item", { entity_id: "todo.microsoft", item: "uid-2", status: "needs_action" });
    complete[0].click(); await settle(card);
    expect(hass.callService).toHaveBeenLastCalledWith("todo", "update_item", { entity_id: "todo.microsoft", item: "uid-1", status: "completed" });
  });
  it("renames and clears description/date by UID", async () => {
    const hass = source(119, [task({ description: "Old", due: "2026-11-09" })]), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    await input(card, "summary", "Renamed"); await input(card, "description", ""); await input(card, "due", "");
    await submit(card);
    expect(hass.callService).toHaveBeenCalledExactlyOnceWith("todo", "update_item",
      { entity_id: "todo.microsoft", item: "uid-1", rename: "Renamed", description: null, due_date: null });
  });
  it("preserves unchanged due datetimes and sends edited datetime in ISO format", async () => {
    const hass = source(119, [task({ due: "2026-11-09T14:32:45+01:00" })]), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    await input(card, "summary", "Rename only"); await submit(card);
    expect(hass.callService).toHaveBeenLastCalledWith("todo", "update_item",
      { entity_id: "todo.microsoft", item: "uid-1", rename: "Rename only" });
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    await input(card, "due", "2026-11-10T10:15"); await submit(card);
    expect(hass.callService).toHaveBeenLastCalledWith("todo", "update_item",
      { entity_id: "todo.microsoft", item: "uid-1", rename: "Task one", due_datetime: new Date("2026-11-10T10:15").toISOString() });
  });
  it("requires explicit deletion confirmation and targets only the UID", async () => {
    const hass = source(), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".delete")!.click(); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
    button(card, "Delete").click(); await settle(card);
    expect(hass.callService).toHaveBeenCalledExactlyOnceWith("todo", "remove_item", { entity_id: "todo.microsoft", item: "uid-1" });
  });
});

describe("capability gating and failures", () => {
  it.each([0, 1, 2, 4, 17, 33, 65])("offers only advertised features for mask %s", async flags => {
    const card = await mount(source(flags));
    expect(!!button(card, "Add task")).toBe(!!(flags & 1));
    expect(!!card.shadowRoot!.querySelector(".edit")).toBe(!!(flags & 4));
    expect(!!card.shadowRoot!.querySelector(".delete")).toBe(!!(flags & 2));
    expect(card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.disabled).toBe(!(flags & 4));
    if (flags & 1) {
      button(card, "Add task").click(); await settle(card);
      expect(!!card.shadowRoot!.querySelector("[name=description]")).toBe(!!(flags & 64));
      expect(!!card.shadowRoot!.querySelector("[name=due]")).toBe(!!(flags & 48));
    }
  });
  it("respects configuration hiding add/edit/delete without removing completion", async () => {
    const card = await mount(source(), { todo_allow_add: false, todo_allow_edit: false, todo_allow_delete: false });
    expect(button(card, "Add task")).toBeUndefined();
    expect(card.shadowRoot!.querySelector(".edit")).toBeNull();
    expect(card.shadowRoot!.querySelector(".delete")).toBeNull();
    expect(card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.disabled).toBe(false);
  });
  it("disables missing, duplicate and summary-colliding UIDs rather than using titles", async () => {
    const hass = source(119, [task({ uid: undefined }), task(), task({ uid: "uid-2", summary: "uid-1" })]);
    const card = await mount(hass);
    const buttons = card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".complete");
    expect(buttons[0].disabled).toBe(true); expect(buttons[1].disabled).toBe(true);
    expect(card.shadowRoot!.querySelector(".confirmation")).toBeNull();
    buttons[0].click(); buttons[1].click(); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("rejects a task changed or removed before a write", async () => {
    const hass = source(), card = await mount(hass);
    vi.mocked(hass.callWS!).mockResolvedValue({ items: [task({ summary: "Changed elsewhere" })] });
    card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.click(); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Task changed");
  });
  it("does not overwrite a remote change polled while editing or confirming deletion", async () => {
    const hass = source(), card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".edit")!.click(); await settle(card);
    await input(card, "summary", "Local draft");
    vi.mocked(hass.callWS!).mockResolvedValue({ items: [task({ summary: "Remote edit" })] });
    button(card, "Refresh").click(); await settle(card);
    await submit(card);
    expect(hass.callService).not.toHaveBeenCalled();
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Task changed");
    button(card, "Refresh").click(); await settle(card);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".delete")!.click(); await settle(card);
    vi.mocked(hass.callWS!).mockResolvedValue({ items: [task({ summary: "Another remote edit" })] });
    button(card, "Refresh").click(); await settle(card);
    button(card, "Delete").click(); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("drops delayed post-write reads after a configuration change", async () => {
    const hass = source(), card = await mount(hass);
    let resolve!: (value: { items: TodoItem[] }) => void;
    vi.mocked(hass.callWS!).mockResolvedValueOnce({ items: [task()] })
      .mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.click(); await settle(card);
    expect(hass.callService).toHaveBeenCalledOnce();
    card.setConfig(config({ entity: "todo.other" })); await settle(card);
    resolve({ items: [task({ summary: "Old list response" })] }); await settle(card);
    expect(card.shadowRoot!.textContent).not.toContain("Old list response");
  });
  it("rechecks changing capabilities before a service call", async () => {
    const hass = source(), card = await mount(hass);
    let resolve!: (value: { items: TodoItem[] }) => void;
    vi.mocked(hass.callWS!).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.click(); await settle(card);
    card.hass = { ...hass, states: { ...hass.states, "todo.microsoft": { ...hass.states["todo.microsoft"], attributes: { supported_features: 0 } } } };
    await settle(card);
    resolve({ items: [task()] }); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Unable to change");
  });
  it("shows configuration guidance and unavailable lists without sending read requests", async () => {
    const hass = source(), card = await mount(hass, { entity: undefined });
    expect(card.shadowRoot!.textContent).toContain("Select to-do lists");
    expect(hass.callWS).not.toHaveBeenCalled();
    card.setConfig(config({ entity: "todo.missing" })); await settle(card);
    expect(card.shadowRoot!.textContent).toContain("Unavailable");
    expect(hass.callWS).not.toHaveBeenCalled();
  });
  it("shows loading/read failures and does not expose errors containing private task text", async () => {
    const hass = source();
    vi.mocked(hass.callWS!).mockRejectedValue(new Error("private provider content"));
    const card = await mount(hass);
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Unable to load");
    expect(card.shadowRoot!.textContent).not.toContain("private provider content");
    expect(button(card, "Add task").disabled).toBe(true);
    vi.mocked(hass.callWS!).mockResolvedValue({ items: [] });
    button(card, "Refresh").click(); await settle(card);
    expect(card.shadowRoot!.textContent).toContain("No tasks to show.");
    expect(button(card, "Add task").disabled).toBe(false);
  });
  it("retains the draft on denied writes, prevents double submits and requires refresh", async () => {
    const hass = source(), card = await mount(hass);
    let reject!: (error: Error) => void;
    vi.mocked(hass.callService).mockImplementation(() => new Promise((_resolve, fail) => { reject = fail; }));
    button(card, "Add task").click(); await settle(card);
    await input(card, "summary", "New");
    await submit(card); await submit(card);
    expect(hass.callService).toHaveBeenCalledTimes(1);
    reject(new Error("Unauthorized")); await settle(card);
    expect(card.shadowRoot!.querySelector<HTMLInputElement>("[name=summary]")!.value).toBe("New");
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Unable to change");
    expect(button(card, "Save").disabled).toBe(true);
  });
  it("distinguishes a successful write followed by failed verification", async () => {
    const hass = source(), card = await mount(hass);
    vi.mocked(hass.callWS!).mockResolvedValueOnce({ items: [task()] }).mockRejectedValueOnce(new Error("offline"));
    card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.click(); await settle(card);
    expect(hass.callService).toHaveBeenCalledOnce();
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Change sent. Refresh");
    expect(card.shadowRoot!.querySelector(".completed")).toBeNull();
  });
  it("does not accept malformed websocket data as an empty successful list", async () => {
    const hass = source();
    vi.mocked(hass.callWS!).mockResolvedValue({ items: [{ summary: "bad", status: "unknown" }] });
    const card = await mount(hass);
    expect(card.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Unable to load");
    expect(button(card, "Add task").disabled).toBe(true);
  });
  it("discards stale list results after switching lists or disconnecting", async () => {
    const hass = source();
    let resolve!: (value: { items: TodoItem[] }) => void;
    vi.mocked(hass.callWS!).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    const card = await mount(hass, { todo_entities: ["todo.other"] });
    expect(card.shadowRoot!.textContent).toContain("Loading tasks");
    button(card, "todo.other").click(); await settle(card);
    resolve({ items: [task({ summary: "Stale private task" })] }); await settle(card);
    expect(card.shadowRoot!.textContent).not.toContain("Stale private task");
    expect(hass.callWS).toHaveBeenLastCalledWith({ type: "todo/item/list", entity_id: "todo.other" });
    card.remove(); await settle(card);
    expect(card.shadowRoot!.querySelectorAll("li")).toHaveLength(0);
  });
  it("does not write if disconnected while the preflight read is pending", async () => {
    const hass = source(), card = await mount(hass);
    let resolve!: (value: { items: TodoItem[] }) => void;
    vi.mocked(hass.callWS!).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    card.shadowRoot!.querySelector<HTMLButtonElement>(".complete")!.click(); await settle(card);
    card.remove(); resolve({ items: [task()] }); await settle(card);
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("reconnects, refreshes state changes and polls without count-only assumptions", async () => {
    vi.useFakeTimers();
    const hass = source(), card = await mount(hass);
    vi.mocked(hass.callWS!).mockResolvedValue({ items: [task({ summary: "Same count, new title" })] });
    await vi.advanceTimersByTimeAsync(30000); await settle(card);
    expect(card.shadowRoot!.textContent).toContain("Same count, new title");
    card.hass = { ...hass, states: { ...hass.states, "todo.microsoft": { ...hass.states["todo.microsoft"], state: "unavailable" } } };
    await settle(card); expect(card.shadowRoot!.querySelectorAll("li")).toHaveLength(0);
    card.hass = { ...hass }; await settle(card);
    expect(card.shadowRoot!.querySelectorAll("li")).toHaveLength(1);
    const calls = vi.mocked(hass.callWS!).mock.calls.length; card.remove();
    await vi.advanceTimersByTimeAsync(60000);
    expect(hass.callWS).toHaveBeenCalledTimes(calls);
  });
});
