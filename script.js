// ⚠️ Reemplazá esta URL por la de tu Google Apps Script Web App
// (Extensiones > Apps Script > Implementar > Nueva implementación > Aplicación web).
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1G0TxAklDn_VqBO2cArN2dWUHh-_ShX_DkEjD2U9gu3I1NZySBk6Gn2ETQXu2ujY/exec";

const form = document.getElementById('rsvp-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');

const attendanceRadios = form.querySelectorAll('input[name="asistencia"]');
const companionsWrap = document.getElementById('companions-wrap');
const companionNamesWrap = document.getElementById('companion-names-wrap');

function updateCompanionFields() {
  const selected = form.querySelector('input[name="asistencia"]:checked');
  const attending = selected && selected.value.startsWith('Sí');
  companionsWrap.hidden = !attending;
  companionNamesWrap.hidden = !attending;
}

attendanceRadios.forEach((radio) => radio.addEventListener('change', updateCompanionFields));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  successMsg.hidden = true;
  errorMsg.hidden = true;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (APPS_SCRIPT_URL.includes('PEGA_AQUI')) {
    errorMsg.textContent = 'El formulario todavía no está conectado a la planilla (falta configurar la URL de Apps Script).';
    errorMsg.hidden = false;
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.fecha = new Date().toISOString();

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
    form.reset();
    updateCompanionFields();
  } catch (err) {
    errorMsg.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirmar asistencia';
  }
});
