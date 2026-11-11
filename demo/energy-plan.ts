import "../src/index";
import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  mdiCalendarClock, mdiCurrencyEur, mdiWhiteBalanceSunny, mdiBattery, mdiBatteryHigh,
  mdiTransmissionTower, mdiHome, mdiHeatPump, mdiLightningBolt, mdiShapeOutline,
  mdiFormatAlignLeft, mdiViewDashboardOutline, mdiGestureTap, mdiViewList,
} from "@mdi/js";
import { EnergyPlanCard } from "../src/energy-plan/card";
import { planDefaults, validatePlan, type EnergyPlanConfig } from "../src/energy-plan/config";
import type { MushroomAdditionEditor } from "../src/editor";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";
import type { EditorField } from "../src/editor-schema";
import type { NativeFields } from "../src/energy-editor-schema";
import { mountSmartSavingDemo } from "./smart-saving";
import { mountEnergyMonitors } from "./energy-monitors";

const icons: Record<string, string> = {
  "mdi:calendar-clock": mdiCalendarClock, "mdi:currency-eur": mdiCurrencyEur,
  "mdi:white-balance-sunny": mdiWhiteBalanceSunny, "mdi:battery": mdiBattery,
  "mdi:battery-high": mdiBatteryHigh, "mdi:transmission-tower": mdiTransmissionTower,
  "mdi:home": mdiHome, "mdi:heat-pump": mdiHeatPump, "mdi:lightning-bolt": mdiLightningBolt,
  "mdi:shape-outline": mdiShapeOutline, "mdi:format-align-left": mdiFormatAlignLeft,
  "mdi:view-dashboard-outline": mdiViewDashboardOutline, "mdi:gesture-tap": mdiGestureTap, "mdi:view-list": mdiViewList,
};
class DemoIcon extends LitElement {
  @property() public icon = "";
  static styles = css`:host { display:inline-flex; width:var(--mdc-icon-size,24px); height:var(--mdc-icon-size,24px); } svg { width:100%; height:100%; fill:currentColor; }`;
  protected render() { return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${icons[this.icon] ?? mdiLightningBolt}></path></svg>`; }
}
class DemoPanel extends LitElement {
  @state() private expanded = false;
  static styles = css`
    :host { display:block; border:1px solid var(--divider-color); border-radius:12px; margin:10px 0; }
    button { width:100%; text-align:start; background:none; border:0; color:var(--primary-text-color); padding:12px; cursor:pointer; }
    .body { padding:0 12px 12px; }
    ::slotted(.section-header) { display:flex; align-items:center; gap:10px; }
  `;
  protected render() {
    return html`<button aria-expanded=${this.expanded} @click=${() => {
      this.expanded = !this.expanded;
      this.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded: this.expanded } }));
    }}><slot name="header"></slot></button>${this.expanded ? html`<div class="body"><slot></slot></div>` : nothing}`;
  }
}
class DemoForm extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public data: Record<string, unknown> = {};
  @property({ attribute: false }) public schema: EditorField[] = [];
  @property({ attribute: false }) public computeLabel = (field: EditorField) => field.name;
  @property({ attribute: false }) public computeHelper?: (field: EditorField) => string;
  static styles = css`
    label { display:flex; flex-direction:column; gap:6px; margin:12px 0; font-size:12px; }
    input,select { width:100%; box-sizing:border-box; background:var(--secondary-background-color); color:var(--primary-text-color); border:1px solid var(--divider-color); border-radius:8px; padding:10px; font:inherit; }
    input[type=checkbox] { width:auto; align-self:start; }
    small { color:var(--secondary-text-color); font-size:10px; line-height:1.5; }
  `;
  private change(field: EditorField, value: unknown) {
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { ...this.data, [field.name]: value } }, bubbles: true, composed: true,
    }));
  }
  private field(field: EditorField): ReturnType<typeof html> {
    if (field.schema) return html`${field.schema.map(item => this.field(item))}`;
    const selector = field.selector ?? {}, value = this.data[field.name];
    const object = selector.object as { fields: NativeFields; multiple?: boolean } | undefined;
    if (object?.fields) {
      const entries = object.multiple ? Array.isArray(value) ? value : [] : value && typeof value === "object" ? [value] : [];
      const initial = () => Object.fromEntries(Object.entries(object.fields).filter(([, spec]) => "default" in spec).map(([key, spec]) => [key, structuredClone(spec.default)]));
      const schema: EditorField[] = Object.entries(object.fields).map(([name, spec]) => ({ name, selector: spec.selector }));
      const save = (items: unknown[]) => this.change(field, object.multiple ? items : items[0] ?? "");
      return html`<fieldset><legend>${this.computeLabel(field)}</legend>
        ${entries.map((item, index) => html`<details><summary>${typeof item === "object" && item && "name" in item ? String(item.name) : `${this.computeLabel(field)} ${index + 1}`}</summary>
          <ha-form .hass=${this.hass} .data=${item} .schema=${schema}
            .computeLabel=${(child: EditorField) => object.fields[child.name].label}
            @value-changed=${(event: CustomEvent<{ value: Record<string, unknown> }>) => {
              event.stopPropagation(); save(entries.map((entry, i) => i === index ? event.detail.value : entry));
            }}></ha-form>
          <button type="button" @click=${() => save(entries.filter((_, i) => i !== index))}>Remove</button>
          ${object.multiple ? html`<button type="button" ?disabled=${index === 0} @click=${() => {
            const next = [...entries]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; save(next);
          }}>Move up</button><button type="button" ?disabled=${index === entries.length - 1} @click=${() => {
            const next = [...entries]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; save(next);
          }}>Move down</button>` : nothing}
        </details>`)}
        ${object.multiple || !entries.length ? html`<button type="button" @click=${() => save([...entries, initial()])}>Add</button>` : nothing}
      </fieldset>`;
    }
    const select = selector.select as { options: Array<string | { value: string; label?: string }> } | undefined;
    const number = selector.number as { min?: number; max?: number; step?: number } | undefined;
    const action = value && typeof value === "object" && "action" in value ? String(value.action) : "none";
    const items = select?.options ?? (selector.entity ? ["", ...Object.keys(this.hass?.states ?? {})] : selector.ui_action ? ["none", "more-info"] : undefined);
    return html`<label>${this.computeLabel(field)}
      ${selector.boolean ? html`<input type="checkbox" .checked=${value === true} @change=${(event: Event) => this.change(field, (event.target as HTMLInputElement).checked)}>`
        : items ? html`<select .value=${selector.ui_action ? action : String(value ?? "")} @change=${(event: Event) => {
          const value = (event.target as HTMLSelectElement).value;
          this.change(field, selector.ui_action ? { action: value } : value);
        }}>${items.map(item => {
          const value = typeof item === "string" ? item : item.value;
          return html`<option value=${value}>${typeof item === "string" ? item || "Inherit / not configured" : item.label ?? value}</option>`;
        })}</select>`
        : html`<input type=${number ? "number" : "text"} min=${number?.min ?? nothing} max=${number?.max ?? nothing} step=${number?.step ?? "any"}
            .value=${typeof value === "string" || typeof value === "number" ? String(value) : ""}
            @change=${(event: Event) => {
              const input = event.target as HTMLInputElement;
              this.change(field, number ? input.valueAsNumber : input.value);
            }}>`}
      ${this.computeHelper ? html`<small>${this.computeHelper(field)}</small>` : nothing}
    </label>`;
  }
  protected render() { return html`${this.schema.map(field => this.field(field))}`; }
}
if (!customElements.get("ha-card")) customElements.define("ha-card", class extends HTMLElement {});
for (const [tag, element] of [
  ["ha-icon", DemoIcon], ["ha-state-icon", class extends DemoIcon {}],
  ["ha-expansion-panel", DemoPanel], ["ha-form", DemoForm],
] as const) if (!customElements.get(tag)) customElements.define(tag, element);

const start = new Date(); start.setHours(8, 0, 0, 0);
let stored = 13.5 * .48;
const plan = Array.from({ length: 96 }, (_, index) => {
  const hour = (8 + index / 4) % 24;
  const solar = hour >= 8 && hour < 18 ? 3.8 * Math.sin(Math.PI * (hour - 8) / 10) : 0;
  const heat = hour >= 8 && hour < 9.5 || hour >= 18 && hour < 19 ? 1.6 : 0;
  const home = .30 + .16 * (1 + Math.sin(index * 1.7)) / 2 + heat + (hour >= 17 && hour < 20 ? .65 : 0);
  const price = hour >= 17 && hour < 21 ? .36 : hour < 5 ? .13 : hour >= 11 && hour < 16 ? .18 : .25;
  let battery = 0;
  if (solar > home) battery = Math.min(2.6, solar - home, (13.5 * .92 - stored) / (.25 * .95));
  else if (hour >= 1 && hour < 4) battery = Math.max(0, Math.min(1.8, (13.5 * .80 - stored) / (.25 * .95)));
  else if (hour >= 17 || hour < 1) battery = -Math.min(2.4, home - solar, Math.max(0, stored - 13.5 * .25) * .95 / .25);
  stored += battery >= 0 ? battery * .25 * .95 : battery * .25 / .95;
  return {
    start: new Date(start.getTime() + index * 900000).toISOString(),
    end: new Date(start.getTime() + (index + 1) * 900000).toISOString(),
    price, solar, battery, soc: stored / 13.5 * 100, grid: home + battery - solar, home, heat,
  };
});
const entities: Record<string, HassEntity> = {};
function sensor(name: string, state: string, attributes: Record<string, unknown> = {}): string {
  const id = `sensor.example_${name}`;
  entities[id] = { entity_id: id, state, last_updated: new Date().toISOString(), attributes: { friendly_name: `Synthetic ${name.replaceAll("_", " ")}`, ...attributes } };
  return id;
}
const planEntity = sensor("plan", "ready", { start: start.toISOString(), plan, method: "Synthetic daylight profile and illustrative demand estimate." });
const metrics = [
  { name: "Solar forecast", entity: sensor("solar_energy", plan.reduce((sum, row) => sum + row.solar * .25, 0).toFixed(2)), unit: "kWh", icon: "mdi:white-balance-sunny", color: "amber" },
  { name: "Grid import", entity: sensor("grid_energy", plan.reduce((sum, row) => sum + Math.max(0, row.grid) * .25, 0).toFixed(2)), unit: "kWh", icon: "mdi:transmission-tower", color: "purple" },
  { name: "Import cost", entity: sensor("import_cost", plan.reduce((sum, row) => sum + Math.max(0, row.grid) * .25 * row.price, 0).toFixed(2)), unit: "EUR", icon: "mdi:currency-eur", color: "cyan" },
  { name: "Battery at published end", entity: sensor("battery_end", plan.at(-1)!.soc.toFixed(1)), rowId: "soc", unit: "%", icon: "mdi:battery", color: "green" },
];
const initial: EnergyPlanConfig = {
  type: "custom:mushroom-addition-energy-plan", name: "Energy Plan", secondary: "Synthetic forecast - no device control",
  icon: "mdi:calendar-clock", visibleHours: 24, tap_action: { action: "none" }, entity: planEntity,
  energy_plan: {
    ...planDefaults(), start: "source", startField: "start", forecastKind: "estimate", forecastMethodField: "method",
    overview: "Let the sunshine do the work",
    description: "Store the midday surplus. Use your battery during the evening peak.",
    metrics, periods: [
      { name: "Daytime", start: 0, end: 10, description: "Solar covers the home first; surplus tops up the battery.", metrics: [] },
      { name: "Evening and overnight", start: 10, end: 24, description: "Discharge at the peak, then top up in the low-price window.", metrics: [] },
    ],
  },
};
const hass: HomeAssistant = { states: entities, language: "en", themes: { darkMode: true }, callService: async () => { throw new Error("Device control is disabled in the synthetic showcase."); } };
const card = document.createElement("mushroom-addition-energy-plan") as EnergyPlanCard;
const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
const storageKey = "mushroom-addition-energy-plan-synthetic-config";
const status = document.querySelector("#saved")!;
let config = initial;
function syntheticConfig(raw: unknown): EnergyPlanConfig {
  const valid = validatePlan(raw);
  function visit(value: unknown): void {
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      if ((key === "entity" || key.endsWith("Entity")) && typeof item === "string" && item && !(item in entities)) throw new Error("Only synthetic example sensors are allowed in the showcase.");
      if (["tap_action", "hold_action", "double_tap_action"].includes(key) && item && typeof item === "object" && "action" in item && !["none", "more-info"].includes(String(item.action))) throw new Error("Only none or more-info demo actions are allowed.");
      visit(item);
    }
  }
  visit(valid);
  return valid;
}
try {
  const saved = localStorage.getItem(storageKey);
  if (saved) config = syntheticConfig(JSON.parse(saved));
} catch (error) {
  if (!(error instanceof Error)) throw error;
  status.textContent = `Stored demo configuration could not be loaded: ${error.message}`;
}
card.hass = hass; editor.hass = hass; card.setConfig(config); editor.setConfig(config);
document.querySelector("#preview")!.append(card);
document.querySelector("#editor")!.append(editor);
const smartSavingDemo = mountSmartSavingDemo();
const energyMonitors = mountEnergyMonitors();
editor.addEventListener("config-changed", (event: Event) => {
  try {
    const next = syntheticConfig((event as CustomEvent<{ config: AdditionConfig }>).detail.config);
    card.setConfig(next);
    config = next;
    localStorage.setItem(storageKey, JSON.stringify(next));
    status.textContent = "Synthetic card configuration saved locally.";
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    status.textContent = `Configuration could not be saved: ${error.message}`;
  }
});
document.querySelector("#theme")!.addEventListener("click", () => {
  const light = document.documentElement.classList.toggle("light");
  document.body.classList.toggle("light", light);
  card.hass = editor.hass = { ...hass, themes: { darkMode: !light } };
  smartSavingDemo.theme(!light);
  energyMonitors.theme(!light);
  document.querySelector("#theme")!.textContent = light ? "Dark theme" : "Light theme";
});
document.querySelector("#reset")!.addEventListener("click", () => {
  try {
    localStorage.removeItem(storageKey);
    card.setConfig(initial); editor.setConfig(initial); config = initial;
    status.textContent = "Synthetic example reset.";
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    status.textContent = `Example could not be reset: ${error.message}`;
  }
});
