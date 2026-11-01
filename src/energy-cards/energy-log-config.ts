import type { AdditionConfig } from "../types";

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
export const ENERGY_LOG_EDITOR_TAG = "mushroom-addition-energy-log-features";

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
    ["title", "Title"], ["subtitle", "Subtitle"], ["icon", "Icon"],
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
    } catch {
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
        } catch {
          return undefined;
        }
      })()
      : readPath(entity.attributes, source.path ?? "");
    if (typeof data === "string") {
      try {
        data = JSON.parse(data) as unknown;
      } catch {
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
      if (!Number.isFinite(timestamp) || !category) {
        errors.push(!Number.isFinite(timestamp)
          ? `${source.entity} entry ${index + 1} has an invalid timestamp.`
          : `${source.entity} entry ${index + 1} references unknown category "${categoryId}".`);
        return;
      }
      entries.push({
        id: `${source.id}:${index}:${timestamp}`,
        timestamp: timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp,
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

export function energyLogStub(): EnergyLogConfig {
  return {
    type: `custom:${ENERGY_LOG_TAG}`,
    title: "Energy Log",
    subtitle: "Entity-backed event timeline",
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
      { id: "planning", label: "Planning", color: "#ab47bc", icon: "mdi:clipboard-text-outline" },
      { id: "measurement", label: "Measurements", color: "#26a69a", icon: "mdi:chart-line" },
      { id: "availability", label: "Availability", color: "#c58a2a", icon: "mdi:check-circle-outline" },
      { id: "maintenance", label: "Maintenance", color: "#4285d4", icon: "mdi:wrench-outline" },
      { id: "general", label: "General", color: "#8e63b5", icon: "mdi:information-outline" },
    ],
    limit: 50,
    sortOrder: "newest",
    clockFormat: "24",
    showSource: true,
    emptyState: "No log entries.",
  };
}
