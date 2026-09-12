// Dibuja el marco decorativo de la sección "Sábado 26 de Diciembre" a medida,
// según el ancho/alto reales del bloque, para que las esquinas se vean bien
// proporcionadas ocupe el ancho que ocupe (celular o escritorio).
(function () {
  const frame = document.querySelector('.save-date-frame');
  if (!frame) return;
  const svg = frame.querySelector('.save-date-frame__svg');
  const outer = frame.querySelector('.save-date-frame__outer');
  const inner = frame.querySelector('.save-date-frame__inner');
  if (!svg || !outer || !inner) return;

  // Construye el "d" de un rectángulo w×h con una esquina decorativa
  // (curva en S) de tamaño c en cada vértice, en vez de un ángulo recto.
  function roundedFlourishPath(w, h, c) {
    c = Math.min(c, w / 2 - 1, h / 2 - 1);

    // Curva de esquina genérica entre dos puntos que están a distancia c
    // del vértice real, en coordenadas locales (fa a lo largo del eje "a",
    // fb a lo largo del eje "b"), simétrica respecto de la diagonal.
    function corner(vx, vy, ax, ay, bx, by) {
      // punto de entrada: vertice + a*c ; punto de salida: vertice + b*c
      const toXY = (fa, fb) => [vx + (ax * fa + bx * fb) * c, vy + (ay * fa + by * fb) * c];
      const [ex, ey] = toXY(1, 0);
      const [c1x, c1y] = toXY(0.68, 0.06);
      const [c2x, c2y] = toXY(0.5, 0.18);
      const [mx, my] = toXY(0.34, 0.34);
      const [c3x, c3y] = toXY(0.18, 0.5);
      const [c4x, c4y] = toXY(0.06, 0.68);
      const [xx, xy] = toXY(0, 1);
      return `M${ex} ${ey} C${c1x} ${c1y} ${c2x} ${c2y} ${mx} ${my} C${c3x} ${c3y} ${c4x} ${c4y} ${xx} ${xy}`;
    }

    const tl = corner(0, 0, 0, 1, 1, 0);
    const tr = corner(w, 0, -1, 0, 0, 1);
    const br = corner(w, h, 0, -1, -1, 0);
    const bl = corner(0, h, 1, 0, 0, -1);

    return [
      `M${c} 0`,
      `L${w - c} 0`,
      tr.replace(/^M[^ ]+ [^ ]+ /, ''),
      `L${w} ${h - c}`,
      br.replace(/^M[^ ]+ [^ ]+ /, ''),
      `L${c} ${h}`,
      bl.replace(/^M[^ ]+ [^ ]+ /, ''),
      `L0 ${c}`,
      tl.replace(/^M[^ ]+ [^ ]+ /, ''),
      'Z',
    ].join(' ');
  }

  function draw() {
    const w = frame.clientWidth;
    const h = frame.clientHeight;
    if (!w || !h) return;

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    const cornerSize = Math.max(7, Math.min(13, w * 0.018));
    const gap = 3;

    outer.setAttribute('d', roundedFlourishPath(w, h, cornerSize));

    inner.setAttribute(
      'transform',
      `translate(${gap} ${gap})`
    );
    inner.setAttribute(
      'd',
      roundedFlourishPath(w - gap * 2, h - gap * 2, Math.max(5, cornerSize - gap))
    );
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 120);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(draw).catch(() => {});
  }
  window.addEventListener('load', draw);
  draw();
})();
