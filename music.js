// Música de fondo: intenta sonar apenas se abre la página (silenciada,
// como piden los navegadores) y se activa con el primer toque/clic del
// visitante. El botón flotante permite pausarla o volver a activarla.
// El archivo ya viene grabado bajo (-14 dB), así suena suave también en iPhone,
// donde audio.volume no tiene efecto. En el resto entra con un fundido y,
// a los 15 s de escucha, baja a la mitad.
// Si el visitante cambia de pestaña, bloquea el celular o cierra la página, se pausa.
(function () {
  const audio = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  if (!audio || !toggleBtn) return;

  const VOL = 1;            // el archivo ya está bajado; 1 = su volumen grabado
  const VOL_BAJO = 0.5;      // a los 15 s, la mitad
  const FADE_IN = 2.5;       // segundos
  const FADE_DOWN = 4;       // segundos
  const BAJAR_A_LOS = 15000; // ms de escucha con la página visible

  let unlocked = false;
  let userPaused = false;    // pausada a propósito con el botón
  let listened = 0, since = 0, lowerTimer = null, lowered = false, fadeRaf = 0;

  // Fundido con audio.volume (en iPhone se ignora y queda el volumen del archivo).
  function rampTo(v, secs) {
    cancelAnimationFrame(fadeRaf);
    const from = audio.volume, t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / (secs * 1000));
      try { audio.volume = from + (v - from) * k; } catch (e) { return; }
      if (k < 1) fadeRaf = requestAnimationFrame(step);
    })(t0);
  }

  // Cuenta solo el tiempo que suena con la página a la vista.
  function startCount() {
    if (lowered || lowerTimer) return;
    since = Date.now();
    lowerTimer = setTimeout(() => {
      lowerTimer = null;
      lowered = true;
      rampTo(VOL_BAJO, FADE_DOWN);
    }, Math.max(0, BAJAR_A_LOS - listened));
  }
  function stopCount() {
    if (!lowerTimer) return;
    clearTimeout(lowerTimer);
    lowerTimer = null;
    listened += Date.now() - since;
  }

  function setPlayingUI(isPlaying) {
    toggleBtn.setAttribute('aria-pressed', String(isPlaying));
    toggleBtn.classList.toggle('is-playing', isPlaying);
    icon.textContent = isPlaying ? '🎵' : '🔇';
    toggleBtn.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
  }

  function play() {
    if (document.hidden) return;
    audio.muted = false;
    audio.volume = 0;
    audio.play()
      .then(() => { setPlayingUI(true); rampTo(lowered ? VOL_BAJO : VOL, FADE_IN); startCount(); })
      .catch(() => setPlayingUI(false));
  }

  function pause() {
    stopCount();
    audio.pause();
    setPlayingUI(false);
  }

  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    play();
  }

  // Intento de autoplay silencioso apenas carga la página.
  audio.muted = true;
  audio.play().catch(() => {
    /* algunos navegadores igual lo bloquean; se activará con la interacción */
  });

  // Primer toque/clic en cualquier parte de la página activa el sonido.
  ['click', 'touchend', 'keydown'].forEach((evt) => {
    document.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    unlocked = true;
    if (audio.paused || audio.muted) { userPaused = false; play(); }
    else { userPaused = true; pause(); }
  });

  // Pestaña oculta, celular bloqueado o página cerrada: se pausa.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (!audio.paused) pause(); }
    else if (unlocked && !userPaused) play();
  });
  window.addEventListener('pagehide', pause);
  window.addEventListener('blur', () => { if (document.hidden && !audio.paused) pause(); });

  audio.addEventListener('pause', () => setPlayingUI(false));
})();
