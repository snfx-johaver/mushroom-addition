import type { HassEntity } from "./types";

export interface PanelOutput {
  entity: HassEntity;
  id: string;
  value: number;
}

export interface PanelHealthSummary {
  panels: PanelOutput[];
  activeCount: number;
  totalOutput: number;
  averageOutput: number;
  best?: PanelOutput;
  weakest?: PanelOutput;
  spread: number;
}

const valueOf = (entity: HassEntity): number => {
  const value = Number.parseFloat(entity.state);
  return Number.isFinite(value) ? value : 0;
};

export const inverterPanelEntities = (
  states: Record<string, HassEntity>,
  configured?: readonly string[],
  primaryEntity?: string,
): PanelOutput[] => {
  const selected = configured?.length
    ? configured
    : primaryEntity
      ? [primaryEntity]
      : Object.keys(states).filter((entityId) => /^sensor\.inverter_4/i.test(entityId));
  return [...new Set(selected)]
    .filter((entityId) => entityId.startsWith("sensor.") && states[entityId] !== undefined)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((entityId) => {
      const entity = states[entityId];
      return {
        entity,
        id: entityId.slice(-4),
        value: valueOf(entity),
      };
    });
};

export const summarizePanels = (panels: readonly PanelOutput[]): PanelHealthSummary => {
  const totalOutput = panels.reduce((total, panel) => total + panel.value, 0);
  const sorted = [...panels].sort((left, right) =>
    left.value - right.value || left.entity.entity_id.localeCompare(right.entity.entity_id));
  const weakest = sorted[0];
  const best = sorted.at(-1);
  return {
    panels: [...panels],
    activeCount: panels.filter(({ value }) => value > 0).length,
    totalOutput,
    averageOutput: panels.length ? totalOutput / panels.length : 0,
    best,
    weakest,
    spread: best && weakest ? best.value - weakest.value : 0,
  };
};

export const panelGaugePercent = (value: number, maximum: number): number =>
  Math.max(0, Math.min(100, (value / Math.max(1, maximum)) * 100));

export const panelGaugeColor = (
  value: number,
  thresholds: readonly number[],
  colors: readonly string[],
): string => {
  let index = 0;
  thresholds.forEach((threshold, current) => {
    if (value >= threshold) index = current;
  });
  return colors[Math.min(index, colors.length - 1)] ?? "var(--primary-color)";
};
