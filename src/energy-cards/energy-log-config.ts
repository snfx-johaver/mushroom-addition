import type { AdditionConfig, HomeAssistant } from "../types";
import { localizeText } from "../localize";

export interface EnergyLogCategory {
  id: string;
  label: string;
  color?: string;
  icon?: string;
}

export interface EnergyLogSource {
  id: string;
  entity: string;
  adapter?: "attribute" | "state";
  path?: string;
  timestampField?: string;
  categoryField?: string;
  titleField?: string;
  detailField?: string;
  descriptionField?: string;
  sourceField?: string;
}

export interface EnergyLogConfig extends AdditionConfig {
  type: "custom:mushroom-addition-energy-log";
  title?: string;
  subtitle?: string;
  icon?: string;
  sources: EnergyLogSource[];
  allIcon?: string;
  categories: EnergyLogCategory[];
  limit?: number;
  sortOrder?: "newest" | "oldest";
  timeZone?: string;
  clockFormat?: "12" | "24";
  showSource?: boolean;
  footer?: string;
  emptyState?: string;
}

export interface EnergyLogEntry {
  id: string;
  timestamp: number;
  category: EnergyLogCategory;
  title: string;
  detail: string;
  description: string;
  source: string;
}

export interface EnergyLogResult {
  entries: EnergyLogEntry[];
  errors: string[];
  validSources: number;
}

export const ENERGY_LOG_TAG = "mushroom-addition-energy-log";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, label: string, required = false): void {
  if ((required || value !== undefined) && (typeof value !== "string" || (required && !value.trim()))) {
    throw new Error(`${label} must be ${required ? "non-empty " : ""}text.`);
  }
}

export function validateEnergyLogConfig(value: unknown): EnergyLogConfig {
  if (!isRecord(value)) throw new Error("Energy Log configuration must be an object.");
  if (value.type !== `custom:${ENERGY_LOG_TAG}`) throw new Error(`Card type must be "custom:${ENERGY_LOG_TAG}".`);
  if (!Array.isArray(value.sources) || value.sources.length === 0) {
    throw new Error("Configure at least one Energy Log source.");
  }
  if (!Array.isArray(value.categories) || value.categories.length === 0) {
    throw new Error("Configure at least one Energy Log category.");
  }
  const categories = new Map<string, EnergyLogCategory>();
  for (const category of value.categories) {
    if (!isRecord(category)) throw new Error("Each Energy Log category must be an object.");
    text(category.id, "Category ID", true);
    text(category.label, `Category ${category.id} label`, true);
    text(category.color, `Category ${category.id} color`);
    text(category.icon, `Category ${category.id} icon`);
    if (categories.has(category.id as string)) throw new Error(`Duplicate Energy Log category ID: ${category.id}.`);
    categories.set(category.id as string, category as unknown as EnergyLogCategory);
  }
  const sourceIds = new Set<string>();
  const mappingFields = [
    "adapter", "path", "timestampField", "categoryField", "titleField", "detailField",
    "descriptionField", "sourceField",
  ] as const;
  for (const source of value.sources) {
    if (!isRecord(source)) throw new Error("Each Energy Log source must be an object.");
    text(source.id, "Source ID", true);
    text(source.entity, `Source ${String(source.id)} entity`, true);
    if (!/^[a-z_]+\.[a-z0-9_]+$/.test(source.entity as string)) {
      throw new Error(`Source ${String(source.id)} requires a valid entity ID (for example sensor.example_log).`);
    }
    if (sourceIds.has(source.id as string)) throw new Error(`Duplicate Energy Log source ID: ${source.id}.`);
    sourceIds.add(source.id as string);
    if (source.adapter !== undefined && source.adapter !== "attribute" && source.adapter !== "state") {
      throw new Error(`Source ${String(source.id)} adapter must be "attribute" or "state".`);
    }
    for (const key of mappingFields) text(source[key], `Source ${String(source.id)} ${key}`);
    if (source.adapter !== "state" && (typeof source.path !== "string" || !source.path.trim())) {
      throw new Error(`Source ${String(source.id)} requires an attribute path.`);
    }
    for (const key of ["timestampField", "categoryField", "titleField"] as const) {
      if (typeof source[key] === "string" && !source[key].trim()) {
        throw new Error(`Source ${String(source.id)} ${key} cannot be empty.`);
      }
    }
  }
  for (const [key, label] of [
    ["title", "Title"], ["subtitle", "Subtitle"], ["icon", "Icon"], ["allIcon", "All icon"],
    ["timeZone", "Time zone"], ["footer", "Footer"], ["emptyState", "Empty state"],
  ] as const) text(value[key], label);
  if (value.limit !== undefined && (!Number.isInteger(value.limit) || (value.limit as number) < 1 || (value.limit as number) > 500)) {
    throw new Error("Entry limit must be a whole number between 1 and 500.");
  }
  if (value.sortOrder !== undefined && value.sortOrder !== "newest" && value.sortOrder !== "oldest") {
    throw new Error('Sort order must be "newest" or "oldest".');
  }
  if (value.clockFormat !== undefined && value.clockFormat !== "12" && value.clockFormat !== "24") {
    throw new Error('Clock format must be "12" or "24".');
  }
  if (value.showSource !== undefined && typeof value.showSource !== "boolean") {
    throw new Error("Show source must be a boolean.");
  }
  if (value.timeZone) {
    try {
      new Intl.DateTimeFormat("en", { timeZone: value.timeZone as string });
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      throw new Error(`Invalid time zone: ${String(value.timeZone)}.`);
    }
  }
  return value as unknown as EnergyLogConfig;
}

function readPath(value: unknown, path: string): unknown {
  if (!path) return value;
  return path.split(".").reduce<unknown>((current, key) =>
    isRecord(current) ? current[key] : undefined, value);
}

function entryText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export function readEnergyLogEntries(
  config: EnergyLogConfig,
  states: Record<string, { state: string; attributes: Record<string, unknown> }>,
): EnergyLogResult {
  const categories = new Map(config.categories.map(category => [category.id, category]));
  const entries: EnergyLogEntry[] = [];
  const errors: string[] = [];
  let validSources = 0;

  for (const source of config.sources) {
    const entity = states[source.entity];
    if (!entity) {
      errors.push(`${source.entity} is missing.`);
      continue;
    }
    if (entity.state === "unknown" || entity.state === "unavailable") {
      errors.push(`${source.entity} is ${entity.state}.`);
      continue;
    }
    let data: unknown = source.adapter === "state"
      ? (() => {
        try {
          return readPath(JSON.parse(entity.state) as unknown, source.path ?? "");
        } catch (error) {
          if (!(error instanceof SyntaxError)) throw error;
          return undefined;
        }
      })()
      : readPath(entity.attributes, source.path ?? "");
    if (typeof data === "string") {
      try {
        data = JSON.parse(data) as unknown;
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        // The source is reported below with a useful mapping error.
      }
    }
    if (!Array.isArray(data)) {
      errors.push(`${source.entity} does not contain a log list at the configured path.`);
      continue;
    }
    validSources++;
    data.forEach((item, index) => {
      if (!isRecord(item)) {
        errors.push(`${source.entity} entry ${index + 1} is not an object.`);
        return;
      }
      const timestampValue = readPath(item, source.timestampField ?? "timestamp");
      const timestampText = entryText(timestampValue);
      const timestamp = typeof timestampValue === "number" ? timestampValue
        : /^\d+(?:\.\d+)?$/.test(timestampText) ? Number(timestampText) : Date.parse(timestampText);
      const categoryId = entryText(readPath(item, source.categoryField ?? "category"));
      const category = categories.get(categoryId);
      const milliseconds = timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp;
      if (!Number.isFinite(timestamp) || !Number.isFinite(new Date(milliseconds).getTime()) || !category) {
        errors.push(!Number.isFinite(timestamp) || !Number.isFinite(new Date(milliseconds).getTime())
          ? `${source.entity} entry ${index + 1} has an invalid timestamp.`
          : `${source.entity} entry ${index + 1} references unknown category "${categoryId}".`);
        return;
      }
      entries.push({
        id: `${source.id}:${index}:${timestamp}`,
        timestamp: milliseconds,
        category,
        title: entryText(readPath(item, source.titleField ?? "title")),
        detail: entryText(readPath(item, source.detailField ?? "detail")),
        description: entryText(readPath(item, source.descriptionField ?? "description")),
        source: entryText(readPath(item, source.sourceField ?? "source")),
      });
    });
  }
  const direction = config.sortOrder === "oldest" ? 1 : -1;
  entries.sort((left, right) => direction * (left.timestamp - right.timestamp));
  return {
    entries: entries.slice(0, config.limit ?? 50),
    errors,
    validSources,
  };
}

export function energyLogStub(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): EnergyLogConfig {
  const config: EnergyLogConfig = {
    type: `custom:${ENERGY_LOG_TAG}`,
    icon: "mdi:timeline-text-outline",
    sources: [{
      id: "main",
      entity: "sensor.example_energy_log",
      adapter: "attribute",
      path: "entries",
      timestampField: "timestamp",
      categoryField: "category",
      titleField: "title",
      detailField: "detail",
      descriptionField: "description",
      sourceField: "source",
    }],
    categories: [
      { id: "planning", label: "Planning", color: "purple", icon: "mdi:clipboard-text-outline" },
      { id: "measurement", label: "Measurements", color: "teal", icon: "mdi:chart-line" },
      { id: "availability", label: "Availability", color: "amber", icon: "mdi:check-circle-outline" },
      { id: "maintenance", label: "Maintenance", color: "blue", icon: "mdi:wrench-outline" },
      { id: "general", label: "General", color: "purple", icon: "mdi:information-outline" },
    ],
    limit: 50,
    sortOrder: "newest",
    clockFormat: "24",
    showSource: true,
    emptyState: "No log entries.",
  };
  config.categories = config.categories.map(category => ({ ...category, label: localizeText(hass, category.label) }));
  config.emptyState = localizeText(hass, config.emptyState!);
  const ids = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])];
  const entity = ids.find(id => {
    const candidate = hass?.states[id];
    if (!candidate || ["unknown", "unavailable"].includes(candidate.state)) return false;
    const result = readEnergyLogEntries({ ...config, sources: [{ ...config.sources[0], entity: id }] }, { [id]: candidate });
    return result.validSources === 1 && result.errors.length === 0;
  });
  if (entity) config.sources[0].entity = entity;
  return config;
}
