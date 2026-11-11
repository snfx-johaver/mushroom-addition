import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/car-advanced/vendor/vehicle-engine.js", () => ({
  initializeCarEngine: vi.fn(),
}));
import { initializeCarEngine } from "../src/car-advanced/vendor/vehicle-engine.js";

class Engine extends HTMLElement {
  public static getConfigElement = vi.fn(async () => document.createElement("addition-car-engine-editor"));
}
class EngineEditor extends HTMLElement {}
class NativeStack extends HTMLElement {
  public static getConfigElement = vi.fn(async () => document.createElement("div"));
}
customElements.define("addition-car-engine", Engine);
customElements.define("addition-car-engine-editor", EngineEditor);
customElements.define("test-native-stack", NativeStack);
const loader = vi.fn(async () => ({
  createCardElement: () => document.createElement("test-native-stack"),
}));
beforeEach(() => {
  vi.resetModules();
  vi.mocked(initializeCarEngine).mockReset();
  Engine.getConfigElement.mockClear();
  NativeStack.getConfigElement.mockReset().mockResolvedValue(document.createElement("div"));
  loader.mockClear();
  Object.assign(window, { loadCardHelpers: loader });
});

describe("private Car engine loading", () => {
  it("initializes once and loads native nested-card editors before feature panels can mount", async () => {
    const { loadCarEngine } = await import("../src/car-advanced/runtime");
    await loadCarEngine();
    expect(loader).not.toHaveBeenCalled();
    await Promise.all([loadCarEngine(true), loadCarEngine(true)]);
    expect(initializeCarEngine).toHaveBeenCalledTimes(1);
    expect(Engine.getConfigElement).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(NativeStack.getConfigElement).toHaveBeenCalledTimes(1);
  });
  it("surfaces and retries native-editor load failures instead of caching an empty editor", async () => {
    NativeStack.getConfigElement.mockRejectedValueOnce(new Error("Native editor unavailable"));
    const { loadCarEngine } = await import("../src/car-advanced/runtime");
    await expect(loadCarEngine(true)).rejects.toThrow("Native editor unavailable");
    await loadCarEngine(true);
    expect(NativeStack.getConfigElement).toHaveBeenCalledTimes(2);
    expect(initializeCarEngine).toHaveBeenCalledTimes(1);
  });
  it("surfaces and retries engine initialization failures", async () => {
    vi.mocked(initializeCarEngine).mockImplementationOnce(() => { throw new Error("Engine load failed"); });
    const { loadCarEngine } = await import("../src/car-advanced/runtime");
    await expect(loadCarEngine()).rejects.toThrow("Engine load failed");
    await loadCarEngine();
    expect(initializeCarEngine).toHaveBeenCalledTimes(2);
  });
});
