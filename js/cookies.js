/* ═══════════════════════════════════════════════
   Punto Gráfico — Cookie Consent Manager
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'pg_cookie_consent';
  var COOKIE_NAME = 'pg_cc';
  var EXPIRY_DAYS = 365;
  var banner, modal;

  /* ─── Persistence ─── */
  function readCookie() {
    try {
      var match = document.cookie.match(/(^|;)\s*pg_cc=([^;]+)/);
      return match ? JSON.parse(decodeURIComponent(match[2])) : null;
    } catch (e) {
      return null;
    }
  }

  function writeCookie(json) {
    try {
      var expires = new Date(Date.now() + EXPIRY_DAYS * 864e5).toUTCString();
      document.cookie = COOKIE_NAME + '=' + encodeURIComponent(json) +
        '; expires=' + expires + '; path=/; SameSite=Lax';
    } catch (e) { /* cookies blocked */ }
  }

  function getPrefs() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* localStorage unavailable */ }
    return readCookie();
  }

  function savePrefs(prefs) {
    prefs.decided = true;
    prefs.date = new Date().toISOString();
    var json = JSON.stringify(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, json);
    } catch (e) { /* storage full */ }
    writeCookie(json);
  }

  function hasDecided() {
    var p = getPrefs();
    return p && p.decided === true;
  }

  /* ─── Banner ─── */
  function buildBanner() {
    var el = document.createElement('div');
    el.id = 'pg-cookie-banner';
    el.className = 'pg-hidden';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Gestión de cookies');
    el.innerHTML =
      '<div class="pg-banner-inner">' +
        '<div class="pg-banner-text">' +
          '<strong><i class="fas fa-cookie-bite"></i> Utilizamos cookies</strong>' +
          '<p>Usamos cookies técnicas necesarias y, con tu consentimiento, cookies analíticas para mejorar la web. ' +
          'Puedes aceptar todas, rechazar las no esenciales o <button class="pg-btn-settings" onclick="PGCookies.openSettings()">configurar tus preferencias</button>. ' +
          '<a href="cookies.html">Más información</a>.</p>' +
        '</div>' +
        '<div class="pg-banner-actions">' +
          '<button class="pg-btn-accept" id="pg-accept-all">Aceptar todas</button>' +
          '<button class="pg-btn-reject" id="pg-reject-all">Rechazar no esenciales</button>' +
          '<button class="pg-btn-settings" id="pg-open-settings">Configurar</button>' +
        '</div>' +
      '</div>';
    return el;
  }

  function buildModal() {
    var el = document.createElement('div');
    el.id = 'pg-cookie-modal';
    el.className = 'pg-hidden';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Configurar preferencias de cookies');
    el.innerHTML =
      '<div class="pg-modal-box">' +
        '<div class="pg-modal-header">' +
          '<h2>Preferencias de cookies</h2>' +
          '<button class="pg-modal-close" id="pg-modal-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>' +
        '</div>' +
        '<p class="pg-modal-intro">' +
          'Configura qué cookies deseas permitir. Las cookies esenciales no pueden desactivarse porque son necesarias para el funcionamiento del sitio.' +
        '</p>' +

        /* Essential */
        '<div class="pg-category pg-open" data-cat="essential">' +
          '<div class="pg-cat-header">' +
            '<div class="pg-cat-info">' +
              '<strong>Esenciales <span class="cookie-badge badge-essential">Siempre activas</span></strong>' +
              '<span>Necesarias para el funcionamiento básico del sitio</span>' +
            '</div>' +
            '<div class="pg-cat-toggle">' +
              '<label class="pg-toggle">' +
                '<input type="checkbox" checked disabled>' +
                '<span class="pg-toggle-track"></span>' +
                '<span class="sr-only">Cookies esenciales (siempre activas)</span>' +
              '</label>' +
              '<i class="fas fa-chevron-down pg-cat-chevron"></i>' +
            '</div>' +
          '</div>' +
          '<div class="pg-cat-body">' +
            'Estas cookies son imprescindibles para navegar por la web y utilizar sus funcionalidades. ' +
            'Incluyen las cookies que guardan tus preferencias de privacidad (<code>pg_cookie_consent</code>). ' +
            'Sin ellas el sitio no puede funcionar correctamente.' +
          '</div>' +
        '</div>' +

        /* Analytics */
        '<div class="pg-category" data-cat="analytics">' +
          '<div class="pg-cat-header">' +
            '<div class="pg-cat-info">' +
              '<strong>Analíticas <span class="cookie-badge badge-analytics">Opcionales</span></strong>' +
              '<span>Nos ayudan a entender cómo se usa la web</span>' +
            '</div>' +
            '<div class="pg-cat-toggle">' +
              '<label class="pg-toggle">' +
                '<input type="checkbox" id="toggle-analytics">' +
                '<span class="pg-toggle-track"></span>' +
                '<span class="sr-only">Activar cookies analíticas</span>' +
              '</label>' +
              '<i class="fas fa-chevron-down pg-cat-chevron"></i>' +
            '</div>' +
          '</div>' +
          '<div class="pg-cat-body">' +
            'Permiten medir el tráfico y el comportamiento de los visitantes para mejorar la experiencia. ' +
            'Los datos se envían a Google Analytics y se tratan de forma anónima y agregada. ' +
            'Si las rechazas, seguirás usando el sitio con normalidad.' +
          '</div>' +
        '</div>' +

        /* Preferences */
        '<div class="pg-category" data-cat="preferences">' +
          '<div class="pg-cat-header">' +
            '<div class="pg-cat-info">' +
              '<strong>Preferencias <span class="cookie-badge badge-preference">Opcionales</span></strong>' +
              '<span>Recuerdan ajustes personalizados de navegación</span>' +
            '</div>' +
            '<div class="pg-cat-toggle">' +
              '<label class="pg-toggle">' +
                '<input type="checkbox" id="toggle-preferences">' +
                '<span class="pg-toggle-track"></span>' +
                '<span class="sr-only">Activar cookies de preferencias</span>' +
              '</label>' +
              '<i class="fas fa-chevron-down pg-cat-chevron"></i>' +
            '</div>' +
          '</div>' +
          '<div class="pg-cat-body">' +
            'Guardan tus preferencias de idioma u otras opciones de personalización para que no tengas que configurarlas cada vez que visitas el sitio.' +
          '</div>' +
        '</div>' +

        '<div class="pg-modal-footer">' +
          '<button class="pg-btn-reject" id="pg-modal-reject">Rechazar no esenciales</button>' +
          '<button class="pg-btn-save" id="pg-modal-save">Guardar selección</button>' +
          '<button class="pg-btn-accept" id="pg-modal-accept">Aceptar todas</button>' +
        '</div>' +
      '</div>';
    return el;
  }

  /* ─── Show / Hide ─── */
  function showBanner() {
    if (!banner) return;
    banner.classList.remove('pg-hidden');
    banner.removeAttribute('aria-hidden');
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.add('pg-hidden');
    banner.setAttribute('aria-hidden', 'true');
  }

  function openModal() {
    if (!modal) return;
    var prefs = getPrefs();
    if (prefs) {
      var ta = modal.querySelector('#toggle-analytics');
      var tp = modal.querySelector('#toggle-preferences');
      if (ta) ta.checked = !!prefs.analytics;
      if (tp) tp.checked = !!prefs.preferences;
    }
    modal.classList.remove('pg-hidden');
    var firstFocus = modal.querySelector('button, [tabindex]');
    if (firstFocus) firstFocus.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('pg-hidden');
  }

  /* ─── Consent actions ─── */
  function acceptAll() {
    savePrefs({ essential: true, analytics: true, preferences: true });
    hideBanner();
    closeModal();
    dispatchConsentEvent({ essential: true, analytics: true, preferences: true });
  }

  function rejectAll() {
    savePrefs({ essential: true, analytics: false, preferences: false });
    hideBanner();
    closeModal();
    dispatchConsentEvent({ essential: true, analytics: false, preferences: false });
  }

  function saveSelection() {
    var ta = modal.querySelector('#toggle-analytics');
    var tp = modal.querySelector('#toggle-preferences');
    var prefs = {
      essential: true,
      analytics: ta ? ta.checked : false,
      preferences: tp ? tp.checked : false
    };
    savePrefs(prefs);
    hideBanner();
    closeModal();
    dispatchConsentEvent(prefs);
  }

  function dispatchConsentEvent(prefs) {
    try {
      document.dispatchEvent(new CustomEvent('pg:consent', { detail: prefs }));
    } catch (e) { /* IE fallback: no CustomEvent */ }
  }

  /* ─── Accordion ─── */
  function bindAccordion() {
    modal.querySelectorAll('.pg-cat-header').forEach(function (header) {
      header.addEventListener('click', function (e) {
        if (e.target.closest('.pg-toggle')) return;
        var cat = header.closest('.pg-category');
        cat.classList.toggle('pg-open');
      });
    });
  }

  /* ─── Close on backdrop click ─── */
  function bindModalBackdrop() {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('pg-hidden')) closeModal();
    });
  }

  /* ─── Init ─── */
  function init() {
    banner = buildBanner();
    modal = buildModal();
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    /* Banner buttons */
    banner.querySelector('#pg-accept-all').addEventListener('click', acceptAll);
    banner.querySelector('#pg-reject-all').addEventListener('click', rejectAll);
    banner.querySelector('#pg-open-settings').addEventListener('click', openModal);

    /* Modal buttons */
    modal.querySelector('#pg-modal-close').addEventListener('click', closeModal);
    modal.querySelector('#pg-modal-reject').addEventListener('click', rejectAll);
    modal.querySelector('#pg-modal-save').addEventListener('click', saveSelection);
    modal.querySelector('#pg-modal-accept').addEventListener('click', acceptAll);

    bindAccordion();
    bindModalBackdrop();

    if (!hasDecided()) {
      /* Small delay so the page paints first */
      setTimeout(showBanner, 300);
    }

    /* Public API */
    window.PGCookies = {
      openSettings: openModal,
      getPrefs: getPrefs,
      reset: function () {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
