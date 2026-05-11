from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DATA_COORDINATOR, DATA_STORE, DOMAIN
from .scheduler import ScheduleCoordinator
from .store import SchedulerStore
from .websocket_api import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = SchedulerStore(hass, entry.entry_id)
    await store.async_load()

    coordinator = ScheduleCoordinator(hass, store)
    coordinator.start()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {
        DATA_STORE: store,
        DATA_COORDINATOR: coordinator,
    }

    async_register_websocket_api(hass)
    _LOGGER.debug("Thermostat Scheduler entry %s set up", entry.entry_id)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry_data = hass.data[DOMAIN].pop(entry.entry_id, {})
    coordinator: ScheduleCoordinator | None = entry_data.get(DATA_COORDINATOR)
    if coordinator is not None:
        coordinator.stop()
    return True
