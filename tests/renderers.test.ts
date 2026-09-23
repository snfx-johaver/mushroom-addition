import { describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const hass: HomeAssistant = {
  states: {
    "weather.home": {
      entity_id: "weather.home",
      state: "partlycloudy",
      attributes: {
        friendly_name: "Home",
        temperature: 17,
        temperature_unit: "°C",
        humidity: 68,
      },
    },
    "climate.living": {
      entity_id: "climate.living",
      state: "heat",
      attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21 },
    },
    "light.kitchen": {
      entity_id: "light.kitchen",
      state: "on",
      attributes: { friendly_name: "Kitchen", brightness: 153 },
    },
    "person.joris": {
      entity_id: "person.joris",
      state: "home",
      attributes: { friendly_name: "Joris", entity_picture: "/local/joris.jpg" },
    },
    "sensor.battery": {
      entity_id: "sensor.battery",
      state: "72",
      attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" },
    },
    "sensor.power": {
      entity_id: "sensor.power",
      state: "843",
      attributes: { friendly_name: "Home power", unit_of_measurement: "W" },
    },
    "sensor.memory": {
      entity_id: "sensor.memory",
      state: "17.7",
      attributes: { friendly_name: "Memory Usage", unit_of_measurement: "%" },
    },
    "media_player.tv": {
      entity_id: "media_player.tv",
      state: "playing",
      attributes: { friendly_name: "TV", media_title: "Movie" },
    },
    "cover.blind": { entity_id: "cover.blind", state: "open", attributes: { friendly_name: "Blind" } },
    "binary_sensor.window": { entity_id: "binary_sensor.window", state: "on", attributes: { friendly_name: "Window" } },
    "fan.fixture": { entity_id: "fan.fixture", state: "on", attributes: { friendly_name: "Fan", percentage: 42 } },
    "vacuum.robot": { entity_id: "vacuum.robot", state: "cleaning", attributes: { friendly_name: "Robot", battery_level: 80 } },
    "alarm_control_panel.home": { entity_id: "alarm_control_panel.home", state: "armed_home", attributes: { friendly_name: "Alarm" } },
    "scene.relax": { entity_id: "scene.relax", state: "scening", attributes: { friendly_name: "Relax" } },
  },
  callService: async () => undefined,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      callback({
        forecast: [
          { condition: "sunny", temperature: 20, templow: 12 },
          { condition: "rainy", temperature: 15, templow: 10 },
        ],
      } as T);
      return () => undefined;
    },
  },
};

const render = async (tag: string, config: AdditionConfig): Promise<string> => {
  const element = document.createElement(tag) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
    updateComplete: Promise<boolean>;
  };
  element.hass = hass;
  element.setConfig(config);
  document.body.append(element);
  await element.updateComplete;
  await Promise.resolve();
  await element.updateComplete;
  const markup = element.shadowRoot?.innerHTML ?? "";
  element.remove();
  return markup;
};

const familySignature = (markup: string): string[] =>
  [...markup.matchAll(/class="([^"]*ulm-[^"]*)"/g)]
    .flatMap((match) => match[1].split(" "))
    .filter((className) => className.startsWith("ulm-"))
    .filter((className, index, all) => all.indexOf(className) === index);

describe("family renderers", () => {
  it("renders the Minimalist weather hierarchy and details", async () => {
    const markup = await render("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.home",
      show_forecast: true,
    });
    expect(markup).toContain("ulm-weather");
    expect(markup).toContain("legacy-weather-current");
    expect(markup).toContain("legacy-weather-details");
    expect(markup).toContain("17");
    expect(markup).toContain("partlycloudy");
    expect((document.createElement("mushroom-addition-card-weather") as HTMLElement).tagName).toBe("MUSHROOM-ADDITION-CARD-WEATHER");
  });

  it("rerenders when Home Assistant updates an existing card config", async () => {
    const element = document.createElement("mushroom-addition-card-light") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = hass;
    element.setConfig({ type: "custom:mushroom-addition-card-light", entity: "light.kitchen", name: "First" });
    document.body.append(element);
    await element.updateComplete;
    element.setConfig({ type: "custom:mushroom-addition-card-light", entity: "light.kitchen", name: "Updated" });
    await element.updateComplete;
    expect(element.shadowRoot.textContent).toContain("Updated");
    element.remove();
  });

  it("applies Mushroom-style layout, fill, icon, and information choices", async () => {
    const markup = await render("mushroom-addition-card-light", {
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen",
      layout: "vertical",
      fill_container: true,
      icon_type: "none",
      primary_info: "state",
      secondary_info: "none",
    });
    expect(markup).toContain("layout-vertical");
    expect(markup).toContain("fill-container");
    expect(markup).not.toContain("light-icon");
    expect(markup).toContain("on");
    expect(markup).not.toContain("Kitchen");
  });

  it("normalizes hidden legacy tags to their unified component variant", async () => {
    const markup = await render("mushroom-addition-custom-card-person-info-small", {
      type: "custom:mushroom-addition-custom-card-person-info-small",
      entity: "person.joris",
    });
    expect(markup).toContain("variant-small");
    expect(markup).toContain("is-compact");
  });

  it("renders detailed and native weather variants distinctly", async () => {
    const detailed = await render("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.home",
      variant: "detailed",
      show_forecast: true,
    });
    const native = await render("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.home",
      variant: "native",
      show_forecast: true,
    });
    expect(detailed).toContain("legacy-weather");
    expect(detailed).toContain("legacy-weather-current");
    expect(detailed).toContain("legacy-weather-details");
    expect(native).toContain("weather-metrics");
    expect(native).not.toContain("weather-forecast");
  });

  it("renders Bar Card as a compact header and 35px progress bar without graph regions", async () => {
    const markup = await render("mushroom-addition-custom-card-bar-card", {
      type: "custom:mushroom-addition-custom-card-bar-card",
      entity: "sensor.memory",
      ulm_custom_card_bar_card_name: "Memory Usage",
      ulm_custom_card_bar_card_min: 0,
      ulm_custom_card_bar_card_max: 100,
      ulm_custom_card_bar_card_value: true,
      ulm_custom_card_bar_card_color: "#81c995",
      ulm_custom_card_bar_card_icon: "mdi:memory",
    });
    expect(markup).toContain("minimalist-bar-card");
    expect(markup).toContain("bar-card-header");
    expect(markup).toContain("bar-card-icon");
    expect(markup).toContain("bar-card-primary-value");
    expect(markup).toContain("bar-card-name");
    expect(markup).toContain("bar-card-track");
    expect(markup).toContain("bar-card-fill");
    expect(markup).toContain("bar-card-inside-value");
    expect(markup).toContain("width:17.7%");
    expect(markup).not.toContain("sparkline");
    expect(markup).not.toContain("metric-extremes");
    expect(markup).not.toContain("ulm-metric");
  });

  it.each([
    ["card_battery", "mushroom-addition-card-battery", "sensor.battery", "ulm-default-battery", "battery-track"],
    ["card_binary_sensor", "mushroom-addition-card-binary-sensor", "binary_sensor.window", "ulm-binary", "sparkline"],
    ["card_binary_sensor_alert", "mushroom-addition-card-binary-sensor-alert", "binary_sensor.window", "variant-alert", "sparkline"],
    ["card_cover", "mushroom-addition-card-cover", "cover.blind", "ulm-cover", "sparkline"],
    ["card_fan", "mushroom-addition-card-fan", "fan.fixture", "ulm-fan", "sparkline"],
    ["card_generic", "mushroom-addition-card-generic", "sensor.power", "value-first", "sparkline"],
    ["card_generic_swap", "mushroom-addition-card-generic-swap", "sensor.power", "ulm-generic-swap", "sparkline"],
    ["card_graph", "mushroom-addition-card-graph", "sensor.power", "ulm-default-graph", "ulm-light-slider"],
    ["card_input_boolean", "mushroom-addition-card-input-boolean", "sensor.power", "ulm-simple-default", "sparkline"],
    ["card_light", "mushroom-addition-card-light", "light.kitchen", "ulm-light-card", "sparkline"],
    ["card_media_player", "mushroom-addition-card-media-player", "media_player.tv", "ulm-media", "sparkline"],
    ["card_navigate", "mushroom-addition-card-navigate", "sensor.power", "ulm-default-navigation", "sparkline"],
    ["card_person", "mushroom-addition-card-person", "person.joris", "ulm-person", "sparkline"],
    ["card_power_outlet", "mushroom-addition-card-power-outlet", "sensor.power", "ulm-simple-default", "sparkline"],
    ["card_room", "mushroom-addition-card-room", "light.kitchen", "ulm-room", "sparkline"],
    ["card_scenes", "mushroom-addition-card-scenes", "scene.relax", "scene-pills", "sparkline"],
    ["card_script", "mushroom-addition-card-script", "sensor.power", "ulm-simple-default", "sparkline"],
    ["card_thermostat", "mushroom-addition-card-thermostat", "climate.living", "ulm-climate", "sparkline"],
    ["card_title", "mushroom-addition-card-title", "sensor.power", "ulm-title", "ulm-icon"],
    ["card_vacuum", "mushroom-addition-card-vacuum", "vacuum.robot", "ulm-default-vacuum", "sparkline"],
    ["card_vertical_button", "mushroom-addition-card-vertical-button", "light.kitchen", "ulm-vertical-button", "sparkline"],
    ["card_weather", "mushroom-addition-card-weather", "weather.home", "legacy-weather", "ulm-light-slider"],
    ["card_weather_ulm", "mushroom-addition-card-weather-ulm", "weather.home", "weather-metrics", "legacy-weather"],
    ["card_welcome_scenes", "mushroom-addition-card-welcome-scenes", "scene.relax", "welcome-scenes", "sparkline"],
  ])("enforces the %s visual structure", async (_id, tag, entity, required, forbidden) => {
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: entity.startsWith("scene.") ? ["scene.relax"] : undefined,
      show_controls: true,
      ulm_card_fan_enable_slider: true,
      ulm_card_light_enable_slider: true,
    });
    expect(markup).toContain(required);
    expect(markup).not.toContain(forbidden);
  });

  it("wires the Minimalist light slider to a valid Home Assistant service", async () => {
    const callService = vi.fn(async () => undefined);
    const element = document.createElement("mushroom-addition-card-light") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = { ...hass, callService };
    element.setConfig({
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen",
      ulm_card_light_enable_slider: true,
    });
    document.body.append(element);
    await element.updateComplete;
    const slider = element.shadowRoot.querySelector<HTMLInputElement>(".ulm-light-slider input")!;
    slider.value = "50";
    slider.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(callService).toHaveBeenCalledWith("light", "turn_on", {
      entity_id: "light.kitchen",
      brightness_pct: 50,
    });
    element.remove();
  });

  it("does not render service controls for incompatible entity domains", async () => {
    const markup = await render("mushroom-addition-card-cover", {
      type: "custom:mushroom-addition-card-cover",
      entity: "sensor.power",
      show_controls: true,
      ulm_card_cover_enable_slider: true,
    });
    expect(markup).not.toContain("ulm-control");
    expect(markup).not.toContain("ulm-light-slider");
  });

  it.each([
    ["climate", "mushroom-addition-card-thermostat", "climate.living", "ulm-climate"],
    ["light", "mushroom-addition-card-light", "light.kitchen", "ulm-light"],
    ["scene", "mushroom-addition-card-scenes", "scene.relax", "scene-grid"],
    ["person", "mushroom-addition-card-person", "person.joris", "ulm-person"],
    ["battery", "mushroom-addition-card-battery", "sensor.battery", "ulm-default-battery"],
    ["energy", "mushroom-addition-card-graph", "sensor.power", "sparkline"],
    ["media", "mushroom-addition-card-media-player", "media_player.tv", "ulm-media"],
    ["cover", "mushroom-addition-card-cover", "cover.blind", "ulm-controls"],
    ["vacuum", "mushroom-addition-card-vacuum", "vacuum.robot", "ulm-default-vacuum"],
    ["security", "mushroom-addition-custom-card-eraycetinay-lock", "alarm_control_panel.home", "ulm-security"],
  ])("renders distinct %s markup", async (_family, tag, entity, marker) => {
    const item = CATALOG.find((entry) => entry.tag === tag)!;
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: item.family === "scene" ? ["scene.relax"] : undefined,
      show_controls: true,
      show_graph: true,
    });
    expect(markup).toContain(marker);
  });

  it("keeps deterministic family-level visual signatures", async () => {
    const signatures = {
      weather: familySignature(await render("mushroom-addition-card-weather", { type: "custom:mushroom-addition-card-weather", entity: "weather.home", show_forecast: true })),
      climate: familySignature(await render("mushroom-addition-card-thermostat", { type: "custom:mushroom-addition-card-thermostat", entity: "climate.living", show_controls: true })),
      light: familySignature(await render("mushroom-addition-card-light", { type: "custom:mushroom-addition-card-light", entity: "light.kitchen", show_controls: true })),
      scene: familySignature(await render("mushroom-addition-card-scenes", { type: "custom:mushroom-addition-card-scenes", entity: "scene.relax", entities: ["scene.relax"] })),
      person: familySignature(await render("mushroom-addition-card-person", { type: "custom:mushroom-addition-card-person", entity: "person.joris" })),
      battery: familySignature(await render("mushroom-addition-card-battery", { type: "custom:mushroom-addition-card-battery", entity: "sensor.battery" })),
      energy: familySignature(await render("mushroom-addition-card-graph", { type: "custom:mushroom-addition-card-graph", entity: "sensor.power" })),
      media: familySignature(await render("mushroom-addition-card-media-player", { type: "custom:mushroom-addition-card-media-player", entity: "media_player.tv" })),
    };
    expect(signatures).toMatchInlineSnapshot(`
      {
        "battery": [
          "ulm-row",
          "ulm-default-battery",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "climate": [
          "ulm-climate",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
          "ulm-controls",
          "ulm-control",
        ],
        "energy": [
          "ulm-default-graph",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "light": [
          "ulm-light-card",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
          "ulm-light-slider",
        ],
        "media": [
          "ulm-media",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
          "ulm-controls",
          "ulm-control",
        ],
        "person": [
          "ulm-row",
          "ulm-person",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "scene": [
          "ulm-scenes",
        ],
        "weather": [
          "ulm-weather",
        ],
      }
    `);
  });
});
