/**
 * VíaSegura - Control de Cookies con localStorage
 * Guarda la preferencia del usuario para no mostrar el banner en cada visita
 */

(function() {
    'use strict';

    // Elementos del DOM
    var overlay = document.getElementById('cookie-overlay');
    var banner = document.getElementById('aviso-cookies');
    var btnAceptar = document.getElementById('btn-aceptar-cookies');
    var btnRechazar = document.getElementById('btn-rechazar-cookies');
    var contenidoPrincipal = document.getElementById('contenidoPrincipal');

    // Clave para localStorage
    var COOKIE_KEY = 'viasegura_cookie_consent';

    /**
     * Verifica si ya existe una preferencia guardada
     */
    function tienePreferenciaGuardada() {
        return localStorage.getItem(COOKIE_KEY) !== null;
    }

    /**
     * Obtiene la preferencia guardada
     */
    function getPreferenciaGuardada() {
        return localStorage.getItem(COOKIE_KEY);
    }

    /**
     * Muestra el contenido principal y oculta el banner de cookies
     */
    function mostrarContenido() {
        // Ocultar banner
        if (overlay) overlay.classList.remove('visible');
        if (banner) banner.classList.remove('visible');
        document.body.classList.remove('cookie-locked');

        // Mostrar contenido principal
        if (contenidoPrincipal) {
            contenidoPrincipal.classList.add('visible');
        }
    }

    /**
     * Guarda la preferencia del usuario y muestra el contenido
     */
    function guardarPreferencia(valor) {
        try {
            localStorage.setItem(COOKIE_KEY, valor);
            console.log('Preferencia de cookies guardada:', valor);
        } catch (e) {
            console.warn('No se pudo guardar la preferencia de cookies:', e);
        }
        mostrarContenido();

        // Ejecutar acciones según la elección
        if (valor === 'aceptadas') {
            // Activar Google Analytics u otras cookies de terceros
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted'
                });
            }
            console.log('Cookies de análisis y publicidad activadas');
        } else if (valor === 'rechazadas') {
            // Desactivar cookies de terceros
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'ad_storage': 'denied',
                    'analytics_storage': 'denied'
                });
            }
            console.log('Cookies de análisis y publicidad desactivadas');
        }
    }

    /**
     * Inicializa el control de cookies
     */
    function initCookies() {
        // Si ya tiene preferencia guardada, mostrar contenido directamente
        if (tienePreferenciaGuardada()) {
            mostrarContenido();
            return;
        }

        // Mostrar el banner de cookies (está oculto por CSS)
        if (overlay) overlay.classList.add('visible');
        if (banner) banner.classList.add('visible');
        document.body.classList.add('cookie-locked');
    }

    // ----- Event Listeners -----
    if (btnAceptar) {
        btnAceptar.addEventListener('click', function() {
            guardarPreferencia('aceptadas');
        });
    }

    if (btnRechazar) {
        btnRechazar.addEventListener('click', function() {
            guardarPreferencia('rechazadas');
        });
    }

    // ----- Inicialización -----
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookies);
    } else {
        initCookies();
    }

})();