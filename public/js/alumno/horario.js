// Mi Horario - Alumno
document.addEventListener('DOMContentLoaded', function() {
  cargarPeriodos();
});

function cargarPeriodos() {
  fetch('/alumno/api/periodos')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('selectPeriodo');
      select.innerHTML = '<option value="">Seleccionar período...</option>';
      
      data.forEach(periodo => {
        const option = document.createElement('option');
        option.value = periodo.ID_PERIODO;
        option.textContent = periodo.NOMBRE_PERIODO;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Error cargando períodos:', err));
}

function cargarHorario() {
  fetch('/alumno/api/horario')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        document.getElementById('horarioTable').innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay clases programadas</td></tr>';
        return;
      }

      // Agrupar por horario
      const horarioMap = {};
      data.forEach(clase => {
        const horario = clase.HORARIO || 'Sin horario';
        if (!horarioMap[horario]) {
          horarioMap[horario] = clase;
        }
      });

      // Mostrar en tabla
      const tbody = document.getElementById('horarioTable');
      tbody.innerHTML = '';

      Object.entries(horarioMap).forEach(([horario, clase]) => {
        const row = `
          <tr>
            <td>${horario}</td>
            <td>${clase.NOMBRE_MATERIA}</td>
            <td>-</td>
            <td>-</td>
            <td>${clase.AULA || '-'}</td>
            <td>-</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });

      // Mostrar resumen de clases
      const resumen = document.getElementById('resumenClases');
      resumen.innerHTML = '';

      data.forEach(clase => {
        const card = `
          <div class="clase-card">
            <h3>${clase.NOMBRE_MATERIA}</h3>
            <div class="clase-info">
              <div><strong>Código:</strong> ${clase.CODIGO_MATERIA}</div>
              <div><strong>Grupo:</strong> ${clase.NUMERO_GRUPO}</div>
              <div><strong>Horario:</strong> ${clase.HORARIO || 'No asignado'}</div>
              <div><strong>Aula:</strong> ${clase.AULA || 'No asignada'}</div>
              <div><strong>Docente:</strong> ${clase.DOCENTE || 'Sin asignar'}</div>
            </div>
          </div>
        `;
        resumen.innerHTML += card;
      });
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('horarioTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar horario</td></tr>';
    });
}
