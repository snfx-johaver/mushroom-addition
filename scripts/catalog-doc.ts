import { readFileSync, writeFileSync } from "node:fs";
import { CATALOG, PUBLIC_CATALOG, UPSTREAM_COMMIT, UPSTREAM_VARIANTS } from "../src/catalog";

const upstreamUrl = `https://github.com/UI-Lovelace-Minimalist/UI/blob/${UPSTREAM_COMMIT}`;
const rows = PUBLIC_CATALOG.map((item) => {
  const variants = item.variants?.join(", ") ?? "default";
  return `| \`${item.upstreamId}\` | ${item.kind} | \`custom:${item.tag}\` | ${item.family} | ${variants} | [source](${upstreamUrl}/${item.sourcePath}) |`;
});
const popupRows = UPSTREAM_VARIANTS.map((item) =>
  `| \`${item.id}\` | \`${item.component}\` | \`variant: popup\` | [source](${upstreamUrl}/${item.sourcePath}) |`);

const content = `# Catalog coverage

This manifest maps the UI-Lovelace-Minimalist catalog at commit
[\`${UPSTREAM_COMMIT}\`](https://github.com/UI-Lovelace-Minimalist/UI/commit/${UPSTREAM_COMMIT})
to Mushroom Cards Addition registrations. It is generated from
\`src/catalog.ts\`; CI rejects duplicate IDs, missing source paths, invalid
namespaces, or broken popup mappings.

**Coverage:** ${PUBLIC_CATALOG.length} directly registered upstream components,
${UPSTREAM_VARIANTS.length} documented popup variants, and one graphical chips
container. Internal composition templates, color primitives, authoring examples,
and legacy implementation helpers are not user-facing components and are not
registered.

| Upstream ID | Kind | Addition type | Family | UI variants | Upstream source |
|---|---|---|---|---|---|
${rows.join("\n")}

## Documented popup mapping

Minimalist popups are represented as graphical variants of their corresponding
card rather than standalone Lovelace card types.

| Upstream popup | Addition component | UI setting | Upstream source |
|---|---|---|---|
${popupRows.join("\n")}

## Source-only and naming exceptions

- \`chip_short_date_with_day\` and \`chip_weather_date\` exist in upstream source
  without matching usage pages; both are registered.
- \`custom_card_speedtest_shogun160\` is the upstream source folder associated
  with the differently named custom template documentation; it is registered
  under its source identity.
- \`card_generic_swap\`, \`card_binary_sensor_alert\`, and
  \`card_weather_ulm\` retain distinct registrations for migration clarity and
  are also exposed as variants on their canonical component.
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
