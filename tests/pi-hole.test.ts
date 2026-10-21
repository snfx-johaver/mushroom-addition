import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { MushroomPiHole, piHoleDuration, piHoleEntities, piHoleMetricEntities, piHoleMetricValue } from "../src/pi-hole";
import { MushroomAdditionCard } from "../src/card";
import { MushroomAdditionEditor } from "../src/editor";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const type = "custom:mushroom-addition-pi-hole-card";
const makeHass = (): HomeAssistant => {
  const hass: HomeAssistant = { states: {}, entities: {}, devices: { one: { name: "DNS primary" }, two: { name: "DNS secondary" } }, language: "en", services: { pi_hole_v6: { disable: {} }, pi_hole: { disable: {} } }, callService: vi.fn().mockResolvedValue(undefined) };
  for (const [device, queries, blocked, platform] of [["one", 1000, 50, "pi_hole_v6"], ["two", 100, 50, "pi_hole"]] as const) {
    hass.states[`switch.${device}`] = { entity_id: `switch.${device}`, state: "on", attributes: { friendly_name: `${device} blocking` } };
    hass.entities![`switch.${device}`] = { device_id: device, platform };
    for (const [key, value] of [["dns_queries_today", queries], ["ads_blocked_today", blocked], ["ads_percentage_blocked_today", 100 * blocked / queries], ["domains_blocked", 120000]] as const) {
      const id = `sensor.${device}_${key}`;
      hass.states[id] = { entity_id: id, state: String(value), attributes: { friendly_name: key } };
      hass.entities![id] = { device_id: device, platform, translation_key: key };
    }
  }
  hass.states["sensor.unrelated_dns_queries_today"] = { entity_id: "sensor.unrelated_dns_queries_today", state: "999999", attributes: {} };
  hass.entities!["sensor.unrelated_dns_queries_today"] = { device_id: "unrelated" };
  return hass;
};
async function create(config: Partial<AdditionConfig> = {}, hass = makeHass()) {
  const card = document.createElement("mushroom-addition-pi-hole") as MushroomPiHole;
  card.hass = hass; card.config = { type, entity: "switch.one", ...config };
  document.body.append(card); await card.updateComplete;
  return card;
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Pi-hole Card", () => {
  it("scopes discovery by device, honors translation keys and excludes unrelated instances", () => {
    const hass = makeHass(), config = { type, entity: "switch.one" };
    expect(piHoleEntities(hass, config).every(entity => hass.entities![entity.entity_id].device_id === "one")).toBe(true);
    hass.states["sensor.translated"] = { ...hass.states["sensor.one_dns_queries_today"], entity_id: "sensor.translated" };
    hass.entities!["sensor.translated"] = { device_id: "one", translation_key: "dns_queries_today" };
    delete hass.states["sensor.one_dns_queries_today"];
    expect(piHoleMetricEntities(hass, config).queries[0].entity_id).toBe("sensor.translated");
    const descriptor = CATALOG.find(item => item.upstreamId === "pi_hole_card")!;
    expect(createStubConfig(descriptor, makeHass()).entity).toBe("switch.one");
  });
  it("sums counts and uses weighted blocked percentages instead of summing or naively averaging", () => {
    const hass = makeHass();
    const mapped = piHoleMetricEntities(hass, { type, pihole_device_ids: ["one", "two"] });
    expect(piHoleMetricValue("queries", mapped)).toBe(1100);
    expect(piHoleMetricValue("blocked", mapped)).toBe(100);
    expect(piHoleMetricValue("percentage", mapped, hass)).toBeCloseTo(100 / 11);
    expect(piHoleMetricValue("domains", mapped)).toBe(240000);
  });
  it("does not replace unavailable, missing or malformed values with zero", () => {
    const hass = makeHass();
    hass.states["sensor.one_dns_queries_today"].state = "unavailable";
    expect(piHoleMetricValue("queries", piHoleMetricEntities(hass, { type, entity: "switch.one" }))).toBeUndefined();
    const mapped = piHoleMetricEntities(hass, { type, entity: "switch.one", pihole_metric_entities: { queries: ["sensor.two_dns_queries_today", "sensor.missing"] } });
    expect(piHoleMetricValue("queries", mapped)).toBeUndefined();
  });
  it("does not calculate weighted percentages from different devices with equal sensor counts", () => {
    const hass = makeHass();
    const mapped = piHoleMetricEntities(hass, { type, pihole_device_ids: ["one", "two"],
      pihole_metric_entities: { queries: ["sensor.one_dns_queries_today"], blocked: ["sensor.two_ads_blocked_today"], percentage: [] } });
    expect(piHoleMetricValue("percentage", mapped, hass)).toBeUndefined();
  });
  it.each([[60, 60], ["5m", 300], ["00:05:00", 300], ["01:30:15", 5415], ["00:75:00", undefined], ["1h:30m:15s", 5415], ["10s", 10], ["0", undefined], ["-5", undefined], ["oops", undefined]] as const)(
    "parses duration %s without guessing", (input, expected) => { expect(piHoleDuration(input)).toBe(expected); },
  );
  it("uses the correct server-timed pause service per v5/v6 switch and target selection", async () => {
    const card = await create({ pihole_device_ids: ["one", "two"] });
    (card.shadowRoot!.querySelectorAll(".duration")[1] as HTMLButtonElement).click();
    await Promise.resolve(); await Promise.resolve();
    expect(card.hass!.callService).toHaveBeenCalledWith("pi_hole_v6", "disable", { entity_id: ["switch.one"], duration: "00:05:00" });
    expect(card.hass!.callService).toHaveBeenCalledWith("pi_hole", "disable", { entity_id: ["switch.two"], duration: "00:05:00" });
    vi.mocked(card.hass!.callService).mockClear();
    const select = card.shadowRoot!.querySelector<HTMLSelectElement>("select")!; select.value = "switch.two"; select.dispatchEvent(new Event("change"));
    await card.updateComplete;
    (card.shadowRoot!.querySelector(".duration") as HTMLButtonElement).click();
    expect(card.hass!.callService).toHaveBeenCalledOnce();
    expect(card.hass!.callService).toHaveBeenLastCalledWith("pi_hole", "disable", { entity_id: ["switch.two"], duration: "00:01:00" });
  });
  it("never substitutes permanent switch-off or a frontend timer for an unsupported pause", async () => {
    vi.useFakeTimers();
    const hass = makeHass(); hass.services = {};
    const card = await create({}, hass);
    expect((card.shadowRoot!.querySelector(".duration") as HTMLButtonElement).disabled).toBe(true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(hass.callService).not.toHaveBeenCalled();
  });
  it("supports custom pause action parameters and surfaces backend failures", async () => {
    const card = await create({ pihole_pause_service: "custom", pihole_duration_field: "pause_seconds", pihole_pause_action: { action: "perform-action", perform_action: "script.pause_dns", data: { reason: "Dashboard" } } });
    const action = vi.fn(); card.addEventListener("hass-action", action);
    (card.shadowRoot!.querySelector(".duration") as HTMLButtonElement).click();
    expect(action.mock.calls[0][0].detail.config.tap_action.data).toEqual({ reason: "Dashboard", pause_seconds: 60 });
    expect(card.hass!.callService).not.toHaveBeenCalled();
    card.config = { ...card.config!, pihole_pause_service: "auto" }; await card.updateComplete;
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.mocked(card.hass!.callService).mockRejectedValueOnce(new Error("DNS server unavailable"));
    (card.shadowRoot!.querySelector(".duration") as HTMLButtonElement).click();
    await Promise.resolve(); await card.updateComplete;
    expect(card.shadowRoot!.querySelector('[role="alert"]')!.textContent).toContain("DNS server unavailable");
  });
  it("opens metric details without duplicate card actions and honors hold/double-tap gestures", async () => {
    vi.useFakeTimers();
    const card = await create({ pihole_metric_double_tap_action: { action: "navigate", navigation_path: "/dns" }, pihole_metric_hold_action: { action: "more-info" } });
    const action = vi.fn(); card.addEventListener("hass-action", action);
    const metric = card.shadowRoot!.querySelector(".metric") as HTMLButtonElement;
    metric.dispatchEvent(new PointerEvent("pointerdown")); await vi.advanceTimersByTimeAsync(501);
    metric.dispatchEvent(new PointerEvent("pointerup")); metric.click();
    await vi.advanceTimersByTimeAsync(301);
    expect(action).toHaveBeenCalledOnce();
    expect(action.mock.calls[0][0].detail.action).toBe("hold");
    action.mockClear(); metric.click(); metric.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(301);
    expect(action).toHaveBeenCalledOnce();
    expect(action.mock.calls[0][0].detail.action).toBe("double_tap");
  });
  it("exposes graphical section ordering, mapping and pause options without YAML", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = makeHass(); editor.setConfig({ type, entity: "switch.one", pihole_pause_service: "custom", pihole_sections: ["statistics", "blocking"] });
    document.body.append(editor); await editor.updateComplete;
    const changed = vi.fn(); editor.addEventListener("config-changed", changed);
    editor.shadowRoot!.querySelector("ha-sortable")!.dispatchEvent(new CustomEvent("item-moved", { detail: { oldIndex: 0, newIndex: 1 }, bubbles: true }));
    expect(changed.mock.calls.at(-1)![0].detail.config.pihole_sections).toEqual(["blocking", "statistics"]);
    expect(editor.shadowRoot!.querySelector('[aria-label="DNS queries sensor override"]')).not.toBeNull();
    const forms = [...editor.shadowRoot!.querySelectorAll("ha-form")] as Array<HTMLElement & { schema: { name: string }[] }>;
    expect(forms.some(form => form.schema.some(field => field.name === "pihole_pause_action"))).toBe(true);
  });
  it.each(["mushroom-addition-upcoming-media-card", "mushroom-addition-remote-card", "mushroom-addition-pi-hole-card"])(
    "honors shared Mushroom name/info/icon presentation on %s", async tag => {
      const card = document.createElement(tag) as MushroomAdditionCard;
      card.hass = makeHass();
      card.setConfig({ type: `custom:${tag}`, entity: "switch.one", name: "My dashboard card" });
      document.body.append(card); await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".ulm-name")!.textContent).toBe("My dashboard card");
      card.setConfig({ type: `custom:${tag}`, entity: "switch.one", primary_info: "none", secondary_info: "none", icon_type: "none" });
      await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".ulm-name")).toBeNull();
      expect(card.shadowRoot!.querySelector(".ulm-icon")).toBeNull();
    },
  );
});
