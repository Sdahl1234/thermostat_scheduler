/**
 * thermostat-schedule-card.js
 *
 * A custom Lovelace card for the thermostat_scheduler integration.
 *
 * Card config:
 *   type: custom:thermostat-schedule-card
 *   entry_id: "<config_entry_id>"
 *   title: "Thermostat Schedules"   # optional
 */

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun" };

// ---------------------------------------------------------------------------
// Translations
// ---------------------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    tab_thermostats: "Thermostats", tab_groups: "Groups", tab_schedule: "Schedule",
    loading: "Loading\u2026", card_title: "Thermostat Schedules",
    col_name: "Name", col_entity: "Entity", col_group: "Group", col_members: "Members", col_actions: "Actions",
    btn_save: "Save", btn_cancel: "Cancel", btn_edit: "Edit", btn_schedule: "Schedule",
    btn_remove: "Remove", btn_add: "Add",
    btn_add_thermostat: "+ Add Thermostat", btn_add_group: "+ Add Group",
    btn_add_interval: "+ Add", btn_save_schedule: "Save Schedule", btn_reload: "\u21ba Reload",
    none: "\u2014 None \u2014", select: "\u2014 Select \u2014",
    name_placeholder: "Name", group_name_placeholder: "Group name",
    members_count: "{n} thermostat(s)",
    edit_schedule_for: "Edit schedule for:", schedule_hint: "Select a thermostat or group to edit its schedule.",
    max_intervals: "Max 6", thermostat_prefix: "[Thermostat]", group_prefix: "[Group]",
    no_climate: "\u2014 no climate entities found \u2014",
    err_name_entity_required: "Name and entity ID are required.",
    err_group_name_required: "Group name is required.",
    confirm_remove_thermostat: "Remove this thermostat?",
    confirm_remove_group: "Remove this group? Thermostats assigned to it will become ungrouped.",
    schedule_saved: "Schedule saved!", error_prefix: "Error: ", btn_ok: "OK",
    btn_enable: "Enable", btn_disable: "Disable",
    group_disabled: "(disabled)",
    day_monday: "Mon", day_tuesday: "Tue", day_wednesday: "Wed", day_thursday: "Thu",
    day_friday: "Fri", day_saturday: "Sat", day_sunday: "Sun",
    editor_entry_id_label: "Config Entry ID",
    editor_entry_id_hint: "Found in Settings \u2192 Integrations \u2192 Thermostat Scheduler \u2192 entry URL",
    editor_title_label: "Card title", editor_title_optional: "(optional)",
    editor_title_placeholder: "Thermostat Schedules",
    btn_copy_day: "Copy day", btn_paste_day: "Paste", btn_copy_plan: "Copy plan", btn_paste_plan: "Paste plan",
    thermostat_disabled: "(disabled)",
    schedule_target_disabled: "\u26a0\ufe0f This thermostat or group is disabled \u2014 its schedule will not run until re-enabled.",
  },
  da: {
    tab_thermostats: "Termostater", tab_groups: "Grupper", tab_schedule: "Tidsplan",
    loading: "Indl\u00e6ser\u2026", card_title: "Termostatplaner",
    col_name: "Navn", col_entity: "Enhed", col_group: "Gruppe", col_members: "Medlemmer", col_actions: "Handlinger",
    btn_save: "Gem", btn_cancel: "Annull\u00e9r", btn_edit: "Rediger", btn_schedule: "Tidsplan",
    btn_remove: "Fjern", btn_add: "Tilf\u00f8j",
    btn_add_thermostat: "+ Tilf\u00f8j termostat", btn_add_group: "+ Tilf\u00f8j gruppe",
    btn_add_interval: "+ Tilf\u00f8j", btn_save_schedule: "Gem tidsplan", btn_reload: "\u21ba Genindl\u00e6s",
    none: "\u2014 Ingen \u2014", select: "\u2014 V\u00e6lg \u2014",
    name_placeholder: "Navn", group_name_placeholder: "Gruppenavn",
    members_count: "{n} termostat(er)",
    edit_schedule_for: "Rediger tidsplan for:", schedule_hint: "V\u00e6lg en termostat eller gruppe for at redigere dens tidsplan.",
    max_intervals: "Maks. 6", thermostat_prefix: "[Termostat]", group_prefix: "[Gruppe]",
    no_climate: "\u2014 ingen klimaenheder fundet \u2014",
    err_name_entity_required: "Navn og enheds-ID er p\u00e5kr\u00e6vet.",
    err_group_name_required: "Gruppenavn er p\u00e5kr\u00e6vet.",
    confirm_remove_thermostat: "Fjern denne termostat?",
    confirm_remove_group: "Fjern denne gruppe? Termostater tilknyttet den vil blive ugruperede.",
    schedule_saved: "Tidsplan gemt!", error_prefix: "Fejl: ",
    btn_enable: "Aktivér", btn_disable: "Deaktivér", group_disabled: "(deaktiveret)",
    day_monday: "Man", day_tuesday: "Tir", day_wednesday: "Ons", day_thursday: "Tor",
    day_friday: "Fre", day_saturday: "L\u00f8r", day_sunday: "S\u00f8n",
    editor_entry_id_label: "Konfigurationsindgangs-ID",
    editor_entry_id_hint: "Findes i Indstillinger \u2192 Integrationer \u2192 Termostatplanl\u00e6gger \u2192 indgangs-URL",
    editor_title_label: "Korttitel", editor_title_optional: "(valgfri)",
    editor_title_placeholder: "Termostatplaner",
    btn_copy_day: "Kopier dag", btn_paste_day: "Indsæt", btn_copy_plan: "Kopier plan", btn_paste_plan: "Indsæt plan",
    thermostat_disabled: "(deaktiveret)",
    schedule_target_disabled: "\u26a0\ufe0f Denne termostat eller gruppe er deaktiveret \u2014 dens tidsplan k\u00f8rer ikke f\u00f8r den genaktiveres.",
  },
  de: {
    tab_thermostats: "Thermostate", tab_groups: "Gruppen", tab_schedule: "Zeitplan",
    loading: "L\u00e4dt\u2026", card_title: "Thermostat-Zeitpl\u00e4ne",
    col_name: "Name", col_entity: "Entit\u00e4t", col_group: "Gruppe", col_members: "Mitglieder", col_actions: "Aktionen",
    btn_save: "Speichern", btn_cancel: "Abbrechen", btn_edit: "Bearbeiten", btn_schedule: "Zeitplan",
    btn_remove: "Entfernen", btn_add: "Hinzuf\u00fcgen",
    btn_add_thermostat: "+ Thermostat hinzuf\u00fcgen", btn_add_group: "+ Gruppe hinzuf\u00fcgen",
    btn_add_interval: "+ Hinzuf\u00fcgen", btn_save_schedule: "Zeitplan speichern", btn_reload: "\u21ba Neu laden",
    none: "\u2014 Keine \u2014", select: "\u2014 Ausw\u00e4hlen \u2014",
    name_placeholder: "Name", group_name_placeholder: "Gruppenname",
    members_count: "{n} Thermostat(e)",
    edit_schedule_for: "Zeitplan bearbeiten f\u00fcr:", schedule_hint: "W\u00e4hlen Sie einen Thermostat oder eine Gruppe zum Bearbeiten.",
    max_intervals: "Max. 6", thermostat_prefix: "[Thermostat]", group_prefix: "[Gruppe]",
    no_climate: "\u2014 keine Klimaentit\u00e4ten gefunden \u2014",
    err_name_entity_required: "Name und Entit\u00e4ts-ID sind erforderlich.",
    err_group_name_required: "Gruppenname ist erforderlich.",
    confirm_remove_thermostat: "Diesen Thermostat entfernen?",
    confirm_remove_group: "Diese Gruppe entfernen? Zugewiesene Thermostate werden aus der Gruppe entfernt.",
    schedule_saved: "Zeitplan gespeichert!", error_prefix: "Fehler: ",
    btn_enable: "Aktivieren", btn_disable: "Deaktivieren", group_disabled: "(deaktiviert)",
    day_monday: "Mo", day_tuesday: "Di", day_wednesday: "Mi", day_thursday: "Do",
    day_friday: "Fr", day_saturday: "Sa", day_sunday: "So",
    editor_entry_id_label: "Konfigurations-Eintrags-ID",
    editor_entry_id_hint: "Zu finden in Einstellungen \u2192 Integrationen \u2192 Thermostat-Planer \u2192 Eintrags-URL",
    editor_title_label: "Kartentitel", editor_title_optional: "(optional)",
    editor_title_placeholder: "Thermostat-Zeitpl\u00e4ne",
    btn_copy_day: "Tag kopieren", btn_paste_day: "Einf\u00fcgen", btn_copy_plan: "Plan kopieren", btn_paste_plan: "Plan einf\u00fcgen",
    thermostat_disabled: "(deaktiviert)",
    schedule_target_disabled: "\u26a0\ufe0f Dieser Thermostat oder diese Gruppe ist deaktiviert \u2014 der Zeitplan l\u00e4uft erst nach Reaktivierung.",
  },
  nl: {
    tab_thermostats: "Thermostaten", tab_groups: "Groepen", tab_schedule: "Schema",
    loading: "Laden\u2026", card_title: "Thermostaat schema's",
    col_name: "Naam", col_entity: "Entiteit", col_group: "Groep", col_members: "Leden", col_actions: "Acties",
    btn_save: "Opslaan", btn_cancel: "Annuleren", btn_edit: "Bewerken", btn_schedule: "Schema",
    btn_remove: "Verwijderen", btn_add: "Toevoegen",
    btn_add_thermostat: "+ Thermostaat toevoegen", btn_add_group: "+ Groep toevoegen",
    btn_add_interval: "+ Toevoegen", btn_save_schedule: "Schema opslaan", btn_reload: "\u21ba Herladen",
    none: "\u2014 Geen \u2014", select: "\u2014 Selecteer \u2014",
    name_placeholder: "Naam", group_name_placeholder: "Groepsnaam",
    members_count: "{n} thermostaat/thermostaten",
    edit_schedule_for: "Schema bewerken voor:", schedule_hint: "Selecteer een thermostaat of groep om het schema te bewerken.",
    max_intervals: "Max. 6", thermostat_prefix: "[Thermostaat]", group_prefix: "[Groep]",
    no_climate: "\u2014 geen klimaatentiteiten gevonden \u2014",
    err_name_entity_required: "Naam en entiteits-ID zijn vereist.",
    err_group_name_required: "Groepsnaam is vereist.",
    confirm_remove_thermostat: "Deze thermostaat verwijderen?",
    confirm_remove_group: "Deze groep verwijderen? Thermostaten worden losgekoppeld.",
    schedule_saved: "Schema opgeslagen!", error_prefix: "Fout: ",
    btn_enable: "Inschakelen", btn_disable: "Uitschakelen", group_disabled: "(uitgeschakeld)",
    day_monday: "Ma", day_tuesday: "Di", day_wednesday: "Wo", day_thursday: "Do",
    day_friday: "Vr", day_saturday: "Za", day_sunday: "Zo",
    editor_entry_id_label: "Configuratie-invoer-ID",
    editor_entry_id_hint: "Te vinden in Instellingen \u2192 Integraties \u2192 Thermostaatplanner \u2192 invoer-URL",
    editor_title_label: "Kaarttitel", editor_title_optional: "(optioneel)",
    editor_title_placeholder: "Thermostaat schema's",
    btn_copy_day: "Dag kopi\u00ebren", btn_paste_day: "Plakken", btn_copy_plan: "Plan kopi\u00ebren", btn_paste_plan: "Plan plakken",
    thermostat_disabled: "(uitgeschakeld)",
    schedule_target_disabled: "\u26a0\ufe0f Deze thermostaat of groep is uitgeschakeld \u2014 het schema wordt pas uitgevoerd na inschakeling.",
  },
  fr: {
    tab_thermostats: "Thermostats", tab_groups: "Groupes", tab_schedule: "Planning",
    loading: "Chargement\u2026", card_title: "Plannings des thermostats",
    col_name: "Nom", col_entity: "Entit\u00e9", col_group: "Groupe", col_members: "Membres", col_actions: "Actions",
    btn_save: "Enregistrer", btn_cancel: "Annuler", btn_edit: "Modifier", btn_schedule: "Planning",
    btn_remove: "Supprimer", btn_add: "Ajouter",
    btn_add_thermostat: "+ Ajouter un thermostat", btn_add_group: "+ Ajouter un groupe",
    btn_add_interval: "+ Ajouter", btn_save_schedule: "Enregistrer le planning", btn_reload: "\u21ba Recharger",
    none: "\u2014 Aucun \u2014", select: "\u2014 S\u00e9lectionner \u2014",
    name_placeholder: "Nom", group_name_placeholder: "Nom du groupe",
    members_count: "{n} thermostat(s)",
    edit_schedule_for: "Modifier le planning pour :", schedule_hint: "S\u00e9lectionnez un thermostat ou un groupe pour modifier son planning.",
    max_intervals: "Max. 6", thermostat_prefix: "[Thermostat]", group_prefix: "[Groupe]",
    no_climate: "\u2014 aucune entit\u00e9 climatique trouv\u00e9e \u2014",
    err_name_entity_required: "Le nom et l'ID d'entit\u00e9 sont obligatoires.",
    err_group_name_required: "Le nom du groupe est obligatoire.",
    confirm_remove_thermostat: "Supprimer ce thermostat ?",
    confirm_remove_group: "Supprimer ce groupe ? Les thermostats associ\u00e9s seront dissoci\u00e9s.",
    schedule_saved: "Planning enregistr\u00e9 !", error_prefix: "Erreur : ",
    day_monday: "Lun", day_tuesday: "Mar", day_wednesday: "Mer", day_thursday: "Jeu",
    day_friday: "Ven", day_saturday: "Sam", day_sunday: "Dim",
    editor_entry_id_label: "ID d'entr\u00e9e de configuration",
    editor_entry_id_hint: "Trouvable dans Param\u00e8tres \u2192 Int\u00e9grations \u2192 Planificateur de thermostat \u2192 URL d'entr\u00e9e",
    editor_title_label: "Titre de la carte", editor_title_optional: "(optionnel)",
    editor_title_placeholder: "Plannings des thermostats",
    btn_copy_day: "Copier le jour", btn_paste_day: "Coller", btn_copy_plan: "Copier le planning", btn_paste_plan: "Coller le planning",
    thermostat_disabled: "(d\u00e9sactiv\u00e9)",
    schedule_target_disabled: "\u26a0\ufe0f Ce thermostat ou ce groupe est d\u00e9sactiv\u00e9 \u2014 son planning ne s\u2019ex\u00e9cutera pas avant r\u00e9activation.",
  },
  es: {
    tab_thermostats: "Termostatos", tab_groups: "Grupos", tab_schedule: "Horario",
    loading: "Cargando\u2026", card_title: "Horarios de termostatos",
    col_name: "Nombre", col_entity: "Entidad", col_group: "Grupo", col_members: "Miembros", col_actions: "Acciones",
    btn_save: "Guardar", btn_cancel: "Cancelar", btn_edit: "Editar", btn_schedule: "Horario",
    btn_remove: "Eliminar", btn_add: "Agregar",
    btn_add_thermostat: "+ Agregar termostato", btn_add_group: "+ Agregar grupo",
    btn_add_interval: "+ Agregar", btn_save_schedule: "Guardar horario", btn_reload: "\u21ba Recargar",
    none: "\u2014 Ninguno \u2014", select: "\u2014 Seleccionar \u2014",
    name_placeholder: "Nombre", group_name_placeholder: "Nombre del grupo",
    members_count: "{n} termostato(s)",
    edit_schedule_for: "Editar horario para:", schedule_hint: "Seleccione un termostato o grupo para editar su horario.",
    max_intervals: "M\u00e1x. 6", thermostat_prefix: "[Termostato]", group_prefix: "[Grupo]",
    no_climate: "\u2014 no se encontraron entidades de clima \u2014",
    err_name_entity_required: "El nombre y el ID de entidad son obligatorios.",
    err_group_name_required: "El nombre del grupo es obligatorio.",
    confirm_remove_thermostat: "\u00bfEliminar este termostato?",
    confirm_remove_group: "\u00bfEliminar este grupo? Los termostatos asignados quedar\u00e1n sin grupo.",
    schedule_saved: "\u00a1Horario guardado!", error_prefix: "Error: ",
    day_monday: "Lun", day_tuesday: "Mar", day_wednesday: "Mi\u00e9", day_thursday: "Jue",
    day_friday: "Vie", day_saturday: "S\u00e1b", day_sunday: "Dom",
    editor_entry_id_label: "ID de entrada de configuraci\u00f3n",
    editor_entry_id_hint: "Enc\u00faéntralo en Ajustes \u2192 Integraciones \u2192 Planificador de termostato \u2192 URL de entrada",
    editor_title_label: "T\u00edtulo de la tarjeta", editor_title_optional: "(opcional)",
    editor_title_placeholder: "Horarios de termostatos",
    btn_copy_day: "Copiar d\u00eda", btn_paste_day: "Pegar", btn_copy_plan: "Copiar plan", btn_paste_plan: "Pegar plan",
    thermostat_disabled: "(desactivado)",
    schedule_target_disabled: "\u26a0\ufe0f Este termostato o grupo est\u00e1 desactivado \u2014 su horario no se ejecutar\u00e1 hasta que se reactive.",
  },
  sv: {
    tab_thermostats: "Termostater", tab_groups: "Grupper", tab_schedule: "Schema",
    loading: "Laddar\u2026", card_title: "Termostatscheman",
    col_name: "Namn", col_entity: "Entitet", col_group: "Grupp", col_members: "Medlemmar", col_actions: "\u00c5tg\u00e4rder",
    btn_save: "Spara", btn_cancel: "Avbryt", btn_edit: "Redigera", btn_schedule: "Schema",
    btn_remove: "Ta bort", btn_add: "L\u00e4gg till",
    btn_add_thermostat: "+ L\u00e4gg till termostat", btn_add_group: "+ L\u00e4gg till grupp",
    btn_add_interval: "+ L\u00e4gg till", btn_save_schedule: "Spara schema", btn_reload: "\u21ba Ladda om",
    none: "\u2014 Ingen \u2014", select: "\u2014 V\u00e4lj \u2014",
    name_placeholder: "Namn", group_name_placeholder: "Gruppnamn",
    members_count: "{n} termostat(er)",
    edit_schedule_for: "Redigera schema f\u00f6r:", schedule_hint: "V\u00e4lj en termostat eller grupp f\u00f6r att redigera dess schema.",
    max_intervals: "Max 6", thermostat_prefix: "[Termostat]", group_prefix: "[Grupp]",
    no_climate: "\u2014 inga klimatentiteter hittades \u2014",
    err_name_entity_required: "Namn och enhets-ID kr\u00e4vs.",
    err_group_name_required: "Gruppnamn kr\u00e4vs.",
    confirm_remove_thermostat: "Ta bort denna termostat?",
    confirm_remove_group: "Ta bort denna grupp? Termostater tilldelade den blir ogruperade.",
    schedule_saved: "Schema sparat!", error_prefix: "Fel: ",
    btn_enable: "Aktivera", btn_disable: "Inaktivera", group_disabled: "(inaktiverad)",
    day_monday: "M\u00e5n", day_tuesday: "Tis", day_wednesday: "Ons", day_thursday: "Tor",
    day_friday: "Fre", day_saturday: "L\u00f6r", day_sunday: "S\u00f6n",
    editor_entry_id_label: "Konfigurationspost-ID",
    editor_entry_id_hint: "Finns i Inst\u00e4llningar \u2192 Integrationer \u2192 Termostatschema\u00e4ggare \u2192 post-URL",
    editor_title_label: "Korttitel", editor_title_optional: "(valfri)",
    editor_title_placeholder: "Termostatscheman",
    btn_copy_day: "Kopiera dag", btn_paste_day: "Klistra in", btn_copy_plan: "Kopiera schema", btn_paste_plan: "Klistra in schema",
    thermostat_disabled: "(inaktiverad)",
    schedule_target_disabled: "\u26a0\ufe0f Denna termostat eller grupp \u00e4r inaktiverad \u2014 schemat k\u00f6rs inte f\u00f6rr\u00e4n det aktiveras igen.",
  },
  nb: {
    tab_thermostats: "Termostater", tab_groups: "Grupper", tab_schedule: "Tidsplan",
    loading: "Laster\u2026", card_title: "Termostatplaner",
    col_name: "Navn", col_entity: "Enhet", col_group: "Gruppe", col_members: "Medlemmer", col_actions: "Handlinger",
    btn_save: "Lagre", btn_cancel: "Avbryt", btn_edit: "Rediger", btn_schedule: "Tidsplan",
    btn_remove: "Fjern", btn_add: "Legg til",
    btn_add_thermostat: "+ Legg til termostat", btn_add_group: "+ Legg til gruppe",
    btn_add_interval: "+ Legg til", btn_save_schedule: "Lagre tidsplan", btn_reload: "\u21ba Last p\u00e5 nytt",
    none: "\u2014 Ingen \u2014", select: "\u2014 Velg \u2014",
    name_placeholder: "Navn", group_name_placeholder: "Gruppenavn",
    members_count: "{n} termostat(er)",
    edit_schedule_for: "Rediger tidsplan for:", schedule_hint: "Velg en termostat eller gruppe for \u00e5 redigere tidsplanen.",
    max_intervals: "Maks 6", thermostat_prefix: "[Termostat]", group_prefix: "[Gruppe]",
    no_climate: "\u2014 ingen klimaenheter funnet \u2014",
    err_name_entity_required: "Navn og enhets-ID er p\u00e5krevd.",
    err_group_name_required: "Gruppenavn er p\u00e5krevd.",
    confirm_remove_thermostat: "Fjerne denne termostaten?",
    confirm_remove_group: "Fjerne denne gruppen? Termostater tilordnet den blir ugruperte.",
    schedule_saved: "Tidsplan lagret!", error_prefix: "Feil: ",
    btn_enable: "Aktiver", btn_disable: "Deaktiver", group_disabled: "(deaktivert)",
    day_monday: "Man", day_tuesday: "Tir", day_wednesday: "Ons", day_thursday: "Tor",
    day_friday: "Fre", day_saturday: "L\u00f8r", day_sunday: "S\u00f8n",
    editor_entry_id_label: "Konfigurasjonsoppf\u00f8ring-ID",
    editor_entry_id_hint: "Finnes i Innstillinger \u2192 Integrasjoner \u2192 Termostatplanlegger \u2192 oppf\u00f8ring-URL",
    editor_title_label: "Korttittel", editor_title_optional: "(valgfri)",
    editor_title_placeholder: "Termostatplaner",
    btn_copy_day: "Kopier dag", btn_paste_day: "Lim inn", btn_copy_plan: "Kopier plan", btn_paste_plan: "Lim inn plan",
    thermostat_disabled: "(deaktivert)",
    schedule_target_disabled: "\u26a0\ufe0f Denne termostaten eller gruppen er deaktivert \u2014 planen kj\u00f8rer ikke f\u00f8r den aktiveres p\u00e5 nytt.",
  },
};

function _translate(hass, key, vars) {
  const lang = (hass?.locale?.language || hass?.language || "en").split("-")[0].toLowerCase();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) str = str.replace(`{${k}}`, String(v));
  return str;
}

// ---------------------------------------------------------------------------
// Minimal LitElement-like base (no external deps needed in HACS-less custom cards)
// We use native HTMLElement + manual re-render on state change.
// ---------------------------------------------------------------------------

class ThermostatScheduleCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._data = { thermostats: [], groups: [], schedules: {} };
    this._tab = "thermostats"; // "thermostats" | "groups" | "schedule"
    this._scheduleTarget = null; // id of thermostat or group being edited
    this._editSchedule = {}; // local working copy of schedule being edited
    this._loading = false;
    this._error = null;

    // Inline-edit state
    this._editThermId = null;
    this._editThermData = {};
    this._editGroupId = null;
    this._editGroupName = "";

    // Add-form visibility
    this._showAddTherm = false;
    this._showAddGroup = false;
    this._addThermData = { name: "", entity_id: "", group_id: "" };
    this._addGroupName = "";
    this._modal = null; // { type: "alert"|"confirm", message, resolve }
    this._copiedDay = null;   // array of intervals for copy-day
    this._copiedPlan = null;  // full week schedule for copy-plan
  }

  // -------------------------------------------------------------------------
  // Card boilerplate
  // -------------------------------------------------------------------------

  setConfig(config) {
    if (!config.entry_id) throw new Error("thermostat-schedule-card: 'entry_id' is required");
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._loaded) {
      this._loaded = true;
      this._loadData();
      return;
    }
    // Debounced re-render so the card stays fresh (language, theme, climate
    // entity state) without flooding the DOM on every HA state-change tick.
    if (!this._renderDebounce) {
      this._renderDebounce = setTimeout(() => {
        this._renderDebounce = null;
        if (this._loading || this._modal) return;
        // Don't blow away the DOM while the user has a dropdown/input focused.
        if (this.shadowRoot.activeElement) return;
        this._render();
      }, 250);
    }
  }

  static getConfigElement() {
    return document.createElement("thermostat-schedule-card-editor");
  }

  static getStubConfig() {
    return { entry_id: "" };
  }

  // -------------------------------------------------------------------------
  // Data loading
  // -------------------------------------------------------------------------

  async _loadData() {
    this._loading = true;
    this._error = null;
    this._render();
    try {
      const result = await this._send("thermostat_scheduler/get_config", {});
      this._data = result;
    } catch (e) {
      this._error = e.message || String(e);
    }
    this._loading = false;
    this._render();
  }

  async _send(type, extra) {
    return this._hass.connection.sendMessagePromise({
      type,
      entry_id: this._config.entry_id,
      ...extra,
    });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  connectedCallback() {
    this._render();
  }

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = `
      <style>${this._css()}</style>
      <ha-card header="${this._config.title || this._t("card_title")}">
        <div class="card-content">
          ${this._loading ? `<div class='loading'>${this._t("loading")}</div>` : ""}
          ${this._error ? `<div class='error'>${this._escHtml(this._error)}</div>` : ""}
          ${!this._loading ? this._renderTabs() : ""}
          ${!this._loading ? this._renderTabContent() : ""}
        </div>
      </ha-card>
      ${this._modal ? this._renderModalHtml() : ""}
    `;
    this._attachListeners();
  }

  _renderTabs() {
    const tabs = [
      { id: "thermostats", label: this._t("tab_thermostats") },
      { id: "groups", label: this._t("tab_groups") },
      { id: "schedule", label: this._t("tab_schedule") },
    ];
    return `
      <div class="tabs">
        ${tabs.map(t => `
          <button class="tab ${this._tab === t.id ? "active" : ""}" data-tab="${t.id}">${t.label}</button>
        `).join("")}
      </div>
    `;
  }

  _renderTabContent() {
    if (this._tab === "thermostats") return this._renderThermostats();
    if (this._tab === "groups") return this._renderGroups();
    if (this._tab === "schedule") return this._renderSchedule();
    return "";
  }

  // -------------------------------------------------------------------------
  // Thermostats tab
  // -------------------------------------------------------------------------

  _renderThermostats() {
    const { thermostats, groups } = this._data;
    const groupMap = Object.fromEntries(groups.map(g => [g.id, g.name]));

    const rows = thermostats.map(t => {
      const isEditing = this._editThermId === t.id;
      if (isEditing) {
        const climateOpts = this._climateEntityOptions(this._editThermData.entity_id);
        return `
          <tr class="edit-row">
            <td><input class="edit-name" data-id="${t.id}" value="${this._escHtml(this._editThermData.name)}"></td>
            <td><select class="edit-entity" data-id="${t.id}">${climateOpts}</select></td>
            <td>
              <select class="edit-group" data-id="${t.id}">
                <option value="">${this._t("none")}</option>
                ${groups.map(g => `<option value="${g.id}" ${this._editThermData.group_id === g.id ? "selected" : ""}>${this._escHtml(g.name)}</option>`).join("")}
              </select>
            </td>
            <td>
              <button class="btn-save-therm" data-id="${t.id}">${this._t("btn_save")}</button>
              <button class="btn-cancel-therm" data-id="${t.id}">${this._t("btn_cancel")}</button>
            </td>
          </tr>`;
      }
      const isDisabled = !t.group_id && t.enabled === false;
      return `
        <tr class="${isDisabled ? "therm-disabled" : ""}">
          <td>${this._escHtml(t.name)}${isDisabled ? ` <span class="disabled-badge">${this._t("thermostat_disabled")}</span>` : ""}</td>
          <td><code>${this._escHtml(t.entity_id)}</code></td>
          <td>${t.group_id ? this._escHtml(groupMap[t.group_id] || t.group_id) : "—"}</td>
          <td>
            <button class="btn-edit-therm" data-id="${t.id}">${this._t("btn_edit")}</button>
            ${!t.group_id ? `<button class="btn-toggle-therm" data-id="${t.id}" data-enabled="${t.enabled === false ? "false" : "true"}">${t.enabled === false ? this._t("btn_enable") : this._t("btn_disable")}</button>` : ""}
            <button class="btn-schedule-therm" data-id="${t.id}">${this._t("btn_schedule")}</button>
            <button class="btn-del-therm btn-danger" data-id="${t.id}">${this._t("btn_remove")}</button>
          </td>
        </tr>`;
    }).join("");

    const addForm = this._showAddTherm ? `
      <tr class="add-row">
        <td><input id="add-therm-name" placeholder="${this._t("name_placeholder")}" value="${this._escHtml(this._addThermData.name)}"></td>
        <td><select id="add-therm-entity">${this._climateEntityOptions(this._addThermData.entity_id)}</select></td>
        <td>
          <select id="add-therm-group">
            <option value="">${this._t("none")}</option>
            ${groups.map(g => `<option value="${g.id}" ${this._addThermData.group_id === g.id ? "selected" : ""}>${this._escHtml(g.name)}</option>`).join("")}
          </select>
        </td>
        <td>
          <button id="btn-confirm-add-therm">${this._t("btn_add")}</button>
          <button id="btn-cancel-add-therm">${this._t("btn_cancel")}</button>
        </td>
      </tr>` : "";

    return `
      <div class="section">
        <table class="data-table">
          <thead><tr><th>${this._t("col_name")}</th><th>${this._t("col_entity")}</th><th>${this._t("col_group")}</th><th>${this._t("col_actions")}</th></tr></thead>
          <tbody>${rows}${addForm}</tbody>
        </table>
        ${!this._showAddTherm ? `<button id="btn-show-add-therm" class="btn-add">${this._t("btn_add_thermostat")}</button>` : ""}
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Groups tab
  // -------------------------------------------------------------------------

  _renderGroups() {
    const { groups, thermostats } = this._data;
    const memberCount = (groupId) => thermostats.filter(t => t.group_id === groupId).length;

    const rows = groups.map(g => {
      if (this._editGroupId === g.id) {
        return `
          <tr class="edit-row">
            <td><input class="edit-group-name" data-id="${g.id}" value="${this._escHtml(this._editGroupName)}"></td>
            <td>${this._t("members_count", { n: memberCount(g.id) })}</td>
            <td>
              <button class="btn-save-group" data-id="${g.id}">${this._t("btn_save")}</button>
              <button class="btn-cancel-group" data-id="${g.id}">${this._t("btn_cancel")}</button>
            </td>
          </tr>`;
      }
      return `
        <tr class="${g.enabled === false ? "group-disabled" : ""}">
          <td>${this._escHtml(g.name)}${g.enabled === false ? ` <span class="disabled-badge">${this._t("group_disabled")}</span>` : ""}</td>
          <td>${this._t("members_count", { n: memberCount(g.id) })}</td>
          <td>
            <button class="btn-edit-group" data-id="${g.id}">${this._t("btn_edit")}</button>
            <button class="btn-toggle-group" data-id="${g.id}" data-enabled="${g.enabled === false ? "false" : "true"}">${g.enabled === false ? this._t("btn_enable") : this._t("btn_disable")}</button>
            <button class="btn-schedule-group" data-id="${g.id}">${this._t("btn_schedule")}</button>
            <button class="btn-del-group btn-danger" data-id="${g.id}">${this._t("btn_remove")}</button>
          </td>
        </tr>`;
    }).join("");

    const addForm = this._showAddGroup ? `
      <tr class="add-row">
        <td colspan="2"><input id="add-group-name" placeholder="${this._t("group_name_placeholder")}" value="${this._escHtml(this._addGroupName)}"></td>
        <td>
          <button id="btn-confirm-add-group">${this._t("btn_add")}</button>
          <button id="btn-cancel-add-group">${this._t("btn_cancel")}</button>
        </td>
      </tr>` : "";

    return `
      <div class="section">
        <table class="data-table">
          <thead><tr><th>${this._t("col_name")}</th><th>${this._t("col_members")}</th><th>${this._t("col_actions")}</th></tr></thead>
          <tbody>${rows}${addForm}</tbody>
        </table>
        ${!this._showAddGroup ? `<button id="btn-show-add-group" class="btn-add">${this._t("btn_add_group")}</button>` : ""}
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Schedule tab
  // -------------------------------------------------------------------------

  _renderSchedule() {
    const { thermostats, groups } = this._data;

    const targetOptions = [
      ...thermostats.filter(t => !t.group_id).map(t => {
        const dis = t.enabled === false;
        return `<option value="t:${t.id}" ${this._scheduleTarget === "t:"+t.id ? "selected" : ""}>${this._t("thermostat_prefix")} ${this._escHtml(t.name)}${dis ? " " + this._t("thermostat_disabled") : ""}</option>`;
      }),
      ...groups.map(g => {
        const dis = g.enabled === false;
        return `<option value="g:${g.id}" ${this._scheduleTarget === "g:"+g.id ? "selected" : ""}>${this._t("group_prefix")} ${this._escHtml(g.name)}${dis ? " " + this._t("group_disabled") : ""}</option>`;
      }),
    ].join("");

    const selectedDisabled = (() => {
      if (!this._scheduleTarget) return false;
      if (this._scheduleTarget.startsWith("t:")) {
        const t = thermostats.find(x => "t:"+x.id === this._scheduleTarget);
        return t?.enabled === false;
      }
      const g = groups.find(x => "g:"+x.id === this._scheduleTarget);
      return g?.enabled === false;
    })();

    const targetSelect = `
      <div class="schedule-target-row">
        <label>${this._t("edit_schedule_for")}</label>
        <select id="schedule-target-select">
          <option value="">${this._t("select")}</option>
          ${targetOptions}
        </select>
      </div>
      ${selectedDisabled ? `<div class="schedule-disabled-warning">${this._t("schedule_target_disabled")}</div>` : ""}`;

    if (!this._scheduleTarget) {
      return `<div class="section">${targetSelect}<p class="hint">${this._t("schedule_hint")}</p></div>`;
    }

    const scheduleGrid = DAYS.map(day => {
      const intervals = (this._editSchedule[day] || []);
      const rows = intervals.map((iv, idx) => `
        <div class="interval-row" data-day="${day}" data-idx="${idx}">
          <input type="time" class="iv-start" data-day="${day}" data-idx="${idx}" value="${this._escHtml(iv.start || "")}">
          <input type="number" step="0.5" min="-20" max="35" class="iv-temp" data-day="${day}" data-idx="${idx}" value="${iv.temperature != null ? iv.temperature : ""}" style="width:60px">
          <span class="unit">°C</span>
          <button class="btn-del-interval btn-danger" data-day="${day}" data-idx="${idx}">✕</button>
        </div>`).join("");

      const canAdd = intervals.length < 6;
      return `
        <div class="day-block">
          <div class="day-label">${this._t("day_" + day)}</div>
          ${rows}
          ${canAdd ? `<button class="btn-add-interval" data-day="${day}">${this._t("btn_add_interval")}</button>` : `<span class="hint">${this._t("max_intervals")}</span>`}
          <div class="day-copy-actions">
            <button class="btn-copy-day" data-day="${day}">${this._t("btn_copy_day")}</button>
            ${this._copiedDay ? `<button class="btn-paste-day" data-day="${day}">${this._t("btn_paste_day")}</button>` : ""}
          </div>
        </div>`;
    }).join("");

    return `
      <div class="section">
        ${targetSelect}
        <div class="schedule-grid">${scheduleGrid}</div>
        <div class="schedule-actions">
          <button id="btn-save-schedule" class="btn-primary">${this._t("btn_save_schedule")}</button>
          <button id="btn-reload-schedule">${this._t("btn_reload")}</button>
          <button id="btn-copy-plan">${this._t("btn_copy_plan")}</button>
          ${this._copiedPlan ? `<button id="btn-paste-plan">${this._t("btn_paste_plan")}</button>` : ""}
        </div>
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Event wiring
  // -------------------------------------------------------------------------

  _attachListeners() {
    const s = this.shadowRoot;
    this._attachModalListeners(s);
    s.querySelectorAll(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        this._tab = btn.dataset.tab;
        this._editThermId = null;
        this._editGroupId = null;
        this._showAddTherm = false;
        this._showAddGroup = false;
        this._render();
      });
    });

    if (this._tab === "thermostats") this._attachThermListeners(s);
    if (this._tab === "groups") this._attachGroupListeners(s);
    if (this._tab === "schedule") this._attachScheduleListeners(s);
  }

  _attachThermListeners(s) {
    // Show add form
    const showBtn = s.querySelector("#btn-show-add-therm");
    if (showBtn) showBtn.addEventListener("click", () => { this._showAddTherm = true; this._render(); });

    // Cancel add form
    const cancelAdd = s.querySelector("#btn-cancel-add-therm");
    if (cancelAdd) cancelAdd.addEventListener("click", () => { this._showAddTherm = false; this._addThermData = { name: "", entity_id: "", group_id: "" }; this._render(); });

    // Confirm add
    const confirmAdd = s.querySelector("#btn-confirm-add-therm");
    if (confirmAdd) confirmAdd.addEventListener("click", async () => {
      const name = s.querySelector("#add-therm-name")?.value?.trim() || "";
      const entity_id = s.querySelector("#add-therm-entity")?.value?.trim() || "";
      const group_id = s.querySelector("#add-therm-group")?.value || null;
      if (!name || !entity_id) { await this._showAlert(this._t("err_name_entity_required")); return; }
      this._addThermData = { name, entity_id, group_id };
      this._doAddThermostat(name, entity_id, group_id || null);
    });

    // Edit buttons
    s.querySelectorAll(".btn-edit-therm").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const t = this._data.thermostats.find(x => x.id === id);
        if (!t) return;
        this._editThermId = id;
        this._editThermData = { ...t };
        this._render();
      });
    });

    // Save edit
    s.querySelectorAll(".btn-save-therm").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nameEl = s.querySelector(`.edit-name[data-id="${id}"]`);
        const entityEl = s.querySelector(`.edit-entity[data-id="${id}"]`);
        const groupEl = s.querySelector(`.edit-group[data-id="${id}"]`);
        const name = nameEl?.value?.trim() || "";
        const entity_id = entityEl?.value?.trim() || "";
        const group_id = groupEl?.value || null;
        if (!name || !entity_id) { await this._showAlert(this._t("err_name_entity_required")); return; }
        this._doUpdateThermostat(id, name, entity_id, group_id);
      });
    });

    // Cancel edit
    s.querySelectorAll(".btn-cancel-therm").forEach(btn => {
      btn.addEventListener("click", () => { this._editThermId = null; this._render(); });
    });

    // Delete
    s.querySelectorAll(".btn-del-therm").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!await this._showConfirm(this._t("confirm_remove_thermostat"))) return;
        this._doRemoveThermostat(btn.dataset.id);
      });
    });

    // Toggle enable/disable
    s.querySelectorAll(".btn-toggle-therm").forEach(btn => {
      btn.addEventListener("click", () => {
        const enabled = btn.dataset.enabled !== "false";
        this._doToggleThermostat(btn.dataset.id, !enabled);
      });
    });

    // Open schedule
    s.querySelectorAll(".btn-schedule-therm").forEach(btn => {
      btn.addEventListener("click", () => {
        const t = this._data.thermostats.find(x => x.id === btn.dataset.id);
        if (!t) return;
        this._tab = "schedule";
        // Grouped thermostats share the group schedule; navigate there instead.
        this._scheduleTarget = t.group_id ? "g:" + t.group_id : "t:" + t.id;
        this._loadScheduleForTarget();
        this._render();
      });
    });
  }

  _attachGroupListeners(s) {
    const showBtn = s.querySelector("#btn-show-add-group");
    if (showBtn) showBtn.addEventListener("click", () => { this._showAddGroup = true; this._render(); });

    const cancelAdd = s.querySelector("#btn-cancel-add-group");
    if (cancelAdd) cancelAdd.addEventListener("click", () => { this._showAddGroup = false; this._addGroupName = ""; this._render(); });

    const confirmAdd = s.querySelector("#btn-confirm-add-group");
    if (confirmAdd) confirmAdd.addEventListener("click", async () => {
      const name = s.querySelector("#add-group-name")?.value?.trim() || "";
      if (!name) { await this._showAlert(this._t("err_group_name_required")); return; }
      this._addGroupName = name;
      this._doAddGroup(name);
    });

    s.querySelectorAll(".btn-edit-group").forEach(btn => {
      btn.addEventListener("click", () => {
        const g = this._data.groups.find(x => x.id === btn.dataset.id);
        if (!g) return;
        this._editGroupId = g.id;
        this._editGroupName = g.name;
        this._render();
      });
    });

    s.querySelectorAll(".btn-save-group").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nameEl = s.querySelector(`.edit-group-name[data-id="${id}"]`);
        const name = nameEl?.value?.trim() || "";
        if (!name) { await this._showAlert(this._t("err_group_name_required")); return; }
        this._doUpdateGroup(id, name);
      });
    });

    s.querySelectorAll(".btn-cancel-group").forEach(btn => {
      btn.addEventListener("click", () => { this._editGroupId = null; this._render(); });
    });

    s.querySelectorAll(".btn-del-group").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!await this._showConfirm(this._t("confirm_remove_group"))) return;
        this._doRemoveGroup(btn.dataset.id);
      });
    });

    s.querySelectorAll(".btn-toggle-group").forEach(btn => {
      btn.addEventListener("click", () => {
        const enabled = btn.dataset.enabled !== "false";
        this._doToggleGroup(btn.dataset.id, !enabled);
      });
    });

    s.querySelectorAll(".btn-schedule-group").forEach(btn => {
      btn.addEventListener("click", () => {
        this._tab = "schedule";
        this._scheduleTarget = "g:" + btn.dataset.id;
        this._loadScheduleForTarget();
        this._render();
      });
    });
  }

  _attachScheduleListeners(s) {
    // Target select
    const targetSel = s.querySelector("#schedule-target-select");
    if (targetSel) {
      targetSel.addEventListener("change", () => {
        this._scheduleTarget = targetSel.value || null;
        this._loadScheduleForTarget();
        this._render();
      });
    }

    // Add interval button
    s.querySelectorAll(".btn-add-interval").forEach(btn => {
      btn.addEventListener("click", () => {
        const day = btn.dataset.day;
        if (!this._editSchedule[day]) this._editSchedule[day] = [];
        this._editSchedule[day].push({ start: "08:00", temperature: 21 });
        this._render();
      });
    });

    // Delete interval
    s.querySelectorAll(".btn-del-interval").forEach(btn => {
      btn.addEventListener("click", () => {
        const { day, idx } = btn.dataset;
        this._editSchedule[day].splice(parseInt(idx), 1);
        this._render();
      });
    });

    // Interval field changes — update local state on change
    s.querySelectorAll(".iv-start, .iv-temp").forEach(input => {
      input.addEventListener("change", () => {
        const { day, idx } = input.dataset;
        const i = parseInt(idx);
        if (!this._editSchedule[day] || !this._editSchedule[day][i]) return;
        if (input.classList.contains("iv-start")) this._editSchedule[day][i].start = input.value;
        else if (input.classList.contains("iv-temp")) this._editSchedule[day][i].temperature = parseFloat(input.value);
      });
    });

    // Save schedule
    const saveBtn = s.querySelector("#btn-save-schedule");
    if (saveBtn) saveBtn.addEventListener("click", () => this._doSaveSchedule());

    // Reload schedule
    const reloadBtn = s.querySelector("#btn-reload-schedule");
    if (reloadBtn) reloadBtn.addEventListener("click", () => { this._loadScheduleForTarget(); this._render(); });

    // Copy day
    s.querySelectorAll(".btn-copy-day").forEach(btn => {
      btn.addEventListener("click", () => {
        this._copiedDay = this._collectDayFromDOM(btn.dataset.day).map(iv => ({ ...iv }));
        this._render();
      });
    });

    // Paste day
    s.querySelectorAll(".btn-paste-day").forEach(btn => {
      btn.addEventListener("click", () => {
        const day = btn.dataset.day;
        if (this._copiedDay) {
          this._editSchedule[day] = this._copiedDay.map(iv => ({ ...iv }));
          this._render();
        }
      });
    });

    // Copy plan
    const copyPlanBtn = s.querySelector("#btn-copy-plan");
    if (copyPlanBtn) copyPlanBtn.addEventListener("click", () => {
      this._copiedPlan = DAYS.reduce((acc, day) => {
        acc[day] = this._collectDayFromDOM(day).map(iv => ({ ...iv }));
        return acc;
      }, {});
      this._render();
    });

    // Paste plan
    const pastePlanBtn = s.querySelector("#btn-paste-plan");
    if (pastePlanBtn) pastePlanBtn.addEventListener("click", () => {
      if (this._copiedPlan) {
        DAYS.forEach(day => {
          this._editSchedule[day] = (this._copiedPlan[day] || []).map(iv => ({ ...iv }));
        });
        this._render();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Derived helpers
  // -------------------------------------------------------------------------

  _targetId() {
    // "t:<uuid>" → thermostat's own id
    // "g:<uuid>" → group's id
    if (!this._scheduleTarget) return null;
    const [, id] = this._scheduleTarget.split(":");
    return id;
  }

  _loadScheduleForTarget() {
    const id = this._targetId();
    if (!id) { this._editSchedule = {}; return; }
    const stored = this._data.schedules[id] || {};
    // Deep-clone so edits don't mutate the source
    this._editSchedule = DAYS.reduce((acc, day) => {
      acc[day] = (stored[day] || []).map(iv => ({ ...iv }));
      return acc;
    }, {});
  }

  _collectDayFromDOM(day) {
    const s = this.shadowRoot;
    const intervals = this._editSchedule[day] || [];
    return intervals.map((iv, idx) => {
      const startEl = s.querySelector(`.iv-start[data-day="${day}"][data-idx="${idx}"]`);
      const tempEl = s.querySelector(`.iv-temp[data-day="${day}"][data-idx="${idx}"]`);
      return {
        start: startEl ? startEl.value : iv.start,
        temperature: tempEl ? parseFloat(tempEl.value) : iv.temperature,
      };
    });
  }

  // -------------------------------------------------------------------------
  // Async actions
  // -------------------------------------------------------------------------

  async _doAddThermostat(name, entity_id, group_id) {
    try {
      const res = await this._send("thermostat_scheduler/add_thermostat", { name, entity_id, group_id });
      this._data.thermostats = res.thermostats;
      this._showAddTherm = false;
      this._addThermData = { name: "", entity_id: "", group_id: "" };
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doUpdateThermostat(id, name, entity_id, group_id) {
    try {
      const res = await this._send("thermostat_scheduler/update_thermostat", { thermostat_id: id, name, entity_id, group_id });
      this._data.thermostats = res.thermostats;
      this._editThermId = null;
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doRemoveThermostat(id) {
    try {
      const res = await this._send("thermostat_scheduler/remove_thermostat", { thermostat_id: id });
      this._data.thermostats = res.thermostats;
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doAddGroup(name) {
    try {
      const res = await this._send("thermostat_scheduler/add_group", { name });
      this._data.groups = res.groups;
      this._showAddGroup = false;
      this._addGroupName = "";
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doUpdateGroup(id, name) {
    try {
      const res = await this._send("thermostat_scheduler/update_group", { group_id: id, name });
      this._data.groups = res.groups;
      this._editGroupId = null;
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doToggleThermostat(id, enabled) {
    try {
      const res = await this._send("thermostat_scheduler/update_thermostat", { thermostat_id: id, enabled });
      this._data.thermostats = res.thermostats;
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doToggleGroup(id, enabled) {
    try {
      const res = await this._send("thermostat_scheduler/update_group", { group_id: id, enabled });
      this._data.groups = res.groups;
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doRemoveGroup(id) {
    try {
      const res = await this._send("thermostat_scheduler/remove_group", { group_id: id });
      this._data.groups = res.groups;
      this._data.thermostats = res.thermostats;
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  async _doSaveSchedule() {
    const targetId = this._targetId();
    if (!targetId) return;
    try {
      // Collect current input values directly from the DOM before sending
      const s = this.shadowRoot;
      const schedule = {};
      for (const day of DAYS) {
        const intervals = this._editSchedule[day] || [];
        schedule[day] = intervals.map((iv, idx) => {
          const startEl = s.querySelector(`.iv-start[data-day="${day}"][data-idx="${idx}"]`);
          const tempEl = s.querySelector(`.iv-temp[data-day="${day}"][data-idx="${idx}"]`);
          return {
            start: startEl ? startEl.value : iv.start,
            temperature: tempEl ? parseFloat(tempEl.value) : iv.temperature,
          };
        }).filter(iv => iv.start && !isNaN(iv.temperature));
      }
      const res = await this._send("thermostat_scheduler/set_schedule", { target_id: targetId, schedule });
      this._data.schedules[res.target_id] = res.schedule;
      this._loadScheduleForTarget();
      await this._showAlert(this._t("schedule_saved"));
    } catch (e) { await this._showAlert(this._t("error_prefix") + (e.message || e)); }
    this._render();
  }

  // -------------------------------------------------------------------------
  // Modal helpers
  // -------------------------------------------------------------------------

  _showAlert(message) {
    return new Promise(resolve => {
      this._modal = { type: "alert", message, resolve };
      this._render();
    });
  }

  _showConfirm(message) {
    return new Promise(resolve => {
      this._modal = { type: "confirm", message, resolve };
      this._render();
    });
  }

  _renderModalHtml() {
    const m = this._modal;
    const isConfirm = m.type === "confirm";
    return `
      <div class="ts-overlay" id="ts-modal-overlay">
        <div class="ts-dialog" role="dialog" aria-modal="true">
          <p class="ts-dialog-msg">${this._escHtml(m.message)}</p>
          <div class="ts-dialog-btns">
            ${isConfirm ? `<button id="ts-modal-cancel" class="ts-btn ts-btn-cancel">${this._t("btn_cancel")}</button>` : ""}
            <button id="ts-modal-ok" class="ts-btn ts-btn-ok${isConfirm ? " ts-btn-danger" : ""}">${this._t("btn_ok")}</button>
          </div>
        </div>
      </div>`;
  }

  _attachModalListeners(s) {
    const overlay = s.querySelector("#ts-modal-overlay");
    if (!overlay) return;
    const ok = s.querySelector("#ts-modal-ok");
    const cancel = s.querySelector("#ts-modal-cancel");
    const close = (result) => {
      const resolve = this._modal?.resolve;
      this._modal = null;
      this._render();
      if (resolve) resolve(result);
    };
    if (ok) ok.addEventListener("click", () => close(true));
    if (cancel) cancel.addEventListener("click", () => close(false));
    overlay.addEventListener("click", e => { if (e.target === overlay) close(false); });
  }

  // -------------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------------

  _escHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  _t(key, vars) { return _translate(this._hass, key, vars); }

  _climateEntityOptions(selectedId) {
    const entities = Object.keys(this._hass?.states ?? {})
      .filter(id => id.startsWith("climate."))
      .sort();
    if (entities.length === 0) {
      return `<option value="">${this._t("no_climate")}</option>`;
    }
    return entities.map(id =>
      `<option value="${this._escHtml(id)}" ${id === selectedId ? "selected" : ""}>${this._escHtml(id)}</option>`
    ).join("");
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  _css() {
    return `
      :host { display: block; }
      ha-card { border-radius: var(--ha-card-border-radius, 12px); }
      .card-content { padding: 0 16px 16px; }

      .tabs { display: flex; gap: 4px; margin-bottom: 12px; padding-top: 4px; }
      .tab {
        flex: 1; padding: 8px; border: none; border-radius: 8px;
        background: var(--secondary-background-color, #eee);
        cursor: pointer; font-size: 14px;
        transition: background 0.15s;
      }
      .tab.active {
        background: var(--primary-color, #03a9f4);
        color: #fff; font-weight: bold;
      }

      .section { overflow-x: auto; }
      .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .data-table th, .data-table td { padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--divider-color, #ddd); }
      .data-table th { font-weight: 600; color: var(--secondary-text-color, #666); font-size: 12px; text-transform: uppercase; }
      .edit-row td { background: var(--secondary-background-color, #f5f5f5); }
      .add-row td { background: var(--secondary-background-color, #f9f9f9); }

      input[type="text"], input:not([type]), input[type="number"], select {
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px; padding: 4px 6px; font-size: 13px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #000);
        width: 100%; box-sizing: border-box;
      }
      input[type="time"] {
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px; padding: 4px 6px; font-size: 13px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #000);
      }

      button {
        padding: 5px 10px; border: none; border-radius: 4px;
        cursor: pointer; font-size: 12px; margin: 1px;
        background: var(--secondary-background-color, #e0e0e0);
        color: var(--primary-text-color, #000);
        transition: opacity 0.15s;
      }
      button:hover { opacity: 0.8; }
      .btn-danger { background: #e53935; color: #fff; }
      .btn-add { margin-top: 8px; background: var(--primary-color, #03a9f4); color: #fff; }
      .btn-primary { background: var(--primary-color, #03a9f4); color: #fff; padding: 8px 16px; font-size: 14px; }

      code { font-size: 11px; background: var(--code-editor-background-color, rgba(128,128,128,0.15)); color: var(--primary-text-color); padding: 2px 4px; border-radius: 3px; }
      .loading, .hint { color: var(--secondary-text-color, #999); font-style: italic; padding: 8px 0; }
      .error { color: #e53935; background: #ffebee; padding: 8px; border-radius: 4px; margin-bottom: 8px; }

      /* Schedule */
      .schedule-target-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
      .schedule-target-row label { font-size: 13px; white-space: nowrap; }
      .schedule-target-row select { max-width: 280px; }
      .schedule-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; overflow-x: auto; }
      @media (max-width: 700px) {
        .schedule-grid { grid-template-columns: 1fr; }
      }
      .day-block { min-width: 120px; }
      .day-label { font-weight: bold; font-size: 12px; color: var(--secondary-text-color, #666); margin-bottom: 4px; text-transform: uppercase; }
      .interval-row { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; margin-bottom: 4px; padding: 4px; background: var(--secondary-background-color, #f5f5f5); border-radius: 4px; }
      .interval-row input[type="time"] { width: 88px; }
      .unit { font-size: 12px; color: var(--secondary-text-color, #666); }
      .schedule-disabled-warning {
        background: #fff3cd; color: #856404; border: 1px solid #ffc107;
        border-radius: 6px; padding: 8px 12px; font-size: 13px; margin-bottom: 10px;
      }
      .schedule-actions { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
      .day-copy-actions { display: flex; gap: 2px; margin-top: 4px; flex-wrap: wrap; }
      .btn-copy-day { font-size: 11px; padding: 3px 6px; background: var(--secondary-background-color, #e0e0e0); }
      .btn-paste-day { font-size: 11px; padding: 3px 6px; background: var(--primary-color, #03a9f4); color: #fff; }
      #btn-copy-plan { background: var(--secondary-background-color, #e0e0e0); }
      #btn-paste-plan { background: var(--primary-color, #03a9f4); color: #fff; }
      .group-disabled td { opacity: 0.5; }
      .group-disabled td:last-child { opacity: 1; }
      .therm-disabled td { opacity: 0.5; }
      .therm-disabled td:last-child { opacity: 1; }
      .disabled-badge { font-size: 11px; font-weight: 600; color: #b45309; background: #fef3c7; border: 1px solid #fcd34d; padding: 1px 6px; border-radius: 10px; margin-left: 4px; vertical-align: middle; }

      /* Modal dialog */
      .ts-overlay {
        position: fixed; inset: 0;
        background: rgba(0, 0, 0, 0.55);
        z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        animation: ts-fade 0.15s ease;
      }
      @keyframes ts-fade { from { opacity: 0; } to { opacity: 1; } }
      .ts-dialog {
        background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
        border-radius: 16px;
        padding: 24px 28px 20px;
        min-width: 260px; max-width: 380px; width: 90%;
        box-shadow: 0 8px 48px rgba(0, 0, 0, 0.45);
        animation: ts-scale 0.15s ease;
      }
      @keyframes ts-scale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .ts-dialog-msg {
        margin: 0 0 20px;
        font-size: 14px; line-height: 1.6;
        color: var(--primary-text-color);
      }
      .ts-dialog-btns { display: flex; justify-content: flex-end; gap: 8px; }
      .ts-btn {
        padding: 8px 20px; border: none; border-radius: 8px;
        cursor: pointer; font-size: 13px; font-weight: 500;
        transition: opacity 0.15s, transform 0.1s;
      }
      .ts-btn:hover { opacity: 0.85; transform: translateY(-1px); }
      .ts-btn:active { transform: translateY(0); }
      .ts-btn-cancel {
        background: var(--secondary-background-color, rgba(128,128,128,0.2));
        color: var(--primary-text-color);
      }
      .ts-btn-ok {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }
      .ts-btn-danger { background: #e53935; color: #fff; }
    `;
  }
}

// =============================================================================
// Card editor (shown in the "Edit card" dialog instead of YAML mode)
// =============================================================================

class ThermostatScheduleCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _entries() {
    if (!this._hass) return [];
    return Object.values(this._hass.states)
      .filter(s => s.attributes.integration === "thermostat_scheduler")
      .map(s => ({ id: s.attributes.entry_id, title: s.attributes.friendly_name || s.entity_id }));
  }

  _render() {
    const cfg = this._config;

    // Build entry_id options from config entries exposed via hass
    // HA exposes config entries as entities in some versions; fall back to a
    // free-text input so the user can always type the ID manually.
    const entryIdField = `
      <div class="field">
        <label for="entry_id">${this._t("editor_entry_id_label")}</label>
        <input id="entry_id" type="text" value="${this._esc(cfg.entry_id || "")}"
          placeholder="e.g. abc123def456…">
        <span class="hint">${this._t("editor_entry_id_hint")}</span>
      </div>`;

    const titleField = `
      <div class="field">
        <label for="title">${this._t("editor_title_label")} <span class="opt">${this._t("editor_title_optional")}</span></label>
        <input id="title" type="text" value="${this._esc(cfg.title || "")}"
          placeholder="${this._t("editor_title_placeholder")}">
      </div>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 4px 0; }
        .field { margin-bottom: 16px; }
        label { display: block; font-size: 13px; font-weight: 500;
                color: var(--secondary-text-color, #666); margin-bottom: 4px; }
        .opt { font-weight: 400; font-style: italic; }
        input { width: 100%; box-sizing: border-box; padding: 8px 10px;
                border: 1px solid var(--divider-color, #ccc); border-radius: 6px;
                font-size: 14px; background: var(--card-background-color, #fff);
                color: var(--primary-text-color, #000); }
        input:focus { outline: 2px solid var(--primary-color, #03a9f4); border-color: transparent; }
        .hint { display: block; font-size: 11px; color: var(--secondary-text-color, #999);
                margin-top: 4px; }
      </style>
      ${entryIdField}
      ${titleField}`;

    this.shadowRoot.querySelector("#entry_id").addEventListener("change", e => {
      this._fire({ ...this._config, entry_id: e.target.value.trim() });
    });
    this.shadowRoot.querySelector("#title").addEventListener("change", e => {
      const val = e.target.value.trim();
      const updated = { ...this._config };
      if (val) updated.title = val; else delete updated.title;
      this._fire(updated);
    });
  }

  _fire(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }

  _t(key, vars) { return _translate(this._hass, key, vars); }

  _esc(str) {
    return String(str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }
}

customElements.define("thermostat-schedule-card-editor", ThermostatScheduleCardEditor);

customElements.define("thermostat-schedule-card", ThermostatScheduleCard);

// Register card with the Lovelace card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: "thermostat-schedule-card",
  name: "Thermostat Schedule Card",
  description: "Manage thermostat schedules with groups and weekly intervals.",
  preview: false,
  configurable: true,
});
