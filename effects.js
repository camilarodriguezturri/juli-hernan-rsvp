// Efectos de la página: aparición al hacer scroll, enredadera del programa que
// crece con el scroll y lluvia de pétalos.
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
    // Lo último de la página (el "Con amor…" del cierre) nunca llega a cruzar ese margen:
    // al tocar el final del scroll se muestra lo que falte.
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        revealables.forEach((el) => el.classList.add('is-in'));
      }
    }, { passive: true });
  } else {
    revealables.forEach((el) => el.classList.add('is-in'));
  }

  // ---------- Línea de tiempo del programa ----------
  const timeline = document.getElementById('timeline');
  if (timeline) {
    const items = Array.from(timeline.querySelectorAll('.t-item'));
    let ticking = false;
    // La enredadera se acomoda a las filas reales: mide la distancia entre la primera y la última flor
    // (por si el texto o los íconos agrandan alguna fila) y se la pasa al CSS.
    function fitVine() {
      if (items.length < 2) return;
      const first = items[0], last = items[items.length - 1];
      const c0 = first.offsetTop + first.offsetHeight / 2;
      const c1 = last.offsetTop + last.offsetHeight / 2;
      timeline.style.setProperty('--s', ((c1 - c0) / (items.length - 1)).toFixed(2) + 'px');
      timeline.style.setProperty('--row0', c0.toFixed(2) + 'px');
    }
    fitVine();
    window.addEventListener('resize', fitVine);
    window.addEventListener('load', fitVine);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitVine);
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
})();
