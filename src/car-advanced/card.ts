import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { localizeText } from "../localize";
import type { AdditionConfig } from "../types";
import { CAR_TAG, carStub, engineConfig, validateCar, type CarConfig } from "./config";
import { loadCarEngine, type CarEngineElement } from "./runtime";

export class MushroomCarAdvancedCard extends MushroomAdditionCard {
  protected descriptor = getCatalogItem(CAR_TAG);
  @state() private failure = "";
  @state() private engine?: CarEngineElement;
  private loading = false;
  private appliedConfig?: AdditionConfig;
  private observer?: MutationObserver;

  static styles = [MushroomAdditionCard.styles, css`
    :host { display:block; min-width:0; container-type:inline-size; container-name:addition-car; }
    .mushroom-addition-card { padding:12px; height:auto; overflow:hidden; }
    .car-heading { margin-bottom:8px; }
    .engine { min-width:0; }
    :host([fill-container]) .mushroom-addition-card { height:100%; box-sizing:border-box; }
    [role=alert] { color:var(--error-color); padding:12px; overflow-wrap:anywhere; }
    .status { padding:12px; color:var(--secondary-text-color); font-size:12px; }
    button { font:inherit; color:var(--primary-color); cursor:pointer; padding:8px 12px; }
    button:focus-visible { outline:2px solid var(--primary-color); outline-offset:2px; }
    button:hover { filter:brightness(.95); }
  `];

  public static getStubConfig = carStub;
  public setConfig(config: AdditionConfig): void {
    super.setConfig(validateCar(config));
  }
  public getCardSize(): number { return 9; }

  public connectedCallback(): void {
    super.connectedCallback();
    void this.load();
  }
  public disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    super.disconnectedCallback();
  }
  private async load(): Promise<void> {
    if (this.engine || this.loading) return;
    this.loading = true;
    this.failure = "";
    try {
      await loadCarEngine();
      this.engine = document.createElement("addition-car-engine") as CarEngineElement;
    } catch (error) {
      this.failure = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }
  protected updated(): void {
    super.updated();
    if (!this.engine || !this.config || !this.hass) return;
    this.engine.hass = this.hass;
    if (this.appliedConfig !== this.config) {
      try {
        this.engine.setConfig(engineConfig(this.config as CarConfig));
        this.appliedConfig = this.config;
        this.failure = "";
      } catch (error) {
        this.failure = error instanceof Error ? error.message : String(error);
      }
    }
    void this.styleEngine().catch(error => {
      this.failure = error instanceof Error ? error.message : String(error);
    });
  }
  private async styleEngine(): Promise<void> {
    if (!this.engine) return;
    await this.engine.updateComplete;
    const root = this.engine.shadowRoot;
    if (!root) return;
    if (!root.querySelector("#addition-car-theme")) {
      const style = document.createElement("style");
      style.id = "addition-car-theme";
      style.textContent = `
        :host { --ha-card-border-width:0; --ha-card-box-shadow:none;
          --ha-card-border-radius:var(--mush-control-border-radius,12px); --vic-icon-size:24px; }
        ha-card { border:0!important; box-shadow:none!important; border-radius:0; }
        main { padding:0!important; }
      `;
      root.append(style);
    }
    await this.styleControls(root);
    if (!this.observer && this.isConnected) {
      this.observer = new MutationObserver(() => {
        void this.styleEngine().catch(error => {
          this.failure = error instanceof Error ? error.message : String(error);
        });
      });
      this.observer.observe(root, { childList: true, subtree: true });
    }
  }
  private async styleControls(root: ShadowRoot): Promise<void> {
    const controls = [...root.querySelectorAll<HTMLElement & { updateComplete?: Promise<boolean> }>("*")]
      .filter(element => element.localName.startsWith("addition-car-"));
    await Promise.all(controls.map(async element => {
      await element.updateComplete;
      const childRoot = element.shadowRoot;
      if (!childRoot) return;
      const rule = element.localName === "addition-car-vsc-state-item" && element.closest("addition-car-vsc-btn-card")
        ? `.container { flex-direction:column!important; gap:4px!important; text-align:center; }
           .info { width:100%; margin:0!important; } .icon { margin:0!important; }`
        : element.localName === "addition-car-vsc-btn-state-info"
          ? `.container { text-align:center; } .primary { white-space:normal!important; overflow-wrap:anywhere; line-height:18px; }`
          : "";
      if (rule && !childRoot.querySelector("#addition-car-compact")) {
        const style = document.createElement("style");
        style.id = "addition-car-compact";
        style.textContent = `@container addition-car (max-width:360px) { ${rule} }`;
        childRoot.append(style);
      }
      if (element.localName === "addition-car-vsc-buttons-group") {
        const buttons = this.config?.car?.button_cards?.filter(button => button.hide_button !== true) ?? [];
        await element.updateComplete;
        const items = childRoot.querySelectorAll<HTMLElement & { updateComplete?: Promise<boolean> }>("addition-car-vsc-button-card-item");
        await Promise.all([...items].map(async (item, index) => {
          await item.updateComplete;
          const button = buttons[index];
          const entity = typeof button?.entity === "string" ? this.hass?.states[button.entity] : undefined;
          const label = String(button?.name || entity?.attributes.friendly_name || this.descriptor?.name || "");
          item.shadowRoot?.querySelector("#clickable-background")?.setAttribute("aria-label", label);
          item.shadowRoot?.querySelector("[slot=icon][role=button]")?.setAttribute("aria-label", label);
        }));
      }
      await this.styleControls(childRoot);
    }));
  }
  protected render() {
    if (!this.config) return nothing;
    return html`<ha-card class="mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}">
      <div class="car-heading">${this.renderSharedHeading()}</div>
      ${this.failure ? html`<div role="alert">${localizeText(this.hass, "Unable to load card")}: ${this.failure}
        <button @click=${() => { this.appliedConfig = undefined; void this.load(); this.requestUpdate(); }}>${localizeText(this.hass, "Retry")}</button></div>` : nothing}
      ${this.engine ? html`<div class="engine">${this.engine}</div>`
        : html`<div class="status" role="status">${localizeText(this.hass, "Loading…")}</div>`}
    </ha-card>`;
  }
}
