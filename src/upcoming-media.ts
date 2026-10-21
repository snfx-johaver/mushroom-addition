import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { keyed } from "lit/directives/keyed.js";
import type { AdditionConfig, HassEntity, HomeAssistant } from "./types";
import { handleAction } from "./helpers";
import { resolveColor } from "./colors";
import { localize } from "./localize";

export const UPCOMING_MEDIA_DEFAULTS = {
  upcoming_data_attribute: "data",
  upcoming_max_items: 5,
  upcoming_image_style: "poster",
  upcoming_item_height: 128,
  upcoming_corner_radius: 12,
  upcoming_max_columns: 3,
  upcoming_overflow: false,
  upcoming_collapse_mode: "none",
  upcoming_collapse_count: 2,
  upcoming_group_attribute: "flag",
  upcoming_group_value: "true",
  upcoming_sort_by: "",
  upcoming_sort_ascending: true,
  upcoming_flag_filter: "all",
  upcoming_show_flag: true,
  upcoming_flag_icon: "mdi:eye-off-outline",
  upcoming_flag_label: "Unwatched",
  upcoming_date_format: "locale",
  upcoming_clock: "locale",
  upcoming_title_size: 14,
  upcoming_line_size: 12,
  upcoming_box_shadows: true,
  upcoming_text_shadows: true,
  upcoming_transparency: false,
  upcoming_tooltips: false,
  upcoming_tooltip_delay: 750,
  upcoming_trailers: true,
  upcoming_links: true,
  upcoming_item_behavior: "automatic",
  upcoming_hide_empty: false,
} satisfies Partial<AdditionConfig>;

export type UpcomingItem = Record<string, unknown>;
export interface UpcomingData {
  items: UpcomingItem[];
  defaults: Record<string, string>;
  error?: string;
}
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown): string =>
  Array.isArray(value) ? value.map(text).filter(Boolean).join(", ")
    : ["string", "number", "boolean"].includes(typeof value) ? String(value) : "";
export const upcomingFlagged = (item: UpcomingItem): boolean =>
  item.flag === true || item.flag === 1 || item.flag === "1" || (typeof item.flag === "string" && item.flag.toLowerCase() === "true");
export const upcomingSize = (value: number | undefined, fallback: number, min: number, max: number): number =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

export const readUpcomingData = (entity?: HassEntity, attribute = "data", hass?: HomeAssistant): UpcomingData => {
  // Older editors offered this display-only attribute as a media source.
  if (attribute === "friendly_name") attribute = "data";
  const empty = { items: [], defaults: {} };
  if (!entity) return { ...empty, error: localize(hass, "message.choose_media") };
  if (["unknown", "unavailable"].includes(entity.state)) return { ...empty, error: localize(hass, "message.media_unavailable") };
  let data: unknown = entity.attributes[attribute];
  if (data === undefined || data === null) return { ...empty, error: localize(hass, "message.missing_attribute", { attribute }) };
  if (typeof data === "string") {
    try {
      data = JSON.parse(data) as unknown;
    } catch {
      return { ...empty, error: localize(hass, "message.invalid_json", { attribute }) };
    }
  }
  if (!Array.isArray(data) || data.some(item => !record(item))) {
    return { ...empty, error: localize(hass, "message.media_list", { attribute }) };
  }
  const defaults: Record<string, string> = {};
  const items: UpcomingItem[] = [];
  for (const item of data as UpcomingItem[]) {
    const keys = Object.keys(item).filter(key => /^(title|line[1-4])_default$/.test(key));
    if (keys.length && !item.title && !item.airdate) {
      for (const key of keys) defaults[key] = text(item[key]);
    } else {
      items.push(item);
    }
  }
  return { items, defaults };
};

export const upcomingDataAttributes = (entity?: HassEntity): string[] =>
  entity ? Object.keys(entity.attributes).filter(attribute =>
    attribute !== "friendly_name" &&
    !readUpcomingData({ ...entity, state: "0" }, attribute).error) : [];

const matches = (item: UpcomingItem, attribute: string | undefined, value: string | undefined, exact = false): boolean =>
  !attribute || (exact
    ? text(item[attribute]).toLowerCase() === (value ?? "").toLowerCase()
    : text(item[attribute]).toLowerCase().includes((value ?? "").toLowerCase()));

export const upcomingItems = (data: UpcomingData, config: AdditionConfig): UpcomingItem[] => {
  let items = data.items.filter(item =>
    (config.upcoming_flag_filter !== "flagged" || upcomingFlagged(item)) &&
    (config.upcoming_flag_filter !== "unflagged" || !upcomingFlagged(item)) &&
    matches(item, config.upcoming_filter_attribute, config.upcoming_filter_value, config.upcoming_filter_match === "exact"));
  const key = config.upcoming_sort_by;
  if (key) {
    const value = (item: UpcomingItem): string | number | undefined => {
      const raw = text(item[key]);
      if (!raw) return undefined;
      if (["airdate", "aired"].includes(key)) {
        const date = Date.parse(raw);
        return Number.isFinite(date) ? date : undefined;
      }
      if (["rating", "runtime", "price", "views", "likes", "dislikes"].includes(key)) {
        const number = Number.parseFloat(raw.replace(/^[^\d+-]*/, ""));
        return Number.isFinite(number) ? number : undefined;
      }
      return raw;
    };
    items = [...items].sort((a, b) => {
      const left = value(a), right = value(b);
      if (left === undefined) return right === undefined ? 0 : 1;
      if (right === undefined) return -1;
      const order = typeof left === "number" && typeof right === "number"
        ? left - right : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: "base" });
      return config.upcoming_sort_ascending === false ? -order : order;
    });
  }
  if (!config.upcoming_overflow && config.upcoming_collapse_mode === "matching") {
    const grouped = (item: UpcomingItem) => matches(item, config.upcoming_group_attribute || "flag", config.upcoming_group_value ?? "true", true);
    items = [...items.filter(grouped), ...items.filter(item => !grouped(item))];
  }
  return items.slice(0, upcomingSize(config.upcoming_max_items, 5, 1, 50));
};

export const upcomingMediaUrl = (value: unknown, image = false): string | undefined => {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value, window.location.href);
    return (image ? ["http:", "https:"] : ["http:", "https:", "plex:", "kodi:", "emby:", "jellyfin:", "vlc:"]).includes(url.protocol)
      ? url.href : undefined;
  } catch {
    return undefined;
  }
};

export const upcomingText = (
  template: string, item: UpcomingItem, config: AdditionConfig, hass?: HomeAssistant,
): string => {
  const raw = text(item.airdate);
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const date = new Date(dateOnly ? `${raw}T12:00:00Z` : raw);
  const valid = Number.isFinite(date.getTime());
  const options = { timeZone: dateOnly ? "UTC" : hass?.config?.time_zone };
  const locale = hass?.language || "en";
  const parts = valid ? new Intl.DateTimeFormat(locale, { ...options, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date) : [];
  const part = (name: string) => parts.find(value => value.type === name)?.value || "";
  const formatDate = (value: string | undefined): string => {
    if (!valid) return "";
    if (!value || value === "locale") return date.toLocaleDateString(locale, { ...options, year: "numeric", month: "short", day: "numeric" });
    return value.replace(/yyyy|yy|mm|dd/gi, token =>
      token.toLowerCase() === "yyyy" ? part("year") : token.toLowerCase() === "yy" ? part("year").slice(-2)
        : token.toLowerCase() === "mm" ? part("month") : part("day"));
  };
  const runtime = text(item.runtime);
  const minutes = /^\d+$/.test(runtime) ? Number(runtime) : undefined;
  const values: Record<string, string> = {
    day: valid ? date.toLocaleDateString(locale, { ...options, weekday: "long" }) : "",
    date: formatDate(config.upcoming_date_format),
    year: part("year"),
    time: valid && !/^\d{4}-\d{2}-\d{2}$/.test(raw) ? date.toLocaleTimeString(locale, {
      ...options, hour: "numeric", minute: "2-digit",
      ...(config.upcoming_clock === "12" ? { hour12: true } : config.upcoming_clock === "24" ? { hour12: false } : {}),
    }) : "",
    runtime: minutes === undefined ? runtime : [minutes >= 60 ? `${Math.floor(minutes / 60)}h` : "", minutes % 60 ? `${minutes % 60}m` : ""].filter(Boolean).join(" "),
    empty: "",
  };
  const replace = (source: string): string => source.replace(/\$([a-z][a-z0-9_]*)/gi, (_, key: string) =>
    Object.hasOwn(values, key) ? values[key] : text(item[key]));
  values.release = replace(text(item.release) || (valid ? "$day, $date $time" : ""));
  return replace(template).replace(/\s+/g, " ").trim();
};

@customElement("mushroom-addition-upcoming-media")
export class MushroomUpcomingMedia extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @state() private expanded = false;
  @state() private width = 0;
  @state() private trailer?: string;
  @state() private tooltip?: { text: string; left: number; top: number };
  @state() private actionError?: string;
  private observer?: ResizeObserver;
  private tooltipTimer?: number;

  public static styles = css`
    :host { display: block; width: 100%; min-width: 0; color: var(--primary-text-color); }
    .items { display: grid; gap: 12px; min-width: 0; }
    .entry { position: relative; min-width: 0; }
    button { font: inherit; color: inherit; cursor: pointer; }
    .more, .close { box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12)); }
    .item { box-sizing: border-box; position: relative; display: flex; align-items: center; gap: 12px; width: 100%; min-width: 0; height: var(--item-height); padding: 12px; text-align: left; border: 0; border-radius: var(--radius); background: var(--ha-card-background, var(--card-background-color)); }
    .item.shadow { box-shadow: 0 2px 6px rgba(0,0,0,.12); }
    .item:focus-visible, .more:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .item:disabled { cursor: default; }
    .item:hover:not(:disabled)::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--primary-text-color); opacity: .04; pointer-events: none; }
    .art { position: relative; display: grid; flex: 0 0 auto; place-items: center; width: calc((var(--item-height) - 24px) * 2 / 3); height: 100%; border-radius: max(0px, calc(var(--radius) - 4px)); overflow: hidden; background: var(--addition-neutral-background); color: var(--secondary-text-color); }
    .art img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .art ha-icon { --mdc-icon-size: 28px; }
    .copy { position: relative; display: grid; gap: 4px; flex: 1; min-width: 0; max-height: 100%; overflow: hidden; }
    .title { font-size: var(--title-size); line-height: var(--mush-card-primary-line-height, 20px); font-weight: var(--mush-card-primary-font-weight, 500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--title-color, var(--mush-card-primary-color, inherit)); }
    .line { font-size: var(--line-size); line-height: var(--mush-card-secondary-line-height, 16px); font-weight: var(--mush-card-secondary-font-weight, 400); color: var(--mush-card-secondary-color, var(--secondary-text-color)); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .title, .more, .close { letter-spacing: var(--mush-card-primary-letter-spacing, .1px); }
    .line { letter-spacing: var(--mush-card-secondary-letter-spacing, .4px); }
    .flag { position: absolute; top: 8px; right: 8px; display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; color: var(--flag-color); background: var(--card-background-color, #fff); }
    .flag ha-icon { --mdc-icon-size: 16px; }
    .item:has(.flag) .title { padding-right: 26px; }
    .fanart .art { position: absolute; inset: 0; width: 100%; border-radius: inherit; }
    .fanart .art::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.4)); }
    .fanart.transparent .art::after { background: linear-gradient(90deg, rgba(0,0,0,.78), transparent); }
    .fanart .copy { padding: 4px; color: #fff; }
    .fanart .line { color: #eee; }
    .fanart.text-shadow .copy { text-shadow: 0 1px 3px #000; }
    .more { display: block; width: 100%; min-height: var(--mush-control-height, 42px); margin-top: 12px; padding: 8px 12px; border: 0; border-radius: var(--mush-control-border-radius, 12px); background: var(--addition-neutral-background); font-size: var(--mush-card-primary-font-size, 14px); line-height: var(--mush-card-primary-line-height, 20px); font-weight: var(--mush-card-primary-font-weight, 500); }
    .message { padding: 12px 0; font-size: 12px; color: var(--secondary-text-color); }
    [role="alert"] { color: var(--error-color, #db4437); }
    dialog { box-sizing: border-box; width: min(960px, calc(100vw - 24px)); max-height: calc(100dvh - 24px); padding: 12px; border: 1px solid var(--divider-color); border-radius: 16px; background: var(--card-background-color, #fff); color: var(--primary-text-color); }
    dialog::backdrop { background: rgba(0,0,0,.8); }
    dialog iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; }
    .close { display: block; min-height: var(--mush-control-height, 42px); margin: 0 0 8px auto; padding: 8px 12px; border: 0; border-radius: var(--mush-control-border-radius, 12px); background: var(--addition-neutral-background); font-size: var(--mush-card-primary-font-size, 14px); font-weight: var(--mush-card-primary-font-weight, 500); }
    .tooltip { box-sizing: border-box; position: fixed; inset: auto; margin: 0; width: min(320px, calc(100vw - 24px)); max-height: 180px; overflow: auto; padding: 12px; border: 1px solid var(--divider-color); border-radius: 12px; font-size: 12px; line-height: 1.5; white-space: pre-wrap; background: var(--card-background-color, #fff); color: var(--primary-text-color); pointer-events: none; box-shadow: 0 3px 12px rgba(0,0,0,.25); }
  `;

  public connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(entries => { this.width = entries[0]?.contentRect.width ?? 0; });
      this.observer.observe(this);
    }
    window.addEventListener("resize", this.resize);
  }
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
    window.removeEventListener("resize", this.resize);
    this.hideTooltip();
    this.shadowRoot?.querySelector("dialog")?.close();
  }
  private readonly resize = (): void => { this.requestUpdate(); };
  protected willUpdate(changes: PropertyValues): void {
    if (changes.has("config")) {
      this.expanded = false;
      this.trailer = undefined;
      this.actionError = undefined;
      this.hideTooltip();
    }
  }
  protected updated(): void {
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (dialog && !dialog.open) dialog.showModal();
    const tooltip = this.shadowRoot?.querySelector<HTMLElement>(".tooltip");
    if (tooltip && typeof tooltip.showPopover === "function" && !tooltip.matches(":popover-open")) tooltip.showPopover();
  }
  protected render() {
    if (!this.config) return nothing;
    const config = this.config;
    const data = readUpcomingData(config.entity ? this.hass?.states[config.entity] : undefined, config.upcoming_data_attribute, this.hass);
    const items = upcomingItems(data, config);
    const collapse = config.upcoming_overflow ? "none" : config.upcoming_collapse_mode;
    const limit = collapse === "count" ? upcomingSize(config.upcoming_collapse_count, 2, 1, 50)
      : collapse === "matching" ? items.filter(item => matches(item, config.upcoming_group_attribute || "flag", config.upcoming_group_value ?? "true", true)).length : items.length;
    const shown = this.expanded ? items : items.slice(0, limit);
    const height = upcomingSize(config.upcoming_item_height, 128, 80, 320);
    const columns = config.upcoming_overflow ? Math.max(1, Math.min(
      upcomingSize(config.upcoming_max_columns, 3, 1, 6), Math.floor(this.width / 230),
    )) : 1;
    const availableHeight = Math.min(window.innerHeight - 32, window.innerHeight - Math.max(0, this.getBoundingClientRect().top) - 24);
    const rows = Math.max(1, Math.min(shown.length, Math.max(Math.ceil(shown.length / columns), Math.floor(availableHeight / (height + 12)))));
    const actualColumns = config.upcoming_overflow ? Math.max(1, Math.ceil(shown.length / rows)) : 1;
    return html`<div @click=${this.stop} @dblclick=${this.stop} @pointerdown=${this.stop} @keydown=${this.stop}>
      ${data.error ? html`<div class="message" role="alert">${data.error}</div>` : !items.length ? html`<div class="message">${localize(this.hass, "message.empty_media")}</div>` : nothing}
      ${this.actionError ? html`<div class="message" role="alert">${this.actionError}</div>` : nothing}
      <div class="items" style=${styleMap({
        "--item-height": `${height}px`, "--radius": `${upcomingSize(config.upcoming_corner_radius, 12, 0, 32)}px`,
        "--title-size": config.upcoming_title_size !== undefined && config.upcoming_title_size !== 14
          ? `${upcomingSize(config.upcoming_title_size, 14, 12, 24)}px` : "var(--mush-card-primary-font-size, 14px)",
        "--line-size": config.upcoming_line_size !== undefined && config.upcoming_line_size !== 12
          ? `${upcomingSize(config.upcoming_line_size, 12, 10, 18)}px` : "var(--mush-card-secondary-font-size, 12px)",
        "--flag-color": resolveColor(config.upcoming_flag_color, "var(--primary-color)"),
        "--title-color": config.upcoming_title_color ? resolveColor(config.upcoming_title_color, "inherit") : undefined,
        "grid-template-columns": `repeat(${actualColumns}, minmax(0, 1fr))`,
        "grid-template-rows": config.upcoming_overflow ? `repeat(${rows}, auto)` : undefined,
        "grid-auto-flow": config.upcoming_overflow ? "column" : undefined,
      })}>
        ${shown.map(item => this.renderItem(item, data.defaults))}
      </div>
      ${limit < items.length ? html`<button class="more" @click=${() => { this.expanded = !this.expanded; }} aria-expanded=${this.expanded}>${localize(this.hass, this.expanded ? "ui.show_less" : "ui.show_more", { count: items.length - limit })}</button>` : nothing}
      ${this.trailer ? html`<dialog aria-label=${localize(this.hass, "ui.trailer")} @close=${() => { this.trailer = undefined; }} @cancel=${() => { this.trailer = undefined; }}>
        <button class="close" @click=${() => { this.trailer = undefined; }}>${localize(this.hass, "ui.close_trailer")}</button>
        <iframe title=${localize(this.hass, "ui.trailer")} src=${this.trailer} allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      </dialog>` : nothing}
      ${this.tooltip ? html`<div class="tooltip" popover="manual" role="tooltip" style=${styleMap({ left: `${this.tooltip.left}px`, top: `${this.tooltip.top}px` })}>${this.tooltip.text}</div>` : nothing}
    </div>`;
  }
  private renderItem(item: UpcomingItem, defaults: Record<string, string>) {
    const config = this.config!;
    const title = upcomingText(config.upcoming_title_text || defaults.title_default || "$title", item, config, this.hass);
    const fanart = config.upcoming_image_style === "fanart";
    const image = upcomingMediaUrl(fanart ? item.fanart || item.poster : item.poster || item.fanart, true);
    const summary = text(item.summary || item.overview);
    const lines = [1, 2, 3, 4].map(index => upcomingText(
      text(config[`upcoming_line${index}_text`] || defaults[`line${index}_default`] || (index === 1 ? "$episode" : index === 2 ? "$release" : index === 3 ? "$rating $runtime" : "")),
      item, config, this.hass,
    ));
    return html`<div class="entry">
      <button class="item ${fanart ? "fanart" : ""} ${config.upcoming_transparency ? "transparent" : ""} ${config.upcoming_box_shadows !== false ? "shadow" : ""} ${config.upcoming_text_shadows !== false ? "text-shadow" : ""}"
        aria-label=${title || text(item.title) || localize(this.hass, "ui.media_item")} aria-description=${summary}
        ?disabled=${config.upcoming_item_behavior === "none"}
        @click=${() => this.activate(item)}
        @pointerenter=${(event: PointerEvent) => this.showTooltip(event, summary)}
        @pointerleave=${this.hideTooltip} @focusin=${(event: FocusEvent) => this.showTooltip(event, summary)}
        @focusout=${this.hideTooltip}>
        <span class="art"><ha-icon .icon=${"mdi:movie-open-outline"}></ha-icon>${image ? keyed(image, html`<img src=${image} alt="" loading="lazy" @error=${(event: Event) => {
          const image = event.currentTarget as HTMLImageElement;
          image.hidden = true;
          image.parentElement?.setAttribute("title", localize(this.hass, "message.artwork_unavailable"));
        }} @load=${(event: Event) => {
          const image = event.currentTarget as HTMLImageElement;
          image.hidden = false;
          image.parentElement?.removeAttribute("title");
        }}>`) : nothing}</span>
        <span class="copy"><span class="title">${title}</span>
          ${lines.map((line, index) => line ? html`<span class="line" style=${styleMap({ color: typeof config[`upcoming_line${index + 1}_color`] === "string" ? resolveColor(String(config[`upcoming_line${index + 1}_color`]), "inherit") : undefined })}>${line}</span>` : nothing)}
        </span>
        ${config.upcoming_show_flag !== false && upcomingFlagged(item) ? html`<span class="flag" title=${config.upcoming_flag_label || localize(this.hass, "ui.unwatched")}><ha-icon .icon=${config.upcoming_flag_icon || "mdi:eye-off-outline"}></ha-icon></span>` : nothing}
      </button>
    </div>`;
  }
  private activate(item: UpcomingItem): void {
    if (!this.config) return;
    const config = this.config;
    this.actionError = undefined;
    if (config.upcoming_item_behavior === "none") return;
    if (config.upcoming_item_behavior === "action" && config.upcoming_item_action) {
      handleAction(this, { ...config, entity: config.upcoming_item_action.entity || config.entity, tap_action: config.upcoming_item_action }, "tap");
      return;
    }
    if (!config.upcoming_item_behavior || config.upcoming_item_behavior === "automatic") {
      const custom = config.upcoming_url?.replace(/\$([a-z][a-z0-9_]*)/gi, (_, key: string) => encodeURIComponent(text(item[key])));
      if (custom && !upcomingMediaUrl(custom)) {
        this.actionError = localize(this.hass, "message.invalid_media_url");
        return;
      }
      const trailer = config.upcoming_trailers !== false ? upcomingMediaUrl(item.trailer) : undefined;
      const link = upcomingMediaUrl(custom) || trailer || (config.upcoming_links !== false ? upcomingMediaUrl(item.deep_link) : undefined);
      if (link) {
        const url = new URL(link);
        const video = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(url.hostname)
          ? url.searchParams.get("v") || url.pathname.split("/").at(-1) : url.hostname === "youtu.be" ? url.pathname.slice(1) : undefined;
        if (!custom && trailer === link && video && /^[\w-]{11}$/.test(video)) {
          this.trailer = `https://www.youtube-nocookie.com/embed/${video}?autoplay=1`;
          return;
        }
        handleAction(this, { ...config, tap_action: { action: "url", url_path: link } }, "tap");
        return;
      }
    }
    handleAction(this, { ...config, tap_action: { action: "more-info" } }, "tap");
  }
  private readonly stop = (event: Event): void => { event.stopPropagation(); };
  private showTooltip(event: Event, summary: string): void {
    this.hideTooltip();
    if (!this.config?.upcoming_tooltips || !summary) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tooltipTimer = window.setTimeout(() => {
      this.tooltip = { text: summary, left: Math.max(12, Math.min(rect.left, window.innerWidth - 332)), top: Math.max(12, Math.min(rect.bottom + 6, window.innerHeight - 192)) };
    }, upcomingSize(this.config.upcoming_tooltip_delay, 750, 0, 3000));
  }
  private readonly hideTooltip = (): void => {
    if (this.tooltipTimer !== undefined) window.clearTimeout(this.tooltipTimer);
    this.tooltipTimer = undefined;
    this.tooltip = undefined;
  };
}
