// Gestionar Usuarios - Admin
document.addEventListener('DOMContentLoaded', function() {
  cargarUsuarios();
});

function cargarUsuarios() {
  /*
  fetch('/api/admin/usuarios')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('usuariosTable');
      tbody.innerHTML = '';
      
      data.forEach(usuario => {
        const row = `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre_usuario}</td>
            <td>${usuario.tipo_usuario}</td>
            <td>
              <button onclick="editarUsuario(${usuario.id})">Editar</button>
              <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(err => console.error('Error:', err));
  */
  
  console.log('Usuarios cargados');
}

function editarUsuario(id) {
  console.log('Editando usuario:', id);
}

function eliminarUsuario(id) {
  if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
    console.log('Eliminando usuario:', id);
  }
}
