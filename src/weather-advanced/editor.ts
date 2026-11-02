import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, HomeAssistant } from "../types";
import type { EditorField } from "../editor-schema";
import { WEATHER_OPTIONS, weatherDefaults, weatherLabels, validateWeatherOptions, type WeatherAdvancedOptions } from "./config";

@customElement("mushroom-addition-weather-options")
export class WeatherAdvancedEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @property({ type: String }) public section: "layout" | "features" = "features";
  @state() private error = "";
  @state() private draft?: WeatherAdvancedOptions;
  private schemaKey = "";
  private schemas: Array<{ title: string; fields: EditorField[] }> = [];
  private readonly computeLabel = (field: EditorField) => {
    const labels = weatherLabels(this.hass);
    const key = `editor.${field.name}`;
    const label = labels.t(key);
    return label === key ? field.name.replaceAll("_", " ").replace(/^./, character => character.toUpperCase()) : label;
  };
  private readonly computeHelper = (field: EditorField) => {
    const key = `editor.${field.name}_helper`;
    const help = weatherLabels(this.hass).t(key);
    return help === key ? undefined : help;
  };
  static styles = css`
    :host { display: block; }
    h3 { margin: 16px 0 4px; font-size: 15px; }
    [role=alert] { color: var(--error-color); }
  `;
  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("config")) { this.draft = undefined; this.error = ""; }
    const key = `${this.hass?.language}|${this.section}`;
    if (key === this.schemaKey) return;
    this.schemaKey = key;
    const labels = weatherLabels(this.hass);
    const groups = this.section === "layout" ? ["appearance"] as const : ["details", "forecast", "clock", "sensors"] as const;
    this.schemas = groups.map(group => ({
      title: labels.t(`editor.section_${group}`),
      fields: WEATHER_OPTIONS[group].map(({ field }) => {
        if (!field.selector?.select) return field;
        const select = field.selector.select as { mode: string; options: string[] };
        return { ...field, selector: { select: { ...select, options: select.options.map(value => {
          const key = `editor.${field.name}_${value}`;
          const label = field.name === "language" && value !== "auto"
            ? new Intl.DisplayNames([this.hass?.language || "en"], { type: "language" }).of(value) ?? value
            : labels.t(key);
          return { value, label: label === key ? value : label };
        }) } } };
      }),
    }));
  }
  private readonly changed = (event: CustomEvent<{ value: WeatherAdvancedOptions }>): void => {
    event.stopPropagation();
    if (!this.config) return;
    const options = { ...this.config.weather, ...event.detail.value };
    for (const key of Object.keys(options) as Array<keyof WeatherAdvancedOptions>) {
      if (options[key] === "" || options[key] === null || options[key] === undefined) delete options[key];
    }
    this.draft = options;
    try { validateWeatherOptions(options); }
    catch (error) {
      if (!(error instanceof Error)) throw error;
      this.error = error.message;
      return;
    }
    this.error = "";
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: { ...this.config, weather: options } }, bubbles: true, composed: true,
    }));
  };
  protected render() {
    if (!this.config || !this.hass) return nothing;
    const data = { ...weatherDefaults, ...(this.draft ?? this.config.weather) };
    return html`${this.error ? html`<p role="alert">${this.error}</p>` : nothing}
      ${this.schemas.map(group => html`<h3>${group.title}</h3>
        <ha-form .hass=${this.hass} .data=${data} .schema=${group.fields}
          .computeLabel=${this.computeLabel} .computeHelper=${this.computeHelper}
          @value-changed=${this.changed}></ha-form>`)}`;
  }
}
