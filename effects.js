// Efectos de la página: aparición al hacer scroll, línea del programa que
// avanza con el scroll, lluvia de pétalos y botones para agendar la fecha.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Aparición al hacer scroll ----------
  const revealables = document.querySelectorAll('[data-reveal]');
  // Escalonado dentro de cada sección: cada elemento sale un poquito después del anterior.
  document.querySelectorAll('.section').forEach((sec) => {
    sec.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--rd', `${Math.min(i, 6) * 0.08}s`));
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  // ---------- Línea de tiempo del programa ----------
  const timeline = document.getElementById('timeline');
  if (timeline) {
    const items = Array.from(timeline.querySelectorAll('.t-item'));
    let ticking = false;
    function update() {
      ticking = false;
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      // La línea se completa mientras el programa cruza el centro de la pantalla.
      const p = Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height));
      timeline.style.setProperty('--p', p.toFixed(3));
      items.forEach((it) => {
        const dot = it.querySelector('.t-item__dot').getBoundingClientRect();
        if (dot.top < vh * 0.62) it.classList.add('is-in');
      });
    }
    if (reduceMotion) {
      timeline.style.setProperty('--p', 1);
      items.forEach((it) => it.classList.add('is-in'));
    } else {
      window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  // ---------- Pétalos ----------
  const colors = ['#E5989B', '#F3C9C6', '#FFF8EE', '#B87177', '#F0EAD6'];
  function burst(count) {
    if (reduceMotion) return;
    const layer = document.createElement('div');
    layer.className = 'petals';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      const s = 9 + Math.random() * 12;
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `--s:${s}px`,
        `--c:${colors[i % colors.length]}`,
        `--dx:${(Math.random() - 0.5) * 220}px`,
        `--r:${(Math.random() - 0.5) * 720}deg`,
        `--t:${3.2 + Math.random() * 2.6}s`,
        `--delay:${Math.random() * 0.9}s`,
      ].join(';');
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 7500);
  }
  window.petals = { burst };

  // ---------- Agendar la fecha ----------
  const EVENT = {
    title: 'Casamiento de Juli y Hernán',
    location: 'Avenida Triunvirato 6386, CABA, Argentina',
    details: '¡Nos casamos! Te esperamos para celebrar juntos. https://camilarodriguezturri.github.io/juli-hernan-rsvp/',
    // 18:30 a 03:30 hora de Buenos Aires (UTC-3)
    start: '20261226T213000Z',
    end: '20261227T063000Z',
  };
  const gcal = document.getElementById('gcal-link');
  if (gcal) {
    const q = new URLSearchParams({ action: 'TEMPLATE', text: EVENT.title, dates: `${EVENT.start}/${EVENT.end}`, details: EVENT.details, location: EVENT.location });
    gcal.href = `https://calendar.google.com/calendar/render?${q.toString()}`;
  }
  const ics = document.getElementById('ics-link');
  if (ics) {
    ics.addEventListener('click', () => {
      const esc = (s) => s.replace(/[,;\\]/g, (m) => '\\' + m);
      const body = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Juli y Hernan//Invitacion//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:boda-juli-hernan-20261226@invitacion',
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `DTSTART:${EVENT.start}`, `DTEND:${EVENT.end}`,
        `SUMMARY:${esc(EVENT.title)}`, `LOCATION:${esc(EVENT.location)}`, `DESCRIPTION:${esc(EVENT.details)}`,
        'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Mañana es el casamiento de Juli y Hernán', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'casamiento-juli-y-hernan.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
})();
