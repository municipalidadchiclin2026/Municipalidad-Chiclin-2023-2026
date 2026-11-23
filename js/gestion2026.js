// Gestión 2026: visor de fotos con flechas, buscador, barra de progreso y animaciones
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // Barra de progreso y botón subir
  var prog = $('#progreso'), subir = $('#subir');
  function scroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (prog) prog.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';
    if (subir) subir.classList.toggle('on', h.scrollTop > 600);
  }
  window.addEventListener('scroll', scroll, { passive: true }); scroll();
  if (subir) subir.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Aparición suave de actividades
  var evs = $$('.evento');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    evs.forEach(function (e) { io.observe(e); });
  } else evs.forEach(function (e) { e.classList.add('vis'); });

  // Visor de fotos (flechas, teclado, deslizar)
  var lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<button class="lb-x" aria-label="Cerrar">✕</button><button class="lb-p" aria-label="Anterior">‹</button><img alt=""/><button class="lb-n" aria-label="Siguiente">›</button><div class="lb-c"></div>';
  document.body.appendChild(lb);
  var im = $('img', lb), cap = $('.lb-c', lb), lista = [], pos = 0, x0 = null;
  function mostrar() {
    var i = lista[pos];
    im.src = i.currentSrc || i.src; im.alt = i.alt;
    cap.textContent = (lista.length > 1 ? (pos + 1) + ' / ' + lista.length + ' · ' : '') + i.alt;
    $('.lb-p', lb).style.display = $('.lb-n', lb).style.display = lista.length > 1 ? '' : 'none';
  }
  function abrir(img) {
    lista = $$('img', img.closest('.galeria')); pos = lista.indexOf(img);
    mostrar(); lb.classList.add('on'); document.body.style.overflow = 'hidden';
  }
  function cerrar() { lb.classList.remove('on'); document.body.style.overflow = ''; im.src = ''; }
  function mover(d) { pos = (pos + d + lista.length) % lista.length; mostrar(); }
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.galeria .foto-card');
    if (c) abrir($('img', c));
  });
  lb.addEventListener('click', function (e) {
    if (e.target.closest('.lb-p')) mover(-1);
    else if (e.target.closest('.lb-n')) mover(1);
    else if (e.target !== im) cerrar();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(d) > 50) mover(d > 0 ? -1 : 1);
  });

  // Buscador
  var q = $('#buscar'), info = $('#buscar-info'), sin = $('#sin-res');
  if (q) q.addEventListener('input', function () {
    var t = q.value.trim().toLowerCase(), n = 0;
    evs.forEach(function (e) {
      var ok = !t || e.getAttribute('data-b').indexOf(t) > -1;
      e.hidden = !ok; if (ok) { n++; e.classList.add('vis'); }
    });
    $$('.mes').forEach(function (m) { m.hidden = !$$('.evento:not([hidden])', m).length; });
    info.textContent = t ? n + ' resultado' + (n === 1 ? '' : 's') : '';
    sin.hidden = n > 0;
  });
})();
