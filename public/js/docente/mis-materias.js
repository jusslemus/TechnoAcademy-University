// ============================================
// MIS MATERIAS - DOCENTE
// ============================================
// Funciones globales llamadas desde HTML con onclick:
// - abrirModalAgregar()
// - cerrarModalAgregar()
// - inscribirAlumno()
// - abrirModalNotas()
// - cerrarModalNotas()
// - guardarNotas()
// - retirarAlumno()

let todosLosAlumnos = [];
let _materiaActual = null; // Reservado para uso futuro
let _inscripcionActual = null; // Reservado para uso futuro

document.addEventListener('DOMContentLoaded', function() {
  cargarMateriasConAlumnos();
  cargarTodosLosAlumnos();
  
  // Calcular nota final automáticamente
  ['nota_p1', 'nota_p2', 'nota_p3', 'nota_p4'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', calcularNotaFinal);
    }
  });
});

// ===== CARGAR TODOS LOS ALUMNOS DISPONIBLES =====
async function cargarTodosLosAlumnos() {
  try {
    const response = await fetch('/docente/api/alumnos-disponibles');
    const data = await response.json();
    
    if (data.success) {
      todosLosAlumnos = data.alumnos || [];
    }
  } catch (error) {
    console.error('Error al cargar alumnos:', error);
  }
}

// ===== CARGAR MATERIAS CON ALUMNOS =====
async function cargarMateriasConAlumnos() {
  try {
    const response = await fetch('/docente/api/materias-alumnos');
    const data = await response.json();
    
    const container = document.getElementById('materiasContainer');
    
    if (data.success && data.materias && data.materias.length > 0) {
      container.innerHTML = data.materias.map(materia => `
        <div class="materia-card">
          <div class="materia-header">
            <div>
              <h3 style="color: #1e3c72; margin: 0 0 0.5rem 0;">${materia.NOMBRE_MATERIA}</h3>
              <p style="margin: 0; font-size: 0.9rem; color: #666;">
                <strong>Código:</strong> ${materia.CODIGO_MATERIA} | 
                <strong>Grupo:</strong> ${materia.NUMERO_GRUPO} |
                <strong>Créditos:</strong> ${materia.CREDITOS}
              </p>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #666;">
                <strong>Horario:</strong> ${materia.HORARIO || 'Por definir'} | 
                <strong>Aula:</strong> ${materia.AULA || '-'}
              </p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 0.85rem; color: #999;">Promedio</p>
              <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #1e3c72;">
                ${materia.PROMEDIO_GRUPO ? parseFloat(materia.PROMEDIO_GRUPO).toFixed(2) : '-'}
              </p>
            </div>
          </div>
          
          <div class="alumnos-list">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
              <h4 style="color: #666; margin: 0; font-size: 1rem;">
                Alumnos Inscritos (${materia.alumnos ? materia.alumnos.length : 0})
              </h4>
              <button class="btn btn-primary btn-small" onclick="abrirModalAgregar(${materia.ID_GRUPO})">
                + Inscribir Alumno
              </button>
            </div>
            ${materia.alumnos && materia.alumnos.length > 0 ? `
              ${materia.alumnos.map(alumno => {
                const nota = alumno.NOTA_FINAL ? parseFloat(alumno.NOTA_FINAL).toFixed(2) : '-';
                let badgeClass = 'badge-success';
                if (alumno.NOTA_FINAL) {
                  if (alumno.NOTA_FINAL < 6) badgeClass = 'badge-danger';
                  else if (alumno.NOTA_FINAL < 7) badgeClass = 'badge-warning';
                }
                
                return `
                  <div class="alumno-item">
                    <div>
                      <strong>${alumno.NOMBRE_COMPLETO}</strong>
                      <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #666;">
                        Carnet: ${alumno.CARNET || '-'} | Email: ${alumno.EMAIL || '-'}
                      </p>
                    </div>
                    <div style="text-align: center;">
                      <span class="badge ${badgeClass}">Nota: ${nota}</span>
                      <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #999;">
                        P1:${alumno.NOTA_P1 || '-'} P2:${alumno.NOTA_P2 || '-'} P3:${alumno.NOTA_P3 || '-'} P4:${alumno.NOTA_P4 || '-'}
                      </p>
                    </div>
                    <div>
                      <button class="btn btn-small btn-primary" onclick='abrirModalNotas(${JSON.stringify(alumno).replace(/'/g, "&apos;")})'>
                        Notas
                      </button>
                      <button class="btn btn-small btn-danger" onclick="retirarAlumno(${alumno.ID_INSCRIPCION}, '${alumno.NOMBRE_COMPLETO}')">
                        Retirar
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            ` : `
              <p style="text-align: center; color: #999; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                No hay alumnos inscritos. Haz clic en "Inscribir Alumno" para agregar.
              </p>
            `}
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 2rem; color: #999;">
          <p style="font-size: 1.1rem; margin: 0;">No tienes materias asignadas</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al cargar materias:', error);
    document.getElementById('materiasContainer').innerHTML = `
      <div class="card" style="text-align: center; padding: 2rem; color: #dc3545;">
        <p>Error al cargar las materias</p>
      </div>
    `;
  }
}

// ===== ABRIR MODAL AGREGAR ALUMNO =====
function abrirModalAgregar(idGrupo) {
  materiaActual = idGrupo;
  document.getElementById('modal_id_grupo').value = idGrupo;
  
  const select = document.getElementById('select_alumno');
  select.innerHTML = '<option value="">-- Selecciona un alumno --</option>' +
    todosLosAlumnos.map(a => 
      `<option value="${a.ID_ALUMNO}">${a.CARNET} - ${a.NOMBRES} ${a.APELLIDOS}</option>`
    ).join('');
  
  document.getElementById('agregarAlumnoModal').style.display = 'flex';
}

function cerrarModalAgregar() {
  document.getElementById('agregarAlumnoModal').style.display = 'none';
}

// ===== INSCRIBIR ALUMNO =====
async function inscribirAlumno() {
  const idGrupo = document.getElementById('modal_id_grupo').value;
  const idAlumno = document.getElementById('select_alumno').value;
  
  if (!idAlumno) {
    mostrarNotificacion('Por favor selecciona un alumno', 'error');
    return;
  }
  
  try {
    const response = await fetch('/docente/api/inscribir-alumno', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_grupo: idGrupo, id_alumno: idAlumno })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion('Alumno inscrito exitosamente', 'success');
      cerrarModalAgregar();
      cargarMateriasConAlumnos();
    } else {
      mostrarNotificacion(data.error || 'Error al inscribir alumno', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error de conexión', 'error');
  }
}

// ===== ABRIR MODAL NOTAS =====
function abrirModalNotas(alumno) {
  inscripcionActual = alumno.ID_INSCRIPCION;
  document.getElementById('notas_id_inscripcion').value = alumno.ID_INSCRIPCION;
  document.getElementById('notasAlumnoNombre').textContent = alumno.NOMBRE_COMPLETO;
  
  document.getElementById('nota_p1').value = alumno.NOTA_P1 || '';
  document.getElementById('nota_p2').value = alumno.NOTA_P2 || '';
  document.getElementById('nota_p3').value = alumno.NOTA_P3 || '';
  document.getElementById('nota_p4').value = alumno.NOTA_P4 || '';
  
  calcularNotaFinal();
  document.getElementById('notasModal').style.display = 'flex';
}

function cerrarModalNotas() {
  document.getElementById('notasModal').style.display = 'none';
}

// ===== CALCULAR NOTA FINAL =====
function calcularNotaFinal() {
  const notas = [
    parseFloat(document.getElementById('nota_p1').value) || 0,
    parseFloat(document.getElementById('nota_p2').value) || 0,
    parseFloat(document.getElementById('nota_p3').value) || 0,
    parseFloat(document.getElementById('nota_p4').value) || 0
  ].filter(n => n > 0);
  
  const promedio = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) : '-';
  document.getElementById('nota_final_calculada').textContent = promedio;
}

// ===== GUARDAR NOTAS =====
async function guardarNotas() {
  const idInscripcion = document.getElementById('notas_id_inscripcion').value;
  const notaP1 = parseFloat(document.getElementById('nota_p1').value) || null;
  const notaP2 = parseFloat(document.getElementById('nota_p2').value) || null;
  const notaP3 = parseFloat(document.getElementById('nota_p3').value) || null;
  const notaP4 = parseFloat(document.getElementById('nota_p4').value) || null;
  
  try {
    const response = await fetch('/docente/api/guardar-notas-periodo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_inscripcion: idInscripcion,
        nota_p1: notaP1,
        nota_p2: notaP2,
        nota_p3: notaP3,
        nota_p4: notaP4
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion('Notas guardadas exitosamente', 'success');
      cerrarModalNotas();
      cargarMateriasConAlumnos();
    } else {
      mostrarNotificacion(data.error || 'Error al guardar notas', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error de conexión', 'error');
  }
}

// ===== RETIRAR ALUMNO =====
async function retirarAlumno(idInscripcion, nombreAlumno) {
  if (!confirm(`¿Retirar a ${nombreAlumno} de la materia?`)) {
    return;
  }
  
  try {
    const response = await fetch(`/docente/api/retirar-alumno/${idInscripcion}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion('Alumno retirado exitosamente', 'success');
      cargarMateriasConAlumnos();
    } else {
      mostrarNotificacion(data.error || 'Error al retirar alumno', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error de conexión', 'error');
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
