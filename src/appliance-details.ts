import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./types";

interface EntitiesCard extends HTMLElement {
  hass?: HomeAssistant;
}
type CardHelpers = {
  createCardElement(config: { type: "entities"; entities: string[]; show_header_toggle: false }): EntitiesCard | Promise<EntitiesCard>;
};

@customElement("mushroom-addition-appliance-details")
export class ApplianceDetails extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entities: string[] = [];
  @property() public label = "Settings & diagnostics";
  @state() private open = false;
  @state() private card?: EntitiesCard;
  @state() private error?: string;
  private generation = 0;
  private loading = false;

  static styles = css`
    :host { display: block; min-width: 0; }
    summary { display: flex; align-items: center; gap: 8px; list-style: none; cursor: pointer; border-radius: 8px; }
    summary::-webkit-details-marker { display: none; }
    summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    slot { display: contents; }
    ::slotted(*) { flex: 1; min-width: 0; }
    ha-icon { flex: 0 0 36px; width: 36px; height: 36px; display: grid; place-items: center; color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    details[open] ha-icon { transform: rotate(180deg); }
    .content { --ha-card-border-width: 0px; --ha-card-box-shadow: none; --ha-card-background: transparent; }
    .error { color: var(--error-color); }
  `;

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("entities")) {
      this.generation++;
      this.loading = false;
      this.card = undefined;
      this.error = undefined;
      if (this.open) void this.load();
    }
    if (this.card) this.card.hass = this.hass;
  }

  private async load(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    const generation = ++this.generation;
    try {
      const loader = (window as Window & { loadCardHelpers?: () => Promise<CardHelpers> }).loadCardHelpers;
      if (!loader) throw new Error("Home Assistant card helpers are unavailable.");
      const helpers = await loader();
      const card = await helpers.createCardElement({ type: "entities", entities: this.entities, show_header_toggle: false });
      if (generation !== this.generation) return;
      card.hass = this.hass;
      this.card = card;
      this.error = undefined;
    } catch (error) {
      if (generation === this.generation) this.error = error instanceof Error ? error.message : String(error);
    } finally {
      if (generation === this.generation) this.loading = false;
    }
  }

  protected render() {
    return html`<details @pointerdown=${(event: Event) => event.stopPropagation()}
      @click=${(event: Event) => event.stopPropagation()}
      @dblclick=${(event: Event) => event.stopPropagation()}
      @toggle=${(event: Event) => {
        this.open = (event.target as HTMLDetailsElement).open;
        if (this.open && !this.card) void this.load();
      }}>
      <summary title=${this.label} aria-label=${this.label} aria-expanded=${String(this.open)}>
        <slot></slot><ha-icon icon="mdi:chevron-down" aria-hidden="true"></ha-icon>
      </summary>
      ${this.open ? html`<div class="content">
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>`
          : this.card ?? html`<ha-circular-progress indeterminate></ha-circular-progress>`}
      </div>` : nothing}
    </details>`;
  }
}
