// URL de la Web App de Google Apps Script que escribe en la planilla del cliente.
// (Extensiones > Apps Script > Implementar > Gestionar implementaciones.)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-yurNZz7_sXfoPuVSOYQ9Ck2LCrQagyIE2VWUculvVJebCAammELZ0_0BQTMz5cPM/exec";

const form = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');
const SUBMIT_LABEL = submitBtn.textContent;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  successMsg.hidden = true;
  errorMsg.hidden = true;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    fecha: new Date().toISOString(),
    nombre: form.nombre.value.trim(),
    asistencia: form.querySelector('input[name="asistencia"]:checked').value,
    restricciones: Array.from(form.querySelectorAll('input[name="restricciones"]:checked')).map((c) => c.value).join(', '),
    restriccion_especifica: form.restriccion_especifica.value.trim(),
    ninos: form.ninos.value || '0',
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  try {
    // no-cors: Apps Script Web Apps no devuelven headers CORS legibles,
    // así que enviamos "a ciegas" y asumimos éxito si no hay error de red.
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
    });

    successMsg.hidden = false;
    if (window.petals && data.asistencia.startsWith('Sí')) window.petals.burst(40);
    form.reset();
  } catch (err) {
    errorMsg.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = SUBMIT_LABEL;
  }
});
