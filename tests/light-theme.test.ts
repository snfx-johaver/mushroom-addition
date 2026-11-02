import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { MushroomAdditionCard } from "../src/card";
import type { HomeAssistant } from "../src/types";
import { sharedStyles } from "../src/styles";
import { MushroomAdditionEntityCarousel } from "../src/entity-carousel";

afterEach(() => document.body.replaceChildren());

describe("Light Area Card theme colours", () => {
  it("preserves actual pale bulb colours while using theme-aware foregrounds and keeping controls functional", async () => {
    const callService = vi.fn(async () => undefined);
    const hass: HomeAssistant = {
      states: {
        "light.group": { entity_id: "light.group", state: "on", attributes: {
          rgb_color: [255, 249, 235], brightness: 255, supported_color_modes: ["rgb"],
          entity_id: ["light.bulb"],
        } },
        "light.bulb": { entity_id: "light.bulb", state: "on", attributes: { rgb_color: [255, 249, 235] } },
      },
      themes: { darkMode: false },
      callService,
    };
    const card = document.createElement("mushroom-addition-custom-card-light") as MushroomAdditionCard;
    card.hass = hass;
    card.setConfig({ type: "custom:mushroom-addition-custom-card-light", entity: "light.group",
      carousel_items: [{ entity: "scene.bright", name: "Bright", color: "yellow", icon: "mdi:white-balance-sunny" }],
    });
    document.body.append(card);
    await card.updateComplete;
    expect(card.hasAttribute("dark")).toBe(false);
    const icon = card.shadowRoot!.querySelector<HTMLElement>(".source-icon")!;
    expect(icon.style.getPropertyValue("--source-color")).toBe("rgb(255,249,235)");
    const slider = card.shadowRoot!.querySelector<HTMLInputElement>(".light-brightness")!;
    expect(slider.style.getPropertyValue("--range-color")).toBe("var(--light-control-color)");
    expect(slider.style.getPropertyValue("--light-color")).toBe("rgb(255,249,235)");
    slider.value = "67";
    slider.dispatchEvent(new Event("change"));
    expect(callService).toHaveBeenCalledWith("light", "turn_on", { entity_id: "light.group", brightness_pct: 67 });
    card.shadowRoot!.querySelector<HTMLButtonElement>(".light-member")!.click();
    expect(callService).toHaveBeenCalledWith("light", "toggle", { entity_id: "light.bulb" });
    card.hass = { ...hass, themes: { darkMode: true } };
    await card.updateComplete;
    expect(card.hasAttribute("dark")).toBe(true);
    expect(icon.style.getPropertyValue("--source-color")).toBe("rgb(255,249,235)");
  });

  it("scopes contrast treatment to light cards and preserves dark-mode and standalone carousel colours", () => {
    expect(sharedStyles.cssText).toContain("--light-icon-mix: 45%");
    expect(sharedStyles.cssText).toContain(":host([dark]) .custom-light { --light-icon-mix: 100%; }");
    expect(sharedStyles.cssText).toContain(".custom-light .light-member.is-active ha-icon");
    expect(sharedStyles.cssText).toContain(".light-slider:not(:disabled)::-webkit-slider-thumb");
    expect(sharedStyles.cssText).toContain(".light-slider:not(:disabled)::-moz-range-thumb");
    expect(sharedStyles.cssText).toContain(".light-member.is-off ha-icon { color: var(--secondary-text-color");
    expect(MushroomAdditionEntityCarousel.styles.cssText).toContain("var(--light-icon-mix, 100%)");
    expect(MushroomAdditionEntityCarousel.styles.cssText).toContain("var(--light-scene-outline, inset 0 0 0 0 transparent)");
  });
});
