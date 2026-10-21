import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor, upstreamEditorSchemaFor } from "../src/editor-schema";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "person.resident": {
    entity_id: "person.resident",
    state: "home",
    attributes: { friendly_name: "Resident", entity_picture: "/local/resident.jpg" },
  },
  "zone.office": {
    entity_id: "zone.office",
    state: "0",
    attributes: { friendly_name: "Office", icon: "mdi:briefcase" },
  },
  "sensor.battery": {
    entity_id: "sensor.battery",
    state: "72",
    attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" },
  },
  "device_tracker.gps": {
    entity_id: "device_tracker.gps",
    state: "home",
    attributes: { friendly_name: "GPS" },
  },
  "device_tracker.wifi": {
    entity_id: "device_tracker.wifi",
    state: "Office Wi-Fi",
    attributes: { friendly_name: "Wi-Fi" },
  },
  "script.find_phone": {
    entity_id: "script.find_phone",
    state: "off",
    attributes: { friendly_name: "Find phone" },
  },
  "input_datetime.quiet": {
    entity_id: "input_datetime.quiet",
    state: "22:30:00",
    attributes: { friendly_name: "Quiet time", has_time: true, timestamp: 81000 },
  },
  "input_number.target": {
    entity_id: "input_number.target",
    state: "21",
    attributes: { friendly_name: "Target", unit_of_measurement: "°C", step: 0.5 },
  },
  "counter.people": {
    entity_id: "counter.people",
    state: "3",
    attributes: { friendly_name: "People" },
  },
  "light.lamp": {
    entity_id: "light.lamp",
    state: "on",
    attributes: { friendly_name: "Desk lamp" },
  },
  "sensor.temperature": {
    entity_id: "sensor.temperature",
    state: "22.4",
    attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" },
  },
  "switch.plug": {
    entity_id: "switch.plug",
    state: "off",
    attributes: { friendly_name: "Office plug" },
  },
  "sensor.humidity": {
    entity_id: "sensor.humidity",
    state: "47",
    attributes: { friendly_name: "Humidity", unit_of_measurement: "%" },
  },
  "sensor.download": {
    entity_id: "sensor.download",
    state: "273.07",
    attributes: { friendly_name: "Download", unit_of_measurement: "Mbit/s" },
  },
  "sensor.upload": {
    entity_id: "sensor.upload",
    state: "17.19",
    attributes: { friendly_name: "Upload", unit_of_measurement: "Mbit/s" },
  },
  "sensor.ping": {
    entity_id: "sensor.ping",
    state: "24",
    attributes: { friendly_name: "Ping", unit_of_measurement: "ms" },
  },
  "weather.home": {
    entity_id: "weather.home",
    state: "partlycloudy",
    attributes: { friendly_name: "Home", temperature: 18 },
  },
  "sensor.date_long": {
    entity_id: "sensor.date_long",
    state: "Sep.23th. Wednesday",
    attributes: { friendly_name: "Long date" },
  },
  "sensor.wind": {
    entity_id: "sensor.wind",
    state: "12",
    attributes: { friendly_name: "Wind", unit_of_measurement: "km/h" },
  },
  "sensor.precipitation": {
    entity_id: "sensor.precipitation",
    state: "0",
    attributes: { friendly_name: "Precipitation", unit_of_measurement: "mm" },
  },
  "sensor.uv": {
    entity_id: "sensor.uv",
    state: "3",
    attributes: { friendly_name: "UV index" },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const descriptor = (id: string) => CATALOG.find((entry) => entry.upstreamId === id)!;

const renderCard = async (
  id: string,
  config: Omit<AdditionConfig, "type">,
  stateOverrides: HomeAssistant["states"] = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const item = descriptor(id);
  const card = document.createElement(item.tag) as TestCard;
  card.hass = { states: stateOverrides, callService };
  card.setConfig({ type: `custom:${item.tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("person and input custom-card certification", () => {
  it("provides dedicated picker defaults and graphical editor fields for retained sources", () => {
    const expected = {
      custom_card_input_datetime: ["entity", "name"],
    };
    for (const [id, fields] of Object.entries(expected)) {
      const item = descriptor(id);
      expect(editorSchemaFor(item).map(({ name }) => name)).toEqual(expect.arrayContaining(fields));
      expect(editorSchemaFor(item).map(({ name }) => name)).not.toContain("use_entity_picture");
      expect(upstreamEditorSchemaFor(item).map(({ name }) => name))
        .not.toEqual(expect.arrayContaining(fields));
    }
  });

  it("executes all four datetime source interactions with exact payloads", async () => {
    vi.useFakeTimers();
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom_card_input_datetime", {
      entity: "input_datetime.quiet",
    }, states, callService);
    const controls = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".input-datetime-controls button")];
    controls[0].click();
    controls[1].click();
    controls[1].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    controls[1].dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    controls[1].click();
    controls[2].click();
    expect(callService.mock.calls).toEqual([
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.quiet", time: "22:15:00" }],
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.quiet", time: "22:31:00" }],
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.quiet", time: "22:29:00" }],
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.quiet", time: "22:45:00" }],
    ]);
    const unavailable = await renderCard("custom_card_input_datetime", {
      entity: "input_datetime.quiet",
    }, { ...states, "input_datetime.quiet": { ...states["input_datetime.quiet"], state: "unavailable" } });
    expect([...unavailable.shadowRoot.querySelectorAll<HTMLButtonElement>(".input-datetime-controls button")]
      .every((control) => control.disabled)).toBe(true);
  });

});
