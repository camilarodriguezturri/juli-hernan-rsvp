/**
 * Wedding RSVP — Google Apps Script backend.
 *
 * Cómo instalarlo:
 * 1. Abrí tu Google Sheet donde querés recibir las respuestas.
 * 2. Extensiones > Apps Script.
 * 3. Borrá el contenido de Code.gs y pegá este archivo entero.
 * 4. Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: Yo (tu cuenta).
 *    - Quién tiene acceso: Cualquier usuario.
 * 5. Copiá la URL de la implementación y pegala en script.js
 *    (constante APPS_SCRIPT_URL) del sitio.
 */

const SHEET_NAME = 'Respuestas';
const HEADERS = [
  'Fecha',
  'Nombre',
  'Asistencia',
  'Cantidad de acompañantes',
  'Nombre de acompañantes',
  'Restricciones alimentarias',
  'Mensaje',
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
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
      data.acompanantes || '',
      data.nombres_acompanantes || '',
      data.restricciones || '',
      data.mensaje || '',
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
