import type { AdditionConfig, HassEntity, HomeAssistant } from "./types";

export interface TodoItem {
  uid?: string;
  summary: string;
  status: "needs_action" | "completed";
  description?: string | null;
  due?: string | null;
}

export const TODO_FEATURE = { create: 1, delete: 2, update: 4, date: 16, datetime: 32, description: 64 } as const;
export const TODO_TYPE = "custom:mushroom-addition-todo";
export const todoLabels: Record<string, string> = {
  todo_entities: "To-do lists",
  todo_show_completed: "Show completed tasks",
  todo_allow_add: "Allow adding tasks",
  todo_allow_edit: "Allow editing tasks",
  todo_allow_delete: "Allow deleting tasks",
};

export function todoEntities(config?: AdditionConfig): string[] {
  return [...new Set([config?.entity, ...(config?.todo_entities ?? [])].filter((id): id is string => !!id))];
}

export function validateTodo(config: AdditionConfig): void {
  if (config.todo_entities !== undefined && (!Array.isArray(config.todo_entities) ||
      config.todo_entities.some(id => typeof id !== "string" || !/^todo\.[a-z0-9_]+$/.test(id)))) {
    throw new Error("To-do lists must contain todo entity IDs.");
  }
  if (config.entity && !/^todo\.[a-z0-9_]+$/.test(config.entity)) throw new Error("Select a todo entity.");
  for (const key of ["todo_show_completed", "todo_allow_add", "todo_allow_edit", "todo_allow_delete"] as const) {
    if (config[key] !== undefined && typeof config[key] !== "boolean") throw new Error(`${key} must be a boolean.`);
  }
}

export function todoStub(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): AdditionConfig {
  const ids = [...entities, ...fallback, ...Object.keys(hass?.states ?? {})];
  const entity = ids.find(id => id.startsWith("todo.") && hass?.states[id] &&
    !["unavailable", "unknown"].includes(hass.states[id].state));
  return { type: TODO_TYPE, ...(entity ? { entity } : {}), todo_show_completed: true };
}

export function todoSupports(entity: HassEntity | undefined, feature: number): boolean {
  const flags = entity?.attributes.supported_features;
  return typeof flags === "number" && (flags & feature) === feature;
}

// HA resolves service item arguments by UID OR summary, in list order.
// Reject collisions instead of risking an operation on a different item.
export function safeTodoUid(item: TodoItem, items: TodoItem[]): boolean {
  return typeof item.uid === "string" && item.uid.length > 0 &&
    items.filter(other => other.uid === item.uid).length === 1 &&
    !items.some(other => other !== item && other.summary === item.uid);
}

export async function readTodo(hass: HomeAssistant, entity: string): Promise<TodoItem[]> {
  const message = { type: "todo/item/list", entity_id: entity };
  const result = hass.callWS ? await hass.callWS<{ items: TodoItem[] }>(message)
    : hass.connection ? await hass.connection.sendMessagePromise<{ items: TodoItem[] }>(message)
      : undefined;
  if (!result || !Array.isArray(result.items) || result.items.some(item => !item ||
    typeof item.summary !== "string" || !["needs_action", "completed"].includes(item.status) ||
    (item.uid != null && typeof item.uid !== "string") ||
    (item.description != null && typeof item.description !== "string") ||
    (item.due != null && typeof item.due !== "string"))) throw new Error("Invalid to-do response.");
  return result.items;
}
