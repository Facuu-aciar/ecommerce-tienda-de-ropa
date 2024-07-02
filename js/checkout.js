let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const compraPendiente = localStorage.getItem("compra-pendiente");

if (!compraPendiente || productosEnCarrito.length === 0) {
    window.location.href = "index.html";
}

const contenedorProductosCheckout = document.querySelector("#productos-checkout");
const contenedorTotal = document.querySelector("#total-checkout");

// cargamos los productos para poder verlos en el resumen
function cargarProductosCheckout() {
    contenedorProductosCheckout.innerHTML = "";
    productosEnCarrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto-checkout");
        div.innerHTML = `
            <p>${producto.titulo} x ${producto.cantidad}  <i class="bi bi-arrow-right"></i>  $${producto.precio * producto.cantidad}</p>
        `;
        contenedorProductosCheckout.append(div);
    });
    actualizarTotal();
}

cargarProductosCheckout();

// actualizacion del total si se agrega un producto
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

const formulario = document.querySelector("#checkout-form");
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    // animaciones 
    Swal.fire({
        title: '¿Confirmar compra?',
        text: "Una vez confirmada, no podrás modificar tu pedido.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5a3e36', 
        cancelButtonColor: '#5a3e36' , 
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        background: '#f5f5dc', 
        color: '#5a3e36', 
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("productos-en-carrito");
            localStorage.removeItem("compra-pendiente");
            Swal.fire({
                title: '¡Compra realizada!',
                text: 'Tu pedido ha sido procesado con éxito. Muchas gracias por su compra',
                icon: 'success',
                confirmButtonColor: '#5a3e36',
                background: '#f5f5dc',
                color: '#5a3e36',
            }).then(() => {
                window.location.href = "index.html";
            });
        }
    });
});

// efecto de "/" automatico en fecha de nacimiento
document.getElementById('fecha-nacimiento').addEventListener('input', function (e) {
    let input = this.value.replace(/\D/g, '');
    if (input.length > 4) {
        input = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
    } else if (input.length > 2) {
        input = input.substring(0, 2) + '/' + input.substring(2);
    }
    this.value = input;
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

document.getElementById('fecha-nacimiento').addEventListener('input', function (e) {
    let input = this.value.replace(/\D/g, '');
    if (input.length > 4) {
        input = input.substring(0, 2) + '/' + input.substring(2, 4) + '/' + input.substring(4, 8);
    } else if (input.length > 2) {
        input = input.substring(0, 2) + '/' + input.substring(2);
    }
    this.value = input;
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

// efecto de autoespacio cada 4 numeros en numero de tarjeta
document.getElementById('tarjeta').addEventListener('input', function (e) {
    let cardNumber = this.value.replace(/\D/g, '');
    cardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.value = cardNumber;
    if (this.value.length > 19) {
        this.value = this.value.slice(0, 19);
    }
});

// efecto de "/" automatico en fecha de vencimiento de la tarjeta
document.getElementById('fecha-vencimiento').addEventListener('input', function (e) {
    var input = e.target;
    var value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
});