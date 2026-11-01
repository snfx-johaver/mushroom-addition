import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./types";
import type { EditorField } from "./editor-schema";
import { EditorSchemaCache } from "./editor-schema";
import { ENERGY_LOG_EDITOR_TAG, validateEnergyLogConfig } from "./energy-log-config";
import type { EnergyLogCategory, EnergyLogConfig, EnergyLogSource } from "./energy-log-config";

type FormChange = CustomEvent<{ value: Record<string, unknown> }>;
const field = (name: string, selector: Record<string, unknown> = { text: {} }): EditorField => ({ name, selector });

const labels: Record<string, string> = {
  title: "Title", subtitle: "Subtitle", icon: "Icon", limit: "Entry limit", sortOrder: "Sort order",
  timeZone: "Time zone (IANA)", clockFormat: "Clock format", showSource: "Show source disclosures",
  footer: "Footer note", emptyState: "Empty state message", id: "Stable ID", entity: "Entity",
  adapter: "Data source", path: "Attribute / JSON path", timestampField: "Timestamp field",
  categoryField: "Category ID field", titleField: "Headline field", detailField: "Detail field",
  descriptionField: "Description field", sourceField: "Source disclosure field", label: "Label",
  color: "Color (CSS value)",
};

@customElement(ENERGY_LOG_EDITOR_TAG)
export class MushroomEnergyLogEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public _config?: EnergyLogConfig;
  @state() private config?: EnergyLogConfig;
  @state() private error = "";
  private readonly schemas = new EditorSchemaCache();
  private readonly computeLabel = (item: EditorField): string => labels[item.name] ?? item.name;

  public setConfig(config: EnergyLogConfig): void {
    this.config = structuredClone(config);
    this.error = "";
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("_config") && this._config) this.setConfig(this._config);
  }

  private commit(config: EnergyLogConfig): void {
    this.config = config;
    try {
      validateEnergyLogConfig(config);
      this.error = "";
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config: structuredClone(config) }, bubbles: true, composed: true,
      }));
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      this.error = error.message;
    }
  }

  private form(data: Record<string, unknown>, schema: EditorField[], changed: (value: Record<string, unknown>) => void) {
    return html`<ha-form .hass=${this.hass} .data=${data} .schema=${this.schemas.get(schema)}
      .computeLabel=${this.computeLabel}
      @value-changed=${(event: FormChange) => {
        event.stopPropagation();
        changed({ ...data, ...event.detail.value });
      }}></ha-form>`;
  }

  private controls(label: string, remove: () => void, moveUp?: () => void, moveDown?: () => void) {
    return html`<div class="controls">
      ${moveUp ? html`<button type="button" aria-label=${`Move ${label} up`} @click=${moveUp}>↑</button>` : nothing}
      ${moveDown ? html`<button type="button" aria-label=${`Move ${label} down`} @click=${moveDown}>↓</button>` : nothing}
      <button type="button" @click=${remove}>Remove ${label}</button>
    </div>`;
  }

  private move<T>(items: T[], index: number, direction: number): T[] {
    const updated = [...items];
    [updated[index], updated[index + direction]] = [updated[index + direction], updated[index]];
    return updated;
  }

  protected render() {
    const config = this.config;
    if (!config) return nothing;
    const sources = config.sources ?? [];
    const categories = config.categories ?? [];
    return html`
      ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}
      <section><h3>Card</h3>
        ${this.form({
          title: config.title ?? "Energy Log", subtitle: config.subtitle ?? "", icon: config.icon ?? "",
          limit: config.limit ?? 50, sortOrder: config.sortOrder ?? "newest",
          timeZone: config.timeZone ?? "", clockFormat: config.clockFormat ?? "24",
          showSource: config.showSource !== false, footer: config.footer ?? "",
          emptyState: config.emptyState ?? "",
        }, [
          field("title"), field("subtitle"), field("icon", { icon: {} }),
          field("limit", { number: { mode: "box", min: 1, max: 500, step: 1 } }),
          field("sortOrder", { select: { mode: "dropdown", options: ["newest", "oldest"] } }),
          field("timeZone"), field("clockFormat", { select: { mode: "dropdown", options: ["24", "12"] } }),
          field("showSource", { boolean: {} }), field("footer", { text: { multiline: true } }),
          field("emptyState"),
        ], value => this.commit({
          ...config, title: String(value.title ?? ""), subtitle: String(value.subtitle ?? ""),
          icon: String(value.icon ?? ""), limit: Number(value.limit),
          sortOrder: value.sortOrder === "oldest" ? "oldest" : "newest",
          timeZone: String(value.timeZone ?? ""),
          clockFormat: value.clockFormat === "12" ? "12" : "24",
          showSource: value.showSource !== false, footer: String(value.footer ?? ""),
          emptyState: String(value.emptyState ?? ""),
        }))}
        <p>Choose an IANA time zone such as Europe/Amsterdam. Leave it blank to use Home Assistant's configured zone.</p>
      </section>
      <section><h3>Sources</h3>
        <p>Each source contains a list of timestamped objects in an entity attribute or JSON state. Sources are read-only.</p>
        ${sources.map((source, index) => html`<details open>
          <summary>${source.id || `Source ${index + 1}`}</summary>
          ${this.form({
            id: source.id, entity: source.entity, adapter: source.adapter ?? "attribute", path: source.path ?? "",
            timestampField: source.timestampField ?? "timestamp", categoryField: source.categoryField ?? "category",
            titleField: source.titleField ?? "title", detailField: source.detailField ?? "detail",
            descriptionField: source.descriptionField ?? "description", sourceField: source.sourceField ?? "source",
          }, [
            field("id"), field("entity", { entity: {} }),
            field("adapter", { select: { mode: "dropdown", options: ["attribute", "state"] } }),
            field("path"), field("timestampField"), field("categoryField"), field("titleField"),
            field("detailField"), field("descriptionField"), field("sourceField"),
          ], value => {
            const updated: EnergyLogSource = {
              id: String(value.id ?? ""), entity: String(value.entity ?? ""),
              adapter: value.adapter === "state" ? "state" : "attribute", path: String(value.path ?? ""),
              timestampField: String(value.timestampField ?? ""), categoryField: String(value.categoryField ?? ""),
              titleField: String(value.titleField ?? ""), detailField: String(value.detailField ?? ""),
              descriptionField: String(value.descriptionField ?? ""), sourceField: String(value.sourceField ?? ""),
            };
            this.commit({ ...config, sources: sources.map((item, i) => i === index ? updated : item) });
          })}
          ${this.controls(`source ${index + 1}`,
            () => this.commit({ ...config, sources: sources.filter((_, i) => i !== index) }),
            index > 0 ? () => this.commit({ ...config, sources: this.move(sources, index, -1) }) : undefined,
            index < sources.length - 1 ? () => this.commit({ ...config, sources: this.move(sources, index, 1) }) : undefined)}
        </details>`)}
        <button type="button" @click=${() => this.commit({ ...config, sources: [...sources, {
          id: `source_${sources.length + 1}`, entity: "", adapter: "attribute", path: "entries",
          timestampField: "timestamp", categoryField: "category", titleField: "title", detailField: "detail",
          descriptionField: "description", sourceField: "source",
        }] })}>Add source</button>
      </section>
      <section><h3>Categories and filters</h3>
        <p>Category IDs in source entries must match one of these IDs. The All chip is built in.</p>
        ${categories.map((category, index) => html`<details open>
          <summary>${category.label || `Category ${index + 1}`}</summary>
          ${this.form({ id: category.id, label: category.label, color: category.color ?? "", icon: category.icon ?? "" }, [
            field("id"), field("label"), field("color"), field("icon", { icon: {} }),
          ], value => {
            const updated: EnergyLogCategory = {
              id: String(value.id ?? ""), label: String(value.label ?? ""),
              color: String(value.color ?? ""), icon: String(value.icon ?? ""),
            };
            this.commit({ ...config, categories: categories.map((item, i) => i === index ? updated : item) });
          })}
          ${this.controls(`category ${index + 1}`,
            () => this.commit({ ...config, categories: categories.filter((_, i) => i !== index) }),
            index > 0 ? () => this.commit({ ...config, categories: this.move(categories, index, -1) }) : undefined,
            index < categories.length - 1 ? () => this.commit({ ...config, categories: this.move(categories, index, 1) }) : undefined)}
        </details>`)}
        <button type="button" @click=${() => this.commit({ ...config, categories: [...categories, {
          id: `category_${categories.length + 1}`, label: "New category", color: "var(--primary-color)", icon: "",
        }] })}>Add category</button>
      </section>`;
  }

  public static styles = css`
    :host { display: block; color: var(--primary-text-color); }
    section { margin: 16px 0; } h3 { margin: 20px 0 6px; font-size: 15px; }
    p { color: var(--secondary-text-color); font-size: 12px; line-height: 1.5; }
    details { border: 1px solid var(--divider-color); border-radius: 10px; padding: 10px; margin: 10px 0; }
    summary { cursor: pointer; font-weight: 600; } ha-form { display: block; margin-top: 8px; }
    button { border: 1px solid var(--divider-color); border-radius: 8px; padding: 7px 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button:focus-visible, summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .controls { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .error { border: 1px solid var(--error-color); border-radius: 8px; color: var(--error-color); padding: 10px; }
  `;
}
