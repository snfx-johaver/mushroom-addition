import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { MushroomAdditionCard } from "../src/card";
import type { HassEntity, HomeAssistant } from "../src/types";

const entity = (id: string, state: string, attributes = {}): HassEntity =>
  ({ entity_id: id, state, attributes });
const makeHass = (states: HomeAssistant["states"]): HomeAssistant =>
  ({ states, language: "en", callService: async () => undefined });

async function create(hass: HomeAssistant, overrides = {}) {
  const card = document.createElement("mushroom-addition-custom-card-sun") as MushroomAdditionCard;
  card.setConfig({ type: "custom:mushroom-addition-custom-card-sun", entity: "sun.sun", ...overrides });
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return card;
}

afterEach(() => document.body.replaceChildren());

describe("Astronomy discovery performance", () => {
  it("scans each state snapshot once across metrics, cards and unrelated rerenders, including no matches", async () => {
    const ownKeys = vi.fn(Reflect.ownKeys);
    const states = new Proxy<HomeAssistant["states"]>({
      "sun.sun": entity("sun.sun", "above_horizon", { elevation: 25, azimuth: 180 }),
      "sensor.unrelated": entity("sensor.unrelated", "1"),
    }, { ownKeys });
    const hass = makeHass(states);
    const first = await create(hass);
    const second = await create(hass);
    expect(ownKeys).toHaveBeenCalledTimes(1);
    for (const card of [first, second]) {
      card.hass = { ...hass, language: "nl" };
      await card.updateComplete;
    }
    expect(ownKeys).toHaveBeenCalledTimes(1);
    const nextKeys = vi.fn(Reflect.ownKeys);
    const nextStates = new Proxy<HomeAssistant["states"]>({ ...states, "sensor.moon_altitude": entity("sensor.moon_altitude", "15", {
      body: "Moon", metric: "Altitude", unit_of_measurement: "°",
    }) }, { ownKeys: nextKeys });
    for (const card of [first, second]) {
      card.hass = makeHass(nextStates);
      await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".moon-marker")).not.toBeNull();
    }
    expect(nextKeys).toHaveBeenCalledTimes(1);
  });

  it("preserves explicit selections and picks up changed metric values in new snapshots", async () => {
    const states = {
      "sun.sun": entity("sun.sun", "above_horizon", { elevation: 25, azimuth: 180 }),
      "sensor.phase": entity("sensor.phase", "full_moon", { device_class: "enum", friendly_name: "Moon phase" }),
      "sensor.altitude": entity("sensor.altitude", "15", { body: "sky", metric: "altitude", unit_of_measurement: "°" }),
      "sensor.manual": entity("sensor.manual", "30", { unit_of_measurement: "°" }),
    };
    const automatic = await create(makeHass(states));
    const selected = await create(makeHass(states), { moon_altitude_entity: "sensor.manual" });
    expect(automatic.shadowRoot!.textContent).toContain("15 °");
    expect(selected.shadowRoot!.textContent).toContain("30 °");
    automatic.hass = makeHass({
      ...states, "sensor.altitude": entity("sensor.altitude", "20", states["sensor.altitude"].attributes),
    });
    await automatic.updateComplete;
    expect(automatic.shadowRoot!.textContent).toContain("20 °");
    expect(selected.shadowRoot!.textContent).toContain("30 °");
  });
});
