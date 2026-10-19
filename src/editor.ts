import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, AdditionItemConfig, HomeAssistant, WasteStreamConfig } from "./types";
import { CATALOG, getCatalogItem, LEGACY_ALIASES } from "./catalog";
import { fireEvent } from "./helpers";
import { editorHelper, localize } from "./localize";
import { additionalEditorSchemaFor, editorSchemaFor } from "./editor-schema";
import { populatedDefaultsFor } from "./defaults";
import { wasteStreamsForConfig } from "./waste-streams";
import { PERSON_INFO_RELATED_FIELDS, personInfoDefaultsFor } from "./person-info-defaults";
import { sceneItemDefaultsFor } from "./scene-item-defaults";

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
    .field > small { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
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
    const upstreamSchema = additionalEditorSchemaFor(item, this.config).filter((field) =>
      item.upstreamId !== "custom_card_trash" ||
      (!field.name.startsWith("ulm_card_datum_") && !field.name.includes("ophaling")));
    const contextualDefaults = item.upstreamId === "custom_card_person_info"
      ? personInfoDefaultsFor(this.hass, this.config.entity)
      : {};
    const formData = {
      ...populatedDefaultsFor(item, this.hass, this.config.entity),
      ...contextualDefaults,
      ...this.config,
    };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${formData}
        .schema=${schema}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      ${item.upstreamId === "custom_card_trash"
        ? this.renderWasteStreamEditor()
        : item.family === "scene"
        ? this.renderItemEditor(
          "scene_items",
          "Scene buttons",
          item.upstreamId === "card_welcome_scenes" ? undefined : ["scene"],
        )
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
    this.config?.type.includes("custom-card-trash") && schema.name === "entity"
      ? "Optional card entity"
      : localize(this.hass, schema.name);

  private readonly computeHelper = (schema: { name: string }): string | undefined =>
    editorHelper(schema.name);

  private readonly valueChanged = (event: CustomEvent): void => {
    if (!this.config || !event.detail.value) return;
    const value = event.detail.value as Record<string, unknown>;
    const next = { ...this.config, ...value } as AdditionConfig;
    const item = getCatalogItem(this.config.type.replace(/^custom:/, ""));
    if (
      item?.upstreamId === "custom_card_person_info" &&
      typeof value.entity === "string" &&
      value.entity !== this.config.entity
    ) {
      const defaults = personInfoDefaultsFor(this.hass, value.entity);
      for (const field of PERSON_INFO_RELATED_FIELDS) {
        if (defaults[field] !== undefined) Object.assign(next, { [field]: defaults[field] });
        else delete next[field];
      }
      if (this.config.icon_type === undefined) next.icon_type = defaults.icon_type;
    }
    if (
      Object.prototype.hasOwnProperty.call(value, "name") &&
      JSON.stringify(value.name) !== JSON.stringify(this.config.name)
    ) {
      delete next.name_mode;
    }
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
    const items: AdditionItemConfig[] = (configuredItems.length
      ? configuredItems
      : (this.config.entities ?? []).map((entity) => ({ entity })))
      .map((item) => key === "scene_items"
        ? { ...sceneItemDefaultsFor(this.hass, item.entity), ...item }
        : item);
    return html`
      <section class="item-editor">
        <h3>${title}</h3>
        <p>Each button starts with sensible values from its entity. You can override every value, including its name.</p>
        ${items.map((item, index) => html`
          <div class="item-row">
            <label class="field wide">
              <span>Button entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: domains?.length ? { domain: domains } : {} }}
                .value=${item.entity}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "entity", event.detail.value)}
              ></ha-selector>
              <small>${key === "scene_items"
                ? "Select the entity this button controls. Welcome Scenes supports every Home Assistant domain."
                : "Select the entity represented by this room sensor button."}</small>
            </label>
            <label class="field">
              <span>Custom name</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${item.name ?? item.label ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateItem(key, index, "name", event.detail.value)}
              ></ha-selector>
              <small>Text shown below the button. Change it independently for every button.</small>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${item.icon}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "icon", event.detail.value)}
              ></ha-selector>
              <small>Defaults to the entity icon or a suitable icon for its domain.</small>
            </label>
            ${key === "room_sensors" || key === "scene_items" ? html`
              <label class="field item-icon-type">
                <span>Icon type</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ select: {
                    mode: "dropdown",
                    options: [
                      { value: "icon", label: "Icon" },
                      { value: "entity-picture", label: "Entity picture" },
                    ],
                  } }}
                  .value=${item.icon_type ?? "icon"}
                  @value-changed=${(event: CustomEvent) =>
                    this.updateItem(key, index, "icon_type", event.detail.value)}
                ></ha-selector>
                <small>Show the selected icon or the entity picture when one is available.</small>
              </label>
            ` : nothing}
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: key === "room_sensors" ? "blue" : "purple" } }}
                .value=${item.color}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "color", event.detail.value)}
              ></ha-selector>
              <small>Accent color used by the button and its active state.</small>
            </label>
            <label class="field">
              <span>Active when state is</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${item.active_state ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateItem(key, index, "active_state", event.detail.value)}
              ></ha-selector>
              <small>Optional entity state that highlights this button as active.</small>
            </label>
            <label class="field">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${item.tap_action}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "tap_action", event.detail.value)}
              ></ha-selector>
              <small>Defaults to activating scenes and toggling other supported entities.</small>
            </label>
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
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${stream.label ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateWasteStream(index, "label", event.detail.value)}
              ></ha-selector>
            </label>
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
                .selector=${{ ui_color: { default_color: "green" } }}
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
    if (key === "scene_items" && field === "entity" && typeof value === "string") {
      const current = items[index];
      const oldDefaults = sceneItemDefaultsFor(this.hass, current.entity);
      const newDefaults = sceneItemDefaultsFor(this.hass, value);
      const next = { ...current, entity: value };
      for (const defaultField of ["name", "icon", "icon_type", "color", "active_state", "tap_action"] as const) {
        if (
          current[defaultField] === undefined ||
          JSON.stringify(current[defaultField]) === JSON.stringify(oldDefaults[defaultField])
        ) {
          Object.assign(next, { [defaultField]: newDefaults[defaultField] });
        }
      }
      items[index] = next;
    } else {
      items[index] = { ...items[index], [field]: value || undefined };
    }
    this.updateItems(key, items);
  }

  private addItem(key: "scene_items" | "room_sensors"): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))];
    const defaultEntity = key === "scene_items"
      ? Object.keys(this.hass?.states ?? {}).find((entityId) => entityId.startsWith("scene.")) ?? ""
      : "";
    items.push(key === "scene_items"
      ? sceneItemDefaultsFor(this.hass, defaultEntity)
      : { entity: "" });
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
