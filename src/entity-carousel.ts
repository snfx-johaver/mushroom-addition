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
      padding: 6px 0;
      overflow: hidden;
      perspective: 520px;
      touch-action: pan-y;
      user-select: none;
      outline: none;
    }
    .carousel.grab-cursor { cursor: grab; }
    .carousel.grab-cursor:active { cursor: grabbing; }
    .carousel.grab-cursor button { cursor: inherit; }
    .carousel.dragging button { transition: none; }
    .stage {
      position: relative;
      width: 100%;
      height: 70px;
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
      transition: transform 130ms cubic-bezier(.2,.8,.2,1), opacity 110ms ease, filter 110ms ease;
      cursor: pointer;
      transform-style: preserve-3d;
      will-change: transform;
    }
    button::after {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        var(--carousel-shadow-angle, 90deg),
        rgb(0 0 0 / var(--carousel-shadow-opacity, 0)),
        transparent 72%
      );
      content: "";
      pointer-events: none;
    }
    button[data-shadow="false"]::after { display: none; }
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
    ha-icon, ha-state-icon { --mdc-icon-size: 28px; pointer-events: none; }
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
  @state() private carouselWidth = 0;
  @state() private dragOffset = 0;
  @state() private dragging = false;

  private dragStartX?: number;
  private dragStartY?: number;
  private lastPointerX?: number;
  private lastPointerTime?: number;
  private horizontalVelocity = 0;
  private pointerAxis: "pending" | "horizontal" | "vertical" = "pending";
  private holdTimer?: number;
  private holdFired = false;
  private tapTimer?: number;
  private tapItem?: AdditionItemConfig;
  private pointerItemIndex?: number;
  private pointerStartedOnItem = false;
  private resizeObserver?: ResizeObserver;

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has("config")) {
      this.clearTap();
      this.cancelPointer();
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
      <div class=${`carousel ${this.grabCursor ? "grab-cursor" : ""} ${this.dragging ? "dragging" : ""}`}
        style=${`perspective:${Math.max(520, this.coverflowDepth * 2)}px`}
        role="listbox"
        aria-label="Entity carousel"
        tabindex="0"
        @keydown=${this.onKeydown}
        @wheel=${this.onWheel}
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.cancelPointer}>
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
    const hidden = this.itemIsHidden(offset, visible);
    const active = index === this.selectedIndex;
    const entity = this.entityFor(item);
    const color = item.color || (entity?.attributes.icon ? "primary" : "primary");
    const modifier = this.coverflowModifier;
    const stretch = this.effect === "coverflow" ? this.coverflowStretch * modifier : 0;
    const slideStep = Math.max(18, 58 + stretch);
    const visualOffset = offset + this.dragOffset / slideStep;
    const visualDistance = Math.abs(visualOffset);
    const alignmentOffset = this.centeredSlides ? 0 : -((visible - 1) * slideStep) / 2;
    const translate = alignmentOffset + offset * slideStep + this.dragOffset;
    const depth = this.effect === "coverflow" ? -visualDistance * this.coverflowDepth * modifier : 0;
    const rotate = this.effect === "coverflow" ? visualOffset * -this.coverflowRotate * modifier : 0;
    const opacity = Math.max(0.18, 1 - visualDistance * (this.effect === "coverflow" ? 0.16 : 0.08));
    const shadowOpacity = this.coverflowSlideShadows
      ? Math.min(0.48, visualDistance * 0.16 * Math.max(0.25, modifier))
      : 0;
    const style = [
      `transform:translateX(${translate}px) translateZ(${depth}px) rotateY(${rotate}deg)`,
      `z-index:${100 - distance}`,
      `opacity:${opacity}`,
      `filter:saturate(${Math.max(0.45, 1 - distance * 0.14)})`,
      `--carousel-color:var(--${color}-color, ${color})`,
      `--carousel-shadow-opacity:${shadowOpacity}`,
      `--carousel-shadow-angle:${visualOffset < 0 ? 270 : 90}deg`,
    ].join(";");
    const picture = item.icon_type === "entity-picture"
      ? entity?.attributes.entity_picture
      : undefined;
    const isEntityActive = entity ? !inactiveStates.has(entity.state.toLowerCase()) : false;
    return html`
      <button
        role="option"
        aria-selected=${active ? "true" : "false"}
        aria-label=${this.itemName(item, entity)}
        class=${`${active ? "active" : ""} ${isEntityActive ? "entity-active" : ""}`}
        data-shadow=${this.effect === "coverflow" && this.coverflowSlideShadows ? "true" : "false"}
        data-carousel-index=${index}
        style=${style}
        ?hidden=${hidden}
        @click=${(event: MouseEvent) => {
          event.stopPropagation();
          if (event.detail !== 0) return;
          if (active) this.runItemAction(item, "tap");
          else this.selectIndex(index);
        }}
        >
        ${picture
          ? html`<span class="picture" style=${`background-image:url("${String(picture)}")`}></span>`
          : item.icon
            ? html`<ha-icon .icon=${item.icon}></ha-icon>`
            : entity
              ? html`<ha-state-icon .hass=${this.hass} .stateObj=${entity}
                  ._config=${this.hass?.config} ._connection=${this.hass?.connection}
                  ._entities=${this.hass?.entities}></ha-state-icon>`
              : html`<ha-icon .icon=${"mdi:circle"}></ha-icon>`}
      </button>
    `;
  }

  private get items(): AdditionItemConfig[] {
    return this.config?.carousel_items ?? [];
  }

  private get visibleCount(): number {
    const configured = this.config?.carousel_slides_per_view ??
      this.config?.parameters?.slidesPerView;
    if (configured === "auto") {
      if (!this.carouselWidth) return this.legacyVisibleCount;
      return Math.min(11, Math.max(1, Math.floor((this.carouselWidth - 16) / 58)));
    }
    const numeric = Number(configured);
    if (Number.isFinite(numeric) && numeric > 0) {
      return Math.min(11, Math.max(1, Math.round(numeric)));
    }
    return this.legacyVisibleCount;
  }

  private get legacyVisibleCount(): number {
    const requested = Math.round(this.config?.carousel_visible_items ?? 7);
    return Math.min(11, Math.max(3, requested));
  }

  private get effect(): "slide" | "coverflow" {
    return this.config?.carousel_effect ?? this.config?.parameters?.effect ?? "coverflow";
  }

  private get grabCursor(): boolean {
    return this.config?.carousel_grab_cursor ??
      this.config?.parameters?.grabCursor ??
      true;
  }

  private get centeredSlides(): boolean {
    return this.config?.carousel_centered_slides ??
      this.config?.parameters?.centeredSlides ??
      true;
  }

  private get coverflowRotate(): number {
    return Number(this.config?.carousel_coverflow_rotate ??
      this.config?.parameters?.coverflowEffect?.rotate ??
      0);
  }

  private get coverflowStretch(): number {
    return Number(this.config?.carousel_coverflow_stretch ??
      this.config?.parameters?.coverflowEffect?.stretch ??
      0);
  }

  private get coverflowDepth(): number {
    return Math.max(0, Number(this.config?.carousel_coverflow_depth ??
      this.config?.parameters?.coverflowEffect?.depth ??
      400));
  }

  private get coverflowModifier(): number {
    return Math.max(0, Number(this.config?.carousel_coverflow_modifier ??
      this.config?.parameters?.coverflowEffect?.modifier ??
      1));
  }

  private get coverflowSlideShadows(): boolean {
    return this.config?.carousel_coverflow_slide_shadows ??
      this.config?.parameters?.coverflowEffect?.slideShadows ??
      true;
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

  private itemIsHidden(offset: number, visible: number): boolean {
    if (!this.centeredSlides) return offset < 0 || offset >= visible;
    const before = Math.floor((visible - 1) / 2);
    const after = Math.ceil((visible - 1) / 2);
    return offset < -before || offset > after;
  }

  protected firstUpdated(): void {
    const carousel = this.shadowRoot?.querySelector<HTMLElement>(".carousel");
    if (!carousel) return;
    this.carouselWidth = carousel.clientWidth;
    if (typeof ResizeObserver === "undefined") return;
    this.resizeObserver = new ResizeObserver(([entry]) => {
      this.carouselWidth = entry.contentRect.width;
    });
    this.resizeObserver.observe(carousel);
  }

  public disconnectedCallback(): void {
    this.cancelPointer();
    this.clearTap();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    super.disconnectedCallback();
  }

  private select(direction: -1 | 1): void {
    this.clearTap();
    const count = this.items.length;
    if (!count) return;
    const next = this.selectedIndex + direction;
    this.selectedIndex = this.config?.carousel_loop === false
      ? Math.min(count - 1, Math.max(0, next))
      : (next + count) % count;
  }

  private selectIndex(index: number): void {
    this.clearTap();
    this.selectedIndex = Math.min(this.items.length - 1, Math.max(0, index));
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.pointerType && event.isPrimary === false) return;
    event.stopPropagation();
    this.clearHold();
    window.clearTimeout(this.tapTimer);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.lastPointerX = event.clientX;
    this.lastPointerTime = event.timeStamp;
    this.horizontalVelocity = 0;
    this.pointerAxis = "pending";
    this.dragOffset = 0;
    this.dragging = false;
    this.holdFired = false;
    const button = event.composedPath().find((node) =>
      node instanceof HTMLElement && node.matches("button[data-carousel-index]")) as HTMLElement | undefined;
    const parsedIndex = Number(button?.dataset.carouselIndex);
    this.pointerStartedOnItem = Boolean(button) && Number.isInteger(parsedIndex);
    this.pointerItemIndex = this.pointerStartedOnItem ? parsedIndex : this.selectedIndex;
    if (this.pointerStartedOnItem && this.pointerItemIndex === this.selectedIndex) {
      this.holdTimer = window.setTimeout(() => {
        this.clearTap();
        this.holdFired = true;
        this.runItemAction(this.items[this.pointerItemIndex ?? this.selectedIndex], "hold");
      }, 500);
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.dragStartX === undefined || this.dragStartY === undefined) return;
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    if (this.pointerAxis === "pending") {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 4) return;
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
        this.pointerAxis = "vertical";
        this.clearTap();
        this.clearHold();
        return;
      }
      this.pointerAxis = "horizontal";
      this.clearTap();
      this.dragging = true;
      this.clearHold();
      try {
        (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
      } catch (error) {
        if (!(error instanceof DOMException)) throw error;
      }
    }
    if (this.pointerAxis !== "horizontal") return;
    event.preventDefault();
    event.stopPropagation();
    const elapsed = Math.max(1, event.timeStamp - (this.lastPointerTime ?? event.timeStamp));
    this.horizontalVelocity = (event.clientX - (this.lastPointerX ?? event.clientX)) / elapsed;
    this.lastPointerX = event.clientX;
    this.lastPointerTime = event.timeStamp;
    this.dragOffset = this.constrainDrag(deltaX);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    event.stopPropagation();
    if (this.dragStartX === undefined) return;
    const delta = event.clientX - this.dragStartX;
    const deltaY = event.clientY - (this.dragStartY ?? event.clientY);
    const itemIndex = this.pointerItemIndex ?? this.selectedIndex;
    const startedOnItem = this.pointerStartedOnItem;
    const wasHorizontal = this.pointerAxis === "horizontal";
    const wasVertical = this.pointerAxis === "vertical" || Math.abs(deltaY) > Math.abs(delta) * 1.15;
    const elapsed = Math.max(1, event.timeStamp - (this.lastPointerTime ?? event.timeStamp));
    const releaseVelocity = Math.abs(event.clientX - (this.lastPointerX ?? event.clientX)) > 0
      ? (event.clientX - (this.lastPointerX ?? event.clientX)) / elapsed
      : this.horizontalVelocity;
    this.clearHold();
    this.resetPointer();
    if (wasHorizontal && (Math.abs(delta) >= 10 || Math.abs(releaseVelocity) >= 0.16)) {
      this.select(delta > 0 || releaseVelocity > 0 ? -1 : 1);
      return;
    }
    if (this.holdFired) {
      this.holdFired = false;
      return;
    }
    if (wasHorizontal || wasVertical || Math.max(Math.abs(delta), Math.abs(deltaY)) >= 6 || !startedOnItem) {
      this.clearTap();
      return;
    }
    if (itemIndex !== this.selectedIndex) {
      this.selectIndex(itemIndex);
      return;
    }
    const item = this.items[itemIndex];
    if (this.tapTimer !== undefined && this.tapItem === item) {
      this.clearTap();
      this.runItemAction(item, "double_tap");
    } else if (item.double_tap_action && !["none", "default"].includes(item.double_tap_action.action)) {
      this.clearTap();
      this.tapItem = item;
      this.tapTimer = window.setTimeout(() => {
        this.clearTap();
        this.runItemAction(item, "tap");
      }, 300);
    } else {
      this.runItemAction(item, "tap");
    }
  };

  private readonly cancelPointer = (): void => {
    this.clearHold();
    this.clearTap();
    this.holdFired = false;
    this.resetPointer();
  };

  private constrainDrag(delta: number): number {
    if (this.config?.carousel_loop !== false) return delta;
    const pullingPastStart = this.selectedIndex === 0 && delta > 0;
    const pullingPastEnd = this.selectedIndex === this.items.length - 1 && delta < 0;
    return pullingPastStart || pullingPastEnd ? delta * 0.28 : delta;
  }

  private resetPointer(): void {
    this.dragStartX = undefined;
    this.dragStartY = undefined;
    this.lastPointerX = undefined;
    this.lastPointerTime = undefined;
    this.horizontalVelocity = 0;
    this.pointerAxis = "pending";
    this.pointerItemIndex = undefined;
    this.pointerStartedOnItem = false;
    this.dragOffset = 0;
    this.dragging = false;
  }

  private clearHold(): void {
    if (this.holdTimer !== undefined) window.clearTimeout(this.holdTimer);
    this.holdTimer = undefined;
  }

  private clearTap(): void {
    window.clearTimeout(this.tapTimer);
    this.tapTimer = undefined;
    this.tapItem = undefined;
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
      event.stopPropagation();
      if (event.repeat) { event.preventDefault(); return; }
      this.clearTap();
      this.runItemAction(this.items[this.selectedIndex], "tap");
    } else return;
    event.preventDefault();
    event.stopPropagation();
  };

  private runItemAction(item: AdditionItemConfig | undefined, gesture: "tap" | "hold" | "double_tap"): void {
    if (!item) return;
    const configuredAction = item[`${gesture}_action`];
    const action: ActionConfig = configuredAction && configuredAction.action !== "default" ? configuredAction : {
      action: gesture === "tap" && item.entity ? "more-info" : "none",
    };
    fireEvent(this, "hass-action", {
      config: {
        type: this.config?.type,
        entity: item.entity,
        [`${gesture}_action`]: action,
      },
      action: gesture,
    });
  }
}
