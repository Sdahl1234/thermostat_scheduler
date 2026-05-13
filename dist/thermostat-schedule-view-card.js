// ---------------------------------------------------------------------------
// thermostat-schedule-view-card.js
// Read-only weekly schedule viewer for the thermostat-scheduler integration.
// Reloads automatically whenever a schedule is saved.
// ---------------------------------------------------------------------------

const _DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// ---------------------------------------------------------------------------
// View card
// ---------------------------------------------------------------------------

class ThermostatScheduleViewCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._schedule = null;
    this._targetLabel = "";
    this._targetDisabled = false;
    this._loading = false;
    this._error = null;
    this._unsub = null;
    this._loaded = false;
  }

  setConfig(config) {
    if (!config.entry_id) throw new Error("thermostat-schedule-view-card: 'entry_id' is required");
    if (!config.target)   throw new Error("thermostat-schedule-view-card: 'target' is required");
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._loaded) {
      this._loaded = true;
      this._loadData();
      this._subscribe();
      return;
    }
    if (!this._renderDebounce) {
      this._renderDebounce = setTimeout(() => {
        this._renderDebounce = null;
        if (this._loading) return;
        if (this.shadowRoot.activeElement) {
          return;
        }
        this._render();
      }, 250);
    }
  }

  disconnectedCallback() {
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
    this._loaded = false;
  }

  async _subscribe() {
    try {
      this._unsub = await this._hass.connection.subscribeEvents((event) => {
        if (event.data?.entry_id === this._config.entry_id) {
          this._loadData();
        }
      }, "thermostat_scheduler_updated");
    } catch (_) {
      // Subscription not available — live updates will not work
    }
  }

  async _loadData() {
    this._loading = true;
    this._error = null;
    this._render();
    try {
      const result = await this._hass.connection.sendMessagePromise({
        type: "thermostat_scheduler/get_config",
        entry_id: this._config.entry_id,
      });
      const target = this._config.target;
      const [prefix, id] = target.split(":");
      let scheduleKey = id;
      if (prefix === "t") {
        const therm = result.thermostats.find(t => t.id === id);
        this._targetLabel = therm?.name ?? id;
        scheduleKey = therm?.group_id ?? id;
        if (therm?.group_id) {
          const grp = result.groups.find(g => g.id === therm.group_id);
          this._targetDisabled = grp?.enabled === false;
        } else {
          this._targetDisabled = therm?.enabled === false;
        }
      } else {
        const group = result.groups.find(g => g.id === id);
        this._targetLabel = group?.name ?? id;
        scheduleKey = id;
        this._targetDisabled = group?.enabled === false;
      }
      this._schedule = result.schedules[scheduleKey] ?? {};
    } catch (e) {
      this._error = e.message || String(e);
    }
    this._loading = false;
    this._render();
  }

  _render() {
    const title = this._escHtml(this._config.title || this._targetLabel || "Schedule");
    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <ha-card>
        <div class="card-header">
          <span class="header-title">${title}</span>
          ${this._targetDisabled ? `<span class="disabled-badge">disabled</span>` : ""}
        </div>
        <div class="card-content">
          ${this._loading ? `<div class="status-msg">Loading…</div>` : ""}
          ${this._error   ? `<div class="status-msg error">${this._escHtml(this._error)}</div>` : ""}
          ${!this._loading && !this._error && this._schedule !== null ? this._renderGrid() : ""}
        </div>
      </ha-card>`;
  }

  _renderGrid() {
    const cols = _DAYS.map(day => {
      const intervals = this._schedule[day] ?? [];
      const cells = intervals.length === 0
        ? `<div class="empty">—</div>`
        : intervals.map(iv => `
            <div class="interval">
              <span class="iv-time">${this._escHtml(iv.start)}</span>
              <span class="iv-temp">${iv.temperature}°</span>
            </div>`).join("");
      return `
        <div class="day-col">
          <div class="day-head">${this._dayShort(day)}</div>
          <div class="day-body">${cells}</div>
        </div>`;
    }).join("");
    return `<div class="grid">${cols}</div>`;
  }

  _dayShort(day) {
    const lang = this._hass?.language ?? "en";
    const map = {
      en: { monday:"Mon", tuesday:"Tue", wednesday:"Wed", thursday:"Thu", friday:"Fri", saturday:"Sat", sunday:"Sun" },
      da: { monday:"Man", tuesday:"Tir", wednesday:"Ons", thursday:"Tor", friday:"Fre", saturday:"Lør", sunday:"Søn" },
      de: { monday:"Mo",  tuesday:"Di",  wednesday:"Mi",  thursday:"Do",  friday:"Fr",  saturday:"Sa",  sunday:"So"  },
      nl: { monday:"Ma",  tuesday:"Di",  wednesday:"Wo",  thursday:"Do",  friday:"Vr",  saturday:"Za",  sunday:"Zo"  },
      fr: { monday:"Lun", tuesday:"Mar", wednesday:"Mer", thursday:"Jeu", friday:"Ven", saturday:"Sam", sunday:"Dim" },
      es: { monday:"Lun", tuesday:"Mar", wednesday:"Mié", thursday:"Jue", friday:"Vie", saturday:"Sáb", sunday:"Dom" },
      sv: { monday:"Mån", tuesday:"Tis", wednesday:"Ons", thursday:"Tor", friday:"Fre", saturday:"Lör", sunday:"Sön" },
      nb: { monday:"Man", tuesday:"Tir", wednesday:"Ons", thursday:"Tor", friday:"Fre", saturday:"Lør", sunday:"Søn" },
    };
    return (map[lang] ?? map.en)[day];
  }

  _escHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  _css() {
    return `
      :host { display: block; }
      ha-card { border-radius: 12px; overflow: hidden; }
      .card-header {
        display: flex; align-items: center; gap: 8px;
        padding: 16px 16px 0;
        font-size: 16px; font-weight: 500;
        color: var(--ha-card-header-color, var(--primary-text-color));
      }
      .header-title { flex: 1; }
      .disabled-badge {
        font-size: 11px; font-weight: 600;
        color: #b45309; background: #fef3c7; border: 1px solid #fcd34d;
        padding: 1px 8px; border-radius: 10px;
      }
      .card-content { padding: 12px 16px 16px; }
      .status-msg { font-size: 13px; color: var(--secondary-text-color); }
      .status-msg.error { color: var(--error-color, #db4437); }
      .grid {
        display: flex; gap: 6px; overflow-x: auto;
        padding-bottom: 2px;
      }
      .day-col {
        flex: 1; min-width: 42px;
        display: flex; flex-direction: column; align-items: center;
      }
      .day-head {
        font-size: 11px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--primary-color);
        padding: 2px 0 8px;
      }
      .day-body { display: flex; flex-direction: column; gap: 5px; width: 100%; }
      .interval {
        display: flex; flex-direction: column; align-items: center;
        background: var(--secondary-background-color, rgba(128,128,128,0.1));
        border-radius: 8px; padding: 5px 3px;
        line-height: 1.25;
      }
      .iv-time { font-size: 11px; color: var(--secondary-text-color); }
      .iv-temp { font-size: 14px; font-weight: 600; color: var(--primary-text-color); }
      .empty {
        font-size: 20px; color: var(--disabled-text-color, #bbb);
        text-align: center; padding: 6px 0;
      }
    `;
  }

  static getConfigElement() {
    return document.createElement("thermostat-schedule-view-card-editor");
  }

  static getStubConfig() {
    return { entry_id: "", target: "", title: "" };
  }
}

customElements.define("thermostat-schedule-view-card", ThermostatScheduleViewCard);

// ---------------------------------------------------------------------------
// Visual editor
// ---------------------------------------------------------------------------

class ThermostatScheduleViewCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._options = [];
    this._optionsEntryId = null;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config.entry_id && this._config.entry_id !== this._optionsEntryId) {
      this._loadOptions();
    }
  }

  async _loadOptions() {
    const entryId = this._config.entry_id;
    if (!entryId || !this._hass) return;
    this._optionsEntryId = entryId;
    try {
      const result = await this._hass.connection.sendMessagePromise({
        type: "thermostat_scheduler/get_config",
        entry_id: entryId,
      });
      this._options = [
        ...result.thermostats.map(t => ({ value: `t:${t.id}`, label: `[Thermostat] ${t.name}` })),
        ...result.groups.map(g => ({ value: `g:${g.id}`, label: `[Group] ${g.name}` })),
      ];
    } catch (_) {
      this._options = [];
    }
    this._render();
  }

  _render() {
    const c = this._config;
    const opts = this._options.map(o =>
      `<option value="${o.value}" ${c.target === o.value ? "selected" : ""}>${o.label}</option>`
    ).join("");

    this.shadowRoot.innerHTML = `
      <style>
        .row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
        label { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }
        .hint { font-size: 11px; color: var(--secondary-text-color); margin-top: 2px; }
        input, select {
          width: 100%; padding: 8px 10px; box-sizing: border-box;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 6px; font-size: 14px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
        }
      </style>
      <div class="row">
        <label>Config Entry ID</label>
        <input id="entry_id" type="text" value="${c.entry_id || ""}" placeholder="e.g. abc123def456">
        <span class="hint">Settings → Integrations → Thermostat Scheduler → entry URL</span>
      </div>
      <div class="row">
        <label>Thermostat / Group</label>
        <select id="target">
          <option value="">— Select —</option>
          ${opts}
        </select>
      </div>
      <div class="row">
        <label>Header text <em>(optional)</em></label>
        <input id="title" type="text" value="${c.title || ""}" placeholder="Schedule">
      </div>`;

    const entryInput = this.shadowRoot.querySelector("#entry_id");
    entryInput.addEventListener("change", e => {
      this._config = { ...this._config, entry_id: e.target.value.trim() };
      this._loadOptions();
      this._fire();
    });
    this.shadowRoot.querySelector("#target").addEventListener("change", e => {
      this._config = { ...this._config, target: e.target.value };
      this._fire();
    });
    this.shadowRoot.querySelector("#title").addEventListener("change", e => {
      this._config = { ...this._config, title: e.target.value };
      this._fire();
    });
  }

  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define("thermostat-schedule-view-card-editor", ThermostatScheduleViewCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-schedule-view-card",
  name: "Thermostat Schedule View",
  description: "Read-only weekly schedule viewer for a thermostat or group.",
});
