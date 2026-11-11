import { afterEach, describe, expect, it, vi } from "vitest";
import { LitElement, html } from "lit";
import { CardGestureController } from "../src/card-gestures";

class GestureCard extends LitElement {
  constructor() { super(); new CardGestureController(this); }
  protected render() {
    return html`<div class="carousel"><button>Scene</button></div>
      <input type="range"><div class="swiper">Slide</div><div class="pad">Remote</div>
      <div class="forecast" style="overflow-x:auto">Forecast</div><button class="ordinary">Heading</button>`;
  }
}
customElements.define("test-gesture-card", GestureCard);
afterEach(() => document.body.replaceChildren());

describe("Card gesture isolation", () => {
  it.each([".carousel button", "input", ".swiper", ".pad", ".forecast"])(
    "keeps touch and mouse streams on %s away from dashboard navigation without cancelling native scrolling", async selector => {
      const parent = document.createElement("div");
      const card = document.createElement("test-gesture-card") as GestureCard;
      parent.append(card); document.body.append(parent); await card.updateComplete;
      const target = card.shadowRoot!.querySelector(selector)!;
      const dashboard = vi.fn(), internal = vi.fn();
      for (const type of ["touchstart", "touchmove", "touchend", "touchcancel", "mousedown", "mousemove", "mouseup",
        "pointerdown", "pointermove", "pointerup", "pointercancel"]) {
        parent.addEventListener(type, dashboard);
        target.addEventListener(type, internal);
        const event = new Event(type, { bubbles: true, composed: true, cancelable: true });
        target.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      }
      expect(internal).toHaveBeenCalledTimes(11);
      expect(dashboard).not.toHaveBeenCalled();
      card.remove(); parent.append(card);
      target.dispatchEvent(new Event("touchstart", { bubbles: true, composed: true }));
      expect(dashboard).not.toHaveBeenCalled();
    },
  );

  it("preserves dashboard swipes on ordinary card surfaces and control clicks", async () => {
    const parent = document.createElement("div");
    const card = document.createElement("test-gesture-card") as GestureCard;
    parent.append(card); document.body.append(parent); await card.updateComplete;
    const dashboard = vi.fn(), click = vi.fn();
    parent.addEventListener("touchstart", dashboard);
    parent.addEventListener("click", click);
    card.shadowRoot!.querySelector(".ordinary")!.dispatchEvent(new Event("touchstart", { bubbles: true, composed: true }));
    card.shadowRoot!.querySelector("input")!.dispatchEvent(new Event("click", { bubbles: true, composed: true }));
    expect(dashboard).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
  });
});
