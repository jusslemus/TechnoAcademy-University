// Dashboard Alumno
document.addEventListener('DOMContentLoaded', function() {
  cargarDatos();
});

function cargarDatos() {
  // Cargar información del alumno
  /*
  fetch('/api/alumno/info')
    .then(res => res.json())
    .then(data => {
      document.getElementById('carnet').textContent = data.carnet;
      document.getElementById('carrera').textContent = data.carrera;
      document.getElementById('estado').textContent = data.estado;
      document.getElementById('promedio').textContent = data.promedio;
      document.getElementById('creditosMatriculados').textContent = data.creditos;
    })
    .catch(err => console.error('Error:', err));
  */
  
  console.log('Dashboard alumno cargado');
}
