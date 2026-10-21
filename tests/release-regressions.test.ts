import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { MushroomAdditionCard } from "../src/card";
import { MushroomMiniGraphCard } from "../src/mini-graph";
import type { MiniGraphCardConfig } from "../src/mini-graph";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { MushroomUpcomingMedia } from "../src/upcoming-media";
import { MushroomPiHole } from "../src/pi-hole";
import { MushroomRemote, remoteCommand } from "../src/remote-card";

const hass = (): HomeAssistant => ({
  states: {
    "switch.first": { entity_id: "switch.first", state: "on", attributes: {} },
    "switch.second": { entity_id: "switch.second", state: "on", attributes: {} },
    "input_datetime.alarm": { entity_id: "input_datetime.alarm", state: "08:00:00", attributes: { has_time: true, has_date: false } },
  },
  callService: vi.fn().mockResolvedValue(undefined),
});
async function card(id: string, config: Partial<AdditionConfig> = {}, state = hass()) {
  const descriptor = CATALOG.find(item => item.upstreamId === id)!;
  const element = document.createElement(descriptor.tag) as MushroomAdditionCard;
  element.hass = state;
  element.setConfig({ type: `custom:${descriptor.tag}`, entity: "switch.first", ...config });
  document.body.append(element);
  await element.updateComplete;
  return element;
}
async function graph(config: Partial<MiniGraphCardConfig>, state: HomeAssistant) {
  const element = document.createElement("mushroom-addition-mini-graph-card") as MushroomMiniGraphCard;
  element.hass = state;
  element.setConfig({ type: "custom:mushroom-addition-mini-graph-card", entities: ["switch.first"], ...config });
  document.body.append(element);
  await element.updateComplete;
  await new Promise(resolve => setTimeout(resolve, 0));
  await element.updateComplete;
  return element;
}
afterEach(() => { document.body.replaceChildren(); localStorage.clear(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("release audit regressions", () => {
  it.each(["custom_card_alarm_time", "custom_card_input_datetime"])("adjusts combined helpers correctly in %s", async id => {
    const state = hass();
    state.states["input_datetime.alarm"].state = "2026-10-21 08:30:00";
    state.states["input_datetime.alarm"].attributes.has_date = true;
    const element = await card(id, {
      entity: "input_datetime.alarm", datetime_entity: "input_datetime.alarm",
    }, state);
    expect(element.shadowRoot!.textContent).toContain("08:30");
    const buttons = element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button");
    buttons[buttons.length - 1].click();
    expect(state.callService).toHaveBeenCalledWith("input_datetime", "set_datetime", {
      entity_id: "input_datetime.alarm", time: "08:45:00",
    });
  });
  it.each(["custom_card_alarm_time", "custom_card_input_datetime"])("disables time changes for date-only helpers in %s", async id => {
    const state = hass();
    state.states["input_datetime.alarm"].state = "2026-10-21";
    state.states["input_datetime.alarm"].attributes = { has_date: true, has_time: false };
    const element = await card(id, {
      entity: "input_datetime.alarm", datetime_entity: "input_datetime.alarm",
    }, state);
    const buttons = [...element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")];
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.every(button => button.disabled)).toBe(true);
    expect(element.shadowRoot!.textContent).toContain("2026-10-21");
    for (const button of buttons) button.click();
    expect(state.callService).not.toHaveBeenCalled();
  });
  it("preserves explicit scene actions, targets, confirmation and none", async () => {
    const element = await card("card_scenes", { scene_items: [
      { entity: "switch.first", tap_action: { action: "none" } },
      { entity: "switch.first", tap_action: { action: "perform-action", perform_action: "switch.turn_on", target: { entity_id: "switch.second" }, confirmation: { text: "Confirm the selected switch" } } },
    ] });
    const action = vi.fn();
    element.addEventListener("hass-action", action);
    const controls = element.shadowRoot!.querySelectorAll<HTMLButtonElement>(".scene-button");
    controls[0].click();
    expect(element.hass!.callService).not.toHaveBeenCalled();
    controls[1].click();
    expect(element.hass!.callService).not.toHaveBeenCalled();
    expect(action.mock.calls.at(-1)?.[0].detail.config.tap_action).toMatchObject({
      target: { entity_id: "switch.second" }, confirmation: { text: "Confirm the selected switch" },
    });
  });
  it("leaves nested controls' Enter/Space keys alone", async () => {
    const element = await card("custom_card_alarm_time", {
      entity: "input_datetime.alarm", datetime_entity: "input_datetime.alarm",
      tap_action: { action: "navigate", navigation_path: "/outer" },
    });
    const action = vi.fn();
    element.addEventListener("hass-action", action);
    const button = element.shadowRoot!.querySelector("button")!;
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(action).not.toHaveBeenCalled();
  });
  it("cancels delayed tap and hold on replacement config and removal", async () => {
    vi.useFakeTimers();
    const descriptor = CATALOG.find(item => item.upstreamId === "card_battery")!;
    const config: AdditionConfig = { type: `custom:${descriptor.tag}`, entity: "switch.first",
      double_tap_action: { action: "more-info" }, hold_action: { action: "more-info" } };
    const element = await card("card_battery", config);
    const action = vi.fn();
    element.addEventListener("hass-action", action);
    element.shadowRoot!.querySelector<HTMLElement>(".action-surface")!.click();
    element.setConfig({ ...config, entity: "switch.second" });
    await vi.advanceTimersByTimeAsync(350);
    expect(action).not.toHaveBeenCalled();
    element.shadowRoot!.querySelector(".action-surface")!.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    element.remove();
    await vi.advanceTimersByTimeAsync(600);
    expect(action).not.toHaveBeenCalled();
  });
  it("keeps multiple recorder attributes of one entity independent", async () => {
    const state = hass();
    state.states["switch.first"].attributes = { first: 10, second: 90 };
    const send = vi.fn().mockResolvedValue({ "switch.first": [
      { state: "on", attributes: { first: 10, second: 90 }, last_updated: new Date(Date.now() - 600_000).toISOString() },
    ] });
    state.connection = { sendMessagePromise: send as NonNullable<HomeAssistant["connection"]>["sendMessagePromise"], subscribeMessage: async () => () => undefined };
    const element = await graph({ entities: [{ entity: "switch.first", attribute: "first" }, { entity: "switch.first", attribute: "second" }], show: { average: true } }, state);
    expect(element.shadowRoot!.querySelector(".statistics b")?.textContent?.trim()).toBe("10");
    const paths = [...element.shadowRoot!.querySelectorAll(".series .line")].map(path => path.getAttribute("d"));
    expect(paths).toHaveLength(2);
    expect(paths[0]).not.toBe(paths[1]);
    expect(send.mock.calls[0][0].entity_ids).toEqual(["switch.first"]);
  });
  it("keeps state-map cache identities separate and gradient offsets increasing", async () => {
    const state = hass();
    state.states["switch.first"].state = "off";
    const send = vi.fn().mockResolvedValue({ "switch.first": [
      { state: "on", last_updated: new Date(Date.now() - 600_000).toISOString() },
    ] });
    state.connection = { sendMessagePromise: send as NonNullable<HomeAssistant["connection"]>["sendMessagePromise"], subscribeMessage: async () => () => undefined };
    const config: Partial<MiniGraphCardConfig> = { cache: true, state_map: [{ value: "off", label: "Off" }, { value: "on", label: "On" }],
      color_thresholds: [{ value: 0, color: "blue" }, { value: 1, color: "red" }] };
    const first = await graph(config, state);
    const offsets = [...first.shadowRoot!.querySelectorAll("linearGradient stop")].map(stop => Number.parseFloat(stop.getAttribute("offset")!));
    expect(offsets.length).toBeGreaterThan(1);
    expect(offsets).toEqual([...offsets].sort((a, b) => a - b));
    first.remove();
    await graph({ ...config, state_map: [...config.state_map!].reverse() }, state);
    expect(send).toHaveBeenCalledTimes(2);
  });
  it("allows never-pressed Pi-hole maintenance buttons, but not unavailable ones", async () => {
    const state = hass();
    state.states["button.maintenance"] = { entity_id: "button.maintenance", state: "unknown", attributes: {} };
    const element = document.createElement("mushroom-addition-pi-hole") as MushroomPiHole;
    element.hass = state;
    element.config = { type: "custom:mushroom-addition-pi-hole-card", entity: "button.maintenance", pihole_sections: ["controls"] };
    document.body.append(element); await element.updateComplete;
    expect(element.shadowRoot!.querySelector<HTMLButtonElement>("button")!.disabled).toBe(false);
    element.hass = { ...state, states: { ...state.states, "button.maintenance": { ...state.states["button.maintenance"], state: "unavailable" } } };
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector<HTMLButtonElement>("button")!.disabled).toBe(true);
  });
  it("replaces a failed artwork node when a fresh image URL arrives", async () => {
    const state = hass();
    state.states["sensor.upcoming"] = { entity_id: "sensor.upcoming", state: "1", attributes: { data: [{ title: "Film", poster: "https://example.test/failed.jpg" }] } };
    const element = document.createElement("mushroom-addition-upcoming-media") as MushroomUpcomingMedia;
    element.hass = state;
    element.config = { type: "custom:mushroom-addition-upcoming-media-card", entity: "sensor.upcoming" };
    document.body.append(element); await element.updateComplete;
    const old = element.shadowRoot!.querySelector("img")!;
    old.dispatchEvent(new Event("error"));
    expect(old.hidden).toBe(true);
    state.states["sensor.upcoming"].attributes.data = [{ title: "Film", poster: "https://example.test/fresh.jpg" }];
    element.hass = { ...state }; await element.updateComplete;
    const fresh = element.shadowRoot!.querySelector("img")!;
    expect(fresh).not.toBe(old);
    expect(fresh.hidden).toBe(false);
    fresh.dispatchEvent(new Event("load"));
    expect(fresh.parentElement?.hasAttribute("title")).toBe(false);
  });
  it("uses Roku reverse and disables unsupported keys unless overridden", async () => {
    const state = hass();
    state.states["remote.roku"] = { entity_id: "remote.roku", state: "on", attributes: {} };
    const config: AdditionConfig = { type: "custom:mushroom-addition-remote-card", entity: "remote.roku", remote_preset: "roku", remote_sections: ["playback"], remote_playback_controls: ["rewind", "previous", "next", "stop"] };
    expect(remoteCommand(state, config, "rewind")).toBe("reverse");
    const element = document.createElement("mushroom-addition-remote") as MushroomRemote;
    element.hass = state; element.config = config; document.body.append(element); await element.updateComplete;
    const controls = [...element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")];
    expect(controls.map(button => button.disabled)).toEqual([false, true, true, true]);
    controls[0].click();
    expect(state.callService).toHaveBeenLastCalledWith("remote", "send_command", { entity_id: "remote.roku", command: "reverse" });
  });
});
