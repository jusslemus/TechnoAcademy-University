// ============================================
// PAGOS ALUMNO - TECHNOACADEMY
// ============================================

let todosPagos = [];
let pagosFiltrados = [];

document.addEventListener("DOMContentLoaded", function() {
  cargarPagos();
});

async function cargarPagos() {
  try {
    const response = await fetch("/alumno/api/pagos");
    const data = await response.json();
    
    if (Array.isArray(data)) {
      todosPagos = data;
      pagosFiltrados = [...todosPagos];
      mostrarPagos(pagosFiltrados);
      actualizarEstadisticas(todosPagos);
    } else {
      mostrarError("No se pudieron cargar los pagos");
    }
  } catch (error) {
    console.error("Error cargando pagos:", error);
    mostrarError("Error al cargar los pagos");
  }
}

function mostrarPagos(pagos) {
  const tbody = document.getElementById("pagosTable");
  
  if (pagos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #999;">
           No tienes pagos registrados
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pagos.map(pago => {
    const monto = pago.MONTO ? `$${parseFloat(pago.MONTO).toFixed(2)}` : "-";
    const fechaPago = pago.FECHA_PAGO ? new Date(pago.FECHA_PAGO).toLocaleDateString() : "-";
    
    let estadoBadge, estadoTexto;
    if (pago.ESTADO === "PAGADO") {
      estadoBadge = "badge-success";
      estadoTexto = " Pagado";
    } else {
      estadoBadge = "badge-warning";
      estadoTexto = " Pendiente";
    }
    
    return `
      <tr>
        <td><strong>${pago.ID_PAGO}</strong></td>
        <td>${pago.CONCEPTO || "Sin concepto"}</td>
        <td><strong style="color: #1976d2;">${monto}</strong></td>
        <td>${fechaPago}</td>
        <td><small>${pago.METODO_PAGO || "-"}</small></td>
        <td><span class="badge ${estadoBadge}">${estadoTexto}</span></td>
      </tr>
    `;
  }).join("");
}

function actualizarEstadisticas(pagos) {
  let totalPagado = 0;
  let totalPendiente = 0;
  const totalPagos = pagos.length;
  
  pagos.forEach(pago => {
    if (pago.MONTO) {
      const monto = parseFloat(pago.MONTO);
      if (pago.ESTADO === "PAGADO") {
        totalPagado += monto;
      } else if (pago.ESTADO === "PENDIENTE") {
        totalPendiente += monto;
      }
    }
  });
  
  document.getElementById("statPagado").textContent = `$${totalPagado.toFixed(2)}`;
  document.getElementById("statPendiente").textContent = `$${totalPendiente.toFixed(2)}`;
  document.getElementById("statTotal").textContent = totalPagos;
}

function aplicarFiltros() {
  const filterEstado = document.getElementById("filterEstado").value;
  
  pagosFiltrados = todosPagos.filter(pago => {
    return !filterEstado || pago.ESTADO === filterEstado;
  });
  
  mostrarPagos(pagosFiltrados);
}

function limpiarFiltros() {
  document.getElementById("filterEstado").value = "";
  pagosFiltrados = [...todosPagos];
  mostrarPagos(pagosFiltrados);
}

// Exponer funciones globalmente para los botones HTML
window.aplicarFiltros = aplicarFiltros;
window.limpiarFiltros = limpiarFiltros;

function mostrarError(mensaje) {
  const tbody = document.getElementById("pagosTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; padding: 2rem; color: #dc3545;">
         ${mensaje}
      </td>
    </tr>
  `;
}
