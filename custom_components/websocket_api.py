from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.components.websocket_api import ActiveConnection
from homeassistant.core import HomeAssistant, callback

from .const import (
    DATA_COORDINATOR,
    DATA_STORE,
    DAYS_OF_WEEK,
    DOMAIN,
    MAX_INTERVALS_PER_DAY,
)
from .scheduler import ScheduleCoordinator
from .store import SchedulerStore, _UNSET_SENTINEL, _UnsetType

_LOGGER = logging.getLogger(__name__)

_INTERVAL_SCHEMA = vol.Schema(
    {
        vol.Required("start"): str,
        vol.Required("temperature"): vol.Coerce(float),
    }
)

_SCHEDULE_SCHEMA = vol.Schema(
    {vol.Optional(day): [_INTERVAL_SCHEMA] for day in DAYS_OF_WEEK}
)

_registered = False


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    global _registered
    if _registered:
        return
    _registered = True
    for cmd in _COMMANDS:
        websocket_api.async_register_command(hass, cmd)


def _get_entry_data(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> tuple[SchedulerStore, ScheduleCoordinator] | None:
    entry_id: str = msg["entry_id"]
    entry_data = hass.data.get(DOMAIN, {}).get(entry_id)
    if entry_data is None:
        connection.send_error(
            msg["id"], "entry_not_found", f"No entry with id {entry_id!r}"
        )
        return None
    return entry_data[DATA_STORE], entry_data[DATA_COORDINATOR]


def _validate_schedule(schedule: dict[str, list]) -> str | None:
    for day, intervals in schedule.items():
        if len(intervals) > MAX_INTERVALS_PER_DAY:
            return f"{day}: maximum {MAX_INTERVALS_PER_DAY} intervals per day"
        starts = [iv.get("start") for iv in intervals]
        if len(starts) != len(set(starts)):
            return f"{day}: duplicate start times"
    return None


@callback
@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/get_config",
        vol.Required("entry_id"): str,
    }
)
def ws_get_config(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    connection.send_result(msg["id"], store.get_data())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/add_thermostat",
        vol.Required("entry_id"): str,
        vol.Required("name"): str,
        vol.Required("entity_id"): str,
        vol.Optional("group_id"): vol.Any(None, str),
    }
)
@websocket_api.async_response
async def ws_add_thermostat(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    thermostat = store.add_thermostat(
        name=msg["name"], entity_id=msg["entity_id"], group_id=msg.get("group_id")
    )
    await store.async_save()
    connection.send_result(
        msg["id"], {"thermostat": thermostat, "thermostats": store.get_thermostats()}
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/remove_thermostat",
        vol.Required("entry_id"): str,
        vol.Required("thermostat_id"): str,
    }
)
@websocket_api.async_response
async def ws_remove_thermostat(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    if not store.remove_thermostat(msg["thermostat_id"]):
        connection.send_error(msg["id"], "not_found", "Thermostat not found")
        return
    await store.async_save()
    connection.send_result(msg["id"], {"thermostats": store.get_thermostats()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/update_thermostat",
        vol.Required("entry_id"): str,
        vol.Required("thermostat_id"): str,
        vol.Optional("name"): str,
        vol.Optional("entity_id"): str,
        vol.Optional("group_id"): vol.Any(None, str),
    }
)
@websocket_api.async_response
async def ws_update_thermostat(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    group_id = msg["group_id"] if "group_id" in msg else _UNSET_SENTINEL
    updated = store.update_thermostat(
        thermostat_id=msg["thermostat_id"],
        name=msg.get("name"),
        entity_id=msg.get("entity_id"),
        group_id=group_id,
    )
    if updated is None:
        connection.send_error(msg["id"], "not_found", "Thermostat not found")
        return
    await store.async_save()
    connection.send_result(
        msg["id"], {"thermostat": updated, "thermostats": store.get_thermostats()}
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/add_group",
        vol.Required("entry_id"): str,
        vol.Required("name"): str,
    }
)
@websocket_api.async_response
async def ws_add_group(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    group = store.add_group(name=msg["name"])
    await store.async_save()
    connection.send_result(msg["id"], {"group": group, "groups": store.get_groups()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/remove_group",
        vol.Required("entry_id"): str,
        vol.Required("group_id"): str,
    }
)
@websocket_api.async_response
async def ws_remove_group(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    if not store.remove_group(msg["group_id"]):
        connection.send_error(msg["id"], "not_found", "Group not found")
        return
    await store.async_save()
    connection.send_result(
        msg["id"],
        {"groups": store.get_groups(), "thermostats": store.get_thermostats()},
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/update_group",
        vol.Required("entry_id"): str,
        vol.Required("group_id"): str,
        vol.Optional("name"): str,
        vol.Optional("enabled"): bool,
    }
)
@websocket_api.async_response
async def ws_update_group(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    updated = store.update_group(
        group_id=msg["group_id"],
        name=msg.get("name"),
        enabled=msg["enabled"] if "enabled" in msg else None,
    )
    if updated is None:
        connection.send_error(msg["id"], "not_found", "Group not found")
        return
    await store.async_save()
    connection.send_result(msg["id"], {"group": updated, "groups": store.get_groups()})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "thermostat_scheduler/set_schedule",
        vol.Required("entry_id"): str,
        vol.Required("target_id"): str,
        vol.Required("schedule"): _SCHEDULE_SCHEMA,
    }
)
@websocket_api.async_response
async def ws_set_schedule(
    hass: HomeAssistant, connection: ActiveConnection, msg: dict[str, Any]
) -> None:
    result = _get_entry_data(hass, connection, msg)
    if result is None:
        return
    store, _ = result
    schedule: dict[str, list] = msg["schedule"]
    error = _validate_schedule(schedule)
    if error:
        connection.send_error(msg["id"], "invalid_schedule", error)
        return
    store.set_schedule(target_id=msg["target_id"], schedule=schedule)
    await store.async_save()
    hass.bus.async_fire("thermostat_scheduler_updated", {"entry_id": msg["entry_id"]})
    connection.send_result(
        msg["id"],
        {
            "target_id": msg["target_id"],
            "schedule": store.get_schedule(msg["target_id"]),
        },
    )


_COMMANDS = [
    ws_get_config,
    ws_add_thermostat,
    ws_remove_thermostat,
    ws_update_thermostat,
    ws_add_group,
    ws_remove_group,
    ws_update_group,
    ws_set_schedule,
]
