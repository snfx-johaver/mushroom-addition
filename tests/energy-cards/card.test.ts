import { beforeEach, describe, expect, it } from "vitest";
import "../../src/index";
import type { HomeAssistant } from "../../src/types";

const cardConfig = {
  type: "custom:mushroom-addition-smart-saving",
  price: {
    entity: "sensor.demo_prices",
    path: "prices",
    startField: "start",
    endField: "end",
    priceField: "price",
    sourceUnit: "EUR/kWh",
    displayUnit: "ct/kWh",
  },
  tracks: {
    plan: { entity: "sensor.demo_plan", path: "blocks", startField: "start", endField: "end" },
    applied: { entity: "sensor.demo_other_schedule", path: "blocks", startField: "start", endField: "end" },
    ev: { entity: "sensor.demo_other_schedule", path: "blocks", startField: "start", endField: "end" },
    solar: { entity: "sensor.demo_solar", path: "forecast", startField: "start", endField: "end", valueField: "value" },
  },
};

function hass(planAttributes?: Record<string, unknown>): HomeAssistant {
  return {
    states: {
      "sensor.demo_prices": {
        entity_id: "sensor.demo_prices",
        state: "available",
        attributes: { prices: [] },
      },
      "sensor.demo_other_schedule": {
        entity_id: "sensor.demo_other_schedule",
        state: "available",
        attributes: {
          blocks: [{
            start: new Date(Date.now() + 60 * 60_000).toISOString(),
            end: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
          }],
        },
      },
      "sensor.demo_solar": { entity_id: "sensor.demo_solar", state: "available", attributes: { forecast: [] } },
      ...(planAttributes ? {
        "sensor.demo_plan": { entity_id: "sensor.demo_plan", state: "available", attributes: planAttributes },
      } : {}),
    },
    callService: async () => undefined,
  };
}

describe("Smart Saving rendering", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("shows a missing schedule source separately from an empty valid schedule", async () => {
    const missing = document.createElement("mushroom-addition-smart-saving") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: unknown): void;
      updateComplete: Promise<boolean>;
    };
    missing.hass = hass();
    missing.setConfig(cardConfig);
    document.body.append(missing);
    await missing.updateComplete;
    expect(missing.shadowRoot?.textContent).toContain("Source missing");
    expect(missing.shadowRoot?.textContent).not.toContain("No blocks scheduled");

    const empty = document.createElement("mushroom-addition-smart-saving") as typeof missing;
    empty.hass = hass({ blocks: [] });
    empty.setConfig(cardConfig);
    document.body.append(empty);
    await empty.updateComplete;
    expect(empty.shadowRoot?.textContent).toContain("No blocks scheduled");
    expect(empty.shadowRoot?.textContent).not.toContain("Source missing");
  });

  it("renders explicit no-price and missing-forecast states without creating data", async () => {
    const card = document.createElement("mushroom-addition-smart-saving") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: unknown): void;
      updateComplete: Promise<boolean>;
    };
    card.hass = hass({ blocks: [] });
    card.setConfig(cardConfig);
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("No published price intervals available");
    expect(card.shadowRoot?.textContent).toContain("Forecast source missing");
  });
});
