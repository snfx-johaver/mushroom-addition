import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, HomeAssistant } from "../types";
import { localizeText } from "../localize";
import { engineConfig, validateCar, type CarOptions, type CarSection } from "./config";
import { loadCarEngine, type CarEngineEditor, type CarEngineElement } from "./runtime";
import type { EditorField } from "../editor-schema";

const panels: Array<{ id: CarSection; label: string; icon: string }> = [
  { id: "indicators", label: "Indicators", icon: "mdi:car-info" },
  { id: "range_info", label: "Vehicle range", icon: "mdi:battery-charging" },
  { id: "images", label: "Images", icon: "mdi:image-multiple" },
  { id: "mini_map", label: "Map", icon: "mdi:map" },
  { id: "buttons", label: "Buttons", icon: "mdi:gesture-tap-button" },
];

function previewEngine(editor: HTMLElement): CarEngineElement | undefined {
  let node: HTMLElement | undefined = editor;
  while (node && !["hui-dialog-edit-card", "hui-dialog-create-card"].includes(node.localName)) {
    node = (node.getRootNode() as ShadowRoot).host as HTMLElement | undefined;
  }
  const search = (root: ShadowRoot): CarEngineElement | undefined => {
    for (const element of root.querySelectorAll<HTMLElement>("*")) {
      if (element.localName === "addition-car-engine") return element as CarEngineElement;
      const found = element.shadowRoot ? search(element.shadowRoot) : undefined;
      if (found) return found;
    }
    return undefined;
  };
  return node?.shadowRoot ? search(node.shadowRoot) : undefined;
}

function embeddedEditor(): CarEngineEditor {
  const tag = "mushroom-addition-car-native-options";
  if (!customElements.get(tag)) {
    const layoutTag = "mushroom-addition-car-layout-options";
    const Layout = customElements.get("addition-car-panel-layout-editor") as
      new () => HTMLElement & { _createVscForm(data: unknown, schema: EditorField[], key?: string | number, subKey?: string | number): TemplateResult };
    if (!Layout) throw new Error("Car layout editor registration failed.");
    if (!customElements.get(layoutTag)) {
      class EmbeddedLayout extends Layout {
        public _createVscForm(data: unknown, schema: EditorField[], key?: string | number, subKey?: string | number): TemplateResult {
          const fields = schema.filter(field => field.name !== "name" && field.name !== "hide_card_name");
          return fields.length ? super._createVscForm(data, fields, key, subKey) : html``;
        }
      }
      customElements.define(layoutTag, EmbeddedLayout);
    }
    const Native = customElements.get("addition-car-engine-editor") as new () => CarEngineEditor;
    class Embedded extends Native {
      // The standalone editor resizes HA's dialog and installs a global preview manager.
      // Embedded panels must leave both the enclosing editor and other vehicle cards alone.
      public connectedCallback(): void { LitElement.prototype.connectedCallback.call(this); }
      public async _getCardInPreview(): Promise<CarEngineElement | undefined> {
        await this.updateComplete;
        const engine = previewEngine(this);
        this._vscElem = engine;
        if (this._store) this._store.cardPreview = engine;
        return engine;
      }
      public render(): TemplateResult { return this._renderSelectedConfigType() as TemplateResult; }
      public _renderLayoutConfig(): TemplateResult {
        return html`<mushroom-addition-car-layout-options
          ._hass=${this._hass} ._config=${this._config} ._store=${this._store}>
        </mushroom-addition-car-layout-options>`;
      }
    }
    customElements.define(tag, Embedded);
  }
  return document.createElement(tag) as CarEngineEditor;
}

@customElement("mushroom-addition-car-options")
export class CarAdvancedEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @property() public section: "features" | "layout" = "features";
  @state() private selected: CarSection = "indicators";
  @state() private editor?: CarEngineEditor;
  @state() private failure = "";
  private appliedConfig?: CarOptions;
  private applied = false;

  static styles = css`
    :host { display:block; min-width:0; }
    .panels { display:flex; flex-wrap:wrap; gap:6px; margin-block:8px 12px; }
    button { display:flex; align-items:center; gap:6px; min-height:40px; padding:8px 12px;
      border:0; border-radius:var(--mush-control-border-radius,12px); cursor:pointer; font:inherit;
      color:var(--primary-text-color); background:var(--secondary-background-color); }
    button[aria-pressed=true] { color:var(--primary-color); background:rgba(var(--rgb-primary-color,33,150,243),.15); }
    button:focus-visible { outline:2px solid var(--primary-color); outline-offset:2px; }
    button:hover { filter:brightness(.95); }
    button { touch-action:manipulation; }
    ha-icon { --mdc-icon-size:20px; }
    [role=alert] { color:var(--error-color); overflow-wrap:anywhere; }
    .hint { color:var(--secondary-text-color); font-size:12px; line-height:1.5; margin:0 0 8px; }
  `;
  public connectedCallback(): void {
    super.connectedCallback();
    void this.load();
  }
  private async load(): Promise<void> {
    this.failure = "";
    try {
      await loadCarEngine(true);
      this.editor = embeddedEditor();
      this.applied = false;
      this.editor.addEventListener("config-changed", this.changed as EventListener);
    } catch (error) {
      this.failure = error instanceof Error ? error.message : String(error);
    }
  }
  protected updated(): void {
    if (!this.editor || !this.config || !this.hass) return;
    this.editor.hass = this.hass;
    this.editor._hass = this.hass;
    if (!this.applied || this.appliedConfig !== this.config.car) {
      this.appliedConfig = this.config.car;
      this.applied = true;
      try {
        this.editor.setConfig(engineConfig(this.config));
        this.failure = "";
      } catch (error) {
        this.failure = error instanceof Error ? error.message : String(error);
      }
    }
    if (this.editor._store) this.editor._store.hass = this.hass;
    const area = this.section === "layout" ? "layout_config" : this.selected;
    if (this.editor.configArea !== area) {
      this.editor._handleMenuValueChange(new CustomEvent("menu-value-changed", { detail: { value: area } }));
    }
  }
  private readonly changed = (event: CustomEvent<{ config: Record<string, unknown> }>): void => {
    event.stopPropagation();
    if (!this.config) return;
    const car = { ...event.detail.config } as CarOptions;
    delete car.type;
    delete car.name;
    if (car.layout_config) {
      car.layout_config = { ...car.layout_config };
      delete car.layout_config.hide_card_name;
    }
    try {
      const config = validateCar({ ...this.config, car });
      this.failure = "";
      this.dispatchEvent(new CustomEvent("config-changed", {
        detail: { config }, bubbles: true, composed: true,
      }));
    } catch (error) {
      this.failure = error instanceof Error ? error.message : String(error);
    }
  };
  protected render() {
    return html`
      ${this.section === "features" ? html`<div class="panels" role="group" aria-label=${localizeText(this.hass, "Features")}>
        ${panels.map(panel => html`<button type="button" aria-pressed=${this.selected === panel.id}
          @click=${() => { this.selected = panel.id; }}><ha-icon aria-hidden="true" .icon=${panel.icon}></ha-icon>${localizeText(this.hass, panel.label)}</button>`)}
      </div>` : nothing}
      ${this.failure ? html`<p role="alert">${this.failure}</p>
        <button type="button" @click=${() => { void this.load(); }}>${localizeText(this.hass, "Retry")}</button>` : nothing}
      ${this.editor ?? html`<p class="hint">${localizeText(this.hass, "Loading…")}</p>`}
    `;
  }
}
