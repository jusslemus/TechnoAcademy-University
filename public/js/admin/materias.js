// ============================================
// GESTIONAR MATERIAS - TECHNOACADEMY
// ============================================

let todasLasMaterias = [];
let todasLasCarreras = [];
let todosLosDocentes = [];

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function() {
  cargarCarreras();
  cargarDocentes();
  cargarMaterias();
  
  document.getElementById("materiaForm").addEventListener("submit", crearMateria);
  document.getElementById("editForm").addEventListener("submit", guardarEdicion);
  document.getElementById("searchInput").addEventListener("input", filtrarMaterias);
});

// ===== CARGAR CARRERAS =====
async function cargarCarreras() {
  try {
    const response = await fetch("/admin/api/carreras");
    const carreras = await response.json();
    todasLasCarreras = carreras;
    
    const selectCrear = document.getElementById("id_carrera");
    const selectEditar = document.getElementById("edit_id_carrera");
    
    carreras.forEach(carrera => {
      const option1 = document.createElement("option");
      option1.value = carrera.ID_CARRERA;
      option1.textContent = carrera.NOMBRE_CARRERA;
      selectCrear.appendChild(option1);
      
      const option2 = document.createElement("option");
      option2.value = carrera.ID_CARRERA;
      option2.textContent = carrera.NOMBRE_CARRERA;
      selectEditar.appendChild(option2);
    });
  } catch (error) {
    console.error("Error al cargar carreras:", error);
  }
}

// ===== CARGAR DOCENTES =====
async function cargarDocentes() {
  try {
    const response = await fetch("/admin/api/docentes");
    const docentes = await response.json();
    todosLosDocentes = docentes;
    
    const selectCrear = document.getElementById("id_docente");
    const selectEditar = document.getElementById("edit_id_docente");
    
    docentes.forEach(docente => {
      const nombreCompleto = `${docente.NOMBRES || ""} ${docente.APELLIDOS || ""}`.trim();
      
      const option1 = document.createElement("option");
      option1.value = docente.ID_DOCENTE;
      option1.textContent = nombreCompleto;
      selectCrear.appendChild(option1);
      
      const option2 = document.createElement("option");
      option2.value = docente.ID_DOCENTE;
      option2.textContent = nombreCompleto;
      selectEditar.appendChild(option2);
    });
  } catch (error) {
    console.error("Error al cargar docentes:", error);
  }
}

// ===== CARGAR MATERIAS =====
async function cargarMaterias() {
  try {
    const response = await fetch("/admin/api/materias");
    const data = await response.json();
    
    todasLasMaterias = data;
    mostrarMaterias(data);
  } catch (error) {
    console.error("Error al cargar materias:", error);
    document.getElementById("materiasTable").innerHTML = 
      `<tr><td colspan="9" style="text-align: center; color: #dc3545;">Error al cargar materias</td></tr>`;
  }
}

// ===== MOSTRAR MATERIAS EN TABLA =====
function mostrarMaterias(materias) {
  const tbody = document.getElementById("materiasTable");
  
  if (materias.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">No hay materias registradas</td></tr>`;
    return;
  }
  
  tbody.innerHTML = materias.map((materia, index) => {
    const badgeClass = materia.ESTADO === "ACTIVA" ? "badge-success" : "badge-inactive";
    const carrera = materia.NOMBRE_CARRERA || "-";
    const docente = materia.NOMBRE_DOCENTE ? materia.NOMBRE_DOCENTE : "<em style=color:#999;>Sin asignar</em>";
    
    return `
      <tr>
        <td>${materia.ID_MATERIA}</td>
        <td><strong>${materia.CODIGO_MATERIA || "-"}</strong></td>
        <td>${materia.NOMBRE_MATERIA || "-"}</td>
        <td><small>${carrera}</small></td>
        <td><small>${docente}</small></td>
        <td>${materia.CREDITOS || "-"}</td>
        <td>${materia.CICLO_RECOMENDADO || "-"}</td>
        <td><span class="badge ${badgeClass}">${materia.ESTADO || "ACTIVA"}</span></td>
        <td>
          <button class="btn btn-small btn-warning" onclick="abrirModalEditarPorId(${index})">
            Editar
          </button>
          <button class="btn btn-small btn-danger" onclick="eliminarMateria(${materia.ID_MATERIA}, '${materia.NOMBRE_MATERIA.replace(/'/g, "\\'")}')">
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// ===== CREAR MATERIA =====
async function crearMateria(e) {
  e.preventDefault();
  
  const codigo_materia = document.getElementById("codigo_materia").value.trim();
  const nombre_materia = document.getElementById("nombre_materia").value.trim();
  const id_carrera = document.getElementById("id_carrera").value;
  const id_docente = document.getElementById("id_docente").value;
  const creditos = document.getElementById("creditos").value;
  const horas_semanales = document.getElementById("horas_semanales").value;
  const ciclo_recomendado = document.getElementById("ciclo_recomendado").value;
  const descripcion = document.getElementById("descripcion").value.trim();
  
  const btnText = document.getElementById("btn-crear-text");
  const btnLoader = document.getElementById("btn-crear-loader");
  btnText.style.display = "none";
  btnLoader.style.display = "inline";
  
  try {
    const response = await fetch("/admin/api/materias/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo_materia,
        nombre_materia,
        id_carrera: parseInt(id_carrera),
        id_docente: id_docente ? parseInt(id_docente) : null,
        creditos: parseInt(creditos),
        horas_semanales: horas_semanales ? parseInt(horas_semanales) : null,
        ciclo_recomendado: ciclo_recomendado ? parseInt(ciclo_recomendado) : null,
        descripcion: descripcion || null
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Materia creada exitosamente", "success");
      document.getElementById("materiaForm").reset();
      cargarMaterias();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al crear materia"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al crear materia", "error");
  } finally {
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
}

// ===== ABRIR MODAL EDITAR =====
function abrirModalEditarPorId(index) {
  const materia = todasLasMaterias[index];
  
  document.getElementById("edit_id_materia").value = materia.ID_MATERIA;
  document.getElementById("edit_codigo_materia").value = materia.CODIGO_MATERIA || "";
  document.getElementById("edit_nombre_materia").value = materia.NOMBRE_MATERIA || "";
  document.getElementById("edit_id_carrera").value = materia.ID_CARRERA || "";
  document.getElementById("edit_id_docente").value = materia.ID_DOCENTE || "";
  document.getElementById("edit_creditos").value = materia.CREDITOS || "";
  document.getElementById("edit_horas_semanales").value = materia.HORAS_SEMANALES || "";
  document.getElementById("edit_ciclo_recomendado").value = materia.CICLO_RECOMENDADO || "";
  document.getElementById("edit_estado").value = materia.ESTADO || "ACTIVA";
  document.getElementById("edit_descripcion").value = materia.DESCRIPCION || "";
  
  document.getElementById("editModal").style.display = "flex";
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById("editModal").style.display = "none";
}

// ===== GUARDAR EDICIÓN =====
async function guardarEdicion(e) {
  e.preventDefault();
  
  const id_materia = document.getElementById("edit_id_materia").value;
  const codigo_materia = document.getElementById("edit_codigo_materia").value.trim();
  const nombre_materia = document.getElementById("edit_nombre_materia").value.trim();
  const id_carrera = document.getElementById("edit_id_carrera").value;
  const id_docente = document.getElementById("edit_id_docente").value;
  const creditos = document.getElementById("edit_creditos").value;
  const horas_semanales = document.getElementById("edit_horas_semanales").value;
  const ciclo_recomendado = document.getElementById("edit_ciclo_recomendado").value;
  const estado = document.getElementById("edit_estado").value;
  const descripcion = document.getElementById("edit_descripcion").value.trim();
  
  try {
    const response = await fetch(`/admin/api/materias/${id_materia}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo_materia,
        nombre_materia,
        id_carrera: parseInt(id_carrera),
        id_docente: id_docente ? parseInt(id_docente) : null,
        creditos: parseInt(creditos),
        horas_semanales: horas_semanales ? parseInt(horas_semanales) : null,
        ciclo_recomendado: ciclo_recomendado ? parseInt(ciclo_recomendado) : null,
        estado,
        descripcion: descripcion || null
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      mostrarNotificacion(" Materia actualizada exitosamente", "success");
      cerrarModal();
      cargarMaterias();
    } else {
      mostrarNotificacion(" " + (result.error || "Error al actualizar materia"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al actualizar materia", "error");
  }
}

// ===== ELIMINAR MATERIA =====
async function eliminarMateria(id, nombre) {
  if (!confirm(`¿Está seguro de eliminar la materia "${nombre}"?\n\nEsta acción no se puede deshacer y eliminará todos los registros relacionados.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/admin/api/materias/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Materia eliminada exitosamente", "success");
      cargarMaterias();
    } else {
      mostrarNotificacion(" " + (data.error || "Error al eliminar materia"), "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarNotificacion(" Error de conexión al eliminar materia", "error");
  }
}

// ===== FILTRAR MATERIAS =====
function filtrarMaterias() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  
  const materiasFiltradas = todasLasMaterias.filter(materia => 
    (materia.CODIGO_MATERIA && materia.CODIGO_MATERIA.toLowerCase().includes(searchTerm)) ||
    (materia.NOMBRE_MATERIA && materia.NOMBRE_MATERIA.toLowerCase().includes(searchTerm)) ||
    (materia.NOMBRE_CARRERA && materia.NOMBRE_CARRERA.toLowerCase().includes(searchTerm))
  );
  
  mostrarMaterias(materiasFiltradas);
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
