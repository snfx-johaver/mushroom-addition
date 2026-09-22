import { CATALOG, PUBLIC_CATALOG, UPSTREAM_VARIANTS } from "../src/catalog";

const tags = new Set(CATALOG.map((item) => item.tag));
const upstreamIds = new Set(PUBLIC_CATALOG.map((item) => item.upstreamId));
const failures: string[] = [];

if (tags.size !== CATALOG.length) failures.push("Duplicate custom element tags found.");
if (upstreamIds.size !== PUBLIC_CATALOG.length) failures.push("Duplicate upstream IDs found.");
for (const item of PUBLIC_CATALOG) {
  if (!item.sourcePath) failures.push(`${item.upstreamId} has no upstream source path.`);
  if (!item.tag.startsWith("mushroom-addition-")) failures.push(`${item.tag} has an invalid namespace.`);
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

const totals = PUBLIC_CATALOG.reduce<Record<string, number>>((result, item) => {
  const key = item.upstreamId.startsWith("custom_") ? `custom ${item.kind}s` : `base ${item.kind}s`;
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});
console.log(`Catalog verified: ${PUBLIC_CATALOG.length} upstream components.`);
console.log(`Documented popup variants: ${UPSTREAM_VARIANTS.length}.`);
for (const [key, count] of Object.entries(totals)) console.log(`- ${key}: ${count}`);
