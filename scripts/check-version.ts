import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const readJson = (path: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8"));
const manifest = readJson("../package.json");
const lock = readJson("../package-lock.json");
const version: string = manifest.version;
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`);
}
if (lock.version !== version || lock.packages[""].version !== version) {
  throw new Error("package.json and package-lock.json versions must match. Run npm install --package-lock-only --ignore-scripts.");
}
const tag = process.argv[2];
if (tag !== undefined && tag !== `v${version}`) {
  throw new Error(`Release tag ${tag} does not match package version v${version}.`);
}
console.log(`Version verified: v${version}${tag ? ` (tag ${tag})` : ""}`);
