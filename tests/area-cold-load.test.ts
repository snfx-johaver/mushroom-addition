import { afterEach, expect, it, vi } from "vitest";
import {
  AREA_TAG, MushroomAreaAdvancedCard, MushroomAreaAdvancedEditor, type AreaAdvancedConfig,
} from "../src/area-advanced";
import type { HomeAssistant } from "../src/types";

type LoaderWindow = Window & {
  loadCardHelpers?: () => Promise<{ createCardElement: (config: AreaAdvancedConfig) => HTMLElement }>;
};
const loaderWindow = window as LoaderWindow;
customElements.define(AREA_TAG, MushroomAreaAdvancedCard);
const config = { type: `custom:${AREA_TAG}`, area: "office" };
const hass: HomeAssistant = { states: {}, callService: vi.fn() };
async function settle(element: MushroomAreaAdvancedCard | MushroomAreaAdvancedEditor) {
  for (let i = 0; i < 12; i++) { await Promise.resolve(); await element.updateComplete; }
}
afterEach(() => {
  document.body.replaceChildren(); delete loaderWindow.loadCardHelpers;
  vi.restoreAllMocks(); vi.useRealTimers();
});

it("bootstraps a cold card and native editor from lazy unregistered helper elements, preserving newest configs", async () => {
  expect(customElements.get("hui-area-card")).toBeUndefined();
  const placeholders: HTMLElement[] = [];
  const createCardElement = vi.fn((value: AreaAdvancedConfig) => {
    expect(value.type).toBe("area");
    const placeholder = document.createElement("hui-area-card");
    placeholders.push(placeholder);
    return placeholder;
  });
  loaderWindow.loadCardHelpers = async () => ({ createCardElement });
  const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
  const editor = await MushroomAreaAdvancedCard.getConfigElement() as MushroomAreaAdvancedEditor;
  card.hass = hass; editor.hass = hass;
  card.setConfig({ ...config, area: "stale" }); editor.setConfig({ ...config, area: "stale" });
  document.body.append(card, editor);
  await settle(card); await settle(editor);
  expect(placeholders).toHaveLength(2);
  expect(card.shadowRoot!.textContent).toContain("Loading native Area");
  expect(card.shadowRoot!.querySelector("ha-alert")).toBeNull();
  expect(editor.shadowRoot!.querySelector("ha-alert")).toBeNull();
  card.setConfig(config); editor.setConfig(config);
  await settle(card);
  expect(placeholders).toHaveLength(3);

  class NativeEditor extends HTMLElement {
    _schema = () => [];
    hass?: HomeAssistant;
    config?: AreaAdvancedConfig;
    setConfig(value: AreaAdvancedConfig) { this.config = value; }
  }
  class NativeArea extends HTMLElement {
    hass?: HomeAssistant;
    config?: AreaAdvancedConfig;
    setConfig(value: AreaAdvancedConfig) { this.config = value; }
    static async getConfigElement() { return document.createElement("cold-native-area-editor"); }
  }
  // happy-dom does not upgrade detached pre-definition elements; model the browser registry contract.
  vi.spyOn(customElements, "upgrade").mockImplementation((element) => {
    if (placeholders.includes(element as HTMLElement)) Object.setPrototypeOf(element, NativeArea.prototype);
  });
  customElements.define("cold-native-area-editor", NativeEditor);
  customElements.define("hui-area-card", NativeArea);
  await settle(card); await settle(editor);
  expect(card.shadowRoot!.querySelector("ha-alert")?.textContent).toBeUndefined();
  const native = card.shadowRoot!.querySelector("hui-area-card") as NativeArea;
  expect(native).toBe(placeholders[2]);
  expect(native.config).toEqual({ ...config, type: "area" });
  expect(native.hass).toBe(hass);
  const nativeEditor = editor.shadowRoot!.querySelector("cold-native-area-editor") as NativeEditor;
  expect(nativeEditor.config).toEqual({ ...config, type: "area" });
  expect(nativeEditor.hass).toBe(hass);
  expect(card.shadowRoot!.querySelector("ha-alert")).toBeNull();
  expect(editor.shadowRoot!.querySelector("ha-alert")).toBeNull();
  card.remove(); document.body.append(card); await settle(card);
  expect(card.shadowRoot!.querySelector("hui-area-card")).toBe(native);
});

it("bounds unfinished native imports for card and editor and permits successful retries", async () => {
  vi.useFakeTimers();
  loaderWindow.loadCardHelpers = async () => ({
    createCardElement: () => document.createElement("hui-area-card"),
  });
  const registration = vi.spyOn(customElements, "whenDefined").mockImplementation(() => new Promise(() => undefined));
  const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
  const editor = await MushroomAreaAdvancedCard.getConfigElement() as MushroomAreaAdvancedEditor;
  card.setConfig(config); editor.setConfig(config); document.body.append(card, editor);
  await settle(card); await settle(editor);
  await vi.advanceTimersByTimeAsync(8001); await settle(card); await settle(editor);
  expect(card.shadowRoot!.textContent).toContain("The native component (hui-area-card) took too long to load.");
  expect(editor.shadowRoot!.textContent).toContain("The native component (hui-area-card) took too long to load.");
  registration.mockRestore();
  (card.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
  (editor.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
  await settle(card); await settle(editor);
  expect(card.shadowRoot!.querySelector("hui-area-card")).toBeTruthy();
  expect(editor.shadowRoot!.querySelector("cold-native-area-editor")).toBeTruthy();
  expect(card.shadowRoot!.querySelector("ha-alert")).toBeNull();
  expect(editor.shadowRoot!.querySelector("ha-alert")).toBeNull();
});
