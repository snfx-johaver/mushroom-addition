import type { AdditionConfig } from "../types";
export type { HassEntity, HomeAssistant } from "../types";

export interface FieldMapping {
  maxSourceAgeMinutes?: number;
  path?: string;
  startField?: string;
  endField?: string;
  durationField?: string;
  valueField?: string;
  priceField?: string;
  powerField?: string;
  energyField?: string;
  statusField?: string;
  powerUnit?: string;
  energyUnit?: string;
  unit?: string;
}

export interface PriceConfig extends FieldMapping {
  entity: string;
  adapter?: "attribute" | "state";
  sourceUnit?: PriceUnit;
  displayUnit?: PriceUnit;
  currency?: string;
}

export type PriceUnit = `${Uppercase<string>}/kWh` | `${Uppercase<string>}/MWh` | "ct/kWh";

export interface ForecastConfig extends FieldMapping {
  entity: string;
}

export interface ValueSource {
  maxSourceAgeMinutes?: number;
  entity?: string;
  value?: number;
  field?: string;
}

export interface BatteryConfig {
  current?: ValueSource;
  forecast?: ForecastConfig;
  horizon?: ValueSource & { unit?: "hours" };
  target?: ValueSource;
}

export interface TrackConfig extends FieldMapping {
  meaning?: "supplied" | "confirmed";
  entity?: string;
  path?: string;
  kind?: "schedule" | "solar";
  unit?: string;
}

export interface PeriodConfig {
  name: string;
  startHour: number;
  endHour: number;
}

export interface SmartSavingConfig extends AdditionConfig {
  type: "custom:mushroom-addition-smart-saving";
  title?: string;
  subtitle?: string;
  statusEntity?: string;
  visibleHours?: number;
  maxContentWidth?: number;
  horizon?: "configured" | "published";
  maxSourceAgeMinutes?: number;
  forecastGapMinutes?: number;
  price?: PriceConfig;
  battery?: BatteryConfig;
  tracks?: {
    plan?: TrackConfig;
    applied?: TrackConfig;
    ev?: TrackConfig;
    solar?: TrackConfig;
  };
  summary?: {
    purchaseEnergy?: ValueSource;
    purchaseCost?: ValueSource;
  };
  periods?: PeriodConfig[];
  planBlocksEntity?: string;
  planBlocksPath?: string;
}

export interface TimeInterval {
  start: number;
  end: number;
  value: number;
  source?: Record<string, unknown>;
}

export interface TimePoint {
  time: number;
  value: number;
}

export interface ScheduleBlock extends TimeInterval {
  power?: string | number;
  energy?: string | number;
  status?: string;
}

export interface PeriodAverage {
  name: string;
  date: string;
  average: number | null;
  minimum: number | null;
  maximum: number | null;
  coverage: "missing" | "partial" | "complete";
}
