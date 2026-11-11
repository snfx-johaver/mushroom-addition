import { css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import type { AdditionConfig } from "../types";
import type { HomeAssistant } from "./types";
import { getCatalogItem } from "../catalog";
import { localizeText } from "../localize";
import { resolveColor } from "../colors";
import { energyLogStub, readEnergyLogEntries, validateEnergyLogConfig } from "./energy-log-config";
import type { EnergyLogConfig, EnergyLogEntry } from "./energy-log-config";
import { MonitorHistory, type HistorySnapshot } from "../energy-monitor/history";
import { liveEntityChanges, mergeLogEntries, recordedEntityChanges } from "./energy-log-changes";
import { energySetupNotice } from "./helpers";

export class MushroomEnergyLogCard extends MushroomAdditionCard {
  protected descriptor = getCatalogItem("mushroom-addition-energy-log");
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) protected config?: EnergyLogConfig;
  private readonly history = new MonitorHistory(() => this.requestUpdate());
  private historySnapshot?: HistorySnapshot;
  private recorded: EnergyLogEntry[] = [];
  private historyErrors: string[] = [];
  private live: EnergyLogEntry[] = [];
  private previousHass?: HomeAssistant;
  private previousConnection?: HomeAssistant["connection"] | HomeAssistant["callWS"];
  private refreshTimer?: ReturnType<typeof setInterval>;

  public connectedCallback(): void {
    super.connectedCallback();
    this.previousHass = this.hass;
    this.previousConnection = this.hass?.connection ?? this.hass?.callWS;
    this.refreshTimer = setInterval(() => this.requestUpdate(), 60_000);
    this.requestUpdate();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this.refreshTimer);
    this.resetHistory();
    this.previousHass = undefined;
    this.previousConnection = undefined;
  }

  private resetHistory(): void {
    this.history.clear();
    this.historySnapshot = undefined;
    this.recorded = [];
    this.historyErrors = [];
    this.live = [];
  }

  protected willUpdate(): void {
    super.willUpdate();
    if (!this.isConnected) return;
    if (!this.hass) {
      this.resetHistory();
      this.previousHass = undefined;
      this.previousConnection = undefined;
      return;
    }
    if (!this.config) return;
    const connection = this.hass.connection ?? this.hass.callWS;
    if (this.previousHass && this.previousConnection !== connection) {
      this.resetHistory();
    } else if (this.previousHass && this.previousHass !== this.hass) {
      const now = Date.now(), start = now - (this.config.historyHours ?? 24) * 3600000;
      this.live = mergeLogEntries({ ...this.config, limit: 500 }, [
        ...this.live, ...liveEntityChanges(this.config, this.previousHass.states, this.hass.states, start, now),
      ], start);
    }
    this.previousHass = this.hass;
    this.previousConnection = connection;
  }

  protected updated(): void {
    super.updated();
    if (!this.config || !this.hass || !this.isConnected) return;
    const ids = [...new Set(this.config.sources.filter(source => source.adapter === "changes").map(source => source.entity))];
    if (!ids.length) return;
    const now = Date.now(), start = Math.floor((now - (this.config.historyHours ?? 24) * 3600000) / 3600000) * 3600000;
    void this.history.load(this.hass, ids, start, now, JSON.stringify(this.config.sources));
  }

  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): EnergyLogConfig {
    return energyLogStub(hass, entities, fallback);
  }

  public setConfig(input: AdditionConfig): void {
    const defaults = energyLogStub(this.hass);
    const config = validateEnergyLogConfig({
      sources: defaults.sources, categories: defaults.categories, ...input,
    });
    if (JSON.stringify([this.config?.sources, this.config?.categories, this.config?.historyHours])
      !== JSON.stringify([config.sources, config.categories, config.historyHours])) {
      this.resetHistory();
      this.previousHass = this.hass;
      this.previousConnection = this.hass?.connection ?? this.hass?.callWS;
    }
    super.setConfig({
      ...structuredClone(config), name: config.name ?? config.title,
      secondary: config.secondary ?? config.subtitle,
    });
    this.toggleAttribute("fill-container", config.fill_container === true);
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
    return html`<article class="entry" style=${`--entry-color: ${resolveColor(entry.category.color, "var(--primary-color)")}`}>
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
          ? html`<details class="source"><summary>${localizeText(this.hass, "Source")}</summary><p>${entry.source}</p></details>`
          : nothing}
      </div>
    </article>`;
  }

  protected render() {
    const config = this.config;
    if (!config) return nothing;
    const result = readEnergyLogEntries(config, this.hass?.states ?? {});
    const hasChanges = config.sources.some(source => source.adapter === "changes");
    const now = Date.now(), start = now - (config.historyHours ?? 24) * 3600000;
    if (this.history.snapshot && this.history.snapshot !== this.historySnapshot) {
      this.historySnapshot = this.history.snapshot;
      const recorded = recordedEntityChanges(config, this.historySnapshot.response, this.historySnapshot.start, this.historySnapshot.end);
      this.recorded = recorded.entries;
      this.historyErrors = recorded.errors;
    }
    result.entries = mergeLogEntries(config, [
      ...result.entries, ...[...this.recorded, ...this.live].filter(entry => entry.timestamp >= start),
    ]);
    result.errors.push(...this.historyErrors, ...(this.history.error ? [this.history.error] : []));
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
          <strong>${localizeText(this.hass, "Invalid data source or field mapping")}</strong>
          <ul>${result.errors.map(error => html`<li>${error}</li>`)}</ul>
        </div>`
      : nothing;
    const emptyMessage = result.validSources === 0
      ? localizeText(this.hass, "Source missing")
      : result.entries.length > 0
        ? localizeText(this.hass, "No log entries.")
        : result.errors.length > 0
          ? localizeText(this.hass, "Invalid data source or field mapping")
          : config.emptyState ?? localizeText(this.hass, "No log entries.");
    const empty = visible.length === 0 ? html`<p class="empty" role="status">${emptyMessage}</p>` : nothing;
    return html`<ha-card class=${`mushroom-addition-card${config.card_shadow ? " card-shadow" : ""}`}>
      ${this.renderSharedHeading()}
      ${config.sources.length ? nothing : energySetupNotice(this.hass)}
      <nav class="filters" aria-label=${localizeText(this.hass, "Categories")}>
        <button type="button" aria-pressed=${selected === "all"} @click=${() => { this.dataset.filter = "all"; this.requestUpdate(); }}>
          ${config.allIcon ? html`<ha-icon .icon=${config.allIcon} aria-hidden="true"></ha-icon>` : nothing}
          ${localizeText(this.hass, "All")}
        </button>
        ${config.categories.map(category => html`<button type="button" aria-pressed=${selected === category.id}
          style=${`--entry-color: ${resolveColor(category.color, "var(--primary-color)")}`}
          @click=${() => { this.dataset.filter = category.id; this.requestUpdate(); }}>
          ${category.icon ? html`<ha-icon .icon=${category.icon} aria-hidden="true"></ha-icon>` : nothing}
          ${category.label}
        </button>`)}
      </nav>
      ${hasChanges ? html`<p class="history-status" role="status">${localizeText(this.hass, "Recorded history")}
        · ${config.historyHours ?? 24} h · Home Assistant Recorder
        ${this.history.loading ? html` · ${localizeText(this.hass, "Loading history")}` : nothing}</p>` : nothing}
      ${sourceErrors}
      ${empty}
      ${[...grouped].map(([date, entries]) => html`<section class="day">
        <h3 class="day-heading">${date} <span>· ${localizeText(this.hass, config.sortOrder === "oldest" ? "Oldest first" : "Newest first")} · ${timeZone}</span></h3>
        <div class="timeline">${entries.map(entry => this.renderEntry(entry, timeZone))}</div>
      </section>`)}
      ${config.footer ? html`<footer>${config.footer}</footer>` : nothing}
    </ha-card>`;
  }

  public static styles = [MushroomAdditionCard.styles, css`
    :host { display: block; min-width: 0; color: var(--primary-text-color); }
    ha-card { box-sizing: border-box; padding: 16px; }
    :host([fill-container]), :host([fill-container]) ha-card { height: 100%; }
    .energy-heading { margin-bottom: 12px; }
    .heading { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .main-icon { color: var(--primary-color); --mdc-icon-size: 24px; flex: none; }
    h2 { margin: 0; font-size: 16px; line-height: 1.3; }
    .subtitle { margin: 2px 0 0; color: var(--secondary-text-color); font-size: 12px; }
    .filters { display: flex; flex-wrap: wrap; gap: 5px; margin: 0 0 12px; }
    .filters button { display: inline-flex; align-items: center; gap: 4px; min-height: 36px; padding: 4px 9px;
      border: 1px solid var(--divider-color); border-radius: 999px; background: var(--secondary-background-color);
      color: var(--primary-text-color); font: inherit; font-size: 12px; cursor: pointer; }
    .filters button[aria-pressed="true"] { border-color: var(--entry-color, var(--primary-color)); background: color-mix(in srgb, var(--entry-color, var(--primary-color)) 14%, var(--card-background-color, var(--ha-card-background))); }
    .filters ha-icon { --mdc-icon-size: 14px; color: var(--entry-color, var(--primary-color)); }
    button:focus-visible, summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .day-heading { margin: 4px 0 12px; color: var(--secondary-text-color); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
    .day-heading span { font-weight: 500; text-transform: none; letter-spacing: 0; }
    .timeline { margin-inline-start: 7px; border-inline-start: 1px solid var(--divider-color); }
    .entry { position: relative; display: grid; grid-template-columns: minmax(74px, max-content) minmax(0, 1fr);
      gap: 10px; padding: 0 0 14px; padding-inline-start: 12px; }
    .entry::before { content: ""; position: absolute; inset-inline-start: -4px; top: 3px; width: 7px; height: 7px;
      border-radius: 50%; background: var(--entry-color); }
    .meta { display: flex; flex-wrap: wrap; align-content: start; gap: 5px; color: var(--secondary-text-color); font-size: 12px; }
    .badge { display: inline-flex; align-items: center; gap: 3px; border-radius: 4px; padding: 1px 5px;
      background: color-mix(in srgb, var(--entry-color) 12%, var(--card-background-color, var(--ha-card-background)));
      color: var(--entry-color); font-weight: 600; }
    .badge ha-icon { --mdc-icon-size: 12px; }
    .entry-content { min-width: 0; overflow-wrap: anywhere; }
    .entry h3 { margin: 0 0 3px; font-size: 14px; line-height: 1.35; }
    .detail { display: block; font-size: 12px; line-height: 1.4; }
    .entry p { margin: 5px 0 0; color: var(--secondary-text-color); font-size: 12px; line-height: 1.5; }
    .source { margin-top: 5px; color: var(--primary-color); font-size: 12px; }
    .source summary { cursor: pointer; width: fit-content; }
    .source summary::marker { color: currentColor; }
    .source p { color: var(--secondary-text-color); }
    .source-errors { border-inline-start: 3px solid var(--error-color); padding-inline-start: 10px; color: var(--error-color); font-size: 12px; }
    .source-errors ul { margin: 4px 0; padding-inline-start: 18px; }
    .empty { color: var(--secondary-text-color); font-size: 13px; }
    .history-status { color: var(--secondary-text-color); font-size: 12px; }
    footer { border-top: 1px solid var(--divider-color); margin-top: 6px; padding-top: 10px;
      color: var(--secondary-text-color); font-size: 12px; line-height: 1.55; white-space: pre-line; }
    @media (max-width: 430px) { .entry { grid-template-columns: 1fr; gap: 3px; } .meta { min-height: 20px; } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; } }
  `];
}
