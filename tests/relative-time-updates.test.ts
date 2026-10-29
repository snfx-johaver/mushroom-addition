import { describe, expect, it, vi } from "vitest";
import "../src/index";
import type { MushroomAdditionCard } from "../src/card";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const home = (state: string, timestamp: string): HomeAssistant => ({
  states: {
    "light.office": {
      entity_id: "light.office", state, last_changed: timestamp, last_updated: timestamp,
      attributes: { friendly_name: "Office", supported_color_modes: ["brightness"], entity_id: ["light.desk"] },
    },
    "light.desk": { entity_id: "light.desk", state, attributes: { friendly_name: "Desk" } },
    "scene.office_bright": { entity_id: "scene.office_bright", state: "unknown", attributes: {} },
  },
  callService: vi.fn(async () => undefined),
});

describe("Relative-time labels across live updates", () => {
  it.each([
    ["mushroom-addition-custom-card-light", "primary_info", "last-changed"],
    ["mushroom-addition-custom-card-light", "primary_info", "last-updated"],
    ["mushroom-addition-custom-card-light", "secondary_info", "last-changed"],
    ["mushroom-addition-custom-card-light", "secondary_info", "last-updated"],
    ["mushroom-addition-card-room", "secondary_info", "last-changed"],
    ["mushroom-addition-card-room", "secondary_info", "last-updated"],
  ] as const)("keeps %s updating with %s=%s after HA replaces the label text", async (tag, field, mode) => {
    const card = document.createElement(tag) as MushroomAdditionCard;
    const config: AdditionConfig = {
      type: `custom:${tag}`, entity: "light.office", [field]: mode,
      full_collapse_controls: true, collapsible_controls: true,
      carousel_items: [{ entity: "scene.office_bright" }],
    };
    card.setConfig(config);
    card.hass = home("off", "2026-10-29T08:00:00Z");
    document.body.append(card);
    try {
      await card.updateComplete;
      const relative = card.shadowRoot!.querySelector("ha-relative-time")!;
      expect(relative).not.toBeNull();
      // HA's element owns its light DOM and replaces it with the localized relative time.
      relative.textContent = "2 hours ago";
      card.hass = home("on", "2026-10-29T10:00:00Z");
      await expect(card.updateComplete).resolves.toBeTruthy();
      expect((relative as HTMLElement & { datetime: string }).datetime).toBe("2026-10-29T10:00:00Z");
      if (tag.endsWith("custom-card-light")) {
        expect(card.shadowRoot!.querySelector(".light-brightness")).not.toBeNull();
        expect(card.shadowRoot!.querySelectorAll(".light-pulldown")).toHaveLength(2);
      }

      relative.textContent = "a moment ago";
      card.hass = home("off", "2026-10-29T10:01:00Z");
      await expect(card.updateComplete).resolves.toBeTruthy();
      if (tag.endsWith("custom-card-light")) {
        expect(card.shadowRoot!.querySelector(".light-brightness")).toBeNull();
      }
    } finally {
      card.remove();
    }
  });
});
