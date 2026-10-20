import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { energyArcPath, formatPower, tariffIntervals } from "../src/energy-management";
import { createStubConfig } from "../src/stub";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const today = new Date();
today.setHours(0, 0, 0, 0);

const states: HomeAssistant["states"] = {
  "sensor.hems_house_consumption": {
    entity_id: "sensor.hems_house_consumption",
    state: "13920",
    attributes: { friendly_name: "HEMS house consumption", unit_of_measurement: "W", device_class: "power" },
  },
  "sensor.p1_meter_power": {
    entity_id: "sensor.p1_meter_power",
    state: "7200",
    attributes: { friendly_name: "P1 meter power", unit_of_measurement: "W" },
  },
  ...Object.fromEntries([1, 2, 3].map((phase, index) => [
    `sensor.p1_meter_power_phase_${phase}`,
    {
      entity_id: `sensor.p1_meter_power_phase_${phase}`,
      state: String([3770, 1580, 1850][index]),
      attributes: { friendly_name: `P1 meter power phase ${phase}`, unit_of_measurement: "W" },
    },
  ])),
  "sensor.hems_pv_power": {
    entity_id: "sensor.hems_pv_power",
    state: "6710",
    attributes: { friendly_name: "HEMS PV power", unit_of_measurement: "W" },
  },
  "sensor.energy_production_today": {
    entity_id: "sensor.energy_production_today",
    state: "17.9",
    attributes: { friendly_name: "Energy production today", unit_of_measurement: "kWh" },
  },
  "sensor.zendure_total_state_of_charge": {
    entity_id: "sensor.zendure_total_state_of_charge",
    state: "60",
    attributes: { friendly_name: "Zendure total state of charge", unit_of_measurement: "%" },
  },
  "sensor.zendure_power": {
    entity_id: "sensor.zendure_power",
    state: "0",
    attributes: { friendly_name: "Zendure power", unit_of_measurement: "W" },
  },
  ...Object.fromEntries([1, 2, 3].flatMap((unit) => [
    [`sensor.zendure_${unit}_state_of_charge`, {
      entity_id: `sensor.zendure_${unit}_state_of_charge`,
      state: "60",
      attributes: { friendly_name: `Zendure ${unit} state of charge`, unit_of_measurement: "%" },
    }],
    [`sensor.zendure_${unit}_power`, {
      entity_id: `sensor.zendure_${unit}_power`,
      state: "0",
      attributes: { friendly_name: `Zendure ${unit} power`, unit_of_measurement: "W" },
    }],
  ])),
  "sensor.alfen_eve_single_pro_active_power_total_socket_1": {
    entity_id: "sensor.alfen_eve_single_pro_active_power_total_socket_1",
    state: "11150",
    attributes: { friendly_name: "Alfen active power total socket 1", unit_of_measurement: "W" },
  },
  "input_select.zendure_operation_mode": {
    entity_id: "input_select.zendure_operation_mode",
    state: "Dynamic Smart Matching",
    attributes: { friendly_name: "Zendure operation mode" },
  },
  "input_boolean.hems_auto_control": {
    entity_id: "input_boolean.hems_auto_control",
    state: "on",
    attributes: { friendly_name: "HEMS auto control" },
  },
  "sensor.nordpool_kwh_nl_eur_3_10_021": {
    entity_id: "sensor.nordpool_kwh_nl_eur_3_10_021",
    state: "0.2",
    attributes: {
      friendly_name: "Nordpool kWh NL EUR",
      unit_of_measurement: "EUR/kWh",
      raw_today: [{
        start: new Date(today.getTime() + 13 * 60 * 60_000).toISOString(),
        end: new Date(today.getTime() + 14 * 60 * 60_000).toISOString(),
        value: 0.2,
      }],
    },
  },
  "sensor.hems_rate_markup": {
    entity_id: "sensor.hems_rate_markup",
    state: "0.03",
    attributes: { friendly_name: "HEMS rate markup" },
  },
  "input_number.hems_vat_percentage": {
    entity_id: "input_number.hems_vat_percentage",
    state: "21",
    attributes: { friendly_name: "HEMS VAT percentage", unit_of_measurement: "%" },
  },
};

const config: AdditionConfig = {
  type: "custom:mushroom-addition-advanced-home-energy-management",
  entity: "sensor.hems_house_consumption",
  grid_power_entity: "sensor.p1_meter_power",
  grid_phase_1_entity: "sensor.p1_meter_power_phase_1",
  grid_phase_2_entity: "sensor.p1_meter_power_phase_2",
  grid_phase_3_entity: "sensor.p1_meter_power_phase_3",
  solar_power_entity: "sensor.hems_pv_power",
  solar_forecast_entity: "sensor.energy_production_today",
  battery_level_entity: "sensor.zendure_total_state_of_charge",
  battery_power_entity: "sensor.zendure_power",
  battery_1_level_entity: "sensor.zendure_1_state_of_charge",
  battery_1_power_entity: "sensor.zendure_1_power",
  battery_2_level_entity: "sensor.zendure_2_state_of_charge",
  battery_2_power_entity: "sensor.zendure_2_power",
  battery_3_level_entity: "sensor.zendure_3_state_of_charge",
  battery_3_power_entity: "sensor.zendure_3_power",
  ev_charger_power_entity: "sensor.alfen_eve_single_pro_active_power_total_socket_1",
  energy_mode_entity: "input_select.zendure_operation_mode",
  energy_auto_control_entity: "input_boolean.hems_auto_control",
  electricity_price_entity: "sensor.nordpool_kwh_nl_eur_3_10_021",
  tariff_markup_entity: "sensor.hems_rate_markup",
  tariff_vat_entity: "input_number.hems_vat_percentage",
  show_grid_phases: true,
  show_battery_units: true,
  show_tariff_timeline: true,
  tap_action: { action: "navigate", navigation_path: "/hems-tower/savings-overview" },
};

afterEach(() => {
  document.body.replaceChildren();
});

describe("Advanced Energy - Home Energy Management", () => {
  it("registers as a native picker card with a complete graphical editor", () => {
    const item = CATALOG.find((candidate) =>
      candidate.upstreamId === "advanced_home_energy_management")!;
    expect(item).toMatchObject({
      tag: "mushroom-addition-advanced-home-energy-management",
      name: "Advanced Energy - Home Energy Management",
      family: "energy",
    });
    const fields = editorSchemaFor(item).flatMap((field) => field.schema ?? [field]);
    const names = fields.map(({ name }) => name);
    expect(names).toEqual(expect.arrayContaining([
      "entity",
      "grid_power_entity",
      "grid_phase_1_entity",
      "solar_power_entity",
      "battery_level_entity",
      "battery_3_power_entity",
      "energy_mode_entity",
      "energy_auto_control_entity",
      "electricity_price_entity",
      "tariff_markup_entity",
      "tariff_vat_entity",
      "grid_phase_scale_max",
      "price_critical_threshold",
      "import_color",
      "price_critical_color",
      "tap_action",
    ]));
    for (const name of names.filter((fieldName) =>
      fieldName === "entity" || fieldName.endsWith("_entity"))) {
      expect(fields.find((field) => field.name === name)?.selector).toHaveProperty("entity");
    }
  });

  it("discovers the source entities and navigation defaults", () => {
    const item = CATALOG.find((candidate) =>
      candidate.upstreamId === "advanced_home_energy_management")!;
    const hass: HomeAssistant = { states, callService: vi.fn(async () => undefined) };
    expect(createStubConfig(item, hass, Object.keys(states), [])).toMatchObject(config);
  });

  it("renders the circular live-flow dashboard without button-card or card-mod", async () => {
    const element = document.createElement(
      "mushroom-addition-advanced-home-energy-management",
    ) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(value: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states, language: "en-US", callService: vi.fn(async () => undefined) };
    element.setConfig(config);
    document.body.append(element);
    await element.updateComplete;
    const root = element.shadowRoot!;
    const svg = root.querySelector<SVGElement>(".hems-flow")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 760 650");
    expect(svg.textContent).toContain("7,20 kW");
    expect(svg.textContent).toContain("6,71 kW");
    expect(svg.textContent).toContain("13,92 kW");
    expect(svg.textContent).toContain("60%");
    expect(svg.textContent).toContain("GRID · Import");
    expect(svg.textContent).toContain("Battery");
    expect(svg.textContent).toContain("Solar Panels");
    expect(svg.textContent).toContain("HOME");
    expect(svg.textContent).toContain("Expected");
    expect(svg.textContent).toContain("Smart saving · Auto");
    expect(svg.textContent).toContain("EV charger 11,15 kW");
    expect(svg.textContent).toContain("Idle");
    expect(svg.textContent).not.toMatch(/afname|teruglevering|laden|ontladen|rust|laadpaal|verwacht|Accu|HUIS|ZENDURE|ZON/i);
    expect(svg.querySelectorAll(".hems-track").length).toBeGreaterThanOrEqual(8);
    expect(svg.querySelectorAll("rect").length).toBeGreaterThanOrEqual(2);
    expect(root.textContent).not.toContain("Panel health");
    expect(root.innerHTML).not.toContain("button-card");
    expect(root.innerHTML).not.toContain("card-mod");
  });

  it("calculates SVG arcs, power labels, and all-in tariff intervals", () => {
    expect(formatPower(7200)).toBe("7,20 kW");
    expect(energyArcPath(80, 0, 90)).toContain("A80 80");
    expect(tariffIntervals(
      states["sensor.nordpool_kwh_nl_eur_3_10_021"],
      0.03,
      21,
    )[0].price).toBeCloseTo(0.2783);
  });
});
