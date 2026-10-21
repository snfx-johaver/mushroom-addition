# NAS dashboard cards

These four additional cards integrate SNFX Synology Cards v3.1.0, pinned to
`424ca74597e2e68d8320e8be4ba15651f838a8c8`. They do not replace the existing
Mushroom Addition **NAS** metrics card.

| Picker name (after `Mushroom Addition:`) | Card type | Visual editor |
|---|---|---|
| NAS - Server Overview | `custom:mushroom-addition-nas-server-card` | `mushroom-addition-nas-server-card-editor` |
| NAS - Storage and Disks | `custom:mushroom-addition-nas-storage-card` | `mushroom-addition-nas-storage-card-editor` |
| NAS - Docker Containers | `custom:mushroom-addition-nas-docker-card` | `mushroom-addition-nas-docker-card-editor` |
| NAS - Unified Dashboard | `custom:mushroom-addition-nas-dashboard-card` | `mushroom-addition-nas-dashboard-card-editor` |

Each card has its complete upstream visual editor. NAS editor and runtime labels
currently remain in English. Custom names, entity IDs, device registry IDs,
saved settings and user state strings are not translated or normalized.

## Migrating an existing installation

1. Back up dashboard configurations and the Dashboard resource list.
2. Install the Mushroom Addition bundle containing these cards.
3. Remove old frontend resource entries for `synology-cards.js`, including
   `/hacsfiles/SNFX-Synology-cards/synology-cards.js`,
   `/local/synology-cards.js`, and any older selective NAS scripts.
4. Remove the old SNFX Synology Cards **frontend** package and its HACS custom
   repository entry. Do not remove NAS/Portainer integrations or their entities.
5. Keep only the Mushroom Addition module resource, normally
   `/hacsfiles/mushroom-addition/mushroom-cards-addition.js`.
6. Fully reload all browser/app dashboards. Existing custom elements cannot be
   replaced inside an already-open page; a soft dashboard refresh is not enough.

The main bundle contains everything: no second script, script fetch or separate
NAS resource is needed. Do not leave both frontend bundles enabled.

Existing `custom:synology-server-card`, `custom:synology-storage-card`,
`custom:synology-docker-card`, and `custom:synology-dashboard-card` configurations
continue unchanged, along with their matching `-editor` tags. The corresponding
`snfx-server-card`, `snfx-storage-card`, `snfx-docker-card`, and
`snfx-dashboard-card` tags and `-editor` tags are also hidden compatibility
aliases. Only the four canonical names appear in the picker. Existing standalone
definitions are never redefined, but remove their old resources and reload to
ensure aliases use the integrated version.

## Data sources

- `nas_source: synology_dsm` (default): Home Assistant Synology DSM entities,
  discovered by platform, registry identifiers and parent-device relationships.
- `nas_source: qnap`: QNAP sensors, including indexed volumes, disks and network
  interfaces. Multiple same-name devices remain separated by registry ID.
- `nas_source: manual`: explicit entity mappings; no NAS registry lookup needed.
- `server`: a Home Assistant **device registry ID**, not an entity ID or hostname.
  A picker stub selects it only when discovery finds exactly one supported NAS.
- `network_interface`: optional discovered interface selection.
- `management_url`: optional HTTP(S) management link.

Server Overview retains CPU/memory/storage gauges, total/free/used memory,
uptime, model, firmware, temperatures, Security Advisor or source-specific status,
and network traffic. Storage and Disks retains volumes, capacity, drive model,
SMART/status, temperatures, bad-sector and remaining-life readings.
Missing/disabled/unavailable readings remain unavailable rather than fabricated
healthy values.

```yaml
type: custom:mushroom-addition-nas-dashboard-card
nas_source: qnap
server: YOUR_DEVICE_REGISTRY_ID
tabs: [overview, storage]
show_system_info: true
```

## Containers

`container_source` supports `disabled`, `portainer`, and `manual`.
Portainer discovery is scoped to `portainer_endpoint`, a device registry ID;
it does not cross endpoints. No Portainer URL, API key or direct NAS request is
needed. Existing defaults remain: an endpoint enables Portainer, manual
containers enable manual mode, otherwise the standalone Docker card defaults
to Portainer and the unified dashboard defaults to containers disabled.

`view_mode` is `grid` or `list`. Manual container entries support `name`,
`status_entity`, `running_state`, `stopped_state`, `cpu_entity`, `memory_entity`,
`power_entity`, `start_entity`, `stop_entity`, and `restart_entity`.
Power controls use switch entities; action controls use button, input_button
or script entities. Service availability, confirmation and unavailable-state
guards are retained. State strings are case-sensitive user settings.

```yaml
type: custom:mushroom-addition-nas-docker-card
container_source: manual
view_mode: list
containers:
  - name: Example service
    status_entity: sensor.example_container_status
    running_state: running
    stopped_state: exited
    cpu_entity: sensor.example_container_cpu
    memory_entity: sensor.example_container_memory
    power_entity: switch.example_container
    restart_entity: button.example_container_restart
```

## Manual NAS mappings and display settings

`entities` maps logical fields to sensor/binary-sensor entities:
`cpu_usage`, `ram_usage`, `system_temperature`, `uptime`,
`memory_total_real`, `memory_available_real`, `memory_used`, `storage_usage`,
`security_status`, `network_rx`, `network_tx`, `system_status`, `model`, and
`software_version`. Source-specific fields remain available in the visual editor.

`volumes` is a list with optional `name`, `usage_entity`, `total_entity`,
`used_entity`, `status_entity`, and `temperature_entity`.
`drives` supports `name`, `model_entity`, `status_entity`, `smart_entity`,
`temperature_entity`, `bad_sectors_entity`, and `remaining_life_entity`.
The last two use binary sensors, matching the upstream schema.

```yaml
type: custom:mushroom-addition-nas-server-card
nas_source: manual
name: Example NAS
entities:
  cpu_usage: sensor.example_nas_cpu
  ram_usage: sensor.example_nas_memory_percent
  system_temperature: sensor.example_nas_temperature
  uptime: sensor.example_nas_uptime
```

`name`, `title`, `hide_header`, `show_system_info`, `show_motherboard`,
`embedded`, all entity mappings, container settings and `tabs` are retained.
The unified dashboard accepts `overview`, `storage`, and `docker` tab keys and
passes all saved settings through to its embedded canonical cards.

## License and validation

The imported frontend remains Apache-2.0. Its original Domalab copyright,
ha-unraid attribution, full license and NOTICE are preserved in `licenses/` and
the distributed JavaScript banner; see [third-party notices](../THIRD_PARTY_NOTICES.md).
The rest of Mushroom Addition retains its existing license.

Synthetic regression tests in `tests/nas/` cover discovery, rendering,
container controls, editor changes, legacy configuration continuation and
registration. They make no calls to a physical Home Assistant instance.

After `npm run build`, run `node --import tsx scripts/check-nas-bundle.ts` for a
worker-free production-bundle regression check. CI also runs this check, including
single-script packaging and retained license notices.
