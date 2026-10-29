import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import type { MushroomAdditionCard } from "../src/card";
import type { HomeAssistant } from "../src/types";

type Subscribe = NonNullable<HomeAssistant["connection"]>["subscribeMessage"];
const weather = CATALOG.find(item => item.family === "weather")!;
const makeHass = (subscribeMessage: Mock<Subscribe>): HomeAssistant => ({
  states: {
    "weather.home": { entity_id: "weather.home", state: "sunny", attributes: {} },
    "weather.other": { entity_id: "weather.other", state: "cloudy", attributes: {} },
  },
  callService: vi.fn().mockResolvedValue(undefined),
  connection: { sendMessagePromise: vi.fn(), subscribeMessage: subscribeMessage as Subscribe },
});
async function settle(card: MushroomAdditionCard) {
  for (let i = 0; i < 4; i++) {
    await Promise.resolve();
    await card.updateComplete;
  }
}
async function create(hass: HomeAssistant, tag = weather.tag, entity = "weather.home") {
  const card = document.createElement(tag) as MushroomAdditionCard;
  card.hass = hass;
  card.setConfig({ type: `custom:${tag}`, entity, show_forecast: true });
  document.body.append(card);
  await settle(card);
  return card;
}
afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("forecast subscription lifecycle", () => {
  it("never subscribes Sun, pollen or other non-weather entities despite forecast configuration", async () => {
    const subscribe = vi.fn<Subscribe>().mockResolvedValue(vi.fn());
    const hass = makeHass(subscribe);
    for (const [id, entity] of [
      ["custom_card_sun", "sun.sun"],
      ["custom_card_pollen", "sensor.pollen"],
      [weather.upstreamId, "sensor.temperature"],
    ]) {
      const card = await create(hass, CATALOG.find(item => item.upstreamId === id)!.tag, entity);
      for (let i = 0; i < 10; i++) {
        card.hass = { ...hass, states: { ...hass.states } };
        await settle(card);
      }
    }
    expect(subscribe).not.toHaveBeenCalled();
  });

  it("subscribes once, keeps updates live, and replaces subscriptions on config/connection changes", async () => {
    const unsubscribe = vi.fn();
    const subscribe = vi.fn<Subscribe>().mockResolvedValue(unsubscribe);
    const hass = makeHass(subscribe);
    const card = await create(hass);
    expect(subscribe).toHaveBeenCalledExactlyOnceWith(expect.any(Function), {
      type: "weather/subscribe_forecast", entity_id: "weather.home", forecast_type: "daily",
    });
    subscribe.mock.calls[0][0]({ forecast: [{ temperature: 22 }] });
    await settle(card);
    card.hass = { ...hass, states: { ...hass.states } };
    await settle(card);
    expect(subscribe).toHaveBeenCalledOnce();
    card.setConfig({ type: `custom:${weather.tag}`, entity: "weather.other", show_forecast: true });
    await settle(card);
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(subscribe).toHaveBeenCalledTimes(2);
    const replacement = vi.fn<Subscribe>().mockResolvedValue(vi.fn());
    card.hass = makeHass(replacement);
    await settle(card);
    expect(unsubscribe).toHaveBeenCalledTimes(2);
    expect(replacement).toHaveBeenCalledOnce();
  });

  it("backs off failed requests instead of retrying on each hass update, and recovers", async () => {
    vi.useFakeTimers();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const subscribe = vi.fn<Subscribe>().mockRejectedValue(new Error("Forecast temporarily unavailable"));
    const hass = makeHass(subscribe);
    const card = await create(hass);
    for (let i = 0; i < 50; i++) {
      card.hass = { ...hass, states: { ...hass.states } };
      await settle(card);
    }
    expect(subscribe).toHaveBeenCalledOnce();
    expect(warning).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(29_999);
    expect(subscribe).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1);
    expect(subscribe).toHaveBeenCalledTimes(2);
    subscribe.mockResolvedValue(vi.fn());
    await vi.advanceTimersByTimeAsync(59_999);
    expect(subscribe).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(subscribe).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(600_000);
    expect(subscribe).toHaveBeenCalledTimes(3);
  });

  it("cancels retries when disabled or detached and resubscribes on reattachment", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const subscribe = vi.fn<Subscribe>().mockRejectedValue(new Error("Offline"));
    const hass = makeHass(subscribe);
    const card = await create(hass);
    card.setConfig({ type: `custom:${weather.tag}`, entity: "weather.home", show_forecast: false });
    await settle(card);
    await vi.advanceTimersByTimeAsync(600_000);
    expect(subscribe).toHaveBeenCalledOnce();
    card.setConfig({ type: `custom:${weather.tag}`, entity: "weather.home", show_forecast: true });
    await settle(card);
    expect(subscribe).toHaveBeenCalledTimes(2);
    card.remove();
    await vi.advanceTimersByTimeAsync(600_000);
    expect(subscribe).toHaveBeenCalledTimes(2);
    const unsubscribe = vi.fn();
    subscribe.mockResolvedValue(unsubscribe);
    document.body.append(card);
    await settle(card);
    expect(subscribe).toHaveBeenCalledTimes(3);
    card.remove();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });

  it("disposes stale pending subscriptions without scheduling retries or accepting stale errors", async () => {
    vi.useFakeTimers();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    let resolve!: (unsubscribe: () => void) => void;
    let reject!: (error: Error) => void;
    const subscribe = vi.fn<Subscribe>()
      .mockImplementationOnce(() => new Promise(done => { resolve = done; }))
      .mockImplementationOnce(() => new Promise((_, fail) => { reject = fail; }))
      .mockResolvedValue(vi.fn());
    const card = await create(makeHass(subscribe));
    card.setConfig({ type: `custom:${weather.tag}`, entity: "weather.other", show_forecast: true });
    await settle(card);
    const staleUnsubscribe = vi.fn();
    resolve(staleUnsubscribe);
    await settle(card);
    expect(staleUnsubscribe).toHaveBeenCalledOnce();
    card.remove();
    reject(new Error("Late failure"));
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(600_000);
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(warning).not.toHaveBeenCalled();
  });
});
