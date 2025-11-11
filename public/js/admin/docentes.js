// ============================================
// GESTIONAR DOCENTES - TECHNOACADEMY
// ============================================

let todosLosDocentes = [];

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  cargarDocentes();
  
  document.getElementById("docenteForm").addEventListener("submit", crearDocente);
  document.getElementById("editForm").addEventListener("submit", guardarEdicion);
  document.getElementById("searchInput").addEventListener("input", filtrarDocentes);
});

// ===== CARGAR DOCENTES =====
async function cargarDocentes() {
  try {
    const response = await fetch("/admin/api/docentes");
    const data = await response.json();
    
    todosLosDocentes = data;
    mostrarDocentes(data);
  } catch (error) {
    console.error("Error al cargar docentes:", error);
    document.getElementById("docentesTable").innerHTML = 
      `<tr><td colspan="8" style="text-align: center; color: #dc3545;"> Error al cargar docentes</td></tr>`;
  }
}

// ===== MOSTRAR DOCENTES EN TABLA =====
function mostrarDocentes(docentes) {
  const tbody = document.getElementById("docentesTable");
  
  if (docentes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">No hay docentes registrados</td></tr>`;
    return;
  }
  
  tbody.innerHTML = docentes.map((docente, index) => {
    const nombreCompleto = `${docente.NOMBRES || ""} ${docente.APELLIDOS || ""}`;
    const badgeClass = docente.ESTADO === "ACTIVO" ? "badge-success" : "badge-inactive";
    const usuario = docente.NOMBRE_USUARIO || "Sin usuario";
    
    return `
      <tr>
        <td>${docente.ID_DOCENTE}</td>
        <td><strong>${nombreCompleto}</strong></td>
        <td>${docente.EMAIL || "-"}</td>
        <td>${docente.TELEFONO || "-"}</td>
        <td>${docente.ESPECIALIDAD || "-"}</td>
        <td>${usuario}</td>
        <td><span class="badge ${badgeClass}">${docente.ESTADO || "ACTIVO"}</span></td>
        <td>
          <button class="btn btn-small btn-warning" onclick="abrirModalEditarPorId(${index})">
             Editar
          </button>
          <button class="btn btn-small btn-danger" onclick="eliminarDocente(${docente.ID_DOCENTE})">
             Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ===== ABRIR MODAL EDITAR POR ÍNDICE =====
function abrirModalEditarPorId(index) {
  const docente = todosLosDocentes[index];
  abrirModalEditar(docente);
}

// ===== CREAR DOCENTE =====
async function crearDocente(e) {
  e.preventDefault();
  
  const nombre_usuario = document.getElementById("nombre_usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const nombres = document.getElementById("nombres").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const especialidad = document.getElementById("especialidad").value.trim();
  const fecha_contratacion = document.getElementById("fecha_contratacion").value;
  
  if (contrasena.length < 6) {
    mostrarNotificacion("La contraseña debe tener al menos 6 caracteres", "error");
    return;
  }
  
  const btnText = document.getElementById("btn-crear-text");
  const btnLoader = document.getElementById("btn-crear-loader");
  btnText.style.display = "none";
  btnLoader.style.display = "inline";
  
  try {
    const response = await fetch("/admin/api/docentes/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre_usuario,
        contrasena,
        nombres,
        apellidos,
        email,
        telefono,
        especialidad,
        fecha_contratacion: fecha_contratacion || null
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Docente creado exitosamente", "success");
      document.getElementById("docenteForm").reset();
      cargarDocentes();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al crear docente"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al crear docente", "error");
  } finally {
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
}

// ===== ABRIR MODAL EDITAR =====
function abrirModalEditar(docente) {
  document.getElementById("edit_id_docente").value = docente.ID_DOCENTE;
  document.getElementById("edit_nombres").value = docente.NOMBRES || "";
  document.getElementById("edit_apellidos").value = docente.APELLIDOS || "";
  document.getElementById("edit_email").value = docente.EMAIL || "";
  document.getElementById("edit_telefono").value = docente.TELEFONO || "";
  document.getElementById("edit_especialidad").value = docente.ESPECIALIDAD || "";
  document.getElementById("edit_estado").value = docente.ESTADO || "ACTIVO";
  
  document.getElementById("editModal").style.display = "flex";
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById("editModal").style.display = "none";
}

// ===== GUARDAR EDICIÓN =====
async function guardarEdicion(e) {
  e.preventDefault();
  
  const id_docente = document.getElementById("edit_id_docente").value;
  const nombres = document.getElementById("edit_nombres").value.trim();
  const apellidos = document.getElementById("edit_apellidos").value.trim();
  const email = document.getElementById("edit_email").value.trim();
  const telefono = document.getElementById("edit_telefono").value.trim();
  const especialidad = document.getElementById("edit_especialidad").value.trim();
  const estado = document.getElementById("edit_estado").value;
  
  try {
    const response = await fetch(`/admin/api/docentes/${id_docente}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombres,
        apellidos,
        email,
        telefono,
        especialidad,
        estado
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      mostrarNotificacion(" Docente actualizado exitosamente", "success");
      cerrarModal();
      cargarDocentes();
    } else {
      mostrarNotificacion(" " + (result.error || "Error al actualizar docente"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al actualizar docente", "error");
  }
}

// ===== ELIMINAR DOCENTE =====
async function eliminarDocente(id) {
  const docente = todosLosDocentes.find(d => d.ID_DOCENTE === id);
  const nombre = docente ? `${docente.NOMBRES} ${docente.APELLIDOS}` : "este docente";
  
  if (!confirm(`¿Está seguro de eliminar al docente "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/admin/api/docentes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Docente eliminado exitosamente", "success");
      cargarDocentes();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al eliminar docente"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al eliminar docente", "error");
  }
}

// ===== FILTRAR DOCENTES =====
function filtrarDocentes() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  const docentesFiltrados = todosLosDocentes.filter(docente => 
    (docente.NOMBRES && docente.NOMBRES.toLowerCase().includes(searchTerm)) ||
    (docente.APELLIDOS && docente.APELLIDOS.toLowerCase().includes(searchTerm)) ||
    (docente.EMAIL && docente.EMAIL.toLowerCase().includes(searchTerm)) ||
    (docente.ESPECIALIDAD && docente.ESPECIALIDAD.toLowerCase().includes(searchTerm))
  );
  
  mostrarDocentes(docentesFiltrados);
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
