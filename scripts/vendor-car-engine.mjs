import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import process from "node:process";

async function getAsset(url, sha256, localPath) {
  const input = localPath
    ? await readFile(localPath)
    : Buffer.from(await (async () => {
        const response = await globalThis.fetch(url);
        if (!response.ok) throw new Error(`Download failed: ${response.status} ${url}`);
        return response.arrayBuffer();
      })());
  if (createHash("sha256").update(input).digest("hex") !== sha256) {
    throw new Error(`Unexpected SHA-256: ${url}`);
  }
  return input.toString("utf8");
}

let source = await getAsset(
  "https://github.com/ngocjohn/vehicle-status-card/releases/download/v1.26.1/vehicle-status-card.js",
  "58a1607ab3708a346f29d21ec821b0433e38039a7244e8ec18753c7766387547",
  process.argv[2],
);
let mapSource = await getAsset(
  "https://cdn.jsdelivr.net/npm/extra-map-card@1.8.0/dist/extra-map-card-bundle.js",
  "659edd1de372f0d5c2445adfeb46359439b6d38211d7b2f606093d7b3f4cd962",
  process.argv[3],
);
let rtlSource = await getAsset(
  "https://cdn.maptiler.com/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.min.js",
  "142f4fc31b4911887bacfea4df1813df67be28dfcb4c56e3f8f576f2e6fdf5d2",
  process.argv[4],
);
function replaceOnce(from, to) {
  const first = source.indexOf(from);
  if (first < 0 || source.indexOf(from, first + from.length) !== -1) {
    throw new Error(`Expected exactly one occurrence: ${from.slice(0, 100)}`);
  }
  source = source.slice(0, first) + to + source.slice(first + from.length);
}
function replaceAllChecked(from, to, expected) {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`Unexpected count for ${from}: ${count}`);
  source = source.replaceAll(from, to);
}

const bannerStart = source.indexOf("console.groupCollapsed(");
const bannerEnd = source.indexOf("console.groupEnd(),", bannerStart);
if (bannerStart < 0 || bannerEnd < 0) throw new Error("Upstream banner not found");
source = source.slice(0, bannerStart) + source.slice(bannerEnd + "console.groupEnd(),".length);

replaceOnce('en="vehicle-status-card"', 'en="addition-car-engine"');
replaceOnce('document.createElement("vehicle-status-card-editor")', 'document.createElement("addition-car-engine-editor")');
replaceOnce('home-assistant$hui-dialog-edit-card$vehicle-status-card', 'home-assistant$hui-dialog-edit-card$addition-car-engine');
replaceOnce(
  'window.customCards=window.customCards||[],window.customCards.push({type:"vehicle-status-card",name:"Vehicle Status Card",description:"A custom card to track vehicle status",preview:!0,documentationURL:"https://github.com/ngocjohn/vehicle-status-card?tab=readme-ov-file#configuration"}),Gc().catch(console.error)',
  "void 0",
);
replaceAllChecked('"Vehicle Status Card"', '"Car Advanced"', 2);
replaceOnce('"VSC Image Upload"', '"Car image upload"');
replaceOnce(
  'new KeyboardEvent("keydown",{key:"e",code:"KeyE",keyCode:69,charCode:69,bubbles:!0,cancelable:!0});document.dispatchEvent(e)',
  'new KeyboardEvent("keydown",{key:"e",code:"KeyE",keyCode:69,charCode:69,bubbles:!0,cancelable:!0});document.body.dispatchEvent(e)',
);
replaceOnce('type:"custom:extra-map-card"', 'type:"custom:addition-car-extra-map-card"');
replaceOnce('const i="extra-map-card";if(customElements.get(i))', 'initializePrivateMap();const i="addition-car-extra-map-card";if(customElements.get(i))');

// These are registered upstream custom elements, not generic HA elements or attributes.
const tags = [
  "action-handler-vehicle-status-card",
  "vic-tab", "vic-tab-bar", "vsc-btn-state-info", "vsc-btn-shape-icon",
  "vsc-image-item", "vsc-btn-card", "vsc-state-item", "vsc-btn-badge",
  "vsc-state-display", "vsc-range-bar", "vsc-range-item", "vsc-button-single",
  "vsc-indicator-single", "vsc-indicator-group-item", "vsc-indicators-group",
  "vsc-tire-item", "custom-tire-card", "vsc-tire-card", "vsc-default-card",
  "vsc-default-card-item", "vsc-dialog-ha-map", "vsc-custom-card-element",
  "sub-editor-header", "vsc-sub-element-editor", "vsc-alignment-selector",
  "vsc-editor-form", "badge-editor-item", "panel-images-preview",
  "panel-indicator-single", "vsc-yaml-editor", "vsc-menu-element",
  "vsc-dialog-form", "vsc-image-upload", "vsc-buttons-grid",
  "vsc-images-slide", "vsc-range-info", "vsc-indicators",
  "vsc-indicator-row", "vsc-mini-map", "vsc-indicator-badge",
  "vsc-indicator-item", "vsc-buttons-group", "vsc-button-card-item",
  "panel-range-info", "panel-base-button", "panel-button-card",
  "panel-button-card-sec", "panel-default-card", "panel-editor-ui",
  "panel-images-editor", "panel-indicator-group", "panel-indicator-rows",
  "panel-indicator-item", "panel-map-editor", "panel-tire-config",
  "panel-yaml-editor", "panel-button-list", "panel-layout-editor",
  "panel-row-sub-item", "panel-row-item", "panel-row-sub-group-item",
  "panel-button-card-main", "panel-button-card-default",
  "panel-button-card-default-item", "panel-button-card-tire",
];
for (const tag of tags.sort((a, b) => b.length - a.length)) {
  const pattern = new RegExp(`(?<![\\w-])${tag}(?![\\w-])`, "g");
  if (!pattern.test(source)) throw new Error(`Missing upstream tag: ${tag}`);
  source = source.replace(pattern, `addition-car-${tag}`);
}

for (const [from, to, count] of [
  ["window.VehicleCard", "window.AdditionCarVehicleCard", 1],
  ["window.EditorManager", "window.AdditionCarEditorManager", 1],
  ["window.VscMiniMap", "window.AdditionCarMiniMap", 1],
  ["window.vscDialogHaMap", "window.additionCarDialogHaMap", 2],
  ["window.__extraMapCardLoadPromise", "window.__additionCarExtraMapCardLoadPromise", 3],
  ['"editor-event"', '"addition-car-editor-event"', 3],
  ['"group-active"', '"addition-car-group-active"', 3],
  ['"go-back"', '"addition-car-go-back"', 3],
  ['"vsc-editor-area-selected"', '"addition-car-editor-area-selected"', 1],
  ['"vsc-editor-sub-card-preview"', '"addition-car-editor-sub-card-preview"', 1],
  ['"vsc-editor-indicator-row-selected"', '"addition-car-editor-indicator-row-selected"', 1],
]) replaceAllChecked(from, to, count);
const leafletGlobal = /window\.L(?![\w$])/g;
if ([...source.matchAll(leafletGlobal)].length !== 3) throw new Error("Unexpected Leaflet global count");
source = source.replace(leafletGlobal, "window.AdditionCarLeaflet");
replaceOnce(":t(L)),fZ.exports", ":t(window.AdditionCarLeaflet)),fZ.exports");
replaceOnce('"undefined"!=typeof L&&L&&L.Mixin', 'window.AdditionCarLeaflet&&window.AdditionCarLeaflet.Mixin');
replaceOnce("e[t]===L.Mixin.Events", "e[t]===window.AdditionCarLeaflet.Mixin.Events");

function replaceMapOnce(from, to) {
  const first = mapSource.indexOf(from);
  if (first < 0 || mapSource.indexOf(from, first + from.length) !== -1) {
    throw new Error(`Expected exactly one map occurrence: ${from.slice(0, 100)}`);
  }
  mapSource = mapSource.slice(0, first) + to + mapSource.slice(first + from.length);
}
const mapBannerStart = mapSource.indexOf("console.groupCollapsed(");
const mapBannerEnd = mapSource.indexOf("console.groupEnd(),", mapBannerStart);
if (mapBannerStart < 0 || mapBannerEnd < 0) throw new Error("Map banner not found");
mapSource = mapSource.slice(0, mapBannerStart) + mapSource.slice(mapBannerEnd + "console.groupEnd(),".length);
for (const tag of [
  "emc-entity-marker", "emc-history-range-buttons", "emc-map",
  "emc-sub-entity-editor", "emc-entity-editor", "extra-map-editor", "extra-map-card",
].sort((a, b) => b.length - a.length)) {
  const pattern = new RegExp(`(?<![\\w-])${tag}(?![\\w-])`, "g");
  if (!pattern.test(mapSource)) throw new Error(`Missing upstream map tag: ${tag}`);
  mapSource = mapSource.replace(pattern, `addition-car-${tag}`);
}
for (const [from, to, expected] of [
  ["window.ExtraMapEditor", "window.AdditionCarExtraMapEditor", 1],
  ["window.ExtraMapCard", "window.AdditionCarExtraMapCard", 1],
  ["window.ExtraTiler", "window.AdditionCarExtraTiler", 2],
]) {
  const count = mapSource.split(from).length - 1;
  if (count !== expected) throw new Error(`Unexpected map global count for ${from}: ${count}`);
  mapSource = mapSource.replaceAll(from, to);
}

// Inline the original RTL plugin in the existing worker's lazy-load callback.
// The worker still uses the upstream blob worker, but does not import JS from a CDN.
if (rtlSource.split("})(this,function(exports)").length !== 2) throw new Error("Unexpected RTL wrapper");
rtlSource = rtlSource.replace("})(this,function(exports)", "})(self,function(exports)");
replaceMapOnce(
  'rtlPluginURL:"https://cdn.maptiler.com/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.min.js"',
  'rtlPluginURL:window.location.href',
);
replaceMapOnce("syncState(i,this.self.importScripts)", `syncState(i,()=>{${rtlSource}\n})`);
replaceMapOnce("export{pd as ExtraMapCard};", "");

replaceOnce("export{$Q as VehicleStatusCard};", "return { VehicleStatusCard: $Q, VehicleStatusCardEditor: KQ, LitElement: nt };");
const output = `// Generated by scripts/vendor-car-engine.mjs; see vendor/README.md and LICENSE files.\nlet initialized;\nexport function initializeCarEngine() {\n  return initialized ??= Promise.resolve().then(() => {\nlet mapInitialized = false;\nfunction initializePrivateMap() {\n  if (mapInitialized) return;\n  ${mapSource}\n  mapInitialized = true;\n}\n${source}\n  });\n}\n`;
await writeFile("src/car-advanced/vendor/vehicle-engine.js", output);
