// Dashboard común - Mostrar información del usuario
document.addEventListener('DOMContentLoaded', function() {
  // Aquí se podrían cargar datos del usuario actual
  console.log('Dashboard cargado');
  
  // Ejemplo: cargar datos vía fetch
  /*
  fetch('/api/usuario/info')
    .then(res => res.json())
    .then(data => {
      document.getElementById('userID').textContent = data.id;
      document.getElementById('userName').textContent = data.nombre_usuario;
      document.getElementById('userType').textContent = data.tipo_usuario;
    })
    .catch(err => console.error('Error:', err));
  */
});
