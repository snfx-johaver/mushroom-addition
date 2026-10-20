import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.rest": { entity_id: "sensor.rest", state: "Tomorrow", attributes: { friendly_name: "Residual waste" } },
  "sensor.gft": { entity_id: "sensor.gft", state: "Friday", attributes: { friendly_name: "Organic waste" } },
  "input_boolean.alarm": { entity_id: "input_boolean.alarm", state: "on", attributes: { friendly_name: "Alarm" } },
  "input_datetime.alarm": { entity_id: "input_datetime.alarm", state: "08:30:00", attributes: { friendly_name: "Alarm time" } },
  "sensor.download": { entity_id: "sensor.download", state: "273.07", attributes: { friendly_name: "Download", unit_of_measurement: "Mbit/s", history: [190, 220, 280] } },
  "sensor.ping": { entity_id: "sensor.ping", state: "24", attributes: { friendly_name: "Ping", unit_of_measurement: "ms" } },
  "sensor.upload": { entity_id: "sensor.upload", state: "17.19", attributes: { friendly_name: "Upload", unit_of_measurement: "Mbit/s" } },
  "sensor.power": { entity_id: "sensor.power", state: "2577.8", attributes: { friendly_name: "Power", unit_of_measurement: "W", history: [120, 100, 1900] } },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  tag: string,
  config: AdditionConfig,
  overrides: HomeAssistant["states"] = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const element = document.createElement(tag) as TestCard;
  element.hass = { states: overrides, callService };
  element.setConfig(config);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

afterEach(() => document.body.replaceChildren());

const item = (id: string) => CATALOG.find((entry) => entry.upstreamId === id)!;

describe("first pending custom batch certification", () => {
  it("records exact Chromium interaction and geometry evidence", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "custom-batch-local-certification.json"),
      "utf8",
    )) as {
      browserInteractions: Record<string, { controlsClicked?: number; serviceCalls?: unknown[]; cardActions?: unknown[] }>;
      geometry: Record<string, { width: number; regions: Record<string, number> }>;
    };
    expect(evidence.browserInteractions.custom_card_alarm_time).toMatchObject({
      controlsClicked: 2,
      serviceCalls: [
        ["input_datetime", "set_datetime", { entity_id: "input_datetime.alarm", time: "08:15:00" }],
        ["input_datetime", "set_datetime", { entity_id: "input_datetime.alarm", time: "08:45:00" }],
      ],
    });
  });

  it("provides source-specific picker defaults and graphical editor fields", () => {
    for (const id of [
      "custom_card_trash",
      "custom_card_alarm_time",
    ]) {
      const descriptor = item(id);
      const constructor = customElements.get(descriptor.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], entitiesFallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig({ states, callService: vi.fn() }, Object.keys(states), []);
      expect(config.type).toBe(`custom:${descriptor.tag}`);
      expect(config.entity).toBeTruthy();
      expect(editorSchemaFor(descriptor).filter((field) => field.name === "entity")).toHaveLength(1);
    }

    expect(editorSchemaFor(item("custom_card_alarm_time")).map(({ name }) => name))
      .toEqual(expect.arrayContaining(["datetime_entity", "ulm_card_alarm_time_step", "ulm_card_alarm_time_collapse"]));
  });

  it("renders full and partial waste streams without sentinel summary text", async () => {
    const card = await renderCard("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "sensor.rest",
      show_today: true,
      today_entity: "sensor.none",
      waste_streams: [
        { enabled: true, entity: "sensor.rest", label: "Residual waste" },
        { enabled: false, entity: "sensor.gft", label: "Organic waste" },
      ],
    }, {
      ...states,
      "sensor.none": { entity_id: "sensor.none", state: "geen", attributes: {} },
    });
    expect(card.shadowRoot.querySelectorAll(".waste-row")).toHaveLength(1);
    expect(card.shadowRoot.textContent).toContain("Residual waste");
    expect(card.shadowRoot.textContent).not.toContain("Organic waste");
    expect(card.shadowRoot.textContent).not.toContain("Today:");
  });

  it("covers Alarm Time active, collapsed, unavailable, and exact step actions", async () => {
    const callService = vi.fn(async () => undefined);
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-alarm-time",
      entity: "input_boolean.alarm",
      datetime_entity: "input_datetime.alarm",
      ulm_card_alarm_time_step: 15,
    };
    const card = await renderCard("mushroom-addition-custom-card-alarm-time", config, states, callService);
    const buttons = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".alarm-time-controls button")];
    buttons[0].click();
    buttons[1].click();
    expect(callService.mock.calls).toEqual([
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.alarm", time: "08:15:00" }],
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.alarm", time: "08:45:00" }],
    ]);
    card.remove();

    const collapsed = await renderCard("mushroom-addition-custom-card-alarm-time", {
      ...config,
      ulm_card_alarm_time_collapse: true,
    }, { ...states, "input_boolean.alarm": { ...states["input_boolean.alarm"], state: "off" } });
    expect(collapsed.shadowRoot.querySelector(".alarm-time-controls")).toBeNull();
    collapsed.remove();

    const unavailable = await renderCard("mushroom-addition-custom-card-alarm-time", config, {
      ...states,
      "input_datetime.alarm": { ...states["input_datetime.alarm"], state: "unavailable" },
    });
    expect([...unavailable.shadowRoot.querySelectorAll<HTMLButtonElement>(".alarm-time-controls button")]
      .every((control) => control.disabled)).toBe(true);
  });

});
