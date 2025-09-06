// Contenedor de productos y buscador
const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");

// Función para renderizar productos en la página
function renderizarProductos(lista) {
    try {
        contenedorProductos.innerHTML = "";

        if (!Array.isArray(lista)) throw new Error("La lista de productos no es válida.");

        if (lista.length === 0) {
            contenedorProductos.innerHTML = `<p class="text-center text-maderaMedio col-span-full">No se encontraron productos.</p>`;
            return;
        }

        lista.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add(
                "bg-white", "rounded-xl", "shadow-md", "hover:shadow-lg",
                "flex", "flex-col", "transition", "duration-300",
                "overflow-hidden", "border", "border-gray-200"
            );

            card.innerHTML = `
                <div class="overflow-hidden">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4 flex flex-col flex-1 justify-between">
                    <h3 class="text-lg font-semibold text-maderaOscuro mb-2 line-clamp-2">${producto.nombre}</h3>
                    <p class="text-maderaMedio text-sm mb-2 line-clamp-3">${producto.descripcion}</p>
                    <p class="text-xl font-bold text-maderaOscuro mb-4">$${producto.precio}</p>
                    <div class="flex justify-between items-center">
                        <a href="producto.html?id=${producto.id}" class="bg-maderaOscuro text-beige px-4 py-2 rounded hover:bg-maderaMedio transition w-1/2 text-center">Ver Detalle</a>
                        <button class="bg-maderaMedio text-beige px-4 py-2 rounded hover:bg-maderaOscuro transition w-1/2 ml-2" onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Añadir</button>
                    </div>
                </div>
            `;

            contenedorProductos.appendChild(card);
        });

    } catch (error) {
        console.error("Error al renderizar productos:", error);
        contenedorProductos.innerHTML = `<p class="text-center text-red-600 col-span-full">Error al mostrar productos.</p>`;
    }
}

// Filtrar productos en tiempo real
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

buscador.addEventListener("input", filtrarProductos);

// Simular carga asíncrona
function cargarProductos() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if (!productos || productos.length === 0) throw new Error("No se encontraron productos en la base de datos.");
                resolve(productos);
            } catch (error) {
                reject(error);
            }
        }, 500);
    });
}

// Inicializar página
document.addEventListener("DOMContentLoaded", async () => {
    try {
        contenedorProductos.innerHTML = `<p class="text-center text-maderaMedio col-span-full animate-pulse">Cargando productos...</p>`;
        const lista = await cargarProductos();
        renderizarProductos(lista);
    } catch (error) {
        contenedorProductos.innerHTML = `<p class="text-center text-red-600">Error al cargar productos.</p>`;
        console.error(error);
    }
});
