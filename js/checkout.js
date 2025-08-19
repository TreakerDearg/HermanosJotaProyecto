// ==================== VARIABLES ==================== //
let carrito = [];

// Elementos del DOM
const checkoutList = document.getElementById("checkout-list");
const checkoutTotal = document.getElementById("checkout-total");
const btnVolver = document.getElementById("btn-volver");
const btnFinalizar = document.getElementById("btn-finalizar");

// ==================== FUNCIONES ==================== //

// Cargar carrito desde localStorage
function cargarCarrito() {
    const data = localStorage.getItem("carrito");
    if (data) {
        try {
            carrito = JSON.parse(data);
        } catch (error) {
            console.error("Error al parsear carrito:", error);
            carrito = [];
        }
    } else {
        carrito = [];
    }
}

// Renderizar los productos en checkout
function renderizarCheckout() {
    checkoutList.innerHTML = "";

    if (carrito.length === 0) {
        checkoutList.innerHTML = `<p class="empty">Tu carrito está vacío.</p>`;
        checkoutTotal.textContent = "$0";
        btnFinalizar.disabled = true;
        return;
    }

    let total = 0;

    carrito.forEach((producto) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const item = document.createElement("li");
        item.classList.add("checkout-item");

        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="checkout-item-info">
                <span>${producto.nombre}</span>
                <span>Cantidad: ${producto.cantidad}</span>
            </div>
            <div class="checkout-item-price">
                <span>$${subtotal}</span>
            </div>
        `;

        checkoutList.appendChild(item);
    });

    checkoutTotal.textContent = `$${total}`;
}

// ==================== EVENTOS ==================== //

// Botón volver al listado de productos
btnVolver.addEventListener("click", () => {
    window.location.href = "productos.html";
});

// Botón finalizar compra
btnFinalizar.addEventListener("click", () => {
    alert("¡Gracias por tu compra! Esta es solo una demostración.");
    localStorage.removeItem("carrito");
    window.location.href = "index.html";
});

// Inicializar página
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    renderizarCheckout();
});
