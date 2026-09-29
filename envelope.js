// Sobres: el de bienvenida (pantalla completa al entrar) y el del calendario.
// Al tocarlos pasan a data-state="open": se va el sello, se abre la solapa
// y la carta (papel con puntilla) sube desde adentro del sobre.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Calendario de diciembre 2026 (empieza en lunes) ----------
  const grid = document.getElementById('cal-grid');
  if (grid) {
    const YEAR = 2026, MONTH = 11, MARKED = 26; // MONTH 0-indexado: 11 = diciembre
    const heads = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    heads.forEach((h) => {
      const el = document.createElement('span');
      el.className = 'cal__head';
      el.setAttribute('role', 'columnheader');
      el.textContent = h;
      grid.appendChild(el);
    });
    const firstWeekday = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7; // lunes = 0
    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
    for (let i = 0; i < firstWeekday; i++) grid.appendChild(document.createElement('span'));
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('span');
      el.className = 'cal__day' + (d === MARKED ? ' cal__day--mark' : '');
      el.setAttribute('role', 'cell');
      el.textContent = d;
      grid.appendChild(el);
    }
  }

  // ---------- Apertura de sobres ----------
  function openEnvelope(env) {
    if (env.dataset.state === 'open') return;
    env.dataset.state = 'open';
    const open = env.querySelector('.env__open');
    if (open) open.removeAttribute('aria-hidden');
  }

  document.querySelectorAll('[data-env]').forEach((env) => {
    const hit = env.querySelector('.env__hit');
    if (hit) hit.addEventListener('click', () => openEnvelope(env));
  });

  // ---------- Intro ----------
  const intro = document.getElementById('intro');
  if (!intro) return;
  const root = document.documentElement;
  root.classList.add('is-locked');
  window.scrollTo(0, 0);

  const introEnv = intro.querySelector('[data-env]');
  let closing = false;

  function dismissIntro() {
    if (closing) return;
    closing = true;
    intro.classList.add('is-opening');
    openEnvelope(introEnv);
    // Dejamos ver cómo sube la carta y después se desvanece la pantalla.
    setTimeout(() => {
      intro.classList.add('is-gone');
      root.classList.remove('is-locked');
    }, reduceMotion ? 900 : 2300);
    setTimeout(() => intro.remove(), reduceMotion ? 1500 : 3400);
  }

  // Todo el intro es tocable (no sólo el sobre), para que nadie se quede trabado.
  intro.addEventListener('click', dismissIntro);
  intro.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismissIntro(); }
  });
})();
