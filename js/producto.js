// Obtener ID del producto desde URL
const urlParams = new URLSearchParams(window.location.search);
const idProducto = parseInt(urlParams.get('id'));

// Elementos
const nombreProducto = document.getElementById("nombre-producto");
const descripcionProducto = document.getElementById("descripcion-producto");
const detallesProducto = document.getElementById("detalles-producto");
const precioProducto = document.getElementById("precio-producto");
const imagenProducto = document.getElementById("imagen-producto");
const btnAgregarCarrito = document.getElementById("btn-agregar-carrito");

// Función para mostrar toast
function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");
    setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
    }, 2000);
}

// Cargar información del producto
function cargarDetalle() {
    const producto = productos.find(p => p.id === idProducto);

    if (!producto) {
        nombreProducto.textContent = "Producto no encontrado";
        descripcionProducto.textContent = "";
        detallesProducto.textContent = "";
        precioProducto.textContent = "";
        imagenProducto.innerHTML = "";
        btnAgregarCarrito.style.display = "none";
        return;
    }

    nombreProducto.textContent = producto.nombre;
    descripcionProducto.textContent = producto.descripcion;
    detallesProducto.textContent = producto.detalles || "Sin detalles adicionales.";
    precioProducto.textContent = `$${producto.precio}`;
    imagenProducto.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}" class="w-full rounded-xl shadow-lg">`;

    // Remover cualquier listener previo para evitar duplicados
    const nuevoBoton = btnAgregarCarrito.cloneNode(true);
    btnAgregarCarrito.parentNode.replaceChild(nuevoBoton, btnAgregarCarrito);

    // Agregar al carrito
    nuevoBoton.addEventListener("click", () => {
        agregarAlCarrito(producto);
        mostrarToast(`${producto.nombre} añadido al carrito`);
    });
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", cargarDetalle);
