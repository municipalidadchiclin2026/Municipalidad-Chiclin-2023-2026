// Botón para volver arriba: aparece al bajar y sube suavemente al tocarlo.
// Va en TODAS las páginas, antes de </body>:   <script src="js/subir.js"></script>
(function () {
  var DISTANCIA = 400;            // píxeles que hay que bajar para que aparezca el botón

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'subir-btn';
  btn.setAttribute('aria-label', 'Subir al inicio');
  btn.setAttribute('title', 'Subir');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var pendiente = false;
  function revisar() {
    pendiente = false;
    btn.classList.toggle('visible', (window.pageYOffset || document.documentElement.scrollTop) > DISTANCIA);
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); }
  }, { passive: true });

  function iniciar() { document.body.appendChild(btn); revisar(); }
  if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();