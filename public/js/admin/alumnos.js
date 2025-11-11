// ============================================
// GESTIONAR ALUMNOS - TECHNOACADEMY
// ============================================

let todosLosAlumnos = [];

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  cargarAlumnos();
  
  document.getElementById("alumnoForm").addEventListener("submit", crearAlumno);
  document.getElementById("editForm").addEventListener("submit", guardarEdicion);
  document.getElementById("searchInput").addEventListener("input", filtrarAlumnos);
});

// ===== CARGAR ALUMNOS =====
async function cargarAlumnos() {
  try {
    const response = await fetch("/admin/api/alumnos");
    const data = await response.json();
    
    todosLosAlumnos = data;
    mostrarAlumnos(data);
  } catch (error) {
    console.error("Error al cargar alumnos:", error);
    document.getElementById("alumnosTable").innerHTML = 
      `<tr><td colspan="9" style="text-align: center; color: #dc3545;"> Error al cargar alumnos</td></tr>`;
  }
}

// ===== MOSTRAR ALUMNOS EN TABLA =====
function mostrarAlumnos(alumnos) {
  const tbody = document.getElementById("alumnosTable");
  
  if (alumnos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No hay alumnos registrados</td></tr>`;
    return;
  }
  
  tbody.innerHTML = alumnos.map(alumno => {
    const nombreCompleto = `${alumno.NOMBRES || ""} ${alumno.APELLIDOS || ""}`;
    const badgeClass = alumno.ESTADO === "ACTIVO" ? "badge-success" : "badge-inactive";
    const usuario = alumno.NOMBRE_USUARIO || "Sin usuario";
    const carrera = alumno.CARRERA || "Sin carrera";
    
    return `
      <tr>
        <td>${alumno.ID_ALUMNO}</td>
        <td><strong>${alumno.CARNET || "-"}</strong></td>
        <td>${nombreCompleto}</td>
        <td>${alumno.EMAIL || "-"}</td>
        <td>${alumno.TELEFONO || "-"}</td>
        <td><small>${carrera}</small></td>
        <td><small>${usuario}</small></td>
        <td><span class="badge ${badgeClass}">${alumno.ESTADO || "ACTIVO"}</span></td>
        <td>
          <button class="btn btn-small btn-warning" onclick='"'"'abrirModalEditar(${JSON.stringify(alumno).replace(/'"'"'/g, "&apos;")}))'"'"'>
             Editar
          </button>
          <button class="btn btn-small btn-danger" onclick="eliminarAlumno(${alumno.ID_ALUMNO}, '"'"'${nombreCompleto}'"'"')">
             Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ===== CREAR ALUMNO =====
async function crearAlumno(e) {
  e.preventDefault();
  
  const nombre_usuario = document.getElementById("nombre_usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const carnet = document.getElementById("carnet").value.trim();
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
  const direccion = document.getElementById("direccion").value.trim();
  const carrera = document.getElementById("carrera").value.trim();
  
  if (contrasena.length < 6) {
    mostrarNotificacion("La contraseña debe tener al menos 6 caracteres", "error");
    return;
  }
  
  const btnText = document.getElementById("btn-crear-text");
  const btnLoader = document.getElementById("btn-crear-loader");
  btnText.style.display = "none";
  btnLoader.style.display = "inline";
  
  try {
    const response = await fetch("/admin/api/alumnos/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre_usuario,
        contrasena,
        carnet,
        nombres,
        apellidos,
        email,
        telefono: telefono || null,
        fecha_nacimiento: fecha_nacimiento || null,
        direccion: direccion || null,
        carrera: carrera || null
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Alumno creado exitosamente", "success");
      document.getElementById("alumnoForm").reset();
      cargarAlumnos();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al crear alumno"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al crear alumno", "error");
  } finally {
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
}

// ===== ABRIR MODAL EDITAR =====
function abrirModalEditar(alumno) {
  document.getElementById("edit_id_alumno").value = alumno.ID_ALUMNO;
  document.getElementById("edit_carnet").value = alumno.CARNET || "";
  document.getElementById("edit_nombres").value = alumno.NOMBRES || "";
  document.getElementById("edit_apellidos").value = alumno.APELLIDOS || "";
  document.getElementById("edit_email").value = alumno.EMAIL || "";
  document.getElementById("edit_telefono").value = alumno.TELEFONO || "";
  document.getElementById("edit_fecha_nacimiento").value = alumno.FECHA_NACIMIENTO ? alumno.FECHA_NACIMIENTO.split("T")[0] : "";
  document.getElementById("edit_direccion").value = alumno.DIRECCION || "";
  document.getElementById("edit_carrera").value = alumno.CARRERA || "";
  document.getElementById("edit_estado").value = alumno.ESTADO || "ACTIVO";
  
  document.getElementById("editModal").style.display = "flex";
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById("editModal").style.display = "none";
}

// ===== GUARDAR EDICIÓN =====
async function guardarEdicion(e) {
  e.preventDefault();
  
  const id_alumno = document.getElementById("edit_id_alumno").value;
  const carnet = document.getElementById("edit_carnet").value.trim();
  const nombres = document.getElementById("edit_nombres").value.trim();
  const apellidos = document.getElementById("edit_apellidos").value.trim();
  const email = document.getElementById("edit_email").value.trim();
  const telefono = document.getElementById("edit_telefono").value.trim();
  const fecha_nacimiento = document.getElementById("edit_fecha_nacimiento").value;
  const direccion = document.getElementById("edit_direccion").value.trim();
  const carrera = document.getElementById("edit_carrera").value.trim();
  const estado = document.getElementById("edit_estado").value;
  
  try {
    const response = await fetch(`/admin/api/alumnos/${id_alumno}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        carnet,
        nombres,
        apellidos,
        email,
        telefono: telefono || null,
        fecha_nacimiento: fecha_nacimiento || null,
        direccion: direccion || null,
        carrera: carrera || null,
        estado
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      mostrarNotificacion(" Alumno actualizado exitosamente", "success");
      cerrarModal();
      cargarAlumnos();
    } else {
      mostrarNotificacion(" " + (result.error || "Error al actualizar alumno"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al actualizar alumno", "error");
  }
}

// ===== ELIMINAR ALUMNO =====
async function eliminarAlumno(id, nombre) {
  if (!confirm(`¿Está seguro de eliminar al alumno "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/admin/api/alumnos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Alumno eliminado exitosamente", "success");
      cargarAlumnos();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al eliminar alumno"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al eliminar alumno", "error");
  }
}

// ===== FILTRAR ALUMNOS =====
function filtrarAlumnos() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  const alumnosFiltrados = todosLosAlumnos.filter(alumno => 
    (alumno.CARNET && alumno.CARNET.toLowerCase().includes(searchTerm)) ||
    (alumno.NOMBRES && alumno.NOMBRES.toLowerCase().includes(searchTerm)) ||
    (alumno.APELLIDOS && alumno.APELLIDOS.toLowerCase().includes(searchTerm)) ||
    (alumno.EMAIL && alumno.EMAIL.toLowerCase().includes(searchTerm))
  );
  
  mostrarAlumnos(alumnosFiltrados);
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

// Cerrar modal con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
  }
});

// Cerrar modal al hacer click fuera
window.addEventListener("click", (e) => {
  const modal = document.getElementById("editModal");
  if (e.target === modal) {
    cerrarModal();
  }
});
