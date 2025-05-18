document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.getElementById('usersTableBody');
    const editForm = document.getElementById('editUserForm');
    let currentEditingCorreo = null;
  
    // Función para cargar usuarios y mostrarlos en la tabla
    async function loadUsers() {
      try {
        const res = await fetch('/users');
        if (!res.ok) throw new Error('Error al cargar usuarios');
        const users = await res.json();
  
        usersTableBody.innerHTML = '';
        users.forEach(user => {
          const tr = document.createElement('tr');
  
          tr.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.correo}</td>
            <td>${user.es_admin ? 'Admin' : 'Usuario'}</td>
            <td>
              <button class="edit-btn" data-correo="${user.correo}">Editar</button>
              <button class="delete-btn" data-correo="${user.correo}">Eliminar</button>
            </td>
          `;
          usersTableBody.appendChild(tr);
        });
  
        attachEventListeners();
      } catch (error) {
        alert(error.message);
      }
    }
  
    // Adjuntar eventos a botones editar y eliminar
    function attachEventListeners() {
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const correo = btn.getAttribute('data-correo');
          startEditUser(correo);
        });
      });
  
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const correo = btn.getAttribute('data-correo');
          deleteUser(correo);
        });
      });
    }
  
    // Iniciar edición del usuario
    async function startEditUser(correo) {
      try {
        const res = await fetch(`/users/${correo}`);
        if (!res.ok) throw new Error('No se encontró el usuario');
        const user = await res.json();
  
        currentEditingCorreo = correo;
        editForm.nombre.value = user.nombre;
        editForm.correo.value = user.correo;
        editForm.es_admin.checked = user.es_admin ? true : false;
        editForm.contraseña.value = ''; // No mostramos la contraseña actual
  
        // Mostrar el formulario de edición (si está oculto)
        editForm.style.display = 'block';
      } catch (error) {
        alert(error.message);
      }
    }
  
    // Guardar cambios del usuario editado
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const nombre = editForm.nombre.value.trim();
      const correo = editForm.correo.value.trim();
      const contraseña = editForm.contraseña.value.trim();
      const es_admin = editForm.es_admin.checked;
  
      if (!nombre || !correo) {
        alert('El nombre y correo son obligatorios');
        return;
      }
  
      try {
        const body = { nombre, es_admin };
        if (contraseña) body.contraseña = contraseña; // Actualiza solo si hay nueva contraseña
  
        const res = await fetch(`/users/${currentEditingCorreo}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
  
        if (!res.ok) throw new Error('Error al actualizar usuario');
  
        alert('Usuario actualizado correctamente');
        editForm.style.display = 'none';
        currentEditingCorreo = null;
        loadUsers();
      } catch (error) {
        alert(error.message);
      }
    });
  
    // Eliminar usuario
    async function deleteUser(correo) {
      if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
  
      try {
        const res = await fetch(`/users/${correo}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar usuario');
        alert('Usuario eliminado correctamente');
        loadUsers();
      } catch (error) {
        alert(error.message);
      }
    }
  
    // Inicialización
    loadUsers();
  });
  