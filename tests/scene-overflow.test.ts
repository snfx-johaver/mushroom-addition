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
