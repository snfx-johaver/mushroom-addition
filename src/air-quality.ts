import type { AdditionConfig, HomeAssistant } from "./types";

export const AIR_QUALITY_KINDS = ["temperature", "humidity", "co2", "pm25", "voc", "mould", "radon", "pressure", "custom"] as const;
export type AirQualityKind = typeof AIR_QUALITY_KINDS[number];
export interface AirQualitySensor {
  kind: AirQualityKind;
  entity?: string;
  name?: string;
  enabled?: boolean;
  icon?: string;
  color?: string;
  unit?: string;
  decimals?: number;
  warning_above?: number;
  poor_above?: number;
  bad_above?: number;
  warning_below?: number;
  bad_below?: number;
}
export interface AirQualityOptions {
  air_quality_sensors?: AirQualitySensor[];
  air_quality_show_header?: boolean;
  air_quality_show_title?: boolean;
  air_quality_show_icon?: boolean;
  air_quality_show_badge?: boolean;
}
interface MetricDefaults {
  name: string; icon: string; decimals: number; unit: string;
  warning_above?: number; poor_above?: number; bad_above?: number;
  warning_below?: number; bad_below?: number;
}
export const AIR_QUALITY_DEFAULTS: Record<AirQualityKind, MetricDefaults> = {
  temperature: { name: "Temperature", icon: "mdi:thermometer", decimals: 1, unit: "°", warning_above: 24, bad_above: 27, warning_below: 19, bad_below: 15 },
  humidity: { name: "Humidity", icon: "mdi:water-percent", decimals: 0, unit: "%", warning_above: 60, bad_above: 70, warning_below: 30, bad_below: 25 },
  co2: { name: "CO₂", icon: "mdi:molecule-co2", decimals: 0, unit: "", warning_above: 800, poor_above: 1000, bad_above: 1400 },
  pm25: { name: "PM2.5", icon: "mdi:blur", decimals: 1, unit: "", warning_above: 12, poor_above: 25, bad_above: 35 },
  voc: { name: "VOC", icon: "mdi:air-filter", decimals: 0, unit: "", warning_above: 250, poor_above: 1000, bad_above: 2000 },
  mould: { name: "Mould risk", icon: "mdi:mushroom", decimals: 0, unit: "", warning_above: 60, poor_above: 70, bad_above: 80 },
  radon: { name: "Radon", icon: "mdi:radioactive", decimals: 0, unit: "", warning_above: 50, poor_above: 100, bad_above: 150 },
  pressure: { name: "Pressure", icon: "mdi:gauge", decimals: 0, unit: "", warning_above: 1030, warning_below: 990 },
  custom: { name: "Sensor", icon: "mdi:air-filter", decimals: 0, unit: "" },
};
export const AIR_QUALITY_STATES = [
  { name: "Good", icon: "mdi:emoticon-happy-outline", color: "green" },
  { name: "Fair", icon: "mdi:emoticon-neutral-outline", color: "amber" },
  { name: "Poor", icon: "mdi:emoticon-sad-outline", color: "orange" },
  { name: "Very poor", icon: "mdi:emoticon-dead-outline", color: "red" },
  { name: "Unknown", icon: "mdi:help-circle-outline", color: "grey" },
] as const;

export function airQualityValue(hass: HomeAssistant, row: AirQualitySensor): number | undefined {
  const raw = row.entity ? hass.states[row.entity]?.state : undefined;
  if (!raw?.trim() || !Number.isFinite(Number(raw))) return undefined;
  const value = Number(raw);
  if (["humidity", "mould"].includes(row.kind) && (value < 0 || value > 100)) return undefined;
  if (["co2", "pm25", "voc", "radon", "pressure"].includes(row.kind) && value < 0) return undefined;
  return value;
}
export function airQualityAnalysisValue(hass: HomeAssistant, row: AirQualitySensor): number | undefined {
  const value = airQualityValue(hass, row);
  if (value === undefined) return undefined;
  const unit = String(hass.states[row.entity ?? ""]?.attributes.unit_of_measurement ?? "")
    .toLowerCase().replaceAll("μ", "u").replaceAll("µ", "u").replaceAll("³", "3").replaceAll(" ", "");
  if (!unit || row.kind === "custom") return value;
  switch (row.kind) {
    case "temperature": return unit === "°f" ? (value - 32) * 5 / 9 : unit === "k" ? value - 273.15 : unit === "°c" ? value : undefined;
    case "humidity": case "mould": return unit === "%" ? value : undefined;
    case "co2": return unit === "ppm" ? value : undefined;
    case "pm25": return ["ug/m3", "ug/m^3"].includes(unit) ? value : unit === "mg/m3" ? value * 1000 : undefined;
    case "voc": return unit === "ppb" ? value : unit === "ppm" ? value * 1000 : undefined;
    case "radon": return unit === "pci/l" ? value * 37 : ["bq/m3", "bq/m^3"].includes(unit) ? value : undefined;
    case "pressure": return ["hpa", "mbar"].includes(unit) ? value : unit === "pa" ? value / 100 : unit === "kpa" ? value * 10 : unit === "inhg" ? value * 33.8638866667 : undefined;
  }
}
export function airQualitySeverity(row: AirQualitySensor, value: number): number {
  const settings = { ...AIR_QUALITY_DEFAULTS[row.kind], ...row };
  const above = (limit?: number) => limit !== undefined && (row.kind === "mould" ? value >= limit : value > limit);
  const below = (limit?: number) => limit !== undefined && (["temperature", "humidity"].includes(row.kind) ? value <= limit : value < limit);
  if (above(settings.bad_above) || below(settings.bad_below)) return 3;
  if (above(settings.poor_above)) return 2;
  if (above(settings.warning_above) || below(settings.warning_below)) return 1;
  return 0;
}
export function airQualityColor(row: AirQualitySensor, value?: number): string {
  if (value === undefined) return "grey";
  if (row.color) return row.color;
  const settings = { ...AIR_QUALITY_DEFAULTS[row.kind], ...row };
  if (row.kind === "temperature") {
    if (settings.bad_below !== undefined && value <= settings.bad_below) return "blue";
    if (settings.warning_above !== undefined && value > settings.warning_above && airQualitySeverity(row, value) === 1) return "orange";
  }
  if (row.kind === "pressure" && settings.warning_below !== undefined && value < settings.warning_below) return "orange";
  return AIR_QUALITY_STATES[airQualitySeverity(row, value)].color;
}
export function airQualityStatus(hass: HomeAssistant, config: AdditionConfig): typeof AIR_QUALITY_STATES[number] {
  if (config.entity) {
    const state = hass.states[config.entity]?.state.toLowerCase().trim().replace(/[_-]+/g, " ");
    const aliases = [
      ["good", "excellent", "healthy", "very good"],
      ["fair", "moderate", "acceptable"],
      ["poor", "unhealthy for sensitive groups"],
      ["very poor", "bad", "unhealthy", "very unhealthy", "hazardous", "severe"],
    ];
    const index = aliases.findIndex(values => values.includes(state ?? ""));
    return AIR_QUALITY_STATES[index < 0 ? 4 : index];
  }
  const readings = (config.air_quality_sensors ?? [])
    .filter(row => row.enabled !== false && ["co2", "pm25", "voc", "radon"].includes(row.kind))
    .flatMap(row => {
      const value = airQualityAnalysisValue(hass, row);
      return value === undefined ? [] : [airQualitySeverity(row, value)];
    });
  return AIR_QUALITY_STATES[readings.length ? Math.max(...readings) : 4];
}
export function validateAirQuality(config: AdditionConfig): void {
  if (config.air_quality_sensors !== undefined && !Array.isArray(config.air_quality_sensors)) throw new Error("Air Quality sensors must be a list.");
  for (const row of config.air_quality_sensors ?? []) {
    if (!row || !AIR_QUALITY_KINDS.includes(row.kind)) throw new Error("Choose a valid Air Quality sensor type.");
    if (row.decimals !== undefined && (!Number.isInteger(row.decimals) || row.decimals < 0 || row.decimals > 3)) {
      throw new Error("Decimal places must be between 0 and 3.");
    }
    for (const key of ["warning_above", "poor_above", "bad_above", "warning_below", "bad_below"] as const) {
      if (row[key] !== undefined && (typeof row[key] !== "number" || !Number.isFinite(row[key]))) throw new Error("Thresholds must be finite numbers.");
    }
    const settings = { ...AIR_QUALITY_DEFAULTS[row.kind], ...row };
    const upper = [settings.warning_above, settings.poor_above, settings.bad_above].filter((v): v is number => v !== undefined);
    if (upper.some((v, i) => i > 0 && v < upper[i - 1])) throw new Error("Upper thresholds must increase from warning to very poor.");
    if (settings.bad_below !== undefined && settings.warning_below !== undefined && settings.bad_below > settings.warning_below) {
      throw new Error("The very poor lower threshold must not exceed the warning lower threshold.");
    }
  }
}
export function airQualityStub(hass?: HomeAssistant): AdditionConfig {
  const sensors = Object.values(hass?.states ?? {}).filter(e => e.entity_id.startsWith("sensor.") &&
    e.state.trim() !== "" && Number.isFinite(Number(e.state)));
  const primary = sensors.find(e => e.attributes.device_class === "carbon_dioxide" || /_co2$/.test(e.entity_id));
  const device = primary ? hass?.entities?.[primary.entity_id]?.device_id : undefined;
  const related = device ? sensors.filter(e => hass?.entities?.[e.entity_id]?.device_id === device) : primary ? [primary] : [];
  const classes: Partial<Record<AirQualityKind, string>> = { co2: "carbon_dioxide", pm25: "pm25", voc: "volatile_organic_compounds_parts",
    temperature: "temperature", humidity: "humidity", pressure: "atmospheric_pressure", radon: "radon" };
  return {
    type: "custom:mushroom-addition-air-quality", name: "Air Quality", icon: "mdi:air-filter",
    air_quality_show_header: true, air_quality_show_title: true,
    air_quality_show_icon: true, air_quality_show_badge: true,
    air_quality_sensors: AIR_QUALITY_KINDS.filter(k => classes[k]).flatMap(kind => {
      const matches = related.filter(e => e.attributes.device_class === classes[kind] || (kind === "co2" && e === primary));
      return matches.length === 1 ? [{ kind, entity: matches[0].entity_id }] : [];
    }),
  };
}
