# MotoMatch

Webapp estatica para recomendar motos con datos reales desde Supabase.

## Supabase

La tabla principal es `motos`. La app tambien lee estas tablas:

- `body`
- `body_wizard`
- `profile_body_types`
- `engine`
- `riding_position`
- `transmission`
- `cooling`

Las relaciones logicas se cruzan por `slug`, no por `id`.

### Policies de lectura

Con la publishable/anon key, el frontend solo vera filas si Supabase permite `select`.

Para una app publica de solo lectura puedes usar:

```sql
alter table public.motos enable row level security;
alter table public.body enable row level security;
alter table public.body_wizard enable row level security;
alter table public.profile_body_types enable row level security;
alter table public.engine enable row level security;
alter table public.riding_position enable row level security;
alter table public.transmission enable row level security;
alter table public.cooling enable row level security;

create policy "Public read motos" on public.motos for select using (true);
create policy "Public read body" on public.body for select using (true);
create policy "Public read body_wizard" on public.body_wizard for select using (true);
create policy "Public read profile_body_types" on public.profile_body_types for select using (true);
create policy "Public read engine" on public.engine for select using (true);
create policy "Public read riding_position" on public.riding_position for select using (true);
create policy "Public read transmission" on public.transmission for select using (true);
create policy "Public read cooling" on public.cooling for select using (true);
```

Si ya existen policies con esos nombres, edita las existentes o usa nombres distintos.

## Configuracion local

Para GitHub Pages existe `config.js`, que se sube al repo y contiene la publishable key de Supabase.

Para desarrollo local, puedes copiar `config.example.js` como `config.local.js` y sobreescribir la configuracion:

```js
window.MOTOMATCH_SUPABASE = {
  url: "https://TU-PROYECTO.supabase.co",
  key: "TU_ANON_PUBLIC_KEY",
  table: "motos"
};
```

`config.local.js` esta ignorado por git.

El orden de carga es:

1. `config.js`: configuracion publica para produccion/GitHub Pages.
2. `config.local.js`: override local ignorado por git, si existe.
3. `app.js`: arranca la app leyendo `window.MOTOMATCH_SUPABASE`.

## Wizard

El flujo actual:

1. Uso principal: ciudad, ruta, montana, viajes largos o mixto.
2. Seleccion de tipos de moto desde `body`.
3. Ajuste fisico: carnet, altura y tolerancia al peso.
4. Preferencias: transmision, viento, consumo, pasajero/equipaje y caracter.
5. Resultados rankeados y motos descartadas con motivo.

## Ranking

La app usa `weights_json` de `body_wizard`:

```js
ranking_score =
  route_power_score * weight.route_power_score +
  wind_protection_score * weight.wind_protection_score +
  city_score * weight.city_score +
  polyvalence_score * weight.polyvalence_score +
  mountain_score * weight.mountain_score +
  long_touring_score * weight.long_touring_score +
  urban_heat_score * weight.urban_heat_score +
  urban_fatigue_score * weight.urban_fatigue_score +
  lane_filtering_score * weight.lane_filtering_score
```

Si un peso no existe, cuenta como 0. Despues se ajusta ligeramente por fit de altura, body type seleccionado y preferencias de consumo/viaje.

## Normalizacion por slugs

La tabla `motos` no necesita foreign keys. La app normaliza:

- `segment` -> `body.slug`
- `engine_config` -> `engine.slug`
- `gearbox_type` -> `transmission.slug`
- `cooling` -> `cooling.slug`
- `riding_position` -> `riding_position.slug`

Helpers principales en `app.js`:

- `normalizeBodyFromSegment(segment)`
- `normalizeEngine(engine_config)`
- `normalizeTransmission(gearbox_type)`
- `normalizeCooling(cooling)`
- `normalizeRidingPosition(riding_position)`

## GitHub Pages

Si publicas la app como estatica, recuerda que cualquier clave puesta en cliente es visible. Usa una publishable/anon key y protege datos con RLS/policies de solo lectura.
