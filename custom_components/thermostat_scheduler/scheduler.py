"""Scheduler."""

from collections.abc import Callable
from datetime import datetime
import logging

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change

from .const import DAYS_OF_WEEK
from .store import SchedulerStore

_LOGGER = logging.getLogger(__name__)

_WEEKDAY_TO_NAME = DAYS_OF_WEEK


class ScheduleCoordinator:
    """Coordinator."""

    def __init__(self, hass: HomeAssistant, store: SchedulerStore) -> None:
        """Init."""
        self._hass = hass
        self._store = store
        self._cancel: Callable[[], None] | None = None

    def start(self) -> None:
        """Start."""
        self._cancel = async_track_time_change(self._hass, self._handle_tick, second=0)
        _LOGGER.debug("ScheduleCoordinator started")

    def stop(self) -> None:
        """Stop."""
        if self._cancel is not None:
            self._cancel()
            self._cancel = None
        _LOGGER.debug("ScheduleCoordinator stopped")

    @callback
    def _handle_tick(self, now: datetime) -> None:
        day_name = _WEEKDAY_TO_NAME[now.weekday()]
        current_time = now.strftime("%H:%M")
        groups_by_id = {g["id"]: g for g in self._store.get_groups()}
        for thermostat in self._store.get_thermostats():
            group_id = thermostat.get("group_id")
            if group_id:
                group = groups_by_id.get(group_id)
                if group is not None and not group.get("enabled", True):
                    continue
            schedule = self._store.get_schedule_for_thermostat(thermostat)
            for interval in schedule.get(day_name, []):
                if interval.get("start") == current_time:
                    self._apply_temperature(
                        thermostat["entity_id"], interval["temperature"]
                    )
                    break

    def _apply_temperature(self, entity_id: str, temperature: float) -> None:
        _LOGGER.debug("Setting %s to %.1f deg", entity_id, temperature)
        self._hass.async_create_task(
            self._hass.services.async_call(
                "climate",
                "set_temperature",
                {"entity_id": entity_id, "temperature": temperature},
                blocking=False,
            )
        )
