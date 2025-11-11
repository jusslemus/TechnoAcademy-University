// ============================================
// DASHBOARD DOCENTE - TECHNOACADEMY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  cargarDatosDocente();
  cargarMaterias();
  cargarPredicciones();
});

// ===== CARGAR DATOS DEL DOCENTE =====
async function cargarDatosDocente() {
  try {
    const response = await fetch('/docente/api/info');
    const data = await response.json();
    
    if (data.success && data.docente) {
      const docente = data.docente;
      document.getElementById('docenteNombre').textContent = 
        `${docente.NOMBRES} ${docente.APELLIDOS} - ${docente.ESPECIALIDAD || 'Docente'}`;
      
      document.getElementById('totalMaterias').textContent = docente.TOTAL_MATERIAS || '0';
      document.getElementById('totalAlumnos').textContent = docente.TOTAL_ALUMNOS || '0';
      
      const promedio = docente.PROMEDIO_GENERAL ? parseFloat(docente.PROMEDIO_GENERAL).toFixed(2) : '-';
      document.getElementById('promedioGeneral').textContent = promedio;
      
      document.getElementById('alumnosRiesgo').textContent = docente.ALUMNOS_RIESGO || '0';
    }
  } catch (error) {
    console.error('Error al cargar datos del docente:', error);
  }
}

// ===== CARGAR MATERIAS =====
async function cargarMaterias() {
  try {
    const response = await fetch('/docente/api/mis-materias');
    const data = await response.json();
    
    const container = document.getElementById('materiasContainer');
    
    if (data.success && data.materias && data.materias.length > 0) {
      container.innerHTML = data.materias.map(materia => `
        <div class="card" style="margin-bottom: 1rem; padding: 1.5rem; border-left: 4px solid #1e3c72;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4 style="color: #1e3c72; margin: 0 0 0.5rem 0;">${materia.NOMBRE_MATERIA}</h4>
              <p style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                <strong>Código:</strong> ${materia.CODIGO_MATERIA || '-'} | 
                <strong>Grupo:</strong> ${materia.CODIGO_GRUPO || '-'} |
                <strong>Créditos:</strong> ${materia.CREDITOS || '-'}
              </p>
              <p style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                <strong>Horario:</strong> ${materia.HORARIO || 'Por definir'} |
                <strong>Aula:</strong> ${materia.AULA || '-'}
              </p>
              <p style="font-size: 0.9rem; color: #666; margin: 0.25rem 0;">
                <strong>Alumnos inscritos:</strong> ${materia.TOTAL_ALUMNOS || '0'} / ${materia.CUPO_MAXIMO || '-'}
              </p>
            </div>
            <div style="text-align: center; min-width: 100px;">
              <p style="font-size: 0.85rem; color: #999; margin: 0;">Promedio Grupo</p>
              <p style="font-size: 1.8rem; font-weight: bold; color: #1e3c72; margin: 0.25rem 0;">
                ${materia.PROMEDIO_GRUPO ? parseFloat(materia.PROMEDIO_GRUPO).toFixed(2) : '-'}
              </p>
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
          <p style="font-size: 1.1rem; margin: 0;">No tienes materias asignadas</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar materias:', error);
  }
}

// ===== CARGAR PREDICCIONES =====
async function cargarPredicciones() {
  try {
    const response = await fetch('/docente/api/predicciones');
    const data = await response.json();
    
    const container = document.getElementById('prediccionesContainer');
    
    if (data.success && data.predicciones && data.predicciones.length > 0) {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          ${data.predicciones.map(pred => {
            let color, icono, mensaje;
            
            if (pred.PREDICCION === 'ALTO_RIESGO') {
              color = '#dc3545';
              icono = '⚠️';
              mensaje = 'Alto Riesgo de Reprobar';
            } else if (pred.PREDICCION === 'RIESGO_MODERADO') {
              color = '#f57c00';
              icono = '⚡';
              mensaje = 'Riesgo Moderado';
            } else if (pred.PREDICCION === 'RENDIMIENTO_BAJO') {
              color = '#ffc107';
              icono = '📊';
              mensaje = 'Rendimiento Bajo';
            } else {
              color = '#28a745';
              icono = '✓';
              mensaje = 'Buen Rendimiento';
            }
            
            return `
              <div class="card" style="border-left: 4px solid ${color};">
                <div style="display: flex; align-items: start; gap: 1rem;">
                  <div style="font-size: 2rem;">${icono}</div>
                  <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.5rem 0; color: ${color};">${mensaje}</h4>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Alumno:</strong> ${pred.NOMBRE_ALUMNO}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>Materia:</strong> ${pred.NOMBRE_MATERIA}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;">
                      <strong>Promedio Actual:</strong> 
                      <span style="color: ${color}; font-weight: bold;">${pred.PROMEDIO_ACTUAL ? parseFloat(pred.PROMEDIO_ACTUAL).toFixed(2) : '-'}</span>
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #666; font-style: italic;">
                      ${pred.RECOMENDACION || 'Continuar con el seguimiento académico'}
                    </p>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem; background: #f0f9ff; border-left: 4px solid #0288d1;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" 
               stroke="#0288d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               style="margin-bottom: 1rem;">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <p style="font-size: 1.1rem; margin: 0; color: #0288d1;">Sin predicciones disponibles</p>
          <p style="font-size: 0.9rem; margin: 0.5rem 0 0 0; color: #666;">
            Las predicciones se generarán cuando haya suficientes datos de calificaciones
          </p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar predicciones:', error);
  }
}
