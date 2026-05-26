const STORAGE_KEY = "motomatch:supabase";
const DEFAULT_TABLE = "motos";

const scoreFields = [
  "route_power_score",
  "wind_protection_score",
  "city_score",
  "polyvalence_score",
  "mountain_score",
  "long_touring_score",
  "urban_heat_score",
  "urban_fatigue_score",
  "lane_filtering_score"
];

const weightedFields = [
  ...scoreFields,
  "consumption_l_100km",
  "weight_kg",
  "seat_height_mm",
  "tank_l",
  "power_cv"
];

const hardFilterAliases = {
  min_wind_score: "wind_protection_score",
  min_long_score: "long_touring_score",
  min_poly_score: "polyvalence_score"
};

const fallbackProfiles = [
  {
    slug: "city",
    name: "Ciudad",
    description: "Prioriza agilidad, calor bajo, fatiga urbana y facilidad para filtrar.",
    recommended_copy: "Para ciudad suelen ganar naked ligeras, scooters y motos con postura erguida. Una touring protege mucho, pero penaliza peso, calor y maniobra.",
    weights_json: { city_score: 0.3, lane_filtering_score: 0.22, urban_heat_score: 0.16, urban_fatigue_score: 0.16, polyvalence_score: 0.1, route_power_score: 0.06 },
    hard_filters_json: { min_city_score: 5 }
  },
  {
    slug: "route",
    name: "Ruta",
    description: "Busca motor suficiente, estabilidad y algo de proteccion.",
    recommended_copy: "Para ruta una sport touring o adventure suele equilibrar potencia, comodidad y paso por curva. Una naked va bien, pero cansa mas por viento.",
    weights_json: { route_power_score: 0.28, mountain_score: 0.2, polyvalence_score: 0.18, wind_protection_score: 0.16, city_score: 0.1, long_touring_score: 0.08 },
    hard_filters_json: {}
  },
  {
    slug: "mountain",
    name: "Montana",
    description: "Prioriza chasis, peso razonable, respuesta y control en curvas.",
    recommended_copy: "En montana brillan naked, trail medias y supermoto. Las touring grandes son comodas, pero el peso se nota al enlazar curvas.",
    weights_json: { mountain_score: 0.34, route_power_score: 0.18, city_score: 0.12, polyvalence_score: 0.16, urban_fatigue_score: 0.1, wind_protection_score: 0.1 },
    hard_filters_json: { max_weight_kg: 240 }
  },
  {
    slug: "long_touring",
    name: "Viajes largos",
    description: "Proteccion, confort, crucero sostenido y equipaje.",
    recommended_copy: "En viajes largos una touring o sport touring protege mucho y reduce cansancio. Un scooter urbano o una naked pequena pueden servir, pero el viento y el espacio limitan.",
    weights_json: { long_touring_score: 0.3, wind_protection_score: 0.25, route_power_score: 0.18, polyvalence_score: 0.14, urban_fatigue_score: 0.08, city_score: 0.05 },
    hard_filters_json: { min_long_touring_score: 5 }
  },
  {
    slug: "mixed",
    name: "Mixto",
    description: "La moto mas completa para hacer un poco de todo.",
    recommended_copy: "Para uso mixto la adventure/trail suele ser la mas polivalente: postura comoda, suspensiones utiles y buen rango de uso. No siempre es la mas ligera ni la mejor en ciudad.",
    weights_json: { polyvalence_score: 0.28, city_score: 0.16, route_power_score: 0.16, mountain_score: 0.16, wind_protection_score: 0.12, long_touring_score: 0.12 },
    hard_filters_json: {}
  }
];

const fallbackBodyTypes = [
  {
    slug: "naked",
    name: "Naked",
    category: "asfalto",
    desc: "Ligera, directa y facil de usar a diario.",
    city: 8,
    route: 7,
    mountain: 8,
    long: 4,
    wind: 2,
    poly: 7,
    pros_city: "Agil, estrecha y normalmente contenida de peso.",
    pros_route: "Divertida en curvas y con buen control.",
    pros_mountain: "Manillar ancho, tacto directo y cambios rapidos de direccion.",
    cons: "Poca proteccion aerodinamica en viajes largos."
  },
  {
    slug: "sport_touring",
    name: "Sport touring",
    category: "asfalto",
    desc: "Equilibra viaje, potencia y conduccion alegre.",
    city: 5,
    route: 8,
    mountain: 7,
    long: 8,
    wind: 8,
    poly: 8,
    pros_city: "Usable si no es demasiado pesada.",
    pros_route: "Motor, frenos y proteccion para ritmo sostenido.",
    pros_mountain: "Estable y precisa.",
    cons: "Mas peso y volumen que una naked."
  },
  {
    slug: "touring_gt",
    name: "Touring GT",
    category: "viaje",
    desc: "Maximo confort para viajar lejos.",
    city: 3,
    route: 7,
    mountain: 5,
    long: 10,
    wind: 10,
    poly: 6,
    pros_city: "Comoda, pero no es su terreno.",
    pros_route: "Muy estable y descansada.",
    pros_mountain: "Solida en curvas amplias.",
    cons: "Peso, calor y volumen penalizan ciudad."
  },
  {
    slug: "adventure_trail",
    name: "Adventure / trail",
    category: "mixto",
    desc: "Postura erguida, suspensiones largas y gran rango de uso.",
    city: 7,
    route: 8,
    mountain: 8,
    long: 8,
    wind: 7,
    poly: 9,
    pros_city: "Visibilidad, ergonomia y suspensiones comodas.",
    pros_route: "Muy versatil para carreteras buenas y rotas.",
    pros_mountain: "Buen control por manillar y postura.",
    cons: "Altura y peso pueden intimidar."
  },
  {
    slug: "scooter_urban",
    name: "Scooter urbano",
    category: "urbano",
    desc: "Practicidad maxima para ciudad.",
    city: 10,
    route: 4,
    mountain: 3,
    long: 3,
    wind: 5,
    poly: 5,
    pros_city: "Automatico, hueco bajo asiento y facil de usar.",
    pros_route: "Correcto para rondas y trayectos cortos.",
    pros_mountain: "Manejable a baja velocidad.",
    cons: "Ruedas, suspensiones y potencia limitan fuera de ciudad."
  },
  {
    slug: "maxiscooter",
    name: "Maxiscooter",
    category: "urbano",
    desc: "Comodidad urbana con mas motor y proteccion.",
    city: 8,
    route: 6,
    mountain: 4,
    long: 6,
    wind: 7,
    poly: 7,
    pros_city: "CVT/DCT, proteccion y mucha practicidad.",
    pros_route: "Mejor crucero que un scooter pequeno.",
    pros_mountain: "Estable, aunque menos preciso.",
    cons: "Peso alto y tacto menos deportivo."
  },
  {
    slug: "cruiser",
    name: "Cruiser",
    category: "relajada",
    desc: "Asiento bajo y conduccion tranquila.",
    city: 4,
    route: 6,
    mountain: 3,
    long: 6,
    wind: 4,
    poly: 4,
    pros_city: "Llegar al suelo suele ser facil.",
    pros_route: "Muy agradable a ritmo relajado.",
    pros_mountain: "Centro de gravedad bajo.",
    cons: "Peso, frenada y angulo de inclinacion limitan."
  },
  {
    slug: "retro_classic",
    name: "Retro / classic",
    category: "asfalto",
    desc: "Sencilla, bonita y equilibrada para ritmo tranquilo.",
    city: 7,
    route: 6,
    mountain: 6,
    long: 4,
    wind: 2,
    poly: 6,
    pros_city: "Amable y normalmente estrecha.",
    pros_route: "Natural y disfrutable sin correr.",
    pros_mountain: "Buen control si no pesa demasiado.",
    cons: "Proteccion y tecnologia suelen ser justas."
  },
  {
    slug: "supersport",
    name: "Supersport",
    category: "deportiva",
    desc: "Prestaciones y aerodinamica por encima de comodidad.",
    city: 2,
    route: 7,
    mountain: 7,
    long: 3,
    wind: 7,
    poly: 3,
    pros_city: "Estrecha, pero incomoda y caliente.",
    pros_route: "Motor y chasis para ritmo alto.",
    pros_mountain: "Precisa si hay espacio.",
    cons: "No conviene para ciudad por postura, calor, radio de giro y fatiga."
  },
  {
    slug: "supermoto",
    name: "Supermoto",
    category: "deportiva",
    desc: "Ligera, alta y muy reactiva.",
    city: 8,
    route: 5,
    mountain: 9,
    long: 2,
    wind: 1,
    poly: 5,
    pros_city: "Agil y con gran control.",
    pros_route: "Muy divertida en trayectos cortos.",
    pros_mountain: "Excelente para curvas cerradas.",
    cons: "Autopista, pasajero y equipaje son su punto flojo."
  }
];

const fallbackProfileBodyTypes = [
  { profile_slug: "city", body_type_slug: "scooter_urban", rank: 1 },
  { profile_slug: "city", body_type_slug: "maxiscooter", rank: 2 },
  { profile_slug: "city", body_type_slug: "naked", rank: 3 },
  { profile_slug: "route", body_type_slug: "sport_touring", rank: 1 },
  { profile_slug: "route", body_type_slug: "naked", rank: 2 },
  { profile_slug: "route", body_type_slug: "adventure_trail", rank: 3 },
  { profile_slug: "mountain", body_type_slug: "supermoto", rank: 1 },
  { profile_slug: "mountain", body_type_slug: "naked", rank: 2 },
  { profile_slug: "mountain", body_type_slug: "adventure_trail", rank: 3 },
  { profile_slug: "long_touring", body_type_slug: "touring_gt", rank: 1 },
  { profile_slug: "long_touring", body_type_slug: "sport_touring", rank: 2 },
  { profile_slug: "long_touring", body_type_slug: "adventure_trail", rank: 3 },
  { profile_slug: "mixed", body_type_slug: "adventure_trail", rank: 1 },
  { profile_slug: "mixed", body_type_slug: "sport_touring", rank: 2 },
  { profile_slug: "mixed", body_type_slug: "naked", rank: 3 }
];

const fallbackMotos = [
  {
    brand: "Honda",
    model: "NX500",
    version: "Standard",
    segment: "adventure_trail",
    license_category: "A2",
    displacement_cc: 471,
    engine_config: "parallel_twin",
    power_cv: 47,
    torque_nm: 43,
    cooling: "liquid",
    gearbox_type: "manual_6",
    weight_kg: 196,
    seat_height_mm: 830,
    tank_l: 17.5,
    consumption_l_100km: 3.6,
    comfortable_cruise_kmh: 120,
    riding_position: "upright",
    route_power_score: 6,
    wind_protection_score: 6,
    city_score: 8,
    polyvalence_score: 9,
    mountain_score: 6,
    long_touring_score: 7,
    urban_heat_score: 8,
    urban_fatigue_score: 8,
    lane_filtering_score: 7,
    score_rationale: "Muy equilibrada, facil para A2 y razonable en casi todos los usos.",
    official_source_url: "https://www.honda.es/",
    photo_search_query: "Honda NX500 2024"
  },
  {
    brand: "Yamaha",
    model: "Tracer 7",
    version: "GT",
    segment: "sport_touring",
    license_category: "A",
    displacement_cc: 689,
    engine_config: "parallel_twin_270",
    power_cv: 73,
    torque_nm: 68,
    cooling: "liquid",
    gearbox_type: "manual_6",
    weight_kg: 197,
    seat_height_mm: 835,
    tank_l: 17,
    consumption_l_100km: 4.3,
    comfortable_cruise_kmh: 135,
    riding_position: "upright",
    route_power_score: 8,
    wind_protection_score: 7,
    city_score: 7,
    polyvalence_score: 9,
    mountain_score: 8,
    long_touring_score: 8,
    urban_heat_score: 7,
    urban_fatigue_score: 7,
    lane_filtering_score: 6,
    score_rationale: "Motor lleno, buena para viajar y bastante manejable.",
    official_source_url: "https://www.yamaha-motor.eu/",
    photo_search_query: "Yamaha Tracer 7 GT"
  },
  {
    brand: "Honda",
    model: "X-ADV",
    version: "750",
    segment: "maxiscooter",
    license_category: "A",
    displacement_cc: 745,
    engine_config: "parallel_twin",
    power_cv: 58,
    torque_nm: 69,
    cooling: "liquid",
    gearbox_type: "dct",
    weight_kg: 236,
    seat_height_mm: 820,
    tank_l: 13.2,
    consumption_l_100km: 3.6,
    comfortable_cruise_kmh: 125,
    riding_position: "scooter",
    route_power_score: 6,
    wind_protection_score: 7,
    city_score: 9,
    polyvalence_score: 8,
    mountain_score: 5,
    long_touring_score: 7,
    urban_heat_score: 8,
    urban_fatigue_score: 9,
    lane_filtering_score: 7,
    score_rationale: "Automatico, practico y muy bueno en ciudad, aunque pesado.",
    official_source_url: "https://www.honda.es/",
    photo_search_query: "Honda X-ADV 750"
  }
];

const useCases = [
  { id: "daily_city", label: "Ciudad", detail: "Agilidad, calor bajo, fatiga reducida y facilidad para filtrar." },
  { id: "one_bike_for_everything", label: "Mixto", detail: "La moto mas completa para hacer un poco de todo." },
  { id: "mountain_curves", label: "Montana", detail: "Peso, control, respuesta y confianza en curvas." },
  { id: "long_touring", label: "Viajes largos", detail: "Proteccion, crucero comodo, autonomia y equipaje." },
  { id: "beginner_a2", label: "Principiante A2", detail: "Facil, razonable de peso y compatible con carnet limitado." }
];

const sortOptions = [
  ["ranking", "Ranking recomendado"],
  ["polyvalence_score", "Polivalencia"],
  ["city_score", "Ciudad"],
  ["route_power_score", "Ruta / motor"],
  ["mountain_score", "Montana"],
  ["long_touring_score", "Viajes largos"],
  ["wind_protection_score", "Proteccion viento"],
  ["lane_filtering_score", "Filtrado urbano"],
  ["seat_fit", "Encaje por altura"],
  ["weight", "Peso bajo"],
  ["consumption", "Consumo bajo"]
];

const automaticTransmissionSlugs = new Set(["cvt", "dct", "e_clutch", "electric_direct", "automatic"]);
const manualTransmissionSlugs = new Set(["manual_5", "manual_6", "manual_quickshifter", "manual"]);

const state = {
  step: 0,
  dataMode: "loading",
  tables: {
    motos: [],
    body: [],
    bodyWizard: [],
    profileBodyTypes: [],
    engine: [],
    ridingPosition: [],
    transmission: [],
    cooling: []
  },
  normalizedMotos: [],
  recommendedMotos: [],
  discardedMotos: [],
  user: {
    useCase: "one_bike_for_everything",
    license: "A2",
    height: 175,
    weightTolerance: "medium",
    transmissionPreference: "any",
    windPreference: "medium",
    consumptionPreference: "medium",
    passengerPreference: "sometimes",
    comfortSport: "balanced",
    selectedBodyTypes: new Set()
  },
  filters: {
    search: "",
    brands: new Set(),
    bodyTypes: new Set(),
    engineTypes: new Set(),
    minCc: "",
    maxCc: ""
  },
  sortBy: "ranking"
};

const els = {
  useOptions: document.querySelector("#useOptions"),
  bodyTypeOptions: document.querySelector("#bodyTypeOptions"),
  heightInput: document.querySelector("#heightInput"),
  heightOutput: document.querySelector("#heightOutput"),
  licenseSelect: document.querySelector("#licenseSelect"),
  weightToleranceSelect: document.querySelector("#weightToleranceSelect"),
  transmissionPreferenceSelect: document.querySelector("#transmissionPreferenceSelect"),
  windPreferenceSelect: document.querySelector("#windPreferenceSelect"),
  consumptionPreferenceSelect: document.querySelector("#consumptionPreferenceSelect"),
  passengerPreferenceSelect: document.querySelector("#passengerPreferenceSelect"),
  comfortSportSelect: document.querySelector("#comfortSportSelect"),
  wizardSummary: document.querySelector("#wizardSummary"),
  prevStepBtn: document.querySelector("#prevStepBtn"),
  nextStepBtn: document.querySelector("#nextStepBtn"),
  panels: [...document.querySelectorAll(".wizard-panel")],
  progressSteps: [...document.querySelectorAll(".progress-step")],
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  brandFilters: document.querySelector("#brandFilters"),
  bodyFilters: document.querySelector("#bodyFilters"),
  engineFilters: document.querySelector("#engineFilters"),
  minCcInput: document.querySelector("#minCcInput"),
  maxCcInput: document.querySelector("#maxCcInput"),
  clearFiltersBtn: document.querySelector("#clearFiltersBtn"),
  activeFilters: document.querySelector("#activeFilters"),
  motorcycleList: document.querySelector("#motorcycleList"),
  discardedList: document.querySelector("#discardedList"),
  resultsCount: document.querySelector("#resultsCount"),
  discardedCount: document.querySelector("#discardedCount"),
  emptyState: document.querySelector("#emptyState"),
  settingsDialog: document.querySelector("#settingsDialog"),
  dataSettingsBtn: document.querySelector("#dataSettingsBtn"),
  supabaseUrlInput: document.querySelector("#supabaseUrlInput"),
  supabaseKeyInput: document.querySelector("#supabaseKeyInput"),
  supabaseTableInput: document.querySelector("#supabaseTableInput"),
  saveSettingsBtn: document.querySelector("#saveSettingsBtn"),
  useDemoDataBtn: document.querySelector("#useDemoDataBtn")
};

function init() {
  renderUseCases();
  renderSortOptions();
  bindEvents();
  loadSettingsIntoDialog();
  loadData();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-choice-type]");
    if (!choice) return;
    handleChoice(choice.dataset.choiceType, choice.dataset.id);
  });

  els.prevStepBtn.addEventListener("click", () => setStep(state.step - 1));
  els.nextStepBtn.addEventListener("click", () => {
    if (state.step < 4) setStep(state.step + 1);
    else document.querySelector(".results-shell").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  els.heightInput.addEventListener("input", () => {
    state.user.height = Number(els.heightInput.value);
    els.heightOutput.value = `${state.user.height} cm`;
    recalculate();
  });

  [
    ["license", els.licenseSelect],
    ["weightTolerance", els.weightToleranceSelect],
    ["transmissionPreference", els.transmissionPreferenceSelect],
    ["windPreference", els.windPreferenceSelect],
    ["consumptionPreference", els.consumptionPreferenceSelect],
    ["passengerPreference", els.passengerPreferenceSelect],
    ["comfortSport", els.comfortSportSelect]
  ].forEach(([key, element]) => {
    element.addEventListener("change", () => {
      state.user[key] = element.value;
      recalculate();
    });
  });

  els.searchInput.addEventListener("input", () => {
    state.filters.search = els.searchInput.value.trim().toLowerCase();
    recalculate();
  });

  els.sortSelect.addEventListener("change", () => {
    state.sortBy = els.sortSelect.value;
    recalculate();
  });

  [els.minCcInput, els.maxCcInput].forEach((input) => {
    input.addEventListener("input", () => {
      state.filters.minCc = els.minCcInput.value;
      state.filters.maxCc = els.maxCcInput.value;
      recalculate();
    });
  });

  els.clearFiltersBtn.addEventListener("click", clearFilters);
  els.dataSettingsBtn.addEventListener("click", () => els.settingsDialog.showModal());
  els.saveSettingsBtn.addEventListener("click", saveSettings);
  els.useDemoDataBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    els.settingsDialog.close();
    useFallbackData();
  });
}

function handleChoice(type, id) {
  if (type === "use") {
    state.user.useCase = id;
    seedRecommendedBodyTypes();
    renderUseCases();
    renderBodyTypes();
  }

  if (type === "body") {
    toggleSet(state.user.selectedBodyTypes, id);
    renderBodyTypes();
  }

  recalculate();
}

async function loadData() {
  const settings = getSettings();
  if (!settings?.url || !settings?.key) {
    useFallbackData();
    return;
  }

  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(settings.url, settings.key);
    const table = settings.table || DEFAULT_TABLE;

    const [motos, body, bodyWizard, profileBodyTypes, engine, ridingPosition, transmission, cooling] = await Promise.all([
      fetchTable(supabase, table),
      fetchTable(supabase, "body"),
      fetchTable(supabase, "body_wizard"),
      fetchTable(supabase, "profile_body_types"),
      fetchTable(supabase, "engine"),
      fetchTable(supabase, "riding_position"),
      fetchTable(supabase, "transmission"),
      fetchTable(supabase, "cooling")
    ]);

    state.tables = {
      motos: motos.length ? motos : fallbackMotos,
      body: body.length ? body : fallbackBodyTypes,
      bodyWizard: bodyWizard.length ? bodyWizard : fallbackProfiles,
      profileBodyTypes: profileBodyTypes.length ? profileBodyTypes : fallbackProfileBodyTypes,
      engine,
      ridingPosition,
      transmission,
      cooling
    };
    state.dataMode = motos.length ? "supabase" : "demo";
    prepareData();
  } catch (error) {
    console.warn("No se pudo cargar Supabase, usando datos demo:", error);
    useFallbackData();
  }
}

async function fetchTable(supabase, table) {
  const { data, error } = await supabase.from(table).select("*").limit(1000);
  if (error) {
    console.warn(`Error cargando ${table}:`, error);
    return [];
  }
  return data || [];
}

function useFallbackData() {
  state.tables = {
    motos: fallbackMotos,
    body: fallbackBodyTypes,
    bodyWizard: fallbackProfiles,
    profileBodyTypes: fallbackProfileBodyTypes,
    engine: [],
    ridingPosition: [],
    transmission: [],
    cooling: []
  };
  state.dataMode = "demo";
  prepareData();
}

function prepareData() {
  state.normalizedMotos = state.tables.motos.map(normalizeMoto);
  if (!getActiveProfile()) {
    state.user.useCase = state.tables.bodyWizard[0]?.slug || fallbackProfiles[0].slug;
  }
  seedRecommendedBodyTypes();
  renderUseCases();
  renderBodyTypes();
  renderFilterOptions();
  recalculate();
  setStep(state.step);
}

function normalizeMoto(raw) {
  const bodySlug = normalizeBodyFromSegment(raw.segment);
  const engineSlug = normalizeEngine(raw.engine_config);
  const transmissionSlug = normalizeTransmission(raw.gearbox_type);
  const coolingSlug = normalizeCooling(raw.cooling);
  const ridingSlug = normalizeRidingPosition(raw.riding_position);

  return {
    ...raw,
    id: raw.id || `${raw.brand}-${raw.model}-${raw.version || ""}`,
    brand: raw.brand || "Marca desconocida",
    model: raw.model || "Modelo sin nombre",
    version: raw.version || "",
    segment_slug: bodySlug,
    engine_slug: engineSlug,
    transmission_slug: transmissionSlug,
    cooling_slug: coolingSlug,
    riding_position_slug: ridingSlug,
    displacement_cc: numberOrZero(raw.displacement_cc),
    power_cv: numberOrZero(raw.power_cv),
    torque_nm: numberOrZero(raw.torque_nm),
    weight_kg: numberOrZero(raw.weight_kg),
    seat_height_mm: numberOrZero(raw.seat_height_mm),
    tank_l: numberOrZero(raw.tank_l),
    consumption_l_100km: numberOrZero(raw.consumption_l_100km),
    top_speed_kmh: numberOrZero(raw.top_speed_kmh),
    comfortable_cruise_kmh: numberOrZero(raw.comfortable_cruise_kmh),
    ranking_score: 0,
    discardReasons: []
  };
}

function normalizeBodyFromSegment(segment) {
  const normalized = normalizeSlug(segment);
  const aliases = {
    trail: "adventure_trail",
    adventure: "adventure_trail",
    adventure_touring: "adventure_trail",
    adventure_trail: "adventure_trail",
    sporttouring: "sport_touring",
    sport_touring: "sport_touring",
    touring: "touring_gt",
    gt: "touring_gt",
    scooter: "scooter_urban",
    urban_scooter: "scooter_urban",
    maxi_scooter: "maxiscooter",
    classic: "retro_classic",
    retro: "retro_classic",
    custom: "cruiser",
    sport: "supersport"
  };
  if (normalized.includes("adventure") && normalized.includes("scooter")) return "adventure_scooter";
  if (normalized.includes("maxi") && normalized.includes("adventure")) return "maxi_adventure";
  if (normalized.includes("adventure") || normalized.includes("trail") || normalized.includes("crossover")) return "adventure_trail";
  if (normalized.includes("sport") && normalized.includes("touring")) return "sport_touring";
  if (normalized.includes("touring") || normalized.includes("gran_turismo") || normalized.includes("gt")) return "touring_gt";
  if (normalized.includes("maxiscooter") || normalized.includes("gt_scooter") || (normalized.includes("scooter") && normalized.includes("gt"))) return "gt_scooter";
  if (normalized.includes("scooter")) return "scooter_urban";
  if (normalized.includes("supersport") || normalized.includes("_r") || normalized === "r") return "supersport_r";
  if (normalized.includes("retro") || normalized.includes("classic") || normalized.includes("heritage")) return "retro_classic";
  return aliases[normalized] || normalized;
}

function normalizeEngine(engineConfig) {
  const normalized = normalizeSlug(engineConfig);
  const aliases = {
    single: "single_cylinder",
    mono: "single_cylinder",
    monocilindrico: "single_cylinder",
    parallel: "parallel_twin",
    twin: "parallel_twin",
    bicilindrico: "parallel_twin",
    cp2: "parallel_twin_270",
    parallel_twin_270_degree: "parallel_twin_270",
    v2: "v_twin",
    vtwin: "v_twin",
    flat_twin: "boxer_twin",
    three_cylinder: "triple",
    four: "inline_four",
    inline4: "inline_four",
    electric_motor: "electric"
  };
  return aliases[normalized] || normalized;
}

function normalizeTransmission(gearboxType) {
  const normalized = normalizeSlug(gearboxType);
  const aliases = {
    manual: "manual_6",
    manual_5_speed: "manual_5",
    manual_6_speed: "manual_6",
    quickshifter: "manual_quickshifter",
    dual_clutch: "dct",
    automatic: "cvt",
    direct: "electric_direct"
  };
  return aliases[normalized] || normalized;
}

function normalizeCooling(cooling) {
  const normalized = normalizeSlug(cooling);
  const aliases = {
    air_cooled: "air",
    oil_air: "air_oil",
    air_oil_cooled: "air_oil",
    water: "liquid",
    liquid_cooled: "liquid"
  };
  return aliases[normalized] || normalized;
}

function normalizeRidingPosition(ridingPosition) {
  const normalized = normalizeSlug(ridingPosition);
  const aliases = {
    upright_relaxed: "upright",
    forward: "slightly_forward",
    sporty: "sport",
    gt: "touring",
    feet_forward: "cruiser"
  };
  return aliases[normalized] || normalized;
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function recalculate() {
  const profile = getActiveProfile();
  const weights = getAdjustedWeights(profile);
  const hardFilters = parseJsonMaybe(profile?.hard_filters_json, {});
  const recommended = [];
  const discarded = [];

  state.normalizedMotos.forEach((moto) => {
    const reasons = explainDiscard(moto, hardFilters);
    const enriched = {
      ...moto,
      ranking_score: calculateRankingScore(moto, weights),
      recommendation_reason: buildRecommendationReason(moto, weights),
      discardReasons: reasons
    };

    if (reasons.length) discarded.push(enriched);
    else recommended.push(enriched);
  });

  state.recommendedMotos = applySoftFilters(recommended).sort(compareMotos);
  state.discardedMotos = discarded.sort((a, b) => b.ranking_score - a.ranking_score).slice(0, 30);
  renderWizardSummary();
  renderActiveFilterState();
  renderResults();
}

function calculateRankingScore(moto, weights) {
  const weightedScore = weightedFields.reduce((total, field) => {
    const weight = numberOrZero(weights[field]);
    if (!weight) return total;
    return total + normalizedFieldScore(moto, field) * Math.abs(weight);
  }, 0);
  const weightSum = weightedFields.reduce((total, field) => total + Math.abs(numberOrZero(weights[field])), 0) || 1;
  const base = weightedScore / weightSum;
  const bodyBonus = state.user.selectedBodyTypes.has(moto.segment_slug) ? 6 : -4;
  const heightBonus = (seatFitScore(moto) - 50) * 0.08;
  const consumptionBonus = state.user.consumptionPreference === "high" ? consumptionScore(moto) * 0.05 : 0;
  return clamp(Math.round(base + bodyBonus + heightBonus + consumptionBonus), 0, 100);
}

function normalizedFieldScore(moto, field) {
  if (scoreFields.includes(field)) return clamp(numberOrZero(moto[field]) * 10, 0, 100);
  if (field === "consumption_l_100km") return consumptionScore(moto);
  if (field === "weight_kg") return clamp(Math.round(130 - numberOrZero(moto.weight_kg) * 0.42), 0, 100);
  if (field === "seat_height_mm") return seatFitScore(moto);
  if (field === "tank_l") return clamp(Math.round(numberOrZero(moto.tank_l) * 5), 0, 100);
  if (field === "power_cv") return clamp(Math.round(numberOrZero(moto.power_cv) * 1.1), 0, 100);
  return clamp(numberOrZero(moto[field]) * 10, 0, 100);
}

function getAdjustedWeights(profile) {
  const weights = { ...parseJsonMaybe(profile?.weights_json, {}) };

  if (state.user.windPreference === "high") weights.wind_protection_score = numberOrZero(weights.wind_protection_score) + 0.12;
  if (state.user.passengerPreference === "often") {
    weights.long_touring_score = numberOrZero(weights.long_touring_score) + 0.12;
    weights.wind_protection_score = numberOrZero(weights.wind_protection_score) + 0.06;
  }
  if (state.user.consumptionPreference === "high") {
    weights.city_score = numberOrZero(weights.city_score) + 0.05;
    weights.urban_heat_score = numberOrZero(weights.urban_heat_score) + 0.05;
  }
  if (state.user.comfortSport === "sport") {
    weights.mountain_score = numberOrZero(weights.mountain_score) + 0.12;
    weights.route_power_score = numberOrZero(weights.route_power_score) + 0.1;
  }
  if (state.user.comfortSport === "comfort") {
    weights.long_touring_score = numberOrZero(weights.long_touring_score) + 0.1;
    weights.urban_fatigue_score = numberOrZero(weights.urban_fatigue_score) + 0.08;
  }

  return weights;
}

function explainDiscard(moto, hardFilters) {
  const reasons = [];
  const licenseValues = normalizeArray(hardFilters.license_category);
  const maxWeightByUser = weightLimitFromPreference();
  const maxSeat = maxReasonableSeatHeight();

  if (!isLicenseCompatible(moto.license_category, state.user.license)) {
    reasons.push(`Carnet: requiere ${moto.license_category || "categoria superior"} y elegiste ${state.user.license}.`);
  }
  if (licenseValues.length && !profileLicenseAllows(licenseValues, moto.license_category)) {
    reasons.push(`El perfil exige carnet ${licenseValues.join(", ")}.`);
  }
  if (maxWeightByUser && moto.weight_kg > maxWeightByUser) {
    reasons.push(`Peso alto: ${moto.weight_kg} kg supera tu limite aproximado de ${maxWeightByUser} kg.`);
  }
  if (hardFilters.max_weight_kg && moto.weight_kg > Number(hardFilters.max_weight_kg)) {
    reasons.push(`El perfil limita el peso a ${hardFilters.max_weight_kg} kg.`);
  }
  if (moto.seat_height_mm && moto.seat_height_mm > maxSeat) {
    reasons.push(`Asiento alto: ${moto.seat_height_mm} mm parece exigente para ${state.user.height} cm.`);
  }
  if (!matchesTransmissionPreference(moto)) {
    reasons.push(`Transmision: ${moto.gearbox_type || moto.transmission_slug} no encaja con tu preferencia.`);
  }
  if (state.user.windPreference === "high" && numberOrZero(moto.wind_protection_score) < 6) {
    reasons.push("Proteccion contra viento insuficiente para tu prioridad.");
  }
  if (state.user.selectedBodyTypes.size && !state.user.selectedBodyTypes.has(moto.segment_slug)) {
    reasons.push(`Formato ${labelBody(moto.segment_slug)} fuera de los tipos seleccionados.`);
  }

  Object.entries(hardFilters).forEach(([key, value]) => {
    if (!key.startsWith("min_") || key.endsWith("_soft")) return;
    const field = hardFilterAliases[key] || key.replace(/^min_/, "");
    if (numberOrZero(moto[field]) < Number(value)) {
      reasons.push(`${scoreLabel(field)} por debajo del minimo del perfil.`);
    }
  });

  return reasons;
}

function applySoftFilters(list) {
  let filtered = [...list];
  const { filters } = state;

  if (filters.search) {
    filtered = filtered.filter((moto) => {
      const haystack = [
        moto.brand,
        moto.model,
        moto.version,
        moto.segment,
        moto.engine_config,
        moto.gearbox_type,
        moto.cooling,
        moto.riding_position,
        moto.score_rationale,
        moto.photo_search_query
      ].join(" ").toLowerCase();
      return haystack.includes(filters.search);
    });
  }
  if (filters.brands.size) filtered = filtered.filter((moto) => filters.brands.has(moto.brand));
  if (filters.bodyTypes.size) filtered = filtered.filter((moto) => filters.bodyTypes.has(moto.segment_slug));
  if (filters.engineTypes.size) filtered = filtered.filter((moto) => filters.engineTypes.has(moto.engine_slug));
  if (filters.minCc) filtered = filtered.filter((moto) => moto.displacement_cc >= Number(filters.minCc));
  if (filters.maxCc) filtered = filtered.filter((moto) => moto.displacement_cc <= Number(filters.maxCc));

  return filtered;
}

function compareMotos(a, b) {
  if (state.sortBy === "ranking") return b.ranking_score - a.ranking_score;
  if (state.sortBy === "seat_fit") return seatFitScore(b) - seatFitScore(a);
  if (state.sortBy === "weight") return numberOrZero(a.weight_kg) - numberOrZero(b.weight_kg);
  if (state.sortBy === "consumption") return numberOrZero(a.consumption_l_100km || 99) - numberOrZero(b.consumption_l_100km || 99);
  return numberOrZero(b[state.sortBy]) - numberOrZero(a[state.sortBy]);
}

function buildRecommendationReason(moto, weights) {
  const strongest = scoreFields
    .map((field) => ({ field, value: numberOrZero(moto[field]), weight: numberOrZero(weights[field]) }))
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 2)
    .map((item) => scoreLabel(item.field).toLowerCase());

  const body = getBody(moto.segment_slug);
  const bodyText = body ? humanBodyExplanation(body.slug) : "Encaja razonablemente con las prioridades elegidas.";
  const scoreText = strongest.length ? `Destaca en ${strongest.join(" y ")}.` : "Tiene un equilibrio general correcto.";
  return `${scoreText} ${bodyText}`;
}

function humanBodyExplanation(slug) {
  const explanations = {
    naked: "Una naked sirve muy bien para ciudad y montana porque es agil, directa y ligera, pero no tanto para viajes largos por la poca proteccion contra viento.",
    touring_gt: "Una touring protege mucho y reduce cansancio en ruta, pero penaliza ciudad por peso, volumen, calor y maniobras lentas.",
    sport_touring: "Una sport touring combina proteccion, motor y comodidad sin irse tanto de peso como una gran touring.",
    adventure_trail: "Una adventure/trail suele ser la mas polivalente por postura erguida, suspensiones utiles y buen equilibrio entre ruta, ciudad y carreteras rotas.",
    maxi_adventure: "Una maxi adventure protege y viaja muy bien, aunque el peso puede complicar ciudad y maniobras.",
    scooter_urban: "Un scooter urbano gana en comodidad de ciudad por cambio automatico, hueco y facilidad de uso, aunque limita ruta y montana.",
    gt_scooter: "Un GT scooter o maxiscooter gana en comodidad urbana y proteccion, aunque pesa mas y transmite menos tacto deportivo.",
    adventure_scooter: "Un adventure scooter mezcla practicidad automatica con postura alta y algo mas de rango fuera de ciudad.",
    maxiscooter: "Un maxiscooter conserva mucha practicidad urbana y suma proteccion, pero pesa mas y tiene menos tacto de moto convencional.",
    cruiser: "Una cruiser da confianza por asiento bajo y conduccion relajada, pero no es ideal si buscas agilidad o montana.",
    retro_classic: "Una retro es amable y equilibrada, aunque suele sacrificar proteccion aerodinamica y practicidad viajera.",
    supersport: "Una supersport no conviene para ciudad aunque tenga aerodinamica: la postura, el calor, el radio de giro y la fatiga juegan en contra.",
    supersport_r: "Una supersport/R no conviene para ciudad aunque tenga aerodinamica: la postura, el calor, el radio de giro y la fatiga juegan en contra.",
    supermoto: "Una supermoto es fantastica en ciudad y curvas cerradas por ligereza y control, pero flojea en viajes y autopista."
  };
  return explanations[slug] || "Su formato encaja con parte del uso seleccionado.";
}

function renderUseCases() {
  const options = state.tables.bodyWizard.length
    ? state.tables.bodyWizard.map((profile) => ({
      id: profile.slug,
      label: profile.name || titleFromSlug(profile.slug),
      detail: profile.description || profile.recommended_copy || "Perfil configurado en Supabase."
    }))
    : useCases;

  els.useOptions.innerHTML = options.map((item) => `
    <button class="choice-card ${state.user.useCase === item.id ? "is-selected" : ""}" type="button" data-choice-type="use" data-id="${escapeAttr(item.id)}">
      <strong>${escapeHtml(item.label)}</strong>
      <span>${escapeHtml(item.detail)}</span>
    </button>
  `).join("");
}

function renderBodyTypes() {
  const bodyRows = [...state.tables.body].sort((a, b) => bodyRank(a.slug) - bodyRank(b.slug));
  els.bodyTypeOptions.innerHTML = bodyRows.map((body) => bodyTypeCard(body)).join("");
}

function bodyTypeCard(body) {
  const slug = body.slug;
  const selected = state.user.selectedBodyTypes.has(slug);
  const recommended = recommendedBodySlugsForProfile().includes(slug);
  const svg = body.schematic_svg_inline || "";

  return `
    <button class="body-card ${selected ? "is-selected" : ""}" type="button" data-choice-type="body" data-id="${escapeAttr(slug)}">
      <div class="body-card-art">${svg || `<span>${escapeHtml((body.name || slug).charAt(0))}</span>`}</div>
      <strong>${escapeHtml(body.name || slug)}</strong>
      <p>${escapeHtml(body.desc || "")}</p>
      <div class="body-score-grid">
        ${bodyMetric("Ciudad", body.city)}
        ${bodyMetric("Ruta", body.route)}
        ${bodyMetric("Montana", body.mountain)}
        ${bodyMetric("Viaje", body.long)}
        ${bodyMetric("Viento", body.wind)}
        ${bodyMetric("Poly", body.poly)}
      </div>
      <ul>
        ${body.pros_city ? `<li>${escapeHtml(body.pros_city)}</li>` : ""}
        ${body.pros_route ? `<li>${escapeHtml(body.pros_route)}</li>` : ""}
        ${body.pros_mountain ? `<li>${escapeHtml(body.pros_mountain)}</li>` : ""}
        ${body.cons ? `<li class="down">${escapeHtml(body.cons)}</li>` : ""}
      </ul>
      ${recommended ? `<span class="recommended-chip">Sugerida para ${escapeHtml(getActiveProfile()?.name || state.user.useCase)}</span>` : ""}
    </button>
  `;
}

function bodyMetric(label, value) {
  return `<span><b>${escapeHtml(label)}</b>${escapeHtml(value ?? "-")}</span>`;
}

function renderSortOptions() {
  els.sortSelect.innerHTML = sortOptions.map(([value, label]) => `<option value="${escapeAttr(value)}">${escapeHtml(label)}</option>`).join("");
  els.sortSelect.value = state.sortBy;
}

function renderFilterOptions() {
  const brands = unique(state.normalizedMotos.map((moto) => moto.brand));
  const bodies = unique(state.normalizedMotos.map((moto) => moto.segment_slug));
  const engines = unique(state.normalizedMotos.map((moto) => moto.engine_slug));

  els.brandFilters.innerHTML = brands.map((brand) => `
    <label class="check-item">
      <input type="checkbox" value="${escapeAttr(brand)}" />
      <span>${escapeHtml(brand)}</span>
    </label>
  `).join("");

  els.bodyFilters.innerHTML = bodies.map((slug) => filterPill("body", slug, labelBody(slug))).join("");
  els.engineFilters.innerHTML = engines.map((slug) => filterPill("engine", slug, labelTaxonomy("engine", slug))).join("");

  els.brandFilters.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) state.filters.brands.add(input.value);
      else state.filters.brands.delete(input.value);
      recalculate();
    });
  });

  [...els.bodyFilters.querySelectorAll("[data-filter-value]"), ...els.engineFilters.querySelectorAll("[data-filter-value]")].forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.filter === "body" ? state.filters.bodyTypes : state.filters.engineTypes;
      toggleSet(target, button.dataset.filterValue);
      recalculate();
    });
  });
}

function renderWizardSummary() {
  const profile = getActiveProfile();
  els.wizardSummary.innerHTML = [
    ["Uso", profile?.name || state.user.useCase],
    ["Carnet", state.user.license],
    ["Altura", `${state.user.height} cm`],
    ["Tipos", [...state.user.selectedBodyTypes].map(labelBody).join(", ") || "Automatico por perfil"],
    ["Transmision", preferenceLabel(state.user.transmissionPreference)]
  ].map(([label, value]) => `<div class="summary-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
}

function renderActiveFilterState() {
  els.bodyFilters.querySelectorAll("[data-filter-value]").forEach((button) => {
    button.classList.toggle("is-selected", state.filters.bodyTypes.has(button.dataset.filterValue));
  });
  els.engineFilters.querySelectorAll("[data-filter-value]").forEach((button) => {
    button.classList.toggle("is-selected", state.filters.engineTypes.has(button.dataset.filterValue));
  });

  const tokens = [];
  tokens.push(state.dataMode === "supabase" ? "Supabase" : "Datos demo");
  tokens.push(`Perfil: ${getActiveProfile()?.name || state.user.useCase}`);
  if (state.filters.search) tokens.push(`Busqueda: ${state.filters.search}`);
  state.filters.brands.forEach((brand) => tokens.push(brand));
  state.filters.bodyTypes.forEach((slug) => tokens.push(labelBody(slug)));
  state.filters.engineTypes.forEach((slug) => tokens.push(labelTaxonomy("engine", slug)));
  if (state.filters.minCc || state.filters.maxCc) tokens.push(`${state.filters.minCc || 0}-${state.filters.maxCc || "inf"} cc`);

  els.activeFilters.innerHTML = tokens.map((token) => `<span class="filter-token">${escapeHtml(token)}</span>`).join("");
}

function renderResults() {
  const recommended = state.recommendedMotos;
  const discarded = state.discardedMotos;
  els.resultsCount.textContent = `${recommended.length} ${recommended.length === 1 ? "moto" : "motos"}`;
  els.discardedCount.textContent = `${discarded.length} ${discarded.length === 1 ? "moto" : "motos"}`;
  els.emptyState.hidden = recommended.length !== 0;
  els.motorcycleList.innerHTML = recommended.map(motoCard).join("");
  els.discardedList.innerHTML = discarded.map(discardedCard).join("");
}

function motoCard(moto) {
  const title = `${moto.brand} ${moto.model}${moto.version ? ` ${moto.version}` : ""}`;
  const images = getMotoImages(moto);
  const photoSearchUrl = moto.photo_search_query
    ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(moto.photo_search_query)}`
    : "";

  return `
    <article class="motorcycle-card">
      ${renderMotoImages(images, title, moto.photo_search_query)}
      <div class="motorcycle-content">
        <div class="card-title">
          <div>
            <p class="meta-line">${escapeHtml(labelBody(moto.segment_slug))} · ${escapeHtml(labelTaxonomy("engine", moto.engine_slug))} · ${escapeHtml(labelTaxonomy("transmission", moto.transmission_slug))}</p>
            <h3>${escapeHtml(title)}</h3>
          </div>
          <div class="score-badge"><span>Ranking</span>${moto.ranking_score}</div>
        </div>
        <p class="specs">
          <span>${escapeHtml(moto.license_category || "Carnet n/d")}</span>
          <span>${escapeHtml(moto.displacement_cc || "?")} cc</span>
          <span>${escapeHtml(moto.power_cv || "?")} CV</span>
          <span>${escapeHtml(moto.torque_nm || "?")} Nm</span>
          <span>${escapeHtml(moto.weight_kg || "?")} kg</span>
          <span>${escapeHtml(moto.seat_height_mm || "?")} mm asiento</span>
          <span>${escapeHtml(moto.comfortable_cruise_kmh || "?")} km/h crucero</span>
          <span>${escapeHtml(moto.consumption_l_100km || "?")} l/100km</span>
        </p>
        <p class="reason">${escapeHtml(moto.recommendation_reason)}</p>
        ${moto.score_rationale ? `<p class="muted">${escapeHtml(moto.score_rationale)}</p>` : ""}
        <div class="score-detail">
          ${["polyvalence_score", "city_score", "route_power_score", "mountain_score", "long_touring_score", "wind_protection_score"].map((field) => scoreRow(field, moto)).join("")}
        </div>
        <div class="card-actions">
          ${moto.official_source_url ? `<a href="${escapeAttr(moto.official_source_url)}" target="_blank" rel="noreferrer">Fuente oficial</a>` : ""}
          ${photoSearchUrl ? `<a href="${escapeAttr(photoSearchUrl)}" target="_blank" rel="noreferrer">Buscar fotos</a>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderMotoImages(images, title, searchQuery) {
  if (images.length) {
    return `
      <div class="photo-grid" aria-label="Fotos de ${escapeAttr(title)}">
        ${images.slice(0, 4).map((url) => `<img src="${escapeAttr(url)}" alt="${escapeAttr(title)}" loading="lazy" referrerpolicy="no-referrer" />`).join("")}
      </div>
    `;
  }

  return `
    <div class="photo-grid compact-photo">
      <div class="photo-fallback">
        <span>${escapeHtml(searchQuery || title)}</span>
      </div>
    </div>
  `;
}

function getMotoImages(moto) {
  const candidates = [
    moto.image_urls,
    moto.images,
    moto.photos,
    moto.photo_urls,
    moto.image_url,
    moto.photo_url,
    moto.main_image_url,
    moto.main_photo_url,
    moto.thumbnail_url,
    moto.picture_url,
    moto.hero_image_url,
    moto.image,
    moto.photo
  ];

  return candidates
    .flatMap(parseImageList)
    .map(toPublicImageUrl)
    .filter(Boolean)
    .filter((url, index, urls) => urls.indexOf(url) === index);
}

function parseImageList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(parseImageList);
  if (typeof value === "object") {
    return [
      value.url,
      value.src,
      value.publicUrl,
      value.public_url,
      value.path
    ].filter(Boolean);
  }
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      return parseImageList(JSON.parse(trimmed));
    } catch {
      return [];
    }
  }
  return trimmed.split(/[|,\n]/).map((item) => item.trim()).filter(Boolean);
}

function toPublicImageUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("data:image/")) return url;

  const settings = getSettings();
  if (settings?.url && url.includes("/")) {
    return `${settings.url.replace(/\/$/, "")}/storage/v1/object/public/${url.replace(/^\/+/, "")}`;
  }

  return "";
}

function discardedCard(moto) {
  const title = `${moto.brand} ${moto.model}${moto.version ? ` ${moto.version}` : ""}`;
  return `
    <article class="discarded-card">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(labelBody(moto.segment_slug))} · score ${moto.ranking_score}</span>
      <p>${escapeHtml(moto.discardReasons[0] || "No encaja con algun filtro duro.")}</p>
    </article>
  `;
}

function scoreRow(field, moto) {
  const value = clamp(numberOrZero(moto[field]) * 10, 0, 100);
  return `
    <div class="score-row">
      <span>${escapeHtml(scoreLabel(field))}</span>
      <div class="score-meter"><span style="width: ${value}%"></span></div>
      <strong>${escapeHtml(moto[field] ?? "-")}</strong>
    </div>
  `;
}

function getActiveProfile() {
  return state.tables.bodyWizard.find((profile) => profile.slug === state.user.useCase)
    || fallbackProfiles.find((profile) => profile.slug === state.user.useCase)
    || state.tables.bodyWizard[0];
}

function seedRecommendedBodyTypes() {
  const recommended = recommendedBodySlugsForProfile();
  if (!state.user.selectedBodyTypes.size || state.step === 0) {
    state.user.selectedBodyTypes = new Set(recommended.slice(0, 4));
  }
}

function recommendedBodySlugsForProfile() {
  const profile = getActiveProfile();
  if (!profile) return [];
  return state.tables.profileBodyTypes
    .filter((item) => item.profile_slug === profile.slug)
    .sort((a, b) => numberOrZero(a.rank) - numberOrZero(b.rank))
    .map((item) => item.body_type_slug);
}

function bodyRank(slug) {
  const index = recommendedBodySlugsForProfile().indexOf(slug);
  return index === -1 ? 99 : index;
}

function setStep(nextStep) {
  state.step = clamp(nextStep, 0, 4);
  els.panels.forEach((panel, index) => {
    panel.hidden = index !== state.step;
  });
  els.progressSteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === state.step);
  });
  els.prevStepBtn.disabled = state.step === 0;
  els.nextStepBtn.textContent = state.step === 4 ? "Ver lista" : "Siguiente";
  renderWizardSummary();
}

function clearFilters() {
  state.filters.search = "";
  state.filters.brands.clear();
  state.filters.bodyTypes.clear();
  state.filters.engineTypes.clear();
  state.filters.minCc = "";
  state.filters.maxCc = "";
  els.searchInput.value = "";
  els.minCcInput.value = "";
  els.maxCcInput.value = "";
  els.brandFilters.querySelectorAll("input").forEach((input) => {
    input.checked = false;
  });
  recalculate();
}

function getSettings() {
  const fileSettings = window.MOTOMATCH_SUPABASE;
  if (fileSettings?.url && fileSettings?.key) {
    return {
      url: fileSettings.url,
      key: fileSettings.key,
      table: fileSettings.table || DEFAULT_TABLE
    };
  }
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function loadSettingsIntoDialog() {
  const settings = getSettings() || {};
  els.supabaseUrlInput.value = settings.url || "";
  els.supabaseKeyInput.value = settings.key || "";
  els.supabaseTableInput.value = settings.table || DEFAULT_TABLE;
}

function saveSettings() {
  const settings = {
    url: els.supabaseUrlInput.value.trim(),
    key: els.supabaseKeyInput.value.trim(),
    table: els.supabaseTableInput.value.trim() || DEFAULT_TABLE
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  els.settingsDialog.close();
  loadData();
}

function matchesTransmissionPreference(moto) {
  if (state.user.transmissionPreference === "any") return true;
  if (state.user.transmissionPreference === "automatic") return automaticTransmissionSlugs.has(moto.transmission_slug);
  if (state.user.transmissionPreference === "manual") return manualTransmissionSlugs.has(moto.transmission_slug) || moto.transmission_slug.startsWith("manual");
  return true;
}

function isLicenseCompatible(required, userLicense) {
  const requiredValue = String(required || "").toUpperCase();
  if (!requiredValue) return true;
  const order = { A1: 1, A2: 2, A: 3 };
  return (order[userLicense] || 0) >= (order[requiredValue] || 3);
}

function profileLicenseAllows(licenseValues, motoLicense) {
  const value = String(motoLicense || "").toUpperCase();
  return licenseValues.some((license) => {
    if (license === "A2_OR_A1") return value === "A1" || value === "A2";
    if (license === "A_OR_A2") return value === "A" || value === "A2";
    return license === value;
  });
}

function maxReasonableSeatHeight() {
  return Math.round(state.user.height * 4.72 + 28);
}

function weightLimitFromPreference() {
  if (state.user.weightTolerance === "light") return 200;
  if (state.user.weightTolerance === "medium") return 230;
  return 0;
}

function seatFitScore(moto) {
  if (!moto.seat_height_mm) return 50;
  const idealSeat = state.user.height * 4.62;
  const delta = Math.abs(moto.seat_height_mm - idealSeat);
  return clamp(Math.round(100 - delta * 0.55), 10, 100);
}

function consumptionScore(moto) {
  if (!moto.consumption_l_100km) return 50;
  return clamp(Math.round(100 - moto.consumption_l_100km * 12), 10, 100);
}

function labelBody(slug) {
  return getBody(slug)?.name || titleFromSlug(slug);
}

function getBody(slug) {
  return state.tables.body.find((body) => body.slug === slug);
}

function labelTaxonomy(table, slug) {
  const key = table === "engine" ? "engine" : table === "transmission" ? "transmission" : table;
  const row = state.tables[key]?.find((item) => item.slug === slug);
  return row?.name || titleFromSlug(slug);
}

function scoreLabel(field) {
  const labels = {
    route_power_score: "Ruta / motor",
    wind_protection_score: "Viento",
    city_score: "Ciudad",
    polyvalence_score: "Polivalencia",
    mountain_score: "Montana",
    long_touring_score: "Viajes largos",
    urban_heat_score: "Calor urbano",
    urban_fatigue_score: "Fatiga urbana",
    lane_filtering_score: "Filtrado"
  };
  return labels[field] || titleFromSlug(field);
}

function preferenceLabel(value) {
  const labels = { any: "Indiferente", manual: "Manual", automatic: "Automatica" };
  return labels[value] || value;
}

function parseJsonMaybe(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).toUpperCase());
  return [String(value).toUpperCase()];
}

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toggleSet(set, value) {
  if (set.has(value)) set.delete(value);
  else set.add(value);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "es"));
}

function filterPill(filter, value, label) {
  return `<button class="pill" type="button" data-filter="${escapeAttr(filter)}" data-filter-value="${escapeAttr(value)}">${escapeHtml(label)}</button>`;
}

function titleFromSlug(slug) {
  return String(slug || "n/d").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

init();
