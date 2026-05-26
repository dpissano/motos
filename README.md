# MotoMatch

Webapp estatica para ayudar a una persona a elegir la motocicleta mas polivalente segun estatura, uso principal, body type, tipo de motor y filtros comparables.

## Uso

Abre `index.html` en el navegador. La app carga datos demo si no hay Supabase configurado.

## Conectar Supabase

Hay dos caminos.

### Opcion rapida desde la app

Pulsa el boton de ajustes de la esquina superior derecha e introduce:

- Supabase URL
- Anon public key
- Nombre de tabla, por defecto `motorcycles`

La configuracion se guarda en `localStorage`.

### Opcion recomendada para desarrollo local

Copia `config.example.js` como `config.local.js` y rellena tus datos:

```js
window.MOTOMATCH_SUPABASE = {
  url: "https://TU-PROYECTO.supabase.co",
  key: "TU_ANON_PUBLIC_KEY",
  table: "motorcycles"
};
```

`config.local.js` esta ignorado por git para no subir tus datos locales por accidente.

La anon public key de Supabase esta pensada para usarse en cliente, pero las reglas importantes deben estar en Supabase con RLS y policies. Si publicas la app, asume que cualquier usuario podra ver esa anon key.

## Tabla recomendada

La app lee hasta 300 filas de la tabla configurada. Campos recomendados:

| Campo | Tipo sugerido | Ejemplo |
| --- | --- | --- |
| `brand` | text | `Yamaha` |
| `model` | text | `Tracer 7` |
| `body_type` | text | `trail`, `naked`, `sport_touring`, `custom`, `scooter` |
| `engine_type` | text | `single`, `parallel_twin`, `v_twin`, `triple`, `inline_four`, `electric` |
| `displacement_cc` | integer | `689` |
| `seat_height_mm` | integer | `835` |
| `weight_kg` | integer | `197` |
| `power_hp` | integer | `73` |
| `price_eur` | integer | `9299` |
| `image_urls` | text[] o json/text | URLs de fotos |
| `use_scores` | jsonb | `{"commute":78,"touring":88,"mixed":91,"offroad":36,"sport":82,"beginner":66,"value":84}` |
| `pros` | text[] o text con `|` | `Motor elastico|Buena para diario` |
| `cons` | text[] o text con `|` | `Pista limitada|Asiento alto` |

Tambien acepta alias comunes como `photos`, `images`, `photo_urls`, `cc`, `cilindrada`, `seat_height`, `hp`, `price` y `scores`.

## GitHub

El proyecto no tiene remoto configurado todavia. Cuando tengas el repositorio creado en GitHub:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git add .
git commit -m "Initial MotoMatch webapp"
git branch -M main
git push -u origin main
```

Para GitHub Pages, puedes publicar la rama `main` desde Settings > Pages. Si quieres una configuracion fija en produccion, crea un `config.js` publico o pega las credenciales publicas en la pantalla de ajustes desde el navegador donde lo uses.
