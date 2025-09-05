// Contenedor de productos y buscador
const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");

// Función para renderizar productos en la página con manejo de errores
function renderizarProductos(lista) {
    try {
        contenedorProductos.innerHTML = ""; // Limpiar contenedor

        if (!Array.isArray(lista)) throw new Error("La lista de productos no es válida.");

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
    } catch (error) {
        console.error("Error al renderizar productos:", error);
        contenedorProductos.innerHTML = `<p class="text-center text-red-600 col-span-full">Error al mostrar productos.</p>`;
    }
}

// Función para filtrar productos con manejo de errores
function filtrarProductos() {
    try {
        const texto = buscador.value.toLowerCase();
        const filtrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(texto) ||
            producto.descripcion.toLowerCase().includes(texto)
        );
        renderizarProductos(filtrados);
    } catch (error) {
        console.error("Error al filtrar productos:", error);
        contenedorProductos.innerHTML = `<p class="text-center text-red-600 col-span-full">Error al buscar productos.</p>`;
    }
}

// Evento para búsqueda en tiempo real
buscador.addEventListener("input", filtrarProductos);

// Simular carga asíncrona con manejo de errores
function cargarProductos() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if (!productos || productos.length === 0) throw new Error("No se encontraron productos en la base de datos.");
                resolve(productos); // productos viene de data.js
            } catch (error) {
                reject(error);
            }
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
