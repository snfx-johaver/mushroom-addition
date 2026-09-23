import { describe, expect, it } from "vitest";
import { UPSTREAM_CATALOG } from "../src/catalog";
import { VISUAL_AUDIT, visualAuditProgress } from "../src/visual-audit";

describe("visual audit manifest", () => {
  it("tracks every upstream card source exactly once", () => {
    expect(VISUAL_AUDIT).toHaveLength(UPSTREAM_CATALOG.length);
    expect(new Set(VISUAL_AUDIT.map((entry) => entry.sourceId))).toEqual(
      new Set(UPSTREAM_CATALOG.map((entry) => entry.upstreamId)),
    );
  });

  it("records the inspected Bar Card acceptance contract", () => {
    const bar = VISUAL_AUDIT.find((entry) => entry.sourceId === "custom_card_bar_card");
    expect(bar).toMatchObject({
      status: "accepted",
      pickerAccepted: true,
      editorAccepted: true,
      visualAccepted: true,
      statesAccepted: true,
      interactionsAccepted: true,
      liveAccepted: true,
      compositionId: "bar-card:compact-header-progress",
      artifactPath: "docs/assets/visual-audit/custom-card-bar-card-comparison.png",
      widths: [237],
      themes: ["dark"],
    });
    expect(bar?.requiredRegions).toContain("bar-card-track");
    expect(bar?.forbiddenRegions).toContain("sparkline");
  });

  it("reports exact accepted progress without inferring parity from family mappings", () => {
    expect(visualAuditProgress()).toEqual({
      accepted: 80,
      pickerAccepted: 80,
      editorAccepted: 80,
      visualAccepted: 80,
      statesAccepted: 80,
      interactionsAccepted: 80,
      liveAccepted: 80,
      total: 86,
    });

    expect(VISUAL_AUDIT.filter((entry) => entry.status === "accepted")).toHaveLength(80);
  });

  it("certifies all six stages for the power and printer custom batch", () => {
    for (const sourceId of [
      "custom_card_light_colorpick",
      "custom_card_media_player_sonos",
      "custom_card_more_power_outlet",
      "custom_card_mpse_gauge",
      "custom_card_mpse_printer",
      "custom_card_mpse_thermostat",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("records authenticated live acceptance for the speed, climate, and title batch", () => {
    for (const sourceId of [
      "custom_card_speedtest_shogun160",
      "custom_card_tpx01_aircondition",
      "custom_card_vncntdev_device_tracer",
      "custom_card_water_heater",
      "custom_card_wilbiev_subtitle",
      "custom_card_wilbiev_title",
    ]) {
      const entry = VISUAL_AUDIT.find((candidate) => candidate.sourceId === sourceId);
      expect(entry).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
      expect(entry?.reviewerNotes.join(" ")).toContain(
        "docs/assets/visual-audit/speed-climate-title-live-certification.json",
      );
    }
  });

  it("certifies all six stages for the six default rich sources", () => {
    for (const sourceId of [
      "card_generic",
      "card_generic_swap",
      "card_graph",
      "card_light",
      "card_media_player",
      "card_navigate",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
        fixturePath: "demo/default-rich-comparison.html",
        widths: [320],
      });
    }
  });

  it("certifies every local stage with authenticated live evidence for queued default batch one", () => {
    for (const sourceId of [
      "card_person",
      "card_power_outlet",
      "card_room",
      "card_scenes",
      "card_script",
      "card_thermostat",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies local stages for the six parent-approved priority visuals", () => {
    for (const sourceId of [
      "custom_card_heat_pump",
      "custom_card_homeassistant_updates",
      "custom_card_nik_nas",
      "custom_card_nik_tablet",
      "custom_card_person_info",
      "custom_card_person_info_small",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies all six stages for the first custom batch", () => {
    for (const sourceId of [
      "custom_card_afvalophaling",
      "custom_card_alarm_time",
      "custom_card_apexcharts",
      "custom_card_camera",
      "custom_card_chromecast",
      "custom_card_damix48_power_details",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies all six stages for the status and pollen batch", () => {
    for (const sourceId of [
      "custom_card_mpse_wifisignal",
      "custom_card_nas",
      "custom_card_neekster_update",
      "custom_card_nik_clock",
      "custom_card_nik_door",
      "custom_card_paddy_dwd_pollen",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies all six stages for the six requested source designs", () => {
    for (const sourceId of [
      "custom_card_device_tracker",
      "custom_card_drealine_roomview",
      "custom_card_eraycetinay_elapsed_time",
      "custom_card_eraycetinay_lock",
      "custom_card_esh_room",
      "custom_card_esh_welcome",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies all six stages for the person and input custom batch", () => {
    for (const sourceId of [
      "custom_card_imswel_person",
      "custom_card_input_datetime",
      "custom_card_input_number",
      "custom_card_irmajavi_entities",
      "custom_card_irmajavi_speedtest",
      "custom_card_irmajavi_weather",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
        fixturePath: "demo/custom-card-comparison.html",
        widths: [320],
      });
    }
  });

  it("certifies all six stages for the following custom batch with authenticated live evidence", () => {
    for (const sourceId of [
      "custom_card_bar_card",
      "custom_card_haven_washer",
      "custom_card_httpedo13_sun",
      "custom_card_httpedo13_thermostat",
      "custom_card_iAbadia_battery_chip",
      "custom_card_imswel_medias",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies all stages for the final pollen and lights sources", () => {
    expect(VISUAL_AUDIT.find((entry) => entry.sourceId === "custom_card_wsly_pollen")).toMatchObject({
      status: "accepted",
      pickerAccepted: true,
      editorAccepted: true,
      visualAccepted: true,
      statesAccepted: true,
      interactionsAccepted: true,
      liveAccepted: true,
      fixturePath: "demo/final-pollen-lights-comparison.html",
      artifactPath: "docs/assets/visual-audit/final-pollen-lights-comparison.png",
      widths: [368],
    });
    expect(VISUAL_AUDIT.find((entry) => entry.sourceId === "custom_card_yagrasdemonde_lights_count"))
      .toMatchObject({
        status: "accepted",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
        fixturePath: "demo/final-pollen-lights-comparison.html",
        artifactPath: "docs/assets/visual-audit/final-pollen-lights-comparison.png",
        widths: [486],
      });
  });
});
