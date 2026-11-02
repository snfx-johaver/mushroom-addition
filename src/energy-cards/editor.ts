import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, PriceConfig, SmartSavingConfig, TrackConfig } from "./types";
import { validateConfig } from "./validation";
import { localizeText } from "../localize";
import { EditorSchemaCache } from "./editor-schema";

type FormChange = CustomEvent<{ value: Record<string, unknown> }>;

const entitySelector = { entity: {} };
const textSelector = { text: {} };
const numberSelector = { number: { mode: "box", min: 0, max: 168, step: 1 } };
const unitSelector = { select: { options: ["EUR/kWh", "ct/kWh"], mode: "dropdown" } };
const adapterSelector = { select: { options: [{ value: "attribute", label: "Entity attribute" }, { value: "state", label: "State" }], mode: "dropdown" } };

function rootLabel(name: string): string {
  const labels: Record<string, string> = {
    title: "Title",
    subtitle: "Subtitle",
    visibleHours: "Visible hours (timeline)",
  };
  return labels[name] ?? name;
}

@customElement("mushroom-addition-smart-saving-features")
export class SmartSavingPlanCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public _config?: SmartSavingConfig;
  @property({ type: Boolean }) public embedded = false;
  @state() private error = "";
  private readonly schemas = new EditorSchemaCache();

  static styles = css`
    :host { display: block; }
    h3 { margin: 20px 0 4px; font-size: 15px; }
    p { color: var(--secondary-text-color); font-size: 12px; }
  `;

  public setConfig(config: SmartSavingConfig): void {
    this._config = config;
  }

  private fire(config: SmartSavingConfig): void {
    this._config = config;
    try {
      validateConfig(config);
      this.error = "";
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      this.error = error.message;
      return;
    }
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
  }

  private updateRoot(event: FormChange): void {
    if (!this._config) return;
    this.fire({ ...this._config, ...event.detail.value } as SmartSavingConfig);
  }

  private t(text: string): string { return localizeText(this.hass, text); }
  private readonly computeLabel = (schema: { name: string }): string => {
    const label = rootLabel(schema.name).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, value => value.toUpperCase());
    const direct = this.t(label);
    if (direct !== label || ["title", "subtitle", "visibleHours"].includes(schema.name)) return direct;
    const words: Record<string, string> = { adapter: "Source", purchase: "Planned purchase", display: "Content", time: "Start" };
    return schema.name.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ")
      .map(word => this.t(words[word.toLowerCase()] ?? word.replace(/^./, character => character.toUpperCase()))).join(": ");
  };

  private updatePrice(event: FormChange): void {
    if (!this._config) return;
    const values = event.detail.value;
    const current = this._config.price;
    const price: PriceConfig = {
      entity: String(values.entity ?? current?.entity ?? ""),
      adapter: values.adapter === "state" ? "state" : "attribute",
      path: String(values.path ?? current?.path ?? ""),
      startField: String(values.startField ?? current?.startField ?? ""),
      endField: String(values.endField ?? current?.endField ?? ""),
      durationField: String(values.durationField ?? current?.durationField ?? ""),
      priceField: String(values.priceField ?? current?.priceField ?? ""),
      sourceUnit: values.sourceUnit === "ct/kWh" ? "ct/kWh" : "EUR/kWh",
      displayUnit: values.displayUnit === "EUR/kWh" ? "EUR/kWh" : "ct/kWh",
    };
    this.fire({ ...this._config, price });
  }

  private updateTrack(key: "plan" | "applied" | "ev" | "solar", event: FormChange): void {
    if (!this._config) return;
    const values = event.detail.value;
    const current = this._config.tracks?.[key];
    const track: TrackConfig = {
      entity: String(values.entity ?? current?.entity ?? ""),
      path: String(values.path ?? current?.path ?? ""),
      startField: String(values.startField ?? current?.startField ?? ""),
      endField: String(values.endField ?? current?.endField ?? ""),
      durationField: String(values.durationField ?? current?.durationField ?? ""),
      valueField: String(values.valueField ?? current?.valueField ?? ""),
      powerField: String(values.powerField ?? current?.powerField ?? ""),
      energyField: String(values.energyField ?? current?.energyField ?? ""),
      statusField: String(values.statusField ?? current?.statusField ?? ""),
      unit: String(values.unit ?? current?.unit ?? ""),
      kind: key === "solar" ? "solar" : "schedule",
    };
    this.fire({ ...this._config, tracks: { ...this._config.tracks, [key]: track } });
  }

  protected render() {
    if (!this._config) return html``;
    const config = this._config;
    return html`
      ${this.error ? html`<p role="alert">${this.error}</p>` : nothing}
      ${this.embedded ? nothing : html`<h3>${this.t("Card")}</h3>
      <ha-form .hass=${this.hass} .data=${{
        title: config.title ?? "Smart Saving",
        subtitle: config.subtitle ?? "",
        visibleHours: config.visibleHours ?? 36,
        statusEntity: config.statusEntity ?? "",
      }} .schema=${this.schemas.get([
        { name: "title", selector: textSelector },
        { name: "subtitle", selector: textSelector },
        { name: "visibleHours", selector: numberSelector },
        { name: "statusEntity", selector: entitySelector },
      ])} .computeLabel=${this.computeLabel} @value-changed=${(event: FormChange) => this.updateRoot(event)}></ha-form>`}

      <h3>${this.t("Prices")}</h3>
      <p>${this.t("Map timestamps and prices to published intervals. Entries without them are ignored.")}</p>
      <ha-form .hass=${this.hass} .data=${{
        entity: config.price?.entity ?? "",
        adapter: config.price?.adapter ?? "attribute",
        path: config.price?.path ?? "prices",
        startField: config.price?.startField ?? "start",
        endField: config.price?.endField ?? "end",
        durationField: config.price?.durationField ?? "",
        priceField: config.price?.priceField ?? "price",
        sourceUnit: config.price?.sourceUnit ?? "EUR/kWh",
        displayUnit: config.price?.displayUnit ?? "ct/kWh",
      }} .schema=${this.schemas.get([
        { name: "entity", selector: entitySelector },
        { name: "adapter", selector: { select: { ...adapterSelector.select, options: adapterSelector.select.options.map(option => ({ ...option, label: this.t(option.label) })) } } },
        { name: "path", selector: textSelector },
        { name: "startField", selector: textSelector },
        { name: "endField", selector: textSelector },
        { name: "durationField", selector: textSelector },
        { name: "priceField", selector: textSelector },
        { name: "sourceUnit", selector: unitSelector },
        { name: "displayUnit", selector: unitSelector },
      ])} .computeLabel=${this.computeLabel} @value-changed=${(event: FormChange) => this.updatePrice(event)}></ha-form>

      <h3>${this.t("Battery")}</h3>
      <ha-form .hass=${this.hass} .data=${{
        currentEntity: config.battery?.current?.entity ?? "",
        currentValue: config.battery?.current?.value ?? "",
        currentField: config.battery?.current?.field ?? "",
        forecastEntity: config.battery?.forecast?.entity ?? "",
        forecastPath: config.battery?.forecast?.path ?? "forecast",
        forecastTime: config.battery?.forecast?.startField ?? "time",
        forecastValue: config.battery?.forecast?.valueField ?? "value",
        horizonHours: config.battery?.horizon?.value ?? 24,
        horizonEntity: config.battery?.horizon?.entity ?? "",
        targetValue: config.battery?.target?.value ?? "",
        targetEntity: config.battery?.target?.entity ?? "",
      }} .schema=${this.schemas.get([
        { name: "currentEntity", selector: entitySelector }, { name: "currentValue", selector: { number: { mode: "box", min: 0, max: 100 } } },
        { name: "currentField", selector: textSelector }, { name: "forecastEntity", selector: entitySelector },
        { name: "forecastPath", selector: textSelector }, { name: "forecastTime", selector: textSelector },
        { name: "forecastValue", selector: textSelector }, { name: "horizonHours", selector: numberSelector },
        { name: "horizonEntity", selector: entitySelector }, { name: "targetValue", selector: { number: { mode: "box", min: 0, max: 100 } } },
        { name: "targetEntity", selector: entitySelector },
      ])} .computeLabel=${this.computeLabel} @value-changed=${(event: FormChange) => {
        const values = event.detail.value;
        this.fire({
          ...config,
          battery: {
            current: {
              entity: String(values.currentEntity ?? ""),
              value: values.currentValue === "" ? undefined : Number(values.currentValue),
              field: String(values.currentField ?? ""),
            },
            forecast: {
              entity: String(values.forecastEntity ?? ""),
              path: String(values.forecastPath ?? ""),
              startField: String(values.forecastTime ?? ""),
              valueField: String(values.forecastValue ?? ""),
            },
            horizon: { value: values.horizonHours === "" || values.horizonHours === undefined
              ? undefined : Number(values.horizonHours), entity: String(values.horizonEntity ?? ""), unit: "hours" },
            target: {
              value: values.targetValue === "" ? undefined : Number(values.targetValue),
              entity: String(values.targetEntity ?? ""),
            },
          },
        });
      }}></ha-form>

      <h3>${this.t("Timeline")}</h3>
      ${(["plan", "applied", "ev", "solar"] as const).map((track) => {
        const value = config.tracks?.[track] ?? {};
        return html`<p><b>${this.t(track === "applied" ? "Applied sale" : track === "plan" ? "Plan" : track === "solar" ? "Solar forecast" : "EV")}</b></p>
          <ha-form .hass=${this.hass} .data=${{
            entity: value.entity ?? "",
            path: value.path ?? "blocks",
            startField: value.startField ?? "start",
            endField: value.endField ?? "end",
            durationField: value.durationField ?? "",
            valueField: value.valueField ?? "value",
            powerField: value.powerField ?? "power",
            energyField: value.energyField ?? "energy",
            statusField: value.statusField ?? "status",
            unit: value.unit ?? "",
          }} .schema=${this.schemas.get([
            { name: "entity", selector: entitySelector }, { name: "path", selector: textSelector },
            { name: "startField", selector: textSelector }, { name: "endField", selector: textSelector },
            { name: "durationField", selector: textSelector }, { name: "valueField", selector: textSelector },
            { name: "powerField", selector: textSelector }, { name: "energyField", selector: textSelector },
            { name: "statusField", selector: textSelector }, { name: "unit", selector: textSelector },
          ])} .computeLabel=${this.computeLabel} @value-changed=${(event: FormChange) => this.updateTrack(track, event)}></ha-form>`;
      })}

      <h3>${this.t("Plan")}: ${this.t("Summary")}</h3>
      <ha-form .hass=${this.hass} .data=${{
        purchaseEnergyEntity: config.summary?.purchaseEnergy?.entity ?? "",
        purchaseEnergyField: config.summary?.purchaseEnergy?.field ?? "",
        purchaseEnergyValue: config.summary?.purchaseEnergy?.value ?? "",
        purchaseCostEntity: config.summary?.purchaseCost?.entity ?? "",
        purchaseCostField: config.summary?.purchaseCost?.field ?? "",
        purchaseCostValue: config.summary?.purchaseCost?.value ?? "",
        planBlocksEntity: config.planBlocksEntity ?? "",
        planBlocksPath: config.planBlocksPath ?? "blocks",
      }} .schema=${this.schemas.get([
        { name: "purchaseEnergyEntity", selector: entitySelector }, { name: "purchaseEnergyField", selector: textSelector },
        { name: "purchaseEnergyValue", selector: { number: { mode: "box" } } }, { name: "purchaseCostEntity", selector: entitySelector },
        { name: "purchaseCostField", selector: textSelector }, { name: "purchaseCostValue", selector: { number: { mode: "box" } } },
        { name: "planBlocksEntity", selector: entitySelector }, { name: "planBlocksPath", selector: textSelector },
      ])} .computeLabel=${this.computeLabel} @value-changed=${(event: FormChange) => {
        const v = event.detail.value;
        this.fire({
          ...config,
          summary: {
            purchaseEnergy: { entity: String(v.purchaseEnergyEntity ?? ""), field: String(v.purchaseEnergyField ?? ""), value: v.purchaseEnergyValue === "" ? undefined : Number(v.purchaseEnergyValue) },
            purchaseCost: { entity: String(v.purchaseCostEntity ?? ""), field: String(v.purchaseCostField ?? ""), value: v.purchaseCostValue === "" ? undefined : Number(v.purchaseCostValue) },
          },
          planBlocksEntity: String(v.planBlocksEntity ?? ""),
          planBlocksPath: String(v.planBlocksPath ?? ""),
        });
      }}></ha-form>
      <h3>${this.t("Average")}: ${this.t("Price")}: ${this.t("Periods")}</h3>
      <p>${this.t("An end hour before the start spans midnight (local time).")}</p>
      ${(config.periods?.length ? config.periods : [
        { name: "Morning", startHour: 6, endHour: 12 },
        { name: "Afternoon", startHour: 12, endHour: 18 },
        { name: "Evening", startHour: 18, endHour: 24 },
        { name: "Night", startHour: 0, endHour: 6 },
      ].map(period => ({ ...period, name: this.t(period.name) }))).map((period, index) => html`
        <ha-form .hass=${this.hass} .data=${period} .schema=${this.schemas.get([
          { name: "name", selector: textSelector },
          { name: "startHour", selector: { number: { mode: "box", min: 0, max: 23, step: 1 } } },
          { name: "endHour", selector: { number: { mode: "box", min: 0, max: 24, step: 1 } } },
        ])} .computeLabel=${this.computeLabel} @value-changed=${(event: FormChange) => {
          const periods = config.periods?.length ? [...config.periods] : [
            { name: "Morning", startHour: 6, endHour: 12 },
            { name: "Afternoon", startHour: 12, endHour: 18 },
            { name: "Evening", startHour: 18, endHour: 24 },
            { name: "Night", startHour: 0, endHour: 6 },
          ].map(period => ({ ...period, name: this.t(period.name) }));
          periods[index] = {
            name: String(event.detail.value.name ?? period.name),
            startHour: Number(event.detail.value.startHour ?? period.startHour),
            endHour: Number(event.detail.value.endHour ?? period.endHour),
          };
          this.fire({ ...config, periods });
        }}></ha-form>
      `)}
    `;
  }
}
