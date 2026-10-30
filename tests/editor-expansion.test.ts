import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { afterEach, describe, expect, it } from "vitest";
import "../src/editor";
import type { MushroomAdditionEditor } from "../src/editor";
import type { HomeAssistant } from "../src/types";

class NativeExpansionPanel extends LitElement {
  @property({ type: Boolean }) expanded = false;
  expandedDuringPreparation?: boolean;
  async toggle(editor: MushroomAdditionEditor) {
    const expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded } }));
    await editor.updateComplete;
    await this.updateComplete;
    this.expandedDuringPreparation = this.expanded;
    this.expanded = expanded;
    this.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded } }));
    await this.updateComplete;
    await editor.updateComplete;
  }
  protected render() { return html`<slot></slot>`; }
}
customElements.define("ha-expansion-panel", NativeExpansionPanel);

afterEach(() => document.body.replaceChildren());

describe("native expansion lifecycle", () => {
  it("mounts each section on the first opening without prematurely changing the panel's native state", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    const hass: HomeAssistant = { states: {}, callService: async () => undefined };
    editor.hass = hass;
    editor.setConfig({
      type: "custom:mushroom-addition-custom-card-light",
      carousel_items: Array.from({ length: 15 }, (_, i) => ({ entity: `scene.example_${i}` })),
    });
    document.body.append(editor);
    await editor.updateComplete;
    const panels = [...editor.shadowRoot!.querySelectorAll<NativeExpansionPanel>("ha-expansion-panel")];
    expect(panels).toHaveLength(5);
    for (const panel of panels) {
      expect(panel.querySelector(".section-body")).toBeNull();
      await panel.toggle(editor);
      expect(panel.expandedDuringPreparation).toBe(false);
      expect(panel.expanded).toBe(true);
      expect(panel.querySelector(".section-body")).not.toBeNull();
      for (let i = 0; i < 3; i++) {
        editor.hass = { ...hass, states: { ...hass.states } };
        await editor.updateComplete;
        expect(panel.expanded).toBe(true);
        expect(panel.querySelector(".section-body")).not.toBeNull();
      }
      if (panel.textContent?.includes("Features")) {
        expect(panel.querySelectorAll(".carousel-item-row")).toHaveLength(15);
      }
      await panel.toggle(editor);
      expect(panel.expandedDuringPreparation).toBe(true);
      expect(panel.expanded).toBe(false);
      expect(panel.querySelector(".section-body")).toBeNull();
      await panel.toggle(editor);
      expect(panel.expandedDuringPreparation).toBe(false);
      expect(panel.querySelector(".section-body")).not.toBeNull();
      await panel.toggle(editor);
    }
    expect(editor.shadowRoot!.querySelectorAll("ha-form, ha-selector")).toHaveLength(0);
  });

  it("supports completed-change events without letting nested events collapse the section", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = { states: {}, callService: async () => undefined };
    editor.setConfig({ type: "custom:mushroom-addition-card-battery" });
    document.body.append(editor);
    await editor.updateComplete;
    const panel = editor.shadowRoot!.querySelector<NativeExpansionPanel>("ha-expansion-panel")!;
    panel.expanded = true;
    panel.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded: true } }));
    await editor.updateComplete;
    expect(panel.querySelector(".section-body")).not.toBeNull();
    panel.querySelector(".section-body")!.dispatchEvent(new CustomEvent("expanded-changed", {
      bubbles: true, detail: { expanded: false },
    }));
    await editor.updateComplete;
    expect(panel.querySelector(".section-body")).not.toBeNull();
    panel.expanded = false;
    panel.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded: false } }));
    await editor.updateComplete;
    expect(panel.querySelector(".section-body")).toBeNull();
  });
});
