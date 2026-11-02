import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { MushroomAdditionCard } from "../src/card";
import type { HomeAssistant } from "../src/types";
import { sharedStyles } from "../src/styles";
import { MushroomAdditionEntityCarousel } from "../src/entity-carousel";
import { mushroomLightRgb } from "../src/light-area";

afterEach(() => document.body.replaceChildren());

describe("Light Area Card theme colours", () => {
  it("uses Mushroom-normalized bulb colours in both themes and keeps controls functional", async () => {
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
    const expectedColor = `rgb(${mushroomLightRgb([255, 249, 235])!.join(",")})`;
    expect(icon.style.getPropertyValue("--source-color")).toBe(expectedColor);
    const slider = card.shadowRoot!.querySelector<HTMLInputElement>(".light-brightness")!;
    expect(slider.style.getPropertyValue("--range-color")).toBe("var(--light-control-color)");
    expect(slider.style.getPropertyValue("--light-color")).toBe(expectedColor);
    slider.value = "67";
    slider.dispatchEvent(new Event("change"));
    expect(callService).toHaveBeenCalledWith("light", "turn_on", { entity_id: "light.group", brightness_pct: 67 });
    card.shadowRoot!.querySelector<HTMLButtonElement>(".light-member")!.click();
    expect(callService).toHaveBeenCalledWith("light", "toggle", { entity_id: "light.bulb" });
    card.hass = { ...hass, themes: { darkMode: true } };
    await card.updateComplete;
    expect(card.hasAttribute("dark")).toBe(true);
    expect(icon.style.getPropertyValue("--source-color")).toBe(expectedColor);
    card.setConfig({ type: "custom:mushroom-addition-custom-card-light", entity: "light.group", use_light_color: false });
    await card.updateComplete;
    expect(icon.style.getPropertyValue("--source-color")).toContain("--rgb-state-light");
    card.setConfig({ type: "custom:mushroom-addition-custom-card-light", entity: "light.group", use_light_color: false, icon_color: "red" });
    await card.updateComplete;
    expect(icon.style.getPropertyValue("--source-color")).toContain("--mush-rgb-red");
  });

  it("scopes contrast treatment to light cards and preserves dark-mode and standalone carousel colours", () => {
    expect(sharedStyles.cssText).not.toContain("--light-icon-mix");
    expect(sharedStyles.cssText).toContain("--light-control-color: var(--light-color)");
    expect(sharedStyles.cssText).not.toContain("--light-icon-filter");
    expect(sharedStyles.cssText).toContain("var(--light-control-color) 20%, transparent");
    expect(sharedStyles.cssText).toContain("var(--source-color) 25%, transparent");
    expect(sharedStyles.cssText).toContain(".light-brightness::-webkit-slider-thumb { width: 0");
    expect(sharedStyles.cssText).toContain(".light-brightness::-moz-range-thumb { width: 0");
    expect(sharedStyles.cssText).toContain(".light-member.is-off ha-icon { color: rgb(var(--addition-disabled-rgb))");
    expect(MushroomAdditionEntityCarousel.styles.cssText).toContain("color: var(--carousel-color, var(--primary-color))");
    expect(MushroomAdditionEntityCarousel.styles.cssText).not.toContain("--light-icon-filter");
    expect(MushroomAdditionEntityCarousel.styles.cssText).not.toContain("--light-scene-outline");
  });

  it.each([
    [[255, 255, 255], [225, 225, 225]],
    [[255, 249, 235], [225, 219.7058823529412, 207.35294117647058]],
    [[255, 210, 160], [255, 206.68421052631578, 153]],
    [[255, 160, 50], [255, 160, 50]],
    [[30, 100, 255], [30, 100, 255]],
    [[0, 0, 0], [225, 225, 225]],
  ])("matches Mushroom normalization for %j", (input, expected) => {
    const result = mushroomLightRgb(input)!;
    expected.forEach((value, index) => expect(result[index]).toBeCloseTo(value, 8));
  });

  it.each([undefined, null, [], [255, 0], [256, 0, 0], [NaN, 0, 0], ["255", 0, 0]])("rejects invalid RGB %j", value => {
    expect(mushroomLightRgb(value)).toBeUndefined();
  });
});
