import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, HomeAssistant } from "./types";
import { CATALOG, getCatalogItem } from "./catalog";
import { fireEvent } from "./helpers";
import { localize } from "./localize";

const actionSchema = (name: string) => ({ name, selector: { ui_action: {} } });

@customElement("mushroom-addition-editor")
export class MushroomAdditionEditor extends LitElement {
  public static styles = css`
    .chips { display: grid; gap: 12px; }
    .chip-row {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) minmax(150px, 1fr) auto;
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
    this.config = config;
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
            <input
              aria-label="Entity ID"
              placeholder="sensor.example"
              .value=${chip.entity ?? ""}
              @change=${(event: Event) => this.updateChip(index, "entity", (event.target as HTMLInputElement).value)}
            />
            <button class="remove" @click=${() => this.removeChip(index)} aria-label="Remove chip">Remove</button>
          </div>
        `)}
        <button @click=${this.addChip}>Add chip</button>
      </div>`;
    }
    const schema: Array<Record<string, unknown>> = [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "secondary", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "icon_color", selector: { ui_color: {} } },
      { name: "entities", selector: { entity: { multiple: true } } },
    ];
    if (item?.variants?.length) {
      schema.push({
        name: "variant",
        selector: { select: { options: item.variants, mode: "dropdown" } },
      });
    }
    schema.push(
      { name: "layout", selector: { select: { options: ["horizontal", "vertical"] } } },
      { name: "show_icon", selector: { boolean: {} } },
      { name: "show_state", selector: { boolean: {} } },
      actionSchema("tap_action"),
      actionSchema("hold_action"),
      actionSchema("double_tap_action"),
    );
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${schema}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  private readonly computeLabel = (schema: { name: string }): string =>
    localize(this.hass, schema.name);

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

  private updateChip(index: number, key: "type" | "entity", value: string): void {
    if (!this.config) return;
    this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).map((chip, chipIndex) =>
        chipIndex === index ? { ...chip, [key]: value || undefined } : chip),
    };
    fireEvent(this, "config-changed", { config: this.config });
  }
}

export const assertEditorCoverage = (): boolean =>
  CATALOG.every(() => customElements.get("mushroom-addition-editor") !== undefined);
