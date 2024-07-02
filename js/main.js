localStorage.removeItem("compra-pendiente");

let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

// definimos las variables que vamos a usar 
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

const ordenarPrecio = document.querySelector("#ordenar-precio");
const precioMin = document.querySelector("#precio-min");
const precioMax = document.querySelector("#precio-max");
const talle = document.querySelector("#talle");
const color = document.querySelector("#color");
const botonFiltrar = document.querySelector("#aplicar-filtros");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


// cargamos los productos a la pagina
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <p class="producto-color">Color: ${producto.color}</p>
                <p class="producto-talles">Talles: ${producto.talles.join(", ")}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}

// aplicamos la distribucion por categorias
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
});

// logica para el boton de agregar para cada producto
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

// ageregamos los productos seleccionados al apartado carrito
function agregarAlCarrito(e) {
    Toastify({
        text: '<i class="bi bi-check-circle"></i>&nbsp; Producto agregado',
        duration: 2000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        escapeMarkup: false,
        style: {
            background: "linear-gradient(to right, #5a3e36, #af662e)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem",
            color: "#f5f5dc",
            display: "flex",
            alignItems: "center"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem'
        },
        onClick: function(){} 
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// actualizamos el contador de productos seleccionados para comprar
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


/* apartado de fltros */

// definimos variables para el apartado de filtros
const toggleFiltros = document.querySelector("#toggle-filtros");
const toggleFiltrosText = document.querySelector("#toggle-filtros-text");
const filtros = document.querySelector("#filtros");

// animaciones para mostrar o no el apartado de filtros 
toggleFiltros.addEventListener("click", () => {
    filtros.classList.toggle("oculto");
    if (filtros.classList.contains("oculto")) {
        toggleFiltrosText.textContent = "Mostrar Filtros";
        toggleFiltros.innerHTML = '<i class="bi bi-funnel"></i> Mostrar Filtros';
    } else {
        toggleFiltrosText.textContent = "Ocultar Filtros";
        toggleFiltros.innerHTML = '<i class="bi bi-funnel"></i> Ocultar Filtros';
    }
});

document.querySelector("#aplicar-filtros").addEventListener("click", aplicarFiltros);

// funcion para evaluar y aplicar los filtros
function aplicarFiltros() {
    const min = parseFloat(precioMin.value) || 0;
    const max = parseFloat(precioMax.value) || Infinity;
    const talleSeleccionado = talle.value;
    const colorSeleccionado = color.value;
    const ordenSeleccionado = ordenarPrecio.value;

    let productosFiltrados = productos.filter(producto => {
        const cumplePrecio = producto.precio >= min && producto.precio <= max;
        const cumpleTalle = talleSeleccionado === "" || producto.talles.includes(talleSeleccionado);
        const cumpleColor = colorSeleccionado === "" || producto.color === colorSeleccionado;
        return cumplePrecio && cumpleTalle && cumpleColor;
    });

    if (ordenSeleccionado === "menor") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenSeleccionado === "mayor") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }
    cargarProductos(productosFiltrados);
}


// Funcinalidad para que le index sea responsivo
const menuButton = document.querySelector('.menu-button');
const closeMenuButton = document.querySelector('.close-menu');
const aside = document.querySelector('aside');

menuButton.addEventListener('click', () => {
    aside.classList.add('visible');
});

closeMenuButton.addEventListener('click', () => {
    aside.classList.remove('visible');
});
