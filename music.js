// Música de fondo: intenta sonar apenas se abre la página (silenciada,
// como piden los navegadores) y se activa con el primer toque/clic del
// visitante. El botón flotante permite pausarla o volver a activarla.
// El volumen se maneja con Web Audio (en iPhone audio.volume no tiene efecto):
// entra con un fundido suave y, a los 15 s de escucha, baja a la mitad.
// Si el visitante cambia de pestaña, bloquea el celular o cierra la página, se pausa.
(function () {
  const audio = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  if (!audio || !toggleBtn) return;

  const VOL = 0.18;          // volumen inicial (0 a 1)
  const VOL_BAJO = VOL / 2;  // a los 15 s, la mitad
  const FADE_IN = 2.5;       // segundos
  const FADE_DOWN = 4;       // segundos
  const BAJAR_A_LOS = 15000; // ms de escucha con la página visible

  let unlocked = false;
  let userPaused = false;    // pausada a propósito con el botón
  let ctx = null, gain = null;
  let listened = 0, since = 0, lowerTimer = null, lowered = false;

  audio.volume = VOL; // respaldo si no hay Web Audio

  function setupGraph() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
      gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
      audio.volume = 1; // el volumen real lo da el gain
    } catch (e) { ctx = null; gain = null; audio.volume = VOL; }
  }

  function rampTo(v, secs) {
    if (!gain) return;
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(v, t + secs);
  }

  // Cuenta solo el tiempo que suena con la página a la vista.
  function startCount() {
    if (lowered || lowerTimer) return;
    since = Date.now();
    lowerTimer = setTimeout(() => {
      lowerTimer = null;
      lowered = true;
      rampTo(VOL_BAJO, FADE_DOWN);
      if (!gain) audio.volume = VOL_BAJO;
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
    setupGraph();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    audio.muted = false;
    if (gain) gain.gain.value = 0;
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
