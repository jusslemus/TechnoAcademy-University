// ============================================
// CALIFICACIONES ALUMNO - TECHNOACADEMY
// ============================================

let misCalificaciones = [];

document.addEventListener("DOMContentLoaded", function() {
  cargarCalificaciones();
});

async function cargarCalificaciones() {
  try {
    const response = await fetch("/alumno/api/mis-materias");
    const data = await response.json();
    
    if (data.success && data.materias) {
      misCalificaciones = data.materias;
      mostrarCalificaciones(misCalificaciones);
      actualizarEstadisticas(misCalificaciones);
    } else {
      mostrarError("No se pudieron cargar las calificaciones");
    }
  } catch (error) {
    console.error("Error cargando calificaciones:", error);
    mostrarError("Error al cargar las calificaciones");
  }
}

function mostrarCalificaciones(calificaciones) {
  const tbody = document.getElementById("calificacionesTable");
  
  if (calificaciones.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2rem; color: #999;">
           No tienes calificaciones registradas
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = calificaciones.map(cal => {
    const p1 = cal.NOTA_P1 ? parseFloat(cal.NOTA_P1).toFixed(2) : "-";
    const p2 = cal.NOTA_P2 ? parseFloat(cal.NOTA_P2).toFixed(2) : "-";
    const p3 = cal.NOTA_P3 ? parseFloat(cal.NOTA_P3).toFixed(2) : "-";
    const p4 = cal.NOTA_P4 ? parseFloat(cal.NOTA_P4).toFixed(2) : "-";
    const notaFinal = cal.NOTA_FINAL ? parseFloat(cal.NOTA_FINAL).toFixed(2) : "-";
    
    let estadoBadge, estadoTexto;
    if (!cal.NOTA_FINAL) {
      estadoBadge = "badge-secondary";
      estadoTexto = "Sin Calificar";
    } else if (cal.NOTA_FINAL >= 6) {
      estadoBadge = "badge-success";
      estadoTexto = " Aprobado";
    } else {
      estadoBadge = "badge-danger";
      estadoTexto = " Reprobado";
    }
    
    return `
      <tr>
        <td><strong>${cal.CODIGO_MATERIA || "-"}</strong></td>
        <td>${cal.NOMBRE_MATERIA}</td>
        <td style="text-align: center;">${p1}</td>
        <td style="text-align: center;">${p2}</td>
        <td style="text-align: center;">${p3}</td>
        <td style="text-align: center;">${p4}</td>
        <td style="text-align: center;"><strong style="color: #1976d2; font-size: 1.1rem;">${notaFinal}</strong></td>
        <td><span class="badge ${estadoBadge}">${estadoTexto}</span></td>
      </tr>
    `;
  }).join("");
}

function actualizarEstadisticas(calificaciones) {
  const total = calificaciones.length;
  let aprobadas = 0;
  let reprobadas = 0;
  let sumaNotas = 0;
  let contadorNotas = 0;
  
  calificaciones.forEach(cal => {
    if (cal.NOTA_FINAL) {
      contadorNotas++;
      sumaNotas += parseFloat(cal.NOTA_FINAL);
      
      if (cal.NOTA_FINAL >= 6) {
        aprobadas++;
      } else {
        reprobadas++;
      }
    }
  });
  
  document.getElementById("statTotal").textContent = total;
  document.getElementById("statAprobadas").textContent = aprobadas;
  document.getElementById("statReprobadas").textContent = reprobadas;
  
  if (contadorNotas > 0) {
    const promedio = (sumaNotas / contadorNotas).toFixed(2);
    document.getElementById("statPromedio").textContent = promedio;
  } else {
    document.getElementById("statPromedio").textContent = "-";
  }
}

function mostrarError(mensaje) {
  const tbody = document.getElementById("calificacionesTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="8" style="text-align: center; padding: 2rem; color: #dc3545;">
         ${mensaje}
      </td>
    </tr>
  `;
}
