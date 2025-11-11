// ============================================
// GESTIONAR PERÍODOS - TECHNOACADEMY
// ============================================

let todosLosPeriodos = [];

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  cargarPeriodos();
  
  document.getElementById("periodoForm").addEventListener("submit", crearPeriodo);
  document.getElementById("editForm").addEventListener("submit", guardarEdicion);
  document.getElementById("searchInput").addEventListener("input", filtrarPeriodos);
});

// ===== CARGAR PERÍODOS =====
async function cargarPeriodos() {
  try {
    const response = await fetch("/admin/api/periodos");
    const data = await response.json();
    
    todosLosPeriodos = data;
    mostrarPeriodos(data);
  } catch (error) {
    console.error("Error al cargar períodos:", error);
    document.getElementById("periodosTable").innerHTML = 
      '<tr><td colspan="8" style="text-align: center; color: #dc3545;"> Error al cargar períodos</td></tr>';
  }
}

// ===== CREAR PERÍODO =====
async function crearPeriodo(e) {
  e.preventDefault();
  
  const codigo_periodo = document.getElementById("codigo_periodo").value.trim();
  const nombre_periodo = document.getElementById("nombre_periodo").value.trim();
  const fecha_inicio = document.getElementById("fecha_inicio").value;
  const fecha_fin = document.getElementById("fecha_fin").value;
  const estado = document.getElementById("estado").value;
  
  if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
    mostrarNotificacion("La fecha de fin debe ser posterior a la fecha de inicio", "error");
    return;
  }
  
  const btnText = document.getElementById("btn-crear-text");
  const btnLoader = document.getElementById("btn-crear-loader");
  btnText.style.display = "none";
  btnLoader.style.display = "inline";
  
  try {
    const response = await fetch("/admin/api/periodos/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo_periodo, nombre_periodo, fecha_inicio, fecha_fin, estado })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Período creado exitosamente", "success");
      document.getElementById("periodoForm").reset();
      cargarPeriodos();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al crear período"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al crear período", "error");
  } finally {
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
}

// ===== MOSTRAR PERÍODOS EN TABLA =====
function mostrarPeriodos(periodos) {
  const tbody = document.getElementById("periodosTable");
  
  if (periodos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;"> No hay períodos registrados</td></tr>';
    return;
  }
  
  tbody.innerHTML = periodos.map(periodo => {
    const fechaInicio = periodo.FECHA_INICIO ? formatearFecha(periodo.FECHA_INICIO) : "-";
    const fechaFin = periodo.FECHA_FIN ? formatearFecha(periodo.FECHA_FIN) : "-";
    const duracion = calcularDuracion(periodo.FECHA_INICIO, periodo.FECHA_FIN);
    
    const badgeClass = getBadgeClass(periodo.ESTADO);
    const estadoIcon = getEstadoIcon(periodo.ESTADO);
    
    const periodoJson = JSON.stringify(periodo).replace(/'/g, "&apos;");
    const nombreEscapado = (periodo.NOMBRE_PERIODO || "").replace(/'/g, "\\'");
    
    return "<tr>" +
      "<td><strong>" + periodo.ID_PERIODO + "</strong></td>" +
      "<td><strong style='color:#667eea;'>" + (periodo.CODIGO_PERIODO || "-") + "</strong></td>" +
      "<td>" + (periodo.NOMBRE_PERIODO || "-") + "</td>" +
      "<td><small> " + fechaInicio + "</small></td>" +
      "<td><small> " + fechaFin + "</small></td>" +
      "<td><small>" + duracion + "</small></td>" +
      "<td><span class='badge " + badgeClass + "'>" + estadoIcon + " " + (periodo.ESTADO || "ACTIVO") + "</span></td>" +
      "<td>" +
        "<button class='btn btn-small btn-warning' onclick='abrirModalEditar(" + periodoJson + ")'> Editar</button> " +
        "<button class='btn btn-small btn-danger' onclick=\"eliminarPeriodo(" + periodo.ID_PERIODO + ", '" + nombreEscapado + "')\"> Eliminar</button>" +
      "</td>" +
    "</tr>";
  }).join("");
}

// ===== FUNCIONES AUXILIARES =====
function formatearFecha(fechaStr) {
  if (!fechaStr) return "-";
  const fecha = new Date(fechaStr);
  const opciones = { year: "numeric", month: "short", day: "numeric" };
  return fecha.toLocaleDateString("es-ES", opciones);
}

function calcularDuracion(inicio, fin) {
  if (!inicio || !fin) return "-";
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);
  const diferencia = fechaFin - fechaInicio;
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  
  if (meses > 0) return meses + " " + (meses === 1 ? "mes" : "meses");
  if (semanas > 0) return semanas + " " + (semanas === 1 ? "semana" : "semanas");
  return dias + " " + (dias === 1 ? "día" : "días");
}

function getBadgeClass(estado) {
  if (estado === "PLANIFICADO") return "badge-planificado";
  if (estado === "ACTIVO") return "badge-activo";
  if (estado === "FINALIZADO") return "badge-finalizado";
  return "badge-activo";
}

function getEstadoIcon(estado) {
  if (estado === "PLANIFICADO") return "";
  if (estado === "ACTIVO") return "";
  if (estado === "FINALIZADO") return "";
  return "";
}

// ===== ABRIR MODAL EDITAR =====
function abrirModalEditar(periodo) {
  document.getElementById("edit_id_periodo").value = periodo.ID_PERIODO;
  document.getElementById("edit_codigo_periodo").value = periodo.CODIGO_PERIODO || "";
  document.getElementById("edit_nombre_periodo").value = periodo.NOMBRE_PERIODO || "";
  
  if (periodo.FECHA_INICIO) {
    const fechaInicio = new Date(periodo.FECHA_INICIO);
    document.getElementById("edit_fecha_inicio").value = fechaInicio.toISOString().split("T")[0];
  }
  
  if (periodo.FECHA_FIN) {
    const fechaFin = new Date(periodo.FECHA_FIN);
    document.getElementById("edit_fecha_fin").value = fechaFin.toISOString().split("T")[0];
  }
  
  document.getElementById("edit_estado").value = periodo.ESTADO || "ACTIVO";
  document.getElementById("editModal").style.display = "flex";
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById("editModal").style.display = "none";
}

// ===== GUARDAR EDICIÓN =====
async function guardarEdicion(e) {
  e.preventDefault();
  
  const id_periodo = document.getElementById("edit_id_periodo").value;
  const codigo_periodo = document.getElementById("edit_codigo_periodo").value.trim();
  const nombre_periodo = document.getElementById("edit_nombre_periodo").value.trim();
  const fecha_inicio = document.getElementById("edit_fecha_inicio").value;
  const fecha_fin = document.getElementById("edit_fecha_fin").value;
  const estado = document.getElementById("edit_estado").value;
  
  if (new Date(fecha_fin) <= new Date(fecha_inicio)) {
    mostrarNotificacion("La fecha de fin debe ser posterior a la fecha de inicio", "error");
    return;
  }
  
  try {
    const response = await fetch("/admin/api/periodos/" + id_periodo, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo_periodo, nombre_periodo, fecha_inicio, fecha_fin, estado })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      mostrarNotificacion(" Período actualizado exitosamente", "success");
      cerrarModal();
      cargarPeriodos();
    } else {
      mostrarNotificacion(" " + (result.error || "Error al actualizar período"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al actualizar período", "error");
  }
}

// ===== ELIMINAR PERÍODO =====
async function eliminarPeriodo(id, nombre) {
  if (!confirm("¿Está seguro de eliminar el período \"" + nombre + "\"?\n\n Esta acción no se puede deshacer.")) {
    return;
  }
  
  try {
    const response = await fetch("/admin/api/periodos/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Período eliminado exitosamente", "success");
      cargarPeriodos();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al eliminar período"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al eliminar período", "error");
  }
}

// ===== FILTRAR PERÍODOS =====
function filtrarPeriodos() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  const periodosFiltrados = todosLosPeriodos.filter(periodo => 
    (periodo.CODIGO_PERIODO && periodo.CODIGO_PERIODO.toLowerCase().includes(searchTerm)) ||
    (periodo.NOMBRE_PERIODO && periodo.NOMBRE_PERIODO.toLowerCase().includes(searchTerm)) ||
    (periodo.ESTADO && periodo.ESTADO.toLowerCase().includes(searchTerm))
  );
  
  mostrarPeriodos(periodosFiltrados);
}

// ===== MOSTRAR NOTIFICACIÓN =====
function mostrarNotificacion(mensaje, tipo) {
  const notification = document.getElementById("notification");
  notification.textContent = mensaje;
  notification.className = "notification " + tipo;
  notification.style.display = "block";
  
  setTimeout(function() {
    notification.style.display = "none";
  }, 5000);
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cerrar modal con Escape
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") cerrarModal();
});

// Cerrar modal al hacer click fuera
window.addEventListener("click", function(e) {
  const modal = document.getElementById("editModal");
  if (e.target === modal) cerrarModal();
});
