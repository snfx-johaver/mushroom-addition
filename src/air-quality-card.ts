import { css, html, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { MushroomAdditionCard } from "./card";
import { getCatalogItem } from "./catalog";
import { controlActions } from "./control-actions";
import { localizeText } from "./localize";
import { renderAutomaticPresentation, type RenderContext } from "./renderers";
import { relevantHassChanged } from "./energy-cards/helpers";
import { AIR_QUALITY_DEFAULTS, airQualityAnalysisValue, airQualityColor, airQualitySeverity, airQualityStatus, airQualityStub, airQualityValue, validateAirQuality } from "./air-quality";
import type { AdditionConfig, HomeAssistant } from "./types";

export class MushroomAirQualityCard extends MushroomAdditionCard {
  protected descriptor = getCatalogItem("mushroom-addition-air-quality");
  static styles = [MushroomAdditionCard.styles, css`
    :host { display:block; height:auto; min-width:0; }
    ha-card.mushroom-addition-card { position:relative; height:auto; overflow:hidden; padding:8px 10px 4px; }
    .aq-header { display:flex; align-items:center; min-height:28px; gap:8px; }
    .aq-header .action-surface { flex:1; min-height:0; min-width:0; padding:0; }
    .aq-header .automatic-presentation { margin:0; }
    .aq-header .card-heading { gap:10px; }
    .aq-header .layout-vertical .card-heading { flex-direction:column; gap:4px; }
    .aq-header .ulm-icon { width:32px; height:28px; background:none; color:var(--secondary-text-color); }
    .aq-header .ulm-icon ha-icon, .aq-header .ulm-icon ha-state-icon { --mdc-icon-size:20px; }
    .aq-header .ulm-name { font-size:var(--mush-card-primary-font-size,13px); }
    .aq-status { display:flex; flex:none; margin-left:auto; }
    .aq-status ha-icon { --mdc-icon-size:20px; color:var(--aq-color); }
    .aq-readings { display:grid; grid-template-columns:repeat(var(--aq-columns), minmax(0,1fr)); gap:2px; }
    .aq-reading { display:flex; flex-direction:column; align-items:center; justify-content:space-between;
      gap:14px; min-width:0; min-height:64px; padding:8px 0 2px; border:0; border-radius:8px;
      background:transparent; color:var(--primary-text-color); cursor:pointer; font:inherit; }
    .aq-reading ha-icon { --mdc-icon-size:23px; color:var(--aq-color); }
    .aq-reading b { max-width:100%; overflow-wrap:anywhere; font-size:var(--mush-card-secondary-font-size,13px);
      line-height:18px; font-weight:var(--mush-card-primary-font-weight,500); text-align:center; }
    .aq-reading:focus-visible { outline:2px solid var(--primary-color); outline-offset:-2px; }
    .aq-empty { padding:12px 0; color:var(--secondary-text-color); font-size:13px; }
    @media (max-width:380px) { .aq-reading { gap:10px; } .aq-reading b { font-size:11px; } }
    @container (max-width:260px) { .aq-readings { grid-template-columns:repeat(4,minmax(0,1fr)); } }
    :host { container-type:inline-size; }
    :host([fill-container]) { height:100%; }
    ha-card.mushroom-addition-card.fill-container { display:flex; flex-direction:column; height:100%; }
    .fill-container .aq-readings { flex:1; }
  `];
  public static getStubConfig(hass?: HomeAssistant): AdditionConfig { return airQualityStub(hass); }
  public setConfig(config: AdditionConfig): void {
    validateAirQuality(config);
    super.setConfig(config);
  }
  protected shouldUpdate(changed: Map<PropertyKey, unknown>): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }
  public getCardSize(): number { return 2; }
  protected willUpdate(): void {
    super.willUpdate();
    this.toggleAttribute("fill-container", this.config?.fill_container === true);
  }
  protected render() {
    if (!this.config || !this.hass || !this.descriptor) return nothing;
    const config = this.config, hass = this.hass;
    const status = airQualityStatus(hass, config);
    const rows = (config.air_quality_sensors ?? []).filter(row => row.enabled !== false);
    const context: RenderContext = {
      config: { ...config, secondary_info: config.secondary_info ?? "none",
        primary_info: config.air_quality_show_title === false ? "none" : config.primary_info,
        icon_type: config.air_quality_show_icon === false ? "none" : config.icon_type },
      descriptor: this.descriptor, hass, entity: config.entity ? hass.states[config.entity] : undefined,
      presentation: { rendered: false }, actionSurface: (_classes, content) => content,
      service: (domain, service, data) => void hass.callService(domain, service, data),
    };
    return html`<ha-card class="mushroom-addition-card${config.card_shadow ? " card-shadow" : ""}${config.fill_container ? " fill-container" : ""}">
      ${config.air_quality_show_header !== false || config.air_quality_show_badge !== false ? html`
        <div class="aq-header">
          ${config.air_quality_show_header !== false ? this.renderSharedSurface("aq-heading",
            renderAutomaticPresentation(context, { primary: typeof config.name === "string" ? config.name : "Air Quality" })) : nothing}
          ${config.air_quality_show_badge !== false ? html`<span class="aq-status" role="img"
            title=${localizeText(hass, status.name)} aria-label=${`${localizeText(hass, "Air Quality")}: ${localizeText(hass, status.name)}`}
            style=${styleMap({ "--aq-color": `var(--${status.color}-color, ${status.color})` })}>
            <ha-icon .icon=${status.icon}></ha-icon></span>` : nothing}
        </div>` : nothing}
      ${rows.length ? html`<div class="aq-readings" style=${`--aq-columns:${Math.min(8, rows.length)}`}>
        ${rows.map(row => {
          const defaults = AIR_QUALITY_DEFAULTS[row.kind];
          const value = airQualityValue(hass, row);
          const analysis = airQualityAnalysisValue(hass, row);
          const severity = analysis === undefined ? 4 : airQualitySeverity(row, analysis);
          const color = value === undefined ? "grey" : row.color || airQualityColor(row, analysis);
          const name = row.name || localizeText(hass, defaults.name);
          const state = row.kind === "mould" && analysis !== undefined
            ? localizeText(hass, ["Low", "Med", "High", "Sev"][severity])
            : value === undefined || row.kind === "mould" ? "—"
              : `${new Intl.NumberFormat(hass.language, { maximumFractionDigits: row.decimals ?? defaults.decimals }).format(value)}${row.unit ?? defaults.unit}`;
          return html`<button class="aq-reading" title=${`${name}: ${state}`}
            aria-label=${`${name}: ${value === undefined ? localizeText(hass, "Unavailable") : state}`}
            style=${styleMap({ "--aq-color": /^(#|rgb|hsl|var\()/.test(color) ? color : `var(--${color}-color, ${color})` })}
            ?disabled=${!row.entity}
            ${controlActions({ type: config.type, entity: row.entity, tap_action: { action: "more-info" } })}>
            <ha-icon .icon=${row.icon || defaults.icon}></ha-icon><b>${state}</b>
          </button>`;
        })}
      </div>` : html`<div class="aq-empty">${localizeText(hass, "Add sensors in the card editor.")}</div>`}
    </ha-card>`;
  }
}
