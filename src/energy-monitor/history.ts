import type { HomeAssistant } from "../types";
import { historyRows } from "./data";

export interface HistorySnapshot { hass: HomeAssistant; response: unknown; end: number; start: number; }
export class MonitorHistory {
  public snapshot?: HistorySnapshot;
  public error?: string;
  public loading = false;
  private generation = 0;
  private key = "";
  private requested = 0;
  private cancel?: () => void;
  public constructor(private readonly changed: () => void) {}
  public clear(): void {
    this.generation++;
    this.cancel?.();
    this.cancel = undefined;
    this.key = ""; this.requested = 0;
    this.loading = false; this.snapshot = undefined; this.error = undefined;
  }
  public async load(hass: HomeAssistant, ids: string[], start: number, end: number, key: string): Promise<void> {
    const signature = JSON.stringify([key, ids, start]);
    if (this.key === signature && (this.loading || end >= this.requested && end - this.requested < 15 * 60000)) return;
    this.clear();
    this.key = signature; this.requested = end;
    const generation = this.generation;
    if (!ids.length) { this.error = "Source missing"; this.changed(); return; }
    if (ids.length > 8) { this.error = "Too many Recorder history entities"; this.changed(); return; }
    this.loading = true; this.changed();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const message = { type: "history/history_during_period",
        start_time: new Date(start - 3600000).toISOString(), end_time: new Date(end).toISOString(),
        entity_ids: ids, minimal_response: false, no_attributes: false, significant_changes_only: false };
      const request = hass.callWS ? hass.callWS<unknown>(message) : hass.connection?.sendMessagePromise<unknown>(message);
      if (!request) throw new Error("Recorder history connection is unavailable");
      const response = await Promise.race([request, new Promise<never>((_, reject) => {
        this.cancel = () => reject(new Error("Recorder history request superseded"));
        timer = setTimeout(() => reject(new Error("Recorder history request timed out after 30 seconds")), 30000);
      })]);
      for (const id of ids) historyRows(response, id);
      if (generation === this.generation) this.snapshot = { hass, response, end, start };
    } catch (error) {
      if (generation !== this.generation) return;
      this.error = error instanceof Error ? error.message : String(error);
      console.warn("Mushroom Addition energy history:", error);
    } finally {
      clearTimeout(timer);
      if (generation === this.generation) { this.loading = false; this.cancel = undefined; this.changed(); }
    }
  }
}
