import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent } from "./helpers";
import type { ActionConfig, AdditionConfig, AdditionItemConfig, HassEntity, HomeAssistant } from "./types";

const inactiveStates = new Set(["off", "unknown", "unavailable", "none", "idle"]);

@customElement("mushroom-addition-entity-carousel")
export class MushroomAdditionEntityCarousel extends LitElement {
  public static styles = css`
    :host { display: block; min-width: 0; }
    .carousel {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 104px;
      overflow: hidden;
      perspective: 520px;
      touch-action: pan-y;
      user-select: none;
      outline: none;
    }
    .stage {
      position: relative;
      width: 100%;
      height: 74px;
      transform-style: preserve-3d;
    }
    button {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: 58px;
      height: 58px;
      margin: -29px;
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      color: var(--primary-text-color);
      background:
        linear-gradient(145deg, color-mix(in srgb, var(--card-background-color) 92%, white 8%),
        color-mix(in srgb, var(--card-background-color) 86%, black 14%));
      box-shadow: 0 5px 16px rgb(0 0 0 / 28%);
      transition: transform 220ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease, filter 180ms ease;
      cursor: pointer;
      transform-style: preserve-3d;
      will-change: transform;
    }
    button.active {
      color: var(--carousel-color, var(--primary-color));
      border-color: color-mix(in srgb, var(--carousel-color, var(--primary-color)) 55%, var(--divider-color));
      box-shadow:
        0 8px 22px rgb(0 0 0 / 38%),
        inset 0 0 0 1px color-mix(in srgb, var(--carousel-color, var(--primary-color)) 22%, transparent);
    }
    button.entity-active {
      background:
        linear-gradient(145deg,
          color-mix(in srgb, var(--carousel-color, var(--primary-color)) 28%, var(--card-background-color)),
          color-mix(in srgb, var(--carousel-color, var(--primary-color)) 12%, var(--card-background-color)));
    }
    button[hidden] { display: none; }
    ha-icon { --mdc-icon-size: 28px; pointer-events: none; }
    .picture {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: center / cover no-repeat;
      pointer-events: none;
    }
    .label {
      min-height: 20px;
      max-width: calc(100% - 24px);
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state {
      margin-left: 6px;
      color: var(--secondary-text-color);
      font-weight: 400;
    }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @state() private selectedIndex = 0;

  private dragStartX?: number;
  private holdTimer?: number;
  private holdFired = false;

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("config")) {
      const count = this.items.length;
      const initial = Math.max(0, Math.round(this.config?.carousel_initial_index ?? 0));
      this.selectedIndex = count ? Math.min(initial, count - 1) : 0;
    }
  }

  protected render(): TemplateResult {
    const items = this.items;
    if (!items.length) {
      return html`<div class="carousel"><span class="label">Add carousel items in the card editor</span></div>`;
    }
    const visible = this.visibleCount;
    const activeItem = items[this.selectedIndex];
    const activeEntity = this.entityFor(activeItem);
    return html`
      <div class="carousel"
        role="listbox"
        aria-label="Entity carousel"
        tabindex="0"
        @keydown=${this.onKeydown}
        @wheel=${this.onWheel}>
        <div class="stage">
          ${items.map((item, index) => this.renderItem(item, index, visible))}
        </div>
        ${this.config?.carousel_show_labels === false ? nothing : html`
          <div class="label">
            ${this.itemName(activeItem, activeEntity)}
            ${this.showEntityState(activeEntity)
              ? html`<span class="state">${activeEntity?.state}</span>`
              : nothing}
          </div>
        `}
      </div>
    `;
  }

  private renderItem(item: AdditionItemConfig, index: number, visible: number): TemplateResult {
    const offset = this.itemOffset(index);
    const distance = Math.abs(offset);
    const hidden = distance > Math.floor(visible / 2);
    const active = index === this.selectedIndex;
    const entity = this.entityFor(item);
    const color = item.color || (entity?.attributes.icon ? "primary" : "primary");
    const translate = offset * 42;
    const scale = Math.max(0.54, 1 - distance * 0.17);
    const rotate = offset * -24;
    const opacity = Math.max(0.18, 1 - distance * 0.2);
    const style = [
      `transform:translateX(${translate}px) translateZ(${-distance * 34}px) rotateY(${rotate}deg) scale(${scale})`,
      `z-index:${100 - distance}`,
      `opacity:${opacity}`,
      `filter:saturate(${Math.max(0.45, 1 - distance * 0.14)})`,
      `--carousel-color:var(--${color}-color, ${color})`,
    ].join(";");
    const picture = item.icon_type === "entity-picture"
      ? entity?.attributes.entity_picture
      : undefined;
    const icon = item.icon || entity?.attributes.icon || "mdi:circle";
    const isEntityActive = entity ? !inactiveStates.has(entity.state.toLowerCase()) : false;
    return html`
      <button
        role="option"
        aria-selected=${active ? "true" : "false"}
        aria-label=${this.itemName(item, entity)}
        class=${`${active ? "active" : ""} ${isEntityActive ? "entity-active" : ""}`}
        style=${style}
        ?hidden=${hidden}
        @pointerdown=${(event: PointerEvent) => this.onPointerDown(event, index)}
        @pointermove=${this.onPointerMove}
        @pointerup=${(event: PointerEvent) => this.onPointerUp(event, index)}
        @pointercancel=${this.cancelPointer}>
        ${picture
          ? html`<span class="picture" style=${`background-image:url("${String(picture)}")`}></span>`
          : html`<ha-icon .icon=${icon}></ha-icon>`}
      </button>
    `;
  }

  private get items(): AdditionItemConfig[] {
    return this.config?.carousel_items ?? [];
  }

  private get visibleCount(): number {
    const requested = Math.round(this.config?.carousel_visible_items ?? 7);
    const clamped = Math.min(11, Math.max(3, requested));
    return clamped % 2 === 0 ? clamped + 1 : clamped;
  }

  private entityFor(item: AdditionItemConfig): HassEntity | undefined {
    return item.entity ? this.hass?.states[item.entity] : undefined;
  }

  private itemName(item: AdditionItemConfig, entity = this.entityFor(item)): string {
    return item.name || entity?.attributes.friendly_name || item.entity || "Carousel item";
  }

  private showEntityState(entity: HassEntity | undefined): boolean {
    if (!entity) return false;
    const domain = entity.entity_id.split(".", 1)[0];
    return !["scene", "script", "button"].includes(domain);
  }

  private itemOffset(index: number): number {
    let offset = index - this.selectedIndex;
    if (this.config?.carousel_loop !== false && this.items.length > 2) {
      const half = this.items.length / 2;
      if (offset > half) offset -= this.items.length;
      if (offset < -half) offset += this.items.length;
    }
    return offset;
  }

  private select(direction: -1 | 1): void {
    const count = this.items.length;
    if (!count) return;
    const next = this.selectedIndex + direction;
    this.selectedIndex = this.config?.carousel_loop === false
      ? Math.min(count - 1, Math.max(0, next))
      : (next + count) % count;
  }

  private selectIndex(index: number): void {
    this.selectedIndex = Math.min(this.items.length - 1, Math.max(0, index));
  }

  private readonly onPointerDown = (event: PointerEvent, index: number): void => {
    event.stopPropagation();
    this.dragStartX = event.clientX;
    this.holdFired = false;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    if (index === this.selectedIndex) {
      this.holdTimer = window.setTimeout(() => {
        this.holdFired = true;
        this.runItemAction(this.items[index], "hold");
      }, 500);
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.dragStartX === undefined) return;
    if (Math.abs(event.clientX - this.dragStartX) > 8) this.clearHold();
  };

  private readonly onPointerUp = (event: PointerEvent, index: number): void => {
    event.stopPropagation();
    if (this.dragStartX === undefined) return;
    const delta = event.clientX - this.dragStartX;
    this.clearHold();
    this.dragStartX = undefined;
    if (Math.abs(delta) >= 24) {
      this.select(delta > 0 ? -1 : 1);
      return;
    }
    if (this.holdFired) {
      this.holdFired = false;
      return;
    }
    if (index !== this.selectedIndex) {
      this.selectIndex(index);
      return;
    }
    this.runItemAction(this.items[index], "tap");
  };

  private readonly cancelPointer = (): void => {
    this.clearHold();
    this.dragStartX = undefined;
    this.holdFired = false;
  };

  private clearHold(): void {
    if (this.holdTimer !== undefined) window.clearTimeout(this.holdTimer);
    this.holdTimer = undefined;
  }

  private readonly onWheel = (event: WheelEvent): void => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 8) return;
    event.preventDefault();
    this.select(delta > 0 ? 1 : -1);
  };

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowLeft") this.select(-1);
    else if (event.key === "ArrowRight") this.select(1);
    else if (event.key === "Home") this.selectIndex(0);
    else if (event.key === "End") this.selectIndex(this.items.length - 1);
    else if (event.key === "Enter" || event.key === " ") {
      this.runItemAction(this.items[this.selectedIndex], "tap");
    } else return;
    event.preventDefault();
  };

  private runItemAction(item: AdditionItemConfig | undefined, gesture: "tap" | "hold"): void {
    if (!item) return;
    const configuredAction = gesture === "tap" ? item.tap_action : item.hold_action;
    const action: ActionConfig = configuredAction ?? {
      action: gesture === "tap" && item.entity ? "more-info" : "none",
    };
    fireEvent(this, "hass-action", {
      config: {
        type: this.config?.type,
        entity: item.entity,
        tap_action: gesture === "tap" ? action : undefined,
        hold_action: gesture === "hold" ? action : undefined,
      },
      action: gesture,
    });
  }
}
