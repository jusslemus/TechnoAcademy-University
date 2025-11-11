// ============================================
// PAGOS ALUMNO - TECHNOACADEMY
// ============================================

let todosPagos = [];
let pagosFiltrados = [];

document.addEventListener("DOMContentLoaded", function() {
  cargarPagos();
  
  // Listener para el formulario de pago
  document.getElementById("pagarForm").addEventListener("submit", confirmarPago);
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
        <td colspan="7" style="text-align: center; padding: 2rem; color: #999;">
           No tienes pagos registrados
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pagos.map(pago => {
    const monto = pago.MONTO ? `$${parseFloat(pago.MONTO).toFixed(2)}` : "-";
    const fechaPago = pago.FECHA_PAGO ? new Date(pago.FECHA_PAGO).toLocaleDateString() : "-";
    
    let estadoBadge, estadoTexto, botonPagar;
    if (pago.ESTADO === "PAGADO") {
      estadoBadge = "badge-success";
      estadoTexto = " Pagado";
      botonPagar = `<span style="color:#999;">-</span>`;
    } else {
      estadoBadge = "badge-warning";
      estadoTexto = " Pendiente";
      botonPagar = `<button class="btn btn-primary btn-small" onclick=\'abrirModalPago(${JSON.stringify(pago).replace(/\'/g, "&apos;")})\'> Pagar</button>`;
    }
    
    return `
      <tr>
        <td><strong>${pago.ID_PAGO}</strong></td>
        <td>${pago.CONCEPTO || "Sin concepto"}</td>
        <td><strong style="color: #1976d2;">${monto}</strong></td>
        <td>${fechaPago}</td>
        <td><small>${pago.METODO_PAGO || "-"}</small></td>
        <td><span class="badge ${estadoBadge}">${estadoTexto}</span></td>
        <td>${botonPagar}</td>
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

// ===== ABRIR MODAL DE PAGO =====
function abrirModalPago(pago) {
  document.getElementById("pago_id_pago").value = pago.ID_PAGO;
  document.getElementById("modal_concepto").textContent = pago.CONCEPTO || "Sin concepto";
  document.getElementById("modal_monto").textContent = `$${parseFloat(pago.MONTO).toFixed(2)}`;
  document.getElementById("metodo_pago").value = "";
  
  document.getElementById("pagarModal").style.display = "flex";
}

// ===== CERRAR MODAL =====
function cerrarModalPago() {
  document.getElementById("pagarModal").style.display = "none";
  document.getElementById("pagarForm").reset();
}

// ===== CONFIRMAR PAGO =====
async function confirmarPago(e) {
  e.preventDefault();
  
  const id_pago = document.getElementById("pago_id_pago").value;
  const metodo_pago = document.getElementById("metodo_pago").value;
  
  if (!metodo_pago) {
    mostrarNotificacion(" Debes seleccionar un método de pago", "error");
    return;
  }
  
  const btnText = document.getElementById("btn-pagar-text");
  const btnLoader = document.getElementById("btn-pagar-loader");
  btnText.style.display = "none";
  btnLoader.style.display = "inline";
  
  try {
    const response = await fetch("/alumno/api/pagar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_pago: parseInt(id_pago),
        metodo_pago
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(" Pago realizado exitosamente", "success");
      cerrarModalPago();
      cargarPagos(); // Recargar la tabla
    } else {
      mostrarNotificacion(" " + (data.error || "Error al procesar el pago"), "error");
    }
  } catch (error) {
    console.error("Error procesando pago:", error);
    mostrarNotificacion(" Error de conexión al procesar el pago", "error");
  } finally {
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
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

// Exponer funciones globalmente para los botones HTML
window.aplicarFiltros = aplicarFiltros;
window.limpiarFiltros = limpiarFiltros;
window.abrirModalPago = abrirModalPago;
window.cerrarModalPago = cerrarModalPago;

function mostrarError(mensaje) {
  const tbody = document.getElementById("pagosTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align: center; padding: 2rem; color: #dc3545;">
         ${mensaje}
      </td>
    </tr>
  `;
}

// Cerrar modal con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModalPago();
  }
});

// Cerrar modal al hacer click fuera
window.addEventListener("click", (e) => {
  const modal = document.getElementById("pagarModal");
  if (e.target === modal) {
    cerrarModalPago();
  }
});
