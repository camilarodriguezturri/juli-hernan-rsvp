# Juli & Hernán — Web de RSVP

Sitio de una sola página para la invitación de boda, con formulario de confirmación de asistencia (RSVP) que guarda cada respuesta en una Google Sheet.

## Estructura

```
index.html         → contenido y estructura de la página
style.css           → estilos (paleta, tipografías, layout)
script.js           → lógica del formulario (envío a Google Sheets)
apps-script/Code.gs → backend (Google Apps Script) que recibe el formulario y escribe en la planilla
```

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
- Campos del formulario: agregar o quitar `<div class="field">` en `index.html`, y reflejar el cambio en `script.js` y `apps-script/Code.gs`.
