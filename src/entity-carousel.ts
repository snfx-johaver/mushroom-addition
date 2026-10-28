import { localizeText } from "./localize";
import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { cssUrl, fireEvent } from "./helpers";
import type { ActionConfig, AdditionConfig, AdditionItemConfig, CarouselEffect, HassEntity, HomeAssistant } from "./types";

export const carouselControlEnabled = (
  config: AdditionConfig | undefined, key: "pagination" | "navigation" | "scrollbar",
): boolean => {
  const direct = config?.[`carousel_${key}`];
  if (typeof direct === "boolean") return direct;
  const parameter = config?.parameters?.[key];
  return parameter !== null && typeof parameter === "object" ? parameter.enabled !== false : parameter === true;
};

const inactiveStates = new Set(["off", "unknown", "unavailable", "none", "idle"]);
const boundedSize = (value: number | undefined, fallback: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, typeof value === "number" && Number.isFinite(value) ? value : fallback));

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
      height: var(--carousel-stage-height, 70px);
      transform-style: preserve-3d;
    }
    .item {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: var(--carousel-button-width, 58px);
      height: var(--carousel-button-height, 58px);
      margin: calc(var(--carousel-button-height, 58px) / -2) calc(var(--carousel-button-width, 58px) / -2);
      padding: 0;
      border: 0;
      border-radius: 18px;
      color: var(--carousel-color, var(--primary-color));
      background: var(--card-background-color);
      box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12));
      transition: transform 270ms cubic-bezier(.2,.8,.2,1), opacity 270ms ease, filter 110ms ease;
      cursor: pointer;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      will-change: transform;
    }
    .item::after {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      box-shadow: 0 3px 8px rgb(0 0 0 / var(--carousel-shadow-opacity, 0));
      content: "";
      pointer-events: none;
    }
    .item[data-shadow="false"]::after { display: none; }
    .item.active {
      color: var(--carousel-color, var(--primary-color));
    }
    .icon-circle {
      display: grid;
      place-items: center;
      width: var(--carousel-picture-size, 40px);
      height: var(--carousel-picture-size, 40px);
      border-radius: 50%;
      background: color-mix(in srgb, var(--carousel-color, var(--primary-color)) 16%, transparent);
    }
    .item[hidden] { display: none; }
    button:focus-visible, input:focus-visible, .carousel:focus-visible {
      outline: 2px solid var(--primary-color); outline-offset: 2px;
    }
    .viewport.has-navigation { display: grid; grid-template-columns: 32px minmax(0, 1fr) 32px; align-items: center; gap: 4px; }
    .navigation {
      box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12));
      width: 32px; height: 32px; padding: 0; display: grid; place-items: center;
      border: 0; border-radius: 12px; background: var(--addition-neutral-background);
      color: var(--primary-text-color); cursor: pointer;
    }
    .navigation:disabled { opacity: .35; cursor: default; }
    .navigation ha-icon { --mdc-icon-size: 22px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 2px; padding: 0 8px; }
    .pagination.bullets { flex-wrap: wrap; min-width: 0; }
    .dot {
      flex: 0 0 24px; width: 24px; height: 24px; border: 0; padding: 0;
      display: grid; place-items: center; background: transparent; cursor: pointer;
    }
    .dot::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--secondary-text-color); opacity: .4; }
    .dot[aria-current="true"]::before { background: var(--primary-color); opacity: 1; }
    .pagination output { font-size: 12px; color: var(--secondary-text-color); line-height: 24px; }
    .pagination progress { width: 100%; height: 5px; margin: 8px 0; accent-color: var(--primary-color); }
    .scrollbar { display: block; box-sizing: border-box; width: calc(100% - 16px); height: 20px; margin: 0 8px; accent-color: var(--primary-color); cursor: pointer; }
    @media (prefers-reduced-motion: reduce) { .item { transition: none; } }
    .item ha-icon, .item ha-state-icon { --mdc-icon-size: var(--carousel-icon-size, 28px); pointer-events: none; }
    .picture {
      width: var(--carousel-picture-size, 34px);
      height: var(--carousel-picture-size, 34px);
      border-radius: 50%;
      background: center / cover no-repeat;
      pointer-events: none;
    }
    .label {
      display: -webkit-box;
      min-height: calc(var(--mush-card-secondary-line-height, 16px) * 2);
      max-width: calc(100% - 24px);
      overflow: hidden;
      overflow-wrap: anywhere;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: var(--mush-card-secondary-color, var(--secondary-text-color));
      font-size: var(--mush-card-secondary-font-size, 12px);
      font-weight: var(--mush-card-secondary-font-weight, 400);
      line-height: var(--mush-card-secondary-line-height, 16px);
      letter-spacing: var(--mush-card-secondary-letter-spacing, .4px);
      text-align: center;
      white-space: normal;
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
  private observedCarousel?: HTMLElement;

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
      return html`<div class="carousel"><span class="label">${localizeText(this.hass, "Add carousel items in the card editor")}</span></div>`;
    }
    const visible = this.visibleCount;
    const activeItem = items[this.selectedIndex];
    const activeEntity = this.entityFor(activeItem);
    const navigation = carouselControlEnabled(this.config, "navigation");
    const loop = this.config?.carousel_loop !== false;
    return html`
      <div class="viewport ${navigation ? "has-navigation" : ""}"
        style=${`--carousel-button-width:${this.buttonWidth}px;--carousel-button-height:${this.buttonHeight}px;--carousel-stage-height:${this.buttonHeight + 12}px;--carousel-icon-size:${this.iconSize}px;--carousel-picture-size:${Math.min(this.iconSize * 34 / 28, this.maxIconSize)}px`}
        @pointerdown=${this.stopControlEvent} @click=${this.stopControlEvent} @dblclick=${this.stopControlEvent}>
      ${navigation ? html`<button class="navigation" aria-label="${localizeText(this.hass, "Previous item")}"
        ?disabled=${items.length < 2 || (!loop && this.selectedIndex === 0)}
        @click=${() => this.select(-1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>` : nothing}
      <div class=${`carousel ${this.grabCursor ? "grab-cursor" : ""} ${this.dragging ? "dragging" : ""}`}
        data-effect=${this.effect}
        style=${`perspective:${Math.max(520, this.coverflowDepth * 2)}px`}
        role="listbox"
        aria-label="${localizeText(this.hass, "Entity carousel")}"
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
          <div class="label" title=${this.itemName(activeItem, activeEntity)}>
            ${this.itemName(activeItem, activeEntity)}
            ${this.showEntityState(activeEntity)
              ? html`<span class="state">${activeEntity?.state}</span>`
              : nothing}
          </div>
        `}
      </div>
      ${navigation ? html`<button class="navigation" aria-label="${localizeText(this.hass, "Next item")}"
        ?disabled=${items.length < 2 || (!loop && this.selectedIndex === items.length - 1)}
        @click=${() => this.select(1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>` : nothing}
      </div>
      <div @pointerdown=${this.stopControlEvent} @click=${this.stopControlEvent}
        @dblclick=${this.stopControlEvent} @keydown=${this.stopControlEvent} @keyup=${this.stopControlEvent}>
        ${carouselControlEnabled(this.config, "pagination") ? this.renderPagination() : nothing}
        ${carouselControlEnabled(this.config, "scrollbar") ? html`
          <input class="scrollbar" type="range" min="0" max=${items.length - 1} step="1"
            .value=${String(this.selectedIndex)} ?disabled=${items.length < 2}
            aria-label="${localizeText(this.hass, "Carousel position")}" aria-valuetext=${this.itemName(activeItem, activeEntity)}
            @input=${(event: Event) => this.selectIndex(Number((event.currentTarget as HTMLInputElement).value))}>
        ` : nothing}
      </div>
    `;
  }

  private readonly stopControlEvent = (event: Event): void => { event.stopPropagation(); };

  private renderPagination(): TemplateResult {
    const parameter = this.config?.parameters?.pagination;
    const type = this.config?.carousel_pagination_type ??
      (parameter && typeof parameter === "object" ? parameter.type : undefined) ?? "bullets";
    return html`<div class="pagination ${type}">
      ${type === "fraction" ? html`<output aria-live="polite">${this.selectedIndex + 1} / ${this.items.length}</output>`
        : type === "progressbar" ? html`<progress aria-label="${localizeText(this.hass, "Carousel progress")}" value=${this.selectedIndex + 1} max=${this.items.length}></progress>`
        : this.items.map((item, index) => html`<button class="dot"
            aria-label=${this.itemName(item)} aria-current=${index === this.selectedIndex ? "true" : "false"}
            @click=${() => this.selectIndex(index)}></button>`)}
    </div>`;
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
    const slideStep = Math.max(18, this.buttonWidth + stretch);
    const visualOffset = offset + this.dragOffset / slideStep;
    const visualDistance = Math.abs(visualOffset);
    const alignmentOffset = this.singleSlideEffect || this.centeredSlides ? 0 : -((visible - 1) * slideStep) / 2;
    const translate = alignmentOffset + offset * slideStep + this.dragOffset;
    const depth = this.effect === "coverflow" ? -visualDistance * this.coverflowDepth * modifier : 0;
    const rotate = this.effect === "coverflow" ? visualOffset * -this.coverflowRotate * modifier : 0;
    const opacity = Math.max(0.18, 1 - visualDistance * (this.effect === "coverflow" ? 0.16 : 0.08));
    const shadowOpacity = this.coverflowSlideShadows
      ? Math.min(0.48, visualDistance * 0.16 * Math.max(0.25, modifier))
      : 0;
    const progress = offset + Math.max(-1, Math.min(1, this.dragOffset / this.buttonWidth));
    const transform = this.effect === "fade" ? "translateX(0px)"
      : this.effect === "cube" ? `rotateY(${progress * 90}deg)`
      : this.effect === "flip" ? `rotateY(${progress * 180}deg)`
      : `translateX(${translate}px) translateZ(${depth}px) rotateY(${rotate}deg)`;
    const style = [
      `transform:${transform}`,
      `transform-origin:${this.effect === "cube" ? `50% 50% -${this.buttonWidth / 2}px` : "50% 50%"}`,
      `z-index:${100 - distance}`,
      `opacity:${this.effect === "fade" ? Math.max(0, 1 - Math.abs(progress)) : this.singleSlideEffect ? 1 : opacity}`,
      `pointer-events:${this.singleSlideEffect && !active ? "none" : "auto"}`,
      `filter:saturate(${Math.max(0.45, 1 - distance * 0.14)})`,
      `--carousel-color:var(--${color}-color, ${color})`,
      `--carousel-shadow-opacity:${shadowOpacity}`,
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
        class=${`item ${active ? "active" : ""} ${isEntityActive ? "entity-active" : ""}`}
        tabindex=${active ? 0 : -1}
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
        <span class="icon-circle">${picture
          ? html`<span class="picture" style=${styleMap({ backgroundImage: cssUrl(picture) })}></span>`
          : item.icon
            ? html`<ha-icon .icon=${item.icon}></ha-icon>`
            : entity
              ? html`<ha-state-icon .hass=${this.hass} .stateObj=${entity}
                  ._config=${this.hass?.config} ._connection=${this.hass?.connection}
                  ._entities=${this.hass?.entities}></ha-state-icon>`
              : html`<ha-icon .icon=${"mdi:circle"}></ha-icon>`}</span>
      </button>
    `;
  }

  private get items(): AdditionItemConfig[] {
    return this.config?.carousel_items ?? [];
  }

  private get buttonWidth(): number {
    const width = boundedSize(this.config?.carousel_button_width, 58, 32, 160);
    return this.carouselWidth > 0 ? Math.min(width, Math.max(24, this.carouselWidth - 16)) : width;
  }

  private get buttonHeight(): number {
    return boundedSize(this.config?.carousel_button_height, 58, 32, 160);
  }

  private get maxIconSize(): number {
    return Math.min(this.buttonWidth, this.buttonHeight) - 12;
  }

  private get iconSize(): number {
    return Math.min(boundedSize(this.config?.carousel_icon_size, 28, 12, 96), this.maxIconSize);
  }

  private get visibleCount(): number {
    if (this.singleSlideEffect) return 1;
    const configured = this.config?.carousel_slides_per_view ??
      this.config?.parameters?.slidesPerView;
    if (configured === "auto") {
      if (!this.carouselWidth) return this.legacyVisibleCount;
      return Math.min(11, Math.max(1, Math.floor((this.carouselWidth - 16) / this.buttonWidth)));
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

  private get effect(): CarouselEffect {
    return this.config?.carousel_effect ?? this.config?.parameters?.effect ?? "coverflow";
  }

  private get singleSlideEffect(): boolean {
    return ["fade", "cube", "flip"].includes(this.effect);
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
    if (this.singleSlideEffect) return Math.abs(offset) > 1;
    if (!this.centeredSlides) return offset < 0 || offset >= visible;
    const before = Math.floor((visible - 1) / 2);
    const after = Math.ceil((visible - 1) / 2);
    return offset < -before || offset > after;
  }

  protected updated(): void {
    const carousel = this.shadowRoot?.querySelector<HTMLElement>(".carousel");
    if (!carousel || carousel === this.observedCarousel) return;
    this.resizeObserver?.disconnect();
    this.observedCarousel = carousel;
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
    this.observedCarousel = undefined;
    super.disconnectedCallback();
  }

  private select(direction: -1 | 1, steps = 1): void {
    this.clearTap();
    const count = this.items.length;
    if (!count) return;
    const next = this.selectedIndex + direction * steps;
    this.selectedIndex = this.config?.carousel_loop === false
      ? Math.min(count - 1, Math.max(0, next))
      : ((next % count) + count) % count;
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
      const direction = delta > 0 || (delta === 0 && releaseVelocity > 0) ? -1 : 1;
      const slideStep = Math.max(18, this.buttonWidth + this.coverflowStretch);
      this.select(direction, this.singleSlideEffect ? 1 : Math.max(1, Math.round(Math.abs(delta) / slideStep)));
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
