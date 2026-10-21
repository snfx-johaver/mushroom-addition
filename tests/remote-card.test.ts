import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { MushroomRemote, remoteCommand, resolveRemoteEntities } from "../src/remote-card";
import { MushroomAdditionEditor } from "../src/editor";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const type = "custom:mushroom-addition-remote-card";
const makeHass = (): HomeAssistant => ({
  states: {
    "media_player.tv": { entity_id: "media_player.tv", state: "playing", attributes: { friendly_name: "Living room TV", device_class: "tv", supported_features: 128 + 256 + 1 + 4 + 8 + 16 + 32 + 2048 + 4096 + 16384, volume_level: .4, source: "HDMI 1", source_list: ["HDMI 1", "TV"] } },
    "remote.tv": { entity_id: "remote.tv", state: "on", attributes: {} },
    "remote.other": { entity_id: "remote.other", state: "on", attributes: {} },
  },
  entities: { "media_player.tv": { device_id: "tv", platform: "androidtv_remote" }, "remote.tv": { device_id: "tv", platform: "androidtv_remote" }, "remote.other": { device_id: "bedroom" } },
  callService: vi.fn().mockResolvedValue(undefined),
});
async function create(config: Partial<AdditionConfig> = {}, hass = makeHass()) {
  const card = document.createElement("mushroom-addition-remote") as MushroomRemote;
  card.hass = hass; card.config = { type, entity: "media_player.tv", ...config };
  document.body.append(card); await card.updateComplete;
  return card;
}
const click = (card: MushroomRemote, label: string) => (card.shadowRoot!.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();
function pointer(card: MushroomRemote, name: string, x = 100, y = 80) {
  card.shadowRoot!.querySelector(".pad")!.dispatchEvent(new PointerEvent(name, { bubbles: true, pointerId: 1, button: 0, clientX: x, clientY: y }));
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Remote Card", () => {
  it("resolves only a paired remote and honors missing explicit overrides", () => {
    const hass = makeHass(), config = { type, entity: "media_player.tv" };
    expect(resolveRemoteEntities(hass, config).remote?.entity_id).toBe("remote.tv");
    expect(resolveRemoteEntities(hass, { ...config, remote_entity: "remote.missing" }).remote).toBeUndefined();
    expect(remoteCommand(hass, config, "up")).toBe("DPAD_UP");
    expect(remoteCommand(hass, { ...config, remote_commands: { up: "CUSTOM_UP" } }, "up")).toBe("CUSTOM_UP");
    const descriptor = CATALOG.find(item => item.upstreamId === "remote_card")!;
    expect(createStubConfig(descriptor, hass).entity).toBe("media_player.tv");
  });
  it("sends directional keys, custom overrides, native power and playback to the right targets", async () => {
    const card = await create({ remote_navigation: "buttons", remote_commands: { home: "CUSTOM_HOME" } });
    click(card, "Up");
    expect(card.hass!.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "DPAD_UP" });
    click(card, "Home");
    expect(card.hass!.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "CUSTOM_HOME" });
    click(card, "Power");
    expect(card.hass!.callService).toHaveBeenLastCalledWith("media_player", "turn_off", { entity_id: "media_player.tv" });
    click(card, "Play / pause");
    expect(card.hass!.callService).toHaveBeenLastCalledWith("media_player", "media_pause", { entity_id: "media_player.tv" });
  });
  it("does not assume Samsung codes for generic players, but supports explicit Samsung transport", async () => {
    const hass = makeHass();
    delete hass.entities!["media_player.tv"].device_id;
    hass.entities!["media_player.tv"].platform = "generic";
    const card = await create({ remote_navigation: "buttons" }, hass);
    expect((card.shadowRoot!.querySelector('button[aria-label="Up"]') as HTMLButtonElement).disabled).toBe(true);
    card.config = { ...card.config!, remote_transport: "samsung", remote_preset: "samsung" }; await card.updateComplete;
    click(card, "Up");
    expect(hass.callService).toHaveBeenLastCalledWith("media_player", "play_media", { entity_id: "media_player.tv", media_content_id: "KEY_UP", media_content_type: "send_key" });
  });
  it("commits volume once, respects custom steps and changes sources", async () => {
    const card = await create({ remote_volume_step: 10 });
    const slider = card.shadowRoot!.querySelector<HTMLInputElement>('input[type="range"]')!;
    expect(slider.style.getPropertyValue("--range-progress")).toBe("40%");
    slider.value = "65"; slider.dispatchEvent(new Event("input", { bubbles: true }));
    expect(slider.style.getPropertyValue("--range-progress")).toBe("65%");
    expect(card.hass!.callService).not.toHaveBeenCalled();
    slider.dispatchEvent(new Event("change", { bubbles: true }));
    expect(card.hass!.callService).toHaveBeenLastCalledWith("media_player", "volume_set", { entity_id: "media_player.tv", volume_level: .65 });
    click(card, "Volume up");
    expect(card.hass!.callService).toHaveBeenLastCalledWith("media_player", "volume_set", { entity_id: "media_player.tv", volume_level: .5 });
    const source = card.shadowRoot!.querySelector<HTMLSelectElement>("select")!; source.value = "TV"; source.dispatchEvent(new Event("change", { bubbles: true }));
    expect(card.hass!.callService).toHaveBeenLastCalledWith("media_player", "select_source", { entity_id: "media_player.tv", source: "TV" });
  });
  it("uses Mushroom sizing by default while preserving explicit Remote button sizes", async () => {
    const card = await create();
    const size = () => card.shadowRoot!.querySelector<HTMLElement>(".remote")!.style.getPropertyValue("--button-size");
    expect(size()).toBe("var(--mush-control-height, 42px)");
    card.config = { ...card.config!, remote_button_size: 56 };
    await card.updateComplete;
    expect(size()).toBe("56px");
  });
  it("disables unusable absolute volume and never bypasses an explicit command override", async () => {
    const hass = makeHass();
    delete hass.states["remote.tv"];
    hass.states["media_player.tv"].attributes.supported_features = 4;
    delete hass.states["media_player.tv"].attributes.volume_level;
    const card = await create({}, hass);
    const volume = () => card.shadowRoot!.querySelector('button[aria-label="Volume up"]') as HTMLButtonElement;
    expect(volume().disabled).toBe(true);
    hass.states["media_player.tv"].attributes.volume_level = .4;
    card.hass = { ...hass };
    await card.updateComplete;
    expect(volume().disabled).toBe(false);
    card.config = { ...card.config!, remote_commands: { volume_up: "CUSTOM_VOLUME" } };
    await card.updateComplete;
    expect(volume().disabled).toBe(true);
    volume().click();
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("arbitrates touchpad taps, double taps, capture loss, swipes and keyboard without extra Select", async () => {
    vi.useFakeTimers();
    const card = await create();
    pointer(card, "pointerdown"); pointer(card, "pointerup");
    card.shadowRoot!.querySelector(".pad")!.dispatchEvent(new Event("lostpointercapture"));
    await vi.advanceTimersByTimeAsync(301);
    expect(card.hass!.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "DPAD_CENTER" });
    vi.mocked(card.hass!.callService).mockClear();
    for (let i = 0; i < 2; i++) { pointer(card, "pointerdown"); pointer(card, "pointerup"); }
    await vi.advanceTimersByTimeAsync(301);
    expect(card.hass!.callService).toHaveBeenCalledOnce();
    expect(card.hass!.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "BACK" });
    vi.mocked(card.hass!.callService).mockClear();
    pointer(card, "pointerdown"); pointer(card, "pointermove", 155); pointer(card, "pointerup", 155);
    await vi.advanceTimersByTimeAsync(301);
    expect(card.hass!.callService).toHaveBeenCalledOnce();
    expect(card.hass!.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "DPAD_RIGHT" });
    card.shadowRoot!.querySelector(".pad")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    expect(card.hass!.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "DPAD_DOWN" });
  });
  it("supports source/action shortcuts and exposes haptics and service errors honestly", async () => {
    const card = await create({ remote_buttons: [{ type: "source", source: "TV", name: "Television" }, { type: "action", name: "Lights", action: { action: "perform-action", perform_action: "light.toggle", target: { entity_id: "light.room" } } }] });
    const action = vi.fn(), haptic = vi.fn(); card.addEventListener("hass-action", action); card.addEventListener("haptic", haptic);
    (card.shadowRoot!.querySelector(".shortcut") as HTMLButtonElement).click();
    expect(card.hass!.callService).toHaveBeenLastCalledWith("media_player", "select_source", { entity_id: "media_player.tv", source: "TV" });
    (card.shadowRoot!.querySelectorAll(".shortcut")[1] as HTMLButtonElement).click();
    expect(action.mock.calls[0][0].detail.config.tap_action.perform_action).toBe("light.toggle");
    expect(haptic).toHaveBeenCalledTimes(2);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.mocked(card.hass!.callService).mockRejectedValueOnce(new Error("TV unreachable"));
    click(card, "Power"); await Promise.resolve(); await card.updateComplete;
    expect(card.shadowRoot!.querySelector('[role="alert"]')!.textContent).toContain("TV unreachable");
  });
  it("provides compact graphical section ordering and custom button configuration", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = makeHass(); editor.setConfig({ type, entity: "media_player.tv", remote_sections: ["power", "navigation"] });
    document.body.append(editor); await editor.updateComplete;
    const changed = vi.fn(); editor.addEventListener("config-changed", changed);
    editor.shadowRoot!.querySelector("ha-sortable")!.dispatchEvent(new CustomEvent("item-moved", { detail: { oldIndex: 0, newIndex: 1 }, bubbles: true }));
    expect(changed.mock.calls.at(-1)![0].detail.config.remote_sections).toEqual(["navigation", "power"]);
    await editor.updateComplete;
    const add = [...editor.shadowRoot!.querySelectorAll("button")].find(button => button.textContent === "Add custom button")!;
    add.click(); await editor.updateComplete;
    expect(changed.mock.calls.at(-1)![0].detail.config.remote_buttons).toHaveLength(1);
    expect(changed.mock.calls.at(-1)![0].detail.config.remote_sections).toContain("shortcuts");
    expect(editor.shadowRoot!.querySelector(".remote-detail ha-form")).not.toBeNull();
  });
});
