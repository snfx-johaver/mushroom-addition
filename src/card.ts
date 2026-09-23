import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import type { AdditionConfig, CatalogItem, HomeAssistant, WeatherForecast } from "./types";
import { handleAction, normalizeConfig } from "./helpers";
import { sharedStyles } from "./styles";
import { renderByFamily } from "./renderers";

export class MushroomAdditionCard extends LitElement {
  public static styles = sharedStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) protected config?: AdditionConfig;
  protected descriptor?: CatalogItem;
  private holdTimer?: number;
  private tapTimer?: number;
  private holdFired = false;
  private forecastSubscriptionKey?: string;
  private unsubscribeForecast?: () => void;
  private forecastGeneration = 0;
  private forecast: WeatherForecast[] = [];

  public setConfig(config: AdditionConfig): void {
    if (!config || typeof config !== "object") throw new Error("A card configuration is required.");
    const normalized = normalizeConfig(config);
    const previousKey = this.forecastKey(this.config);
    this.config = normalized;
    if (previousKey !== this.forecastKey(normalized)) this.stopForecastSubscription();
    this.requestUpdate();
    void this.subscribeForecast();
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("mushroom-addition-editor");
  }

  public static getStubConfig(): AdditionConfig {
    return { type: "custom:mushroom-addition-card-generic", show_icon: true, show_state: true };
  }

  public getCardSize(): number {
    if (["weather", "climate", "scene", "energy", "sensor"].includes(this.descriptor?.family ?? "")) return 2;
    return 1;
  }

  protected render() {
    if (!this.config || !this.descriptor) return nothing;
    if (!this.hass) return html`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    if (this.descriptor.kind === "container") return this.renderContainer();
    const entity = this.config.entity ? this.hass.states[this.config.entity] : undefined;
    return renderByFamily({
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity,
      forecast: this.forecast,
      actionSurface: this.actionSurface,
      service: (domain, service, data) => void this.hass?.callService(domain, service, data),
    });
  }

  protected updated(): void {
    void this.subscribeForecast();
  }

  public disconnectedCallback(): void {
    this.stopForecastSubscription();
    super.disconnectedCallback();
  }

  private forecastKey(config = this.config): string | undefined {
    if (this.descriptor?.family !== "weather" || !config?.show_forecast || !config.entity) return undefined;
    return `${config.entity}:daily`;
  }

  private stopForecastSubscription(): void {
    this.forecastGeneration += 1;
    this.unsubscribeForecast?.();
    this.unsubscribeForecast = undefined;
    this.forecastSubscriptionKey = undefined;
    this.forecast = [];
  }

  private async subscribeForecast(): Promise<void> {
    const key = this.forecastKey();
    if (
      !key ||
      !this.config?.entity ||
      !this.hass?.connection?.subscribeMessage ||
      this.forecastSubscriptionKey === key
    ) return;
    this.stopForecastSubscription();
    this.forecastSubscriptionKey = key;
    const generation = this.forecastGeneration;
    try {
      const unsubscribe = await this.hass.connection.subscribeMessage<{ forecast?: WeatherForecast[] }>((message) => {
        if (generation !== this.forecastGeneration || key !== this.forecastSubscriptionKey) return;
        this.forecast = message.forecast ?? [];
        this.requestUpdate();
      }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: "daily",
      });
      if (generation !== this.forecastGeneration || key !== this.forecastSubscriptionKey) unsubscribe();
      else this.unsubscribeForecast = unsubscribe;
    } catch (error) {
      if (generation === this.forecastGeneration) this.forecastSubscriptionKey = undefined;
      console.warn("Mushroom Cards Addition: unable to load weather forecast", error);
    }
  }

  private readonly actionSurface = (classes: string, content: TemplateResult): TemplateResult => {
    const chip = this.descriptor?.kind === "chip";
    const surface = html`
      <div class="${classes} action-surface" role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${content}
      </div>`;
    return chip ? surface : html`<ha-card class="minimalist-card">${surface}</ha-card>`;
  };

  private renderContainer() {
    const chips = this.config?.chips ?? [];
    return html`<ha-card class="minimalist-card"><div class="chips">
      ${chips.map((chip) => {
        const element = document.createElement(chip.type.replace(/^custom:/, "")) as MushroomAdditionCard;
        element.hass = this.hass;
        element.setConfig(chip);
        return element;
      })}
      ${chips.length === 0 ? html`<div class="preview">Add chips in the visual editor.</div>` : nothing}
    </div></ha-card>`;
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
}
