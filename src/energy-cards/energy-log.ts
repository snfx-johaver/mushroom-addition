import { css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import type { AdditionConfig } from "../types";
import type { HomeAssistant } from "./types";
import { ENERGY_LOG_EDITOR_TAG, energyLogStub, readEnergyLogEntries, validateEnergyLogConfig } from "./energy-log-config";
import type { EnergyLogConfig, EnergyLogEntry } from "./energy-log-config";

export class MushroomEnergyLogCard extends MushroomAdditionCard {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) protected config?: EnergyLogConfig;

  public static getStubConfig(): EnergyLogConfig {
    return energyLogStub();
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(ENERGY_LOG_EDITOR_TAG);
  }

  public setConfig(input: AdditionConfig): void {
    const config = validateEnergyLogConfig(input);
    this.config = structuredClone(config);
  }

  public getCardSize(): number {
    return Math.max(3, Math.min(this.config?.limit ?? 5, 10));
  }

  public getGridOptions(): { columns: number; rows: "auto"; min_columns: number; min_rows: number } {
    return { columns: 12, rows: "auto", min_columns: 3, min_rows: 3 };
  }

  private formatDate(timestamp: number, timeZone: string): string {
    return new Intl.DateTimeFormat(this.hass?.language, {
      year: "numeric", month: "long", day: "numeric", timeZone,
    }).format(timestamp);
  }

  private formatTime(timestamp: number, timeZone: string): string {
    return new Intl.DateTimeFormat(this.hass?.language, {
      hour: "2-digit", minute: "2-digit", hour12: this.config?.clockFormat === "12", timeZone,
    }).format(timestamp);
  }

  private renderEntry(entry: EnergyLogEntry, timeZone: string) {
    return html`<article class="entry" style=${`--entry-color: ${entry.category.color ?? "var(--primary-color)"}`}>
      <div class="meta">
        <time datetime=${new Date(entry.timestamp).toISOString()}>${this.formatTime(entry.timestamp, timeZone)}</time>
        <span class="badge">
          ${entry.category.icon ? html`<ha-icon .icon=${entry.category.icon} aria-hidden="true"></ha-icon>` : nothing}
          ${entry.category.label}
        </span>
      </div>
      <div class="entry-content">
        ${entry.title ? html`<h3>${entry.title}</h3>` : nothing}
        ${entry.detail ? html`<strong class="detail">${entry.detail}</strong>` : nothing}
        ${entry.description ? html`<p>${entry.description}</p>` : nothing}
        ${this.config?.showSource !== false && entry.source
          ? html`<details class="source"><summary>Source</summary><p>${entry.source}</p></details>`
          : nothing}
      </div>
    </article>`;
  }

  protected render() {
    const config = this.config;
    if (!config) return nothing;
    const result = readEnergyLogEntries(config, this.hass?.states ?? {});
    const filter = this.dataset.filter ?? "all";
    const selected = filter === "all" || config.categories.some(category => category.id === filter) ? filter : "all";
    const visible = selected === "all" ? result.entries
      : result.entries.filter(entry => entry.category.id === selected);
    const timeZone = config.timeZone || this.hass?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const grouped = new Map<string, EnergyLogEntry[]>();
    for (const entry of visible) {
      const date = this.formatDate(entry.timestamp, timeZone);
      grouped.set(date, [...(grouped.get(date) ?? []), entry]);
    }
    const sourceErrors = result.errors.length
      ? html`<div class="source-errors" role="alert">
          <strong>${result.validSources === 0 ? "Energy Log source error" : "Some Energy Log sources could not be read"}</strong>
          <ul>${result.errors.map(error => html`<li>${error}</li>`)}</ul>
        </div>`
      : nothing;
    const emptyMessage = result.validSources === 0
      ? "No valid Energy Log source is available."
      : result.entries.length > 0
        ? "No entries in this category."
        : result.errors.length > 0
          ? "No valid log entries could be read."
          : config.emptyState ?? "No log entries.";
    const empty = visible.length === 0 ? html`<p class="empty" role="status">${emptyMessage}</p>` : nothing;
    return html`<ha-card>
      <header class="heading">
        ${config.icon ? html`<ha-icon class="main-icon" .icon=${config.icon} aria-hidden="true"></ha-icon>` : nothing}
        <div><h2>${config.title ?? "Energy Log"}</h2>
          ${config.subtitle ? html`<p class="subtitle">${config.subtitle}</p>` : nothing}
        </div>
      </header>
      <nav class="filters" aria-label="Filter energy log entries">
        <button type="button" aria-pressed=${selected === "all"} @click=${() => { this.dataset.filter = "all"; this.requestUpdate(); }}>All</button>
        ${config.categories.map(category => html`<button type="button" aria-pressed=${selected === category.id}
          style=${`--entry-color: ${category.color ?? "var(--primary-color)"}`}
          @click=${() => { this.dataset.filter = category.id; this.requestUpdate(); }}>
          ${category.icon ? html`<ha-icon .icon=${category.icon} aria-hidden="true"></ha-icon>` : nothing}
          ${category.label}
        </button>`)}
      </nav>
      ${sourceErrors}
      ${empty}
      ${[...grouped].map(([date, entries]) => html`<section class="day">
        <h3 class="day-heading">${date} <span>· ${config.sortOrder === "oldest" ? "Oldest first" : "Newest first"} · ${timeZone}</span></h3>
        <div class="timeline">${entries.map(entry => this.renderEntry(entry, timeZone))}</div>
      </section>`)}
      ${config.footer ? html`<footer>${config.footer}</footer>` : nothing}
    </ha-card>`;
  }

  public static styles = css`
    :host { display: block; min-width: 0; color: var(--primary-text-color); }
    ha-card { box-sizing: border-box; padding: 16px; }
    .heading { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .main-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    h2 { margin: 0; font-size: 16px; line-height: 1.3; }
    .subtitle { margin: 2px 0 0; color: var(--secondary-text-color); font-size: 12px; }
    .filters { display: flex; flex-wrap: wrap; gap: 5px; margin: 0 0 12px; }
    .filters button { display: inline-flex; align-items: center; gap: 4px; min-height: 30px; padding: 4px 9px;
      border: 1px solid var(--divider-color); border-radius: 999px; background: var(--secondary-background-color);
      color: var(--primary-text-color); font: inherit; font-size: 11px; cursor: pointer; }
    .filters button[aria-pressed="true"] { border-color: var(--entry-color, var(--primary-color)); background: color-mix(in srgb, var(--entry-color, var(--primary-color)) 14%, var(--card-background-color, var(--ha-card-background))); }
    .filters ha-icon { --mdc-icon-size: 14px; color: var(--entry-color, var(--primary-color)); }
    button:focus-visible, summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .day-heading { margin: 4px 0 12px; color: var(--secondary-text-color); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
    .day-heading span { font-weight: 500; text-transform: none; letter-spacing: 0; }
    .timeline { margin-inline-start: 7px; border-inline-start: 1px solid var(--divider-color); }
    .entry { position: relative; display: grid; grid-template-columns: minmax(74px, max-content) minmax(0, 1fr);
      gap: 10px; padding: 0 0 14px; padding-inline-start: 12px; }
    .entry::before { content: ""; position: absolute; inset-inline-start: -4px; top: 3px; width: 7px; height: 7px;
      border-radius: 50%; background: var(--entry-color); }
    .meta { display: flex; flex-wrap: wrap; align-content: start; gap: 5px; color: var(--secondary-text-color); font-size: 11px; }
    .badge { display: inline-flex; align-items: center; gap: 3px; border-radius: 4px; padding: 1px 5px;
      background: color-mix(in srgb, var(--entry-color) 12%, var(--card-background-color, var(--ha-card-background)));
      color: var(--entry-color); font-weight: 600; }
    .badge ha-icon { --mdc-icon-size: 12px; }
    .entry-content { min-width: 0; overflow-wrap: anywhere; }
    .entry h3 { margin: 0 0 3px; font-size: 12px; line-height: 1.35; }
    .detail { display: block; font-size: 11px; line-height: 1.4; }
    .entry p { margin: 5px 0 0; color: var(--secondary-text-color); font-size: 11px; line-height: 1.5; }
    .source { margin-top: 5px; color: var(--teal-color, #008577); font-size: 11px; }
    .source summary { cursor: pointer; width: fit-content; }
    .source summary::marker { color: currentColor; }
    .source p { color: var(--secondary-text-color); }
    .source-errors { border-inline-start: 3px solid var(--error-color); padding-inline-start: 10px; color: var(--error-color); font-size: 12px; }
    .source-errors ul { margin: 4px 0; padding-inline-start: 18px; }
    .empty { color: var(--secondary-text-color); font-size: 13px; }
    footer { border-top: 1px solid var(--divider-color); margin-top: 6px; padding-top: 10px;
      color: var(--secondary-text-color); font-size: 11px; line-height: 1.55; white-space: pre-line; }
    @media (max-width: 430px) { .entry { grid-template-columns: 1fr; gap: 3px; } .meta { min-height: 20px; } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; } }
  `;
}
