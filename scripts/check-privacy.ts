import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const patterns = [
  /\b192\.168\.\d{1,3}\.\d{1,3}\b/,
  /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
  /\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/,
  /https?:\/\/[a-z\d-]+\.ui\.nabu\.casa\b/i,
  /[A-Z]:[\\/]+Users[\\/]+(?!Public\b|Default\b)[^\\/\s"']+/i,
  /\/(?:home|Users)\/(?!runner\b|user\b|web_user\b)[^/\s"']+/,
];
export const privacyViolation = (file: string, text: string): boolean =>
  patterns.some(pattern => pattern.test(text)) || /^docs\/assets\/.*live-certification.*\.json$/i.test(file);

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
  const failures = files.filter(file => {
    const buffer = readFileSync(file);
    return !buffer.includes(0) && privacyViolation(file, buffer.toString("utf8"));
  });
  if (failures.length) {
    console.error(`Private deployment data or live audit exports detected in: ${failures.join(", ")}`);
    process.exitCode = 1;
  } else {
    console.info(`Privacy check passed: ${files.length} tracked files; no private deployment addresses, user paths or live audit exports.`);
  }
}
