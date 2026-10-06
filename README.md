# Juli & Hernán — Web de RSVP

Sitio de una sola página para la invitación de boda, con formulario de confirmación de asistencia (RSVP) que guarda cada respuesta en una Google Sheet.

## Estructura

```
index.html          → contenido: sobre con sello, portada, ubicación (con el logo del salón), invitación + calendario,
                      programa (enredadera), vestimenta, confirmación y cierre (mismo orden que el Figma),
                      con una franja rosa con ornamento entre sección y sección
style.css           → estilos (paleta, tipografías, layout)
envelope.js         → sobre de entrada (sello) y SOBRE1 con el calendario (misma secuencia que el Figma)
effects.js          → aparición al hacer scroll, enredadera del programa que crece con el scroll y pétalos
script.js           → lógica del formulario (envío a Google Sheets)
music.js            → música de fondo
apps-script/Code.gs → backend (Google Apps Script) que recibe el formulario y escribe en la planilla
assets/icons/       → íconos del programa (exportados del Figma, "Posibles Piezas" / Page 5):
                      bienvenida, ceremonia, recepcion, cena, manos (fin de fiesta) y las flores de la enredadera (flor-1/2/3)
assets/enredadera.svg      → tallo y hojas de la línea del programa
assets/marco-fondo.webp    → fondo de la franja entre secciones: rosa #BE7F84 con la textura en multiplicar
                             (va espejado para repetirse sin costura); el ornamento es assets/ornaments/marco.svg
assets/marco-fondo-crema.webp → la misma textura en crema, para las franjas de arriba y abajo de la pantalla
                             inicial; ahí el ornamento va en rosa #B87177 (assets/ornaments/marco-rosa.svg)
assets/el-abierto.svg      → logo del salón, en Ubicación
assets/calendario-tarjeta.svg → tarjeta del calendario que sale del sobre: papel con esquinas recortadas y doble filete
assets/inicio-*.webp       → pantalla inicial: fondo de lirios visto por el vidrio acanalado (vertical y versión
                             ancha para pantallas apaisadas), sobre cerrado y sello
assets/ruido.png           → grano de la capa de arriba de la pantalla inicial
assets/fondo-durazno.webp  → fondo de Ubicación y Vestimenta

assets/ornaments/   → ornamentos vectoriales del Figma (fleurons, heart-flourish, flourish, divisor, marco)
```

Diseño: frames "pantalla inicio" (sobre de entrada) y "Correccion final" en la página "Page 5" del Figma "Posibles Piezas"
(la versión anterior salió de "CORREGIDO · Invitación Juli & Hernán"; componentes en "Componentes · Invitación").
La tarjeta del calendario sale de "Frame 97" y la franja entre secciones del componente "marco", en la misma página.

Sin uso desde la versión del 4/10/2026 (se pueden borrar): `assets/marco-encaje.webp`, `assets/ramo-velo.jpg`,
`assets/ubicacion-marco.svg`, `assets/ubicacion-foto.webp`, `assets/sobre1-puntilla.webp`. Desde el 5/10/2026
tampoco se usa `assets/encaje.webp` (la puntilla de la pantalla inicial se cambió por la franja "marco").

Tipografías: Cormorant Garamond (títulos de sección, fechas, subtítulos y formulario), Pochaevsk (cuerpo y
título de la invitación), Monsieur La Doulaise + Miss Fajardose (nombres). Colores: rosa `#B87177`,
sello `#E5989B`, crema `#F0EAD6`, tinta `#2A2E1A`, arena `#E8D8C8`, durazno `#EBD9C7` (bajo la textura).

## Pantalla inicial (capas)

La pantalla del sobre repite las capas del frame "pantalla inicio", de abajo hacia arriba:

1. Foto de lirios detrás del vidrio acanalado (tiras de 60 px con efecto Glass). El vidrio va horneado en
   `inicio-fondo.webp`; si cambia la foto o el vidrio en el Figma hay que volver a generar esa imagen.
2. Velo `#685454` al 40 %.
3. Sobre, sello y, encima de los dos, velo `#D9D9D9` al 20 %.
4. Capa `#ABABAB` al 18 % con ruido (negro al 25 % sobre esa capa: 4,5 % efectivo).
5. Arriba de todo, la franja "marco" en crema arriba y la misma girada 180° abajo (`.marco--intro`).

Las capas 2, 3 (velo) y 4 son CSS (`.intro__velo`, `.intro__env-velo`, `.intro__grano`): se ajustan desde `style.css`.
Al tocar, el sello late, se quiebra y toda la pantalla sube para dejar ver la portada (`envelope.js`).

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
- Horarios del programa: editar el texto de cada `<li class="t-item">` en `index.html`.
- Campos del formulario: agregar o quitar `<div class="field">` en `index.html`, y reflejar el cambio en `script.js` y `apps-script/Code.gs`.
