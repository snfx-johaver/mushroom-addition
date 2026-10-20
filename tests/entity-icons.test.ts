import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "lit";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { populatedDefaultsFor } from "../src/defaults";
import { renderEntityIcon } from "../src/entity-icon";
import { clearCardIcon, normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";

const entity: HassEntity = { entity_id: "sensor.test_temperature", state: "21",
  attributes: { device_class: "temperature", unit_of_measurement: "°C" } };
const hass: HomeAssistant = { states: { [entity.entity_id]: entity }, config: { unit_system: { temperature: "°C" } },
  entities: {}, callService: vi.fn() };
afterEach(() => document.body.replaceChildren());

describe("entity-driven default header icons", () => {
  it.each(CATALOG)("does not freeze a recommended header icon into $tag picker/editor defaults", item => {
    const defaults = populatedDefaultsFor(item, hass, entity.entity_id);
    expect(defaults.icon).toBeUndefined();
    expect(normalizeConfig(defaults).icon).toBeUndefined();
  });

  it.each(CATALOG.filter(item => !["card_battery", "card_welcome_scenes", "custom_card_welcome", "area_card_advanced"].includes(item.upstreamId)))(
    "uses native entity/device-class/state icons for $tag headers without an override", async item => {
      const card = document.createElement(item.tag) as HTMLElement & {
        hass: HomeAssistant; setConfig(config: AdditionConfig): void; updateComplete: Promise<boolean>;
      };
      card.hass = hass;
      card.setConfig({ type: `custom:${item.tag}`, entity: entity.entity_id, entities: [entity.entity_id],
        carousel_show_header: true, icon_type: "icon" });
      document.body.append(card);
      await card.updateComplete;
      const icon = card.shadowRoot?.querySelector<HTMLElement & { stateObj: HassEntity; _config: unknown }>("ha-state-icon");
      expect(icon, item.tag).not.toBeNull();
      expect(icon?.stateObj).toBe(entity);
      expect(icon?._config).toBe(hass.config);
    },
  );

  it("honors explicit and entity icon overrides, with a card fallback only when no entity is available", () => {
    const host = document.createElement("div");
    render(renderEntityIcon(hass, { ...entity, attributes: { icon: "mdi:thermometer" } }), host);
    expect((host.querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:thermometer");
    render(renderEntityIcon(hass, entity, "mdi:star"), host);
    expect((host.querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:star");
    render(renderEntityIcon(hass, undefined, undefined, "mdi:weather-sunny"), host);
    expect((host.querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:weather-sunny");
  });

  it("does not mistake linked metric/control icons for a header override, while retaining real legacy header overrides", () => {
    expect(normalizeConfig({ type: "custom:mushroom-addition-custom-card-nas-metrics",
      disk_icon: "mdi:harddisk", temperature_icon: "mdi:thermometer" }).icon).toBeUndefined();
    const config = { type: "custom:mushroom-addition-card-media-player", ulm_card_media_player_icon: "mdi:television" };
    expect(normalizeConfig(config).icon).toBe("mdi:television");
    expect(normalizeConfig(clearCardIcon(config)).icon).toBeUndefined();
  });
});
