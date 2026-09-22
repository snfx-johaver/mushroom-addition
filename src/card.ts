import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant } from "./types";
import { activeStates, displayName, handleAction, normalizeConfig, stateLabel } from "./helpers";
import { sharedStyles } from "./styles";

export class MushroomAdditionCard extends LitElement {
  public static styles = sharedStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  protected config?: AdditionConfig;
  protected descriptor?: CatalogItem;
  private holdTimer?: number;
  private tapTimer?: number;
  private holdFired = false;

  public setConfig(config: AdditionConfig): void {
    if (!config || typeof config !== "object") throw new Error("A card configuration is required.");
    this.config = normalizeConfig(config);
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("mushroom-addition-editor");
  }

  public static getStubConfig(): AdditionConfig {
    return { type: "custom:mushroom-addition-card-generic", show_icon: true, show_state: true };
  }

  public getCardSize(): number {
    return this.descriptor?.family === "weather" ? 2 : 1;
  }

  protected render() {
    if (!this.config) return nothing;
    if (!this.hass) return html`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    if (this.descriptor?.kind === "container") return this.renderContainer();

    const entity = this.getEntity();
    const unavailable = Boolean(this.config.entity && !entity);
    const active = entity ? activeStates.has(entity.state.toLowerCase()) : false;
    let name = displayName(this.config, entity);
    const secondary = this.config.secondary ||
      (this.config.show_state === false || !this.config.entity ? "" : stateLabel(entity));
    let resolvedSecondary = secondary;
    if (this.descriptor?.upstreamId === "card_generic_swap" || this.config.variant === "swapped") {
      resolvedSecondary = name;
      name = secondary || name;
    }
    if (this.config.variant === "custom-state" && entity) {
      resolvedSecondary = name;
      name = stateLabel(entity);
    }
    const icon = this.config.icon || entity?.attributes.icon || this.defaultIcon();
    const accent = this.config.icon_color
      ? `var(--rgb-${this.config.icon_color}-color, var(--mush-rgb-blue, 33, 150, 243))`
      : "var(--mush-rgb-blue, 33, 150, 243)";
    const variantClass = [
      ["compact", "small", "no-external-resource"].includes(this.config.variant ?? "") ? "compact" : "",
      this.config.variant === "popup" ? "popup" : "",
      this.descriptor?.upstreamId === "card_binary_sensor_alert" || this.config.variant === "alert" ? "alert" : "",
    ].filter(Boolean).join(" ");

    if (this.descriptor?.kind === "chip") {
      return html`
        <div
          class="chip ${active ? "active" : ""} ${unavailable ? "unavailable" : ""}"
          style=${`--mac-accent: ${accent}`}
          role="button"
          tabindex="0"
          aria-label=${`${name}: ${resolvedSecondary}`}
          @click=${this.tap}
          @dblclick=${this.doubleTap}
          @pointerdown=${this.pointerDown}
          @pointerup=${this.pointerUp}
          @pointercancel=${this.pointerUp}
          @keydown=${this.keydown}
        >
          ${this.config.show_icon === false ? nothing : html`<span class="icon"><ha-icon .icon=${icon}></ha-icon></span>`}
          <span class="chip-label">${this.descriptor.family === "text" ? resolvedSecondary : name}${this.config.show_state === false ? "" : resolvedSecondary && this.descriptor.family !== "text" ? ` · ${resolvedSecondary}` : ""}</span>
        </div>
      `;
    }

    return html`
      <ha-card>
        <div
          class="card ${this.config.layout === "vertical" ? "vertical" : ""} ${variantClass} ${active ? "active" : ""} ${unavailable ? "unavailable" : ""}"
          style=${`--mac-accent: ${accent}`}
          role="button"
          tabindex="0"
          aria-label=${`${name}: ${resolvedSecondary}`}
          @click=${this.tap}
          @dblclick=${this.doubleTap}
          @pointerdown=${this.pointerDown}
          @pointerup=${this.pointerUp}
          @pointercancel=${this.pointerUp}
          @keydown=${this.keydown}
        >
          ${this.renderArtwork(entity)}
          ${this.config.show_icon === false ? nothing : html`<span class="icon"><ha-icon .icon=${icon}></ha-icon></span>`}
          <span class="copy">
            <div class="primary">${name}</div>
            ${resolvedSecondary ? html`<div class="secondary">${resolvedSecondary}</div>` : nothing}
          </span>
          ${this.descriptor?.family === "metric" && entity ? html`<span class="metric">${stateLabel(entity)}</span>` : nothing}
          ${this.renderDetails()}
          ${this.renderVariantContent(entity)}
        </div>
      </ha-card>
    `;
  }

  private getEntity(): HassEntity | undefined {
    return this.config?.entity && this.hass ? this.hass.states[this.config.entity] : undefined;
  }

  private renderDetails() {
    if (!this.hass || !this.config?.entities?.length) return nothing;
    return html`<div class="details">
      ${this.config.entities.map((entityId) => {
        const entity = this.hass?.states[entityId];
        return html`<span class="detail">${displayName({ type: "", entity: entityId }, entity)}: ${stateLabel(entity)}</span>`;
      })}
    </div>`;
  }

  private renderArtwork(entity?: HassEntity) {
    if (this.config?.variant !== "artwork" || !entity?.attributes.entity_picture) return nothing;
    return html`<div class="artwork" style=${`background-image: url("${String(entity.attributes.entity_picture)}")`}></div>`;
  }

  private renderVariantContent(entity?: HassEntity) {
    const variant = this.config?.variant;
    if (!variant || !this.hass || !this.config) return nothing;
    if (variant === "slider") {
      const brightness = Number(entity?.attributes.brightness);
      const raw = Number.isFinite(brightness) ? Math.round(brightness / 2.55) : Number(entity?.state ?? 0);
      return html`<div class="variant-content">
        <input
          type="range"
          min="0"
          max="100"
          .value=${String(Number.isFinite(raw) ? raw : 0)}
          aria-label="Value"
          @pointerdown=${this.stopPropagation}
          @click=${this.stopPropagation}
          @change=${this.sliderChanged}
        />
      </div>`;
    }
    if (variant === "controls") {
      return html`<div class="variant-content">
        ${["media_previous_track", "media_play_pause", "media_next_track"].map((service) => html`
          <button
            class="control"
            aria-label=${service.replaceAll("_", " ")}
            @pointerdown=${this.stopPropagation}
            @click=${(event: Event) => this.mediaControl(event, service)}
          >
            <ha-icon .icon=${service === "media_play_pause" ? "mdi:play-pause" : service.includes("previous") ? "mdi:skip-previous" : "mdi:skip-next"}></ha-icon>
          </button>
        `)}
      </div>`;
    }
    if (variant === "forecast") {
      const forecast = Array.isArray(entity?.attributes.forecast)
        ? entity.attributes.forecast.slice(0, 3) as Array<Record<string, unknown>>
        : [];
      return html`<div class="variant-content forecast">
        ${forecast.length ? forecast.map((period) => html`
          <span>${String(period.condition ?? "")} ${String(period.temperature ?? "")}</span>
        `) : html`<span>Forecast unavailable</span>`}
      </div>`;
    }
    if (variant === "list" || variant === "welcome") {
      return html`<div class="variant-content">
        ${(this.config.entities ?? []).map((entityId) => html`
          <button
            class="control"
            aria-label=${`Activate ${entityId}`}
            @pointerdown=${this.stopPropagation}
            @click=${(event: Event) => this.activateScene(event, entityId)}
          >
            <ha-icon icon="mdi:palette"></ha-icon>
          </button>
        `)}
      </div>`;
    }
    return nothing;
  }

  private renderContainer() {
    const chips = this.config?.chips ?? [];
    return html`
      <ha-card>
        <div class="chips">
          ${chips.map((chip) => {
            const tag = chip.type.replace(/^custom:/, "");
            const element = document.createElement(tag) as MushroomAdditionCard;
            element.hass = this.hass;
            element.setConfig(chip);
            return element;
          })}
          ${chips.length === 0 ? html`<div class="preview">Add chips in the visual editor.</div>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private defaultIcon(): string {
    if (this.descriptor?.upstreamId === "custom_card_playstation") {
      return this.config?.variant === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation";
    }
    const icons: Record<string, string> = {
      weather: "mdi:weather-partly-cloudy",
      presence: "mdi:account",
      media: "mdi:play-circle",
      climate: "mdi:thermostat",
      metric: "mdi:gauge",
      cover: "mdi:window-shutter",
      control: "mdi:power",
      text: "mdi:text",
      camera: "mdi:camera",
      navigation: "mdi:arrow-right",
      entity: "mdi:information",
    };
    return icons[this.descriptor?.family ?? "entity"] ?? "mdi:information";
  }

  private readonly keydown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.runAction("tap_action");
    }
  };

  private readonly pointerDown = (): void => {
    this.holdFired = false;
    this.holdTimer = window.setTimeout(() => {
      this.holdFired = true;
      this.runAction("hold_action");
    }, 500);
  };

  private readonly pointerUp = (): void => {
    if (this.holdTimer) window.clearTimeout(this.holdTimer);
    this.holdTimer = undefined;
  };

  private readonly tap = (event: MouseEvent): void => {
    if (this.holdFired) {
      this.holdFired = false;
      return;
    }
    if (event.detail > 1) return;
    if (this.config?.double_tap_action?.action && this.config.double_tap_action.action !== "none") {
      if (this.tapTimer) window.clearTimeout(this.tapTimer);
      this.tapTimer = window.setTimeout(() => this.runAction("tap_action"), 300);
      return;
    }
    this.runAction("tap_action");
  };

  private readonly doubleTap = (): void => {
    if (this.tapTimer) window.clearTimeout(this.tapTimer);
    this.tapTimer = undefined;
    this.runAction("double_tap_action");
  };

  private runAction(key: "tap_action" | "hold_action" | "double_tap_action"): void {
    if (!this.hass || !this.config) return;
    const action = key === "tap_action" ? "tap" : key === "hold_action" ? "hold" : "double_tap";
    handleAction(this, this.config, action);
  }

  private readonly stopPropagation = (event: Event): void => event.stopPropagation();

  private readonly sliderChanged = (event: Event): void => {
    event.stopPropagation();
    if (!this.hass || !this.config?.entity) return;
    const value = Number((event.target as HTMLInputElement).value);
    const domain = this.config.entity.split(".", 1)[0];
    if (domain === "light") {
      void this.hass.callService("light", "turn_on", { entity_id: this.config.entity, brightness_pct: value });
    } else {
      void this.hass.callService("input_number", "set_value", { entity_id: this.config.entity, value });
    }
  };

  private mediaControl(event: Event, service: string): void {
    event.stopPropagation();
    if (this.hass && this.config?.entity) {
      void this.hass.callService("media_player", service, { entity_id: this.config.entity });
    }
  }

  private activateScene(event: Event, entityId: string): void {
    event.stopPropagation();
    if (this.hass) void this.hass.callService("scene", "turn_on", { entity_id: entityId });
  }
}
