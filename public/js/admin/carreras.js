// ============================================
// GESTIONAR CARRERAS - TECHNOACADEMY
// ============================================

let todasLasCarreras = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  cargarCarreras();
  
  document.getElementById('carreraForm').addEventListener('submit', crearCarrera);
  document.getElementById('editForm').addEventListener('submit', guardarEdicion);
  document.getElementById('searchInput').addEventListener('input', filtrarCarreras);
});

// ===== CARGAR CARRERAS =====
async function cargarCarreras() {
  try {
    const response = await fetch('/admin/api/carreras');
    const data = await response.json();
    
    todasLasCarreras = data;
    mostrarCarreras(data);
  } catch (error) {
    console.error('Error al cargar carreras:', error);
    document.getElementById('carrerasTable').innerHTML = 
      `<tr><td colspan="7" style="text-align: center; color: #dc3545;">❌ Error al cargar carreras</td></tr>`;
  }
}

// ===== MOSTRAR CARRERAS EN TABLA =====
function mostrarCarreras(carreras) {
  const tbody = document.getElementById('carrerasTable');
  
  if (carreras.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No hay carreras registradas</td></tr>`;
    return;
  }
  
  tbody.innerHTML = carreras.map((carrera, index) => {
    const badgeClass = carrera.ESTADO === 'ACTIVA' ? 'badge-success' : 'badge-inactive';
    const descripcionCorta = carrera.DESCRIPCION ? 
      (carrera.DESCRIPCION.length > 50 ? carrera.DESCRIPCION.substring(0, 50) + '...' : carrera.DESCRIPCION) : 
      '-';
    
    return `
      <tr>
        <td>${carrera.ID_CARRERA}</td>
        <td><strong>${carrera.CODIGO_CARRERA || '-'}</strong></td>
        <td>${carrera.NOMBRE_CARRERA || '-'}</td>
        <td>${carrera.DURACION_CICLOS || '-'} semestres</td>
        <td><small>${descripcionCorta}</small></td>
        <td><span class="badge ${badgeClass}">${carrera.ESTADO || 'ACTIVA'}</span></td>
        <td>
          <button class="btn btn-small btn-warning" onclick="abrirModalEditarPorId(${index})">
            ✏️ Editar
          </button>
          <button class="btn btn-small btn-danger" onclick="eliminarCarrera(${carrera.ID_CARRERA}, '${carrera.NOMBRE_CARRERA}')">
            🗑️ Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== CREAR CARRERA =====
async function crearCarrera(e) {
  e.preventDefault();
  
  const nombre_carrera = document.getElementById('nombre_carrera').value.trim();
  const codigo_carrera = document.getElementById('codigo_carrera').value.trim();
  const duracion_semestres = document.getElementById('duracion_semestres').value;
  const descripcion = document.getElementById('descripcion').value.trim();
  
  const btnText = document.getElementById('btn-crear-text');
  const btnLoader = document.getElementById('btn-crear-loader');
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  
  try {
    const response = await fetch('/admin/api/carreras/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre_carrera,
        codigo_carrera,
        duracion_semestres: parseInt(duracion_semestres),
        descripcion: descripcion || null
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion('✅ Carrera creada exitosamente', 'success');
      document.getElementById('carreraForm').reset();
      cargarCarreras();
    } else {
      mostrarNotificacion('❌ ' + (data.error || 'Error al crear carrera'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('❌ Error de conexión al crear carrera', 'error');
  } finally {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

// ===== ABRIR MODAL EDITAR =====
function abrirModalEditarPorId(index) {
  const carrera = todasLasCarreras[index];
  
  document.getElementById('edit_id_carrera').value = carrera.ID_CARRERA;
  document.getElementById('edit_nombre_carrera').value = carrera.NOMBRE_CARRERA || '';
  document.getElementById('edit_codigo_carrera').value = carrera.CODIGO_CARRERA || '';
  document.getElementById('edit_duracion_semestres').value = carrera.DURACION_CICLOS || '';
  document.getElementById('edit_descripcion').value = carrera.DESCRIPCION || '';
  document.getElementById('edit_estado').value = carrera.ESTADO || 'ACTIVA';
  
  document.getElementById('editModal').style.display = 'flex';
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById('editModal').style.display = 'none';
}

// ===== GUARDAR EDICIÓN =====
async function guardarEdicion(e) {
  e.preventDefault();
  
  const id_carrera = document.getElementById('edit_id_carrera').value;
  const nombre_carrera = document.getElementById('edit_nombre_carrera').value.trim();
  const codigo_carrera = document.getElementById('edit_codigo_carrera').value.trim();
  const duracion_semestres = document.getElementById('edit_duracion_semestres').value;
  const descripcion = document.getElementById('edit_descripcion').value.trim();
  const estado = document.getElementById('edit_estado').value;
  
  try {
    const response = await fetch(`/admin/api/carreras/${id_carrera}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre_carrera,
        codigo_carrera,
        duracion_semestres: parseInt(duracion_semestres),
        descripcion: descripcion || null,
        estado
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      mostrarNotificacion('✅ Carrera actualizada exitosamente', 'success');
      cerrarModal();
      cargarCarreras();
    } else {
      mostrarNotificacion('❌ ' + (result.error || 'Error al actualizar carrera'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('❌ Error de conexión al actualizar carrera', 'error');
  }
}

// ===== ELIMINAR CARRERA =====
async function eliminarCarrera(id, nombre) {
  if (!confirm(`¿Está seguro de eliminar la carrera "${nombre}"?\n\nEsta acción no se puede deshacer y eliminará todos los registros relacionados.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/admin/api/carreras/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion('✅ Carrera eliminada exitosamente', 'success');
      cargarCarreras();
    } else {
      mostrarNotificacion('❌ ' + (data.error || 'Error al eliminar carrera'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('❌ Error de conexión al eliminar carrera', 'error');
  }
}

// ===== FILTRAR CARRERAS =====
function filtrarCarreras() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  const carrerasFiltradas = todasLasCarreras.filter(carrera => 
    (carrera.NOMBRE_CARRERA && carrera.NOMBRE_CARRERA.toLowerCase().includes(searchTerm)) ||
    (carrera.CODIGO_CARRERA && carrera.CODIGO_CARRERA.toLowerCase().includes(searchTerm)) ||
    (carrera.DESCRIPCION && carrera.DESCRIPCION.toLowerCase().includes(searchTerm))
  );
  
  mostrarCarreras(carrerasFiltradas);
}

// ===== MOSTRAR NOTIFICACIÓN =====
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = mensaje;
  notification.className = `notification ${tipo}`;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModal();
  }
});

// Cerrar modal al hacer click fuera
window.addEventListener('click', (e) => {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    cerrarModal();
  }
});
