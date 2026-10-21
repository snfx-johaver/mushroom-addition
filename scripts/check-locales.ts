import { translationCoverage } from "../src/translation-coverage";

const reportOnly = process.argv.includes("--report");
const showMissing = process.argv.includes("--missing");
const coverage = translationCoverage();
for (const { locale, total, translated, missing, invalid, unchanged } of coverage) {
  console.log(`${locale}: ${translated}/${total} keys (${(100 * translated / total).toFixed(1)}%); ${missing.length} missing; ${invalid.length} invalid placeholders/keys; ${unchanged.length} identical to English`);
  if (invalid.length) console.error(`${locale}: ${invalid.join(", ")}`);
  if (showMissing && missing.length) console.log(`${locale} missing: ${missing.join(", ")}`);
}
const missingCount = coverage.reduce((total, item) => total + item.missing.length, 0);
const invalidCount = coverage.reduce((total, item) => total + item.invalid.length, 0);
if (missingCount) console.error(`INCOMPLETE localization: ${missingCount} missing locale/key pairs. English fallback is NOT counted as a translation.`);
if (invalidCount || (!reportOnly && missingCount)) process.exitCode = 1;
