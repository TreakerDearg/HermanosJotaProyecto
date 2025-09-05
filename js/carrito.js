// ==================== VARIABLES ==================== //
let carrito = [];

// Elementos del DOM
const contadorCarrito = document.getElementById("contador-carrito");
const modalCarrito = document.getElementById("modal-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const btnCarritoHeader = document.getElementById("btn-carrito");
const btnCerrarCarrito = document.getElementById("cerrar-carrito");
const btnPagar = document.getElementById("btn-pagar");
const toast = document.getElementById("toast");

// ==================== FUNCIONES ==================== //

// Guardar carrito en LocalStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar carrito desde LocalStorage
function cargarCarrito() {
    const data = localStorage.getItem("carrito");
    if (data) {
        try {
            carrito = JSON.parse(data);
        } catch (error) {
            console.error("Error al parsear carrito:", error);
            carrito = [];
        }
        actualizarContador();
    }
}

// Actualizar contador en header
function actualizarContador() {
    let totalCantidad = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    contadorCarrito.textContent = totalCantidad;
}

// Mostrar toast notification con imagen y nombre del producto
function mostrarToast(producto) {
    toast.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-12 h-12 rounded">
        <div class="ml-2">
            <span class="font-semibold">${producto.nombre}</span>
            <span class="block text-sm">$${producto.precio}</span>
        </div>
    `;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// Añadir producto al carrito
function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);

    if (existe) {
        existe.cantidad += 1; // Incrementa la cantidad si ya existe
    } else {
        carrito.push({...producto, cantidad: 1}); // Agrega producto con cantidad 1
    }

    actualizarContador();
    mostrarToast(producto);
    guardarCarrito();
    renderizarCarrito();
}

// Renderizar carrito en el modal
function renderizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        totalCarrito.textContent = "$0";
        return;
    }

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const li = document.createElement("li");
        li.classList.add("flex", "justify-between", "items-center", "border-b", "py-2");
        li.innerHTML = `
            <span>${producto.nombre} (x${producto.cantidad})</span>
            <span>$${subtotal}</span>
            <button class="text-red-600 font-bold ml-2" data-index="${index}">X</button>
        `;
        listaCarrito.appendChild(li);
    });

    totalCarrito.textContent = `$${total}`;

    // Eventos para eliminar productos
        listaCarrito.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                const producto = carrito[index];
                const confirmar = confirm(`¿Seguro que deseas eliminar \"${producto.nombre}\" del carrito?`);
                if (confirmar) {
                    carrito.splice(index, 1);
                    actualizarContador();
                    guardarCarrito();
                    renderizarCarrito();
                }
            });
        });
}

// Abrir modal del carrito
function abrirCarrito() {
    modalCarrito.classList.remove("hidden");
    modalCarrito.classList.add("flex");
    renderizarCarrito();
}

// Cerrar modal del carrito
function cerrarCarrito() {
    modalCarrito.classList.add("hidden");
    modalCarrito.classList.remove("flex");
}

// ==================== EVENTOS ==================== //

// Abrir carrito desde header
btnCarritoHeader.addEventListener("click", abrirCarrito);

// Cerrar modal del carrito
btnCerrarCarrito.addEventListener("click", cerrarCarrito);

// Redirigir a checkout
btnPagar.addEventListener("click", () => {
    window.location.href = "checkout.html";
});

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    renderizarCarrito();
});
