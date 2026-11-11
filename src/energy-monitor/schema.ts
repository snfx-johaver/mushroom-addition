import type { NativeFields } from "../energy-editor-schema";
import type { EditorField } from "../editor-schema";
import { monitorOptions } from "./config";

const text = (label: string, value?: string) => ({ label, selector: { text: {} }, ...(value === undefined ? {} : { default: value }) });
const number = (label: string, min: number, max: number, value: number) => ({ label, default: value, selector: { number: { min, max, step: "any", mode: "box" } } });
const select = (label: string, options: Array<{ value: string; label: string }>, value?: string) => ({
  label, selector: { select: { options, mode: "dropdown" } }, ...(value === undefined ? {} : { default: value }),
});
const sourceFields: NativeFields = {
  entity: { label: "Entity", selector: { entity: { domain: "sensor" } } },
  field: text("Field"),
};
const object = (fields: NativeFields) => ({ object: { fields, multiple: false, label_field: "entity" in fields ? "entity" : Object.keys(fields)[0] } });
const source = (label: string, absent = false) => ({
  label, selector: object({ ...sourceFields, ...(absent ? { absent: { label: "Not installed", selector: { boolean: {} } } } : {}) }),
});
export function monitorFields(): NativeFields {
  const common: NativeFields = {
    maxContentWidth: number("Maximum content width", 0, 2400, 1200),
  };
  const freshness = { maxAgeMinutes: number("Maximum source age (minutes)", 1, 10080, 15) };
  return {
    ...common, ...freshness, solar: source("Solar power", true), home: source("Home power"), grid: source("Grid power"), battery: source("Battery power", true),
    ev: source("EV power", true),
    solarToEv: source("Solar to EV"), batteryToEv: source("Battery to EV"),
    gridPositive: select("Positive grid power", [{ value: "import", label: "Importing" }, { value: "export", label: "Exporting" }], "import"),
    batteryPositive: select("Positive battery power", [{ value: "charge", label: "Charging" }, { value: "discharge", label: "Discharging" }], "charge"),
    deriveHome: { label: "Calculate household power", default: false, selector: { boolean: {} } },
    homeBoundary: select("Measurement boundary", [{ value: "excludes_battery_charging", label: "Excludes battery charging" }]),
  };
}
export function monitorFeature(): EditorField {
  const options = monitorOptions({ type: "" });
  const fields = Object.fromEntries(Object.entries(monitorFields()).map(([key, spec]) => [
    key, { ...spec, ...(key in options && key !== "baseline" ? { default: Reflect.get(options, key) } : {}) },
  ]));
  return { name: "energy_monitor", selector: object(fields) };
}
