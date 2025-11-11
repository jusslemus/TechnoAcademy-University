// ============================================
// MIS MATERIAS - TECHNOACADEMY ALUMNO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  cargarInscripciones();
});

// ===== CARGAR INSCRIPCIONES =====
async function cargarInscripciones() {
  try {
    const response = await fetch('/alumno/api/mis-materias');
    const data = await response.json();
    
    const tbody = document.getElementById('inscripcionesTable');
    
    if (data.success && data.materias && data.materias.length > 0) {
      let totalCreditos = 0;
      
      tbody.innerHTML = data.materias.map(materia => {
        totalCreditos += materia.CREDITOS || 0;
        
        const badgeClass = materia.ESTADO_INSCRIPCION === 'ACTIVO' ? 'badge-success' : 
                          materia.ESTADO_INSCRIPCION === 'RETIRADO' ? 'badge-inactive' : 'badge-warning';
        
        const nota = materia.NOTA_FINAL ? parseFloat(materia.NOTA_FINAL).toFixed(2) : '-';
        const notaColor = materia.NOTA_FINAL >= 6 ? '#28a745' : materia.NOTA_FINAL ? '#dc3545' : '#999';
        
        return `
          <tr>
            <td><strong>${materia.CODIGO_MATERIA || '-'}</strong></td>
            <td>${materia.NOMBRE_MATERIA}</td>
            <td style="text-align: center;">${materia.CREDITOS || '-'}</td>
            <td>${materia.CODIGO_GRUPO || '-'}</td>
            <td>${materia.NOMBRE_DOCENTE || 'Por asignar'}</td>
            <td><small>${materia.HORARIO || 'Por definir'}</small></td>
            <td>${materia.AULA || '-'}</td>
            <td><span class="badge ${badgeClass}">${materia.ESTADO_INSCRIPCION}</span></td>
            <td style="text-align: center; font-weight: bold; color: ${notaColor};">${nota}</td>
            <td>
              ${materia.ESTADO_INSCRIPCION === 'ACTIVO' ? `
                <button class="btn btn-small btn-danger" onclick="retirarMateria(${materia.ID_GRUPO}, '${materia.NOMBRE_MATERIA}')">
                  Retirar
                </button>
              ` : '<span style="color: #999;">-</span>'}
            </td>
          </tr>
        `;
      }).join('');
      
      document.getElementById('totalCreditos').textContent = totalCreditos;
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 3rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
                 stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                 style="margin-bottom: 1rem; opacity: 0.5;">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <p style="font-size: 1.1rem; color: #666; margin: 0;">No tienes materias inscritas</p>
            <p style="font-size: 0.9rem; color: #999; margin: 0.5rem 0;">Inscríbete en materias para comenzar tu período académico</p>
          </td>
        </tr>
      `;
      document.getElementById('totalCreditos').textContent = '0';
    }
  } catch (error) {
    console.error('Error al cargar inscripciones:', error);
    document.getElementById('inscripcionesTable').innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 2rem; color: #dc3545;">
          Error al cargar las materias inscritas
        </td>
      </tr>
    `;
  }
}

// ===== RETIRAR MATERIA =====
async function retirarMateria(id_grupo, nombreMateria) {
  if (!confirm(`¿Está seguro de retirarse de "${nombreMateria}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/alumno/api/inscripciones/${id_grupo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion('Te has retirado de la materia exitosamente', 'success');
      cargarInscripciones();
    } else {
      mostrarNotificacion(data.error || 'Error al retirarse de la materia', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error de conexión al retirarse', 'error');
  }
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
