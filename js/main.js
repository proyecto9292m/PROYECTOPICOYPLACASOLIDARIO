/**
 * VíaSegura - Funcionalidades principales
 * Menú móvil, acordeones, pestañas, glosario, checklists, quiz, volver arriba
 */

(function() {
    'use strict';

    // ============================================================
    // MENÚ MÓVIL
    // ============================================================
    var botonMenu = document.getElementById('botonMenu');
    var menu = document.getElementById('menu');

    if (botonMenu && menu) {
        botonMenu.addEventListener('click', function() {
            var abierto = menu.classList.toggle('abierto');
            botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });

        menu.querySelectorAll('a').forEach(function(enlace) {
            enlace.addEventListener('click', function() {
                menu.classList.remove('abierto');
                botonMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================================
    // HEADER SCROLL EFFECT
    // ============================================================
    var cabecera = document.getElementById('cabecera');
    if (cabecera) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                cabecera.classList.add('scrolled');
            } else {
                cabecera.classList.remove('scrolled');
            }
        });
    }

    // ============================================================
    // ACORDEONES (FAQ y Mitos)
    // ============================================================
    document.querySelectorAll('.acordeon-titulo').forEach(function(titulo) {
        titulo.addEventListener('click', function() {
            var item = titulo.parentElement;
            var cuerpo = titulo.nextElementSibling;
            var activo = item.classList.toggle('activo');

            if (activo) {
                cuerpo.style.maxHeight = cuerpo.scrollHeight + 'px';
            } else {
                cuerpo.style.maxHeight = null;
            }
        });
    });

    // ============================================================
    // PESTAÑAS (Sistemas de transporte por ciudad)
    // ============================================================
    document.querySelectorAll('.tab-boton').forEach(function(boton) {
        boton.addEventListener('click', function() {
            var destino = boton.getAttribute('data-tab');

            document.querySelectorAll('.tab-boton').forEach(function(b) {
                b.classList.remove('activo');
            });

            document.querySelectorAll('.tab-panel').forEach(function(p) {
                p.classList.remove('activo');
            });

            boton.classList.add('activo');
            var panel = document.getElementById('tab-' + destino);
            if (panel) panel.classList.add('activo');
        });
    });

    // ============================================================
    // GLOSARIO - Búsqueda en vivo
    // ============================================================
    var buscar = document.getElementById('buscarGlosario');
    var terminos = document.querySelectorAll('#listaGlosario .glosario-termino');
    var vacio = document.getElementById('glosarioVacio');

    if (buscar) {
        buscar.addEventListener('input', function() {
            var texto = buscar.value.toLowerCase().trim();
            var visibles = 0;

            terminos.forEach(function(t) {
                var contenido = t.textContent.toLowerCase();
                if (contenido.indexOf(texto) !== -1) {
                    t.style.display = '';
                    visibles++;
                } else {
                    t.style.display = 'none';
                }
            });

            if (vacio) {
                vacio.style.display = visibles === 0 ? 'block' : 'none';
            }
        });
    }

    // ============================================================
    // LISTAS DE VERIFICACIÓN (Checklists)
    // ============================================================
    document.querySelectorAll('.checklist').forEach(function(lista) {
        var id = lista.getAttribute('data-checklist');
        var claveLista = 'checklist_' + id;
        var casillas = lista.querySelectorAll('input[type="checkbox"]');
        var bloque = lista.nextElementSibling;

        if (!bloque || !bloque.classList.contains('checklist-progreso')) return;

        var textoProgreso = bloque.querySelector('.progreso-texto');
        var barra = bloque.querySelector('.barra-progreso span');
        var botonReiniciar = bloque.nextElementSibling;
        var total = casillas.length;

        function cargarEstado() {
            var guardado;
            try {
                guardado = JSON.parse(localStorage.getItem(claveLista) || '[]');
            } catch (e) {
                guardado = [];
            }
            casillas.forEach(function(c, i) {
                c.checked = guardado.indexOf(i) !== -1;
                actualizarLi(c);
            });
        }

        function guardarEstado() {
            var marcados = [];
            casillas.forEach(function(c, i) {
                if (c.checked) marcados.push(i);
            });
            try {
                localStorage.setItem(claveLista, JSON.stringify(marcados));
            } catch (e) {}
        }

        function actualizarLi(c) {
            var li = c.closest('li');
            if (li) li.classList.toggle('marcado', c.checked);
        }

        function actualizarProgreso() {
            var hechos = 0;
            casillas.forEach(function(c) {
                if (c.checked) hechos++;
            });
            if (textoProgreso) {
                textoProgreso.textContent = hechos + ' de ' + total;
            }
            if (barra) {
                barra.style.width = (total ? (hechos / total) * 100 : 0) + '%';
            }
        }

        casillas.forEach(function(c) {
            c.addEventListener('change', function() {
                actualizarLi(c);
                guardarEstado();
                actualizarProgreso();
            });
        });

        if (botonReiniciar && botonReiniciar.classList.contains('btn-reiniciar')) {
            botonReiniciar.addEventListener('click', function() {
                casillas.forEach(function(c) {
                    c.checked = false;
                    actualizarLi(c);
                });
                guardarEstado();
                actualizarProgreso();
            });
        }

        cargarEstado();
        actualizarProgreso();
    });

    // ============================================================
    // MINI CUESTIONARIO
    // ============================================================
    document.querySelectorAll('[data-quiz]').forEach(function(quiz) {
        var opciones = quiz.querySelectorAll('.quiz-opcion');
        var resultado = quiz.querySelector('.quiz-resultado');

        opciones.forEach(function(op) {
            op.addEventListener('click', function() {
                var esCorrecta = op.getAttribute('data-correcta') === 'true';

                opciones.forEach(function(o) {
                    o.classList.remove('correcta', 'incorrecta');
                    o.disabled = true;
                });

                if (esCorrecta) {
                    op.classList.add('correcta');
                    if (resultado) {
                        resultado.textContent = '✅ ¡Correcto!';
                        resultado.style.color = '#00271c';
                    }
                } else {
                    op.classList.add('incorrecta');
                    opciones.forEach(function(o) {
                        if (o.getAttribute('data-correcta') === 'true') {
                            o.classList.add('correcta');
                        }
                    });
                    if (resultado) {
                        resultado.textContent = '❌ Esa no era. La respuesta correcta está resaltada.';
                        resultado.style.color = '#e17055';
                    }
                }
            });
        });
    });

    // ============================================================
    // BOTÓN VOLVER ARRIBA
    // ============================================================
    var volver = document.getElementById('volverArriba');

    if (volver) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                volver.classList.add('visible');
            } else {
                volver.classList.remove('visible');
            }
        });

        volver.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

})();