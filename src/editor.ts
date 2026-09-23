import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, AdditionItemConfig, HomeAssistant, WasteStreamConfig } from "./types";
import { CATALOG, getCatalogItem, LEGACY_ALIASES } from "./catalog";
import { fireEvent } from "./helpers";
import { editorHelper, localize } from "./localize";
import { editorSchemaFor, upstreamEditorSchemaFor } from "./editor-schema";
import { populatedDefaultsFor } from "./defaults";
import { wasteStreamsForConfig } from "./waste-streams";

@customElement("mushroom-addition-editor")
export class MushroomAdditionEditor extends LitElement {
  public static styles = css`
    :host { display: block; }
    .item-editor { margin-top: 16px; }
    .item-editor h3 { margin: 0 0 8px; font-size: 15px; }
    .item-editor p { margin: 0 0 12px; color: var(--secondary-text-color); font-size: 12px; }
    .item-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 10px; padding: 12px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .item-row ha-selector, .item-row ha-textfield { min-width: 0; }
    .item-row .wide { grid-column: 1 / -1; }
    .item-row h4 { grid-column: 1 / -1; margin: 0; font-size: 13px; }
    .field { display: grid; gap: 5px; }
    .field > span { color: var(--secondary-text-color); font-size: 11px; }
    .item-actions { display: flex; justify-content: flex-end; gap: 8px; }
    button { border: 0; border-radius: 10px; padding: 8px 12px; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button.add { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  `;
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: AdditionConfig;

  public setConfig(config: AdditionConfig): void {
    const tag = config.type.replace(/^custom:/, "");
    const alias = LEGACY_ALIASES.find((item) => item.tag === tag);
    this.config = {
      ...config,
      variant: config.variant ?? alias?.variant,
    };
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const item = getCatalogItem(this.config.type.replace(/^custom:/, ""));
    if (!item) return nothing;
    const schema = editorSchemaFor(item, this.config);
    const upstreamSchema = upstreamEditorSchemaFor(item, this.config).filter((field) =>
      item.upstreamId !== "custom_card_afvalophaling" ||
      (!field.name.startsWith("ulm_card_datum_") && !field.name.includes("ophaling")));
    const formData = { ...populatedDefaultsFor(item, this.hass, this.config.entity), ...this.config };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${formData}
        .schema=${schema}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      ${item.upstreamId === "custom_card_afvalophaling"
        ? this.renderWasteStreamEditor()
        : item.family === "scene"
        ? this.renderItemEditor("scene_items", "Scene buttons", ["scene"])
        : item.upstreamId === "card_room"
          ? this.renderItemEditor("room_sensors", "Room sensor buttons")
          : nothing}
      ${upstreamSchema.length ? html`
        <ha-expansion-panel outlined>
          <span slot="header">Additional appearance and controls (${upstreamSchema.length})</span>
          <ha-form
            .hass=${this.hass}
            .data=${formData}
            .schema=${upstreamSchema}
            .computeLabel=${this.computeLabel}
            .computeHelper=${this.computeHelper}
            @value-changed=${this.valueChanged}
          ></ha-form>
        </ha-expansion-panel>
      ` : nothing}
    `;
  }

  private readonly computeLabel = (schema: { name: string }): string =>
    this.config?.type.includes("custom-card-afvalophaling") && schema.name === "entity"
      ? "Optional card action entity"
      : localize(this.hass, schema.name);

  private readonly computeHelper = (schema: { name: string }): string | undefined =>
    editorHelper(schema.name);

  private readonly valueChanged = (event: CustomEvent): void => {
    if (!this.config || !event.detail.value) return;
    const value = event.detail.value as Record<string, unknown>;
    const next = { ...this.config, ...value } as AdditionConfig;
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  };

  private renderItemEditor(
    key: "scene_items" | "room_sensors",
    title: string,
    domains?: string[],
  ) {
    if (!this.config) return nothing;
    const configuredItems = this.config[key] ?? [];
    const items: AdditionItemConfig[] = configuredItems.length
      ? configuredItems
      : (this.config.entities ?? []).map((entity) => ({ entity }));
    return html`
      <section class="item-editor">
        <h3>${title}</h3>
        <p>Configure each button with a clear entity, label, icon, color, active state and action.</p>
        ${items.map((item, index) => html`
          <div class="item-row">
            <ha-selector
              class="wide"
              .hass=${this.hass}
              .selector=${{ entity: domains?.length ? { domain: domains } : {} }}
              .value=${item.entity}
              @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "entity", event.detail.value)}
            ></ha-selector>
            <ha-textfield
              label="Label"
              .value=${item.name ?? item.label ?? ""}
              @input=${(event: Event) => this.updateItem(key, index, "name", (event.target as HTMLInputElement).value)}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ icon: {} }}
              .value=${item.icon}
              @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "icon", event.detail.value)}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_color: {} }}
              .value=${item.color}
              @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "color", event.detail.value)}
            ></ha-selector>
            <ha-textfield
              label="Active when state is"
              .value=${item.active_state ?? ""}
              @input=${(event: Event) => this.updateItem(key, index, "active_state", (event.target as HTMLInputElement).value)}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_action: {} }}
              .value=${item.tap_action}
              @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "tap_action", event.detail.value)}
            ></ha-selector>
            <div class="item-actions wide">
              <button @click=${() => this.removeItem(key, index)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(key)}>Add button</button>
      </section>
    `;
  }

  private renderWasteStreamEditor() {
    if (!this.config) return nothing;
    const streams = wasteStreamsForConfig(this.config);
    return html`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${streams.map((stream, index) => html`
          <div class="item-row waste-stream-row" data-stream-index=${index}>
            <h4>${stream.label || `Waste stream ${index + 1}`}</h4>
            <label class="field">
              <span>Show this waste stream</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ boolean: {} }}
                .value=${stream.enabled !== false}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "enabled", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Collection date entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "calendar"] } }}
                .value=${stream.entity}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "entity", event.detail.value)}
              ></ha-selector>
            </label>
            <ha-textfield
              label="Label"
              .value=${stream.label ?? ""}
              @input=${(event: Event) => this.updateWasteStream(index, "label", (event.target as HTMLInputElement).value)}
            ></ha-textfield>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${stream.icon}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "icon", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: {} }}
                .value=${stream.color}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "color", event.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveWasteStream(index, -1)}>Move up</button>
              <button ?disabled=${index === streams.length - 1} @click=${() => this.moveWasteStream(index, 1)}>Move down</button>
              <button @click=${() => this.removeWasteStream(index)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addWasteStream}>Add waste stream</button>
      </section>
    `;
  }

  private updateItem(
    key: "scene_items" | "room_sensors",
    index: number,
    field: keyof AdditionItemConfig,
    value: unknown,
  ): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))];
    items[index] = { ...items[index], [field]: value || undefined };
    this.updateItems(key, items);
  }

  private addItem(key: "scene_items" | "room_sensors"): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))];
    items.push({ entity: "" });
    this.updateItems(key, items);
  }

  private removeItem(key: "scene_items" | "room_sensors", index: number): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))]
      .filter((_, itemIndex) => itemIndex !== index);
    this.updateItems(key, items);
  }

  private updateItems(key: "scene_items" | "room_sensors", items: AdditionItemConfig[]): void {
    if (!this.config) return;
    const next = { ...this.config, [key]: items, entities: undefined };
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  private updateWasteStream(index: number, field: keyof WasteStreamConfig, value: unknown): void {
    if (!this.config) return;
    const streams = wasteStreamsForConfig(this.config);
    streams[index] = {
      ...streams[index],
      [field]: field === "enabled" ? value !== false : value || undefined,
    };
    this.updateWasteStreams(streams);
  }

  private readonly addWasteStream = (): void => {
    if (!this.config) return;
    this.updateWasteStreams([
      ...wasteStreamsForConfig(this.config),
      { enabled: true, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" },
    ]);
  };

  private removeWasteStream(index: number): void {
    if (!this.config) return;
    this.updateWasteStreams(wasteStreamsForConfig(this.config).filter((_, streamIndex) => streamIndex !== index));
  }

  private moveWasteStream(index: number, direction: -1 | 1): void {
    if (!this.config) return;
    const streams = wasteStreamsForConfig(this.config);
    const target = index + direction;
    if (target < 0 || target >= streams.length) return;
    [streams[index], streams[target]] = [streams[target], streams[index]];
    this.updateWasteStreams(streams);
  }

  private updateWasteStreams(streams: WasteStreamConfig[]): void {
    if (!this.config) return;
    const next = { ...this.config, waste_streams: streams };
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

}

export const assertEditorCoverage = (): boolean =>
  CATALOG.every(() => customElements.get("mushroom-addition-editor") !== undefined);
