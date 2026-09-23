import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { migrateLegacyConfig, normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { VISUAL_AUDIT } from "../src/visual-audit";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.trash_today": {
    entity_id: "sensor.trash_today",
    state: "Today",
    attributes: { friendly_name: "Paper", icon: "mdi:trash-can", daysTo: 0 },
  },
  "sensor.time": { entity_id: "sensor.time", state: "19:15", attributes: { friendly_name: "Time" } },
  "weather.home": {
    entity_id: "weather.home",
    state: "partlycloudy",
    attributes: { friendly_name: "Home weather", temperature: 18 },
  },
  "sensor.news": { entity_id: "sensor.news", state: "Collection tomorrow", attributes: { friendly_name: "Waste news" } },
  "person.joris": {
    entity_id: "person.joris",
    state: "home",
    attributes: { friendly_name: "Joris", entity_picture: "/api/image/person.joris" },
  },
  "media_player.console": {
    entity_id: "media_player.console",
    state: "playing",
    attributes: {
      friendly_name: "PlayStation 4",
      media_title: "Gran Turismo",
      entity_picture: "/api/media_player_proxy/media_player.console",
    },
  },
  "light.qubino": {
    entity_id: "light.qubino",
    state: "on",
    attributes: { friendly_name: "Pilot wire", brightness: 128 },
  },
  "input_select.ordres_fil_pilote": {
    entity_id: "input_select.ordres_fil_pilote",
    state: "Comfort",
    attributes: { friendly_name: "Pilot wire order" },
  },
  "binary_sensor.joris_driving": {
    entity_id: "binary_sensor.joris_driving",
    state: "on",
    attributes: { friendly_name: "Joris driving" },
  },
  "zone.work": { entity_id: "zone.work", state: "0", attributes: { friendly_name: "Work", icon: "mdi:briefcase" } },
  "script.find_joris_phone": {
    entity_id: "script.find_joris_phone",
    state: "off",
    attributes: { friendly_name: "Find Joris phone" },
  },
  "camera.joris_light": {
    entity_id: "camera.joris_light",
    state: "idle",
    attributes: { friendly_name: "Joris map light", entity_picture: "/api/camera_proxy/camera.joris_light" },
  },
  "camera.joris_dark": {
    entity_id: "camera.joris_dark",
    state: "idle",
    attributes: { friendly_name: "Joris map dark", entity_picture: "/api/camera_proxy/camera.joris_dark" },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  sourceId: string,
  config: Omit<AdditionConfig, "type">,
  overrides = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const descriptor = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
  const card = document.createElement(descriptor.tag) as TestCard;
  card.hass = {
    states: overrides,
    callService,
    localize: (key) => key.endsWith(".home") ? "Home" : key,
  };
  card.setConfig({ type: `custom:${descriptor.tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

const item = (sourceId: string) => CATALOG.find((entry) => entry.upstreamId === sourceId)!;

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("welcome and person custom source certification", () => {
  it("records exact local geometry, interactions, configs, and integration limitations", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "docs", "assets", "visual-audit", "welcome-person-custom-local-certification.json",
    ), "utf8")) as {
      sources: Record<string, {
        config: Record<string, unknown>;
        interactions: Array<{ surface: string; payload: unknown }>;
        unavailableIntegrations?: string[];
      }>;
    };
    expect(Object.keys(evidence.sources)).toEqual([
      "custom_card_paddy_waste_collection",
      "custom_card_paddy_welcome",
      "custom_card_person_chip",
      "custom_card_playstation",
      "custom_card_qubino",
      "custom_card_ristou_person",
    ]);
    expect(evidence.sources.custom_card_paddy_welcome.interactions).toHaveLength(2);
    expect(evidence.sources.custom_card_ristou_person.interactions).toEqual(expect.arrayContaining([
      {
        surface: "find-device button",
        payload: ["homeassistant", "toggle", { entity_id: "script.find_joris_phone" }],
      },
    ]));
    expect(evidence.sources.custom_card_paddy_welcome.unavailableIntegrations).toEqual([
      "home-feed-card templating is not embedded; configured entity IDs render as a compact local feed.",
    ]);
  });

  it("accepts all five local audit stages without claiming live execution", () => {
    for (const sourceId of [
      "custom_card_paddy_waste_collection",
      "custom_card_paddy_welcome",
      "custom_card_person_chip",
      "custom_card_playstation",
      "custom_card_qubino",
      "custom_card_ristou_person",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "pending",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: false,
        artifactPath: "docs/assets/visual-audit/welcome-person-custom-batch-comparison.png",
      });
    }
  });

  it("provides dedicated picker defaults and source-specific graphical editor fields", () => {
    const expectedFields: Record<string, string[]> = {
      custom_card_paddy_waste_collection: ["entity", "name", "icon"],
      custom_card_paddy_welcome: ["variant", "entity", "time_entity", "weather_entity", "news_entities"],
      custom_card_person_chip: ["entity", "use_entity_picture"],
      custom_card_playstation: ["entity"],
      custom_card_qubino: ["entity", "qubino_more_info_entity"],
      custom_card_ristou_person: [
        "entity",
        "ulm_custom_card_ristou_use_entity_picture",
        "ulm_custom_card_ristou_use_badge",
        "battery_entity",
        "ulm_custom_card_ristou_person_driving_entity",
        "ulm_custom_card_ristou_zones",
        "ulm_custom_card_ristou_find_device_script",
        "ulm_custom_card_ristou_map_enable",
        "ulm_custom_card_ristou_camera_entity_light",
        "ulm_custom_card_ristou_camera_entity_dark",
      ],
    };
    for (const [sourceId, fields] of Object.entries(expectedFields)) {
      expect(editorSchemaFor(item(sourceId)).map(({ name }) => name)).toEqual(expect.arrayContaining(fields));
      const constructor = customElements.get(item(sourceId).tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig(
        { states, callService: vi.fn() },
        Object.keys(states),
        [],
      );
      expect(config.type).toBe(`custom:${item(sourceId).tag}`);
      expect(config.entity).toBeTruthy();
    }
    const welcome = (customElements.get(item("custom_card_paddy_welcome").tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    }).getStubConfig({ states, callService: vi.fn() }, Object.keys(states), []);
    expect(welcome).toMatchObject({
      entity: "person.joris",
      variant: "weather",
      time_entity: "sensor.time",
      weather_entity: "weather.home",
    });
    expect(editorSchemaFor(item("custom_card_qubino")).find(({ name }) => name === "entity"))
      .toMatchObject({ selector: { entity: { domain: ["light", "switch"] } } });
    expect(editorSchemaFor(item("custom_card_ristou_person")).find(({ name }) => name === "battery_entity"))
      .toMatchObject({ selector: { entity: { domain: ["sensor"] } } });
  });

  it("round-trips the mapped Ristou battery entity through the graphical editor", async () => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    editor.hass = { states, callService: vi.fn() };
    editor.setConfig({
      type: `custom:${item("custom_card_ristou_person").tag}`,
      entity: "person.joris",
      battery_entity: "sensor.joris_mobile_battery_level",
    });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
    expect(form.data.battery_entity).toBe("sensor.joris_mobile_battery_level");
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    form.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { ...form.data, battery_entity: "sensor.updated_battery" } },
    }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({
      detail: { config: expect.objectContaining({ battery_entity: "sensor.updated_battery" }) },
    }));
  });

  it("migrates the exact upstream fields into dedicated canonical fields", () => {
    expect(migrateLegacyConfig({
      type: "custom:mushroom-addition-custom-card-paddy-welcome",
      entity: "person.joris",
      ulm_custom_card_paddy_welcome_time: "sensor.time",
      ulm_custom_card_paddy_welcome_weather_provider: "weather.home",
    })).toMatchObject({
      time_entity: "sensor.time",
      weather_entity: "weather.home",
      variant: "weather",
    });
    expect(migrateLegacyConfig({
      type: "custom:mushroom-addition-custom-card-person-chip",
      ulm_custom_card_person_chip_entity: "person.joris",
    })).toMatchObject({ entity: "person.joris", use_entity_picture: true });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-qubino",
      entity: "light.qubino",
      more_info_entity: "input_select.ordres_fil_pilote",
    })).toMatchObject({
      qubino_more_info_entity: "input_select.ordres_fil_pilote",
      tap_action: { action: "more-info", entity: "input_select.ordres_fil_pilote" },
    });
    expect(migrateLegacyConfig({
      type: "custom:mushroom-addition-custom-card-ristou-person",
      entity: "person.joris",
      ulm_card_ristou_person_camera: "camera.joris_light",
      ulm_card_ristou_person_show_map: true,
    })).toMatchObject({
      ulm_custom_card_ristou_camera_entity_light: "camera.joris_light",
      ulm_custom_card_ristou_camera_entity_dark: "camera.joris_light",
      ulm_custom_card_ristou_map_enable: true,
    });
  });

  it("matches Paddy waste urgency states and outer more-info payload", async () => {
    const card = await renderCard("custom_card_paddy_waste_collection", { entity: "sensor.trash_today" });
    expect(card.shadowRoot.querySelector(".custom-paddy-waste.is-today .paddy-waste-icon > i")).not.toBeNull();
    expect(card.shadowRoot.textContent).toContain("Today");
    expect(card.shadowRoot.textContent).toContain("Paper");
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    card.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect(action).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        config: expect.objectContaining({
          entity: "sensor.trash_today",
          tap_action: { action: "more-info" },
        }),
        action: "tap",
      },
    }));
  });

  it("renders Paddy welcome modes and emits exact weather and news more-info payloads", async () => {
    const weather = await renderCard("custom_card_paddy_welcome", {
      entity: "person.joris",
      variant: "weather",
      time_entity: "sensor.time",
      weather_entity: "weather.home",
    });
    expect(weather.shadowRoot.textContent).toContain("Good evening,");
    expect(weather.shadowRoot.textContent).toContain("Joris!");
    const weatherAction = vi.fn();
    weather.addEventListener("hass-action", weatherAction);
    weather.shadowRoot.querySelector<HTMLButtonElement>(".paddy-welcome-weather")!.click();
    expect((weatherAction.mock.calls[0][0] as CustomEvent).detail).toEqual({
      config: {
        type: "custom:mushroom-addition-custom-card-paddy-welcome",
        entity: "weather.home",
        tap_action: { action: "more-info" },
      },
      action: "tap",
    });
    weather.remove();

    const news = await renderCard("custom_card_paddy_welcome", {
      entity: "person.joris",
      variant: "news",
      time_entity: "sensor.time",
      news_entities: ["sensor.news"],
    });
    const newsAction = vi.fn();
    news.addEventListener("hass-action", newsAction);
    news.shadowRoot.querySelector<HTMLButtonElement>(".paddy-welcome-news button")!.click();
    expect((newsAction.mock.calls[0][0] as CustomEvent).detail.config).toEqual({
      type: "custom:mushroom-addition-custom-card-paddy-welcome",
      entity: "sensor.news",
      tap_action: { action: "more-info" },
    });
  });

  it("renders Person Chip picture and localized state with only its outer more-info action", async () => {
    const card = await renderCard("custom_card_person_chip", {
      entity: "person.joris",
      use_entity_picture: true,
    });
    expect(card.shadowRoot.querySelector(".person-chip-picture")).not.toBeNull();
    expect(card.shadowRoot.textContent).toContain("Home");
    expect(card.shadowRoot.querySelectorAll("button")).toHaveLength(0);
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    card.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect((action.mock.calls[0][0] as CustomEvent).detail.config.entity).toBe("person.joris");
  });

  it("matches PlayStation standby, idle, artwork states without invented controls", async () => {
    const artwork = await renderCard("custom_card_playstation", { entity: "media_player.console" });
    expect(artwork.shadowRoot.querySelector(".custom-console-card.has-artwork")).not.toBeNull();
    expect(artwork.shadowRoot.textContent).toContain("Gran Turismo");
    expect(artwork.shadowRoot.querySelectorAll("button")).toHaveLength(0);
    artwork.remove();

    const idle = await renderCard("custom_card_playstation", { entity: "media_player.console" }, {
      ...states,
      "media_player.console": { ...states["media_player.console"], state: "idle", attributes: { friendly_name: "PlayStation 4" } },
    });
    expect(idle.shadowRoot.querySelector(".state-idle")).not.toBeNull();
    idle.remove();

    const standby = await renderCard("custom_card_playstation", { entity: "media_player.console" }, {
      ...states,
      "media_player.console": { ...states["media_player.console"], state: "standby", attributes: { friendly_name: "PlayStation 4" } },
    });
    expect(standby.shadowRoot.querySelector(".state-standby")).not.toBeNull();
  });

  it("derives Qubino pilot-wire labels and targets the configured input select", async () => {
    const card = await renderCard("custom_card_qubino", {
      entity: "light.qubino",
      qubino_more_info_entity: "input_select.ordres_fil_pilote",
    });
    expect(card.shadowRoot.textContent).toContain("Comfort -1°C · 50");
    expect(card.shadowRoot.querySelectorAll("button")).toHaveLength(0);
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    card.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect((action.mock.calls[0][0] as CustomEvent).detail.config.entity)
      .toBe("input_select.ordres_fil_pilote");
  });

  it("covers Ristou badge, driving, camera, map, outer action, and exact find-device service", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom_card_ristou_person", {
      entity: "person.joris",
      ulm_custom_card_ristou_use_entity_picture: true,
      ulm_custom_card_ristou_use_badge: true,
      ulm_custom_card_ristou_person_driving_entity: "binary_sensor.joris_driving",
      ulm_custom_card_ristou_zones: ["zone.work"],
      ulm_custom_card_ristou_find_device_script: "script.find_joris_phone",
      ulm_custom_card_ristou_camera_entity_light: "camera.joris_light",
      ulm_custom_card_ristou_camera_entity_dark: "camera.joris_dark",
    }, states, callService);
    expect(card.shadowRoot.textContent).toContain("Driving");
    expect(card.shadowRoot.querySelector(".ristou-camera")).not.toBeNull();
    expect(card.shadowRoot.querySelector(".ristou-person-avatar > i.tone-red")).not.toBeNull();
    card.shadowRoot.querySelector<HTMLButtonElement>(".ristou-find-device")!.click();
    expect(callService).toHaveBeenCalledWith(
      "homeassistant",
      "toggle",
      { entity_id: "script.find_joris_phone" },
    );
    card.remove();

    const map = await renderCard("custom_card_ristou_person", {
      entity: "person.joris",
      ulm_custom_card_ristou_map_enable: true,
      ulm_custom_card_ristou_map_aspect_ratio: "466:200",
      ulm_custom_card_ristou_zones: ["zone.work"],
    });
    expect(map.shadowRoot.querySelector(".ristou-map")).not.toBeNull();
    expect(map.shadowRoot.querySelector(".ristou-camera")).toBeNull();
  });
});
