import type { HomeAssistant } from "./types";
export { stateLabel, displayName, fireEvent } from "../helpers";

export function relevantHassChanged(previous: HomeAssistant | undefined, next: HomeAssistant | undefined, config: unknown): boolean {
  if (!previous || !next || previous.language !== next.language || previous.themes !== next.themes ||
      previous.config !== next.config || previous.formatEntityState !== next.formatEntityState ||
      previous.formatEntityName !== next.formatEntityName || previous.devices !== next.devices ||
      previous.entities !== next.entities) return true;
  const entities = new Set<string>();
  function visit(value: unknown): void {
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      if ((key === "entity" || key.endsWith("Entity")) && typeof item === "string") entities.add(item);
      else if (item && typeof item === "object") visit(item);
    }
  }
  visit(config);
  return [...entities].some(id => previous.states[id] !== next.states[id]);
}
