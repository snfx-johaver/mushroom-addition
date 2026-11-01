import { afterEach, describe, expect, it, vi } from "vitest";
import { ForecastService } from "../src/weather-advanced/components/forecast-service";
import type { ForecastEvent } from "../src/weather-advanced/types";
import type { HomeAssistant } from "../src/types";

afterEach(() => vi.useRealTimers());
const source = (subscribeMessage: NonNullable<HomeAssistant["connection"]>["subscribeMessage"]): HomeAssistant => ({
  states: { "weather.example": { entity_id: "weather.example", state: "cloudy", attributes: {} } },
  callService: async () => undefined, connection: { subscribeMessage, sendMessagePromise: vi.fn() },
});
describe("Weather Advanced forecast lifecycle", () => {
  it("requests only enabled and supported forecast types", async () => {
    const subscribe = vi.fn(async () => vi.fn());
    const hass = source(subscribe);
    hass.states["weather.example"].attributes.supported_features = 1;
    const service = new ForecastService(vi.fn());
    await service.subscribe(hass, "weather.example", { hourly: true, daily: true, twiceDaily: true });
    expect(subscribe.mock.calls).toHaveLength(1);
    expect(subscribe).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ forecast_type: "daily" }));
    service.unsubscribe();
    subscribe.mockClear();
    await service.subscribe(hass, "weather.example", { hourly: false, daily: false, twiceDaily: false });
    expect(subscribe).not.toHaveBeenCalled();
  });
  it("ignores late callbacks and releases a pending subscription after disconnect", async () => {
    let callback: ((message: ForecastEvent) => void) | undefined;
    let finish: ((value: () => void) => void) | undefined;
    const hass = source(<T>(handler: (message: T) => void) => {
      callback = handler as (message: ForecastEvent) => void;
      return new Promise<() => void>(resolve => { finish = resolve; });
    });
    const update = vi.fn(), unsubscribe = vi.fn();
    const service = new ForecastService(update);
    await service.subscribe(hass, "weather.example", { hourly: true, daily: false, twiceDaily: false });
    service.unsubscribe();
    callback!({ type: "hourly", forecast: [{ datetime: new Date().toISOString(), temperature: 20 }] });
    finish!(unsubscribe);
    await Promise.resolve();
    expect(update).not.toHaveBeenCalled();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(service.getHourlyData()).toEqual([]);
  });
  it("clears empty forecast updates and bounds retries without an update storm", async () => {
    vi.useFakeTimers();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const subscribe = vi.fn(async () => { throw new Error("temporarily unavailable"); });
    const service = new ForecastService(vi.fn());
    await service.subscribe(source(subscribe), "weather.example", { hourly: true, daily: false, twiceDaily: false });
    await vi.advanceTimersByTimeAsync(240_000);
    expect(subscribe).toHaveBeenCalledTimes(4);
    expect(warning).toHaveBeenCalledTimes(4);
    service.unsubscribe();
    expect(vi.getTimerCount()).toBe(0);
    warning.mockRestore();
  });
  it("accepts empty events so removed provider data does not remain visible", async () => {
    let event: ((message: ForecastEvent) => void) | undefined;
    const service = new ForecastService(vi.fn());
    await service.subscribe(source(async <T>(handler: (message: T) => void) => {
      event = handler as (message: ForecastEvent) => void;
      return () => undefined;
    }), "weather.example", { hourly: true, daily: false, twiceDaily: false });
    event!({ type: "hourly", forecast: [{ datetime: new Date().toISOString(), temperature: 20 }] });
    expect(service.getHourlyData()).toHaveLength(1);
    event!({ type: "hourly", forecast: [] });
    expect(service.getHourlyData()).toEqual([]);
    service.unsubscribe();
  });
});
