import { expect, it } from "vitest";

const pickerRegistry = window.customCards = [{
  type: "another-card", name: "Another card", description: "", preview: false,
}, {
  type: "mushroom-addition-area-card-mushroom", name: "Old Area entry", description: "", preview: false,
}];
const { CATALOG } = await import("../src/index");

it("publishes cards through Home Assistant's retained registry without replacing it", () => {
  expect(window.customCards).toBe(pickerRegistry);
  expect(pickerRegistry.some(card => card.type === "another-card")).toBe(true);
  expect(pickerRegistry.some(card => card.type === "mushroom-addition-area-card-mushroom")).toBe(false);
  for (const card of CATALOG) {
    expect(pickerRegistry.filter(entry => entry.type === card.tag)).toHaveLength(1);
  }
});
