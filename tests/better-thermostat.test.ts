import { describe, expect, it, vi } from "vitest";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const states: HomeAssistant["states"] = {
  "climate.living_room": {
    entity_id: "climate.living_room",
    state: "heat",
    attributes: {
      friendly_name: "Living room",
      current_temperature: 19.4,
      temperature: 21,
      current_humidity: 48,
      min_temp: 5,
      max_temp: 35,
      target_temp_step: 0.5,
      hvac_action: "heating",
      hvac_modes: ["off", "heat", "cool", "auto"],
      preset_mode: "eco",
      preset_modes: ["none", "home", "away", "eco", "boost"],
    },
  },
  "binary_sensor.window": {
    entity_id: "binary_sensor.window",
    state: "on",
    attributes: { friendly_name: "Window" },
  },
  "sensor.humidity": {
    entity_id: "sensor.humidity",
    state: "52",
    attributes: { friendly_name: "Humidity", unit_of_measurement: "%" },
  },
  "sensor.battery": {
    entity_id: "sensor.battery",
    state: "14",
    attributes: { friendly_name: "Battery", unit_of_measurement: "%" },
  },
};

const createCard = async (
  config: Partial<AdditionConfig> = {},
  stateOverrides: HomeAssistant["states"] = {},
) => {
  const callService = vi.fn(async () => undefined);
  const card = document.createElement("mushroom-addition-custom-card-better-thermostat") as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
    updateComplete: Promise<boolean>;
  };
  card.hass = {
    states: { ...states, ...stateOverrides },
    callService,
  };
  card.setConfig({
    type: "custom:mushroom-addition-custom-card-better-thermostat",
    entity: "climate.living_room",
    window_sensor: "binary_sensor.window",
    humidity_entity: "sensor.humidity",
    battery_entity: "sensor.battery",
    ...config,
  });
  document.body.append(card);
  await card.updateComplete;
  return { card, callService };
};

describe("Better Thermostat card", () => {
  it("renders live climate intelligence and external sensor warnings", async () => {
    const { card } = await createCard();
    expect(card.shadowRoot?.textContent).toContain("Living room");
    expect(card.shadowRoot?.textContent).toContain("19.4°C current");
    expect(card.shadowRoot?.textContent).toContain("21°C");
    expect(card.shadowRoot?.textContent).toContain("52%");
    expect(card.shadowRoot?.textContent).toContain("Heating");
    expect(card.shadowRoot?.textContent).toContain("Window open");
    expect(card.shadowRoot?.textContent).toContain("Battery 14%");
    expect(card.shadowRoot?.textContent).toContain("Eco");
    card.remove();
  });

  it("uses Home Assistant climate services for temperature, HVAC modes, and presets", async () => {
    const { card, callService } = await createCard();
    (card.shadowRoot?.querySelector('button[aria-label="Increase target temperature"]') as HTMLButtonElement).click();
    const cool = [...card.shadowRoot?.querySelectorAll(".better-thermostat-options button") ?? []]
      .find((button) => button.textContent?.includes("Cool")) as HTMLButtonElement;
    cool.click();
    const boost = [...card.shadowRoot?.querySelectorAll(".better-thermostat-options.presets button") ?? []]
      .find((button) => button.textContent?.includes("Boost")) as HTMLButtonElement;
    boost.click();
    expect(callService.mock.calls).toEqual([
      ["climate", "set_temperature", { entity_id: "climate.living_room", temperature: 21.5 }],
      ["climate", "set_hvac_mode", { entity_id: "climate.living_room", hvac_mode: "cool" }],
      ["climate", "set_preset_mode", { entity_id: "climate.living_room", preset_mode: "boost" }],
    ]);
    card.remove();
  });

  it("supports a compact layout and reports lost connections", async () => {
    const { card } = await createCard(
      { variant: "compact" },
      {
        "climate.living_room": {
          ...states["climate.living_room"],
          state: "unavailable",
        },
      },
    );
    expect(card.shadowRoot?.querySelector(".better-thermostat")?.classList).toContain("is-compact");
    expect(card.shadowRoot?.textContent).toContain("Connection lost");
    expect(card.shadowRoot?.querySelector('button[aria-label="Increase target temperature"]'))
      .toHaveProperty("disabled", true);
    card.remove();
  });

  it("disables climate controls when a configured linked sensor is unavailable", async () => {
    const { card, callService } = await createCard({}, {
      "sensor.battery": {
        ...states["sensor.battery"],
        state: "unavailable",
      },
    });
    expect(card.shadowRoot?.textContent).toContain("Connection lost");
    const cool = [...card.shadowRoot?.querySelectorAll(".better-thermostat-options button") ?? []]
      .find((button) => button.textContent?.includes("Cool")) as HTMLButtonElement;
    expect(cool.disabled).toBe(true);
    cool.click();
    expect(callService).not.toHaveBeenCalled();
    card.remove();
  });
});
