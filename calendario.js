$(document).ready(function () {
    // Variables globales
    var fechaActual = new Date();

    // Funciones
    function generarCalendario(fecha) {
        var anio = fecha.getFullYear();
        var mes = fecha.getMonth();
        var primerDiaMes = new Date(anio, mes, 1);
        var ultimoDiaMes = new Date(anio, mes + 1, 0);
        var primerDiaSemana = primerDiaMes.getDay();
        var diaActual = 1;

        

        // Genera la tabla del calendario
        var tabla = '<table class="table table-bordered"><thead><tr>';
        var diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        for (var i = 0; i < 7; i++) {
            tabla += `<th>${diasSemana[i]}</th>`;
        }

        tabla += '</tr></thead><tbody>';

        for (var fila = 0; fila < 6; fila++) {
            tabla += '<tr>';
    
            for (var columna = 0; columna < 7; columna++) {
                if ((fila === 0 && columna < primerDiaSemana) || diaActual > ultimoDiaMes.getDate()) {
                    tabla += '<td></td>';
                } else {
                    const notaExistente = obtenerNota(anio, mes, diaActual);
                    const claseNota = notaExistente ? 'con-nota' : '';
                    tabla += `<td class="${claseNota}">${diaActual}</td>`;
                    diaActual++;
                }
            }
    
            tabla += '</tr>';
        }

        tabla += '</tbody></table>';

        $('#calendario').html(tabla);
        $('#anio').val(anio);
        $('#mes').val(mes);

        // Agregar evento de clic a cada celda del calendario
        $('#calendario tbody td').on('click', function () {
            const dia = parseInt($(this).text());
            if (dia) {
                mostrarNotasModal(fecha.getFullYear(), fecha.getMonth(), dia);
            }
        });
    }

    function mostrarNotasModal(anio, mes, dia) {
        // Establecer el título del modal con la fecha
        $('#notasModalLabel').text(`Notas para ${anio}-${mes + 1}-${dia}`);

        // Cargar la nota existente (si la hay)
        const nota = obtenerNota(anio, mes, dia);
        $('#notaTexto').val(nota);

        // Mostrar el modal
        const notasModal = new bootstrap.Modal(document.getElementById('notasModal'));
        notasModal.show();

        // Guardar la nota al hacer clic en el botón "Guardar nota"
        $('#guardarNota').off().on('click', function () {
            const nuevaNota = $('#notaTexto').val();
            guardarNota(anio, mes, dia, nuevaNota);
            notasModal.hide();
        });
    }

    function obtenerNota(anio, mes, dia) {
        const key = `nota_${anio}_${mes}_${dia}`;
        return localStorage.getItem(key) || '';
    }

    function guardarNota(anio, mes, dia, nota) {
        const key = `nota_${anio}_${mes}_${dia}`;
        localStorage.setItem(key, nota);
    }
    // Eventos
    $("#anterior").click(function () {
        cambiarMes(-1);
    });

    $("#siguiente").click(function () {
        cambiarMes(1);
    });

    $("#anio").change(function () {
        var anio = $(this).val();
        fechaActual.setFullYear(anio);
        generarCalendario(fechaActual);
    });

    $("#mes").change(function () {
        var mes = $(this).val();
        fechaActual.setMonth(mes);
        generarCalendario(fechaActual);
    });

    function cambiarMes(direccion) {
        fechaActual.setMonth(fechaActual.getMonth() + direccion);
        generarCalendario(fechaActual);
    }

    function cargarAnios() {
        for (var anio = 1950; anio <= 2050; anio++) {
            $('#anio').append(`<option value="${anio}">${anio}</option>`);
        }
    }

    function cargarMeses() {
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        meses.forEach(function (mes, index) {
            $('#mes').append(`<option value="${index}">${mes}</option>`);
        });
    }

    // Inicialización
    cargarAnios();
    cargarMeses();
    generarCalendario(fechaActual);
});
