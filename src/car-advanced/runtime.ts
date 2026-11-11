import type { HomeAssistant } from "../types";

export interface CarEngineElement extends HTMLElement {
  hass?: HomeAssistant;
  preview?: boolean;
  setConfig(config: Record<string, unknown>): void;
  updateComplete: Promise<boolean>;
}
export interface CarEngineEditor extends CarEngineElement {
  _hass?: HomeAssistant;
  _config?: Record<string, unknown>;
  configArea: string;
  _renderSelectedConfigType(): unknown;
  _handleMenuValueChange(event: CustomEvent<{ value: string }>): void;
  _getCardInPreview(): Promise<CarEngineElement | undefined>;
  _vscElem?: CarEngineElement;
  _store?: { hass?: HomeAssistant; cardPreview?: CarEngineElement };
}

let ready: Promise<void> | undefined;
let nativeEditors: Promise<void> | undefined;
async function loadNativeEditors(): Promise<void> {
  const loader = (window as Window & {
    loadCardHelpers?: () => Promise<{ createCardElement(config: Record<string, unknown>): HTMLElement }>;
  }).loadCardHelpers;
  if (!loader) throw new Error("Home Assistant card helpers are unavailable. Open a dashboard and retry.");
  const helpers = await loader();
  const card = helpers.createCardElement({ type: "vertical-stack", cards: [] });
  await customElements.whenDefined(card.localName);
  const Native = customElements.get(card.localName) as CustomElementConstructor & {
    getConfigElement(): Promise<HTMLElement>;
  };
  await Native.getConfigElement();
}
export async function loadCarEngine(editor = false): Promise<void> {
  await (ready ??= Promise.resolve().then(async () => {
    const { initializeCarEngine } = await import("./vendor/vehicle-engine.js");
    await initializeCarEngine();
    const Engine = customElements.get("addition-car-engine") as
      (CustomElementConstructor & { getConfigElement(): Promise<HTMLElement> }) | undefined;
    if (!Engine) throw new Error("Car engine registration failed.");
    await Engine.getConfigElement();
    await Promise.all([
      customElements.whenDefined("addition-car-engine"),
      customElements.whenDefined("addition-car-engine-editor"),
    ]);
  }).catch(error => {
    ready = undefined;
    throw error;
  }));
  // HA's non-reactive `value` setter cannot recover assignments made before
  // hui-card-element-editor upgrades; load it before mounting nested panels.
  if (editor) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await (nativeEditors ??= Promise.race([
        loadNativeEditors(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("Home Assistant editors timed out. Retry.")), 15000);
        }),
      ]).catch(error => {
        nativeEditors = undefined;
        throw error;
      }));
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }
}
