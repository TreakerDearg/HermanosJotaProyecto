// Variables globales
let carrito = [];
let productos = [];

// Inicialización de la app
document.addEventListener('DOMContentLoaded', async function() {
    cargarCarritoDesdeStorage();
    await inicializarApp();
    actualizarNavegacionActiva();
});

// Función principal de inicialización
async function inicializarApp() {
    try {
        if (document.getElementById('featured-products')) {
            await cargarProductosDestacados();
        }

        if (document.getElementById('productos-catalogo')) {
            await cargarCatalogoCompleto();
        }

        if (document.getElementById('producto-detalle')) {
            await cargarDetalleProducto();
        }

        if (document.getElementById('form-contacto')) {
            configurarFormularioContacto();
        }

        configurarCarrito();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

// Cargar productos destacados
async function cargarProductosDestacados() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    container.innerHTML = '<div class="loading">Cargando productos destacados...</div>';

    try {
        const productosDestacados = await obtenerProductosDestacados();
        container.innerHTML = '';

        productosDestacados.forEach(producto => {
            const productoHTML = crearTarjetaProducto(producto);
            container.appendChild(productoHTML);
        });
    } catch (error) {
        container.innerHTML = '<div class="error">Error al cargar productos</div>';
        console.error('Error:', error);
    }
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
    const article = document.createElement('article');
    article.className = 'product-card';

    article.innerHTML = `
        <div class="product-image">${producto.imagen}</div>
        <div class="product-info">
            <h4 class="product-name">${producto.nombre}</h4>
            <p class="product-description">${producto.descripcion}</p>
            <div class="product-price">${formatearPrecio(producto.precio)}</div>
            <a href="detalle.html?id=${producto.id}" class="btn-detalle">Ver Detalle</a>
        </div>
    `;
    return article;
}

// Cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
            actualizarContadorCarrito();
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            carrito = [];
        }
    }
}

// Configurar carrito de compras
function configurarCarrito() {
    cargarCarritoDesdeStorage();
    const carritoIcon = document.querySelector('.cart-icon');
    if (carritoIcon && typeof toggleCarritoPanel === 'function') {
        carritoIcon.addEventListener('click', toggleCarritoPanel);
    }
}

// Añadir producto al carrito
function añadirAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarMensajeCarrito('Producto añadido al carrito');
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Mostrar mensaje del carrito
function mostrarMensajeCarrito(mensaje) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = mensaje;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Formulario de contacto
function configurarFormularioContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';

        if (validarFormularioContacto(nombre, email, mensaje)) {
            mostrarMensajeExito();
            form.reset();
        }
    });
}

// Validar formulario
function validarFormularioContacto(nombre, email, mensaje) {
    let esValido = true;
    if (nombre.length < 2) { mostrarError('nombre', 'El nombre debe tener al menos 2 caracteres'); esValido = false; } else { limpiarError('nombre'); }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { mostrarError('email', 'Por favor ingresa un email válido'); esValido = false; } else { limpiarError('email'); }
    if (mensaje.length < 10) { mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres'); esValido = false; } else { limpiarError('mensaje'); }
    return esValido;
}

// Mostrar error en campo
function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    if (!input) return;
    let errorDiv = document.getElementById(`error-${campo}`);
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = `error-${campo}`;
        errorDiv.className = 'error-message';
        input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = mensaje;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    input.style.borderColor = '#e74c3c';
}

// Limpiar error de campo
function limpiarError(campo) {
    const input = document.getElementById(campo);
    const errorDiv = document.getElementById(`error-${campo}`);
    if (errorDiv) errorDiv.remove();
    if (input) input.style.borderColor = '';
}

// Mensaje de éxito
function mostrarMensajeExito() {
    const form = document.getElementById('form-contacto');
    if (!form) return;
    const mensajeDiv = document.createElement('div');
    mensajeDiv.innerHTML = `
        <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #c3e6cb;">
            <strong>¡Mensaje enviado correctamente!</strong><br>
            Nos pondremos en contacto contigo pronto.
        </div>
    `;
    form.parentNode.insertBefore(mensajeDiv, form);
    setTimeout(() => { mensajeDiv.remove(); }, 5000);
}

// Formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(precio);
}

// Navegación activa
function actualizarNavegacionActiva() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });
}
