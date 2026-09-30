// Sobres: el de bienvenida (primer plano con el sello, pantalla completa)
// y el de la invitación, que al tocarlo se abre y deja ver el calendario.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // ---------- Calendario de diciembre 2026 (empieza en domingo) ----------
  const grid = document.getElementById('cal-grid');
  if (grid) {
    const YEAR = 2026, MONTH = 11, MARKED = 26; // MONTH 0-indexado: 11 = diciembre
    ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'].forEach((h) => {
      const el = document.createElement('span');
      el.className = 'cal__head';
      el.setAttribute('role', 'columnheader');
      el.textContent = h;
      grid.appendChild(el);
    });
    const firstWeekday = new Date(YEAR, MONTH, 1).getDay(); // domingo = 0, como en el Figma
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

  // ---------- SOBRE1: misma secuencia que el prototipo del Figma ----------
  // Default --(clic)--> Variant3 (se abre, el calendario asoma) --(0,2 s)--> Variant2 (el calendario sale).
  document.querySelectorAll('[data-sobre]').forEach((sobre) => {
    const hit = sobre.querySelector('.sobre__hit');
    if (!hit) return;
    hit.addEventListener('click', () => {
      if (sobre.dataset.state) return;
      sobre.dataset.state = 'abierto';
      setTimeout(() => {
        sobre.dataset.state = 'afuera';
        if (window.petals) setTimeout(() => window.petals.burst(18), 500);
      }, reduceMotion ? 50 : 550);
    });
  });

  // ---------- Intro: sobre cerrado con el sello ----------
  const intro = document.getElementById('intro');
  if (!intro) { root.classList.add('is-open'); return; }
  root.classList.add('is-locked');
  window.scrollTo(0, 0);

  let opened = false;
  function openIntro() {
    if (opened) return;
    opened = true;
    intro.classList.add('is-opening');
    if (window.petals) window.petals.burst(34);
    // El sello se quiebra y enseguida el sobre se levanta dejando ver la portada.
    setTimeout(() => {
      intro.classList.add('is-gone');
      root.classList.remove('is-locked');
      root.classList.add('is-open');
    }, reduceMotion ? 250 : 650);
    setTimeout(() => intro.remove(), reduceMotion ? 900 : 2000);
  }

  intro.addEventListener('click', openIntro);
  intro.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIntro(); }
  });
})();
