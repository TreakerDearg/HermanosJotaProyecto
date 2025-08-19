// js/main.js

// Función para obtener productos destacados (simula carga asíncrona)
function obtenerDestacados() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const destacados = productos.filter(producto => producto.destacado);
            resolve(destacados);
        }, 1000); // simulamos 1 segundo de carga
    });
}

// Función para renderizar productos en el DOM
function renderizarDestacados() {
    const contenedor = document.getElementById("destacados");

    obtenerDestacados()
        .then(destacados => {
            destacados.forEach(producto => {
                const card = document.createElement("div");
                card.classList.add("producto-card");

                card.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="shadow-md">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">$${producto.precio}</p>
                    <div class="flex justify-center mt-2 space-x-2">
                        <a href="producto.html?id=${producto.id}" class="btn">Ver Detalle</a>
                        <button class="btn agregar-carrito" data-product='${JSON.stringify(producto)}'>Añadir al Carrito</button>
                    </div>
                `;

                contenedor.appendChild(card);
            });

            // Asignar eventos de agregar al carrito después de renderizar
            document.querySelectorAll(".agregar-carrito").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const producto = JSON.parse(e.target.dataset.product);
                    agregarAlCarrito(producto);
                });
            });

        })
        .catch(error => {
            contenedor.innerHTML = "<p>Error al cargar productos destacados.</p>";
            console.error(error);
        });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarDestacados();
});
