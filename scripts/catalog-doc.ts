import { readFileSync, writeFileSync } from "node:fs";
import {
  COMPONENT_GROUPS, CATALOG, PUBLIC_CATALOG, SOURCE_ONLY_HELPERS,
  UPSTREAM_CATALOG, UPSTREAM_COMMIT, UPSTREAM_VARIANTS,
} from "../src/catalog";

const upstreamUrl = `https://github.com/UI-Lovelace-Minimalist/UI/blob/${UPSTREAM_COMMIT}`;
const rows = PUBLIC_CATALOG.map((item) => {
  const variants = item.variants?.join(", ") ?? "default";
  const sources = (item.sourceIds ?? [item.upstreamId]).map((id) => `\`${id}\``).join("<br>");
  return `| \`${item.upstreamId}\` | ${item.category} | \`custom:${item.tag}\` | ${item.family} | ${variants} | ${sources} |`;
});
const popupRows = UPSTREAM_VARIANTS.map((item) =>
  `| \`${item.id}\` | \`${item.component}\` | Not exposed; use standard card actions | [source](${upstreamUrl}/${item.sourcePath}) |`);

const content = `# Catalog coverage

This manifest maps the UI-Lovelace-Minimalist catalog at commit
[\`${UPSTREAM_COMMIT}\`](https://github.com/UI-Lovelace-Minimalist/UI/commit/${UPSTREAM_COMMIT})
to Mushroom Cards Addition registrations. It is generated from
\`src/catalog.ts\`; CI rejects duplicate IDs, missing source paths, invalid
namespaces, or broken popup mappings.

**Coverage:** ${UPSTREAM_CATALOG.length} documented upstream sources map to
${PUBLIC_CATALOG.length} public components and one graphical chips container.
Equivalent aliases and size/layout alternatives are exposed as variants instead
of duplicate picker entries. ${UPSTREAM_VARIANTS.length} popup templates and
${SOURCE_ONLY_HELPERS.length} implementation helpers are inventoried but are not
public registrations.

| Public ID | Category | Addition type | Family | UI variants | Covered upstream sources |
|---|---|---|---|---|---|
${rows.join("\n")}

## Unified component mapping

| Public component | Upstream source → variant |
|---|---|
${COMPONENT_GROUPS.map((group) => `| \`${group.canonical}\` | ${Object.entries(group.sources).map(([source, variant]) => `\`${source}\` → \`${variant}\``).join("<br>")} |`).join("\n")}

Old custom-element tags for non-canonical sources remain registered as hidden
compatibility aliases. They normalize to the public component and variant but do
not appear in the card picker or example dashboard.

## Excluded popup templates

Popup templates depend on Browser Mod behavior and are not public card variants.
Standard Home Assistant actions are used instead.

| Upstream popup | Addition component | Public behavior | Upstream source |
|---|---|---|---|
${popupRows.join("\n")}

## Source-only helpers

${SOURCE_ONLY_HELPERS.map((helper) => `- \`${helper.id}\`: ${helper.reason} [source](${upstreamUrl}/${helper.sourcePath})`).join("\n")}

## Naming exception

- \`custom_card_speedtest_shogun160\` is the upstream source folder associated
  with the differently named custom template documentation; it remains covered
  under its source identity.
`;

const target = new URL("../docs/CATALOG.md", import.meta.url);
if (process.argv.includes("--check")) {
  const existing = readFileSync(target, "utf8").replace(/\r\n/g, "\n");
  if (existing !== content) {
    console.error("docs/CATALOG.md is out of date. Run npm run docs:catalog.");
    process.exit(1);
  }
} else {
  writeFileSync(target, content, "utf8");
  console.log(`Wrote ${CATALOG.length} catalog entries to docs/CATALOG.md.`);
}
