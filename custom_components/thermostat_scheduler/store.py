"""Store."""

from __future__ import annotations

import logging
from typing import Any
import uuid

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DAYS_OF_WEEK, DOMAIN, MAX_INTERVALS_PER_DAY

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1


class _UnsetType:
    pass


_UNSET_SENTINEL = _UnsetType()


def _empty_schedule() -> dict[str, list]:
    return {day: [] for day in DAYS_OF_WEEK}


class SchedulerStore:
    """Store class."""

    def __init__(self, hass: HomeAssistant, entry_id: str) -> None:
        """Init."""
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry_id}"
        )
        self._thermostats: list[dict[str, Any]] = []
        self._groups: list[dict[str, Any]] = []
        self._schedules: dict[str, dict[str, list]] = {}

    async def async_load(self) -> None:
        """Load."""
        data = await self._store.async_load()
        if data is None:
            return
        self._thermostats = data.get("thermostats", [])
        self._groups = data.get("groups", [])
        self._schedules = data.get("schedules", {})

    async def async_save(self) -> None:
        """Save."""
        await self._store.async_save(
            {
                "thermostats": self._thermostats,
                "groups": self._groups,
                "schedules": self._schedules,
            }
        )

    def get_data(self) -> dict[str, Any]:
        """Get Data."""
        return {
            "thermostats": list(self._thermostats),
            "groups": list(self._groups),
            "schedules": dict(self._schedules),
        }

    def get_thermostats(self) -> list[dict[str, Any]]:
        """Get thermostat."""
        return list(self._thermostats)

    def get_groups(self) -> list[dict[str, Any]]:
        """Get group."""
        return list(self._groups)

    def get_schedule(self, target_id: str) -> dict[str, list]:
        """Gt schedule."""
        return self._schedules.get(target_id, _empty_schedule())

    def add_thermostat(
        self, name: str, entity_id: str, group_id: str | None = None
    ) -> dict[str, Any]:
        """Add thermostat."""
        thermostat: dict[str, Any] = {
            "id": str(uuid.uuid4()),
            "name": name,
            "entity_id": entity_id,
            "group_id": group_id,
            "enabled": True,
        }
        self._thermostats.append(thermostat)
        return thermostat

    def remove_thermostat(self, thermostat_id: str) -> bool:
        """Remove thermostat."""
        before = len(self._thermostats)
        self._thermostats = [t for t in self._thermostats if t["id"] != thermostat_id]
        if len(self._thermostats) < before:
            self._schedules.pop(thermostat_id, None)
            return True
        return False

    def update_thermostat(
        self,
        thermostat_id: str,
        name: str | None = None,
        entity_id: str | None = None,
        group_id: Any = _UNSET_SENTINEL,
        enabled: bool | None = None,
    ) -> dict[str, Any] | None:
        """Update thermostat."""
        for thermostat in self._thermostats:
            if thermostat["id"] == thermostat_id:
                if name is not None:
                    thermostat["name"] = name
                if entity_id is not None:
                    thermostat["entity_id"] = entity_id
                if not isinstance(group_id, _UnsetType):
                    thermostat["group_id"] = group_id
                if enabled is not None:
                    thermostat["enabled"] = enabled
                return dict(thermostat)
        return None

    def add_group(self, name: str) -> dict[str, Any]:
        """Add group."""
        group: dict[str, Any] = {"id": str(uuid.uuid4()), "name": name, "enabled": True}
        self._groups.append(group)
        return group

    def remove_group(self, group_id: str) -> bool:
        """Remove group."""
        before = len(self._groups)
        self._groups = [g for g in self._groups if g["id"] != group_id]
        if len(self._groups) < before:
            self._schedules.pop(group_id, None)
            for thermostat in self._thermostats:
                if thermostat.get("group_id") == group_id:
                    thermostat["group_id"] = None
            return True
        return False

    def update_group(
        self, group_id: str, name: str | None = None, enabled: bool | None = None
    ) -> dict[str, Any] | None:
        """Update group."""
        for group in self._groups:
            if group["id"] == group_id:
                if name is not None:
                    group["name"] = name
                if enabled is not None:
                    group["enabled"] = enabled
                return dict(group)
        return None

    def set_schedule(self, target_id: str, schedule: dict[str, list]) -> None:
        """Set schedule."""
        validated: dict[str, list] = {}
        for day in DAYS_OF_WEEK:
            intervals = schedule.get(day, [])
            validated[day] = intervals[:MAX_INTERVALS_PER_DAY]
        self._schedules[target_id] = validated

    def get_schedule_for_thermostat(
        self, thermostat: dict[str, Any]
    ) -> dict[str, list]:
        """Get scheduele for thermostat."""
        key = thermostat.get("group_id") or thermostat["id"]
        return self._schedules.get(key, _empty_schedule())
