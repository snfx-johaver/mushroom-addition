import type { HomeAssistant } from "./types";
import type { AdditionConfig } from "../types";
import { localizeText } from "../localize";

export interface WorkflowRow {
  entity: string;
  attribute?: string;
  label?: string;
  icon?: string;
  unit?: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  group?: string;
  icon?: string;
  color?: string;
  note?: string;
  entities?: WorkflowRow[];
}

export interface WorkflowGroup {
  id: string;
  label: string;
  color?: string;
}

export interface WorkflowRelation {
  from: string;
  to: string;
  label?: string;
  color?: string;
}

export interface WorkflowConfig extends AdditionConfig {
  type: string;
  title?: string;
  presentation?: "sequential" | "graph";
  groups?: WorkflowGroup[];
  nodes: WorkflowNode[];
  relations?: WorkflowRelation[];
}

export const WORKFLOW_TAG = "mushroom-addition-energy-entityworkflow";
export const WORKFLOW_EDITOR_TAG = "mushroom-addition-energy-workflow-features";

export function validateWorkflow(config: WorkflowConfig): void {
  if (!config || typeof config !== "object" || !Array.isArray(config.nodes) || !config.nodes.length) {
    throw new Error("Workflow requires at least one node.");
  }
  if (config.presentation !== undefined && !["sequential", "graph"].includes(config.presentation)) {
    throw new Error("Workflow presentation must be sequential or graph.");
  }
  for (const key of ["groups", "relations"] as const) {
    if (config[key] !== undefined && !Array.isArray(config[key])) throw new Error(`Workflow ${key} must be a list.`);
  }
  const text = (value: unknown, context: string, required = false) => {
    if ((required || value !== undefined) && (typeof value !== "string" || (required && !value.trim()))) {
      throw new Error(`${context} must be ${required ? "non-empty " : ""}text.`);
    }
  };
  text(config.type, "Workflow type", true);
  const ids = (items: Array<WorkflowGroup | WorkflowNode>, kind: string) => {
    const found = new Set<string>();
    for (const item of items) {
      if (!item || typeof item !== "object") throw new Error(`Workflow ${kind} must be an object.`);
      text(item.id, `Workflow ${kind} ID`, true);
      if (found.has(item.id)) throw new Error(`Duplicate workflow ${kind} ID: ${item.id}.`);
      text(item.label, `Workflow ${kind} ${item.id} label`, true);
      text(item.color, `Workflow ${kind} ${item.id} color`);
      found.add(item.id);
    }
    return found;
  };
  const groups = ids(config.groups ?? [], "group");
  const nodes = ids(config.nodes, "node");
  for (const node of config.nodes) {
    if (node.group !== undefined && !groups.has(node.group)) throw new Error(`Workflow node ${node.id} references unknown group ${node.group}.`);
    text(node.icon, `Workflow node ${node.id} icon`);
    text(node.note, `Workflow node ${node.id} note`);
    if (node.entities !== undefined && !Array.isArray(node.entities)) throw new Error(`Workflow node ${node.id} entities must be a list.`);
    for (const row of node.entities ?? []) {
      if (!row || typeof row.entity !== "string" || !/^[a-z_]+\.[a-z0-9_]+$/.test(row.entity)) {
        throw new Error(`Workflow node ${node.id} requires valid entity IDs (for example sensor.example_value).`);
      }
      for (const key of ["attribute", "label", "icon", "unit"] as const) text(row[key], `Workflow node ${node.id} row ${key}`);
    }
  }
  for (const relation of config.relations ?? []) {
    if (!relation || !nodes.has(relation.from) || !nodes.has(relation.to)) {
      throw new Error("Workflow relation must reference existing source and target node IDs.");
    }
    text(relation.label, "Workflow relation label");
    text(relation.color, "Workflow relation color");
  }
  text(config.title, "Workflow title");
}

export function workflowStub(
  hass?: HomeAssistant, entities: string[] = [], fallback: string[] = [],
): WorkflowConfig {
  const available = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])]
    .filter(id => hass?.states[id] && !["unknown", "unavailable"].includes(hass.states[id].state))
    .sort((left, right) => Number(right.startsWith("sensor.")) - Number(left.startsWith("sensor.")));
  return {
    type: `custom:${WORKFLOW_TAG}`,
    name: "Energy Entityworkflow",
    presentation: "sequential",
    groups: [{ id: "input", label: localizeText(hass, "Input"), color: "#42a5f5" }, { id: "plan", label: localizeText(hass, "Plan"), color: "#26a69a" }],
    nodes: [
      { id: "source", label: localizeText(hass, "Input"), group: "input", icon: "mdi:database-outline", entities: available[0] ? [{ entity: available[0] }] : [] },
      { id: "proposal", label: localizeText(hass, "Proposed plan"), group: "plan", icon: "mdi:clipboard-text-outline",
        note: localizeText(hass, "Define relationships and display existing entity values. This card does not calculate or execute a workflow."), entities: available[1] ? [{ entity: available[1] }] : [] },
    ],
    relations: [{ from: "source", to: "proposal", label: localizeText(hass, "informs") }],
  };
}
