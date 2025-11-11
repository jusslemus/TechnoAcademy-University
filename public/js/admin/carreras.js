// Gestionar Carreras - Admin
document.addEventListener('DOMContentLoaded', function() {
  cargarCarreras();
  document.getElementById('formCarrera').addEventListener('submit', guardarCarrera);
});

function cargarCarreras() {
  fetch('/admin/api/carreras')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('carrerasTable');
      tbody.innerHTML = '';
      
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay carreras registradas</td></tr>';
        return;
      }

      data.forEach(carrera => {
        const row = `
          <tr>
            <td>${carrera.CODIGO_CARRERA || '-'}</td>
            <td>${carrera.NOMBRE_CARRERA || '-'}</td>
            <td>${carrera.DURACION_SEMESTRES || '-'}</td>
            <td><span class="badge badge-success">${carrera.ESTADO || 'ACTIVO'}</span></td>
            <td>
              <button class="btn btn-small btn-warning" onclick="abrirEditarCarrera(${carrera.ID_CARRERA}, '${carrera.NOMBRE_CARRERA}', '${carrera.CODIGO_CARRERA}', ${carrera.DURACION_SEMESTRES})">✏️ Editar</button>
              <button class="btn btn-small btn-danger" onclick="eliminarCarrera(${carrera.ID_CARRERA})">🗑️ Eliminar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('carrerasTable').innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error al cargar carreras</td></tr>';
    });
}

function abrirFormularioNuevaCarrera() {
  document.getElementById('formularioContainer').style.display = 'block';
}

function cerrarFormulario() {
  document.getElementById('formularioContainer').style.display = 'none';
  document.getElementById('formCarrera').reset();
}

function guardarCarrera(event) {
  event.preventDefault();

  const nombre_carrera = document.getElementById('nombre_carrera').value;
  const codigo_carrera = document.getElementById('codigo_carrera').value;
  const duracion_semestres = document.getElementById('duracion_semestres').value;
  const descripcion = document.getElementById('descripcion').value;

  fetch('/admin/api/carreras/crear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre_carrera,
      codigo_carrera,
      duracion_semestres,
      descripcion
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ Carrera creada exitosamente');
        cerrarFormulario();
        cargarCarreras();
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('❌ Error al crear carrera');
    });
}

function abrirEditarCarrera(id, nombre, codigo, duracion) {
  const nuevoNombre = prompt('Nuevo nombre de carrera:', nombre);
  if (nuevoNombre === null) return;

  const nuevoCodigo = prompt('Nuevo código de carrera:', codigo);
  if (nuevoCodigo === null) return;

  const nuevaDuracion = prompt('Nueva duración (semestres):', duracion);
  if (nuevaDuracion === null) return;

  fetch(`/admin/api/carreras/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre_carrera: nuevoNombre,
      codigo_carrera: nuevoCodigo,
      duracion_semestres: parseInt(nuevaDuracion)
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ Carrera editada exitosamente');
        cargarCarreras();
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('❌ Error al editar carrera');
    });
}

function eliminarCarrera(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta carrera?')) {
    fetch(`/admin/api/carreras/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('✅ Carrera eliminada exitosamente');
          cargarCarreras();
        } else {
          alert('❌ Error: ' + (data.error || 'Error desconocido'));
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('❌ Error al eliminar carrera');
      });
  }
}

// Estilos para badges
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
