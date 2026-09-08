// Música de fondo: intenta sonar apenas se abre la página (silenciada,
// como piden los navegadores) y se activa con el primer toque/clic del
// visitante. El botón flotante permite pausarla o volver a activarla.
(function () {
  const audio = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  if (!audio || !toggleBtn) return;

  let unlocked = false;
  audio.volume = 0.2; // de fondo, sin saturar

  function setPlayingUI(isPlaying) {
    toggleBtn.setAttribute('aria-pressed', String(isPlaying));
    toggleBtn.classList.toggle('is-playing', isPlaying);
    icon.textContent = isPlaying ? '🎵' : '🔇';
    toggleBtn.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
  }

  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    audio.muted = false;
    audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
  }

  // Intento de autoplay silencioso apenas carga la página.
  audio.muted = true;
  audio.play().catch(() => {
    /* algunos navegadores igual lo bloquean; se activará con la interacción */
  });

  // Primer toque/clic/scroll en cualquier parte de la página activa el sonido.
  ['click', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
    document.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    unlocked = true;
    if (audio.paused) {
      audio.muted = false;
      audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });

  audio.addEventListener('play', () => {
    if (!audio.muted) setPlayingUI(true);
  });
  audio.addEventListener('pause', () => setPlayingUI(false));
})();
