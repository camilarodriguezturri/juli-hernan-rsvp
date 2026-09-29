// Dibuja el marco doble con esquinas en muesca (como el marco del Figma)
// a medida del bloque real, para que las esquinas no se deformen
// ocupe el ancho que ocupe (celular o escritorio).
(function () {
  const frames = document.querySelectorAll('.deco-frame');
  if (!frames.length) return;

  // Rectángulo (x, y, w, h) con una muesca cóncava de radio r en cada esquina:
  // cada arco está centrado en el vértice, así la esquina queda "mordida".
  function notchedRect(x, y, w, h, r) {
    r = Math.min(r, w / 2 - 1, h / 2 - 1);
    const R = x + w, B = y + h;
    return [
      `M${x + r} ${y}`,
      `H${R - r}`,
      `A${r} ${r} 0 0 0 ${R} ${y + r}`,
      `V${B - r}`,
      `A${r} ${r} 0 0 0 ${R - r} ${B}`,
      `H${x + r}`,
      `A${r} ${r} 0 0 0 ${x} ${B - r}`,
      `V${y + r}`,
      `A${r} ${r} 0 0 0 ${x + r} ${y}`,
      'Z',
    ].join(' ');
  }

  function draw(frame) {
    const svg = frame.querySelector('.deco-frame__svg');
    const outer = frame.querySelector('.deco-frame__outer');
    const inner = frame.querySelector('.deco-frame__inner');
    const w = frame.clientWidth;
    const h = frame.clientHeight;
    if (!svg || !w || !h) return;

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const notch = Math.max(16, Math.min(34, w * 0.07));
    const gap = Math.max(5, Math.min(9, w * 0.02));

    if (outer) outer.setAttribute('d', notchedRect(1, 1, w - 2, h - 2, notch));
    if (inner) inner.setAttribute('d', notchedRect(1 + gap, 1 + gap, w - 2 - gap * 2, h - 2 - gap * 2, notch - gap * 0.4));
  }

  const drawAll = () => frames.forEach(draw);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => draw(e.target)));
    frames.forEach((f) => ro.observe(f));
  } else {
    window.addEventListener('resize', drawAll);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawAll).catch(() => {});
  window.addEventListener('load', drawAll);
  drawAll();
})();
