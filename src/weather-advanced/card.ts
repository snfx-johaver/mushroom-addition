import { css, html, nothing } from "lit";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { normalizeConfig } from "../helpers";
import { relevantHassChanged } from "../energy-cards/helpers";
import type { AdditionConfig, HomeAssistant } from "../types";
import type { ConfigInput } from "./types";
import { validateWeatherOptions, weatherDefaults, weatherStub } from "./config";
import "./components/card";

export class MushroomWeatherAdvancedCard extends MushroomAdditionCard {
  protected descriptor = getCatalogItem("mushroom-addition-weather-advanced");
  private input?: ConfigInput;
  static styles = [MushroomAdditionCard.styles, css`
    :host { display: block; min-width: 0; }
    ha-card { overflow: hidden; }
    .energy-heading { padding: 12px; }
    .weather-content { padding: 0; width: 100%; min-width: 0; }
  `];
  public static getStubConfig(hass?: HomeAssistant): AdditionConfig { return weatherStub(hass); }
  public setConfig(config: AdditionConfig): void {
    if (!config || typeof config !== "object") throw new Error("A Weather Advanced configuration is required.");
    validateWeatherOptions(config.weather);
    const normalized = normalizeConfig(config);
    this.input = { ...weatherDefaults, ...normalized.weather, entity: normalized.entity ?? "weather.home" };
    super.setConfig(normalized);
  }
  protected shouldUpdate(changed: Map<PropertyKey, unknown>): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }
  public getCardSize(): number {
    return Math.ceil((this.input?.height ?? (this.input?.layout === "minimal" ? 80 : 220)) / 50) +
      (this.input?.show_hourly_forecast ? 3 : 0) + (this.input?.show_daily_forecast ? 3 : 0);
  }
  protected render() {
    if (!this.config) return nothing;
    return html`<ha-card class="mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}">
      ${this.renderSharedHeading()}
      ${this.renderSharedSurface("weather-content", html`
        <mushroom-addition-weather-scene .hass=${this.hass} .input=${this.input}></mushroom-addition-weather-scene>
      `)}
    </ha-card>`;
  }
}
