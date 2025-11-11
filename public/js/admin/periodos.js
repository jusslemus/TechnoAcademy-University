// Gestionar Períodos - Admin
document.addEventListener('DOMContentLoaded', function() {
  cargarPeriodos();
  document.getElementById('formPeriodo').addEventListener('submit', guardarPeriodo);
});

function cargarPeriodos() {
  fetch('/admin/api/periodos')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('periodosTable');
      tbody.innerHTML = '';
      
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay períodos registrados</td></tr>';
        return;
      }

      data.forEach(periodo => {
        const fechaInicio = periodo.FECHA_INICIO ? new Date(periodo.FECHA_INICIO).toLocaleDateString() : '-';
        const fechaFin = periodo.FECHA_FIN ? new Date(periodo.FECHA_FIN).toLocaleDateString() : '-';
        const fechaInscripcion = periodo.FECHA_INICIO_INSCRIPCION ? new Date(periodo.FECHA_INICIO_INSCRIPCION).toLocaleDateString() + ' a ' + (periodo.FECHA_FIN_INSCRIPCION ? new Date(periodo.FECHA_FIN_INSCRIPCION).toLocaleDateString() : '-') : '-';

        const row = `
          <tr>
            <td>${periodo.NOMBRE_PERIODO || '-'}</td>
            <td>${fechaInicio}</td>
            <td>${fechaFin}</td>
            <td>${fechaInscripcion}</td>
            <td><span class="badge badge-success">${periodo.ESTADO || 'ACTIVO'}</span></td>
            <td>
              <button class="btn btn-small btn-warning" onclick="abrirEditarPeriodo(${periodo.ID_PERIODO}, '${periodo.NOMBRE_PERIODO}', '${periodo.FECHA_INICIO}', '${periodo.FECHA_FIN}')">✏️ Editar</button>
              <button class="btn btn-small btn-danger" onclick="eliminarPeriodo(${periodo.ID_PERIODO})">🗑️ Eliminar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('periodosTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar períodos</td></tr>';
    });
}

function abrirFormularioNuevoPeriodo() {
  document.getElementById('formularioContainer').style.display = 'block';
}

function cerrarFormulario() {
  document.getElementById('formularioContainer').style.display = 'none';
  document.getElementById('formPeriodo').reset();
}

function guardarPeriodo(event) {
  event.preventDefault();

  const nombre_periodo = document.getElementById('nombre_periodo').value;
  const fecha_inicio = document.getElementById('fecha_inicio').value;
  const fecha_fin = document.getElementById('fecha_fin').value;
  const fecha_inicio_inscripcion = document.getElementById('fecha_inicio_inscripcion').value || null;
  const fecha_fin_inscripcion = document.getElementById('fecha_fin_inscripcion').value || null;

  if (!nombre_periodo || !fecha_inicio || !fecha_fin) {
    alert('⚠️ Debes completar todos los campos requeridos');
    return;
  }

  fetch('/admin/api/periodos/crear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre_periodo,
      fecha_inicio,
      fecha_fin,
      fecha_inicio_inscripcion,
      fecha_fin_inscripcion
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ Período creado exitosamente');
        cerrarFormulario();
        cargarPeriodos();
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('❌ Error al crear período');
    });
}

function abrirEditarPeriodo(id, nombre, fechaInicio, fechaFin) {
  const nuevoNombre = prompt('Nuevo nombre de período:', nombre);
  if (nuevoNombre === null) return;

  const nuevaFechaInicio = prompt('Nueva fecha de inicio (YYYY-MM-DD):', fechaInicio);
  if (nuevaFechaInicio === null) return;

  const nuevaFechaFin = prompt('Nueva fecha de fin (YYYY-MM-DD):', fechaFin);
  if (nuevaFechaFin === null) return;

  fetch(`/admin/api/periodos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre_periodo: nuevoNombre,
      fecha_inicio: nuevaFechaInicio,
      fecha_fin: nuevaFechaFin
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ Período editado exitosamente');
        cargarPeriodos();
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('❌ Error al editar período');
    });
}

function eliminarPeriodo(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este período?')) {
    fetch(`/admin/api/periodos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('✅ Período eliminado exitosamente');
          cargarPeriodos();
        } else {
          alert('❌ Error: ' + (data.error || 'Error desconocido'));
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('❌ Error al eliminar período');
      });
  }
}

// Estilos
const style = document.createElement('style');
style.textContent = `
  .badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  .badge-success {
    background: #d4edda;
    color: #155724;
  }
  .btn-small {
    padding: 4px 8px;
    font-size: 12px;
    margin-right: 5px;
  }
  .btn-warning {
    background: #ffc107;
    color: #000;
  }
  .btn-danger {
    background: #dc3545;
    color: #fff;
  }
`;
document.head.appendChild(style);
