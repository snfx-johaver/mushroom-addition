import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface Size {
  width: number;
  height: number;
}

interface GeometryEntry {
  implementation: Size;
  reference: Size;
  icons: Record<string, Size[]>;
  buttons: Record<string, Size[]>;
}

const geometry = JSON.parse(readFileSync(
  join(process.cwd(), "docs", "assets", "visual-audit", "priority-card-geometry.json"),
  "utf8",
)) as Record<string, GeometryEntry>;

const sizes = (source: string, group: "icons" | "buttons", selector: string): Size[] =>
  geometry[source][group][selector];

describe("priority visual geometry evidence", () => {
  it.each([
    "heat-pump",
    "homeassistant-updates",
    "nik-nas",
    "nik-tablet",
    "person-info",
    "person-info-small",
  ])("captures %s at the matched reference width", (source) => {
    expect(Math.abs(geometry[source].implementation.width - geometry[source].reference.width))
      .toBeLessThanOrEqual(14);
    expect(Math.abs(geometry[source].implementation.height - geometry[source].reference.height))
      .toBeLessThanOrEqual(25);
  });

  it("keeps Heat Pump controls and glyphs at source-like dimensions", () => {
    expect(sizes("heat-pump", "icons", ".heat-pump-modes ha-icon")).toHaveLength(6);
    expect(sizes("heat-pump", "icons", ".heat-pump-modes ha-icon").every(({ width, height }) =>
      width === 22 && height === 22)).toBe(true);
    expect(sizes("heat-pump", "buttons", ".heat-pump-target button").every(({ height }) => height === 44)).toBe(true);
    expect(sizes("heat-pump", "buttons", ".heat-pump-modes button").every(({ height }) => height === 42)).toBe(true);
  });

  it("keeps Updates hero and action icons prominent", () => {
    expect(sizes("homeassistant-updates", "icons", ".ha-updates-icon > ha-icon"))
      .toEqual([{ width: 28, height: 28 }]);
    expect(sizes("homeassistant-updates", "icons", ".ha-update-actions ha-icon"))
      .toEqual(Array.from({ length: 3 }, () => ({ width: 24, height: 24 })));
    expect(sizes("homeassistant-updates", "buttons", ".ha-update-actions button")
      .every(({ height }) => height === 55)).toBe(true);
  });

  it("keeps NAS and Tablet semantic controls recognizable", () => {
    expect(Object.values(geometry["nik-nas"].icons).flat()
      .every(({ width, height }) => width === 24 && height === 24)).toBe(true);
    expect(sizes("nik-tablet", "icons", ".nik-tablet-controls ha-icon"))
      .toEqual(Array.from({ length: 6 }, () => ({ width: 22, height: 22 })));
    expect(sizes("nik-tablet", "buttons", ".nik-tablet-controls button")
      .every(({ height }) => height === 42)).toBe(true);
  });

  it("matches the source Person Info badge and battery/detail icon hierarchy", () => {
    expect(sizes("person-info", "icons", ".person-info-badge ha-icon"))
      .toEqual([{ width: 10, height: 10 }]);
    expect(sizes("person-info", "icons", ".person-info-detail ha-icon"))
      .toEqual([{ width: 16, height: 16 }, { width: 16, height: 16 }]);
    expect(sizes("person-info-small", "icons", ".person-info-small-battery ha-icon"))
      .toEqual([{ width: 25, height: 25 }]);
  });
});
