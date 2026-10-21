import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { populatedDefaultsFor } from "../src/defaults";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { SONOS_MEDIA_FEATURES as F } from "../src/sonos-controls";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";

const descriptor = CATALOG.find((item) => item.upstreamId === "custom_card_media_player_sonos")!;
const entityId = "media_player.office";
const type = `custom:${descriptor.tag}`;
const allFeatures = Object.values(F).reduce((mask, feature) => mask | feature, 0);
const complete: Partial<AdditionConfig> = {
  use_media_info: true,
  ulm_card_media_player_power_button: true,
  volume_controls: ["volume_mute", "volume_set", "volume_buttons"],
  media_controls: ["shuffle", "previous", "play_pause_stop", "next", "repeat"],
};
type Card = HTMLElement & {
  hass: HomeAssistant;
  setConfig: (config: AdditionConfig) => void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
};
const player = (state = "playing", attributes: HassEntity["attributes"] = {}): HassEntity => ({
  entity_id: entityId,
  state,
  attributes: {
    friendly_name: "Office",
    icon: "mdi:speaker-wireless",
    supported_features: allFeatures,
    volume_level: 0.42,
    media_title: "The song",
    media_artist: "The artist",
    source: "Spotify",
    ...attributes,
  },
});
const render = async (config: Partial<AdditionConfig> = {}, entity = player(), extraStates: HomeAssistant["states"] = {}) => {
  const callService = vi.fn<HomeAssistant["callService"]>(async () => undefined);
  const card = document.createElement(descriptor.tag) as Card;
  card.hass = {
    states: {
      [entityId]: entity,
      "switch.office_crossfade": { entity_id: "switch.office_crossfade", state: "off", attributes: {} },
      "number.office_bass": { entity_id: "number.office_bass", state: "2", attributes: { min: -10, max: 10 } },
      ...extraStates,
    },
    callService,
  };
  card.setConfig({ type, entity: entityId, ...config });
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot;
  const button = (label: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  return { card, root, button, callService };
};
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); });

describe("Sonos Mushroom-compatible media controls", () => {
  it("translates linked sound controls while preserving their service targets and values", async () => {
    const { card, root, callService } = await render({ sonos_details_always_visible: true });
    card.hass = { ...card.hass, language: "de" };
    await card.updateComplete;
    const crossfade = root.querySelector<HTMLButtonElement>(".sonos-switches button")!;
    expect(crossfade.textContent).toContain("Überblenden");
    crossfade.click();
    expect(callService).toHaveBeenCalledWith("homeassistant", "toggle", { entity_id: "switch.office_crossfade" });
    const bass = root.querySelector<HTMLInputElement>('input[aria-label="Tiefen"]')!;
    expect(bass).not.toBeNull();
    expect(bass.style.getPropertyValue("--range-progress")).toBe("60%");
    callService.mockClear();
    bass.value = "-3";
    bass.dispatchEvent(new Event("input", { bubbles: true }));
    expect(bass.style.getPropertyValue("--range-progress")).toBe("35%");
    expect(callService).not.toHaveBeenCalled();
    bass.dispatchEvent(new Event("change", { bubbles: true }));
    expect(callService).toHaveBeenCalledWith("number", "set_value", { entity_id: "number.office_bass", value: -3 });
  });
  it("uses Media Player Advanced as its public picker and editor name", () => {
    expect(descriptor.name).toBe("Media Player Advanced Card");
    expect(window.customCards?.find(card => card.type === descriptor.tag)?.name).toContain("Media Player Advanced");
  });

  it.each([8319551, 8322623])("supports standby and resume with the actual Sonos/Music Assistant feature mask %i", async (features) => {
    for (const state of ["playing", "buffering", "paused", "idle", "off", "standby"]) {
      const stopping = ["playing", "buffering", "paused"].includes(state);
      const label = stopping ? "Standby (stop playback)" : "Resume playback";
      const service = stopping ? "media_stop" : "media_play";
      const view = await render({ ...complete, collapsible_controls: true, ulm_card_media_player_idle_off: true },
        player(state, { supported_features: features }));
      expect(view.button(label)?.disabled, state).toBe(false);
      view.button(label)!.click();
      expect(view.callService).toHaveBeenCalledExactlyOnceWith("media_player", service, { entity_id: entityId });
      expect(view.button("Turn on")).toBeNull();
      expect(view.button("Turn off")).toBeNull();
      view.card.setConfig({ type, entity: entityId, ...complete, ulm_card_media_player_power_button: false });
      await view.card.updateComplete;
      expect(view.button(label)).toBeNull();
    }
  });

  it("does not substitute playback for a missing direction of one-sided hardware power", async () => {
    const view = await render(complete, player("off", { supported_features: F.turnOff | F.play | F.stop }));
    expect(view.button("Turn on")).toBeNull();
    expect(view.button("Resume playback")).toBeNull();
    expect(view.callService).not.toHaveBeenCalled();
  });

  it("preserves legacy controls and label when arrays are omitted, but respects empty selections", async () => {
    const legacy = await render({}, player("playing", { supported_features: undefined }));
    expect(legacy.root.querySelector(".ulm-label")?.textContent).toBe("Spotify");
    expect([...legacy.root.querySelectorAll(".sonos-controls button")].map((node) => node.getAttribute("aria-label")))
      .toEqual(["Volume down", "Play or pause", "Volume up"]);
    legacy.button("Play or pause")!.click();
    expect(legacy.callService).toHaveBeenCalledWith("media_player", "media_play_pause", { entity_id: entityId });
    const empty = await render({ media_controls: [], volume_controls: [] });
    expect(empty.root.querySelectorAll(".sonos-controls button, .sonos-controls input")).toHaveLength(0);
  });

  it("renders each configured control and sends exact service payloads", async () => {
    const { root, button, callService } = await render(complete);
    for (const label of ["Turn off", "Mute", "Volume down", "Shuffle", "Previous track", "Pause", "Next track", "Repeat: Off", "Volume up"]) {
      expect(button(label), label).not.toBeNull();
      button(label)!.click();
    }
    const slider = root.querySelector<HTMLInputElement>(".sonos-volume input")!;
    expect(slider.style.getPropertyValue("--range-progress")).toBe("42%");
    slider.value = "67";
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(slider.style.getPropertyValue("--range-progress")).toBe("67%");
    expect(callService).toHaveBeenCalledTimes(9);
    slider.dispatchEvent(new Event("change", { bubbles: true }));
    expect(callService.mock.calls).toEqual([
      ["media_player", "turn_off", { entity_id: entityId }],
      ["media_player", "volume_mute", { entity_id: entityId, is_volume_muted: true }],
      ["media_player", "volume_down", { entity_id: entityId }],
      ["media_player", "shuffle_set", { entity_id: entityId, shuffle: true }],
      ["media_player", "media_previous_track", { entity_id: entityId }],
      ["media_player", "media_pause", { entity_id: entityId }],
      ["media_player", "media_next_track", { entity_id: entityId }],
      ["media_player", "repeat_set", { entity_id: entityId, repeat: "all" }],
      ["media_player", "volume_up", { entity_id: entityId }],
      ["media_player", "volume_set", { entity_id: entityId, volume_level: 0.67 }],
    ]);
  });

  it("keeps the legacy on_off selection working, with the new explicit power toggle taking precedence", async () => {
    const legacy = await render({ media_controls: ["on_off"] });
    expect(legacy.button("Turn off")).not.toBeNull();
    legacy.button("Turn off")!.click();
    expect(legacy.callService).toHaveBeenCalledWith("media_player", "turn_off", { entity_id: entityId });
    const hidden = await render({ media_controls: ["on_off"], ulm_card_media_player_power_button: false });
    expect(hidden.button("Turn off")).toBeNull();
    const explicit = await render({ media_controls: [], ulm_card_media_player_power_button: true });
    expect(explicit.button("Turn off")).not.toBeNull();
  });

  it("adds optional album details and respects the media-info toggle", async () => {
    const view = await render({
      use_media_info: true, ulm_card_media_player_more_info: true, primary_info: "name", secondary_info: "state",
    }, player("paused", { media_album_name: "The album" }));
    expect(view.root.querySelector(".ulm-name")?.textContent).toBe("The song");
    expect(view.root.querySelector(".ulm-label")?.textContent).toBe("The artist · The album");
    view.card.setConfig({ type, entity: entityId, use_media_info: false, ulm_card_media_player_more_info: true });
    await view.card.updateComplete;
    expect(view.root.querySelector(".ulm-name")?.textContent).toBe("Office");
    expect(view.root.querySelector(".ulm-label")?.textContent).toBe("The artist · The album");
  });

  it.each(["idle", "standby"])("can collapse %s controls while retaining supported power", async (state) => {
    const view = await render({ ...complete, collapsible_controls: true, ulm_card_media_player_idle_off: true }, player(state));
    expect(view.root.querySelectorAll(".sonos-controls button")).toHaveLength(1);
    expect(view.root.querySelector(".sonos-volume")).toBeNull();
    expect(view.root.querySelector(".sonos-details")).toBeNull();
    expect(view.button(state === "standby" ? "Turn on" : "Turn off")).not.toBeNull();
  });

  it.each([[0.42, 0.37, 0.47], [0.02, 0, 0.07], [0.98, 0.93, 1]])(
    "uses a configured volume step and clamps at the endpoints from %s", async (volume, down, up) => {
      const view = await render({ ...complete, ulm_card_media_player_enable_volume_adjust: 0.05 },
        player("playing", { volume_level: volume }));
      view.button("Volume down")!.click();
      view.button("Volume up")!.click();
      expect(view.callService.mock.calls).toEqual([
        ["media_player", "volume_set", { entity_id: entityId, volume_level: expect.closeTo(down, 10) }],
        ["media_player", "volume_set", { entity_id: entityId, volume_level: expect.closeTo(up, 10) }],
      ]);
    },
  );

  it("retains the native volume step when volume-set is unsupported", async () => {
    const view = await render({ ...complete, ulm_card_media_player_enable_volume_adjust: 0.05 },
      player("playing", { supported_features: F.volumeStep }));
    view.button("Volume up")!.click();
    expect(view.callService).toHaveBeenCalledWith("media_player", "volume_up", { entity_id: entityId });
    expect(view.root.querySelector(".sonos-volume")).toBeNull();
  });

  it("targets the selected playback player, using its features, state and volume but retaining the primary header", async () => {
    const alternate = "media_player.other_room";
    const view = await render({
      ...complete, media_controls: ["play_pause_stop", "sources"],
      ulm_card_media_player_player_controls_entity: alternate,
    }, player(), { [alternate]: { ...player("paused", {
      supported_features: F.play | F.volumeSet, volume_level: 0.17,
    }), entity_id: alternate } });
    expect(view.root.querySelector(".ulm-name")?.textContent).toBe("The song");
    expect(view.button("Pause")).toBeNull();
    expect(view.button("Turn off")).toBeNull();
    expect(view.root.querySelector(".sonos-volume")?.textContent).toContain("17%");
    view.button("Play")!.click();
    view.button("Volume up")!.click();
    const slider = view.root.querySelector<HTMLInputElement>(".sonos-volume input")!;
    slider.value = "61";
    slider.dispatchEvent(new Event("change", { bubbles: true }));
    expect(view.callService.mock.calls).toEqual([
      ["media_player", "media_play", { entity_id: alternate }],
      ["media_player", "volume_up", { entity_id: alternate }],
      ["media_player", "volume_set", { entity_id: alternate, volume_level: 0.61 }],
    ]);
    const action = vi.fn();
    view.card.addEventListener("hass-action", action);
    view.button("Sources and details")!.click();
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0].detail).toEqual({
      config: { type, entity: alternate, tap_action: { action: "more-info" } }, action: "tap",
    });
    expect(view.callService).toHaveBeenCalledTimes(3);
  });

  it.each(["missing", "unknown", "unavailable"])("does not fall back to controlling the primary player when the selected playback player is %s", async (state) => {
    const alternate = "media_player.other_room";
    const view = await render({ ...complete, media_controls: ["play_pause_stop", "sources"],
      ulm_card_media_player_player_controls_entity: alternate,
    }, player(), state === "missing" ? {} : { [alternate]: { ...player(state), entity_id: alternate } });
    const action = vi.fn();
    view.card.addEventListener("hass-action", action);
    view.root.querySelectorAll<HTMLButtonElement>(".sonos-controls button").forEach(button => {
      expect(button.disabled).toBe(true);
      button.click();
    });
    expect(action).not.toHaveBeenCalled();
    expect(view.callService).not.toHaveBeenCalled();
  });

  it.each([
    [F.volumeMute, ["Mute"], false],
    [F.volumeSet, ["Volume down", "Volume up"], true],
    [F.volumeStep, ["Volume down", "Volume up"], false],
    [F.previous, ["Previous track"], false],
    [F.next, ["Next track"], false],
    [F.turnOff, ["Turn off"], false],
    [F.pause, ["Pause"], false],
    [F.stop, ["Standby (stop playback)", "Stop"], false],
    [F.shuffle, ["Shuffle"], false],
    [F.repeat, ["Repeat: Off"], false],
    [0, [], false],
  ])("gates controls against supported_features=%i", async (features, labels, slider) => {
    const { root } = await render(complete, player("playing", { supported_features: features }));
    expect([...root.querySelectorAll(".sonos-controls button")].map((node) => node.getAttribute("aria-label"))).toEqual(labels);
    expect(Boolean(root.querySelector(".sonos-volume input"))).toBe(slider);
  });

  it("supports volume buttons through HA's volume-set fallback without volume-step support", async () => {
    const { button, callService } = await render(complete, player("playing", { supported_features: F.volumeSet }));
    button("Volume down")!.click();
    button("Volume up")!.click();
    expect(callService.mock.calls).toEqual([
      ["media_player", "volume_down", { entity_id: entityId }],
      ["media_player", "volume_up", { entity_id: entityId }],
    ]);
  });

  it.each([
    ["off", F.turnOn, "Turn on", "turn_on"],
    ["paused", F.play, "Play", "media_play"],
    ["idle", F.stop, "Stop", "media_stop"],
    ["playing", F.play | F.stop, "Stop", "media_stop"],
    ["playing", F.play | F.pause | F.stop, "Pause", "media_pause"],
  ])("selects a supported %s action", async (state, features, label, service) => {
    const { button, callService } = await render(complete, player(state, { supported_features: features }));
    button(label)!.click();
    expect(callService).toHaveBeenCalledExactlyOnceWith("media_player", service, { entity_id: entityId });
  });

  it.each([["off", "all"], ["all", "one"], ["one", "off"]])("cycles repeat %s to %s", async (repeat, next) => {
    const { button, callService } = await render(complete, player("playing", { repeat }));
    button(`Repeat: ${repeat[0].toUpperCase()}${repeat.slice(1)}`)!.click();
    expect(callService).toHaveBeenCalledExactlyOnceWith("media_player", "repeat_set", { entity_id: entityId, repeat: next });
  });

  it("translates repeat labels without changing the repeat mode sent to the player", async () => {
    const { card, button, callService } = await render(complete, player("playing", { repeat: "all" }));
    card.hass = { ...card.hass, language: "de" };
    await card.updateComplete;
    button("Wiederholen: Alle")!.click();
    expect(callService).toHaveBeenCalledExactlyOnceWith("media_player", "repeat_set", { entity_id: entityId, repeat: "one" });
  });

  it("inverts mute and shuffle attributes", async () => {
    const { button, callService } = await render(complete, player("playing", { is_volume_muted: true, shuffle: true }));
    expect(button("Unmute")?.getAttribute("aria-pressed")).toBe("true");
    expect(button("Shuffle")?.getAttribute("aria-pressed")).toBe("true");
    button("Unmute")!.click();
    button("Shuffle")!.click();
    expect(callService.mock.calls).toEqual([
      ["media_player", "volume_mute", { entity_id: entityId, is_volume_muted: false }],
      ["media_player", "shuffle_set", { entity_id: entityId, shuffle: false }],
    ]);
  });

  it.each(["off", "unknown", "unavailable"])("collapses %s controls except supported power", async (state) => {
    const { root, button, callService } = await render({
      ...complete, collapsible_controls: true,
      shortcuts: { buttons: [{ id: "my-playlist" }] },
    }, player(state));
    expect(root.querySelectorAll(".sonos-controls button")).toHaveLength(1);
    expect(root.querySelectorAll(".sonos-volume, .sonos-details, .sonos-shortcuts")).toHaveLength(0);
    expect(button("Turn on")?.disabled).toBe(state !== "off");
    button("Turn on")!.click();
    expect(callService).toHaveBeenCalledTimes(state === "off" ? 1 : 0);
    const noPower = await render({ ...complete, collapsible_controls: true }, player(state, { supported_features: F.volumeSet }));
    expect(noPower.root.querySelectorAll(".sonos-controls button, .sonos-controls input")).toHaveLength(0);
  });

  it.each(["playing", "paused", "idle"])("keeps %s controls expanded", async (state) => {
    const { root } = await render({ ...complete, collapsible_controls: true }, player(state));
    expect(root.querySelector(".sonos-volume")).not.toBeNull();
    expect(root.querySelector(".sonos-details")).not.toBeNull();
  });

  it("shows expanded controls when off if collapse is disabled", async () => {
    const { root } = await render({ ...complete, collapsible_controls: false }, player("off"));
    expect(root.querySelector(".sonos-volume")).not.toBeNull();
    expect(root.querySelector(".sonos-details")).not.toBeNull();
  });

  it("disables controls for a missing primary entity", async () => {
    const { card, root, callService } = await render(complete);
    card.hass = { ...card.hass, states: {} };
    await card.updateComplete;
    root.querySelectorAll<HTMLButtonElement | HTMLInputElement>(".sonos-controls button, .sonos-controls input").forEach((node) => {
      expect(node.disabled).toBe(true);
    });
    expect(callService).not.toHaveBeenCalled();
  });

  it.each(["unknown", "unavailable"])("disables all expanded %s controls", async (state) => {
    const { root, callService } = await render({
      ...complete, shortcuts: { buttons: [{ id: "playlist" }] },
    }, player(state));
    root.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button, input").forEach((node) => {
      expect(node.disabled).toBe(true);
      node.dispatchEvent(new Event(node.tagName === "INPUT" ? "change" : "click", { bubbles: true }));
    });
    expect(callService).not.toHaveBeenCalled();
  });

  it("retains artwork, details, shortcuts and isolates their nested pointer, keyboard and double-click events", async () => {
    vi.useFakeTimers();
    const { root, callService } = await render({
      ...complete,
      shortcuts: { buttons: [{ id: "playlist" }] },
      tap_action: { action: "perform-action", perform_action: "test.tap" },
      hold_action: { action: "perform-action", perform_action: "test.hold" },
      double_tap_action: { action: "perform-action", perform_action: "test.double" },
    }, player("playing", { entity_picture: "/art.jpg" }));
    expect(root.querySelector(".media-art")).not.toBeNull();
    const surface = root.querySelector(".action-surface")!;
    const bubbled = vi.fn();
    for (const type of ["pointerdown", "pointerup", "pointercancel", "dblclick", "click", "keydown", "keyup"]) {
      surface.addEventListener(type, bubbled);
    }
    for (const selector of [".sonos-controls button", ".sonos-volume input", ".sonos-details summary", ".sonos-switches button", ".sonos-sliders input", ".sonos-shortcuts button"]) {
      const node = root.querySelector(selector)!;
      expect(node, selector).not.toBeNull();
      for (const type of ["pointerdown", "pointerup", "pointercancel", "dblclick", "keydown", "keyup"]) {
        node.dispatchEvent(type.startsWith("key")
          ? new KeyboardEvent(type, { key: "Enter", bubbles: true })
          : new Event(type, { bubbles: true }));
      }
      node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    await vi.advanceTimersByTimeAsync(700);
    expect(bubbled).not.toHaveBeenCalled();
    expect(callService.mock.calls.every(([domain]) => domain === "media_player" || domain === "homeassistant")).toBe(true);
  });

  it("uses media title/artist with a single volume percentage beside the slider", async () => {
    const media = await render(complete);
    expect(media.root.querySelector(".ulm-name")?.textContent).toBe("The song");
    expect(media.root.querySelector(".ulm-label")?.textContent).toBe("The artist");
    expect(media.root.querySelector(".sonos-volume")?.textContent).toContain("42%");
    const editorModes = await render({ ...complete, primary_info: "name", secondary_info: "state" });
    expect(editorModes.root.querySelector(".ulm-name")?.textContent).toBe("The song");
    expect(editorModes.root.querySelector(".ulm-label")?.textContent).toBe("The artist");
    editorModes.card.setConfig({ type, entity: entityId, ...complete, use_media_info: false, primary_info: "name", secondary_info: "state" });
    await editorModes.card.updateComplete;
    expect(editorModes.root.querySelector(".ulm-name")?.textContent).toBe("Office");
    expect(editorModes.root.querySelector(".ulm-label")?.textContent).toBe("playing");
    const noVolume = await render({ ...complete, show_volume_level: false });
    expect(noVolume.root.querySelector(".ulm-label")?.textContent).toBe("The artist");
    const noInfo = await render({ use_media_info: false, show_volume_level: false });
    expect(noInfo.root.querySelector(".ulm-name")?.textContent).toBe("Office");
    expect(noInfo.root.querySelector(".ulm-label")?.textContent).toBe("Spotify");
    const overrides = await render({ ...complete, primary_info: "state", secondary_info: "name" });
    expect(overrides.root.querySelector(".ulm-name")?.textContent).toBe("playing");
    expect(overrides.root.querySelector(".ulm-label")?.textContent).toBe("Office");
    const hidden = await render({ ...complete, primary_info: "none", secondary_info: "none" });
    expect(hidden.root.querySelector(".ulm-name")).toBeNull();
    expect(hidden.root.querySelector(".ulm-label")).toBeNull();
    const named = await render({ ...complete, name: "My room" });
    expect(named.root.querySelector(".ulm-name")?.textContent).toBe("My room");
  });

  it("follows the entity icon by default, with explicit icon priority", async () => {
    const defaults = populatedDefaultsFor(descriptor, { states: { [entityId]: player() }, callService: vi.fn() }, entityId);
    expect(defaults.icon).toBeUndefined();
    const media = await render();
    expect((media.root.querySelector(".ulm-icon ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:speaker-wireless");
    media.card.hass = { ...media.card.hass, states: { [entityId]: player("playing", { icon: "mdi:headphones" }) } };
    await media.card.updateComplete;
    expect((media.root.querySelector(".ulm-icon ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:headphones");
    const custom = await render({ icon: "mdi:music" });
    expect((custom.root.querySelector(".ulm-icon ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:music");
    const hidden = await render({ icon_type: "none" });
    expect(hidden.root.querySelector(".ulm-icon")).toBeNull();
  });

  it("exposes native multi-select checkbox lists and round-trips selections including empty arrays", async () => {
    const flatten = (fields: EditorField[]): EditorField[] => fields.flatMap((field) => field.schema ? flatten(field.schema) : [field]);
    const schema = flatten(editorSchemaFor(descriptor));
    for (const [key, values] of [
      ["volume_controls", complete.volume_controls],
      ["media_controls", [...complete.media_controls!, "sources"]],
    ] as const) {
      const field = schema.find((field) => field.name === key)!;
      expect(field.selector).toMatchObject({ select: { multiple: true, mode: "list", options: values!.map((value) => ({ value })) } });
    }
    expect(schema.find(field => field.name === "show_volume_level")).toBeUndefined();
    for (const key of ["use_media_info", "collapsible_controls", "ulm_card_media_player_power_button",
      "ulm_card_media_player_more_info", "ulm_card_media_player_idle_off"]) {
      expect(schema.find((field) => field.name === key)?.selector).toEqual({ boolean: {} });
    }
    const editor = document.createElement("mushroom-addition-editor") as Card;
    editor.hass = { states: { [entityId]: player() }, callService: vi.fn() };
    editor.setConfig({ type, entity: entityId, shortcuts: { buttons: [{ id: "playlist" }] } });
    document.body.append(editor);
    await editor.updateComplete;
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    const form = [...editor.shadowRoot.querySelectorAll("ha-form")]
      .find((form) => (form as HTMLElement & { schema: EditorField[] }).schema.some((field) => field.name === "volume_controls"))!;
    const data = (form as HTMLElement & { data: AdditionConfig }).data;
    expect(data.icon).toBeUndefined();
    expect(data.volume_controls).toEqual(["volume_buttons"]);
    expect(data.media_controls).toEqual(["play_pause_stop"]);
    for (const selected of [{ ...complete, ulm_card_media_player_enable_volume_adjust: 0.05,
      ulm_card_media_player_player_controls_entity: "media_player.other_room",
      ulm_card_media_player_more_info: true, ulm_card_media_player_idle_off: true },
    { volume_controls: [], media_controls: [], use_media_info: false, collapsible_controls: false }]) {
      form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...data, ...selected } }, bubbles: true }));
      expect(changed.mock.calls.at(-1)![0].detail.config).toMatchObject({
        ...selected, shortcuts: { buttons: [{ id: "playlist" }] },
      });
    }
    const constructor = customElements.get(descriptor.tag) as typeof HTMLElement & { getStubConfig: (hass: HomeAssistant) => AdditionConfig };
    const stub = constructor.getStubConfig(editor.hass);
    expect(stub).toMatchObject({ ...complete, collapsible_controls: true });
    const preview = await render(stub);
    expect(preview.root.querySelector(".ulm-name")?.textContent).toBe("The song");
  });

  it("maps legacy power selection into the single power toggle and saves a disabled toggle without restoring it", async () => {
    const editor = document.createElement("mushroom-addition-editor") as Card;
    editor.hass = { states: { [entityId]: player() }, callService: vi.fn() };
    editor.setConfig({ type, entity: entityId, media_controls: ["on_off", "play_pause_stop"] });
    document.body.append(editor);
    await editor.updateComplete;
    const form = [...editor.shadowRoot.querySelectorAll<HTMLElement & { data: AdditionConfig }>("ha-form")]
      .find(form => form.data.ulm_card_media_player_power_button === true)!;
    expect(form.data.media_controls).toEqual(["play_pause_stop"]);
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: {
      ...form.data, ulm_card_media_player_power_button: false,
    } }, bubbles: true }));
    const saved = changed.mock.calls[0][0].detail.config;
    expect(saved.ulm_card_media_player_power_button).toBe(false);
    expect(saved.media_controls).toEqual(["play_pause_stop"]);
    const view = await render(saved);
    expect(view.button("Turn off")).toBeNull();
    expect(view.button("Pause")).not.toBeNull();
  });
});
