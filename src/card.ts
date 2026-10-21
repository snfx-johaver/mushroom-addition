import { localizeText } from "./localize";
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import type { AdditionConfig, CatalogItem, HomeAssistant, WeatherForecast } from "./types";
import { handleAction, normalizeConfig } from "./helpers";
import { sharedStyles } from "./styles";
import { renderAutomaticPresentation, renderByFamily, type RenderContext } from "./renderers";
import { PARITY_BY_ID } from "./parity.generated";

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
  private energyBuySellTimer?: number;
  private welcomeTimer?: number;
  private forecast: WeatherForecast[] = [];

  public setConfig(config: AdditionConfig): void {
    if (!config || typeof config !== "object") throw new Error("A card configuration is required.");
    const normalized = normalizeConfig(config);
    this.clearGestures();
    const previousKey = this.forecastKey(this.config);
    this.config = normalized;
    if (previousKey !== this.forecastKey(normalized)) this.stopForecastSubscription();
    this.scheduleEnergyBuySellRefresh();
    this.scheduleWelcomeRefresh();
    this.requestUpdate();
    void this.subscribeForecast();
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("mushroom-addition-editor");
  }

  public static getStubConfig(): AdditionConfig {
    return { type: "custom:mushroom-addition-card-battery", show_icon: true, show_state: true };
  }

  public getCardSize(): number {
    if (this.descriptor?.upstreamId === "pi_hole_card") return 8;
    if (this.descriptor?.upstreamId === "remote_card") return 8;
    if (this.descriptor?.upstreamId === "upcoming_media") {
      const count = this.config?.upcoming_max_items;
      return 1 + Math.min(50, Math.max(1, typeof count === "number" && Number.isFinite(count) ? count : 5)) * 2;
    }
    if (["weather", "climate", "scene", "energy", "sensor"].includes(this.descriptor?.family ?? "")) return 2;
    return 1;
  }

  protected render() {
    if (!this.config || !this.descriptor) return nothing;
    if (!this.hass) return html`<ha-card><div class="preview">${localizeText(this.hass, "Mushroom Addition preview")}</div></ha-card>`;
    const entity = this.config.entity ? this.hass.states[this.config.entity] : undefined;
    const presentation = { rendered: false };
    const context: RenderContext = {
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity,
      forecast: this.forecast,
      presentation,
      actionSurface: (classes, content, style) => this.actionSurface(
        classes,
        presentation.rendered
          ? content
          : html`${renderAutomaticPresentation(context)}${content}`,
        style,
      ),
      service: (domain, service, data) => void this.hass?.callService(domain, service, data),
    };
    return renderByFamily(context);
  }

  protected willUpdate(): void {
    this.toggleAttribute("dark", this.hass?.themes?.darkMode === true);
  }

  protected updated(): void {
    void this.subscribeForecast();
  }

  public disconnectedCallback(): void {
    this.clearGestures();
    this.stopForecastSubscription();
    this.stopEnergyBuySellRefresh();
    this.stopWelcomeRefresh();
    super.disconnectedCallback();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.scheduleEnergyBuySellRefresh();
    this.scheduleWelcomeRefresh();
  }

  private scheduleWelcomeRefresh(): void {
    this.stopWelcomeRefresh();
    if (this.descriptor?.upstreamId !== "custom_card_welcome" || !this.isConnected) return;
    this.welcomeTimer = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  private stopWelcomeRefresh(): void {
    if (this.welcomeTimer !== undefined) window.clearInterval(this.welcomeTimer);
    this.welcomeTimer = undefined;
  }

  private scheduleEnergyBuySellRefresh(): void {
    this.stopEnergyBuySellRefresh();
    if (this.descriptor?.upstreamId !== "advanced_energy_buy_sell" || !this.isConnected) return;
    const configuredMinutes = Number(this.config?.buy_sell_update_interval);
    const minutes = Number.isFinite(configuredMinutes) && configuredMinutes > 0
      ? Math.max(1, Math.min(120, configuredMinutes))
      : 5;
    this.energyBuySellTimer = window.setInterval(() => this.requestUpdate(), minutes * 60_000);
  }

  private stopEnergyBuySellRefresh(): void {
    if (this.energyBuySellTimer !== undefined) window.clearInterval(this.energyBuySellTimer);
    this.energyBuySellTimer = undefined;
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
      console.warn("Mushroom Addition: unable to load weather forecast", error);
    }
  }

  private readonly actionSurface = (classes: string, content: TemplateResult, style = ""): TemplateResult => {
    const parity = this.descriptor ? PARITY_BY_ID.get(this.descriptor.upstreamId) : undefined;
    const native = this.descriptor?.sourcePath.startsWith("src/") ?? false;
    if (!parity && !native) {
      throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
    }
    const parityClass = parity ? ` parity-${parity.rendererId.replaceAll("_", "-")}` : "";
    const layoutClass = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "";
    const multilineClass = this.config?.multiline_secondary ? " multiline-secondary" : "";
    const fillClass = this.config?.fill_container ? " fill-container" : "";
    const variantClass = this.config?.variant ? ` variant-${this.config.variant}` : "";
    const surface = html`
      <div class="${classes}${parityClass}${layoutClass}${multilineClass}${fillClass}${variantClass} action-surface" style=${style} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${content}
      </div>`;
    return html`<ha-card class="mushroom-addition-card">${surface}</ha-card>`;
  };

  private readonly keydown = (event: KeyboardEvent): void => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.runAction("tap_action");
    }
  };

  private clearGestures(): void {
    if (this.holdTimer !== undefined) window.clearTimeout(this.holdTimer);
    if (this.tapTimer !== undefined) window.clearTimeout(this.tapTimer);
    this.holdTimer = undefined;
    this.tapTimer = undefined;
    this.holdFired = false;
  }

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
    const selectedAction = this.config[key];
    const actionEntity = typeof selectedAction?.entity === "string" ? selectedAction.entity : undefined;
    handleAction(this, actionEntity ? { ...this.config, entity: actionEntity } : this.config, action);
  }
}
