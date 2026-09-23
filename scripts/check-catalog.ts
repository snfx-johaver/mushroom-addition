import {
  CATALOG, LEGACY_ALIASES, publicItemForSource, PUBLIC_CATALOG,
  SOURCE_ONLY_HELPERS, UPSTREAM_CATALOG, UPSTREAM_VARIANTS,
} from "../src/catalog";

const tags = new Set(CATALOG.map((item) => item.tag));
const upstreamIds = new Set(PUBLIC_CATALOG.map((item) => item.upstreamId));
const sourceIds = new Set(UPSTREAM_CATALOG.map((item) => item.upstreamId));
const failures: string[] = [];

if (tags.size !== CATALOG.length) failures.push("Duplicate custom element tags found.");
if (upstreamIds.size !== PUBLIC_CATALOG.length) failures.push("Duplicate upstream IDs found.");
if (sourceIds.size !== UPSTREAM_CATALOG.length) failures.push("Duplicate source IDs found.");
for (const item of PUBLIC_CATALOG) {
  if (!item.sourcePath) failures.push(`${item.upstreamId} has no upstream source path.`);
  if (!item.tag.startsWith("mushroom-addition-")) failures.push(`${item.tag} has an invalid namespace.`);
}
for (const source of UPSTREAM_CATALOG) {
  if (!publicItemForSource(source.upstreamId)) failures.push(`${source.upstreamId} has no public component mapping.`);
}
for (const helper of SOURCE_ONLY_HELPERS) {
  if (sourceIds.has(helper.id) || upstreamIds.has(helper.id)) failures.push(`${helper.id} must remain source-only.`);
}
for (const alias of LEGACY_ALIASES) {
  if (!sourceIds.has(alias.upstreamId) || !upstreamIds.has(alias.targetId)) {
    failures.push(`${alias.upstreamId} has an invalid compatibility alias.`);
  }
}
for (const variant of UPSTREAM_VARIANTS) {
  if (!variant.sourcePath || !upstreamIds.has(variant.component)) {
    failures.push(`${variant.id} is not mapped to a valid component.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const sourceTotals = UPSTREAM_CATALOG.reduce<Record<string, number>>((result, item) => {
  const key = item.category ?? "unknown";
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});
const expectedSourceTotals = {
  "default-card": 24,
  "custom-card": 62,
};
for (const [category, expected] of Object.entries(expectedSourceTotals)) {
  if (sourceTotals[category] !== expected) {
    failures.push(`${category}: expected ${expected} documented sources, found ${sourceTotals[category] ?? 0}.`);
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const publicTotals = PUBLIC_CATALOG.reduce<Record<string, number>>((result, item) => {
  const key = item.category ?? "unknown";
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});
console.log(`Catalog verified: ${UPSTREAM_CATALOG.length} documented sources map to ${PUBLIC_CATALOG.length} public components.`);
console.log(`Inventoried popup templates intentionally excluded from the UI: ${UPSTREAM_VARIANTS.length}.`);
for (const [key, count] of Object.entries(sourceTotals)) {
  console.log(`- ${key}: ${count} sources -> ${publicTotals[key] ?? 0} public components`);
}
