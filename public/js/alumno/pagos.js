// Estado de Pagos - Alumno
document.addEventListener('DOMContentLoaded', function() {
  cargarPagos();
});

function cargarPagos() {
  fetch('/alumno/api/pagos')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('pagosTable');
      tbody.innerHTML = '';
      
      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Sin pagos registrados</td></tr>';
        return;
      }

      let totalAdeudado = 0;
      let totalPagado = 0;

      data.forEach(pago => {
        const monto = parseFloat(pago.MONTO) || 0;
        const estado = pago.ESTADO || 'PENDIENTE';
        
        if (estado === 'PAGADO') {
          totalPagado += monto;
        } else if (estado === 'PENDIENTE' || estado === 'VENCIDO') {
          totalAdeudado += monto;
        }

        const estadoClass = `estado-${estado.toLowerCase()}`;
        const fechaVencimiento = pago.FECHA_VENCIMIENTO ? new Date(pago.FECHA_VENCIMIENTO).toLocaleDateString() : '-';
        const fechaPago = pago.FECHA_PAGO ? new Date(pago.FECHA_PAGO).toLocaleDateString() : '-';

        const row = `
          <tr>
            <td>${pago.CONCEPTO || '-'}</td>
            <td>$${monto.toFixed(2)}</td>
            <td>${fechaVencimiento}</td>
            <td>${fechaPago}</td>
            <td><span class="${estadoClass}" style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${estado}</span></td>
            <td>${pago.NUMERO_REFERENCIA || '-'}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });

      // Actualizar resumen
      document.getElementById('totalAdeudado').textContent = '$' + totalAdeudado.toFixed(2);
      document.getElementById('totalPagado').textContent = '$' + totalPagado.toFixed(2);
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('pagosTable').innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error al cargar pagos</td></tr>';
    });
}

// Estilos para estados
const style = document.createElement('style');
style.textContent = `
  .estado-pendiente {
    background: #fff3cd !important;
    color: #856404 !important;
  }
  .estado-pagado {
    background: #d4edda !important;
    color: #155724 !important;
  }
  .estado-vencido {
    background: #f8d7da !important;
    color: #721c24 !important;
  }
`;
document.head.appendChild(style);
