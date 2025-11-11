// Inscripciones Alumno
document.addEventListener('DOMContentLoaded', function() {
  cargarInscripciones();
});

function cargarInscripciones() {
  /*
  fetch('/api/alumno/inscripciones')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('inscripcionesTable');
      tbody.innerHTML = '';
      
      data.forEach(inscripcion => {
        const row = `
          <tr>
            <td>${inscripcion.codigo}</td>
            <td>${inscripcion.materia}</td>
            <td>${inscripcion.seccion}</td>
            <td>${inscripcion.docente}</td>
            <td>${inscripcion.horario}</td>
            <td><span class="badge">${inscripcion.estado}</span></td>
            <td>
              <button onclick="retirarMateria(${inscripcion.id})">Retirar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(err => console.error('Error:', err));
  */
  
  console.log('Inscripciones cargadas');
}

function retirarMateria(id) {
  if (confirm('¿Está seguro de que desea retirarse de esta materia?')) {
    // Enviar solicitud al backend
    console.log('Retirando materia:', id);
  }
}
