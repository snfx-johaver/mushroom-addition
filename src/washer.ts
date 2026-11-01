import type { HassEntity, HomeAssistant } from "./types";

const washerFields = [
  { key: "program_stage_entity", domains: ["sensor", "select"], pattern: /program_stage|job_state|operation_state|machine_state|current_phase|program_phase/ },
  { key: "washer_power_entity", domains: ["sensor", "switch"], pattern: /power|consumption/, deviceClass: "power" },
  { key: "program_select_entity", domains: ["select", "input_select"], pattern: /selected_program|active_program|program/ },
  { key: "power_switch_entity", domains: ["switch", "input_boolean"], pattern: /power/ },
  { key: "door_entity", domains: ["sensor", "binary_sensor"], pattern: /door/ },
  { key: "finished_entity", domains: ["sensor", "binary_sensor"], pattern: /finished|job_complete|program_complete|cycle_complete/ },
  { key: "ulm_custom_card_washer_remote_control", domains: ["sensor", "binary_sensor"], pattern: /remote_control|remote_start/ },
  { key: "ulm_custom_card_washer_job_progress", domains: ["sensor"], pattern: /job_progress|program_progress|cycle_progress|progress/ },
  { key: "ulm_custom_card_washer_delayed_start", domains: ["input_boolean"], pattern: /delayed_start|delay_start/ },
  { key: "ulm_custom_card_washer_delayed_starttime", domains: ["input_datetime"], pattern: /delayed_start|delay_start/ },
] as const;

export const discoverWasherEntities = (
  hass: HomeAssistant | undefined,
  primary: string,
): Record<string, string> => {
  const device = hass?.entities?.[primary]?.device_id;
  if (!hass || !device) return {};
  const candidates = Object.entries(hass.entities ?? {}).filter(([id, entry]) =>
    entry.device_id === device && hass.states[id] &&
    !["unknown", "unavailable"].includes(hass.states[id].state));
  const result: Record<string, string> = {};
  for (const field of washerFields) {
    const matches = candidates.flatMap(([id, entry]) => {
      if (!(field.domains as readonly string[]).includes(id.split(".")[0])) return [];
      const identity = [entry.translation_key, entry.original_name, id, hass.states[id].attributes.friendly_name]
        .filter(Boolean).join(" ").toLowerCase().replace(/[ .-]/g, "_");
      const score = "deviceClass" in field && hass.states[id].attributes.device_class === field.deviceClass
        ? 4 : field.key === "program_select_entity" && /selected_program/.test(identity)
          ? 3 : field.key === "ulm_custom_card_washer_remote_control" && /remote_control/.test(identity)
            ? 2 : field.pattern.test(identity)
              ? field.key === "washer_power_entity" && id.startsWith("sensor.") ? 2 : 1
              : 0;
      return score ? [{ id, score }] : [];
    }).sort((a, b) => b.score - a.score);
    // Ambiguous matches require the user's choice rather than an arbitrary entity.
    if (matches[0] && matches[0].score !== matches[1]?.score) result[field.key] = matches[0].id;
  }
  return result;
};

export const washerProgramLabel = (
  hass: HomeAssistant | undefined,
  entity: HassEntity,
  option: string,
): string => {
  const formatted = hass?.formatEntityState?.({ ...entity, state: option });
  if (formatted && formatted !== option) return formatted;
  const readable = option.replace(/^.*(?:_program_|\.Program\.)/i, "").replace(/[_.]+/g, " ");
  return readable.charAt(0).toUpperCase() + readable.slice(1);
};
