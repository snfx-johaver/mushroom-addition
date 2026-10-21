import { localize, localizeText } from "./localize";
import { localizeNativeDiagnostic } from "./native-diagnostics";
import { localizeEditorSchema } from "./localized-schema";
import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { mdiDelete, mdiDragHorizontalVariant, mdiPencil } from "@mdi/js";
import { controlActions } from "./control-actions";
import { fireEvent, stateLabel } from "./helpers";
import type { ActionConfig, AdditionConfig, HomeAssistant } from "./types";
import { applyAreaContent, applyNativeControlColor, areaCssColor, AREA_CONTENT_KEYS, type AreaContentOptions } from "./area-content";

export const AREA_TAG = "mushroom-addition-area-card-advanced";
export const AREA_FEATURE_TAG = "mushroom-addition-area-controls-advanced";
export interface AreaControl {
  type?: "entity" | "action" | "template" | "conditional";
  entity_id?: string;
  domain?: string;
  name?: string;
  content_info?: "none" | "name" | "state" | "last-changed" | "last-updated" | "attribute" | "custom";
  attribute?: string;
  content?: string;
  use_entity_picture?: boolean;
  icon?: string;
  icon_color?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  conditions?: unknown[];
  control?: AreaControl;
  [key: string]: unknown;
}
export interface AreaFeature {
  type: string;
  controls?: (string | AreaControl)[];
  [key: string]: unknown;
}
export interface AreaAdvancedConfig extends AreaContentOptions {
  type: string;
  area?: string;
  features?: AreaFeature[];
  [key: string]: unknown;
}
interface NativeElement extends HTMLElement {
  hass?: HomeAssistant;
  layout?: unknown;
  context?: { area_id?: string; exclude_entities?: string[] };
  position?: string;
  color?: string;
  preview?: boolean;
  updateComplete?: Promise<boolean>;
  setConfig(config: AreaAdvancedConfig | AreaFeature): void;
  getCardSize?(): number | Promise<number>;
  getGridOptions?(): unknown;
}
interface NativeConstructor extends CustomElementConstructor {
  getConfigElement?(): HTMLElement | Promise<HTMLElement>;
}
interface AreaEditorField { name: string; schema?: AreaEditorField[]; selector?: Record<string, unknown> }
interface NativeAreaEditor extends NativeElement {
  _config?: AreaAdvancedConfig;
  _schema?: (...args: unknown[]) => AreaEditorField[];
  _computeLabelCallback?: (field: AreaEditorField) => string;
  _computeHelperCallback?: (field: AreaEditorField) => string | undefined;
}
type Helpers = { createCardElement(config: AreaAdvancedConfig): NativeElement | Promise<NativeElement> };
type AreaWindow = Window & { loadCardHelpers?: () => Promise<Helpers> };
const enhanced = (control: string | AreaControl): control is AreaControl =>
  typeof control !== "string" && ["domain", "type", "name", "content_info", "content", "use_entity_picture",
    "icon", "icon_color", "tap_action", "hold_action", "double_tap_action"].some((key) => key in control);
const customOnly = (control: string | AreaControl) => typeof control !== "string" && control.type
  && control.type !== "entity";
const projectedFeatures = new WeakMap<object, AreaFeature>();
const projectedControls = new WeakMap<object, AreaFeature>();
const projectedItems = new WeakMap<object, AreaControl>();
const nativeControl = (control: string | AreaControl): string | AreaControl => {
  if (!enhanced(control)) return control;
  const rest = { ...control };
  for (const key of ["type", "domain", "name", "content_info", "attribute", "content", "use_entity_picture",
    "icon", "icon_color", "tap_action", "hold_action", "double_tap_action", "conditions", "control"]) delete rest[key];
  return control.domain ?? rest;
};

export function nativeAreaConfig(config: AreaAdvancedConfig, editor = false): AreaAdvancedConfig {
  const native = { ...config };
  for (const key of AREA_CONTENT_KEYS) delete native[key];
  return {
    ...native, type: "area",
    ...(config.features ? { features: config.features.map((feature) => {
      if (feature.type !== "area-controls") return feature;
      if (editor) {
        const projection = { ...feature, ...(feature.controls
          ? { controls: feature.controls.filter((control) => !customOnly(control)).map((control) => {
            const item = nativeControl(control);
            if (typeof item === "object" && typeof control === "object") projectedItems.set(item, control);
            return item;
          }) } : {}) };
        projectedFeatures.set(projection, feature);
        if (projection.controls) projectedControls.set(projection.controls, feature);
        return projection;
      }
      return feature.controls?.some(enhanced)
        ? { ...feature, type: `custom:${AREA_FEATURE_TAG}` } : feature;
    }) } : {}),
  };
}

const namedControl = (control: string | AreaControl): boolean => {
  if (typeof control === "string" || control.domain) return false;
  if (control.type === "conditional") return Boolean(control.control && namedControl(control.control));
  if (control.type === "template") return Boolean(control.content || control.name);
  return (control.content_info ?? (control.name ? "name" : control.content ? "custom" : "none")) !== "none";
};
const namedFeatures = (config?: AreaAdvancedConfig) => config?.features?.some((feature) =>
  feature.type === "area-controls" && feature.controls?.some(namedControl)) ?? false;

function bounded<T>(promise: Promise<T>, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), 8000);
    promise.then((value) => { window.clearTimeout(timer); resolve(value); },
      (error: unknown) => { window.clearTimeout(timer); reject(error); });
  });
}
async function createNative(config: AreaAdvancedConfig): Promise<NativeElement> {
  const loader = (window as AreaWindow).loadCardHelpers;
  if (!loader) throw new Error("Home Assistant card helpers are unavailable. Open this card in Home Assistant, then retry.");
  const helpers = await bounded(loader(), "Home Assistant card helpers timed out. Retry.");
  const card = await bounded(Promise.resolve(helpers.createCardElement(config)), "Native Area card timed out. Retry.");
  if (card.localName !== "hui-area-card") {
    throw new Error("The installed Home Assistant frontend does not provide the native Area card. Update Home Assistant, then retry.");
  }
  // HA helpers intentionally return an unregistered element while importing lazy native cards.
  await bounded(customElements.whenDefined("hui-area-card"),
    "The native Area card did not finish loading. Check Home Assistant frontend compatibility and retry.");
  customElements.upgrade(card);
  if (typeof card.setConfig !== "function") throw new Error("The native Area card could not be initialized. Retry.");
  card.setConfig(config);
  return card;
}

export class MushroomAreaAdvancedCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) layout?: unknown;
  @state() private error?: string;
  @state() private card?: NativeElement;
  @state() private loadingControls = false;
  private config?: AreaAdvancedConfig;
  private revision = 0;
  public static async getConfigElement() {
    return document.createElement(`${AREA_TAG}-editor`);
  }
  public static getStubConfig(hass?: HomeAssistant): AreaAdvancedConfig {
    return { type: `custom:${AREA_TAG}`, ...(Object.keys(hass?.areas ?? {})[0]
      ? { area: Object.keys(hass!.areas!)[0] } : {}) };
  }
  public setConfig(config: AreaAdvancedConfig) {
    this.config = config;
    void this.load();
  }
  public getCardSize() {
    const size = this.card?.getCardSize?.() ?? 3;
    return namedFeatures(this.config) ? (typeof size === "number" ? size + 1 : size.then((value) => value + 1)) : size;
  }
  public getGridOptions() {
    const options = this.card?.getGridOptions?.() ?? { columns: 12, rows: 3 };
    if (!namedFeatures(this.config) || !options || typeof options !== "object") return options;
    const grid = options as Record<string, unknown>;
    return { ...grid, ...(typeof grid.rows === "number" ? { rows: grid.rows + 1 } : {}),
      ...(typeof grid.min_rows === "number" ? { min_rows: grid.min_rows + 1 } : {}) };
  }
  private async load() {
    if (!this.config) return;
    const revision = ++this.revision;
    this.error = undefined;
    if (!this.config.area) {
      this.error = "Select an area in the native Area editor.";
      return;
    }
    const config = nativeAreaConfig(this.config);
    try {
      const needsControls = config.features?.some((feature) => feature.type === `custom:${AREA_FEATURE_TAG}`)
        && !customElements.get("hui-area-controls-card-feature");
      if (this.card) this.card.setConfig(needsControls ? nativeAreaConfig(this.config, true) : config);
      else {
        const card = await createNative(needsControls ? nativeAreaConfig(this.config, true) : config);
        if (revision !== this.revision) return;
        this.card = card;
      }
      this.loadingControls = Boolean(needsControls);
      this.sync();
      if (needsControls) {
        // Let the installed Area card lazy-load its own native controls before extending them.
        await this.updateComplete;
        await bounded(customElements.whenDefined("hui-area-controls-card-feature"), "The installed frontend cannot load native Area controls. Update Home Assistant, then retry.");
        if (revision !== this.revision) return;
        this.card!.setConfig(config);
        this.loadingControls = false;
      }
    } catch (error) {
      if (revision === this.revision) this.error = String(error instanceof Error ? error.message : error);
    }
  }
  private sync() {
    if (this.card) {
      this.card.hass = this.hass; this.card.layout = this.layout;
      if (namedFeatures(this.config)) this.card.style.setProperty("--feature-height", "64px");
      else this.card.style.removeProperty("--feature-height");
      const card = this.card;
      const config = this.config;
      void Promise.resolve(card.updateComplete).then(() => {
        if (card !== this.card || config !== this.config || !this.isConnected) return;
        applyAreaContent(card, config ?? {});
      }).catch((error: unknown) => {
        if (card === this.card && config === this.config) this.error = error instanceof Error ? error.message : String(error);
      });
    }
  }
  protected updated() { this.sync(); }
  protected render() {
    return this.error ? html`<ha-alert alert-type="error">${this.config?.area ? localizeNativeDiagnostic(this.hass, this.error) : localizeText(this.hass, "Select an area in the native Area editor.")}
      <button @click=${() => { this.card = undefined; void this.load(); }}>${localizeText(this.hass, "Retry native Area card")}</button></ha-alert>`
      : this.card ? html`<div class=${this.loadingControls ? "loading" : "native"}>${this.card}</div>
        ${this.loadingControls ? html`<div role="status">${localizeText(this.hass, "Loading native Area controls…")}</div>` : nothing}`
        : html`<div role="status">${localizeText(this.hass, "Loading native Area card…")}</div>`;
  }
  static styles = css`:host { display: block; height: 100%; } .native, hui-area-card { height: 100%; }
    .loading { position: absolute; visibility: hidden; pointer-events: none; }`;
}

export function defaultAreaAction(entity: string): ActionConfig {
  const domain = entity.split(".")[0];
  if (["button", "input_button"].includes(domain)) {
    return { action: "perform-action", perform_action: `${domain}.press`, target: { entity_id: entity } };
  }
  if (["scene", "script"].includes(domain)) {
    return { action: "perform-action", perform_action: `${domain}.turn_on`, target: { entity_id: entity } };
  }
  return { action: ["light", "switch", "fan", "input_boolean", "automation", "humidifier", "remote", "siren"].includes(domain)
    ? "toggle" : "more-info" };
}

export class MushroomAreaControlsAdvanced extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) context?: NativeElement["context"];
  @property() position?: string;
  @property() color?: string;
  @state() private config?: AreaFeature;
  @state() private error?: string;
  @state() private ready = false;
  private groups = new Map<string, NativeElement>();
  private conditionals = new Map<number, NativeElement | null>();
  private conditionalErrors = new Map<number, string>();
  private templateValues = new Map<string, string>();
  private templates = new Map<string, { template: string; unsubscribe?: () => void; generation: number }>();
  private templateConnection?: HomeAssistant["connection"];
  private generation = 0;
  private configRevision = 0;
  public static isSupported() { return true; }
  public setConfig(config: AreaFeature) {
    this.config = config;
    this.configRevision++;
    this.context = this.context ?? config.area_context as NativeElement["context"];
    this.position = this.position ?? config.feature_position as string | undefined;
    this.color = this.color ?? config.feature_color as string | undefined;
    this.groups.clear();
    this.conditionals.clear();
    this.conditionalErrors.clear();
    this.clearTemplates();
    void this.load();
  }
  public getCardSize() { return this.config?.controls?.some(namedControl) ? 2 : 1; }
  public connectedCallback() { super.connectedCallback(); this.requestUpdate(); }
  public disconnectedCallback() {
    super.disconnectedCallback(); this.clearTemplates();
    this.configRevision++; this.conditionals.clear();
  }
  private clearTemplates() {
    this.generation++;
    for (const subscription of this.templates.values()) subscription.unsubscribe?.();
    this.templates.clear(); this.templateValues.clear();
  }
  protected updated() {
    if (this.templateConnection !== this.hass?.connection) {
      this.clearTemplates(); this.templateConnection = this.hass?.connection;
    }
    if (!this.isConnected) return;
    for (const [index, control] of (this.config?.controls ?? []).entries()) {
      if (typeof control === "string" || control.type !== "template") continue;
      for (const field of ["content", "name", "icon", "icon_color"] as const) {
        const template = control[field];
        if (!template || !/\{[{%#]/.test(template)) continue;
        const key = `${index}:${field}`;
        if (this.templates.get(key)?.template === template) continue;
        const entry = { template, generation: this.generation, unsubscribe: undefined as (() => void) | undefined };
        this.templates.set(key, entry);
        if (!this.hass?.connection) {
          this.templateValues.set(key, "Template error: Home Assistant template connection unavailable.");
          this.requestUpdate();
          continue;
        }
        void this.hass.connection.subscribeMessage<{ result?: unknown; error?: unknown }>((message) => {
          if (entry.generation !== this.generation) return;
          this.templateValues.set(key, message.error ? `Template error: ${String(message.error)}`
            : String(message.result ?? ""));
          this.requestUpdate();
        }, { type: "render_template", template, variables: { config: control,
          entity: control.entity_id, user: this.hass.user?.name } }).then((unsubscribe) => {
          if (entry.generation !== this.generation) unsubscribe(); else entry.unsubscribe = unsubscribe;
        }).catch((error: unknown) => {
          if (entry.generation !== this.generation) return;
          this.templateValues.set(key, `Template error: ${String(error)}`); this.requestUpdate();
        });
      }
    }
  }
  private template(control: AreaControl, index: number): AreaControl {
    const resolved = { ...control };
    for (const field of ["content", "name", "icon", "icon_color"] as const) {
      if (resolved[field] && /\{[{%#]/.test(resolved[field]!)) resolved[field] = this.templateValues.get(`${index}:${field}`) ?? "";
    }
    return resolved;
  }
  private conditional(control: AreaControl, index: number) {
    if (!control.control) return html`<ha-alert alert-type="error">${localizeText(this.hass, "Conditional control needs a nested button.")}</ha-alert>`;
    const error = this.conditionalErrors.get(index);
    if (error) return html`<ha-alert alert-type="error">${localizeNativeDiagnostic(this.hass, error)}</ha-alert>`;
    if (!this.conditionals.has(index)) {
      this.conditionals.set(index, null);
      const generation = this.configRevision;
      const loader = (window as AreaWindow).loadCardHelpers;
      if (!loader) {
        this.conditionalErrors.set(index, "Native conditional controls require Home Assistant card helpers.");
        this.requestUpdate(); return nothing;
      }
      void bounded(loader().then((helpers) => helpers.createCardElement({
        type: "conditional", conditions: control.conditions ?? [], card: {
          type: `custom:${AREA_FEATURE_TAG}`, controls: [control.control],
          area_context: this.context, feature_position: this.position, feature_color: this.color,
        },
      })), "Native conditional control timed out.").then((card) => {
        if (generation !== this.configRevision || !this.isConnected) return;
        if (card.localName !== "hui-conditional-card") throw new Error("Native conditional cards are unavailable in this frontend.");
        this.conditionals.set(index, card); this.requestUpdate();
      }).catch((error: unknown) => {
        if (generation !== this.configRevision) return;
        this.conditionalErrors.set(index, String(error)); this.requestUpdate();
      });
    }
    const card = this.conditionals.get(index);
    if (card) {
      // Conditional visibility must follow native conditions, never editor preview mode.
      card.preview = false;
      card.hass = this.hass;
    }
    return card ?? html`<span role="status">${localizeText(this.hass, "Loading conditional control…")}</span>`;
  }
  private label(control: AreaControl) {
    const entity = this.hass?.states[control.entity_id ?? ""];
    if (control.type === "template") return control.content ?? control.name ?? "";
    switch (control.content_info ?? (control.name ? "name" : control.content ? "custom" : "none")) {
      case "name": return control.name ?? entity?.attributes.friendly_name ?? control.entity_id ?? "";
      case "state": return entity ? stateLabel(entity, this.hass) : "";
      case "last-changed": return entity?.last_changed ? html`<ha-relative-time .hass=${this.hass} .datetime=${entity.last_changed}></ha-relative-time>` : "";
      case "last-updated": return entity?.last_updated ? html`<ha-relative-time .hass=${this.hass} .datetime=${entity.last_updated}></ha-relative-time>` : "";
      case "attribute": return String(entity?.attributes[control.attribute ?? ""] ?? "");
      case "custom": return control.content ?? "";
      default: return "";
    }
  }
  private async load() {
    try {
      await bounded(customElements.whenDefined("hui-area-controls-card-feature"),
        "Native Area controls are unavailable. This frontend is not supported; update Home Assistant and retry.");
      this.ready = true;
      this.error = undefined;
    } catch (error) { this.error = String(error instanceof Error ? error.message : error); }
  }
  private group(controls: (string | AreaControl)[] | undefined, key: string, domain?: AreaControl) {
    let group = this.groups.get(key);
    if (!group) {
      group = document.createElement("hui-area-controls-card-feature") as NativeElement;
      group.setConfig({ ...this.config!, type: "area-controls", ...(controls ? { controls } : {}) });
      this.groups.set(key, group);
    }
    group.hass = this.hass;
    group.context = this.context;
    group.position = this.position;
    group.color = domain?.icon_color ?? this.color;
    const color = domain?.icon_color;
    group.toggleAttribute("data-custom-color", Boolean(areaCssColor(color)));
    applyNativeControlColor(group, color);
    void Promise.resolve(group.updateComplete).then(() => applyNativeControlColor(group!, color))
      .catch((error: unknown) => { this.error = error instanceof Error ? error.message : String(error); });
    return group;
  }
  protected render() {
    this.toggleAttribute("named", this.config?.controls?.some(namedControl) ?? false);
    if (this.error) return html`<ha-alert alert-type="error">${localizeNativeDiagnostic(this.hass, this.error)}<button @click=${() => void this.load()}>${localizeText(this.hass, "Retry")}</button></ha-alert>`;
    if (!this.config || !this.hass || !this.ready) return nothing;
    if (this.config.controls === undefined) return this.group(undefined, "automatic");
    return html`${this.config.controls.map((configuredControl, index) => {
      const control = typeof configuredControl === "object" && configuredControl.type === "template"
        ? this.template(configuredControl, index) : configuredControl;
      if (!enhanced(control)) return this.group([control], String(index));
      if (control.type === "conditional") return this.conditional(control, index);
      if (control.domain) {
        // Domain aggregates always remain native: never guess group membership or toggle semantics.
        return html`<div class="domain">${this.group([control.domain], String(index), control)}
          ${control.icon || control.tap_action ? html`<ha-alert alert-type="warning">${localizeText(this.hass, "Domain icon and tap overrides require an entity control. Select an entity below instead.")}</ha-alert>` : nothing}</div>`;
      }
      const entity = control.entity_id ?? "";
      const entityState = this.hass!.states[entity];
      const unavailable = Boolean(entity) && (!entityState || ["unavailable", "unknown"].includes(entityState.state));
      const active = entityState && !["off", "closed", "locked", "idle", "standby", "unavailable", "unknown"].includes(entityState.state);
      const actionConfig: AdditionConfig = {
        type: `custom:${AREA_TAG}`, entity, tap_action: control.tap_action ?? (entity ? defaultAreaAction(entity) : { action: "none" }),
        hold_action: control.hold_action, double_tap_action: control.double_tap_action,
      };
      const color = control.icon_color;
      const iconColor = color && !["default", "state"].includes(color)
        ? (/^(#|rgb|hsl|var\(|color\()/.test(color) ? color : `var(--${color}-color, ${color})`)
        : active ? this.color ?? "var(--state-active-color, var(--primary-color))" : "var(--state-icon-color)";
      const templateError = Object.entries(control).find(([, value]) => typeof value === "string" && value.startsWith("Template error:"));
      if (templateError) return html`<ha-alert alert-type="error">${localizeNativeDiagnostic(this.hass, String(templateError[1]))}</ha-alert>`;
      const picture = control.use_entity_picture && typeof entityState?.attributes.entity_picture === "string"
        ? entityState.attributes.entity_picture : undefined;
      const label = this.label(control);
      return html`<button class="entity" ?disabled=${unavailable} aria-label=${String((control.name ?? entityState?.attributes.friendly_name ?? entity) || localize(this.hass, "ui.area.area_action"))}
        aria-pressed=${Boolean(active)} style=${`--control-icon-color:${iconColor}`}
        ${controlActions(actionConfig)}>
        <span class="button-icon">${picture ? html`<img src=${picture} alt="">`
          : control.icon || !entity ? html`<ha-icon .icon=${control.icon || "mdi:gesture-tap-button"}></ha-icon>`
          : html`<ha-state-icon .hass=${this.hass} .stateObj=${entityState}
              ._config=${this.hass!.config} ._connection=${this.hass!.connection}
              ._entities=${this.hass!.entities}></ha-state-icon>`}</span>
        ${label ? html`<span class="button-label">${label}</span>` : nothing}
      </button>`;
    })}`;
  }
  static styles = css`
    :host { display: flex; gap: 8px; align-items: center; min-width: 0; }
    .domain { min-width: 0; flex: 1; }
    hui-area-controls-card-feature { flex: 1; min-width: 0; }
    hui-conditional-card { flex: 1; min-width: 0; }
    hui-conditional-card[hidden] { display: none !important; }
    .entity { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; min-width: 42px;
      box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12));
      height: var(--feature-height, 42px); border: 0; border-radius: var(--ha-card-border-radius, 12px);
      background: color-mix(in srgb, var(--disabled-color, var(--secondary-text-color)) 14%,
        var(--ha-card-background, var(--card-background-color))); cursor: pointer;
      color: var(--control-icon-color); --mdc-icon-size: 24px; }
    .entity[aria-pressed="true"] { background: color-mix(in srgb, var(--control-icon-color) 16%, transparent); }
    .entity:disabled { color: var(--disabled-text-color, var(--secondary-text-color)); cursor: default; }
    .entity:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    :host([named]) { --feature-height: 64px; }
    :host([named]) .entity { height: 64px; padding: 6px 4px; }
    .button-icon { display: flex; align-items: center; justify-content: center; }
    .button-icon img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
    .button-label { margin-top: auto; padding-top: 4px; line-height: 16px; font-size: 11px;
      max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  `;
}

const controlKey = (control: string | AreaControl) => {
  const native = nativeControl(control);
  return typeof native === "string" ? `domain:${native}` : `entity:${native.entity_id}`;
};
const featureKey = (feature: AreaFeature) => JSON.stringify(Object.fromEntries(
  Object.entries(feature).filter(([key]) => key !== "controls").sort(([a], [b]) => a.localeCompare(b))));

/** Native editors may replace objects; match occurrences, never resurrect removed controls/features. */
export function mergeNativeAreaEdit(previous: AreaAdvancedConfig, next: AreaAdvancedConfig): AreaAdvancedConfig {
  const pool = [...previous.features ?? []];
  return { ...next, ...Object.fromEntries(AREA_CONTENT_KEYS
    .filter(key => key in next || previous[key] !== undefined).map(key => [key, key in next ? next[key] : previous[key]])),
    type: previous.type, ...(next.features ? { features: next.features.map((feature) => {
    if (feature.type !== "area-controls") return feature;
    const referenced = projectedFeatures.get(feature) ?? (feature.controls && projectedControls.get(feature.controls));
    const candidates = pool.map((item, index) => ({ item, index }))
      .filter(({ item }) => item.type === feature.type);
    const keys = (feature.controls ?? []).map(controlKey);
    candidates.sort((a, b) => Number(featureKey(b.item) === featureKey(feature)) - Number(featureKey(a.item) === featureKey(feature))
      || keys.filter((key) => b.item.controls?.some((c) => controlKey(c) === key)).length
      - keys.filter((key) => a.item.controls?.some((c) => controlKey(c) === key)).length);
    const match = candidates.find(({ item }) => item === referenced) ?? candidates[0];
    if (!match) return feature;
    pool.splice(match.index, 1);
    const controls = [...match.item.controls ?? []].filter((control) => !customOnly(control));
    const mergedControls = feature.controls?.map((control) => {
      const referenced = typeof control === "object" ? projectedItems.get(control) : undefined;
      const identityIndex = referenced ? controls.indexOf(referenced) : -1;
      const index = identityIndex >= 0 ? identityIndex : controls.findIndex((old) => controlKey(old) === controlKey(control));
      if (index < 0) return control;
      const old = controls.splice(index, 1)[0];
      return typeof old === "object" && enhanced(old)
        ? { ...old, ...(typeof control === "object" ? control : {}) } : control;
    });
    for (const [index, control] of (match.item.controls ?? []).entries()) {
      if (customOnly(control)) mergedControls?.splice(Math.min(index, mergedControls.length), 0, control);
    }
    return { ...feature, ...(mergedControls ? { controls: mergedControls } : {}) };
  }) } : {}) };
}

export class MushroomAreaAdvancedEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: AreaAdvancedConfig;
  @state() private editor?: NativeElement;
  @state() private error?: string;
  private loading = false;
  @state() private selected?: { feature: number; index: number; depth: number };
  @state() private conditionsError?: string;
  private conditionsLoading = false;
  private controlKeys = new Map<string | AreaControl, string>();
  private nextControlKey = 0;
  private configureEditor() {
    if (!this.editor || !this.config) return;
    this.editor.setConfig(nativeAreaConfig(this.config, true));
    const editor = this.editor as NativeAreaEditor;
    if (editor._config) Object.assign(editor._config,
      Object.fromEntries(AREA_CONTENT_KEYS.map(key => [key, this.config![key]])));
  }
  public setConfig(config: AreaAdvancedConfig) {
    this.config = config;
    if (this.editor) this.configureEditor();
    else void this.load();
  }
  private async load() {
    if (this.loading || !this.config) return;
    this.loading = true;
    try {
      await createNative(nativeAreaConfig(this.config, true));
      const ctor = customElements.get("hui-area-card") as NativeConstructor;
      if (!ctor.getConfigElement) throw new Error("The installed native Area editor is unavailable.");
      const editor = await bounded(Promise.resolve(ctor.getConfigElement()), "Native Area editor timed out. Retry.") as NativeElement;
      this.installContentEditor(editor as NativeAreaEditor);
      this.editor = editor;
      this.configureEditor();
      editor.hass = this.hass;
      editor.addEventListener("config-changed", (event) => {
        event.stopPropagation();
        const next = (event as CustomEvent<{ config: AreaAdvancedConfig }>).detail.config;
        this.selected = undefined;
        this.commit(mergeNativeAreaEdit(this.config!, next), false);
      });
      this.editor = editor;
      this.error = undefined;
    } catch (error) { this.error = String(error instanceof Error ? error.message : error); }
    finally { this.loading = false; }
  }
  private commit(config: AreaAdvancedConfig, updateNative = true) {
    this.config = config;
    if (updateNative) this.configureEditor();
    fireEvent(this, "config-changed", { config });
  }
  private controls(featureIndex: number, controls: (string | AreaControl)[] | undefined) {
    const features = [...this.config!.features!];
    const feature = { ...features[featureIndex] };
    if (controls === undefined) delete feature.controls;
    else feature.controls = controls;
    features[featureIndex] = feature;
    this.commit({ ...this.config!, features });
  }
  private move(feature: number, from: number, to: number) {
    const controls = [...this.config!.features![feature].controls!];
    if (from < 0 || from >= controls.length || to < 0 || to >= controls.length || from === to) return;
    const [control] = controls.splice(from, 1); controls.splice(to, 0, control);
    this.selected = undefined; this.controls(feature, controls);
  }
  private editControl(): AreaControl | undefined {
    if (!this.selected) return undefined;
    let control = this.config?.features?.[this.selected.feature]?.controls?.[this.selected.index];
    if (typeof control === "string") return { domain: control };
    for (let depth = 0; depth < this.selected.depth; depth++) control = control?.control;
    return control;
  }
  private changeControl(control: AreaControl) {
    if (!this.selected) return;
    const controls = [...this.config!.features![this.selected.feature].controls!];
    const replace = (previous: AreaControl, depth: number): AreaControl => depth
      ? { ...previous, control: replace(previous.control ?? {}, depth - 1) } : control;
    controls[this.selected.index] = replace(controls[this.selected.index] as AreaControl, this.selected.depth);
    this.controls(this.selected.feature, controls);
  }
  private newControl(type: AreaControl["type"]): AreaControl {
    if (type === "conditional") return { type, conditions: [], control: { type: "entity", entity_id: "", content_info: "name" } };
    if (type === "template") return { type, content: "", icon: "mdi:gesture-tap-button", tap_action: { action: "none" } };
    return type === "action" ? { type, icon: "mdi:gesture-tap-button", tap_action: { action: "none" } }
      : { type: "entity", entity_id: "", content_info: "name" };
  }
  private async ensureConditions() {
    if (customElements.get("hui-conditions-editor") || this.conditionsLoading) return;
    this.conditionsLoading = true;
    try {
      const loader = (window as AreaWindow).loadCardHelpers;
      if (!loader) throw new Error("Home Assistant card helpers are unavailable.");
      const card = await bounded(loader().then((helpers) => helpers.createCardElement({
        type: "conditional", conditions: [], card: { type: "markdown", content: "" },
      })), "Native condition editor timed out.");
      const ctor = card.constructor as NativeConstructor;
      if (!ctor.getConfigElement) throw new Error("Native condition editor is unavailable.");
      await bounded(Promise.resolve(ctor.getConfigElement()), "Native condition editor timed out.");
      if (!customElements.get("hui-conditions-editor")) throw new Error("This frontend does not provide the native conditions editor.");
      this.conditionsError = undefined;
    } catch (error) { this.conditionsError = String(error); }
    finally { this.conditionsLoading = false; this.requestUpdate(); }
  }
  private detail() {
    const control = this.editControl();
    if (!control) return nothing;
    if (control.domain) return html`<section class="detail" aria-label="${localizeText(this.hass, "Edit native domain group")}">
      <button @click=${() => { this.selected = undefined; }}>${localizeText(this.hass, "← Back to buttons")}</button>
      <h4>${localize(this.hass, "ui.area.native_group", { domain: control.domain })}</h4>
      <p>${localizeText(this.hass, "Group membership, icon and actions stay native. Add an entity button for a custom icon, name or action.")}</p>
      <ha-form .hass=${this.hass} .data=${control} .schema=${[{ name: "icon_color", selector: { ui_color: {} } }]}
        .computeLabel=${() => localizeText(this.hass, "Icon color")}
        @value-changed=${(event: CustomEvent<{ value: AreaControl }>) => {
          event.stopPropagation(); this.changeControl({ ...control, ...event.detail.value });
        }}></ha-form></section>`;
    const type = control.type ?? "entity";
    const schema: { name: string; required?: boolean; selector: Record<string, unknown> }[] = [
      { name: "entity_id", ...(type === "entity" ? { required: true } : {}), selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: type === "template" ? { text: {} } : { icon: {} } },
      { name: "icon_color", selector: type === "template" ? { text: {} } : { ui_color: {} } },
      { name: "content_info", selector: { select: { mode: "dropdown",
        options: [
          { value: "none", label: "Icon only (no text)" }, { value: "name", label: "Entity or custom name" },
          { value: "state", label: "Current entity value" }, { value: "last-changed", label: "Time since state changed" },
          { value: "last-updated", label: "Time since last update" },
          { value: "attribute", label: "One of the entity's attributes" },
          { value: "custom", label: "Your own text" },
        ] } } },
      ...(control.content_info === "attribute" ? [{ name: "attribute", selector: { select: { mode: "dropdown",
        custom_value: true, options: Object.keys(this.hass?.states[control.entity_id ?? ""]?.attributes ?? {})
          .map(value => ({ value, label: value.replaceAll("_", " ") })) } } }] : []),
      ...(type === "template" || control.content_info === "custom"
        ? [{ name: "content", selector: { text: { multiline: type === "template" } } }] : []),
      { name: "use_entity_picture", selector: { boolean: {} } },
      ...["tap_action", "hold_action", "double_tap_action"].map((name) => ({ name, selector: { ui_action: {} } })),
    ];
    const labels: Record<string, string> = {
      entity_id: "Entity (any domain)", name: "Name (below the icon)", icon: "Icon (empty = entity default)",
      icon_color: "Icon color", content_info: "Text below the icon", attribute: "Choose an entity attribute to display",
      content: type === "template" ? "Content template" : "Text to display below the icon", use_entity_picture: "Use entity picture",
      tap_action: "Tap behavior", hold_action: "Hold behavior", double_tap_action: "Double-tap behavior",
    };
    const buttonType = localize(this.hass, `ui.area.${type}_button`);
    return html`<section class="detail" aria-label=${localize(this.hass, `ui.area.edit_${type}`)}>
      <button @click=${() => {
        if (this.selected!.depth) this.selected = { ...this.selected!, depth: this.selected!.depth - 1 };
        else this.selected = undefined;
      }}>${this.selected!.depth ? localize(this.hass, "ui.area.back_conditional") : localizeText(this.hass, "← Back to buttons")}</button>
      <h4>${buttonType}</h4>
      ${type === "conditional" ? html`
        ${this.conditionsError ? html`<ha-alert alert-type="error">${localizeNativeDiagnostic(this.hass, this.conditionsError)}<button @click=${() => void this.ensureConditions()}>${localizeText(this.hass, "Retry")}</button></ha-alert>` : nothing}
        <hui-conditions-editor .hass=${this.hass} .conditions=${control.conditions ?? []}
          @value-changed=${(event: CustomEvent<{ value: unknown[] }>) => {
            event.stopPropagation(); this.changeControl({ ...control, conditions: event.detail.value });
          }}></hui-conditions-editor>
        <p>${localizeText(this.hass, "Conditions use Home Assistant's native conditional card, including nested conditions.")}</p>
        <button @click=${() => { this.selected = { ...this.selected!, depth: this.selected!.depth + 1 }; }}>${localize(this.hass, "ui.area.edit_nested", { type: localize(this.hass, `ui.area.${control.control?.type ?? "entity"}_button`) })}</button>
        <label>${localizeText(this.hass, "Nested button type")}<select aria-label="${localizeText(this.hass, "Nested button type")}" .value=${control.control?.type ?? "entity"}
          @change=${(event: Event) => {
            const type = (event.target as HTMLSelectElement).value as AreaControl["type"];
            this.changeControl({ ...control, control: this.newControl(type) });
          }}>${["entity", "action", "template", "conditional"].map((value) => html`<option value=${value}>${localize(this.hass, `ui.area.${value}_button`)}</option>`)}</select></label>
      ` : html`
        ${type === "template" ? html`<p>${localizeText(this.hass, "Content, name, icon and icon color accept Home Assistant Jinja templates. Templates run in Home Assistant, not in the browser. Errors are shown on the button preview.")}</p>` : nothing}
        <ha-form .hass=${this.hass} .data=${{
          ...control, content_info: control.content_info ?? (control.name ? "name" : control.content ? "custom" : "none"),
          tap_action: control.tap_action ?? (control.entity_id ? defaultAreaAction(control.entity_id) : { action: "none" }),
          hold_action: control.hold_action ?? { action: "none" }, double_tap_action: control.double_tap_action ?? { action: "none" },
        }} .schema=${localizeEditorSchema(this.hass, schema)} .computeLabel=${(field: { name: string }) => localizeText(this.hass, labels[field.name] ?? field.name)}
          .computeHelper=${(field: { name: string }) => field.name === "attribute"
            ? localize(this.hass, "ui.area.attribute_help")
            : field.name === "content" && type !== "template" ? localize(this.hass, "ui.area.content_help") : undefined}
          @value-changed=${(event: CustomEvent<{ value: AreaControl }>) => {
            event.stopPropagation();
            const updated = { ...control, ...event.detail.value };
            if (!control.entity_id && updated.entity_id && !control.tap_action) updated.tap_action = defaultAreaAction(updated.entity_id);
            this.changeControl(updated);
          }}></ha-form>`}
    </section>`;
  }
  protected updated() { if (this.editor) this.editor.hass = this.hass; }
  private installContentEditor(editor: NativeAreaEditor) {
    if (!editor._schema) throw new Error("This Home Assistant frontend cannot extend the Area editor Content schema.");
    const labels: Record<string, string> = { alert_color: "Alert icon color",
      sensor_wrap: "Wrap sensor values onto additional lines", sensor_icons: "Show small grey entity icons beside sensor values",
      use_light_color: "Use the light color as the room accent" };
    const helpers: Record<string, string> = {
      alert_color: "Changes the colored alert circles, including the compact alert badge. Clear to use Home Assistant's default.",
      sensor_wrap: "Keeps all selected sensor classes visible instead of truncating a long row.",
      sensor_icons: "Uses each sensor entity's default icon. Values and aggregation remain controlled by Home Assistant.",
      use_light_color: "Automatically uses an active RGB light in this card's area. No light selection is needed; excluded lights are ignored.",
    };
    const schema = editor._schema.bind(editor);
    const cache = new WeakMap<AreaEditorField[], AreaEditorField[]>();
    editor._schema = (...args: unknown[]) => {
      const base = schema(...args);
      let extended = cache.get(base);
      if (!extended) {
        extended = base.map(field => field.name !== "content" ? field : { ...field, schema: [...field.schema ?? [],
        { name: "alert_color", selector: { ui_color: {} } },
        { name: "sensor_wrap", selector: { boolean: {} } },
        { name: "sensor_icons", selector: { boolean: {} } },
        { name: "use_light_color", selector: { boolean: {} } },
      ] });
        cache.set(base, extended);
      }
      return extended;
    };
    const label = editor._computeLabelCallback?.bind(editor), helper = editor._computeHelperCallback?.bind(editor);
    editor._computeLabelCallback = field => labels[field.name] ? localizeText(this.hass, labels[field.name]) : label?.(field) ?? field.name;
    editor._computeHelperCallback = field => helpers[field.name] ? localizeText(this.hass, helpers[field.name]) : helper?.(field);
  }
  protected render() {
    if (!this.config) return nothing;
    return html`${this.error ? html`<ha-alert alert-type="error">${localizeNativeDiagnostic(this.hass, this.error)}<button @click=${() => void this.load()}>${localizeText(this.hass, "Retry")}</button></ha-alert>` : this.editor ?? html`${localize(this.hass, "ui.area.loading_editor")}`}
      <h3>${localizeText(this.hass, "Advanced area controls")}</h3>
      <p>${localizeText(this.hass, "Use the native editor above for area, appearance, features and standard domain groups. Edit advanced buttons below. Action, template and conditional buttons are intentionally hidden from native control lists. Names and content appear below icons, aligned to the button bottom. Empty controls show no controls; automatic controls retain Home Assistant defaults.")}</p>
      ${this.selected ? this.detail() : nothing}
      ${(this.config.features ?? []).map((feature, featureIndex) => feature.type !== "area-controls" ? nothing : html`
        <fieldset><legend>${localize(this.hass, "ui.area.feature", { number: featureIndex + 1 })}</legend>
          ${feature.controls === undefined ? html`<p>${localizeText(this.hass, "Automatic native domain controls")}</p>` : nothing}
          <ha-sortable handle-selector=".handle" @item-moved=${(event: CustomEvent<{ oldIndex: number; newIndex: number }>) => {
            event.stopPropagation();
            this.move(featureIndex, event.detail.oldIndex, event.detail.newIndex);
          }}><div class="controls">
          ${repeat(feature.controls ?? [], (control, index) => {
            if (typeof control === "string") return `native:${control}:${index}`;
            if (!this.controlKeys.has(control)) this.controlKeys.set(control, String(++this.nextControlKey));
            return this.controlKeys.get(control)!;
          }, (control, index) => {
            const domain = typeof control === "string" ? control : control.domain;
            const item = typeof control === "string" ? {} : control;
            const title = domain ? localize(this.hass, "ui.area.native_group", { domain }) : localize(this.hass, `ui.area.kind_${item.type ?? "entity"}`);
            const subtitle = item.name ?? this.hass?.states[item.entity_id ?? ""]?.attributes.friendly_name
              ?? item.entity_id ?? (item.type === "conditional" ? localize(this.hass, `ui.area.${item.control?.type ?? "entity"}_button`) : item.content ?? "");
            return html`<div class="control" role="listitem" data-feature=${featureIndex} data-index=${index}>
              <div class="handle drag" role="button" tabindex="0" aria-label="${localizeText(this.hass, "Drag to reorder; Alt plus arrow keys to move")}"
                title="${localizeText(this.hass, "Drag up or down to reorder. Keyboard: Alt + Up or Down.")}"
                @keydown=${(event: KeyboardEvent) => {
                  if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
                    event.preventDefault(); this.move(featureIndex, index, index + (event.key === "ArrowUp" ? -1 : 1));
                  }
                }}><ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon></div>
              <div class="row-label"><strong>${title}</strong><span>${subtitle}</span></div>
              <ha-icon-button class="edit-icon" aria-label="${localizeText(this.hass, "Edit button")}" .label=${localizeText(this.hass, "Edit button")} .path=${mdiPencil} @click=${() => {
                this.selected = { feature: featureIndex, index, depth: 0 };
                if (item.type === "conditional") void this.ensureConditions();
              }}></ha-icon-button>
              <ha-icon-button class="remove-icon" aria-label="${localizeText(this.hass, "Remove control")}" .label=${localizeText(this.hass, "Remove control")} .path=${mdiDelete} @click=${() => {
                this.selected = undefined; this.controls(featureIndex, feature.controls!.filter((_, i) => i !== index));
              }}></ha-icon-button>
            </div>`;
          })}</div></ha-sortable>
          <label>${feature.controls === undefined ? localize(this.hass, "ui.area.replace_automatic") : localizeText(this.hass, "Add button")}
            <select aria-label="${localizeText(this.hass, "Add button type")}" .value=${""} @change=${(event: Event) => {
              const select = event.target as HTMLSelectElement;
              const control = this.newControl(select.value as AreaControl["type"]);
              const controls = [...feature.controls ?? [], control];
              this.controls(featureIndex, controls);
              this.selected = { feature: featureIndex, index: controls.length - 1, depth: 0 };
              select.value = ""; if (control.type === "conditional") void this.ensureConditions();
            }}>
              <option value="" disabled selected>${localizeText(this.hass, "Add button…")}</option>
              ${["entity", "action", "conditional", "template"].map((value) => html`<option value=${value}>${localize(this.hass, `ui.area.kind_${value}`)}</option>`)}
            </select>
          </label>
          <button @click=${() => { this.selected = undefined; this.controls(featureIndex, undefined); }}>${localizeText(this.hass, "Use automatic native controls")}</button>
          <button @click=${() => { this.selected = undefined; this.controls(featureIndex, []); }}>${localizeText(this.hass, "Clear controls")}</button>
        </fieldset>`)}`;
  }
  static styles = css`fieldset { border: 1px solid var(--divider-color); margin: 16px 0; border-radius: 12px; }
    .control { display: flex; align-items: center; min-height: 60px; }
    .row-label { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .row-label span { color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .handle { cursor: grab; padding-inline-end:8px; touch-action:none; }
    .handle > * { pointer-events:none; }
    .edit-icon, .remove-icon { --ha-icon-button-size:36px; color:var(--secondary-text-color); }
    .detail { border: 1px solid var(--divider-color); border-radius: 12px; padding: 16px; }
    button, select { color: var(--primary-text-color); background: var(--secondary-background-color);
      border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; margin: 8px 0; }
    button { cursor: pointer; } button:disabled { opacity: .4; }
    button:focus-visible, select:focus-visible, .drag:focus-visible { outline: 2px solid var(--primary-color); }
    @media (max-width: 420px) { .control { gap: 4px; } .control button { padding: 6px; } }`;
}

if (!customElements.get(AREA_FEATURE_TAG)) customElements.define(AREA_FEATURE_TAG, MushroomAreaControlsAdvanced);
if (!customElements.get(`${AREA_TAG}-editor`)) customElements.define(`${AREA_TAG}-editor`, MushroomAreaAdvancedEditor);
