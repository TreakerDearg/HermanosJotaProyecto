// Variables globales
let carrito = [];
let productos = [];

// Cargar carrito desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarCarritoDesdeStorage();
});

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', async function() {
    await inicializarApp();
});

// Función principal de inicialización
async function inicializarApp() {
    try {
        // Cargar productos destacados en la página de inicio
        if (document.getElementById('featured-products')) {
            await cargarProductosDestacados();
        }

        // Cargar todos los productos en la página de catálogo
        if (document.getElementById('productos-catalogo')) {
            await cargarCatalogoCompleto();
        }

        // Cargar detalle de producto si estamos en esa página
        if (document.getElementById('producto-detalle')) {
            await cargarDetalleProducto();
        }

        // Configurar formulario de contacto si existe
        if (document.getElementById('form-contacto')) {
            configurarFormularioContacto();
        }

        // Configurar eventos del carrito
        configurarCarrito();

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
}

// Cargar productos destacados en la página de inicio
async function cargarProductosDestacados() {
    const container = document.getElementById('featured-products');

    // Mostrar mensaje de carga
    container.innerHTML = '<div class="loading">Cargando productos destacados...</div>';

    try {
        const productosDestacados = await obtenerProductosDestacados();

        // Limpiar container
        container.innerHTML = '';

        // Renderizar productos
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
    <a href="detalle.html?id=1" class="btn-detalle">Ver Detalle</a>


    article.innerHTML = `
        <div class="product-image">${producto.imagen}</div>
        <div class="product-info">
            <h4 class="product-name">${producto.nombre}</h4>
            <p class="product-description">${producto.descripcion}</p>
            <div class="product-price">$${producto.precio.toLocaleString()}</div>
        </div>
    `;

    return article;
}

// Navegar al detalle del producto
function irADetalleProducto(id) {
    // Guardar el ID del producto en localStorage
    localStorage.setItem('productoSeleccionado', id);
    window.location.href = 'producto.html';
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

    // Configurar evento click en el icono del carrito
    const carritoIcon = document.querySelector('.cart-icon');
    if (carritoIcon) {
        carritoIcon.addEventListener('click', function() {
            if (typeof toggleCarritoPanel === 'function') {
                toggleCarritoPanel();
            }
        });
    }
}

// Añadir producto al carrito
function añadirAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar contador
    actualizarContadorCarrito();

    // Mostrar feedback visual
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
    // Crear elemento de mensaje temporal
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

    // Remover después de 3 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Configurar formulario de contacto
function configurarFormularioContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validar formulario
        if (validarFormularioContacto(nombre, email, mensaje)) {
            // Simular envío exitoso
            mostrarMensajeExito();
            form.reset();
        }
    });
}

// Validar formulario de contacto
function validarFormularioContacto(nombre, email, mensaje) {
    let esValido = true;

    // Validar nombre
    if (nombre.length < 2) {
        mostrarError('nombre', 'El nombre debe tener al menos 2 caracteres');
        esValido = false;
    } else {
        limpiarError('nombre');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarError('email', 'Por favor ingresa un email válido');
        esValido = false;
    } else {
        limpiarError('email');
    }

    // Validar mensaje
    if (mensaje.length < 10) {
        mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
        esValido = false;
    } else {
        limpiarError('mensaje');
    }

    return esValido;
}

// Mostrar error en campo
function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const errorDiv = document.getElementById(`error-${campo}`) || document.createElement('div');

    errorDiv.id = `error-${campo}`;
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';

    if (!document.getElementById(`error-${campo}`)) {
        input.parentNode.appendChild(errorDiv);
    }

    input.style.borderColor = '#e74c3c';
}

// Limpiar error de campo
function limpiarError(campo) {
    const input = document.getElementById(campo);
    const errorDiv = document.getElementById(`error-${campo}`);

    if (errorDiv) {
        errorDiv.remove();
    }

    input.style.borderColor = '';
}

// Mostrar mensaje de éxito
function mostrarMensajeExito() {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.innerHTML = `
        <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #c3e6cb;">
            <strong>¡Mensaje enviado correctamente!</strong><br>
            Nos pondremos en contacto contigo pronto.
        </div>
    `;

    const form = document.getElementById('form-contacto');
    form.parentNode.insertBefore(mensajeDiv, form);

    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.remove();
    }, 5000);
}

// Funciones de utilidad
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(precio);
}

// Manejar navegación activa
function actualizarNavegacionActiva() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', actualizarNavegacionActiva);