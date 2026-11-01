import { afterEach, expect, it } from "vitest";
import "../src/editor";
import type { MushroomAdditionEditor } from "../src/editor";
import type { AdditionConfig } from "../src/types";
import { openEditorSections } from "./editor-helpers";

afterEach(() => document.body.replaceChildren());

it("reveals editable extra pollen rows when enabled, preserving them across hide and reopen", async () => {
  const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
  editor.hass = { states: {}, callService: async () => undefined };
  editor.setConfig({ type: "custom:mushroom-addition-custom-card-pollen" });
  document.body.append(editor);
  await openEditorSections(editor);
  const changes: AdditionConfig[] = [];
  editor.addEventListener("config-changed", event => changes.push((event as CustomEvent).detail.config));
  const features = [...editor.shadowRoot!.querySelectorAll("ha-expansion-panel")]
    .find(panel => panel.querySelector(".section-header")?.textContent?.includes("Features"))!;
  const toggle = async (enabled: boolean) => {
    features.querySelector("ha-form")!.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { show_extra_pollen: enabled } }, bubbles: true, composed: true,
    }));
    await editor.updateComplete;
  };
  expect(features.querySelector(".waste-stream-editor")).toBeNull();
  await toggle(true);
  const add = features.querySelector<HTMLButtonElement>(".waste-stream-editor .add")!;
  expect(add.textContent).toContain("Add pollen sensor");
  add.click();
  await editor.updateComplete;
  let row = features.querySelector("[data-pollen-index='0']")!;
  const labels = [...row.querySelectorAll(".field > span")].map(label => label.textContent);
  expect(labels).toEqual(expect.arrayContaining(["Show this pollen sensor", "Entity", "Label", "Icon", "Color"]));
  for (const [label, value] of [["Entity", "sensor.birch"], ["Label", "Birch"], ["Icon", "mdi:tree"], ["Color", "green"]] as const) {
    row = features.querySelector("[data-pollen-index='0']")!;
    const field = [...row.querySelectorAll(".field")].find(field => field.querySelector("span")?.textContent === label)!;
    field.querySelector("ha-selector")!.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value }, bubbles: true, composed: true,
    }));
    await editor.updateComplete;
  }
  expect(changes.at(-1)?.pollen_extra?.[0]).toMatchObject({ entity: "sensor.birch", label: "Birch", icon: "mdi:tree", color: "green" });
  await toggle(false);
  expect(features.querySelector(".waste-stream-editor")).toBeNull();
  await toggle(true);
  expect(features.querySelector("[data-pollen-index='0']")?.textContent).toContain("Birch");
  features.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded: false } }));
  await editor.updateComplete;
  features.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded: true } }));
  await editor.updateComplete;
  expect(features.querySelector("[data-pollen-index='0']")?.textContent).toContain("Birch");
});
