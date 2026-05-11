# Thermostat Scheduler

A custom Home Assistant integration that automatically sets temperatures on your climate entities according to a weekly schedule. Schedules are configured directly in the Lovelace UI through the companion cards — no YAML editing required.

---

## Features

- Weekly schedule per thermostat (up to **6 time intervals per day**)
- **Groups**: assign multiple thermostats to a group so they all follow the same schedule
- Groups and individual thermostats can be **enabled/disabled** without deleting them
- **Copy/paste** a single day's intervals or an entire week's plan between days and targets
- Persistent storage — schedules survive restarts
- WebSocket-based API (admin only)
- Two companion Lovelace cards for management and read-only display

---

## Installation

1. Copy the `thermostat_scheduler` folder into `<config>/custom_components/`.
2. Restart Home Assistant.
3. Go to **Settings → Integrations → Add Integration** and search for **Thermostat Scheduler**.
4. Enter a name for the scheduler instance and click **Submit**.

To find the **Config Entry ID** needed by the Lovelace cards:

> Settings → Integrations → Thermostat Scheduler → click the entry → the URL contains `/config_entries/<entry_id>/`

---

## Lovelace Cards

Both cards live in `<config>/www/thermostat-schedule-card/` and must be registered as Lovelace resources.

### Registering the resources

Add both files as JavaScript Module resources in **Settings → Dashboards → Resources** (or in `configuration.yaml`):

```yaml
lovelace:
  resources:
    - url: /local/thermostat-schedule-card/thermostat-schedule-card.js
      type: module
    - url: /local/thermostat-schedule-card/thermostat-schedule-view-card.js
      type: module
```

---

### `thermostat-schedule-card`

A full management card. Requires **admin** access.

<img width="918" height="275" alt="image" src="https://github.com/user-attachments/assets/874db36c-f865-4344-b010-d9102f98a584" />
<img width="916" height="245" alt="image" src="https://github.com/user-attachments/assets/1786e2b5-d3b7-48de-847c-b6bf965b70fe" />
<img width="916" height="429" alt="image" src="https://github.com/user-attachments/assets/89a24c64-be3a-43e3-9c90-ca00b0099842" />


The card has three tabs:

| Tab | What you can do |
|-----|-----------------|
| **Thermostats** | Add, edit, enable/disable, remove thermostats; assign them to a group |
| **Groups** | Add, edit, enable/disable, remove groups |
| **Schedule** | Select a thermostat or group and edit its weekly schedule; copy/paste days or entire plans |

#### Card configuration

```yaml
type: custom:thermostat-schedule-card
entry_id: "<your_config_entry_id>"
title: "Thermostat Schedules"   # optional
```

| Option | Required | Description |
|--------|----------|-------------|
| `entry_id` | Yes | The config entry ID of the Thermostat Scheduler integration |
| `title` | No | Custom card title (defaults to "Thermostat Schedules") |

The card includes a **visual editor** — click the pencil icon in the card picker to configure it without writing YAML.

#### Adding a thermostat

1. Open the **Thermostats** tab and click **+ Add Thermostat**.
2. Enter a display name and select a climate entity from the dropdown.
3. Optionally assign it to a group.
4. Click **Add**.

#### Enabling and disabling

A thermostat that is **not in a group** can be individually enabled or disabled using the **Enable / Disable** button in the Thermostats tab. A disabled thermostat's schedule will not run until it is re-enabled. A `(disabled)` badge is shown next to its name in the list and in the Schedule tab dropdown.

Groups have the same enable/disable control in the Groups tab. Disabling a group suspends the schedule for every thermostat that belongs to it.

#### Copying and pasting schedules

In the **Schedule** tab each day block has a **Copy day** button. Once a day has been copied, a **Paste** button appears on every other day in the grid — clicking it overwrites that day's intervals with the copied ones.

The schedule action bar also has **Copy plan** and **Paste plan** buttons. **Copy plan** captures all seven days at once; **Paste plan** overwrites the entire week of the currently selected target. This makes it easy to clone a schedule from one thermostat or group to another:

1. Select the source target in the dropdown and click **Copy plan**.
2. Select the destination target and click **Paste plan**.
3. Click **Save Schedule**.

> Copied intervals capture the current in-editor values (including unsaved edits). Nothing is saved to the backend until you click **Save Schedule**.

#### Editing a schedule

1. Open the **Schedule** tab.
2. Select a thermostat or group from the dropdown.
3. For each day, click **+ Add** to add a time interval — enter the start time (`HH:MM`) and target temperature.
4. Click **Save Schedule**.

If the target is disabled, a yellow warning banner is shown below the dropdown as a reminder that the schedule will not run until the target is re-enabled.

> **Note:** Schedules assigned to a group apply to all thermostats in that group. Individual thermostat schedules only apply when the thermostat has no group assigned.

---

### `thermostat-schedule-view-card`

A compact **read-only** card that displays the weekly schedule for a single thermostat or group. It automatically refreshes whenever a schedule is saved via the management card.

<img width="443" height="162" alt="image" src="https://github.com/user-attachments/assets/7731fe77-6eb6-4fae-90a5-60dbaab95cc1" />


```yaml
type: custom:thermostat-schedule-view-card
entry_id: "<your_config_entry_id>"
target: "g:<group_id>"   # or "t:<thermostat_id>"
title: "Living Room Schedule"   # optional
```

| Option | Required | Description |
|--------|----------|-------------|
| `entry_id` | Yes | The config entry ID of the Thermostat Scheduler integration |
| `target` | Yes | `t:<thermostat_id>` for a thermostat or `g:<group_id>` for a group |
| `title` | No | Custom card title (defaults to the thermostat/group name) |

#### Finding the target ID

The thermostat and group IDs are UUIDs assigned when they are created. You can find them by opening the **Schedule** tab in `thermostat-schedule-card` and inspecting the dropdown values, or by calling the `thermostat_scheduler/get_config` WebSocket command.

If the target belongs to a disabled group **or** is a disabled ungrouped thermostat, a **disabled** badge is shown in the card header. The card automatically refreshes whenever a schedule is saved or a thermostat/group is enabled or disabled.

---

## Localisation

Both cards support the following languages automatically based on your Home Assistant language setting:

| Code | Language |
|------|----------|
| `en` | English |
| `da` | Danish |
| `de` | German |
| `nl` | Dutch |
| `fr` | French |
| `es` | Spanish |
| `sv` | Swedish |
| `nb` | Norwegian Bokmål |

---

## WebSocket API

All commands require admin access.

| Command | Description |
|---------|-------------|
| `thermostat_scheduler/get_config` | Returns all thermostats, groups and schedules |
| `thermostat_scheduler/add_thermostat` | Adds a thermostat (`name`, `entity_id`, optional `group_id`) |
| `thermostat_scheduler/remove_thermostat` | Removes a thermostat by `thermostat_id` |
| `thermostat_scheduler/update_thermostat` | Updates `name`, `entity_id`, `group_id` or `enabled` flag of a thermostat |
| `thermostat_scheduler/add_group` | Creates a group (`name`) |
| `thermostat_scheduler/remove_group` | Removes a group; thermostats become ungrouped |
| `thermostat_scheduler/update_group` | Updates group `name` or `enabled` flag |
| `thermostat_scheduler/set_schedule` | Sets the weekly schedule for a thermostat or group (`target_id`, `schedule`) |

### Schedule format

```json
{
  "monday":    [{ "start": "06:00", "temperature": 21.0 }, { "start": "22:00", "temperature": 17.0 }],
  "tuesday":   [],
  "wednesday": [],
  "thursday":  [],
  "friday":    [],
  "saturday":  [{ "start": "08:00", "temperature": 20.0 }],
  "sunday":    [{ "start": "08:00", "temperature": 20.0 }]
}
```

- `start` — time in `HH:MM` (24-hour)
- `temperature` — target temperature as a number
- Maximum **6 intervals per day**; duplicate start times within the same day are rejected
