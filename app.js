const STORAGE_KEY = "motomatch:supabase";

const useCases = [
  { id: "commute", label: "Ciudad y diario", detail: "Agilidad, consumo bajo, asiento accesible y mantenimiento razonable." },
  { id: "touring", label: "Viajes", detail: "Confort, protección, autonomía, carga y estabilidad a ritmo sostenido." },
  { id: "mixed", label: "Todo uso", detail: "Equilibrio real entre diario, escapadas, pasajero y carreteras rotas." },
  { id: "offroad", label: "Pistas", detail: "Rueda delantera grande, suspensiones, ergonomía de pie y peso contenido." },
  { id: "sport", label: "Curvas", detail: "Chasis, frenos, respuesta, precisión y margen de inclinación." },
  { id: "beginner", label: "Primera moto", detail: "Peso, docilidad, coste, confianza y altura de asiento amable." }
];

const bodyTypes = [
  {
    id: "trail",
    label: "Trail / Adventure",
    detail: "La navaja suiza moderna: postura erguida, suspensiones largas y buen rango de uso.",
    ups: {
      commute: ["Visibilidad alta", "Absorbe baches"],
      touring: ["Muy cómoda", "Mucha capacidad de carga"],
      mixed: ["La más versátil", "Buena ergonomía"],
      offroad: ["Admite pistas", "Ruedas y suspensiones útiles"],
      sport: ["Manillar ancho", "Buen control"],
      beginner: ["Postura natural", "Moto fácil de entender"]
    },
    downs: {
      commute: ["Puede ser alta", "Volumen en ciudad"],
      touring: ["Neumáticos mixtos duran menos"],
      mixed: ["No destaca en nada extremo"],
      offroad: ["Peso alto en caídas"],
      sport: ["Menos precisa que una naked"],
      beginner: ["Altura y peso pueden intimidar"]
    }
  },
  {
    id: "naked",
    label: "Naked",
    detail: "Ligera, directa y divertida. Muy buena para aprender y moverse a diario.",
    ups: {
      commute: ["Muy ágil", "Coste contenido"],
      touring: ["Sencilla de mantener", "Peso bajo"],
      mixed: ["Buen equilibrio", "Divertida en curvas"],
      offroad: ["Controlable en caminos fáciles"],
      sport: ["Precisa y reactiva", "Buenas frenadas"],
      beginner: ["Fácil de manejar", "Asiento medio"]
    },
    downs: {
      commute: ["Poca protección de viento"],
      touring: ["Cansa en autopista"],
      mixed: ["Limitada con pasajero y carga"],
      offroad: ["Suspensión corta", "Ruedas de asfalto"],
      sport: ["Menos aerodinámica"],
      beginner: ["Algunas son bruscas"]
    }
  },
  {
    id: "sport_touring",
    label: "Sport touring",
    detail: "Para viajar rápido sin renunciar a comodidad ni equipaje.",
    ups: {
      commute: ["Motor elástico", "Buena estabilidad"],
      touring: ["Protección alta", "Ritmo sostenido"],
      mixed: ["Viaja y curvea bien", "Buen pasajero"],
      offroad: ["Apta para carreteras rotas"],
      sport: ["Chasis estable", "Frenos potentes"],
      beginner: ["Entrega progresiva en modelos medios"]
    },
    downs: {
      commute: ["Más pesada", "Menos radio de giro"],
      touring: ["Más coste de ruedas"],
      mixed: ["Menos práctica en ciudad"],
      offroad: ["No pensada para tierra"],
      sport: ["Menos ligera que una deportiva"],
      beginner: ["Peso y potencia pueden sobrar"]
    }
  },
  {
    id: "custom",
    label: "Custom / Cruiser",
    detail: "Asiento bajo, estética fuerte y conducción relajada.",
    ups: {
      commute: ["Asiento muy bajo", "Motor suave"],
      touring: ["Cómoda a ritmo tranquilo", "Gran estabilidad"],
      mixed: ["Fácil llegar al suelo", "Carácter mecánico"],
      offroad: ["Buena tracción a baja velocidad"],
      sport: ["Centro de gravedad bajo"],
      beginner: ["Da confianza parada", "Entrega amable"]
    },
    downs: {
      commute: ["Peso alto", "Rozan pronto"],
      touring: ["Suspensión limitada"],
      mixed: ["Menos polivalente"],
      offroad: ["Muy limitada fuera de asfalto"],
      sport: ["Poco ángulo", "Frenos más justos"],
      beginner: ["Puede pesar demasiado"]
    }
  },
  {
    id: "scooter",
    label: "Scooter",
    detail: "Practicidad total para ciudad y trayectos diarios.",
    ups: {
      commute: ["Hueco bajo asiento", "Automático"],
      touring: ["Protección decente", "Cómodo en ritmos legales"],
      mixed: ["Muy práctico", "Consumo bajo"],
      offroad: ["Fácil en pistas compactas"],
      sport: ["Ágil en ratoneras"],
      beginner: ["Sin marchas", "Muy accesible"]
    },
    downs: {
      commute: ["Rueda pequeña en baches"],
      touring: ["Menos emoción", "Potencia limitada"],
      mixed: ["Poca capacidad fuera de ciudad"],
      offroad: ["Suspensión y ruedas limitan"],
      sport: ["Menos tacto deportivo"],
      beginner: ["Transición a moto manual pendiente"]
    }
  }
];

const engineTypes = [
  { id: "single", label: "Monocilíndrico", detail: "Ligero, económico y con empuje abajo. Vibra más en viaje." },
  { id: "parallel_twin", label: "Bicilíndrico paralelo", detail: "El punto dulce para polivalencia: consumo, coste, par y suavidad." },
  { id: "v_twin", label: "V-Twin", detail: "Carácter, tracción y buena respuesta media. Más calor y coste." },
  { id: "triple", label: "Tricilíndrico", detail: "Muy elástico y emocionante. Suele subir precio y mantenimiento." },
  { id: "inline_four", label: "Cuatro en línea", detail: "Suave y potente arriba. Menos lleno a bajas vueltas en ciudad." },
  { id: "electric", label: "Eléctrico", detail: "Silencio y respuesta inmediata. Autonomía y carga mandan." }
];

const bodyTypeAliases = {
  adventure: "trail",
  dualsport: "trail",
  dual_sport: "trail",
  touring: "sport_touring",
  sporttouring: "sport_touring",
  sport_touring: "sport_touring",
  cruiser: "custom",
  urban: "scooter"
};

const engineTypeAliases = {
  mono: "single",
  monocilindrico: "single",
  single_cylinder: "single",
  bicilindrico: "parallel_twin",
  bicilindrico_paralelo: "parallel_twin",
  twin: "parallel_twin",
  parallel: "parallel_twin",
  v2: "v_twin",
  vtwin: "v_twin",
  three: "triple",
  three_cylinder: "triple",
  four: "inline_four",
  four_cylinder: "inline_four",
  inline4: "inline_four",
  electrica: "electric"
};

const sortOptions = [
  ["overall", "Polivalencia"],
  ["fit", "Encaje por altura"],
  ["commute", "Ciudad"],
  ["touring", "Viajes"],
  ["mixed", "Todo uso"],
  ["offroad", "Pistas"],
  ["sport", "Curvas"],
  ["beginner", "Primera moto"],
  ["value", "Valor/precio"],
  ["weight", "Peso bajo"],
  ["power", "Potencia"]
];

const demoMotorcycles = [
  {
    brand: "Yamaha",
    model: "Tracer 7",
    body_type: "sport_touring",
    engine_type: "parallel_twin",
    displacement_cc: 689,
    seat_height_mm: 835,
    weight_kg: 197,
    power_hp: 73,
    price_eur: 9299,
    image_urls: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 78, touring: 88, mixed: 91, offroad: 36, sport: 82, beginner: 66, value: 84 },
    pros: ["Motor CP2 muy elástico", "Buena para viajar y diario", "Coste razonable"],
    cons: ["Pista limitada", "Asiento algo alto para tallas bajas"]
  },
  {
    brand: "Honda",
    model: "CB500X / NX500",
    body_type: "trail",
    engine_type: "parallel_twin",
    displacement_cc: 471,
    seat_height_mm: 830,
    weight_kg: 196,
    power_hp: 47,
    price_eur: 7390,
    image_urls: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 86, touring: 76, mixed: 88, offroad: 61, sport: 58, beginner: 90, value: 88 },
    pros: ["Muy amable para empezar", "Consumo bajo", "Fiabilidad Honda"],
    cons: ["Potencia justa con pasajero", "Suspensión sencilla"]
  },
  {
    brand: "Suzuki",
    model: "V-Strom 650",
    body_type: "trail",
    engine_type: "v_twin",
    displacement_cc: 645,
    seat_height_mm: 835,
    weight_kg: 213,
    power_hp: 71,
    price_eur: 8999,
    image_urls: [
      "https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 73, touring: 90, mixed: 89, offroad: 54, sport: 70, beginner: 68, value: 82 },
    pros: ["Motor suave y fiable", "Gran viajera media", "Muy equilibrada"],
    cons: ["Peso perceptible", "Diseño veterano"]
  },
  {
    brand: "BMW",
    model: "F 900 GS",
    body_type: "trail",
    engine_type: "parallel_twin",
    displacement_cc: 895,
    seat_height_mm: 870,
    weight_kg: 219,
    power_hp: 105,
    price_eur: 13950,
    image_urls: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 62, touring: 88, mixed: 87, offroad: 82, sport: 76, beginner: 38, value: 62 },
    pros: ["Muy capaz en pistas", "Electrónica completa", "Motor potente"],
    cons: ["Alta", "Precio elevado", "Exigente para novatos"]
  },
  {
    brand: "Kawasaki",
    model: "Z650",
    body_type: "naked",
    engine_type: "parallel_twin",
    displacement_cc: 649,
    seat_height_mm: 790,
    weight_kg: 188,
    power_hp: 68,
    price_eur: 7799,
    image_urls: [
      "https://images.unsplash.com/photo-1508357941501-0924cf312bbd?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 88, touring: 55, mixed: 76, offroad: 18, sport: 81, beginner: 80, value: 86 },
    pros: ["Ligera y baja", "Divertida en curvas", "Buen precio"],
    cons: ["Poca protección aerodinámica", "Limitada para viajar cargado"]
  },
  {
    brand: "Honda",
    model: "X-ADV 750",
    body_type: "scooter",
    engine_type: "parallel_twin",
    displacement_cc: 745,
    seat_height_mm: 820,
    weight_kg: 236,
    power_hp: 58,
    price_eur: 12990,
    image_urls: [
      "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 91, touring: 76, mixed: 78, offroad: 48, sport: 55, beginner: 62, value: 54 },
    pros: ["DCT muy práctico", "Protege bien", "Uso diario excelente"],
    cons: ["Pesado", "Caro", "Menos tacto de moto clásica"]
  },
  {
    brand: "Royal Enfield",
    model: "Himalayan 450",
    body_type: "trail",
    engine_type: "single",
    displacement_cc: 452,
    seat_height_mm: 825,
    weight_kg: 196,
    power_hp: 40,
    price_eur: 5890,
    image_urls: [
      "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 78, touring: 70, mixed: 81, offroad: 78, sport: 45, beginner: 82, value: 92 },
    pros: ["Precio fuerte", "Cómoda en pistas", "Mecánica simple"],
    cons: ["Prestaciones justas", "Vibraciones a alta velocidad"]
  },
  {
    brand: "Triumph",
    model: "Tiger Sport 660",
    body_type: "sport_touring",
    engine_type: "triple",
    displacement_cc: 660,
    seat_height_mm: 835,
    weight_kg: 206,
    power_hp: 81,
    price_eur: 9695,
    image_urls: [
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=900&q=80"
    ],
    use_scores: { commute: 75, touring: 84, mixed: 87, offroad: 28, sport: 83, beginner: 62, value: 77 },
    pros: ["Motor tricilíndrico brillante", "Buen confort", "Muy equilibrada"],
    cons: ["Poca pista", "Asiento alto para algunos"]
  }
];

const state = {
  step: 0,
  height: 175,
  useCase: "mixed",
  selectedBodyTypes: new Set(["trail", "naked", "sport_touring"]),
  selectedEngineTypes: new Set(["parallel_twin"]),
  allMotorcycles: [],
  filteredMotorcycles: [],
  filters: {
    search: "",
    brands: new Set(),
    bodyTypes: new Set(),
    engineTypes: new Set(),
    minCc: "",
    maxCc: "",
    minSeat: "",
    maxSeat: ""
  },
  sortBy: "overall",
  dataMode: "demo"
};

const els = {
  heightInput: document.querySelector("#heightInput"),
  heightOutput: document.querySelector("#heightOutput"),
  useOptions: document.querySelector("#useOptions"),
  bodyTypeOptions: document.querySelector("#bodyTypeOptions"),
  engineOptions: document.querySelector("#engineOptions"),
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
  minSeatInput: document.querySelector("#minSeatInput"),
  maxSeatInput: document.querySelector("#maxSeatInput"),
  clearFiltersBtn: document.querySelector("#clearFiltersBtn"),
  activeFilters: document.querySelector("#activeFilters"),
  motorcycleList: document.querySelector("#motorcycleList"),
  resultsCount: document.querySelector("#resultsCount"),
  emptyState: document.querySelector("#emptyState"),
  settingsDialog: document.querySelector("#settingsDialog"),
  dataSettingsBtn: document.querySelector("#dataSettingsBtn"),
  supabaseUrlInput: document.querySelector("#supabaseUrlInput"),
  supabaseKeyInput: document.querySelector("#supabaseKeyInput"),
  supabaseTableInput: document.querySelector("#supabaseTableInput"),
  saveSettingsBtn: document.querySelector("#saveSettingsBtn"),
  useDemoDataBtn: document.querySelector("#useDemoDataBtn")
};

function normalizeMotorcycle(raw) {
  const imageUrls = parseList(raw.image_urls || raw.photos || raw.images || raw.photo_urls || []);
  const useScores = raw.use_scores || raw.scores || {};
  const bodyType = normalizeOption(raw.body_type || raw.bodyType || raw.category || "mixed", bodyTypeAliases);
  const engineType = normalizeOption(raw.engine_type || raw.engineType || raw.engine || "parallel_twin", engineTypeAliases);

  return {
    id: raw.id || `${raw.brand}-${raw.model}`.toLowerCase().replaceAll(" ", "-"),
    brand: raw.brand || raw.make || "Marca desconocida",
    model: raw.model || raw.name || "Modelo sin nombre",
    body_type: bodyType,
    engine_type: engineType,
    displacement_cc: Number(raw.displacement_cc || raw.cc || raw.cilindrada || 0),
    seat_height_mm: Number(raw.seat_height_mm || raw.seatHeightMm || raw.seat_height || 0),
    weight_kg: Number(raw.weight_kg || raw.weightKg || raw.weight || 0),
    power_hp: Number(raw.power_hp || raw.powerHp || raw.hp || 0),
    price_eur: Number(raw.price_eur || raw.priceEur || raw.price || 0),
    image_urls: imageUrls,
    use_scores: {
      commute: Number(useScores.commute || raw.score_commute || 50),
      touring: Number(useScores.touring || raw.score_touring || 50),
      mixed: Number(useScores.mixed || raw.score_mixed || 50),
      offroad: Number(useScores.offroad || raw.score_offroad || 50),
      sport: Number(useScores.sport || raw.score_sport || 50),
      beginner: Number(useScores.beginner || raw.score_beginner || 50),
      value: Number(useScores.value || raw.score_value || 50)
    },
    pros: arrayFrom(raw.pros || raw.ups || raw.highlights),
    cons: arrayFrom(raw.cons || raw.downs || raw.watchouts)
  };
}

function arrayFrom(value) {
  const parsed = parseList(value);
  if (parsed.length) return parsed;
  return [];
}

function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  if (typeof value === "string") return value.split("|").map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeOption(value, aliases) {
  const cleaned = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return aliases[cleaned] || cleaned;
}

function labelFor(collection, id) {
  return collection.find((item) => item.id === id)?.label || id.replaceAll("_", " ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function seatFitScore(moto) {
  if (!moto.seat_height_mm) return 50;
  const inseamEstimate = state.height * 4.6;
  const seatDelta = Math.abs(moto.seat_height_mm - inseamEstimate);
  const weightPenalty = moto.weight_kg > 220 && state.height < 172 ? 10 : 0;
  return clamp(Math.round(100 - seatDelta * 0.42 - weightPenalty), 15, 100);
}

function scoreFor(moto, key = state.sortBy) {
  const scores = moto.use_scores;
  const fit = seatFitScore(moto);

  if (key === "fit") return fit;
  if (key === "weight") return moto.weight_kg ? clamp(120 - moto.weight_kg / 2.5, 10, 100) : 50;
  if (key === "power") return clamp(moto.power_hp || 0, 10, 100);
  if (key !== "overall") return scores[key] || 50;

  const selectedUse = scores[state.useCase] || 50;
  const mixed = scores.mixed || 50;
  const value = scores.value || 50;
  const bodyBoost = state.selectedBodyTypes.has(moto.body_type) ? 7 : -5;
  const engineBoost = state.selectedEngineTypes.has(moto.engine_type) ? 5 : -2;
  return clamp(Math.round(selectedUse * 0.38 + mixed * 0.24 + fit * 0.18 + value * 0.12 + bodyBoost + engineBoost), 0, 100);
}

function init() {
  renderWizardChoices();
  renderSortOptions();
  bindEvents();
  loadSettingsIntoDialog();
  loadMotorcycles();
}

function renderWizardChoices() {
  els.useOptions.innerHTML = useCases.map((item) => choiceCard(item, state.useCase === item.id, "use")).join("");
  els.bodyTypeOptions.innerHTML = bodyTypes.map((item) => bodyCard(item)).join("");
  els.engineOptions.innerHTML = engineTypes.map((item) => choiceCard(item, state.selectedEngineTypes.has(item.id), "engine")).join("");
}

function choiceCard(item, selected, type) {
  return `
    <button class="choice-card ${selected ? "is-selected" : ""}" type="button" data-choice-type="${type}" data-id="${item.id}">
      <strong>${item.label}</strong>
      <span>${item.detail}</span>
    </button>
  `;
}

function bodyCard(item) {
  const selected = state.selectedBodyTypes.has(item.id);
  const ups = item.ups[state.useCase] || [];
  const downs = item.downs[state.useCase] || [];
  return `
    <button class="body-card ${selected ? "is-selected" : ""}" type="button" data-choice-type="body" data-id="${item.id}">
      <strong>${item.label}</strong>
      <p>${item.detail}</p>
      <ul>
        ${ups.map((text) => `<li>${text}</li>`).join("")}
        ${downs.map((text) => `<li class="down">${text}</li>`).join("")}
      </ul>
    </button>
  `;
}

function renderSortOptions() {
  els.sortSelect.innerHTML = sortOptions.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  els.sortSelect.value = state.sortBy;
}

function bindEvents() {
  els.heightInput.addEventListener("input", () => {
    state.height = Number(els.heightInput.value);
    els.heightOutput.value = `${state.height} cm`;
    applyFilters();
    renderWizardSummary();
  });

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

  els.searchInput.addEventListener("input", () => {
    state.filters.search = els.searchInput.value.trim().toLowerCase();
    applyFilters();
  });

  els.sortSelect.addEventListener("change", () => {
    state.sortBy = els.sortSelect.value;
    applyFilters();
  });

  [els.minCcInput, els.maxCcInput, els.minSeatInput, els.maxSeatInput].forEach((input) => {
    input.addEventListener("input", () => {
      state.filters.minCc = els.minCcInput.value;
      state.filters.maxCc = els.maxCcInput.value;
      state.filters.minSeat = els.minSeatInput.value;
      state.filters.maxSeat = els.maxSeatInput.value;
      applyFilters();
    });
  });

  els.clearFiltersBtn.addEventListener("click", clearFilters);
  els.dataSettingsBtn.addEventListener("click", () => els.settingsDialog.showModal());
  els.saveSettingsBtn.addEventListener("click", saveSettings);
  els.useDemoDataBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    els.settingsDialog.close();
    state.dataMode = "demo";
    setMotorcycles(demoMotorcycles);
  });
}

function handleChoice(type, id) {
  if (type === "use") {
    state.useCase = id;
    state.sortBy = id === "mixed" ? "overall" : id;
    els.sortSelect.value = state.sortBy;
    renderWizardChoices();
  }

  if (type === "body") {
    toggleSet(state.selectedBodyTypes, id);
    renderWizardChoices();
  }

  if (type === "engine") {
    toggleSet(state.selectedEngineTypes, id);
    renderWizardChoices();
  }

  renderWizardSummary();
  applyFilters();
}

function toggleSet(set, value) {
  if (set.has(value)) set.delete(value);
  else set.add(value);
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
  if (state.step === 4) renderWizardSummary();
}

function renderWizardSummary() {
  els.wizardSummary.innerHTML = [
    ["Estatura", `${state.height} cm`],
    ["Uso", labelFor(useCases, state.useCase)],
    ["Body types", [...state.selectedBodyTypes].map((id) => labelFor(bodyTypes, id)).join(", ") || "Cualquiera"],
    ["Motor", [...state.selectedEngineTypes].map((id) => labelFor(engineTypes, id)).join(", ") || "Cualquiera"]
  ].map(([label, value]) => `<div class="summary-item"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

async function loadMotorcycles() {
  const settings = getSettings();
  if (!settings?.url || !settings?.key) {
    state.dataMode = "demo";
    setMotorcycles(demoMotorcycles);
    return;
  }

  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(settings.url, settings.key);
    const { data, error } = await supabase.from(settings.table || "motorcycles").select("*").limit(300);
    if (error) throw error;
    state.dataMode = "supabase";
    setMotorcycles(data?.length ? data : demoMotorcycles);
  } catch (error) {
    console.warn("No se pudo cargar Supabase, usando demo:", error);
    state.dataMode = "demo";
    setMotorcycles(demoMotorcycles);
  }
}

function setMotorcycles(items) {
  state.allMotorcycles = items.map(normalizeMotorcycle);
  renderFilterOptions();
  applyFilters();
  renderWizardSummary();
  setStep(state.step);
}

function renderFilterOptions() {
  const brands = unique(state.allMotorcycles.map((moto) => moto.brand));
  const bodies = unique(state.allMotorcycles.map((moto) => moto.body_type));
  const engines = unique(state.allMotorcycles.map((moto) => moto.engine_type));

  els.brandFilters.innerHTML = brands.map((brand) => `
    <label class="check-item">
      <input type="checkbox" data-filter="brand" value="${escapeAttr(brand)}" />
      <span>${escapeHtml(brand)}</span>
    </label>
  `).join("");

  els.bodyFilters.innerHTML = bodies.map((id) => filterPill("body", id, labelFor(bodyTypes, id))).join("");
  els.engineFilters.innerHTML = engines.map((id) => filterPill("engine", id, labelFor(engineTypes, id))).join("");

  els.brandFilters.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) state.filters.brands.add(input.value);
      else state.filters.brands.delete(input.value);
      applyFilters();
    });
  });

  [...els.bodyFilters.querySelectorAll("[data-filter-value]"), ...els.engineFilters.querySelectorAll("[data-filter-value]")].forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.filter === "body" ? state.filters.bodyTypes : state.filters.engineTypes;
      toggleSet(target, button.dataset.filterValue);
      applyFilters();
    });
  });
}

function filterPill(filter, value, label) {
  return `<button class="pill" type="button" data-filter="${escapeAttr(filter)}" data-filter-value="${escapeAttr(value)}">${escapeHtml(label)}</button>`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "es"));
}

function applyFilters() {
  const filters = state.filters;
  let list = [...state.allMotorcycles];

  if (filters.search) {
    list = list.filter((moto) => {
      const haystack = `${moto.brand} ${moto.model} ${moto.body_type} ${moto.engine_type} ${moto.pros.join(" ")} ${moto.cons.join(" ")}`.toLowerCase();
      return haystack.includes(filters.search);
    });
  }

  if (filters.brands.size) list = list.filter((moto) => filters.brands.has(moto.brand));
  if (filters.bodyTypes.size) list = list.filter((moto) => filters.bodyTypes.has(moto.body_type));
  if (filters.engineTypes.size) list = list.filter((moto) => filters.engineTypes.has(moto.engine_type));
  if (filters.minCc) list = list.filter((moto) => moto.displacement_cc >= Number(filters.minCc));
  if (filters.maxCc) list = list.filter((moto) => moto.displacement_cc <= Number(filters.maxCc));
  if (filters.minSeat) list = list.filter((moto) => moto.seat_height_mm >= Number(filters.minSeat));
  if (filters.maxSeat) list = list.filter((moto) => moto.seat_height_mm <= Number(filters.maxSeat));

  list.sort((a, b) => scoreFor(b, state.sortBy) - scoreFor(a, state.sortBy));
  state.filteredMotorcycles = list;
  renderActiveFilterState();
  renderMotorcycleList();
}

function renderActiveFilterState() {
  els.bodyFilters.querySelectorAll("[data-filter-value]").forEach((button) => {
    button.classList.toggle("is-selected", state.filters.bodyTypes.has(button.dataset.filterValue));
  });
  els.engineFilters.querySelectorAll("[data-filter-value]").forEach((button) => {
    button.classList.toggle("is-selected", state.filters.engineTypes.has(button.dataset.filterValue));
  });

  const tokens = [];
  if (state.dataMode === "demo") tokens.push("Datos demo");
  if (state.filters.search) tokens.push(`Búsqueda: ${state.filters.search}`);
  state.filters.brands.forEach((brand) => tokens.push(brand));
  state.filters.bodyTypes.forEach((id) => tokens.push(labelFor(bodyTypes, id)));
  state.filters.engineTypes.forEach((id) => tokens.push(labelFor(engineTypes, id)));
  if (state.filters.minCc || state.filters.maxCc) tokens.push(`${state.filters.minCc || 0}-${state.filters.maxCc || "∞"} cc`);
  if (state.filters.minSeat || state.filters.maxSeat) tokens.push(`${state.filters.minSeat || 0}-${state.filters.maxSeat || "∞"} mm asiento`);

  els.activeFilters.innerHTML = tokens.map((token) => `<span class="filter-token">${escapeHtml(token)}</span>`).join("");
}

function renderMotorcycleList() {
  const count = state.filteredMotorcycles.length;
  els.resultsCount.textContent = `${count} ${count === 1 ? "moto" : "motos"}`;
  els.emptyState.hidden = count !== 0;
  els.motorcycleList.innerHTML = state.filteredMotorcycles.map(motorcycleCard).join("");
}

function motorcycleCard(moto) {
  const mainScore = scoreFor(moto, state.sortBy);
  const visibleScores = ["overall", state.useCase, "fit", "value"].filter((value, index, array) => array.indexOf(value) === index);
  const photos = moto.image_urls.slice(0, 4);
  const name = `${moto.brand} ${moto.model}`;

  return `
    <article class="motorcycle-card">
      <div class="photo-grid" aria-label="Fotos de ${escapeAttr(name)}">
        ${photos.length ? photos.map((url) => `<img src="${escapeAttr(url)}" alt="${escapeAttr(name)}" loading="lazy" />`).join("") : `<div class="photo-fallback">${escapeHtml(moto.brand.charAt(0))}</div>`}
      </div>
      <div class="motorcycle-content">
        <div class="card-title">
          <div>
            <p class="meta-line">${escapeHtml(moto.brand)} · ${escapeHtml(labelFor(bodyTypes, moto.body_type))} · ${escapeHtml(labelFor(engineTypes, moto.engine_type))}</p>
            <h3>${escapeHtml(moto.model)}</h3>
          </div>
          <div class="score-badge"><span>${escapeHtml(sortOptions.find(([key]) => key === state.sortBy)?.[1] || "Score")}</span>${mainScore}</div>
        </div>
        <p class="specs">
          <span>${escapeHtml(moto.displacement_cc || "?")} cc</span>
          <span>${escapeHtml(moto.power_hp || "?")} CV</span>
          <span>${escapeHtml(moto.weight_kg || "?")} kg</span>
          <span>${escapeHtml(moto.seat_height_mm || "?")} mm asiento</span>
          <span>${formatPrice(moto.price_eur)}</span>
        </p>
        <div class="score-detail">
          ${visibleScores.map((score) => scoreRow(score, moto)).join("")}
        </div>
        <div class="pros-cons">
          <div>
            <h4>Ups</h4>
            <ul>${(moto.pros.length ? moto.pros : ["Buena candidata según tus prioridades"]).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
          <div>
            <h4>Downs</h4>
            <ul>${(moto.cons.length ? moto.cons : ["Revisar prueba real y ergonomía antes de decidir"]).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </article>
  `;
}

function scoreRow(score, moto) {
  const label = score === "overall" ? "Polivalencia" : sortOptions.find(([key]) => key === score)?.[1] || score;
  const value = scoreFor(moto, score);
  return `
    <div class="score-row">
      <span>${escapeHtml(label)}</span>
      <div class="score-meter"><span style="width: ${value}%"></span></div>
      <strong>${value}</strong>
    </div>
  `;
}

function formatPrice(price) {
  if (!price) return "Precio n/d";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);
}

function clearFilters() {
  state.filters.search = "";
  state.filters.brands.clear();
  state.filters.bodyTypes.clear();
  state.filters.engineTypes.clear();
  state.filters.minCc = "";
  state.filters.maxCc = "";
  state.filters.minSeat = "";
  state.filters.maxSeat = "";
  els.searchInput.value = "";
  els.minCcInput.value = "";
  els.maxCcInput.value = "";
  els.minSeatInput.value = "";
  els.maxSeatInput.value = "";
  els.brandFilters.querySelectorAll("input").forEach((input) => {
    input.checked = false;
  });
  applyFilters();
}

function getSettings() {
  const fileSettings = window.MOTOMATCH_SUPABASE;
  if (fileSettings?.url && fileSettings?.key) {
    return {
      url: fileSettings.url,
      key: fileSettings.key,
      table: fileSettings.table || "motorcycles"
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
  els.supabaseTableInput.value = settings.table || "motorcycles";
}

function saveSettings() {
  const settings = {
    url: els.supabaseUrlInput.value.trim(),
    key: els.supabaseKeyInput.value.trim(),
    table: els.supabaseTableInput.value.trim() || "motorcycles"
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  els.settingsDialog.close();
  loadMotorcycles();
}

init();
