import { html, nothing, type TemplateResult } from "lit";
import { nasSource, SERVER_CARD_TAG, SERVER_EDITOR_TAG } from "./config";
import { BaseSynologyCard } from "./dashboard-cards-base";
import { SynologyServerCardEditor } from "./dashboard-cards-editor";
import { bytes, formatBytes, formatRate, formatValue, percentage, safeUrl, storageSummary, usable, volumeData } from "./data";
import type { HassEntity } from "./ha-types";
import { mdiServer } from "./icons";
import { registerDashboardCard } from "./register-dashboard-card";
import { localizeText } from "../localize";
import { nasHelp } from "../translations/nas-guidance";
import type { HomeAssistant } from "./ha-types";

export function formatUptime(entity?: HassEntity, hass?: Pick<HomeAssistant, "language">): string {
  if (!usable(entity)) return localizeText(hass, "Unavailable");
  const value = entity!.state.trim();
  const durations: Record<string, number> = { ms: .001, s: 1, min: 60, h: 3600, d: 86400 };
  const unit = entity!.attributes.unit_of_measurement;
  const multiplier = unit === undefined ? 1 : typeof unit === "string" ? durations[unit] : undefined;
  const seconds = /^\d+(\.\d+)?$/.test(value)
    ? multiplier === undefined ? NaN : Number(value) * multiplier : (Date.now() - Date.parse(value)) / 1000;
  if (!Number.isFinite(seconds) || seconds < 0) return localizeText(hass, "Unavailable");
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds % 86400 / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const duration = (value: number, unit: "day" | "hour" | "minute") => new Intl.NumberFormat(hass?.language || "en",
    { style: "unit", unit, unitDisplay: "narrow" }).format(value);
  return days ? `${duration(days, "day")} ${duration(hours, "hour")}` : hours ? `${duration(hours, "hour")} ${duration(minutes, "minute")}` : duration(minutes, "minute");
}

export class SynologyServerCard extends BaseSynologyCard {
  static override editorTag = SERVER_EDITOR_TAG;

  private ring(label: string, value: number | undefined, subtext: string, entity?: HassEntity, decimals = 0): TemplateResult {
    return html`<div class="ring-card" role=${entity ? "button" : "none"} tabindex=${entity ? "0" : "-1"}
      @click=${() => entity && this.openMoreInfo(entity.entity_id)}
      @keydown=${(event: KeyboardEvent) => {
        if (entity && ["Enter", " "].includes(event.key)) { event.preventDefault(); this.openMoreInfo(entity.entity_id); }
      }}>
      <div class="ring-gauge" style="--pct: ${value ?? 0}; --ring-color: ${value === undefined ? "var(--synology-border)" : value > 85 ? "var(--synology-warning)" : "var(--synology-accent)"}">
        <span class="ring-content">${value === undefined ? "--" : `${value.toFixed(decimals)}%`}</span>
      </div><span class="ring-label">${this.t(label)}</span><span class="ring-subtext">${subtext}</span>
    </div>`;
  }
  private detail(label: string, value: string, entity?: HassEntity): TemplateResult {
    return html`<div class="detail-item" role=${entity ? "button" : "none"} tabindex=${entity ? "0" : "-1"}
      @click=${() => entity && this.openMoreInfo(entity.entity_id)}
      @keydown=${(event: KeyboardEvent) => {
        if (entity && ["Enter", " "].includes(event.key)) { event.preventDefault(); this.openMoreInfo(entity.entity_id); }
      }}><span class="detail-label">${this.t(label)}</span><span class="detail-val">${value}</span></div>`;
  }
  protected override render(): TemplateResult {
    const source = nasSource(this.config);
    const synology = source === "synology_dsm";
    const manual = source === "manual";
    const device = this.getActiveDevice();
    const show = (key: string, entity?: HassEntity) => synology || !!entity || !!this.config.entities?.[key];
    const percent = (entity?: HassEntity, decimals = 0) => manual && entity?.attributes.unit_of_measurement !== "%"
      ? undefined : percentage(entity, decimals);
    const cpu = this.getEntity("cpu_usage", "sensor");
    const ram = this.getEntity("ram_usage", "sensor");
    const temperature = this.getEntity("system_temperature", "sensor");
    const uptime = this.getEntity("uptime", "sensor");
    const security = this.getEntity("security_status", "binary_sensor");
    const status = this.getEntity("system_status", "sensor");
    const model = this.getEntity("model", "sensor");
    const version = this.getEntity("software_version", "sensor");
    const totalMemory = this.getEntity("memory_total_real", "sensor");
    const freeMemory = this.getEntity("memory_available_real", "sensor");
    const usedMemory = this.getEntity("memory_used", "sensor");
    const rx = this.getEntity("network_rx");
    const tx = this.getEntity("network_tx");
    const totalBytes = bytes(totalMemory);
    const freeBytes = bytes(freeMemory);
    const usedBytes = usedMemory || this.config.entities?.memory_used ? bytes(usedMemory)
      : totalBytes !== undefined && freeBytes !== undefined ? Math.max(0, totalBytes - freeBytes) : undefined;
    const memoryConfigured = show("ram_usage", ram) || ["memory_total_real", "memory_available_real", "memory_used"]
      .some((key) => this.config.entities?.[key]);
    const memoryPct = manual && !this.config.entities?.ram_usage && totalBytes !== undefined && totalBytes > 0 && usedBytes !== undefined
      ? Math.round(Math.max(0, Math.min(100, usedBytes / totalBytes * 100))) : percent(ram);
    const memoryText = totalBytes !== undefined && usedBytes !== undefined ? `${formatBytes(usedBytes, "GB", this.hass)} / ${formatBytes(totalBytes, "GB", this.hass)}`
      : synology ? this.t(nasHelp.capacity)
      : [totalBytes !== undefined ? `${this.t("Total")}: ${formatBytes(totalBytes, "GB", this.hass)}` : "", freeBytes !== undefined ? `${this.t("Free")}: ${formatBytes(freeBytes, "GB", this.hass)}` : "",
        usedBytes !== undefined ? `${this.t("Used")}: ${formatBytes(usedBytes, "GB", this.hass)}` : ""].filter(Boolean).join(" • ");
    const storage = storageSummary(this.hass, this.config, this.registries);
    const storageEntity = this.getEntity("storage_usage", "sensor");
    const storagePct = storageEntity || this.config.entities?.storage_usage ? percent(storageEntity) : storage.percent;
    const health = this.t(!usable(security) ? "Unavailable" : security!.state === "off" ? "Safe" : "Attention needed");
    const managementUrl = safeUrl(this.config.management_url || device?.configuration_url);
    const modelName = this.config.entities?.model ? this.stateText(model) : device?.model;
    const softwareVersion = this.config.entities?.software_version ? this.stateText(version) : device?.sw_version;
    const reading = (entity?: HassEntity) => formatValue(entity, this.hass);
    const hasStorage = synology || !!storageEntity || !!this.config.entities?.storage_usage ||
      volumeData(this.hass, this.config, this.registries).some((volume) => volume.total || volume.used) ||
      (manual && this.config.volumes?.some((volume) => volume.total_entity || volume.used_entity));
    return html`<ha-card>
      ${this.renderHeader(this.config.title || this.config.name || device?.name_by_user || device?.name || (synology ? "Synology NAS" : source === "qnap" ? "QNAP NAS" : "NAS"),
        [modelName || (synology ? "DSM" : source === "qnap" ? "QNAP" : this.t("Manual")), show("uptime", uptime) ? `${this.t("Uptime")}: ${formatUptime(uptime, this.hass)}` : ""].filter(Boolean).join(" • "), mdiServer,
        synology ? html`<span class="badge ${!usable(security) ? "badge-standby" : security!.state === "off" ? "badge-online" : "badge-warning"}">${this.t("Security")}: ${health}</span>`
          : show("system_status", status) ? html`<span class="badge badge-standby">${this.t("Status")}: ${this.stateText(status)}</span>` : undefined)}
      ${this.renderErrors()}
      ${!manual && !device ? this.renderNotice(this.t(nasHelp.discovery)) : nothing}
      ${manual && !Object.values(this.config.entities ?? {}).some(Boolean) ? this.renderNotice(`${this.t("Entity mappings")}: ${this.t(nasHelp.mappings)}`) : nothing}
      <div class="rings-grid">
        ${show("cpu_usage", cpu) ? this.ring("CPU usage", percent(cpu, 2), show("system_temperature", temperature) ? `${this.t("System")}: ${reading(temperature)}` : "", cpu, 2) : nothing}
        ${memoryConfigured ? this.ring("Memory", memoryPct, memoryText, ram ?? usedMemory ?? totalMemory ?? freeMemory) : nothing}
        ${hasStorage ? this.ring("Storage", storagePct, storage.total !== undefined ? `${formatBytes(storage.used, "GB", this.hass)} / ${formatBytes(storage.total, "GB", this.hass)}` : synology ? this.t(nasHelp.capacity) : "", storageEntity) : nothing}
      </div>
      ${this.config.show_system_info !== false ? html`<div class="divider"></div><div class="detail-grid">
        ${synology || modelName || this.config.entities?.model ? this.detail("Model", modelName || this.t("Unavailable"), model) : nothing}
        ${synology || softwareVersion || this.config.entities?.software_version ? this.detail("Firmware version", softwareVersion || this.t("Unavailable"), version) : nothing}
        ${show("uptime", uptime) ? this.detail("Uptime", formatUptime(uptime, this.hass), uptime) : nothing}
        ${show("system_temperature", temperature) ? this.detail("Temperature", reading(temperature), temperature) : nothing}
        ${show("network_rx", rx) ? this.detail("Download", formatRate(rx, this.hass), rx) : nothing}
        ${show("network_tx", tx) ? this.detail("Upload", formatRate(tx, this.hass), tx) : nothing}
        ${synology ? this.detail("Security", health, security) : show("system_status", status) ? this.detail("Status", this.stateText(status), status) : nothing}
        ${managementUrl ? html`<div class="detail-item"><span class="detail-label">${this.t("NAS management")}</span><a class="detail-val" href=${managementUrl} target="_blank" rel="noreferrer" style="color:var(--synology-accent)">${this.t("Open NAS")}</a></div>` : nothing}
      </div>` : nothing}
    </ha-card>`;
  }
}

registerDashboardCard({
  tag: SERVER_CARD_TAG, editorTag: SERVER_EDITOR_TAG, card: SynologyServerCard, editor: SynologyServerCardEditor,
  name: "NAS Server Overview Card", description: "Synology DSM, QNAP or manually mapped CPU, memory, storage and system readings.",
});
