import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parseAllDocuments } from "yaml";
import {
  publicItemForSource, SOURCE_ONLY_HELPERS, UPSTREAM_CATALOG,
  UPSTREAM_COMMIT, variantForSource,
} from "../src/catalog";

const upstreamRoot = resolve(process.argv[2] ?? ".tmp-ui-minimalist");
const check = process.argv.includes("--check");
if (!existsSync(upstreamRoot)) {
  throw new Error(`Upstream checkout not found at ${upstreamRoot}`);
}
const actualCommit = execFileSync("git", ["-C", upstreamRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
if (actualCommit !== UPSTREAM_COMMIT) {
  throw new Error(`Expected upstream ${UPSTREAM_COMMIT}, found ${actualCommit}.`);
}

const assertExactSet = (label: string, actual: string[], expected: string[]): void => {
  const missing = expected.filter((value) => !actual.includes(value));
  const unexpected = actual.filter((value) => !expected.includes(value));
  if (missing.length || unexpected.length) {
    throw new Error(`${label} mismatch. Missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}.`);
  }
};
const documentedPages = (directory: string): string[] => readdirSync(resolve(upstreamRoot, directory))
  .filter((name) => name.endsWith(".md") && name !== "._example.md")
  .map((name) => name.replace(/\.md$/, ""))
  .sort();
assertExactSet(
  "Documented default cards",
  documentedPages("docs/usage/cards"),
  UPSTREAM_CATALOG.filter((item) => item.category === "default-card").map((item) => item.upstreamId).sort(),
);
assertExactSet(
  "Documented default chips",
  documentedPages("docs/usage/chips"),
  UPSTREAM_CATALOG.filter((item) => item.category === "default-chip").map((item) => item.upstreamId).sort(),
);
assertExactSet(
  "Custom source directories",
  readdirSync(resolve(upstreamRoot, "custom_cards"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(),
  [
    ...UPSTREAM_CATALOG
      .filter((item) => item.category === "custom-card" || item.category === "custom-chip")
      .map((item) => item.upstreamId),
    ...SOURCE_ONLY_HELPERS
      .filter((item) => item.sourcePath.startsWith("custom_cards/"))
      .map((item) => item.id),
  ].sort(),
);

const filesUnder = (path: string): string[] => {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? filesUnder(child) : [child];
  });
};

const selectorFor = (name: string, value: string): string => {
  if (/^(true|false)$/i.test(value) || /_(enable|show|force|animation|active|compact|horizontal|popup|collapse|invert|idle|more_info)(_|$)/i.test(name)) return "boolean";
  if (/_icon(?:_name)?$/i.test(name)) return "icon";
  if (/_color(?:_[A-Za-z0-9]+)*$/i.test(name)) return "color";
  if (/(?:_action|_actions)$/i.test(name)) return "action";
  if (/_entities$/i.test(name)) return "entity-multiple";
  if (/_(?:entity|entity_id|entity\d+|sensor|sensor\d+|tracker|person|device|lock|cover|light|scene|script|vacuum|climate|weather)(?:_id)?$/i.test(name)) return "entity";
  if (/^-?\d+(\.\d+)?$/.test(value)) return "number";
  if (/^\[|^\{/.test(value) || value === "|" || value === ">") return "object";
  return "text";
};

const defaultValue = (value: unknown): string => {
  if (value === null) return "<null>";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
};

const collectVariables = (node: unknown, variables: Map<string, { name: string; defaultValue: string; selector: string }>): void => {
  if (Array.isArray(node)) {
    node.forEach((child) => collectVariables(child, variables));
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "variables" && value && typeof value === "object" && !Array.isArray(value)) {
      for (const [name, configuredDefault] of Object.entries(value)) {
        if (!name.startsWith("ulm_")) continue;
        const serialized = defaultValue(configuredDefault);
        variables.set(name, { name, defaultValue: serialized, selector: selectorFor(name, serialized) });
      }
    }
    collectVariables(value, variables);
  }
};

const entries = UPSTREAM_CATALOG.map((item) => {
  const publicItem = publicItemForSource(item.upstreamId);
  if (!publicItem) throw new Error(`${item.upstreamId}: missing public component mapping.`);
  const source = resolve(upstreamRoot, item.sourcePath);
  if (!existsSync(source)) throw new Error(`${item.upstreamId}: missing ${item.sourcePath}`);
  const files = filesUnder(source)
    .filter((file) => /\.(ya?ml|md)$/i.test(file))
    .sort((left, right) => relative(upstreamRoot, left).localeCompare(relative(upstreamRoot, right)));
  const yamlFiles = files.filter((file) => /\.ya?ml$/i.test(file));
  const sourceText = files.map((file) => `# ${relative(upstreamRoot, file).replaceAll("\\", "/")}\n${readFileSync(file, "utf8")}`).join("\n");
  const variables = new Map<string, { name: string; defaultValue: string; selector: string }>();
  for (const file of yamlFiles) {
    for (const document of parseAllDocuments(readFileSync(file, "utf8"))) {
      if (document.errors.length) {
        throw new Error(`${relative(upstreamRoot, file)}: ${document.errors.map((error) => error.message).join("; ")}`);
      }
      collectVariables(document.toJS(), variables);
    }
  }
  const dependencies = [...new Set([...sourceText.matchAll(/type:\s*["']?custom:([A-Za-z0-9_-]+)/g)].map((match) => match[1]))].sort();
  for (const match of sourceText.matchAll(/\bulm_[A-Za-z0-9_]+/g)) {
    if (!variables.has(match[0])) {
      variables.set(match[0], {
        name: match[0],
        defaultValue: "<documented/inherited>",
        selector: selectorFor(match[0], ""),
      });
    }
  }
  const actions = [...new Set([...sourceText.matchAll(/\b(tap_action|hold_action|double_tap_action):/g)].map((match) => match[1]))].sort();
  const customFields = [...new Set([...sourceText.matchAll(/^\s{4,}([A-Za-z][A-Za-z0-9_-]+):\s*$/gm)]
    .map((match) => match[1])
    .filter((name) => /^item\d+$|button|graph|label|state|icon|header|footer|picture|slider|controls|status/i.test(name)))].sort();
  const primitives = [
    dependencies.includes("button-card") ? "button-card" : undefined,
    /type:\s*(?:["']?)vertical-stack/.test(sourceText) ? "vertical-stack" : undefined,
    /type:\s*(?:["']?)horizontal-stack/.test(sourceText) ? "horizontal-stack" : undefined,
    /type:\s*(?:["']?)entities/.test(sourceText) ? "entities" : undefined,
    /type:\s*(?:["']?)(?:picture-elements|picture-entity|image)/.test(sourceText) ? "image" : undefined,
    dependencies.some((dependency) => /graph|chart|gauge|bar-card/.test(dependency)) ? "chart" : undefined,
    /popup|browser_mod/.test(sourceText) ? "popup" : undefined,
    /slider/.test(sourceText) ? "control" : undefined,
  ].filter((value): value is string => Boolean(value));
  if (!primitives.length) primitives.push(item.kind === "chip" ? "chip" : "native-card");
  const backendRequirements = [
    /history|statistics|mini-graph|apexcharts/.test(sourceText) ? "history/statistics" : undefined,
    /weather/.test(item.upstreamId) ? "weather entity/forecast API" : undefined,
    /camera/.test(item.upstreamId) ? "camera entity/stream API" : undefined,
    /media|chromecast|playstation/.test(item.upstreamId) ? "media entity/services" : undefined,
    /person|tracker|tracer/.test(item.upstreamId) ? "person/device-tracker entities" : undefined,
    /pollen|waste|afval/.test(item.upstreamId) ? "provider-specific sensor attributes" : undefined,
  ].filter((value): value is string => Boolean(value));
  const deviations = dependencies
    .filter((dependency) => dependency !== "button-card")
    .map((dependency) => `Upstream embeds custom:${dependency}; this plugin provides an original Lit equivalent without requiring that frontend dependency.`);
  if (backendRequirements.includes("history/statistics")) {
    deviations.push("Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable.");
  }
  return {
    upstreamId: item.upstreamId,
    sourcePath: item.sourcePath,
    publicId: publicItem.upstreamId,
    variant: variantForSource(item.upstreamId),
    rendererId: publicItem.upstreamId,
    layoutProfile: `${item.kind}:${primitives.join("+")}`,
    primitives,
    customFields,
    stateDriven: /\bstate:|entity\.state|states\[/.test(sourceText),
    animated: /\banimation:|\btransition:|@keyframes/.test(sourceText),
    actions,
    variables: [...variables.values()].sort((a, b) => a.name.localeCompare(b.name)),
    dependencies,
    backendRequirements,
    deviations,
    sourceDigest: createHash("sha256").update(sourceText).digest("hex"),
  };
});

const generated = `/* Generated by scripts/generate-parity.ts from UI-Lovelace-Minimalist ${UPSTREAM_COMMIT}. */\n` +
  `import type { ParityEntry } from "./types";\n\n` +
  `export const PARITY_ENTRIES: readonly ParityEntry[] = ${JSON.stringify(entries, null, 2)};\n\n` +
  `export const PARITY_BY_ID = new Map(PARITY_ENTRIES.map((entry) => [entry.upstreamId, entry]));\n`;

const rows = entries.map((entry) => {
  const variables = entry.variables.length
    ? entry.variables.map((variable) => `\`${variable.name}\` = \`${variable.defaultValue.replaceAll("|", "\\|")}\``).join("<br>")
    : "None";
  const behavior = [
    entry.stateDriven ? "state-driven" : "static",
    entry.animated ? "animated" : undefined,
    entry.actions.length ? `actions: ${entry.actions.join(", ")}` : undefined,
  ].filter(Boolean).join("; ");
  const deviations = entry.deviations.length ? entry.deviations.join("<br>") : "None";
  const mapping = entry.variant
    ? `\`${entry.publicId}\` → \`${entry.variant}\``
    : `\`${entry.publicId}\``;
  return `| \`${entry.upstreamId}\` | ${mapping} | \`${entry.layoutProfile}\` | ${entry.customFields.join(", ") || "single surface"} | ${behavior} | ${variables} | ${entry.backendRequirements.join(", ") || "entity state only"} | ${deviations} |`;
});
const matrix = `# Upstream parity matrix\n\n` +
  `Generated from UI-Lovelace-Minimalist commit \`${UPSTREAM_COMMIT}\`. Every public catalog entry has an explicit renderer ID, source digest, layout profile, editor-variable inventory, action inventory, and dependency deviation record.\n\n` +
  `## Property mapping\n\n` +
  `The primary Home Assistant entity maps to \`entity\`; standard Lovelace actions map to \`tap_action\`, \`hold_action\`, and \`double_tap_action\`. Legacy upstream keys are listed below only as a YAML compatibility reference. The graphical editor uses plain-language labels and exposes only options backed by implemented behavior. Popup and Browser Mod variables remain inventoried but are intentionally excluded in favor of regular Home Assistant/Mushroom-style actions. Common name/icon/color/layout/control variables are normalized into shared Lit primitives while original keys remain accepted when explicitly configured. Empty, false, and zero values are preserved rather than replaced with truthy defaults.\n\n` +
  `| Upstream item | Public component / variant | Renderer/layout | Sections | Behavior | Upstream variables and defaults | Backend requirements | Individually documented deviations |\n` +
  `|---|---|---|---|---|---|---|---|\n${rows.join("\n")}\n`;
const outputs = [
  [resolve("src/parity.generated.ts"), generated],
  [resolve("docs/PARITY_MATRIX.md"), matrix],
] as const;
if (check) {
  const stale = outputs.filter(([path, content]) => !existsSync(path) || readFileSync(path, "utf8") !== content);
  if (stale.length) {
    throw new Error(`Generated parity artifacts are stale: ${stale.map(([path]) => relative(resolve("."), path)).join(", ")}`);
  }
  console.log(`Parity source verified at ${UPSTREAM_COMMIT}: ${entries.length} entries.`);
} else {
  for (const [path, content] of outputs) writeFileSync(path, content);
  console.log(`Generated parity metadata for ${entries.length} upstream entries.`);
}
