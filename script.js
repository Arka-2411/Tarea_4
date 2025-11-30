
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const loginSection = document.getElementById('login-wrapper'); 

// Inventario
const dashboardSection = document.getElementById('dashboard-section');
const productForm = document.getElementById('product-form');
const inputNombre = document.getElementById('nombreProducto');
const inputPrecio = document.getElementById('precioProducto');
const inputCategoria = document.getElementById('categoriaProducto');
const tablaCuerpo = document.getElementById('tabla-productos');
const inputIndice = document.getElementById('edit-index');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');

// ==========================================
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuario = usernameInput.value.trim(); 
        const contrasena = passwordInput.value.trim();

        if (usuario === 'Alfredo' && contrasena === '20240050') {
      
            localStorage.setItem('usuarioLogueado', 'true');
            loginError.textContent = '';
            
       
            ingresarAlInventario();
        } else {
            loginError.textContent = '❌ Acceso denegado: Usuario o contraseña incorrectos.';
            passwordInput.value = '';
        }
    });
}

function ingresarAlInventario() {
 
    if(loginSection) loginSection.style.display = 'none';
    
   
    if(dashboardSection) {
        dashboardSection.style.display = 'block'; 
      
        cargarProductos();
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioLogueado');
    location.reload(); 
}


document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('usuarioLogueado') === 'true') {
        ingresarAlInventario();
    }
});





function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    if(tablaCuerpo) {
        tablaCuerpo.innerHTML = ''; // Limpiar tabla
        productos.forEach((producto, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${producto.nombre}</td>
                <td><span style="background:#eef; padding:3px 8px; border-radius:4px;">${producto.categoria}</span></td>
                <td>RD$ ${parseFloat(producto.precio).toFixed(2)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="prepararEdicion(${index})">Editar</button>
                    <button class="action-btn delete-btn" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    }
}

if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const precio = inputPrecio.value.trim();
        const categoria = inputCategoria.value;
        const indice = inputIndice.value;

        let productos = JSON.parse(localStorage.getItem('productos')) || [];

        if (indice === '') {
            // CREAR
            productos.push({ nombre, precio, categoria });
        } else {
            // EDITAR
            productos[indice] = { nombre, precio, categoria };
            cancelarEdicion();
        }

        localStorage.setItem('productos', JSON.stringify(productos));
        cargarProductos();
        productForm.reset();
    });
}


window.eliminarProducto = function(index) {
    if(confirm('¿Seguro que deseas eliminar este producto?')) {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.splice(index, 1);
        localStorage.setItem('productos', JSON.stringify(productos));
        cargarProductos();
        
        // Si borramos el que estábamos editando, cancelar edición
        if(inputIndice.value == index) cancelarEdicion();
    }
};

window.prepararEdicion = function(index) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos[index];

    inputNombre.value = producto.nombre;
    inputPrecio.value = producto.precio;
    inputCategoria.value = producto.categoria;
    inputIndice.value = index;

    btnGuardar.textContent = 'Actualizar Producto';
    btnGuardar.style.backgroundColor = '#ffc107'; 
    btnGuardar.style.color = 'black';
    btnCancelar.classList.remove('hidden');
};

window.cancelarEdicion = function() {
    inputIndice.value = '';
    productForm.reset();
    btnGuardar.textContent = 'Guardar Producto';
    btnGuardar.style.backgroundColor = ''; 
    btnGuardar.style.color = '';
    btnCancelar.classList.add('hidden');
};