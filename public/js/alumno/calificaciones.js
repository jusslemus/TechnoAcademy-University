// Mis Calificaciones - Alumno
document.addEventListener('DOMContentLoaded', function() {
  cargarCalificaciones();
  cargarPeriodos();
});

function cargarPeriodos() {
  fetch('/alumno/api/periodos')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('selectPeriodo');
      select.innerHTML = '<option value="">Todos los períodos</option>';
      
      data.forEach(periodo => {
        const option = document.createElement('option');
        option.value = periodo.ID_PERIODO;
        option.textContent = periodo.NOMBRE_PERIODO;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Error cargando períodos:', err));
}

function cargarCalificaciones() {
  fetch('/alumno/api/calificaciones')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('calificacionesTable');
      tbody.innerHTML = '';
      
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Sin calificaciones registradas</td></tr>';
        return;
      }

      let totalNotas = 0;
      let materiasAprobadas = 0;
      let materiasReprobadas = 0;

      data.forEach(cal => {
        const nota = parseFloat(cal.NOTA_FINAL) || 0;
        totalNotas += nota;
        
        if (nota >= 3.0) {
          materiasAprobadas++;
        } else if (nota > 0) {
          materiasReprobadas++;
        }

        const estado = nota >= 3.0 ? '<span style="color: green; font-weight: bold;">✓ Aprobado</span>' : 
                       nota > 0 ? '<span style="color: red; font-weight: bold;">✗ Reprobado</span>' : 'Sin nota';

        const row = `
          <tr>
            <td>${cal.CODIGO_MATERIA || '-'}</td>
            <td>${cal.NOMBRE_MATERIA || '-'}</td>
            <td>${cal.CREDITOS || '-'}</td>
            <td>${cal.DOCENTE || '-'}</td>
            <td style="font-weight: bold;">${nota.toFixed(2)}</td>
            <td>${estado}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });

      // Actualizar resumen
      const promedio = data.length > 0 ? (totalNotas / data.length).toFixed(2) : 0;
      document.getElementById('promedioGeneral').textContent = promedio;
      document.getElementById('materiasAprobadas').textContent = materiasAprobadas;
      document.getElementById('materiasReprobadas').textContent = materiasReprobadas;
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('calificacionesTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar calificaciones</td></tr>';
    });
}

function filtrarCalificaciones() {
  const periodo = document.getElementById('selectPeriodo').value;
  if (periodo) {
    console.log('Filtrar por período:', periodo);
  }
  cargarCalificaciones();
}
