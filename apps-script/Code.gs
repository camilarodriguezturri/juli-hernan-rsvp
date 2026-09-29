/**
 * Wedding RSVP — Google Apps Script backend.
 *
 * Cómo instalarlo / actualizarlo:
 * 1. Abrí la Google Sheet donde se reciben las respuestas.
 * 2. Extensiones > Apps Script.
 * 3. Borrá el contenido de Code.gs y pegá este archivo entero.
 * 4. Primera vez: Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta).
 *    - Quién tiene acceso: Cualquier usuario.
 *    Copiá la URL y pegala en script.js (constante APPS_SCRIPT_URL).
 *    Si ya estaba implementado: Implementar > Gestionar implementaciones >
 *    lápiz (editar) > Versión: "Nueva versión" > Implementar. Así la URL no cambia.
 */

const SHEET_NAME = 'Respuestas';
const HEADERS = [
  'Fecha',
  'Nombre',
  'Asistencia',
  'Restricciones alimentarias',
  'Restricción/alergia específica',
  'Cantidad de niños',
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // Si la hoja está vacía o tiene los encabezados del formulario anterior,
  // escribimos los encabezados nuevos en la fila 1.
  const current = sheet.getLastRow() === 0
    ? []
    : sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (current.join('|') !== HEADERS.join('|')) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    if (sheet.getLastColumn() > HEADERS.length) {
      sheet.getRange(1, HEADERS.length + 1, 1, sheet.getLastColumn() - HEADERS.length).clearContent();
    }
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const sheet = getSheet_();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.fecha ? new Date(data.fecha) : new Date(),
      data.nombre || '',
      data.asistencia || '',
      data.restricciones || '',
      data.restriccion_especifica || '',
      data.ninos === undefined ? '' : data.ninos,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP endpoint activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
