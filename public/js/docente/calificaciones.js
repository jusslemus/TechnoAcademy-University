// ============================================
// CALIFICACIONES DOCENTE - TECHNOACADEMY
// ============================================

let todasCalificaciones = [];
let calificacionesFiltradas = [];

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  cargarMaterias();
  cargarTodasCalificaciones();
  
  // Listeners para inputs del modal
  ["edit_nota_p1", "edit_nota_p2", "edit_nota_p3", "edit_nota_p4"].forEach(id => {
    document.getElementById(id).addEventListener("input", calcularNotaFinalModal);
  });
  
  document.getElementById("editarNotasForm").addEventListener("submit", guardarNotasModal);
  
  // Listeners para filtros
  document.getElementById("searchAlumno").addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
      aplicarFiltros();
    }
  });
});

// ===== CARGAR MATERIAS PARA EL FILTRO =====
async function cargarMaterias() {
  try {
    const response = await fetch("/docente/api/mis-materias");
    const data = await response.json();
    
    const select = document.getElementById("filterMateria");
    
    if (data.success && data.materias) {
      data.materias.forEach(materia => {
        const option = document.createElement("option");
        option.value = materia.ID_GRUPO;
        option.textContent = `${materia.NOMBRE_MATERIA} - ${materia.NUMERO_GRUPO}`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error cargando materias:", error);
  }
}

// ===== CARGAR TODAS LAS CALIFICACIONES =====
async function cargarTodasCalificaciones() {
  try {
    const response = await fetch("/docente/api/calificaciones-todas");
    const data = await response.json();
    
    if (data.success) {
      todasCalificaciones = data.calificaciones || [];
      calificacionesFiltradas = [...todasCalificaciones];
      mostrarCalificaciones(calificacionesFiltradas);
      actualizarEstadisticas(calificacionesFiltradas);
    } else {
      mostrarError("No se pudieron cargar las calificaciones");
    }
  } catch (error) {
    console.error("Error cargando calificaciones:", error);
    mostrarError("Error al cargar las calificaciones");
  }
}

// ===== MOSTRAR CALIFICACIONES EN TABLA =====
function mostrarCalificaciones(calificaciones) {
  const tbody = document.getElementById("calificacionesTable");
  
  if (calificaciones.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 2rem; color: #999;">
           No hay calificaciones registradas
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = calificaciones.map(cal => {
    const nombreAlumno = `${cal.NOMBRES} ${cal.APELLIDOS}`;
    const notaFinal = cal.NOTA_FINAL ? parseFloat(cal.NOTA_FINAL).toFixed(2) : "-";
    const p1 = cal.NOTA_P1 ? parseFloat(cal.NOTA_P1).toFixed(2) : "-";
    const p2 = cal.NOTA_P2 ? parseFloat(cal.NOTA_P2).toFixed(2) : "-";
    const p3 = cal.NOTA_P3 ? parseFloat(cal.NOTA_P3).toFixed(2) : "-";
    const p4 = cal.NOTA_P4 ? parseFloat(cal.NOTA_P4).toFixed(2) : "-";
    
    let estadoBadge, estadoTexto;
    if (!cal.NOTA_FINAL) {
      estadoBadge = "badge-secondary";
      estadoTexto = "Sin Calificar";
    } else if (cal.NOTA_FINAL >= 6) {
      estadoBadge = "badge-success";
      estadoTexto = " Aprobado";
    } else {
      estadoBadge = "badge-danger";
      estadoTexto = " En Riesgo";
    }
    
    return `
      <tr>
        <td><strong>${cal.CARNET || "-"}</strong></td>
        <td>${nombreAlumno}</td>
        <td><small>${cal.NOMBRE_MATERIA}</small></td>
        <td>${cal.NUMERO_GRUPO}</td>
        <td style="text-align: center;">${p1}</td>
        <td style="text-align: center;">${p2}</td>
        <td style="text-align: center;">${p3}</td>
        <td style="text-align: center;">${p4}</td>
        <td style="text-align: center;"><strong style="color: #1976d2;">${notaFinal}</strong></td>
        <td><span class="badge ${estadoBadge}">${estadoTexto}</span></td>
        <td>
          <button class="btn btn-primary btn-small" onclick=\'editarNotas(${JSON.stringify(cal).replace(/\'/g, "&apos;")})\'>
             Editar
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ===== ACTUALIZAR ESTADÍSTICAS =====
function actualizarEstadisticas(calificaciones) {
  const total = calificaciones.length;
  let aprobados = 0;
  let enRiesgo = 0;
  let sumaNotas = 0;
  let contadorNotas = 0;
  
  calificaciones.forEach(cal => {
    if (cal.NOTA_FINAL) {
      contadorNotas++;
      sumaNotas += parseFloat(cal.NOTA_FINAL);
      
      if (cal.NOTA_FINAL >= 6) {
        aprobados++;
      } else {
        enRiesgo++;
      }
    }
  });
  
  document.getElementById("statTotal").textContent = total;
  document.getElementById("statAprobados").textContent = aprobados;
  document.getElementById("statRiesgo").textContent = enRiesgo;
  
  if (contadorNotas > 0) {
    const promedio = (sumaNotas / contadorNotas).toFixed(2);
    document.getElementById("statPromedio").textContent = promedio;
  } else {
    document.getElementById("statPromedio").textContent = "-";
  }
}

// ===== APLICAR FILTROS =====
function aplicarFiltros() {
  const searchText = document.getElementById("searchAlumno").value.toLowerCase();
  const filterMateria = document.getElementById("filterMateria").value;
  const filterEstado = document.getElementById("filterEstado").value;
  
  calificacionesFiltradas = todasCalificaciones.filter(cal => {
    // Filtro de búsqueda
    const nombreCompleto = `${cal.NOMBRES} ${cal.APELLIDOS}`.toLowerCase();
    const carnet = (cal.CARNET || "").toLowerCase();
    const email = (cal.EMAIL || "").toLowerCase();
    const matchSearch = !searchText || 
                       nombreCompleto.includes(searchText) || 
                       carnet.includes(searchText) ||
                       email.includes(searchText);
    
    // Filtro de materia
    const matchMateria = !filterMateria || cal.ID_GRUPO == filterMateria;
    
    // Filtro de estado
    let matchEstado = true;
    if (filterEstado === "APROBADO") {
      matchEstado = cal.NOTA_FINAL && cal.NOTA_FINAL >= 6;
    } else if (filterEstado === "RIESGO") {
      matchEstado = cal.NOTA_FINAL && cal.NOTA_FINAL < 6;
    } else if (filterEstado === "SIN_NOTA") {
      matchEstado = !cal.NOTA_FINAL;
    }
    
    return matchSearch && matchMateria && matchEstado;
  });
  
  mostrarCalificaciones(calificacionesFiltradas);
  actualizarEstadisticas(calificacionesFiltradas);
}

// ===== LIMPIAR FILTROS =====
function limpiarFiltros() {
  document.getElementById("searchAlumno").value = "";
  document.getElementById("filterMateria").value = "";
  document.getElementById("filterEstado").value = "";
  
  calificacionesFiltradas = [...todasCalificaciones];
  mostrarCalificaciones(calificacionesFiltradas);
  actualizarEstadisticas(calificacionesFiltradas);
}

// ===== EXPONER FUNCIONES GLOBALMENTE =====
// Para que funcionen los onclick del HTML
window.aplicarFiltros = aplicarFiltros;
window.limpiarFiltros = limpiarFiltros;

// ===== EDITAR NOTAS =====
function editarNotas(calificacion) {
  document.getElementById("edit_id_inscripcion").value = calificacion.ID_INSCRIPCION;
  document.getElementById("modal_alumno").textContent = `${calificacion.NOMBRES} ${calificacion.APELLIDOS}`;
  document.getElementById("modal_materia").textContent = calificacion.NOMBRE_MATERIA;
  document.getElementById("modal_grupo").textContent = calificacion.NUMERO_GRUPO;
  
  document.getElementById("edit_nota_p1").value = calificacion.NOTA_P1 || "";
  document.getElementById("edit_nota_p2").value = calificacion.NOTA_P2 || "";
  document.getElementById("edit_nota_p3").value = calificacion.NOTA_P3 || "";
  document.getElementById("edit_nota_p4").value = calificacion.NOTA_P4 || "";
  
  calcularNotaFinalModal();
  
  document.getElementById("editarNotasModal").style.display = "flex";
}

// ===== CALCULAR NOTA FINAL EN MODAL =====
function calcularNotaFinalModal() {
  const p1 = parseFloat(document.getElementById("edit_nota_p1").value) || 0;
  const p2 = parseFloat(document.getElementById("edit_nota_p2").value) || 0;
  const p3 = parseFloat(document.getElementById("edit_nota_p3").value) || 0;
  const p4 = parseFloat(document.getElementById("edit_nota_p4").value) || 0;
  
  const notas = [p1, p2, p3, p4].filter(n => n > 0);
  const promedio = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
  
  document.getElementById("modal_nota_final").textContent = promedio.toFixed(2);
  
  // Cambiar color según el promedio
  const notaFinalElement = document.getElementById("modal_nota_final");
  if (promedio >= 6) {
    notaFinalElement.style.color = "#28a745";
  } else if (promedio > 0) {
    notaFinalElement.style.color = "#dc3545";
  } else {
    notaFinalElement.style.color = "#1976d2";
  }
}

// ===== GUARDAR NOTAS DESDE MODAL =====
async function guardarNotasModal(e) {
  e.preventDefault();
  
  const id_inscripcion = document.getElementById("edit_id_inscripcion").value;
  const nota_p1 = parseFloat(document.getElementById("edit_nota_p1").value) || null;
  const nota_p2 = parseFloat(document.getElementById("edit_nota_p2").value) || null;
  const nota_p3 = parseFloat(document.getElementById("edit_nota_p3").value) || null;
  const nota_p4 = parseFloat(document.getElementById("edit_nota_p4").value) || null;
  
  try {
    const response = await fetch("/docente/api/guardar-notas-periodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_inscripcion,
        nota_p1,
        nota_p2,
        nota_p3,
        nota_p4
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      mostrarNotificacion(" Notas guardadas exitosamente", "success");
      cerrarModal();
      cargarTodasCalificaciones(); // Recargar datos
    } else {
      mostrarNotificacion(" " + (data.error || "Error al guardar notas"), "error");
    }
  } catch (error) {
    console.error("Error guardando notas:", error);
    mostrarNotificacion(" Error de conexión al guardar notas", "error");
  }
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById("editarNotasModal").style.display = "none";
  document.getElementById("editarNotasForm").reset();
}

// ===== MOSTRAR NOTIFICACIÓN =====
function mostrarNotificacion(mensaje, tipo = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = mensaje;
  notification.className = `notification ${tipo}`;
  notification.style.display = "block";
  
  setTimeout(() => {
    notification.style.display = "none";
  }, 5000);
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== MOSTRAR ERROR =====
function mostrarError(mensaje) {
  const tbody = document.getElementById("calificacionesTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="11" style="text-align: center; padding: 2rem; color: #dc3545;">
         ${mensaje}
      </td>
    </tr>
  `;
}

// Cerrar modal con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
  }
});

// Cerrar modal al hacer click fuera
window.addEventListener("click", (e) => {
  const modal = document.getElementById("editarNotasModal");
  if (e.target === modal) {
    cerrarModal();
  }
});
