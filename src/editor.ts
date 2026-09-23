import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, HomeAssistant } from "./types";
import { CATALOG, getCatalogItem, LEGACY_ALIASES } from "./catalog";
import { fireEvent } from "./helpers";
import { editorHelper, localize } from "./localize";
import { editorSchemaFor, upstreamEditorSchemaFor } from "./editor-schema";
import { populatedDefaultsFor } from "./defaults";

@customElement("mushroom-addition-editor")
export class MushroomAdditionEditor extends LitElement {
  public static styles = css`
    .chips { display: grid; gap: 12px; }
    .chip-row {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) minmax(130px, 1fr) minmax(150px, 1fr) auto;
      align-items: center;
      gap: 8px;
    }
    select, input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 0 10px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    button {
      min-height: 40px;
      border: 0;
      border-radius: 4px;
      padding: 0 12px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      cursor: pointer;
    }
    .remove { background: var(--error-color); }
  `;
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: AdditionConfig;

  public setConfig(config: AdditionConfig): void {
    const tag = config.type.replace(/^custom:/, "");
    const alias = LEGACY_ALIASES.find((item) => item.tag === tag);
    const normalizedChips = config.chips?.map((chip) => {
      const chipAlias = LEGACY_ALIASES.find((item) => item.tag === chip.type.replace(/^custom:/, ""));
      return chipAlias
        ? {
          ...chip,
          type: `custom:${chipAlias.targetTag}`,
          variant: chip.variant ?? chipAlias.variant,
        }
        : chip;
    });
    this.config = {
      ...config,
      variant: config.variant ?? alias?.variant,
      chips: normalizedChips,
    };
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const item = getCatalogItem(this.config.type.replace(/^custom:/, ""));
    if (item?.kind === "container") {
      const chipTypes = CATALOG.filter((entry) => entry.kind === "chip");
      return html`<div class="chips">
        ${(this.config.chips ?? []).map((chip, index) => html`
          <div class="chip-row">
            <select
              aria-label="Chip type"
              .value=${chip.type}
              @change=${(event: Event) => this.updateChip(index, "type", (event.target as HTMLSelectElement).value)}
            >
              ${chipTypes.map((entry) => html`
                <option value=${`custom:${entry.tag}`} ?selected=${chip.type === `custom:${entry.tag}`}>
                  ${entry.name}
                </option>
              `)}
            </select>
            ${(() => {
              const descriptor = getCatalogItem(chip.type.replace(/^custom:/, ""));
              return descriptor?.variants?.length ? html`
                <select
                  aria-label="Chip style"
                  .value=${chip.variant ?? descriptor.variants[0]}
                  @change=${(event: Event) => this.updateChip(index, "variant", (event.target as HTMLSelectElement).value)}
                >
                  ${descriptor.variants.map((variant) => html`
                    <option value=${variant} ?selected=${chip.variant === variant}>
                      ${descriptor.variantLabels?.[variant] ?? variant}
                    </option>
                  `)}
                </select>
              ` : html`<span></span>`;
            })()}
            <ha-entity-picker
              .hass=${this.hass}
              aria-label="Entity ID"
              .value=${chip.entity ?? ""}
              .includeDomains=${getCatalogItem(chip.type.replace(/^custom:/, ""))?.preferredDomains}
              @value-changed=${(event: CustomEvent<{ value?: string }>) => this.updateChip(index, "entity", event.detail.value ?? "")}
            ></ha-entity-picker>
            <button class="remove" @click=${() => this.removeChip(index)} aria-label="Remove chip">Remove</button>
          </div>
        `)}
        <button @click=${this.addChip}>Add chip</button>
      </div>`;
    }
    if (!item) return nothing;
    const schema = editorSchemaFor(item, this.config);
    const upstreamSchema = upstreamEditorSchemaFor(item, this.config);
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
    localize(this.hass, schema.name);

  private readonly computeHelper = (schema: { name: string }): string | undefined =>
    editorHelper(schema.name);

  private readonly valueChanged = (event: CustomEvent): void => {
    if (!this.config || !event.detail.value) return;
    const value = event.detail.value as Record<string, unknown>;
    const next = { ...this.config, ...value } as AdditionConfig;
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  };

  private readonly addChip = (): void => {
    if (!this.config) return;
    const first = CATALOG.find((item) => item.kind === "chip");
    if (!first) return;
    this.config = {
      ...this.config,
      chips: [...(this.config.chips ?? []), { type: `custom:${first.tag}`, show_icon: true, show_state: true }],
    };
    fireEvent(this, "config-changed", { config: this.config });
  };

  private removeChip(index: number): void {
    if (!this.config) return;
    this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).filter((_, chipIndex) => chipIndex !== index),
    };
    fireEvent(this, "config-changed", { config: this.config });
  }

  private updateChip(index: number, key: "type" | "entity" | "variant", value: string): void {
    if (!this.config) return;
    this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).map((chip, chipIndex) =>
        chipIndex === index
          ? key === "type"
            ? {
              ...chip,
              type: value,
              variant: getCatalogItem(value.replace(/^custom:/, ""))?.variants?.[0],
            }
            : { ...chip, [key]: value || undefined }
          : chip),
    };
    fireEvent(this, "config-changed", { config: this.config });
  }
}

export const assertEditorCoverage = (): boolean =>
  CATALOG.every(() => customElements.get("mushroom-addition-editor") !== undefined);
