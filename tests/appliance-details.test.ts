import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { ApplianceDetails } from "../src/appliance-details";
import type { HomeAssistant } from "../src/types";

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

const settle = async (card: ApplianceDetails) => {
  await new Promise(resolve => setTimeout(resolve, 0));
  await card.updateComplete;
};
const toggle = async (card: ApplianceDetails, open: boolean) => {
  const details = card.shadowRoot!.querySelector("details")!;
  details.open = open;
  details.dispatchEvent(new Event("toggle"));
  await settle(card);
};

describe("Inline appliance details", () => {
  it("loads native controls lazily, preserves them across collapse, and forwards live hass", async () => {
    const native = document.createElement("div") as HTMLDivElement & { hass?: HomeAssistant };
    const createCardElement = vi.fn(() => native);
    vi.stubGlobal("loadCardHelpers", async () => ({ createCardElement }));
    const card = new ApplianceDetails();
    card.entities = ["switch.oven_child_lock", "number.oven_duration"];
    card.hass = { states: {}, callService: vi.fn() };
    document.body.append(card);
    await settle(card);
    expect(createCardElement).not.toHaveBeenCalled();
    const summary = card.shadowRoot!.querySelector("summary")!;
    expect(summary.getAttribute("aria-label")).toBe("Settings & diagnostics");
    expect(summary.textContent!.trim()).toBe("");
    await toggle(card, true);
    expect(createCardElement).toHaveBeenCalledWith({
      type: "entities", entities: card.entities, show_header_toggle: false,
    });
    expect(card.shadowRoot!.contains(native)).toBe(true);
    expect(native.hass).toBe(card.hass);
    const updated = { ...card.hass };
    card.hass = updated;
    await settle(card);
    expect(native.hass).toBe(updated);
    await toggle(card, false);
    expect(card.shadowRoot!.contains(native)).toBe(false);
    await toggle(card, true);
    expect(card.shadowRoot!.contains(native)).toBe(true);
    expect(createCardElement).toHaveBeenCalledTimes(1);
    card.entities = ["sensor.oven_current_oven_cavity_temperature"];
    await settle(card);
    await settle(card);
    expect(createCardElement).toHaveBeenCalledTimes(2);
  });

  it("surfaces native control loading failures and retries on reopening", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("Native entities unavailable"));
    vi.stubGlobal("loadCardHelpers", loader);
    const card = new ApplianceDetails();
    card.entities = ["switch.oven_power"];
    document.body.append(card);
    await settle(card);
    await toggle(card, true);
    expect(card.shadowRoot!.querySelector('[role="alert"]')!.textContent).toContain("Native entities unavailable");
    loader.mockResolvedValue({ createCardElement: () => document.createElement("div") });
    await toggle(card, false);
    await toggle(card, true);
    expect(card.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
  });
});
