// ============================================
// GESTIONAR USUARIOS - TECHNOACADEMY
// ============================================

let todosLosUsuarios = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
  cargarUsuarios();
  
  // Event Listeners
  document.getElementById('userForm').addEventListener('submit', crearUsuario);
  document.getElementById('editForm').addEventListener('submit', guardarEdicion);
  document.getElementById('searchInput').addEventListener('input', filtrarUsuarios);
  document.getElementById('cambiar_contrasena').addEventListener('change', togglePasswordField);
});

// ===== CARGAR USUARIOS =====
async function cargarUsuarios() {
  try {
    const response = await fetch('/admin/api/usuarios');
    const data = await response.json();
    
    todosLosUsuarios = data;
    mostrarUsuarios(data);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    document.getElementById('usuariosTable').innerHTML = 
      '<tr><td colspan="7" style="text-align: center; color: #dc3545;"> Error al cargar usuarios</td></tr>';
  }
}

// ===== MOSTRAR USUARIOS EN TABLA =====
function mostrarUsuarios(usuarios) {
  const tbody = document.getElementById('usuariosTable');
  
  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay usuarios registrados</td></tr>';
    return;
  }
  
  tbody.innerHTML = usuarios.map(usuario => {
    const fechaCreacion = usuario.FECHA_CREACION 
      ? new Date(usuario.FECHA_CREACION).toLocaleDateString('es-ES') 
      : '-';
    const ultimoAcceso = usuario.ULTIMO_ACCESO 
      ? new Date(usuario.ULTIMO_ACCESO).toLocaleDateString('es-ES') + ' ' + 
        new Date(usuario.ULTIMO_ACCESO).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})
      : 'Nunca';
    
    const badgeClass = usuario.ESTADO === 'ACTIVO' ? 'badge-success' : 'badge-inactive';
    const icono = usuario.TIPO_USUARIO === 'ADMIN' ? '' : '';
    const color = usuario.TIPO_USUARIO === 'ADMIN' ? '#1e3c72' : '#2a5298';
    
    return `
      <tr>
        <td>${usuario.ID_USUARIO}</td>
        <td><strong>${usuario.NOMBRE_USUARIO}</strong></td>
        <td><span style="color: ${color}">${icono} ${usuario.TIPO_USUARIO}</span></td>
        <td><span class="badge ${badgeClass}">${usuario.ESTADO}</span></td>
        <td>${fechaCreacion}</td>
        <td>${ultimoAcceso}</td>
        <td>
          <button class="btn btn-small btn-warning" onclick="abrirModalEditar(${usuario.ID_USUARIO}, '${usuario.NOMBRE_USUARIO}', '${usuario.TIPO_USUARIO}')">
             Editar
          </button>
          <button class="btn btn-small btn-danger" onclick="eliminarUsuario(${usuario.ID_USUARIO}, '${usuario.NOMBRE_USUARIO}')">
             Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== CREAR USUARIO =====
async function crearUsuario(e) {
  e.preventDefault();
  
  const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
  const contrasena = document.getElementById('contrasena').value;
  const confirmar = document.getElementById('confirmar_contrasena').value;
  const tipo_usuario = document.getElementById('tipo_usuario').value;
  
  // Validaciones
  if (!tipo_usuario) {
    mostrarNotificacion('Debe seleccionar un tipo de usuario', 'error');
    return;
  }
  
  if (contrasena !== confirmar) {
    mostrarNotificacion('Las contraseñas no coinciden', 'error');
    return;
  }
  
  if (contrasena.length < 6) {
    mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  // Mostrar loader
  const btnText = document.getElementById('btn-crear-text');
  const btnLoader = document.getElementById('btn-crear-loader');
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  
  try {
    const response = await fetch('/admin/api/usuarios/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre_usuario,
        contrasena,
        tipo_usuario
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(' Usuario creado exitosamente', 'success');
      document.getElementById('userForm').reset();
      cargarUsuarios();
    } else {
      mostrarNotificacion(' ' + (data.error || 'Error al crear usuario'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion(' Error de conexión al crear usuario', 'error');
  } finally {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

// ===== ABRIR MODAL EDITAR =====
function abrirModalEditar(id, nombre, tipo) {
  document.getElementById('edit_id_usuario').value = id;
  document.getElementById('edit_nombre_usuario').value = nombre;
  document.getElementById('edit_tipo_usuario').value = tipo;
  document.getElementById('cambiar_contrasena').checked = false;
  document.getElementById('password-fields').style.display = 'none';
  document.getElementById('edit_nueva_contrasena').value = '';
  
  document.getElementById('editModal').style.display = 'flex';
}

// ===== CERRAR MODAL =====
function cerrarModal() {
  document.getElementById('editModal').style.display = 'none';
}

// ===== TOGGLE PASSWORD FIELD =====
function togglePasswordField() {
  const checkbox = document.getElementById('cambiar_contrasena');
  const passwordFields = document.getElementById('password-fields');
  const passwordInput = document.getElementById('edit_nueva_contrasena');
  
  if (checkbox.checked) {
    passwordFields.style.display = 'block';
    passwordInput.required = true;
  } else {
    passwordFields.style.display = 'none';
    passwordInput.required = false;
    passwordInput.value = '';
  }
}

// ===== GUARDAR EDICIÓN =====
async function guardarEdicion(e) {
  e.preventDefault();
  
  const id_usuario = document.getElementById('edit_id_usuario').value;
  const nombre_usuario = document.getElementById('edit_nombre_usuario').value.trim();
  const tipo_usuario = document.getElementById('edit_tipo_usuario').value;
  const cambiarPassword = document.getElementById('cambiar_contrasena').checked;
  const nueva_contrasena = document.getElementById('edit_nueva_contrasena').value;
  
  const data = {
    nombre_usuario,
    tipo_usuario
  };
  
  if (cambiarPassword) {
    if (nueva_contrasena.length < 6) {
      mostrarNotificacion('La nueva contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    data.contrasena = nueva_contrasena;
  }
  
  try {
    const response = await fetch(`/admin/api/usuarios/${id_usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      mostrarNotificacion(' Usuario actualizado exitosamente', 'success');
      cerrarModal();
      cargarUsuarios();
    } else {
      mostrarNotificacion(' ' + (result.error || 'Error al actualizar usuario'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion(' Error de conexión al actualizar usuario', 'error');
  }
}

// ===== ELIMINAR USUARIO =====
async function eliminarUsuario(id, nombre) {
  if (!confirm(`¿Está seguro de eliminar el usuario "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }
  
  try {
    const response = await fetch(`/admin/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      mostrarNotificacion(' Usuario eliminado exitosamente', 'success');
      cargarUsuarios();
    } else {
      mostrarNotificacion(' ' + (data.error || 'Error al eliminar usuario'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion(' Error de conexión al eliminar usuario', 'error');
  }
}

// ===== FILTRAR USUARIOS =====
function filtrarUsuarios() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  const usuariosFiltrados = todosLosUsuarios.filter(usuario => 
    usuario.NOMBRE_USUARIO.toLowerCase().includes(searchTerm) ||
    usuario.TIPO_USUARIO.toLowerCase().includes(searchTerm)
  );
  
  mostrarUsuarios(usuariosFiltrados);
}

// ===== MOSTRAR NOTIFICACIÓN =====
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = mensaje;
  notification.className = `notification ${tipo}`;
  notification.style.display = 'block';
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
  
  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModal();
  }
});

// Cerrar modal al hacer click fuera
window.addEventListener('click', (e) => {
  const modal = document.getElementById('editModal');
  if (e.target === modal) {
    cerrarModal();
  }
});
