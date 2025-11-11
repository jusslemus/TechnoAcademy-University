// ============================================
// DASHBOARD ALUMNO - TECHNOACADEMY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  cargarDatosAlumno();
  cargarMateriasInscritas();
});

// ===== CARGAR DATOS DEL ALUMNO =====
async function cargarDatosAlumno() {
  try {
    const response = await fetch('/alumno/api/info');
    const data = await response.json();
    
    if (data.success && data.alumno) {
      const alumno = data.alumno;
      
      // Información básica
      document.getElementById('carnet').textContent = alumno.CARNET || '-';
      document.getElementById('carrera').textContent = alumno.NOMBRE_CARRERA || 'Sin carrera';
      
      const estadoBadge = document.getElementById('estado');
      estadoBadge.textContent = alumno.ESTADO || 'ACTIVO';
      estadoBadge.className = alumno.ESTADO === 'ACTIVO' ? 'badge badge-success' : 'badge badge-inactive';
      
      // Inscripción
      document.getElementById('materiasInscritas').textContent = alumno.MATERIAS_INSCRITAS || '0';
      document.getElementById('creditosMatriculados').textContent = alumno.CREDITOS_MATRICULADOS || '0';
      
      // Desempeño
      const promedio = alumno.PROMEDIO_ACUMULADO ? parseFloat(alumno.PROMEDIO_ACUMULADO).toFixed(2) : '-';
      document.getElementById('promedio').textContent = promedio;
      document.getElementById('estadoAcademico').textContent = alumno.ESTADO_ACADEMICO || 'Activo';
      
      // Financiero
      const saldo = alumno.SALDO ? `$${parseFloat(alumno.SALDO).toFixed(2)}` : '$0.00';
      document.getElementById('saldo').textContent = saldo;
      document.getElementById('estadoFinanciero').textContent = alumno.ESTADO_FINANCIERO || 'Al día';
    }
  } catch (error) {
    console.error('Error al cargar datos del alumno:', error);
  }
}

// ===== CARGAR MATERIAS INSCRITAS =====
async function cargarMateriasInscritas() {
  try {
    const response = await fetch('/alumno/api/mis-materias');
    const data = await response.json();
    
    const container = document.getElementById('materiasContainer');
    
    if (data.success && data.materias && data.materias.length > 0) {
      container.innerHTML = data.materias.map(materia => `
        <div class="card" style="margin-bottom: 1rem; padding: 1rem; border-left: 4px solid #1e3c72;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4 style="color: #1e3c72; margin: 0 0 0.5rem 0;">${materia.NOMBRE_MATERIA}</h4>
              <p style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                <strong>Código:</strong> ${materia.CODIGO_MATERIA || '-'} | 
                <strong>Créditos:</strong> ${materia.CREDITOS || '-'}
              </p>
              <p style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                <strong>Docente:</strong> ${materia.NOMBRE_DOCENTE || 'Por asignar'}
              </p>
              <p style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                <strong>Grupo:</strong> ${materia.NUMERO_GRUPO || '-'} | 
                <strong>Horario:</strong> ${materia.HORARIO || 'Por definir'} |
                <strong>Aula:</strong> ${materia.AULA || '-'}
              </p>
            </div>
            <div style="text-align: center; min-width: 80px;">
              <span class="badge ${materia.ESTADO_INSCRIPCION === 'INSCRITO' ? 'badge-success' : 'badge-inactive'}" 
                    style="font-size: 0.75rem;">
                ${materia.ESTADO_INSCRIPCION || 'INSCRITO'}
              </span>
              ${materia.NOTA_FINAL ? `
                <p style="font-size: 1.2rem; font-weight: bold; color: #1e3c72; margin: 0.5rem 0;">
                  ${parseFloat(materia.NOTA_FINAL).toFixed(2)}
                </p>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem; color: #999;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               style="margin-bottom: 1rem; opacity: 0.5;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <p style="font-size: 1.1rem; margin: 0;">📚 No tienes materias inscritas</p>
          <p style="font-size: 0.9rem; margin: 0.5rem 0;">Ve a la sección "Mis Materias" para ver más detalles</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar materias inscritas:', error);
    document.getElementById('materiasContainer').innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem; color: #dc3545;">
        <p>Error al cargar las materias inscritas</p>
      </div>
    `;
  }
}
