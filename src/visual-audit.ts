import {
  publicItemForSource,
  UPSTREAM_CATALOG,
  variantForSource,
} from "./catalog";

export type VisualAuditStatus = "pending" | "accepted" | "deviation";

export interface VisualAuditEntry {
  sourceId: string;
  publicId: string;
  variant?: string;
  category: "default-card" | "custom-card";
  rendererId: string;
  compositionId: string;
  sourcePath: string;
  referenceScreenshot?: string;
  fixturePath: string;
  fixtureId: string;
  artifactPath?: string;
  themes: readonly ("light" | "dark")[];
  widths: readonly number[];
  requiredRegions: readonly string[];
  forbiddenRegions: readonly string[];
  status: VisualAuditStatus;
  pickerAccepted: boolean;
  editorAccepted: boolean;
  visualAccepted: boolean;
  statesAccepted: boolean;
  interactionsAccepted: boolean;
  liveAccepted: boolean;
  inspectedAt?: string;
  reviewerNotes: readonly string[];
  deviations: readonly string[];
}

export const VISUAL_AUDIT: readonly VisualAuditEntry[] = UPSTREAM_CATALOG.map((source) => {
  const item = publicItemForSource(source.upstreamId);
  if (!item) throw new Error(`${source.upstreamId} has no public card mapping.`);
  if (source.category !== "default-card" && source.category !== "custom-card") {
    throw new Error(`${source.upstreamId} is not a card source.`);
  }
  const variant = variantForSource(source.upstreamId);
  return {
    sourceId: source.upstreamId,
    publicId: item.upstreamId,
    variant,
    category: source.category,
    rendererId: item.upstreamId,
    compositionId: `${item.upstreamId}${variant ? `:${variant}` : ""}`,
    sourcePath: source.sourcePath,
    fixturePath: "demo/index.html",
    fixtureId: source.upstreamId,
    themes: ["light", "dark"],
    widths: [320, 430],
    requiredRegions: [],
    forbiddenRegions: [],
    status: "pending",
    pickerAccepted: false,
    editorAccepted: false,
    visualAccepted: false,
    statesAccepted: false,
    interactionsAccepted: false,
    liveAccepted: false,
    reviewerNotes: [
      "Historical attributed audit metadata was removed; this canonical card requires fresh certification.",
    ],
    deviations: [],
  };
});

export const visualAuditProgress = (): {
  accepted: number;
  pickerAccepted: number;
  editorAccepted: number;
  visualAccepted: number;
  statesAccepted: number;
  interactionsAccepted: number;
  liveAccepted: number;
  total: number;
} => ({
  accepted: VISUAL_AUDIT.filter((entry) =>
    entry.status === "accepted" &&
    entry.pickerAccepted &&
    entry.editorAccepted &&
    entry.visualAccepted &&
    entry.statesAccepted &&
    entry.interactionsAccepted &&
    entry.liveAccepted).length,
  pickerAccepted: VISUAL_AUDIT.filter((entry) => entry.pickerAccepted).length,
  editorAccepted: VISUAL_AUDIT.filter((entry) => entry.editorAccepted).length,
  visualAccepted: VISUAL_AUDIT.filter((entry) => entry.visualAccepted).length,
  statesAccepted: VISUAL_AUDIT.filter((entry) => entry.statesAccepted).length,
  interactionsAccepted: VISUAL_AUDIT.filter((entry) => entry.interactionsAccepted).length,
  liveAccepted: VISUAL_AUDIT.filter((entry) => entry.liveAccepted).length,
  total: VISUAL_AUDIT.length,
});
