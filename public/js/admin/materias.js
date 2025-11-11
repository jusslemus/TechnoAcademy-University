// Gestionar Materias - Admin
document.addEventListener('DOMContentLoaded', function() {
  cargarCarreras();
  cargarMaterias();
  document.getElementById('formMateria').addEventListener('submit', guardarMateria);
});

function cargarCarreras() {
  fetch('/admin/api/carreras')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('carrera');
      if (select) {
        select.innerHTML = '<option value="">Seleccionar carrera...</option>';
        data.forEach(carrera => {
          const option = document.createElement('option');
          option.value = carrera.ID_CARRERA || carrera.NOMBRE_CARRERA;
          option.textContent = carrera.NOMBRE_CARRERA;
          select.appendChild(option);
        });
      }
    })
    .catch(err => console.error('Error cargando carreras:', err));
}

function cargarMaterias() {
  fetch('/admin/api/materias')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('materiasTable');
      tbody.innerHTML = '';
      
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay materias registradas</td></tr>';
        return;
      }

      data.forEach(materia => {
        const row = `
          <tr>
            <td>${materia.CODIGO_MATERIA || '-'}</td>
            <td>${materia.NOMBRE_MATERIA || '-'}</td>
            <td>${materia.CREDITOS || '-'}</td>
            <td>${materia.HORAS_TEORICAS || '-'}</td>
            <td>${materia.HORAS_PRACTICAS || '-'}</td>
            <td>
              <button class="btn btn-small btn-warning" onclick="abrirEditarMateria(${materia.ID_MATERIA}, '${materia.NOMBRE_MATERIA}', '${materia.CODIGO_MATERIA}', ${materia.CREDITOS}, ${materia.HORAS_TEORICAS}, ${materia.HORAS_PRACTICAS})">✏️ Editar</button>
              <button class="btn btn-small btn-danger" onclick="eliminarMateria(${materia.ID_MATERIA})">🗑️ Eliminar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('materiasTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar materias</td></tr>';
    });
}

function abrirFormularioNuevaMateria() {
  document.getElementById('formularioContainer').style.display = 'block';
}

function cerrarFormulario() {
  document.getElementById('formularioContainer').style.display = 'none';
  document.getElementById('formMateria').reset();
}

function guardarMateria(event) {
  event.preventDefault();

  const carrera = document.getElementById('carrera').value;
  const nombre_materia = document.getElementById('nombre_materia').value;
  const codigo_materia = document.getElementById('codigo_materia').value;
  const creditos = document.getElementById('creditos').value;
  const horas_teoricas = document.getElementById('horas_teoricas').value;
  const horas_practicas = document.getElementById('horas_practicas').value;

  if (!carrera) {
    alert('⚠️ Debes seleccionar una carrera');
    return;
  }

  fetch('/admin/api/materias/crear', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      carrera,
      nombre_materia,
      codigo_materia,
      creditos,
      horas_teoricas,
      horas_practicas
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ Materia creada exitosamente');
        cerrarFormulario();
        cargarMaterias();
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('❌ Error al crear materia');
    });
}

function abrirEditarMateria(id, nombre, codigo, creditos, teoricas, practicas) {
  const nuevoNombre = prompt('Nuevo nombre de materia:', nombre);
  if (nuevoNombre === null) return;

  const nuevoCodigo = prompt('Nuevo código de materia:', codigo);
  if (nuevoCodigo === null) return;

  const nuevosCreditios = prompt('Nuevos créditos:', creditos);
  if (nuevosCreditios === null) return;

  fetch(`/admin/api/materias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre_materia: nuevoNombre,
      codigo_materia: nuevoCodigo,
      creditos: parseInt(nuevosCreditios)
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('✅ Materia editada exitosamente');
        cargarMaterias();
      } else {
        alert('❌ Error: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('❌ Error al editar materia');
    });
}

function eliminarMateria(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
    fetch(`/admin/api/materias/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('✅ Materia eliminada exitosamente');
          cargarMaterias();
        } else {
          alert('❌ Error: ' + (data.error || 'Error desconocido'));
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('❌ Error al eliminar materia');
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
