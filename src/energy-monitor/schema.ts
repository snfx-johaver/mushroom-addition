import type { NativeFields } from "../energy-editor-schema";
import type { EditorField } from "../editor-schema";
import { monitorOptions, type MonitorKind } from "./config";

const text = (label: string, value?: string) => ({ label, selector: { text: {} }, ...(value === undefined ? {} : { default: value }) });
const number = (label: string, min: number, max: number, value: number) => ({ label, default: value, selector: { number: { min, max, step: "any", mode: "box" } } });
const select = (label: string, options: Array<{ value: string; label: string }>, value?: string) => ({
  label, selector: { select: { options, mode: "dropdown" } }, ...(value === undefined ? {} : { default: value }),
});
const sourceFields: NativeFields = {
  entity: { label: "Entity", selector: { entity: { domain: "sensor" } } },
  field: text("Field"),
};
const meterFields: NativeFields = {
  ...sourceFields,
  sourceType: select("Counter type", [
    { value: "unspecified", label: "Not specified" }, { value: "hardware", label: "Hardware counter" }, { value: "integrated_power", label: "Integrated power" },
  ]),
};
const object = (fields: NativeFields) => ({ object: { fields, multiple: false, label_field: "entity" in fields ? "entity" : Object.keys(fields)[0] } });
const source = (label: string, absent = false) => ({
  label, selector: object({ ...sourceFields, ...(absent ? { absent: { label: "Not installed", selector: { boolean: {} } } } : {}) }),
});
const meter = (label: string, absent = false) => ({
  label, selector: object({ ...meterFields, ...(absent ? { absent: { label: "Not installed", selector: { boolean: {} } } } : {}) }),
});
export function monitorFields(kind: MonitorKind): NativeFields {
  const common: NativeFields = {
    maxContentWidth: number("Maximum content width", 0, 2400, 1200),
  };
  const freshness = { maxAgeMinutes: number("Maximum source age (minutes)", 1, 10080, 15) };
  if (kind === "live_energy_flow") return {
    ...common, ...freshness, solar: source("Solar power", true), home: source("Home power"), grid: source("Grid power"), battery: source("Battery power", true),
    ev: source("EV power", true),
    solarToEv: source("Solar to EV"), batteryToEv: source("Battery to EV"),
    gridPositive: select("Positive grid power", [{ value: "import", label: "Importing" }, { value: "export", label: "Exporting" }], "import"),
    batteryPositive: select("Positive battery power", [{ value: "charge", label: "Charging" }, { value: "discharge", label: "Discharging" }], "charge"),
    deriveHome: { label: "Calculate household power", default: false, selector: { boolean: {} } },
    homeBoundary: select("Measurement boundary", [{ value: "excludes_battery_charging", label: "Excludes battery charging" }]),
  };
  if (kind === "battery_activity") return {
    ...common, ...freshness, battery: source("Battery power"), soc: source("Battery level"),
    batteryPositive: select("Positive battery power", [{ value: "charge", label: "Charging" }, { value: "discharge", label: "Discharging" }], "charge"),
    maxGapMinutes: number("Maximum history gap (minutes)", 1, 1440, 30),
    chargeEnergy: meter("Charge energy sensor"), dischargeEnergy: meter("Discharge energy sensor"),
  };
  if (kind === "electricity_cost_timeline") return {
    ...common, importEnergy: meter("Grid import energy sensor"), exportEnergy: meter("Grid export energy sensor", true),
    importRate: source("Import rate sensor"), exportRate: source("Export rate sensor"),
    fixedExportRate: { label: "Fixed export rate", selector: { number: { min: -1000000, max: 1000000, step: "any", mode: "box" } } },
    currency: text("Currency"),
  };
  return {
    ...common,
    baseline: { label: "Retained baseline", selector: object({
      entity: sourceFields.entity,
      path: text("Path", "intervals"), generatedField: text("Generated field", "generated"),
      startField: text("Start", "start"), endField: text("End", "end"), valueField: text("Energy", "energy"),
      unit: select("Unit", [{ value: "kWh", label: "kWh" }, { value: "Wh", label: "Wh" }], "kWh"),
    }) },
    actualEnergy: meter("Measured energy sensor"),
  };
}
export function monitorFeature(kind: MonitorKind): EditorField {
  const options = monitorOptions({ type: "" });
  const fields = Object.fromEntries(Object.entries(monitorFields(kind)).map(([key, spec]) => [
    key, { ...spec, ...(key in options && key !== "baseline" ? { default: Reflect.get(options, key) } : {}) },
  ]));
  return { name: "energy_monitor", selector: object(fields) };
}
