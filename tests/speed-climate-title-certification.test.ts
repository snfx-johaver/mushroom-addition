import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG, publicItemForSource } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { migrateLegacyConfig, normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.speedtest_download": {
    entity_id: "sensor.speedtest_download",
    state: "273.07",
    attributes: { friendly_name: "Download", unit_of_measurement: "Mbit/s" },
  },
  "sensor.speedtest_upload": {
    entity_id: "sensor.speedtest_upload",
    state: "17.19",
    attributes: { friendly_name: "Upload", unit_of_measurement: "Mbit/s" },
  },
  "sensor.speedtest_ping": {
    entity_id: "sensor.speedtest_ping",
    state: "24",
    attributes: { friendly_name: "Ping", unit_of_measurement: "ms" },
  },
  "climate.living_room": {
    entity_id: "climate.living_room",
    state: "off",
    attributes: { friendly_name: "Living room", current_temperature: 19.5, temperature: 21 },
  },
  "device_tracker.joris_mobile": {
    entity_id: "device_tracker.joris_mobile",
    state: "home",
    attributes: { friendly_name: "Joris mobile" },
  },
  "water_heater.hot_water": {
    entity_id: "water_heater.hot_water",
    state: "eco",
    attributes: { friendly_name: "Hot water" },
  },
  "sensor.hot_water_power": {
    entity_id: "sensor.hot_water_power",
    state: "835",
    attributes: { friendly_name: "Hot water power", unit_of_measurement: "W" },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  slug: string,
  config: Omit<AdditionConfig, "type">,
  stateOverrides = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const tag = `mushroom-addition-custom-card-${slug}`;
  const card = document.createElement(tag) as TestCard;
  card.hass = { states: stateOverrides, callService };
  card.setConfig({ type: `custom:${tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

const item = (sourceId: string) => publicItemForSource(sourceId)!;

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("speed, climate, and title custom batch certification", () => {
  it("records matched-width local geometry, interactions, exact live configs, and live=false", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "docs", "assets", "visual-audit", "speed-climate-title-local-certification.json",
    ), "utf8")) as {
      geometry: Record<string, { width: number; regions: Record<string, number> }>;
      browserInteractions: Record<string, { controlsClicked: number; serviceCalls?: unknown[]; cardActions?: unknown[] }>;
      semanticLiveConfigs: Record<string, AdditionConfig>;
      manualReview: { inspected: boolean; matchedWidths: boolean; liveAccepted: boolean };
    };
    expect(Object.keys(evidence.geometry)).toEqual([
      "custom_card_speedtest_shogun160",
      "custom_card_tpx01_aircondition",
      "custom_card_vncntdev_device_tracer",
      "custom_card_water_heater",
      "custom_card_wilbiev_subtitle",
      "custom_card_wilbiev_title",
    ]);
    expect(evidence.geometry.custom_card_speedtest_shogun160).toMatchObject({
      width: 498,
      regions: { ".speedtest-metric": 3, ".speedtest-ring": 3 },
    });
    expect(evidence.browserInteractions.custom_card_tpx01_aircondition.serviceCalls).toEqual([
      ["climate", "set_hvac_mode", { entity_id: "climate.living_room", hvac_mode: "cool" }],
      ["script", "decrease_climate_temperature", { entity_id: "climate.living_room" }],
      ["script", "increment_climate_temperature", { entity_id: "climate.living_room" }],
    ]);
    expect(evidence.semanticLiveConfigs.custom_card_water_heater.entity).toBe("water_heater.hot_water");
    expect(evidence.manualReview).toEqual({
      inspected: true,
      matchedWidths: true,
      liveAccepted: false,
    });
  });

  it("provides dedicated picker defaults and graphical editor round trips for exactly six sources", async () => {
    const fields: Record<string, string[]> = {
      custom_card_speedtest_shogun160: [
        "download_entity", "upload_entity", "ping_entity",
        "ulm_custom_card_speedtest_round",
      ],
      custom_card_tpx01_aircondition: ["entity", "name"],
      custom_card_vncntdev_device_tracer: [
        "entity", "custom_card_vncntdev_device_tracker_name",
        "custom_card_vncntdev_device_tracker_status_as_name",
      ],
      custom_card_water_heater: ["entity", "power_entity"],
      custom_card_wilbiev_subtitle: ["name", "variant"],
      custom_card_wilbiev_title: ["name", "navigation_path", "variant"],
    };
    for (const [sourceId, expectedFields] of Object.entries(fields)) {
      const descriptor = item(sourceId);
      const tag = CATALOG.find((entry) => entry.upstreamId === sourceId)?.tag ??
        `mushroom-addition-${sourceId.replaceAll("_", "-")}`;
      const constructor = customElements.get(tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig({ states, callService: vi.fn() }, Object.keys(states), []);
      expect(config.type).toBe(`custom:${tag === descriptor.tag ? descriptor.tag : tag}`);
      const schema = editorSchemaFor(descriptor, config).map(({ name }) => name);
      expect(schema).toEqual(expect.arrayContaining(expectedFields));

      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = { states, callService: vi.fn() };
      editor.setConfig(config);
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...form.data, name: "Round trip" } },
      }));
      expect(changed).toHaveBeenCalledWith(expect.objectContaining({
        detail: { config: expect.objectContaining({ name: "Round trip" }) },
      }));
      editor.remove();
    }
  });

  it("migrates every source-specific legacy key without losing explicit values", () => {
    expect(migrateLegacyConfig({
      type: "custom:mushroom-addition-custom-card-speedtest-shogun160",
      ulm_custom_card_speedtest_download_speed_entity: "sensor.speedtest_download",
      ulm_custom_card_speedtest_upload_speed_entity: "sensor.speedtest_upload",
      ulm_custom_card_speedtest_ping_entity: "sensor.speedtest_ping",
    })).toMatchObject({
      entity: "sensor.speedtest_download",
      download_entity: "sensor.speedtest_download",
      upload_entity: "sensor.speedtest_upload",
      ping_entity: "sensor.speedtest_ping",
    });
    expect(migrateLegacyConfig({
      type: "custom:mushroom-addition-custom-card-vncntdev-device-tracer",
      entity: "device_tracker.joris_mobile",
      custom_card_vncntdev_device_tracker_name: "Phone",
      custom_card_vncntdev_device_tracker_icon: "mdi:cellphone",
    })).toMatchObject({ name: "Phone", icon: "mdi:cellphone" });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-wilbiev-title",
      ulm_custom_card_wilbiev_title_name: "Home",
      ulm_custom_card_wilbiev_title_nav: "/lovelace/home",
      variant: "divider-title",
    })).toMatchObject({
      name: "Home",
      navigation_path: "/lovelace/home",
      tap_action: { action: "navigate", navigation_path: "/lovelace/home" },
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-wilbiev-subtitle",
      ulm_custom_card_wilbiev_subtitle_name: "Living room",
      variant: "divider-subtitle",
    })).toMatchObject({
      name: "Living room",
      tap_action: { action: "none" },
    });
  });

  it("renders three source radial gauges and emits the exact update-entity action", async () => {
    const card = await renderCard("speedtest-shogun160", {
      download_entity: "sensor.speedtest_download",
      upload_entity: "sensor.speedtest_upload",
      ping_entity: "sensor.speedtest_ping",
      ulm_custom_card_speedtest_round: true,
    });
    expect(card.shadowRoot.querySelectorAll(".speedtest-metric")).toHaveLength(3);
    expect(card.shadowRoot.textContent).toContain("273 Mbit/s");
    expect(card.shadowRoot.textContent).toContain("17 Mbit/s");
    expect(card.shadowRoot.textContent).toContain("24 ms");
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          tap_action: {
            action: "perform-action",
            perform_action: "homeassistant.update_entity",
            target: {
              entity_id: [
                "sensor.speedtest_download",
                "sensor.speedtest_upload",
                "sensor.speedtest_ping",
              ],
            },
          },
        }),
      },
    }));
  });

  it("enumerates TPX more-info, power, decrement, and increment interactions exactly", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("tpx01-aircondition", {
      entity: "climate.living_room",
      name: "A/C Living room",
    }, states, callService);
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    [...card.shadowRoot.querySelectorAll<HTMLButtonElement>("button")].forEach((control) => control.click());
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          entity: "climate.living_room",
          tap_action: { action: "more-info" },
        }),
      },
    }));
    expect(callService.mock.calls).toEqual([
      ["climate", "set_hvac_mode", { entity_id: "climate.living_room", hvac_mode: "cool" }],
      ["script", "decrease_climate_temperature", { entity_id: "climate.living_room" }],
      ["script", "increment_climate_temperature", { entity_id: "climate.living_room" }],
    ]);
  });

  it("matches Device Tracer online, offline, unavailable, and status/name swap states", async () => {
    const online = await renderCard("vncntdev-device-tracer", {
      entity: "device_tracker.joris_mobile",
      custom_card_vncntdev_device_tracker_name: "Phone",
    });
    expect(online.shadowRoot.textContent).toContain("Phone");
    expect(online.shadowRoot.textContent).toContain("Online");
    online.remove();

    const offline = await renderCard("vncntdev-device-tracer", {
      entity: "device_tracker.joris_mobile",
      custom_card_vncntdev_device_tracker_name: "Phone",
      custom_card_vncntdev_device_tracker_status_as_name: true,
    }, {
      ...states,
      "device_tracker.joris_mobile": { ...states["device_tracker.joris_mobile"], state: "not_home" },
    });
    expect(offline.shadowRoot.querySelector(".is-offline")).not.toBeNull();
    expect(offline.shadowRoot.querySelector(".ulm-name")?.textContent).toBe("Offline");
    expect(offline.shadowRoot.querySelector(".ulm-label")?.textContent).toBe("Phone");
    offline.remove();

    const unavailable = await renderCard("vncntdev-device-tracer", {
      entity: "device_tracker.missing",
    });
    expect(unavailable.shadowRoot.textContent).toContain("Unavailable");
  });

  it("keeps Water Heater source-faithful and exposes only tap and hold more-info", async () => {
    vi.useFakeTimers();
    const card = await renderCard("water-heater", {
      entity: "water_heater.hot_water",
      power_entity: "sensor.hot_water_power",
    });
    expect(card.shadowRoot.textContent).toContain("Chauffe • 835 W");
    expect(card.shadowRoot.querySelector("button")).toBeNull();
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    const surface = card.shadowRoot.querySelector<HTMLElement>(".action-surface")!;
    surface.click();
    surface.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    surface.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail)).toEqual([
      expect.objectContaining({ action: "tap", config: expect.objectContaining({ tap_action: { action: "more-info" } }) }),
      expect.objectContaining({ action: "hold", config: expect.objectContaining({ hold_action: { action: "more-info" } }) }),
    ]);
  });

  it("matches Wilbiev title navigation and subtitle no-action semantics", async () => {
    const title = await renderCard("wilbiev-title", {
      name: "Home",
      navigation_path: "/lovelace/home",
    });
    expect(title.shadowRoot.querySelector(".wilbiev-back")).not.toBeNull();
    const actions = vi.fn();
    title.addEventListener("hass-action", actions);
    title.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    title.shadowRoot.querySelector<HTMLButtonElement>(".wilbiev-back")!.click();
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config.tap_action)).toEqual([
      { action: "navigate", navigation_path: "/lovelace/home" },
      { action: "navigate", navigation_path: "/lovelace/home" },
    ]);
    title.remove();

    const subtitle = await renderCard("wilbiev-subtitle", { name: "Living room" });
    expect(subtitle.shadowRoot.querySelector(".wilbiev-bottom-divider")).not.toBeNull();
    const subtitleActions = vi.fn();
    subtitle.addEventListener("hass-action", subtitleActions);
    subtitle.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect(subtitleActions).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({ tap_action: { action: "none" } }),
      },
    }));
  });
});
