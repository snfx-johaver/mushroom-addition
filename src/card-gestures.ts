import type { ReactiveController, ReactiveControllerHost } from "lit";

const gestureEvents = [
  "touchstart", "touchmove", "touchend", "touchcancel",
  "mousedown", "mousemove", "mouseup",
  "pointerdown", "pointermove", "pointerup", "pointercancel",
];
const gestureControls = '.carousel, .swiper, swiper-container, .pad, input[type="range"], [role="slider"]';
const carSwiperHosts = "addition-car-vsc-buttons-group, addition-car-vsc-buttons-grid, addition-car-vsc-images-slide";

interface SwiperContainer extends HTMLElement {
  swiper?: {
    params: { nested?: boolean };
    onTouchMove: (event: Event) => void;
    onTouchEnd: (event: Event) => void;
  } | null;
}

/** Keep card controls out of dashboard swipe handlers without cancelling native scrolling. */
export class CardGestureController implements ReactiveController {
  constructor(private readonly host: ReactiveControllerHost & HTMLElement) {
    host.addController(this);
  }

  hostConnected(): void {
    for (const type of gestureEvents) {
      this.host.addEventListener(type, this.isolate, { passive: type !== "touchmove" && type !== "pointermove" });
    }
  }

  hostDisconnected(): void {
    for (const type of gestureEvents) this.host.removeEventListener(type, this.isolate);
  }

  private readonly isolate = (event: Event): void => {
    for (const node of event.composedPath()) {
      if (node === this.host) break;
      if (!(node instanceof HTMLElement)) continue;
      const root = node.getRootNode();
      const carSwiper = node.matches(".swiper-container") && root instanceof ShadowRoot && root.host.matches(carSwiperHosts);
      if (carSwiper || node.matches(gestureControls) || /^(auto|scroll)$/.test(getComputedStyle(node).overflowX)) {
        const swiper = carSwiper ? (node as SwiperContainer).swiper : undefined;
        // Swiper listens for movement and release on document, beyond the dashboard.
        if (swiper) {
          if ((event.type === "touchmove" || event.type === "pointermove") && !swiper.params.nested) {
            swiper.onTouchMove(event);
          } else if (["touchend", "touchcancel", "pointerup", "pointercancel"].includes(event.type)) {
            swiper.onTouchEnd(event);
          }
        }
        event.stopPropagation();
        return;
      }
    }
  };
}
