import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { AdditionConfig, HassEntity, HomeAssistant, RemoteButtonConfig, RemoteSection } from "./types";
import { handleAction } from "./helpers";
import { resolveColor } from "./colors";
import { upcomingSize } from "./upcoming-media";
import { SONOS_MEDIA_FEATURES as MEDIA } from "./sonos-controls";
import { localize, localizeText } from "./localize";

export const REMOTE_SECTIONS: Record<RemoteSection, string> = {
  power: "Power and utility buttons", navigation: "Navigation", source: "Source selector",
  volume: "Volume", channels: "Channel buttons", playback: "Playback", keypad: "Number pad", shortcuts: "Custom buttons",
};
export const REMOTE_DEFAULTS = {
  remote_transport: "auto", remote_preset: "auto",
  remote_sections: ["power", "navigation", "source", "volume", "playback", "shortcuts"] as RemoteSection[],
  remote_navigation: "touchpad", remote_volume: "both", remote_volume_step: 5,
  remote_playback_controls: ["previous", "play_pause", "stop", "next"],
  remote_power_controls: ["power", "home", "back", "menu"],
  remote_haptics: "all", remote_double_tap: "back", remote_swipe_distance: 32,
  remote_touchpad_height: 144, remote_button_size: 44, remote_accent_color: "blue",
} satisfies Partial<AdditionConfig>;

const keys = {
  up: ["Up", "mdi:chevron-up", "KEY_UP", "DPAD_UP"],
  down: ["Down", "mdi:chevron-down", "KEY_DOWN", "DPAD_DOWN"],
  left: ["Left", "mdi:chevron-left", "KEY_LEFT", "DPAD_LEFT"],
  right: ["Right", "mdi:chevron-right", "KEY_RIGHT", "DPAD_RIGHT"],
  select: ["Select", "mdi:circle-outline", "KEY_ENTER", "DPAD_CENTER"],
  back: ["Back", "mdi:arrow-u-left-top", "KEY_RETURN", "BACK"],
  home: ["Home", "mdi:home-outline", "KEY_HOME", "HOME"],
  menu: ["Menu", "mdi:menu", "KEY_MENU", "MENU"],
  power: ["Power", "mdi:power", "KEY_POWER", "POWER"],
  info: ["Information", "mdi:information-outline", "KEY_INFO", "INFO"],
  channel_up: ["Channel up", "mdi:chevron-up", "KEY_CHUP", "CHANNEL_UP"],
  channel_down: ["Channel down", "mdi:chevron-down", "KEY_CHDOWN", "CHANNEL_DOWN"],
  volume_up: ["Volume up", "mdi:volume-plus", "KEY_VOLUP", "VOLUME_UP"],
  volume_down: ["Volume down", "mdi:volume-minus", "KEY_VOLDOWN", "VOLUME_DOWN"],
  mute: ["Mute", "mdi:volume-mute", "KEY_MUTE", "VOLUME_MUTE"],
  play_pause: ["Play / pause", "mdi:play-pause", "KEY_PLAYPAUSE", "MEDIA_PLAY_PAUSE"],
  stop: ["Stop", "mdi:stop", "KEY_STOP", "MEDIA_STOP"],
  previous: ["Previous", "mdi:skip-previous", "KEY_REWIND", "MEDIA_PREVIOUS"],
  next: ["Next", "mdi:skip-next", "KEY_FF", "MEDIA_NEXT"],
  rewind: ["Rewind", "mdi:rewind", "KEY_REWIND", "MEDIA_REWIND"],
  forward: ["Fast forward", "mdi:fast-forward", "KEY_FF", "MEDIA_FAST_FORWARD"],
} as const;
export const REMOTE_KEYS = Object.entries(keys).map(([value, definition]) => ({ value, label: definition[0] }));
type RemoteKey = keyof typeof keys;
const healthy = (entity?: HassEntity): boolean => !!entity && !["unknown", "unavailable"].includes(entity.state);

export const resolveRemoteEntities = (hass: HomeAssistant | undefined, config: AdditionConfig) => {
  const primary = config.entity;
  const device = primary ? hass?.entities?.[primary]?.device_id : undefined;
  const sibling = (domain: string): string | undefined => device
    ? Object.keys(hass?.states ?? {}).find(id => id.startsWith(`${domain}.`) && hass?.entities?.[id]?.device_id === device && healthy(hass?.states[id]))
    : undefined;
  const remoteId = config.remote_entity || (primary?.startsWith("remote.") ? primary : sibling("remote"));
  const mediaId = config.remote_media_entity || (primary?.startsWith("media_player.") ? primary : sibling("media_player"));
  return { remote: remoteId ? hass?.states[remoteId] : undefined, media: mediaId ? hass?.states[mediaId] : undefined };
};

export const remotePreset = (hass: HomeAssistant | undefined, config: AdditionConfig): string => {
  if (config.remote_preset && config.remote_preset !== "auto") return config.remote_preset;
  const { remote, media } = resolveRemoteEntities(hass, config);
  const platform = `${remote ? hass?.entities?.[remote.entity_id]?.platform : ""} ${media ? hass?.entities?.[media.entity_id]?.platform : ""}`;
  return /samsung/.test(platform) ? "samsung" : /android|google_tv/.test(platform) ? "android_tv"
    : /apple_tv/.test(platform) ? "apple_tv" : /roku/.test(platform) ? "roku" : "generic";
};
export const remoteCommand = (hass: HomeAssistant | undefined, config: AdditionConfig, key: string): string => {
  if (Object.hasOwn(config.remote_commands ?? {}, key)) return config.remote_commands![key];
  const preset = remotePreset(hass, config);
  if (/^\d$/.test(key)) return preset === "samsung" ? `KEY_${key}` : preset === "android_tv" ? `KEYCODE_${key}` : preset === "roku" ? "" : key;
  if (preset === "apple_tv") return key === "back" ? "menu" : key === "home" ? "top_menu"
    : key === "power" ? resolveRemoteEntities(hass, config).remote?.state === "off" ? "wakeup" : "suspend" : key;
  if (preset === "roku") return key === "play_pause" ? "play" : key === "mute" ? "volume_mute"
    : key === "rewind" ? "reverse" : ["previous", "next", "stop", "menu"].includes(key) || /^\d$/.test(key) ? "" : key;
  const entry = keys[key as RemoteKey];
  return entry ? preset === "samsung" ? entry[2] : preset === "android_tv" ? entry[3] : key : key;
};

@customElement("mushroom-addition-remote")
export class MushroomRemote extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: AdditionConfig;
  @state() private error?: string;
  private pointer?: { id: number; x: number; y: number; moved: boolean; sent: number };
  private tapTimer?: number;
  private firstTap?: number;

  public static styles = css`
    :host { display: block; width: 100%; min-width: 0; color: var(--primary-text-color); }
    .remote { display: grid; gap: 16px; }
    .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; min-width: 0; }
    button { font: inherit; color: inherit; cursor: pointer; }
    .key { display: grid; place-items: center; box-sizing: border-box; width: var(--button-size); height: var(--button-size); padding: 0; border: 0; border-radius: 50%; background: var(--addition-raised-background, var(--secondary-background-color)); box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12)); color: var(--accent); flex: 0 0 auto; }
    .key ha-icon { --mdc-icon-size: 24px; pointer-events: none; }
    button:disabled { color: var(--disabled-text-color); cursor: default; opacity: .65; }
    button:focus-visible, .pad:focus-visible, select:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
    .key:active:not(:disabled) { background: color-mix(in srgb, var(--accent) 16%, var(--addition-raised-background, var(--secondary-background-color))); box-shadow: none; }
    .dpad { display: grid; grid-template-columns: repeat(3, var(--button-size)); gap: 8px; justify-content: center; }
    .dpad .up { grid-area: 1 / 2; } .dpad .left { grid-area: 2 / 1; } .dpad .select { grid-area: 2 / 2; }
    .dpad .right { grid-area: 2 / 3; } .dpad .down { grid-area: 3 / 2; }
    .pad { display: grid; place-items: center; box-sizing: border-box; height: var(--pad-height); border: 1px solid var(--divider-color); border-radius: 20px; background: color-mix(in srgb, var(--accent) 6%, var(--card-background-color, var(--ha-card-background))); color: var(--secondary-text-color); touch-action: none; user-select: none; cursor: crosshair; }
    .pad[aria-disabled="true"] { opacity: .5; cursor: default; }
    .pad-content { display: grid; place-items: center; gap: 7px; font-size: 12px; pointer-events: none; }
    .pad-content ha-icon { --mdc-icon-size: 32px; color: var(--accent); }
    .volume input { flex: 1; min-width: 40px; width: 60px; accent-color: var(--accent); }
    .volume output { min-width: 35px; font-size: 12px; text-align: right; }
    select { width: 100%; padding: 10px; border: 1px solid var(--divider-color); border-radius: 12px; color: var(--primary-text-color); background: var(--card-background-color, var(--ha-card-background)); font: inherit; font-size: 14px; }
    .keypad { display: grid; grid-template-columns: repeat(3, var(--button-size)); gap: 10px; justify-content: center; }
    .keypad .zero { grid-column: 2; }
    .shortcut { display: flex; align-items: center; gap: 7px; max-width: 100%; min-height: 40px; padding: 8px 12px; border: 0; border-radius: 14px; color: var(--accent); background: var(--addition-raised-background, var(--secondary-background-color)); box-shadow: var(--addition-raised-shadow); }
    .shortcut ha-icon { --mdc-icon-size: 22px; flex-shrink: 0; }
    .shortcut span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    .message { font-size: 12px; line-height: 1.5; color: var(--secondary-text-color); }
    [role="alert"] { color: var(--error-color, #db4437); }
  `;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cancelTap();
    this.pointer = undefined;
  }
  protected willUpdate(changes: PropertyValues): void {
    if (changes.has("config")) { this.cancelTap(); this.pointer = undefined; this.error = undefined; }
  }
  private get entities() { return resolveRemoteEntities(this.hass, this.config!); }
  private supports(feature: number): boolean {
    return healthy(this.entities.media) && (Number(this.entities.media?.attributes.supported_features) & feature) !== 0;
  }
  private get transport(): string {
    return this.config?.remote_transport && this.config.remote_transport !== "auto" ? this.config.remote_transport
      : this.entities.remote ? "remote" : remotePreset(this.hass, this.config!) === "samsung" ? "samsung" : "unconfigured";
  }
  private get canSend(): boolean {
    return this.transport === "remote" ? healthy(this.entities.remote)
      : this.transport === "samsung" && healthy(this.entities.media);
  }
  protected render() {
    if (!this.config) return nothing;
    const config = this.config;
    const sections = config.remote_sections ?? REMOTE_DEFAULTS.remote_sections;
    return html`<div class="remote" style=${styleMap({
      "--accent": resolveColor(config.remote_accent_color, "var(--primary-color)"),
      "--button-size": `${upcomingSize(config.remote_button_size, 44, 32, 64)}px`,
      "--pad-height": `${upcomingSize(config.remote_touchpad_height, 144, 80, 280)}px`,
    })} @pointerdown=${this.stop} @click=${this.stop} @dblclick=${this.stop} @keydown=${this.stop}>
      ${!this.canSend && sections.some(section => ["navigation", "channels", "keypad"].includes(section)) ? html`<div class="message">${localize(this.hass, "message.remote_navigation")}</div>` : nothing}
      ${this.error ? html`<div role="alert" class="message">${this.error}</div>` : nothing}
      ${sections.map(section => this.renderSection(section))}
    </div>`;
  }
  private renderSection(section: RemoteSection) {
    const config = this.config!;
    if (section === "power") return html`<div class="row">${(config.remote_power_controls ?? REMOTE_DEFAULTS.remote_power_controls).map(key => this.button(key))}</div>`;
    if (section === "channels") return html`<div class="row">${["channel_down", "info", "channel_up"].map(key => this.button(key))}</div>`;
    if (section === "playback") return html`<div class="row">${(config.remote_playback_controls ?? REMOTE_DEFAULTS.remote_playback_controls).map(key => this.button(key))}</div>`;
    if (section === "keypad") return html`<div class="keypad">${[1,2,3,4,5,6,7,8,9,0].map(key => this.button(String(key)))}</div>`;
    if (section === "shortcuts") return html`<div class="row">${(config.remote_buttons ?? []).map(button => html`
      <button class="shortcut" style=${styleMap({ "--accent": button.color ? resolveColor(button.color, "inherit") : undefined })}
        aria-label=${button.name || button.source || button.command || localize(this.hass, "ui.custom_button")}
        ?disabled=${button.type === "action" ? !button.action : button.type === "source" ? !this.supports(2048) : !this.canSend}
        @click=${() => this.shortcut(button)}>
        <ha-icon .icon=${button.icon || "mdi:remote"}></ha-icon><span>${button.name || button.source || button.command || localize(this.hass, "ui.custom_button")}</span>
      </button>
    `)}</div>`;
    if (section === "source") {
      const media = this.entities.media;
      const sources = Array.isArray(media?.attributes.source_list) ? media.attributes.source_list.filter((source): source is string => typeof source === "string") : [];
      return html`<select aria-label=${localize(this.hass, "ui.source")} ?disabled=${!this.supports(2048) || !sources.length} .value=${String(media?.attributes.source || "")}
        @change=${(event: Event) => void this.call("media_player", "select_source", { entity_id: media?.entity_id, source: (event.target as HTMLSelectElement).value })}>
        <option value="" disabled>${localize(this.hass, sources.length ? "ui.choose_source" : "ui.no_sources")}</option>
        ${sources.map(source => html`<option value=${source}>${source}</option>`)}
      </select>`;
    }
    if (section === "volume") {
      const mode = config.remote_volume || "both", volume = this.entities.media?.attributes.volume_level;
      const valid = typeof volume === "number" && Number.isFinite(volume);
      return html`<div class="row volume">
        ${mode !== "slider" ? this.button("volume_down") : nothing}
        ${this.button("mute")}
        ${mode !== "buttons" ? html`<input type="range" aria-label=${localizeText(this.hass, "TV volume")} min="0" max="100" step=${upcomingSize(config.remote_volume_step, 5, 1, 20)}
          .value=${String(valid ? Math.round(volume * 100) : 0)} ?disabled=${!this.supports(MEDIA.volumeSet) || !valid}
          @change=${(event: Event) => {
            this.feedback("slider");
            void this.call("media_player", "volume_set", { entity_id: this.entities.media?.entity_id, volume_level: Number((event.target as HTMLInputElement).value) / 100 });
          }}><output>${valid ? `${Math.round(volume * 100)}%` : "--"}</output>` : nothing}
        ${mode !== "slider" ? this.button("volume_up") : nothing}
      </div>`;
    }
    if (section === "navigation") {
      const mode = config.remote_navigation || "touchpad";
      return html`${mode !== "buttons" ? html`<div class="pad" tabindex="0" role="group" aria-label=${localize(this.hass, "message.touchpad")}
        aria-disabled=${!this.canSend} @pointerdown=${this.pointerDown} @pointermove=${this.pointerMove}
        @pointerup=${this.pointerUp} @pointercancel=${this.pointerCancel} @lostpointercapture=${this.pointerCancel} @keydown=${this.padKeydown}>
        <span class="pad-content"><ha-icon .icon=${"mdi:gesture-swipe"}></ha-icon><span>${localize(this.hass, "message.swipe")}</span>
          ${config.remote_double_tap !== "disabled" ? html`<span>${localize(this.hass, "message.double_tap", {
            action: this.hass?.language && this.hass.language !== "en"
              ? localizeText(this.hass, keys[(config.remote_double_tap || "back") as RemoteKey]?.[0] || config.remote_double_tap || "back")
              : config.remote_double_tap || "back",
          })}</span>` : nothing}
        </span>
      </div>` : nothing}
      ${mode !== "touchpad" ? html`<div class="dpad">${["up", "left", "select", "right", "down"].map(key => this.button(key))}</div>` : nothing}`;
    }
    return nothing;
  }
  private nativeService(key: string): string | undefined {
    if (Object.hasOwn(this.config?.remote_commands ?? {}, key)) return undefined;
    const media = this.entities.media;
    if (!media) return undefined;
    if (key === "power") return media.state === "off"
      ? this.supports(MEDIA.turnOn) ? "turn_on" : undefined
      : this.supports(MEDIA.turnOff) ? "turn_off" : undefined;
    if (key === "play_pause") return media.state === "playing"
      ? this.supports(MEDIA.pause) ? "media_pause" : undefined
      : this.supports(MEDIA.play) ? "media_play" : undefined;
    if (key === "stop" && this.supports(MEDIA.stop)) return "media_stop";
    if (key === "previous" && this.supports(MEDIA.previous)) return "media_previous_track";
    if (key === "next" && this.supports(MEDIA.next)) return "media_next_track";
    if (key === "mute" && this.supports(MEDIA.volumeMute)) return "volume_mute";
    if (["volume_up", "volume_down"].includes(key) && this.supports(MEDIA.volumeStep)) return key;
    return undefined;
  }
  private button(key: string) {
    const entry = keys[key as RemoteKey], digit = /^\d$/.test(key);
    return html`<button class="key ${key === "0" ? "zero" : key}" aria-label=${entry ? localizeText(this.hass, entry[0]) : key}
      ?disabled=${!this.nativeService(key) && !(this.canSend && remoteCommand(this.hass, this.config!, key).trim()) && this.volumeForKey(key) === undefined}
      @click=${() => void this.control(key)}>${digit ? key : html`<ha-icon .icon=${entry?.[1] || "mdi:remote"}></ha-icon>`}</button>`;
  }
  private volumeForKey(key: string): number | undefined {
    const volume = this.entities.media?.attributes.volume_level;
    return !Object.hasOwn(this.config?.remote_commands ?? {}, key) &&
      ["volume_up", "volume_down"].includes(key) && this.supports(MEDIA.volumeSet) &&
      typeof volume === "number" && Number.isFinite(volume) ? volume : undefined;
  }
  private async control(key: string): Promise<void> {
    this.feedback("buttons");
    if (Object.hasOwn(this.config?.remote_commands ?? {}, key)) {
      await this.send(remoteCommand(this.hass, this.config!, key));
      return;
    }
    const service = this.nativeService(key), media = this.entities.media, volume = this.volumeForKey(key);
    if (volume !== undefined) {
      await this.call("media_player", "volume_set", { entity_id: media?.entity_id, volume_level: Math.min(1, Math.max(0, volume + (key === "volume_up" ? 1 : -1) * upcomingSize(this.config?.remote_volume_step, 5, 1, 20) / 100)) });
    } else if (service) {
      await this.call("media_player", service, { entity_id: media?.entity_id, ...(service === "volume_mute" ? { is_volume_muted: media?.attributes.is_volume_muted !== true } : {}) });
    } else {
      await this.send(remoteCommand(this.hass, this.config!, key));
    }
  }
  private async send(command: string): Promise<void> {
    if (!command.trim()) { this.error = localize(this.hass, "message.empty_command"); return; }
    if (!this.canSend) { this.error = localize(this.hass, "message.remote_unavailable"); return; }
    if (this.transport === "remote") await this.call("remote", "send_command", {
      entity_id: this.entities.remote?.entity_id, command,
      ...(this.config?.remote_device ? { device: this.config.remote_device } : {}),
    });
    else await this.call("media_player", "play_media", { entity_id: this.entities.media?.entity_id, media_content_id: command, media_content_type: "send_key" });
  }
  private shortcut(button: RemoteButtonConfig): void {
    this.feedback("buttons");
    if (button.type === "action" && button.action) {
      handleAction(this, { ...this.config!, entity: button.action.entity || this.config?.entity, tap_action: button.action }, "tap");
    } else if (button.type === "source" && this.supports(2048)) {
      void this.call("media_player", "select_source", { entity_id: this.entities.media?.entity_id, source: button.source });
    } else if (button.type !== "source") void this.send(button.command || "");
  }
  private async call(domain: string, service: string, data: Record<string, unknown>): Promise<void> {
    if (!this.hass) return;
    this.error = undefined;
    try {
      await this.hass.callService(domain, service, data);
    } catch (error) {
      this.error = localize(this.hass, "message.remote_failed", { error: error instanceof Error ? error.message : String(error) });
      console.warn("Mushroom Addition: remote command failed", error);
    }
  }
  private feedback(kind: "buttons" | "slider"): void {
    const enabled = this.config?.remote_haptics || "all";
    if (enabled === "all" || enabled === kind) this.dispatchEvent(new CustomEvent("haptic", { detail: "light", bubbles: true, composed: true }));
  }
  private readonly stop = (event: Event): void => { event.stopPropagation(); };
  private cancelTap(): void {
    if (this.tapTimer !== undefined) window.clearTimeout(this.tapTimer);
    this.tapTimer = undefined;
    this.firstTap = undefined;
  }
  private readonly pointerDown = (event: PointerEvent): void => {
    event.stopPropagation();
    if (!this.canSend || this.pointer || event.button !== 0) return;
    if (event.isTrusted) (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false, sent: -Infinity };
  };
  private readonly pointerMove = (event: PointerEvent): void => {
    const pointer = this.pointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < upcomingSize(this.config?.remote_swipe_distance, 32, 12, 80)) return;
    pointer.moved = true;
    this.cancelTap();
    if (Date.now() - pointer.sent < 80) return;
    pointer.sent = Date.now(); pointer.x = event.clientX; pointer.y = event.clientY;
    void this.control(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up");
  };
  private readonly pointerUp = (event: PointerEvent): void => {
    if (!this.pointer || this.pointer.id !== event.pointerId) return;
    const moved = this.pointer.moved;
    this.pointer = undefined;
    if (moved) return;
    if (this.config?.remote_double_tap === "disabled") { void this.control("select"); return; }
    if (this.firstTap !== undefined && Date.now() - this.firstTap < 300) {
      this.cancelTap();
      if (this.config?.remote_double_tap === "custom") {
        this.feedback("buttons");
        void this.send(this.config.remote_double_tap_command || "");
      } else void this.control(this.config?.remote_double_tap || "back");
      return;
    }
    this.firstTap = Date.now();
    this.tapTimer = window.setTimeout(() => { this.cancelTap(); void this.control("select"); }, 300);
  };
  private readonly pointerCancel = (): void => {
    if (this.pointer) { this.pointer = undefined; this.cancelTap(); }
  };
  private readonly padKeydown = (event: KeyboardEvent): void => {
    const key: Record<string, string> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "select", " ": "select", Backspace: "back", Home: "home" };
    if (key[event.key] && this.canSend) { event.preventDefault(); event.stopPropagation(); void this.control(key[event.key]); }
  };
}
