import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { VISUAL_AUDIT, visualAuditProgress } from "../src/visual-audit";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "docs", "VISUAL_AUDIT.md");
const check = process.argv.includes("--check");
const failures: string[] = [];
const sourceIds = new Set<string>();

for (const entry of VISUAL_AUDIT) {
  if (sourceIds.has(entry.sourceId)) failures.push(`${entry.sourceId}: duplicate audit entry.`);
  sourceIds.add(entry.sourceId);
  if (!entry.publicId || !entry.rendererId || !entry.compositionId) {
    failures.push(`${entry.sourceId}: incomplete renderer/composition mapping.`);
  }
  if (entry.visualAccepted || entry.interactionsAccepted || entry.liveAccepted) {
    if (!entry.referenceScreenshot) failures.push(`${entry.sourceId}: accepted without a reference screenshot.`);
    if (!entry.artifactPath) failures.push(`${entry.sourceId}: accepted without a comparison artifact.`);
    if (!entry.requiredRegions.length) failures.push(`${entry.sourceId}: accepted without structural regions.`);
    if (entry.artifactPath && !existsSync(resolve(root, entry.artifactPath))) {
      failures.push(`${entry.sourceId}: comparison artifact does not exist at ${entry.artifactPath}.`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const progress = visualAuditProgress();
const rows = VISUAL_AUDIT.map((entry) => {
  const reference = entry.referenceScreenshot
    ? `\`${entry.referenceScreenshot}\``
    : `Source: \`${entry.sourcePath}\``;
  const artifact = entry.artifactPath ? `[\`artifact\`](../${entry.artifactPath})` : "—";
  const notes = entry.reviewerNotes.length ? entry.reviewerNotes.join("<br>") : "—";
  const deviations = entry.deviations.length ? entry.deviations.join("<br>") : "—";
  return `| \`${entry.sourceId}\` | ${entry.category} | \`${entry.publicId}\` | ${entry.variant ?? "—"} | \`${entry.compositionId}\` | ${reference} | ${artifact} | ${entry.pickerAccepted ? "Yes" : "No"} | ${entry.editorAccepted ? "Yes" : "No"} | ${entry.visualAccepted ? "Yes" : "No"} | ${entry.statesAccepted ? "Yes" : "No"} | ${entry.interactionsAccepted ? "Yes" : "No"} | ${entry.liveAccepted ? "Yes" : "No"} | ${notes} | ${deviations} |`;
}).join("\n");

const markdown = `# Visual and interaction audit index

This is the source-by-source acceptance ledger for the card-only
UI-Lovelace-Minimalist catalog pinned at
\`f8a9cb67a53f91367f1dffe18516aa983b463cb5\`.

**Progress: ${progress.accepted}/${progress.total} fully E2E accepted. Stage totals — picker ${progress.pickerAccepted}, editor ${progress.editorAccepted}, visual ${progress.visualAccepted}, states ${progress.statesAccepted}, interactions ${progress.interactionsAccepted}, live ${progress.liveAccepted}.**

An entry is fully accepted only when all six independent stages pass: picker,
graphical editor, visual parity, state behavior, interactions, and live Home
Assistant E2E. \`visualAccepted\` requires manual inspection of the upstream
source and a focused side-by-side artifact at the recorded theme and width.
\`interactionsAccepted\` requires enumerating every visible source interaction
and exercising it through click tests with exact Home Assistant payload
assertions. \`liveAccepted\` requires authenticated testing on the user's Home
Assistant instance. Batch-generated comparisons, family assignment, source
metadata, and structural tests do not constitute acceptance.

| Source | Category | Public card | Variant | Composition | Reference | Comparison | Picker | Editor | Visual | States | Interactions | Live | Reviewer notes | Exact deviations |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
${rows}
`;

if (check) {
  if (!existsSync(output) || readFileSync(output, "utf8") !== markdown) {
    console.error("docs/VISUAL_AUDIT.md is stale. Run npm run docs:visual-audit.");
    process.exit(1);
  }
} else {
  writeFileSync(output, markdown);
  console.log(`Wrote audit index: ${progress.accepted}/${progress.total} fully accepted.`);
}
