# Juli & Hernán — Web de RSVP

Sitio de una sola página para la invitación de boda, con formulario de confirmación de asistencia (RSVP) que guarda cada respuesta en una Google Sheet.

## Estructura

```
index.html          → contenido: sobre con sello, portada, ubicación (marco con foto), invitación + calendario,
                      programa (enredadera), vestimenta, confirmación y cierre (mismo orden que el Figma),
                      con una puntilla de encaje entre sección y sección
style.css           → estilos (paleta, tipografías, layout)
envelope.js         → sobre de entrada (sello) y SOBRE1 con el calendario (misma secuencia que el Figma)
effects.js          → aparición al hacer scroll, enredadera del programa que crece con el scroll y pétalos
script.js           → lógica del formulario (envío a Google Sheets)
music.js            → música de fondo
apps-script/Code.gs → backend (Google Apps Script) que recibe el formulario y escribe en la planilla
assets/icons/       → íconos del programa (exportados del Figma, "Posibles Piezas" / Page 5):
                      bienvenida, ceremonia, recepcion, cena, manos (fin de fiesta) y las flores de la enredadera (flor-1/2/3)
assets/enredadera.svg      → tallo y hojas de la línea del programa
assets/encaje.webp         → puntilla que separa las secciones (se repite a lo ancho)
assets/fondo-durazno.webp  → fondo de Ubicación y Vestimenta
assets/ubicacion-marco.svg → marco dibujado de Ubicación; adentro va assets/ubicacion-foto.webp

assets/ornaments/   → ornamentos vectoriales del Figma (fleurons, heart-flourish, flourish, divisor)
```

Diseño: frame "Correccion final" en la página "Page 5" del Figma "Posibles Piezas"
(la versión anterior salió de "CORREGIDO · Invitación Juli & Hernán"; componentes en "Componentes · Invitación").

Tipografías: Cormorant Garamond (títulos de sección, fechas, subtítulos y formulario), Pochaevsk (cuerpo y
título de la invitación), Monsieur La Doulaise + Miss Fajardose (nombres). Colores: rosa `#B87177`,
sello `#E5989B`, crema `#F0EAD6`, tinta `#2A2E1A`, arena `#E8D8C8`, durazno `#EBD9C7` (bajo la textura).

## Cómo conectar el formulario a Google Sheets

1. Creá una Google Sheet nueva (o usá una existente).
2. Extensiones > Apps Script.
3. Pegá el contenido de `apps-script/Code.gs`.
4. Implementar > Nueva implementación > tipo **Aplicación web**.
   - Ejecutar como: tu cuenta.
   - Acceso: Cualquier usuario.
5. Copiá la URL que te da la implementación.
6. Pegala en `script.js`, reemplazando el valor de `APPS_SCRIPT_URL`.
7. Cada respuesta del formulario va a aparecer como una fila nueva en la hoja "Respuestas" de esa planilla.

Si más adelante cambiás el formulario y agregás/sacás campos, actualizá en paralelo el `HEADERS` y el `sheet.appendRow(...)` de `Code.gs`.

## Publicar en GitHub Pages

1. Subí estos archivos a un repositorio de GitHub.
2. Settings > Pages > Source: "Deploy from a branch" > rama `main`, carpeta `/ (root)`.
3. GitHub va a publicar el sitio en `https://<usuario>.github.io/<repositorio>/`.

## Personalización

- Fecha, nombres y dirección: editar directamente el texto en `index.html`.
- Link de Google Maps: reemplazar el `href` del botón "Ver en Google Maps" en `index.html` por el link exacto del lugar (podés generarlo compartiendo la ubicación desde Google Maps).
- Colores y tipografías: variables al inicio de `style.css` (`:root`).
- Foto de Ubicación: reemplazar `assets/ubicacion-foto.webp` por otra exportada del Figma con la misma máscara ovalada.
- Horarios del programa: editar el texto de cada `<li class="t-item">` en `index.html`.
- Campos del formulario: agregar o quitar `<div class="field">` en `index.html`, y reflejar el cambio en `script.js` y `apps-script/Code.gs`.
