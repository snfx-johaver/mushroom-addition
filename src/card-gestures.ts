import type { ReactiveController, ReactiveControllerHost } from "lit";

const gestureEvents = [
  "touchstart", "touchmove", "touchend", "touchcancel",
  "mousedown", "mousemove", "mouseup",
  "pointerdown", "pointermove", "pointerup", "pointercancel",
];
const gestureControls = '.carousel, .swiper, swiper-container, .pad, input[type="range"], [role="slider"]';

/** Keep card controls out of dashboard swipe handlers without cancelling native scrolling. */
export class CardGestureController implements ReactiveController {
  constructor(private readonly host: ReactiveControllerHost & HTMLElement) {
    host.addController(this);
  }

  hostConnected(): void {
    for (const type of gestureEvents) this.host.addEventListener(type, this.isolate, { passive: true });
  }

  hostDisconnected(): void {
    for (const type of gestureEvents) this.host.removeEventListener(type, this.isolate);
  }

  private readonly isolate = (event: Event): void => {
    for (const node of event.composedPath()) {
      if (node === this.host) break;
      if (!(node instanceof HTMLElement)) continue;
      if (node.matches(gestureControls) || /^(auto|scroll)$/.test(getComputedStyle(node).overflowX)) {
        event.stopPropagation();
        return;
      }
    }
  };
}
