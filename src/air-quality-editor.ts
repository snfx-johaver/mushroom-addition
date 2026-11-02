import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, HomeAssistant } from "./types";
import type { EditorField } from "./editor-schema";
import { AIR_QUALITY_DEFAULTS, AIR_QUALITY_KINDS, validateAirQuality, type AirQualitySensor } from "./air-quality";
import { localizeText } from "./localize";
import { localizeEditorSchema } from "./localized-schema";

export const airQualityLabels: Record<string, string> = {
  air_quality_show_header: "Show header",
  air_quality_show_title: "Show header title",
  air_quality_show_icon: "Show header icon",
  air_quality_show_badge: "Show air quality indicator",
};
const labels: Record<string, string> = {
  kind: "Reading type", entity: "Sensor", enabled: "Show reading", name: "Label (tooltip)",
  icon: "Icon", color: "Icon color (empty for automatic)", unit: "Display unit", decimals: "Decimal places",
  warning_above: "Warning above", poor_above: "Poor above", bad_above: "Very poor above",
  warning_below: "Warning below", bad_below: "Very poor below",
};
const thresholds = ["warning_above", "poor_above", "bad_above", "warning_below", "bad_below"] as const;
const thresholdUnits = { temperature: "°C", humidity: "%", co2: "ppm", pm25: "µg/m³", voc: "ppb",
  mould: "%", radon: "Bq/m³", pressure: "hPa", custom: "" };

export function airQualitySensorSchema(row: AirQualitySensor): EditorField[] {
  return [
    { name: "enabled", selector: { boolean: {} } },
    { name: "kind", selector: { select: { mode: "dropdown", options: AIR_QUALITY_KINDS.map(kind =>
      ({ value: kind, label: AIR_QUALITY_DEFAULTS[kind].name })) } } },
    { name: "entity", selector: { entity: { domain: ["sensor", "input_number"] } } },
    { name: "name", selector: { text: {} } },
    { name: "icon", selector: { icon: {} } },
    { name: "color", selector: { ui_color: {} } },
    ...(row.kind === "mould" ? [] : [
      { name: "unit", selector: { text: {} } },
      { name: "decimals", selector: { number: { min: 0, max: 3, step: 1, mode: "box" } } },
    ]),
    ...thresholds.map(name => ({ name, selector: { number: { mode: "box", step: "any" } } })),
  ];
}

@customElement("mushroom-addition-air-quality-options")
export class AirQualityEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @state() private draft?: AirQualitySensor[];
  @state() private error = "";
  static styles = css`
    :host { display:block; }
    p { color:var(--secondary-text-color); font-size:13px; }
    [role=alert] { color:var(--error-color); }
    details { border:1px solid var(--divider-color); border-radius:12px; padding:12px; margin:12px 0; }
    summary { cursor:pointer; padding:4px 0; font-weight:500; }
    .tools { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0; }
    button { font:inherit; border:1px solid var(--divider-color); border-radius:8px; padding:8px 12px;
      color:var(--primary-text-color); background:var(--ha-card-background,var(--card-background-color)); cursor:pointer; }
    button:disabled { opacity:.4; cursor:default; }
    button:focus-visible,summary:focus-visible { outline:2px solid var(--primary-color); outline-offset:2px; }
  `;
  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("config")) { this.draft = undefined; this.error = ""; }
  }
  private get rows(): AirQualitySensor[] { return this.draft ?? this.config?.air_quality_sensors ?? []; }
  private save(rows: AirQualitySensor[]): void {
    if (!this.config) return;
    this.draft = rows;
    const config = { ...this.config, air_quality_sensors: rows };
    try { validateAirQuality(config); }
    catch (error) {
      if (!(error instanceof Error)) throw error;
      this.error = error.message;
      return;
    }
    this.error = "";
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
  private changed(event: CustomEvent<{ value: AirQualitySensor }>, index: number): void {
    event.stopPropagation();
    const previous = this.rows[index];
    const next = { ...previous, ...event.detail.value };
    if (next.kind !== previous.kind) {
      for (const key of [...thresholds, "unit", "decimals"] as const) delete next[key];
    }
    for (const key of Object.keys(next) as Array<keyof AirQualitySensor>) {
      if (next[key] === null || next[key] === undefined || (next[key] === "" && key !== "unit")) delete next[key];
    }
    this.save(this.rows.map((row, i) => i === index ? next : row));
  }
  protected render() {
    if (!this.hass || !this.config) return nothing;
    const t = (text: string) => localizeText(this.hass, text);
    return html`
      <p>${t("Add, hide or reorder readings. Tap a reading to open its sensor.")}</p>
      <p>${t("Quality follows the selected entity, or the worst CO₂, PM2.5, VOC or radon reading. This is not a regulatory AQI.")}</p>
      ${this.error ? html`<p role="alert">${this.error}</p>` : nothing}
      ${this.rows.map((row, index) => html`<details>
        <summary>${row.name || t(AIR_QUALITY_DEFAULTS[row.kind]?.name ?? "Sensor")} ${index + 1}</summary>
        <ha-form .hass=${this.hass} .data=${{ enabled: true, ...AIR_QUALITY_DEFAULTS[row.kind], ...row }}
          .schema=${localizeEditorSchema(this.hass, airQualitySensorSchema(row))}
          .computeLabel=${(field: EditorField) => `${t(labels[field.name] ?? field.name)}${thresholds.some(key => key === field.name) && thresholdUnits[row.kind] ? ` (${thresholdUnits[row.kind]})` : ""}`}
          @value-changed=${(event: CustomEvent<{ value: AirQualitySensor }>) => this.changed(event, index)}></ha-form>
        <p>${t("Thresholds use the units shown. Unsupported units disable automatic colors and quality ratings, not readings.")}</p>
        <div class="tools">
          <button ?disabled=${index === 0} @click=${() => {
            const rows = [...this.rows]; [rows[index - 1], rows[index]] = [rows[index], rows[index - 1]]; this.save(rows);
          }}>${t("Move up")}</button>
          <button ?disabled=${index === this.rows.length - 1} @click=${() => {
            const rows = [...this.rows]; [rows[index + 1], rows[index]] = [rows[index], rows[index + 1]]; this.save(rows);
          }}>${t("Move down")}</button>
          <button @click=${() => this.save(this.rows.filter((_, i) => i !== index))}>${t("Remove")}</button>
        </div>
      </details>`)}
      <button @click=${() => this.save([...this.rows, { kind: "custom" }])}>${t("Add sensor")}</button>
    `;
  }
}
