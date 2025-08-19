// Contenedor de productos y buscador
const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");

// Función para renderizar productos en la página
function renderizarProductos(lista) {
    contenedorProductos.innerHTML = ""; // Limpiar contenedor

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `<p class="text-center text-maderaMedio col-span-full">No se encontraron productos.</p>`;
        return;
    }

    lista.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add(
            "bg-beige", "rounded-xl", "shadow-lg", "p-4",
            "flex", "flex-col", "justify-between", "hover:shadow-2xl",
            "transition", "duration-300"
        );

        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="rounded-lg mb-4 h-48 object-cover">
            <h3 class="text-xl font-semibold text-maderaOscuro mb-2">${producto.nombre}</h3>
            <p class="text-maderaMedio mb-4 text-sm">${producto.descripcion}</p>
            <p class="font-bold text-maderaOscuro mb-4">$${producto.precio}</p>
            <div class="flex justify-between items-center">
                <a href="producto.html?id=${producto.id}" class="bg-maderaOscuro text-beige px-3 py-1 rounded hover:bg-maderaMedio transition">Ver Detalle</a>
                <button class="bg-maderaMedio text-beige px-3 py-1 rounded hover:bg-maderaOscuro transition" onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Añadir al Carrito</button>
            </div>
        `;

        contenedorProductos.appendChild(card);
    });
}

// Función para filtrar productos según el buscador
function filtrarProductos() {
    const texto = buscador.value.toLowerCase();
    const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto)
    );
    renderizarProductos(filtrados);
}

// Evento para búsqueda en tiempo real
buscador.addEventListener("input", filtrarProductos);

// Simular carga asíncrona
function cargarProductos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productos); // productos viene de data.js
        }, 500); // medio segundo de simulación
    });
}

// Inicializar página
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const lista = await cargarProductos();
        renderizarProductos(lista);
    } catch (error) {
        contenedorProductos.innerHTML = `<p class="text-center text-red-600">Error al cargar productos.</p>`;
        console.error(error);
    }
});
