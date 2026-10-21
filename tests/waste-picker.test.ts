import { afterEach, describe, expect, it } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { wasteStreamExamples } from "../src/waste-streams";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const descriptor = CATALOG.find(item => item.upstreamId === "custom_card_trash")!;
const hass: HomeAssistant = {
  states: {
    "sensor.temperature": { entity_id: "sensor.temperature", state: "22", attributes: {} },
    "sensor.afvalwijzer_restafval": { entity_id: "sensor.afvalwijzer_restafval", state: "2026-10-24", attributes: { friendly_name: "Restafval" } },
    "sensor.afvalwijzer_papier": { entity_id: "sensor.afvalwijzer_papier", state: "2026-10-26", attributes: { friendly_name: "Papier" } },
    "calendar.recycling_glass": { entity_id: "calendar.recycling_glass", state: "off", attributes: { friendly_name: "Glass recycling", start_time: "2026-10-28T08:00:00" } },
    "sensor.trash_unavailable": { entity_id: "sensor.trash_unavailable", state: "unavailable", attributes: {} },
    "sensor.afvalwijzer_vandaag": { entity_id: "sensor.afvalwijzer_vandaag", state: "geen", attributes: {} },
    "sensor.waste_last_update": { entity_id: "sensor.waste_last_update", state: "2026-10-21", attributes: {} },
  },
  callService: async () => undefined,
};
afterEach(() => document.body.replaceChildren());

describe("Trash picker defaults", () => {
  it("populates actual waste streams rather than a random sensor or blank preset rows", async () => {
    const config = createStubConfig(descriptor, hass, ["sensor.temperature", "sensor.trash_unavailable"]);
    expect(config.entity).toBe("sensor.afvalwijzer_restafval");
    expect(config.waste_streams?.map(stream => stream.entity)).toEqual([
      "sensor.afvalwijzer_restafval", "sensor.afvalwijzer_papier", "calendar.recycling_glass",
    ]);
    expect(config.waste_streams?.map(stream => stream.preset)).toEqual(["residual", "paper", "glass"]);
    const card = document.createElement(descriptor.tag) as HTMLElement & {
      hass: HomeAssistant; setConfig(config: AdditionConfig): void; updateComplete: Promise<boolean>;
    };
    card.hass = hass;
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelectorAll(".waste-row")).toHaveLength(3);
    expect(card.shadowRoot?.textContent).toContain("Papier");
    expect(card.shadowRoot?.textContent).toContain("2026-10-26");
  });
  it("recognizes integration-owned streams even without waste keywords in the name", () => {
    const source = { ...hass, states: {
      "sensor.paper": { entity_id: "sensor.paper", state: "2026-11-01", attributes: { friendly_name: "Paper" } },
    }, entities: {
      "sensor.paper": { entity_id: "sensor.paper", platform: "waste_collection_schedule" },
    } };
    expect(wasteStreamExamples(source)).toMatchObject([{ entity: "sensor.paper", preset: "paper", enabled: true }]);
  });
  it("does not pretend an unrelated temperature sensor is a collection when no waste entity exists", () => {
    const config = createStubConfig(descriptor, { ...hass, states: { "sensor.temperature": hass.states["sensor.temperature"] } });
    expect(config.entity).toBeUndefined();
    expect(config.waste_streams?.some(stream => stream.entity)).toBe(false);
  });
});
