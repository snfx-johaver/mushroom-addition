import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor, upstreamEditorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "person.joris": {
    entity_id: "person.joris",
    state: "home",
    attributes: { friendly_name: "Joris", entity_picture: "/local/joris.jpg" },
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
  it("provides dedicated picker defaults and graphical editor fields for exactly six sources", () => {
    const expected = {
      custom_card_imswel_person: ["entity", "wifi_tracker_entity", "gps_tracker_entity", "findmy_script_entity", "use_entity_picture"],
      custom_card_input_datetime: ["entity", "ulm_card_input_datetime_name"],
      custom_card_input_number: ["entity", "ulm_card_input_number_name"],
      custom_card_irmajavi_entities: ["entity", "ulm_custom_card_irmajavi_entities_entity_1", "ulm_custom_card_irmajavi_entities_name_4"],
      custom_card_irmajavi_speedtest: ["entity", "download_entity", "upload_entity", "ping_entity", "ulm_custom_card_irmajavi_speedtest_router_name"],
      custom_card_irmajavi_weather: ["entity", "temperature_entity", "date_entity", "ulm_custom_card_irmajavi_weather_entity_4"],
    };
    for (const [id, fields] of Object.entries(expected)) {
      const item = descriptor(id);
      expect(editorSchemaFor(item).map(({ name }) => name)).toEqual(expect.arrayContaining(fields));
      expect(upstreamEditorSchemaFor(item).map(({ name }) => name))
        .not.toEqual(expect.arrayContaining(fields));
    }

    const inputNumber = descriptor("custom_card_input_number");
    expect(editorSchemaFor(inputNumber).find(({ name }) => name === "entity")?.selector).toEqual({
      entity: { domain: ["input_number", "counter", "select", "input_select"] },
    });
    const constructor = customElements.get(inputNumber.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(constructor.getStubConfig(
      { states: { "sensor.temperature": states["sensor.temperature"] }, callService: vi.fn() },
      ["sensor.temperature"],
      [],
    ).entity).toBeUndefined();
  });

  it("round-trips a dedicated graphical editor field", async () => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    editor.hass = { states, callService: vi.fn() };
    editor.setConfig({
      type: `custom:${descriptor("custom_card_irmajavi_speedtest").tag}`,
      download_entity: "sensor.download",
    });
    document.body.append(editor);
    await editor.updateComplete;
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    editor.shadowRoot.querySelector("ha-form")!.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { upload_entity: "sensor.upload", ping_entity: "sensor.ping" } },
    }));
    expect((changed.mock.calls[0][0] as CustomEvent).detail.config).toMatchObject({
      download_entity: "sensor.download",
      upload_entity: "sensor.upload",
      ping_entity: "sensor.ping",
    });
  });

  it("migrates every documented legacy entity variable to semantic fields", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-imswel-person",
      ulm_card_imswel_person_entity: "person.joris",
      ulm_card_imswel_person_wifi_tracker: "device_tracker.wifi",
      ulm_card_imswel_person_gps_tracker: "device_tracker.gps",
      ulm_card_imswel_person_findmy_script: "script.find_phone",
      ulm_card_imswel_person_use_entity_picture: true,
    })).toMatchObject({
      entity: "person.joris",
      wifi_tracker_entity: "device_tracker.wifi",
      gps_tracker_entity: "device_tracker.gps",
      findmy_script_entity: "script.find_phone",
      use_entity_picture: true,
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-irmajavi-speedtest",
      ulm_custom_card_irmajavi_speedtest_download_speed_entity: "sensor.download",
      ulm_custom_card_irmajavi_speedtest_upload_speed_entity: "sensor.upload",
      ulm_custom_card_irmajavi_speedtest_ping_entity: "sensor.ping",
    })).toMatchObject({
      entity: "sensor.download",
      download_entity: "sensor.download",
      upload_entity: "sensor.upload",
      ping_entity: "sensor.ping",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-irmajavi-weather",
      ulm_custom_card_irmajavi_weather: "weather.home",
      ulm_custom_card_irmajavi_weather_temperature_outside: "sensor.temperature",
      ulm_custom_card_irmajavi_weather_date: "sensor.date_long",
      ulm_custom_card_irmajavi_weather_entity_1: "sensor.wind",
    })).toMatchObject({
      entity: "weather.home",
      temperature_entity: "sensor.temperature",
      date_entity: "sensor.date_long",
      entities: ["sensor.wind"],
    });
  });

  it("renders source person states and dispatches its one visible card action", async () => {
    const card = await renderCard("custom_card_imswel_person", {
      entity: "person.joris",
      use_entity_picture: false,
    });
    expect(card.shadowRoot.textContent).toContain("Home");
    expect((card.shadowRoot.querySelector(".imswel-location ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:home-variant");
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    (card.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
    expect((action.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      action: "tap",
      config: { entity: "person.joris", tap_action: { action: "more-info" } },
    });

    const office = await renderCard("custom_card_imswel_person", { entity: "person.joris" }, {
      ...states,
      "person.joris": { ...states["person.joris"], state: "Office" },
    });
    expect((office.shadowRoot.querySelector(".imswel-location ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:briefcase");
    const unavailable = await renderCard("custom_card_imswel_person", { entity: "person.joris" }, {
      ...states,
      "person.joris": { ...states["person.joris"], state: "unavailable" },
    });
    expect(unavailable.shadowRoot.textContent).toContain("Unavailable");
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

  it("executes every input-number control and keeps configured-unavailable inert", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom_card_input_number", {
      entity: "input_number.target",
    }, states, callService);
    [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".input-number-controls button")]
      .forEach((control) => control.click());
    expect(callService.mock.calls).toEqual([
      ["input_number", "decrement", { entity_id: "input_number.target" }],
      ["cover", "stop_cover", { entity_id: "input_number.target" }],
      ["input_number", "increment", { entity_id: "input_number.target" }],
    ]);

    const counterService = vi.fn(async () => undefined);
    const counter = await renderCard("custom_card_input_number", {
      entity: "counter.people",
    }, states, counterService);
    const counterControls = [...counter.shadowRoot.querySelectorAll<HTMLButtonElement>(".input-number-controls button")];
    counterControls[0].click();
    counterControls[2].click();
    expect(counterService.mock.calls).toEqual([
      ["counter", "decrement", { entity_id: "counter.people" }],
      ["counter", "increment", { entity_id: "counter.people" }],
    ]);

    const unavailable = await renderCard("custom_card_input_number", {
      entity: "input_number.missing",
    });
    expect(unavailable.shadowRoot.textContent).toContain("Entity unavailable");
    expect([...unavailable.shadowRoot.querySelectorAll<HTMLButtonElement>(".input-number-controls button")]
      .every((control) => control.disabled)).toBe(true);
  });

  it("renders and dispatches all four Entities detail interactions", async () => {
    const card = await renderCard("custom_card_irmajavi_entities", {
      entity: "light.lamp",
      entities: ["light.lamp", "sensor.temperature", "switch.plug", "sensor.battery"],
      ulm_custom_card_irmajavi_entities_name: "System Status",
    });
    expect(card.shadowRoot.querySelectorAll(".irmajavi-four button")).toHaveLength(4);
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelectorAll<HTMLButtonElement>(".irmajavi-four button")
      .forEach((control) => control.click());
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config.entity)).toEqual([
      "light.lamp", "sensor.temperature", "switch.plug", "sensor.battery",
    ]);
    expect(actions.mock.calls.every(([event]) =>
      (event as CustomEvent).detail.config.tap_action.action === "more-info")).toBe(true);
  });

  it("uses one exact speedtest update payload and two visible metric actions", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom_card_irmajavi_speedtest", {
      entity: "sensor.download",
      download_entity: "sensor.download",
      upload_entity: "sensor.upload",
      ping_entity: "sensor.ping",
      ulm_custom_card_irmajavi_speedtest_router_name: "Linksys",
      ulm_custom_card_irmajavi_speedtest_router_model: "EA8549",
    }, states, callService);
    (card.shadowRoot.querySelector(".speedtest-action") as HTMLButtonElement).click();
    expect(callService).toHaveBeenCalledWith("homeassistant", "update_entity", {
      entity_id: ["sensor.download", "sensor.upload", "sensor.ping"],
    });
    expect(card.shadowRoot.querySelectorAll(".speedtest-metrics button")).toHaveLength(2);
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelectorAll<HTMLButtonElement>(".speedtest-metrics button")
      .forEach((control) => control.click());
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config.entity))
      .toEqual(["sensor.download", "sensor.upload"]);
  });

  it("renders weather date/temperature and dispatches all four metric actions", async () => {
    const card = await renderCard("custom_card_irmajavi_weather", {
      entity: "weather.home",
      temperature_entity: "sensor.temperature",
      date_entity: "sensor.date_long",
      entities: ["sensor.wind", "sensor.precipitation", "sensor.uv", "sensor.humidity"],
    });
    expect(card.shadowRoot.textContent).toContain("⛅ Sep.23th. Wednesday");
    expect(card.shadowRoot.textContent).toContain("22.4 °C");
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelectorAll<HTMLButtonElement>(".irmajavi-four button")
      .forEach((control) => control.click());
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config.entity)).toEqual([
      "sensor.wind", "sensor.precipitation", "sensor.uv", "sensor.humidity",
    ]);
  });
});
