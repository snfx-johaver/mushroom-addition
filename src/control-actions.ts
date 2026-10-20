import { nothing } from "lit";
import { AsyncDirective } from "lit/async-directive.js";
import { directive, PartType, type ElementPart, type PartInfo } from "lit/directive.js";
import { handleAction } from "./helpers";
import type { AdditionConfig } from "./types";

type Gesture = "tap" | "hold" | "double_tap";

// Keep gesture state on the element across hass updates, and cancel pending work on removal.
class ControlActions extends AsyncDirective {
  private element?: HTMLButtonElement;
  private config?: AdditionConfig;
  private holdTimer?: number;
  private tapTimer?: number;
  private held = false;
  private pointer?: { x: number; y: number };
  private cancelled = false;

  constructor(info: PartInfo) {
    super(info);
    if (info.type !== PartType.ELEMENT) throw new Error("Control actions require an element");
  }

  render(config: AdditionConfig) { void config; return nothing; }

  update(part: ElementPart, [config]: [AdditionConfig]) {
    if (this.config?.entity !== config.entity) {
      this.clearHold();
      this.clearTap();
    }
    this.config = config;
    if (!this.element) {
      this.element = part.element as HTMLButtonElement;
      this.listen(true);
    }
    return nothing;
  }

  private run(gesture: Gesture): void {
    if (!this.config || this.element?.disabled || !this.isConnected) return;
    const action = this.config[`${gesture}_action`];
    if (!action || action.action === "none") return;
    handleAction(this.element!, {
      ...this.config,
      entity: typeof action.entity === "string" ? action.entity : this.config.entity,
    }, gesture);
  }

  private clearHold(): void {
    window.clearTimeout(this.holdTimer);
    this.holdTimer = undefined;
  }

  private clearTap(): void {
    window.clearTimeout(this.tapTimer);
    this.tapTimer = undefined;
  }

  private readonly onEvent = (event: Event): void => {
    event.stopPropagation();
    if (this.element?.disabled) return;
    switch (event.type) {
      case "pointerdown": {
        const pointer = event as PointerEvent;
        if (pointer.button !== 0 && pointer.button !== undefined) return;
        this.clearHold();
        this.held = false;
        this.cancelled = false;
        this.pointer = { x: pointer.clientX, y: pointer.clientY };
        if (this.config?.hold_action && this.config.hold_action.action !== "none") {
          this.holdTimer = window.setTimeout(() => {
            this.held = true;
            this.clearTap();
            this.run("hold");
          }, 500);
        }
        break;
      }
      case "pointermove": {
        const pointer = event as PointerEvent;
        if (this.pointer && Math.hypot(pointer.clientX - this.pointer.x, pointer.clientY - this.pointer.y) > 10) {
          this.clearHold();
          this.cancelled = true;
        }
        break;
      }
      case "pointerup":
        this.clearHold();
        this.pointer = undefined;
        break;
      case "pointercancel":
      case "pointerleave":
        this.clearHold();
        this.pointer = undefined;
        this.cancelled = true;
        break;
      case "click": {
        if (this.cancelled) { this.cancelled = false; return; }
        if (this.held) return;
        const click = event as MouseEvent;
        if (click.detail > 1) return;
        this.clearTap();
        // Native keyboard/assistive clicks have no pointer click count.
        if (!click.detail || this.config?.double_tap_action?.action === "none" ||
          !this.config?.double_tap_action) {
          this.run("tap");
        } else {
          this.tapTimer = window.setTimeout(() => { this.tapTimer = undefined; this.run("tap"); }, 300);
        }
        break;
      }
      case "dblclick":
        this.clearTap();
        if (!this.held && !this.cancelled) this.run("double_tap");
        break;
      case "keydown": {
        const key = event as KeyboardEvent;
        if (key.key === "Enter" || key.key === " ") {
          key.preventDefault();
          if (!key.repeat) {
            this.clearTap();
            this.held = false;
            this.cancelled = false;
            this.run("tap");
          }
        }
        break;
      }
      case "keyup":
      case "contextmenu":
        event.preventDefault();
        break;
    }
  };

  private listen(add: boolean): void {
    for (const type of ["pointerdown", "pointermove", "pointerup", "pointercancel", "pointerleave",
      "click", "dblclick", "keydown", "keyup", "contextmenu"]) {
      if (add) this.element?.addEventListener(type, this.onEvent);
      else this.element?.removeEventListener(type, this.onEvent);
    }
  }

  protected disconnected(): void {
    this.clearHold();
    this.clearTap();
    this.listen(false);
  }

  protected reconnected(): void { this.listen(true); }
}

export const controlActions = directive(ControlActions);
