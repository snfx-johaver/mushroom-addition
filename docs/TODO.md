# To-do

`custom:mushroom-addition-todo` is an original frontend-only implementation,
inspired by the task-list concept of Home Tasks and styled to match Mushroom.
It does **not** copy Home Tasks source code or require the `home_tasks` backend.
Home Tasks is a separate MIT-licensed project, copyright 2026 L3t4l3s.

## Setup

Configure a Home Assistant integration that provides `todo.*` entities first.
Choose **Mushroom Addition: To-do** in the card picker, then select your primary
list in **Context**. Add more lists there to get wrapping list-navigation buttons.
Only the selected list is loaded; each list uses its own supported capabilities.
Unavailable lists remain visible so you can identify configuration problems.
With no list configured, the card shows setup guidance, not invented tasks.

```yaml
type: custom:mushroom-addition-todo
entity: todo.personal
todo_entities:
  - todo.shopping
name: My tasks
todo_show_completed: true
todo_allow_add: true
todo_allow_edit: true
todo_allow_delete: true
card_shadow: true
```

`entity` is optional if `todo_entities` is supplied. Duplicate entity IDs are
merged in order. All five `todo_*` settings are available in the shared graphical
editor; the four boolean settings default to `true`. `todo_entities` defaults
to no additional lists. The normal Mushroom **Content**, **Layout**, and
**Interactions** controls are reused, including icon, name, primary/secondary
information, horizontal/vertical layout, fill container, shadow and heading actions.
Task controls are separate from heading actions. A list's friendly name labels
its navigation button; a custom card name is not translated.

## What works

- Read active and completed tasks from the selected HA list.
- Add tasks, complete/reopen tasks, edit their title, and confirm deletion.
- View descriptions and due dates; set/edit/clear descriptions and date or
  date/time fields only when the entity advertises those capabilities.
- Hide completed tasks with a local display toggle (does not delete them).
- Switch lists without combining task identifiers across entities.
- Refresh manually, after mutations and relevant entity/connection changes,
  and every 30 seconds while attached. Polling also catches edits that leave
  the entity's outstanding-task count unchanged.
- Loading, unavailable, empty, read-error and write-error states are distinct.
  Task content is rendered as plain text, never executable HTML.

Dates without a time stay calendar dates. Date/time inputs use the browser's
local time and are sent as ISO instants; displayed times use the browser timezone.
An unchanged timestamp is preserved exactly, including seconds and offset.
Descriptions and dates can be cleared; unsupported fields are left untouched.

## Capabilities and Microsoft To Do

Controls follow HA's `TodoListEntityFeature` bitmask, not the integration name:

| Bit | Capability | Card behavior |
|---|---|---|
| 1 | Create | Add-task form |
| 2 | Delete | Delete button with inline confirmation |
| 4 | Update | Complete/reopen and edit |
| 8 | Move | Not exposed; this card intentionally does not reorder tasks |
| 16 | Due date | Date input |
| 32 | Due datetime | Local date/time input |
| 64 | Description | Description input |

Microsoft To Do entities with `supported_features: 119` advertise all listed
capabilities except move. They use the same code as other integrations: no
Microsoft account, token or API is handled by this frontend. A mask of `0` or
missing features means read-only. Configuration switches can hide add/edit/delete,
but cannot enable an unsupported provider feature. Hiding editing does not
disable completion/reopening.

HA enforces service permissions. The card does not invent an authorization
model based on admin status. Rejected calls show a localized error and retain
the form; refreshing is required before retrying. It never logs task contents or
provider exception text. The display switches are convenience controls, **not**
an access-control boundary.

## Data integrity and asynchronous behavior

Reads use `hass.callWS({type: "todo/item/list", entity_id})` (with the equivalent
connection method as a transport fallback). Mutations call the standard
`todo.add_item`, `todo.update_item`, and `todo.remove_item` services. The target
is a single explicit entity ID. Update/delete always send `item: <uid>`, never
the displayed title. Duplicate titles are therefore allowed.

HA currently matches service `item` arguments against **either UID or summary**.
The card refuses to mutate missing/duplicate UIDs or UIDs colliding with another
task's summary. It re-reads before writing and refuses to overwrite a task that
has changed since it was displayed. HA does not offer a conditional-write token,
so no frontend can eliminate a remote change between this check and the service
execution; authoritative conflict resolution remains an HA/provider limitation.

Writes are serialized per card instance, with no optimistic item insertion,
deletion or completion. A service rejection never appears as success. If the
write succeeds but reloading fails, the error explicitly says the change was
sent and asks for refresh, rather than inviting an accidental duplicate retry.
Responses from previous lists, previous connections and detached cards are
discarded. Drafts are not stored in local storage or sent anywhere except HA.
Cloud-provider sync timing is controlled by the integration, not the card.

## Deliberately absent

There are no Home Tasks-specific rewards, points, family assignment, task
templates, recurrence scheduling, subtasks, notifications, attachments, calendar
automation, backend history or custom services. These are not part of the generic
HA to-do contract, so the interface does not advertise non-working controls.
There is no bulk deletion, drag sorting, direct Microsoft API access or hidden
backend installation. This is a task-list frontend, not a replacement for the
Home Tasks server.

## API references and validation

The implementation was checked against official Home Assistant source:

- [To-do websocket commands](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/__init__.py)
- [Feature flags](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/const.py)
- [Service schemas](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/services.yaml)
- [UID/summary resolution and field clearing](https://github.com/home-assistant/core/blob/dev/homeassistant/components/todo/services.py)

Automated coverage lives in `tests/todo.test.ts`, including a synthetic Microsoft
feature-mask-119 scenario, supported-field payloads, duplicate summaries, UID
collisions, rejected calls, stale/disconnected requests, all 33 locales and shared
editor registration. No real user tasks need to be created or modified to run it.
