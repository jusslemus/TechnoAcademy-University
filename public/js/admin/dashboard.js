// ============================================
// DASHBOARD ADMIN - TECHNOACADEMY
// ============================================

document.addEventListener("DOMContentLoaded", function() {
  cargarEstadisticas();
});

// ===== CARGAR ESTADÍSTICAS =====
async function cargarEstadisticas() {
  try {
    // Cargar alumnos
    const alumnosRes = await fetch("/admin/api/alumnos");
    const alumnos = await alumnosRes.json();
    document.getElementById("total-alumnos").textContent = alumnos.length;
    
    // Cargar docentes
    const docentesRes = await fetch("/admin/api/docentes");
    const docentes = await docentesRes.json();
    document.getElementById("total-docentes").textContent = docentes.length;
    
    // Cargar materias
    const materiasRes = await fetch("/admin/api/materias");
    const materias = await materiasRes.json();
    document.getElementById("total-materias").textContent = materias.length;
    
    // Cargar carreras
    const carrerasRes = await fetch("/admin/api/carreras");
    const carreras = await carrerasRes.json();
    document.getElementById("total-carreras").textContent = carreras.length;
    
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
    document.getElementById("total-alumnos").textContent = "0";
    document.getElementById("total-docentes").textContent = "0";
    document.getElementById("total-materias").textContent = "0";
    document.getElementById("total-carreras").textContent = "0";
  }
}
