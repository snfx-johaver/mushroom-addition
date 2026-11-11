import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import { MushroomWorkflowCard } from "../../src/energy-cards/workflow";
import { MushroomWorkflowEditor } from "../../src/energy-cards/workflow-editor";
import { validateWorkflow, workflowStub, WORKFLOW_TAG, WORKFLOW_EDITOR_TAG } from "../../src/energy-cards/workflow-config";
import type { WorkflowConfig } from "../../src/energy-cards/workflow-config";
import type { HomeAssistant } from "../../src/types";
import type { EditorField } from "../../src/energy-cards/editor-schema";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const config = (): WorkflowConfig => ({
  type: `custom:${WORKFLOW_TAG}`, title: "Example workflow",
  groups: [{ id: "input", label: "Input", color: "#42a5f5" }, { id: "plan", label: "Plan" }],
  nodes: [
    { id: "source", label: "Source", group: "input", icon: "mdi:database", entities: [
      { entity: "sensor.example", label: "Power" },
      { entity: "sensor.example", attribute: "forecast", label: "Forecast", unit: "kWh" },
    ] },
    { id: "proposal", label: "Proposal", group: "plan", note: "Not confirmation of execution.",
      entities: [{ entity: "sensor.example_missing" }] },
  ],
  relations: [{ from: "source", to: "proposal", label: "informs" }],
});
const hass = (): HomeAssistant => ({
  states: { "sensor.example": { entity_id: "sensor.example", state: "27", attributes: { unit_of_measurement: "W", forecast: 12 } } },
  callService: vi.fn(async () => undefined), callWS: vi.fn(),
});
async function card(presentation: "graph" | "sequential" = "sequential") {
  const element = document.createElement(WORKFLOW_TAG) as MushroomWorkflowCard;
  element.hass = hass();
  element.setConfig({ ...config(), presentation });
  document.body.append(element);
  await element.updateComplete;
  return element;
}
async function editor() {
  const element = document.createElement(WORKFLOW_EDITOR_TAG) as MushroomWorkflowEditor;
  element.hass = hass();
  element.setConfig(config());
  document.body.append(element);
  await element.updateComplete;
  return element;
}
type Form = HTMLElement & { data: Record<string, unknown>; schema: EditorField[]; hass?: HomeAssistant };
function forms(element: MushroomWorkflowEditor): Form[] {
  return [...element.shadowRoot!.querySelectorAll<Form>("ha-form")];
}
function change(form: Form, value: Record<string, unknown>) {
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value }, bubbles: true, composed: true }));
}
function button(element: MushroomWorkflowEditor, text: string) {
  return [...element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")]
    .find(item => item.textContent?.trim() === text)!;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("workflow configuration", () => {
  it("validates the documented examples with synthetic entity IDs", () => {
    const documentation = readFileSync("docs/ENERGY_WORKFLOW.md", "utf8");
    const examples = [...documentation.matchAll(/```yaml\r?\n([\s\S]*?)```/g)].map(match => parse(match[1]) as WorkflowConfig);
    expect(examples.map(example => example.presentation)).toEqual(expect.arrayContaining(["sequential", "graph"]));
    expect(examples.find(example => example.name === "Energy process")?.groups?.map(group => group.label))
      .toEqual(["Input", "Calculation", "Plan", "Execution"]);
    for (const example of examples) {
      expect(() => validateWorkflow(example)).not.toThrow();
      expect(example.nodes.flatMap(node => node.entities ?? []).every(row => /^[a-z_]+\.example_/.test(row.entity))).toBe(true);
    }
    const readme = readFileSync("README.md", "utf8");
    const readmeExample = [...readme.matchAll(/```yaml\r?\n([\s\S]*?)```/g)]
      .map(match => parse(match[1])).find(example => example.type === `custom:${WORKFLOW_TAG}`);
    expect(() => validateWorkflow(readmeExample)).not.toThrow();
  });
  it("registers the standalone picker, dedicated editor, and stub", async () => {
    expect(window.customCards?.find(item => item.type === WORKFLOW_TAG)?.name).toBe("Mushroom Addition: Energy Entityworkflow");
    expect((await MushroomWorkflowCard.getConfigElement()).tagName).toBe("MUSHROOM-ADDITION-EDITOR");
    expect(MushroomWorkflowCard.getStubConfig(hass())).toEqual(workflowStub(hass()));
    expect(() => validateWorkflow(workflowStub())).not.toThrow();
    expect(workflowStub().nodes.flatMap(node => node.entities ?? [])).toEqual([]);
    expect(() => validateWorkflow(JSON.parse(JSON.stringify(config())))).not.toThrow();
    expect(window.customCards?.map(item => item.type)).toContain(WORKFLOW_TAG);
    expect(customElements.get(WORKFLOW_TAG)).toBe(MushroomWorkflowCard);
  });
  it("creates stubs from available browser states only, without embedding unavailable or duplicate rows", () => {
    const snapshot = hass();
    snapshot.states["sensor.example_offline"] = {
      entity_id: "sensor.example_offline", state: "unavailable", attributes: {},
    };
    const stub = MushroomWorkflowCard.getStubConfig(snapshot,
      ["sensor.example_offline", "sensor.example"], ["sensor.example"]);
    expect(stub.nodes.flatMap(node => node.entities ?? [])).toEqual([{ entity: "sensor.example" }]);
  });
  it.each([
    [{ nodes: [] }, /at least one node/],
    [{ nodes: [{ id: "same", label: "A" }, { id: "same", label: "B" }] }, /Duplicate workflow node ID/],
    [{ groups: [{ id: "same", label: "A" }, { id: "same", label: "B" }] }, /Duplicate workflow group ID/],
    [{ nodes: [{ id: "", label: "A" }] }, /non-empty text/],
    [{ nodes: [{ id: "a", label: "A", group: "missing" }] }, /unknown group/],
    [{ relations: [{ from: "missing", to: "proposal" }] }, /existing source and target/],
    [{ nodes: [{ id: "a", label: "A", entities: [{ entity: "not-an-entity" }] }] }, /valid entity IDs/],
    [{ presentation: "execute" }, /sequential or graph/],
    [{ groups: "invalid" }, /groups must be a list/],
    [{ nodes: [{ id: "a", label: "A", entities: "invalid" }] }, /entities must be a list/],
    [{ relations: [null] }, /existing source and target/],
    [{ nodes: [{ id: "a", label: "A", note: 42 }] }, /note must be text/],
  ])("rejects invalid configuration %j", (overrides, error) => {
    const element = new MushroomWorkflowCard();
    expect(() => element.setConfig({ ...config(), ...overrides } as WorkflowConfig)).toThrow(error);
  });
  it("allows branching, cycles, and self-relations without executing anything", async () => {
    const element = await card("graph");
    element.setConfig({ ...config(), presentation: "graph", relations: [
      { from: "source", to: "proposal" }, { from: "proposal", to: "source" }, { from: "source", to: "source" },
    ] });
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll(".relations li")).toHaveLength(3);
    expect(element.hass?.callService).not.toHaveBeenCalled();
    expect(element.hass?.callWS).not.toHaveBeenCalled();
  });
});

describe("workflow live rendering", () => {
  it("uses native name/state formatting, row overrides and native icon selectors", async () => {
    const element = await card();
    element.setConfig({
      type: `custom:${WORKFLOW_TAG}`,
      nodes: [{ id: "formatted", label: "Formatted", entities: [
        { entity: "sensor.example", icon: "mdi:flash" },
        { entity: "sensor.example", label: "Override", unit: "kWh" },
      ] }],
    });
    element.hass = { ...hass(), formatEntityName: () => "Native name", formatEntityState: () => "Native state" };
    await element.updateComplete;
    expect(element.shadowRoot!.textContent).toContain("Native name");
    expect(element.shadowRoot!.textContent).toContain("Native state");
    expect(element.shadowRoot!.textContent).toContain("Override");
    expect(element.shadowRoot!.textContent).toContain("27 kWh");
    expect(element.shadowRoot!.querySelector<HTMLElement & { icon: string }>("button ha-icon")?.icon).toBe("mdi:flash");
  });
  it("preserves ordered groups and nodes and places ungrouped nodes last", async () => {
    const element = await card();
    element.setConfig({ ...config(), nodes: [
      { id: "ungrouped", label: "Ungrouped" }, ...config().nodes,
      { id: "second", label: "Second input", group: "input" },
    ] });
    await element.updateComplete;
    expect([...element.shadowRoot!.querySelectorAll<HTMLElement>("[data-node]")].map(node => node.dataset.node))
      .toEqual(["source", "second", "proposal", "ungrouped"]);
    expect(element.getGridOptions()).toEqual({ columns: 12, rows: "auto", min_columns: 3, min_rows: 3 });
  });
  it("uses a keyboard-focusable graph scroll region and a readable relationship list", async () => {
    const element = await card("graph");
    const region = element.shadowRoot!.querySelector<HTMLElement>(".graph-scroll")!;
    expect(region.tabIndex).toBe(0);
    expect(region.getAttribute("role")).toBe("region");
    expect(region.getAttribute("aria-label")).toBe("Entity workflow");
    expect(element.shadowRoot!.querySelector(".relations .sr-only")?.textContent).toBe("to");
    element.hass = { ...hass(), language: "ar" };
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector("ha-card")?.getAttribute("dir")).toBe("rtl");
  });
  it.each(["sequential", "graph"] as const)("renders grouped live rows in %s view", async presentation => {
    const element = await card(presentation);
    expect(element.shadowRoot!.querySelectorAll(".group")).toHaveLength(2);
    expect(element.shadowRoot!.querySelectorAll(".node")).toHaveLength(2);
    expect(element.shadowRoot!.textContent).toContain("27 W");
    expect(element.shadowRoot!.textContent).toContain("12 kWh");
    expect(element.shadowRoot!.textContent).toContain("Not confirmation of execution.");
    expect(element.shadowRoot!.textContent).toContain("informs");
    expect(element.shadowRoot!.querySelector(".board")?.classList.contains(presentation)).toBe(true);
    expect(element.shadowRoot!.querySelector<HTMLButtonElement>(".entity-row:disabled")).not.toBeNull();
    expect(element.shadowRoot!.querySelector(".graph-scroll") !== null).toBe(presentation === "graph");
    const current = element.hass!;
    element.hass = { ...current, states: { ...current.states,
      "sensor.example": { ...current.states["sensor.example"], state: "30", attributes: { forecast: 15, unit_of_measurement: "W" } },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.textContent).toContain("30 W");
    expect(element.shadowRoot!.textContent).toContain("15 kWh");
    expect(element.hass.callService).not.toHaveBeenCalled();
  });
  it("uses more-info rather than executing services", async () => {
    const element = await card();
    const listener = vi.fn();
    element.addEventListener("hass-more-info", listener);
    element.shadowRoot!.querySelector<HTMLButtonElement>(".entity-row")!.click();
    expect(listener.mock.calls[0][0].detail).toEqual({ entityId: "sensor.example" });
    expect(element.hass?.callService).not.toHaveBeenCalled();
  });
  it("never substitutes zero for missing, unavailable, or missing-attribute values", async () => {
    const element = await card();
    element.hass = { ...hass(), states: {
      "sensor.example": { entity_id: "sensor.example", state: "unavailable", attributes: { forecast: 12, unit_of_measurement: "W" } },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.textContent).not.toContain("12 kWh");
    element.hass = { ...hass(), states: {
      "sensor.example": { entity_id: "sensor.example", state: "0", attributes: {} },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.textContent).toContain("Attribute unavailable");
    expect(element.shadowRoot!.textContent).toContain("Entity unavailable");
    expect(element.shadowRoot!.querySelectorAll("strong")[0].textContent).toBe("0");
  });
  it("renders attribute structures and custom labels as text, not HTML", async () => {
    const element = await card();
    element.setConfig({ ...config(), title: "<img src=x>", nodes: [
      { id: "a", label: "<script>unsafe</script>", entities: [{ entity: "sensor.example", attribute: "forecast" }] },
    ], relations: [] });
    element.hass = { ...hass(), states: {
      "sensor.example": { entity_id: "sensor.example", state: "1", attributes: { forecast: { planned: 4 } } },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.textContent).toContain('{"planned":4}');
    expect(element.shadowRoot!.querySelector("img, script")).toBeNull();
  });
  it("draws directed graph paths between actual node bounds and releases resize observers", async () => {
    const disconnect = vi.fn();
    let resize!: ResizeObserverCallback;
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe = vi.fn();
      disconnect = disconnect;
    });
    const element = await card("graph");
    const rect = (x: number, y: number, width: number, height: number) => ({
      x, y, left: x, top: y, right: x + width, bottom: y + height, width, height, toJSON() {},
    });
    const board = element.shadowRoot!.querySelector<HTMLElement>(".board")!;
    vi.spyOn(board, "getBoundingClientRect").mockReturnValue(rect(0, 0, 640, 350));
    Object.defineProperty(board, "scrollWidth", { value: 640, configurable: true });
    Object.defineProperty(board, "scrollHeight", { value: 350, configurable: true });
    const nodes = element.shadowRoot!.querySelectorAll<HTMLElement>(".node");
    vi.spyOn(nodes[0], "getBoundingClientRect").mockReturnValue(rect(12, 40, 230, 150));
    vi.spyOn(nodes[1], "getBoundingClientRect").mockReturnValue(rect(352, 40, 230, 100));
    resize([], {} as ResizeObserver);
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector(".connectors path[marker-end]")?.getAttribute("d")).toBe("M 242 115 C 297 115 297 90 352 90");
    expect(element.shadowRoot!.querySelector(".connectors text")?.textContent).toBe("informs");
    element.setConfig({ ...config(), presentation: "graph", nodes: [
      ...config().nodes, { id: "extra", label: "Extra", group: "input" },
    ], relations: [
      ...config().relations!, { from: "proposal", to: "source", label: "reports on" },
      { from: "source", to: "source", label: "self" }, { from: "source", to: "extra", label: "same group" },
    ] });
    await element.updateComplete;
    const extra = element.shadowRoot!.querySelector<HTMLElement>('[data-node="extra"]')!;
    vi.spyOn(extra, "getBoundingClientRect").mockReturnValue(rect(12, 210, 230, 60));
    resize([], {} as ResizeObserver);
    await element.updateComplete;
    const paths = [...element.shadowRoot!.querySelectorAll(".connectors path[marker-end]")].map(path => path.getAttribute("d"));
    expect(paths).toHaveLength(4);
    expect(paths[1]).toBe("M 582 90 L 598 90 L 598 310 L 274 310 L 274 115 L 242 115");
    expect(paths[2]).toBe("M 242 115 L 258 115 L 258 290 L 274 290 L 274 115 L 242 115");
    expect(paths[3]).toBe("M 242 115 C 262 115 262 240 242 240");
    element.remove();
    expect(disconnect).toHaveBeenCalled();
  });
});

describe("workflow visual editor", () => {
  it("publishes serializable changes and forwards live HA to selectors", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    change(forms(element)[0], { title: "Network", presentation: "graph" });
    await element.updateComplete;
    const saved = listener.mock.calls[0][0].detail.config;
    expect(saved.presentation).toBe("graph");
    expect(() => validateWorkflow(JSON.parse(JSON.stringify(saved)))).not.toThrow();
    element.hass = { ...hass(), language: "en" };
    await element.updateComplete;
    expect(forms(element).every(form => form.hass === element.hass)).toBe(true);
  });
  it("renames node/group IDs without breaking references", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    change(forms(element).find(form => form.data.id === "source")!, { id: "new_source" });
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.relations[0].from).toBe("new_source");
    change(forms(element).find(form => form.data.id === "input")!, { id: "new_input" });
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.nodes[0].group).toBe("new_input");
  });
  it("retains original references while correcting duplicate ID drafts", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    change(forms(element).find(form => form.data.id === "source")!, { id: "proposal" });
    await element.updateComplete;
    expect(listener).not.toHaveBeenCalled();
    expect(element.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("Duplicate workflow node ID");
    change(forms(element).filter(form => form.data.id === "proposal")[0], { id: "new_source" });
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.relations[0]).toMatchObject({ from: "new_source", to: "proposal" });
    listener.mockClear();
    change(forms(element).find(form => form.data.id === "input")!, { id: "plan" });
    await element.updateComplete;
    expect(listener).not.toHaveBeenCalled();
    change(forms(element).filter(form => form.data.id === "plan")[0], { id: "new_input" });
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.nodes.map((node: { group: string }) => node.group)).toEqual(["new_input", "plan"]);
  });
  it("deletes the intended references when removing a node with a duplicate ID draft", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    change(forms(element).find(form => form.data.id === "source")!, { id: "proposal" });
    await element.updateComplete;
    element.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Remove Nodes: Source"]')!.click();
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.nodes.map((node: WorkflowConfig["nodes"][number]) => node.id))
      .toEqual(["proposal"]);
    expect(listener.mock.lastCall![0].detail.config.relations).toEqual([]);
  });
  it("keeps incomplete entity-row edits visible but does not persist invalid config", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    button(element, "Add entity row").click();
    await element.updateComplete;
    expect(listener).not.toHaveBeenCalled();
    expect(element.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("valid entity IDs");
    change(forms(element).find(form => form.data.entity === "")!, { entity: "sensor.example", label: "New reading" });
    await element.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect(element.shadowRoot!.querySelector("[role=alert]")).toBeNull();
  });
  it("reorders groups and rows, removes associated relationships, and ungroups removed-group nodes", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    element.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Move Group: Plan up"]')!.click();
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.groups[0].id).toBe("plan");
    element.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Move Entity rows 2: Source up"]')!.click();
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.nodes[0].entities[0].attribute).toBe("forecast");
    element.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Remove Group: Input"]')!.click();
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.nodes[0].group).toBeUndefined();
    element.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Remove Nodes: Source"]')!.click();
    await element.updateComplete;
    expect(listener.mock.lastCall![0].detail.config.relations).toEqual([]);
  });
  it("adds groups, nodes and directed relationships without YAML", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    button(element, "Add group").click();
    await element.updateComplete;
    button(element, "Add node").click();
    await element.updateComplete;
    button(element, "Add relationship").click();
    await element.updateComplete;
    const saved = listener.mock.lastCall![0].detail.config as WorkflowConfig;
    expect(saved.nodes).toHaveLength(3);
    expect(saved.groups).toHaveLength(3);
    expect(saved.relations).toHaveLength(2);
    expect(() => validateWorkflow(saved)).not.toThrow();
  });
});
