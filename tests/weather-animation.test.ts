import { afterEach, describe, expect, it, vi } from "vitest";
import { AnimationManager } from "../src/weather-advanced/components/animation-manager";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); document.body.replaceChildren(); });
function fixture(reduced = false) {
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  const canvasContext: Partial<CanvasRenderingContext2D> = { scale: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(canvasContext as CanvasRenderingContext2D);
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
  const raf = vi.fn(() => 42), cancel = vi.fn();
  vi.stubGlobal("requestAnimationFrame", raf);
  vi.stubGlobal("cancelAnimationFrame", cancel);
  const container = document.createElement("div");
  vi.spyOn(container, "getBoundingClientRect").mockReturnValue(DOMRect.fromRect({ width: 240, height: 320 }));
  document.body.append(container);
  return { container, raf, cancel };
}
describe("Weather Advanced animation lifecycle", () => {
  it("keeps a single canvas/frame across ordinary updates and cleans it up on disconnect", () => {
    const { container, raf, cancel } = fixture();
    const manager = new AnimationManager(() => null);
    manager.setup(container);
    manager.setup(container);
    manager.setup(container);
    expect(container.querySelectorAll("canvas")).toHaveLength(1);
    expect(raf).toHaveBeenCalledTimes(1);
    manager.destroy();
    expect(cancel).toHaveBeenCalledWith(42);
    expect(container.querySelector("canvas")).toBeNull();
  });
  it("draws on demand rather than polling animation frames with reduced motion", () => {
    const { container, raf } = fixture(true);
    const params = vi.fn(() => null);
    const manager = new AnimationManager(params);
    manager.setup(container);
    manager.setup(container);
    expect(params).toHaveBeenCalledTimes(2);
    expect(raf).not.toHaveBeenCalled();
    manager.destroy();
  });
  it("does not start an animation loop when the document is hidden", () => {
    const { container, raf } = fixture();
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    const manager = new AnimationManager(() => null);
    manager.setup(container);
    expect(raf).not.toHaveBeenCalled();
    manager.destroy();
  });
});
