import { publicItemForSource, UPSTREAM_CATALOG } from "../src/catalog";
import { upstreamEditorSchemaFor } from "../src/editor-schema";
import { PARITY_BY_ID, PARITY_ENTRIES } from "../src/parity.generated";
import { supportedUpstreamOption } from "../src/supported-options";

const failures: string[] = [];
if (PARITY_ENTRIES.length !== UPSTREAM_CATALOG.length) {
  failures.push(`Parity entry count ${PARITY_ENTRIES.length} does not match upstream source catalog ${UPSTREAM_CATALOG.length}.`);
}
for (const source of UPSTREAM_CATALOG) {
  const parity = PARITY_BY_ID.get(source.upstreamId);
  const item = publicItemForSource(source.upstreamId);
  if (!parity) {
    failures.push(`${source.upstreamId}: missing parity metadata.`);
    continue;
  }
  if (!item) {
    failures.push(`${source.upstreamId}: missing public mapping.`);
    continue;
  }
  if (parity.rendererId !== item.upstreamId) failures.push(`${source.upstreamId}: renderer mapping is not explicit.`);
  const fields = new Set(upstreamEditorSchemaFor(item).map((field) => field.name));
  for (const variable of parity.variables) {
    if (supportedUpstreamOption(item, variable.name) && !fields.has(variable.name)) {
      failures.push(`${source.upstreamId}: implemented option ${variable.name} is not exposed by the editor.`);
    }
  }
  const external = parity.dependencies.filter((dependency) => dependency !== "button-card");
  if (parity.deviations.length < external.length) failures.push(`${source.upstreamId}: dependency deviations are incomplete.`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Parity verified: ${PARITY_ENTRIES.length} entries and ${PARITY_ENTRIES.reduce((total, entry) => total + entry.variables.length, 0)} upstream variables.`);
