import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import type { MushroomAdditionEditor } from "../src/editor";
import type { MushroomAdditionCard } from "../src/card";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { openEditorSections } from "./editor-helpers";
import { sharedStyles } from "../src/styles";

afterEach(() => document.body.replaceChildren());

describe("scene button entity selection", () => {
  it.each(CATALOG.filter(item => item.family === "scene" || item.upstreamId === "custom_card_welcome"))(
    "allows non-scene entities in the $name button picker",
    async descriptor => {
      const hass: HomeAssistant = {
        states: {
          "scene.relax": { entity_id: "scene.relax", state: "unknown", attributes: { friendly_name: "Relax" } },
          "switch.desk": { entity_id: "switch.desk", state: "off", attributes: { friendly_name: "Desk" } },
        },
        callService: vi.fn().mockResolvedValue(undefined),
      };
      const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
      editor.hass = hass;
      editor.setConfig({ type: `custom:${descriptor.tag}`, scene_items: [{ entity: "scene.relax" }] });
      document.body.append(editor);
      await openEditorSections(editor);
      const selector = editor.shadowRoot!.querySelector<HTMLElement & { selector: unknown }>(".item-row .wide ha-selector")!;
      expect(selector).not.toBeNull();
      expect(selector.selector).toEqual({ entity: {} });
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      selector.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "switch.desk" } }));
      await editor.updateComplete;
      const saved = changed.mock.lastCall![0].detail.config as AdditionConfig;
      expect(saved.scene_items![0]).toMatchObject({
        entity: "switch.desk", name: "Desk", icon: "mdi:toggle-switch", tap_action: { action: "toggle" },
      });

      if (descriptor.family !== "scene") return;
      const card = document.createElement(descriptor.tag) as MushroomAdditionCard;
      card.hass = hass;
      card.setConfig(saved);
      document.body.append(card);
      await card.updateComplete;
      const button = card.shadowRoot!.querySelector<HTMLButtonElement>(".scene-button")!;
      expect(button.classList.contains("is-off")).toBe(true);
      const action = vi.fn();
      card.addEventListener("hass-action", action);
      button.click();
      expect(action.mock.lastCall![0].detail).toEqual({
        config: { type: `custom:${descriptor.tag}`, entity: "switch.desk", tap_action: { action: "toggle" } },
        action: "tap",
      });
      card.hass = { ...hass, states: { ...hass.states, "switch.desk": { ...hass.states["switch.desk"], state: "on" } } };
      await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".scene-button.is-active")).not.toBeNull();
      expect(card.shadowRoot!.querySelector(".scene-button.is-off")).toBeNull();
    },
  );
});

describe("single-row scene picker containment", () => {
  it.each(["card_scenes", "custom_card_welcome"])(
    "edits and applies the optional button label size for %s", async id => {
      const descriptor = CATALOG.find(item => item.upstreamId === id)!;
      const hass: HomeAssistant = {
        language: "en", states: { "scene.relax": { entity_id: "scene.relax", state: "unknown", attributes: {} } },
        callService: vi.fn(),
      };
      const config: AdditionConfig = {
        type: `custom:${descriptor.tag}`, scenes_per_row: 3, scene_items: [{ entity: "scene.relax", name: "Relax" }],
      };
      const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
      editor.hass = hass; editor.setConfig(config); document.body.append(editor); await openEditorSections(editor);
      const layout = [...editor.shadowRoot!.querySelectorAll(".editor-section")]
        .find(section => section.querySelector(".section-header")?.textContent?.trim() === "Layout")!;
      const form = layout.querySelector<HTMLElement & {
        data: AdditionConfig; schema: { name: string; selector?: unknown }[]; computeLabel: (field: { name: string }) => string;
      }>("ha-form")!;
      expect(form.schema.find(field => field.name === "scene_label_font_size")?.selector)
        .toEqual({ number: { min: 8, max: 24, step: 1, mode: "slider", unit_of_measurement: "px" } });
      expect(form.computeLabel({ name: "scene_label_font_size" })).toBe("Label: Detail text size");
      const changed = vi.fn(); editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, scene_label_font_size: 15 } }, bubbles: true }));
      const saved = changed.mock.lastCall![0].detail.config as AdditionConfig;
      expect(saved).toMatchObject({ scene_label_font_size: 15, scenes_per_row: 3, scene_items: config.scene_items });
      const card = document.createElement(descriptor.tag) as MushroomAdditionCard;
      card.hass = hass; card.setConfig(saved); document.body.append(card); await card.updateComplete;
      const group = card.shadowRoot!.querySelector<HTMLElement>(id === "card_scenes" ? ".scene-grid" : ".welcome-items")!;
      expect(group.style.getPropertyValue("--scene-label-font-size")).toBe("15px");
      card.setConfig(config); await card.updateComplete;
      expect(group.style.getPropertyValue("--scene-label-font-size")).toBe("");
      card.setConfig({ ...config, scene_label_font_size: 100 }); await card.updateComplete;
      expect(group.style.getPropertyValue("--scene-label-font-size")).toBe("24px");
    },
  );
  it("shrinks pills like Welcome buttons and scrolls only below their minimum usable width", () => {
    const rule = sharedStyles.cssText.match(/(?:^|\n)\s*\.scene-grid\s*\{([^}]+)\}/)?.[1];
    expect(rule).not.toContain("flex-wrap: wrap");
    expect(rule).toContain("min-width: 0");
    expect(rule).toContain("overflow-x: auto");
    const button = sharedStyles.cssText.match(/(?:^|\n)\s*\.scene-button\s*\{([^}]+)\}/)?.[1];
    expect(button).toContain("flex: 1");
    expect(button).toContain("min-width: 52px");
    expect(button).toContain("border-radius: 25px");
  });
});
