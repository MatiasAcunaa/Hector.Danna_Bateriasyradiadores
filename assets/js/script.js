let productosJSON = [];
let totalCarrito; 
let contenedor = document.getElementById ("contenedorCardsProductos");
let botonFinalizar = document.getElementById ("botonFinalizarCompra");
let carrito = JSON.parse (localStorage.getItem ("carrito")) || [];

(carrito.length != 0) && dibujarTabla();

//Luxon
const DateTime = luxon.DateTime;
const ahora = DateTime.now();

function dibujarTabla (){

  for(const producto of carrito){
    document.getElementById("tablaBody").innerHTML += `
    
    <tr>
      <td> ${producto.id} </td>
      <td> ${producto.nombre} </td>
      <td> ${producto.precio} </td>
      <td> <button class = "btn btn-light" onclick = "eliminar(event)">🗑️</button></td>
    </tr>
    
    `;
  }
  totalCarrito = carrito.reduce ((acumulador, producto)=> acumulador + producto.precio,0);
  let infoTotal = document.getElementById ("total");
  infoTotal.innerText = "Total a pagar $: " + totalCarrito;

};

function renderizarProds(){

  for (const producto of productosJSON){
    contenedor.innerHTML += `

    <div class="col-xl-4 col-md-6">
    <div class="post-item position-relative h-100">

      <div class="post-img position-relative overflow-hidden">
        <img src=${producto.foto} class="img-fluid" alt="">
        <span class="post-date">En stock</span>
      </div>

      <div class="post-content d-flex flex-column">
        <h3 class="post-title">${producto.nombre}</h3>
        <p>
          ${producto.precio}
        </p>
        <button id= "btn ${producto.id}" class="btn btn-warning">Agregar 
        al carrito</></button>
      </div>

    </div>
  </div>

    `;
  }

  //Eventos

  productosJSON.forEach (producto => {
    //evento para cada boton
    document.getElementById (`btn ${producto.id}`).addEventListener ("click",function(){
      agregarAlCarrito (producto);
    });
  });

};

function agregarAlCarrito (productoComprado) {
  carrito.push(productoComprado);
  console.table(carrito);
  Swal.fire ({
    title: productoComprado.nombre,
    text: 'Agregado al carrito',
    imageUrl: productoComprado.foto,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: productoComprado.nombre,
    showConfirmButton: false,
    timer: 1500
  })
  document.getElementById("tablaBody").innerHTML += `

  <tr>
    <td> ${productoComprado.id} </td>
    <td> ${productoComprado.nombre} </td>
    <td> ${productoComprado.precio} </td>
    <td> <button class = "btn btn-light" onclick = "eliminar(event)">🗑️</button></td>
  </tr>

  `;
  totalCarrito = carrito.reduce ((acumulador, producto)=> acumulador + producto.precio,0);
  let infoTotal = document.getElementById ("total");
  infoTotal.innerText ="Total a pagar $: " + totalCarrito;

  //Storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

function eliminar(ev){
  console.log(ev);
  let fila = ev.target.parentElement.parentElement;
  console.log(fila);
  let id = fila.children [0].innerText;
  console.log (id);
  let indice = carrito.findIndex (producto => producto.id == id);
  console.log(indice);

  carrito.splice (indice,1);
  console.table (carrito);

  fila.remove();

  let preciosAcumulados = carrito.reduce ((acumulador, producto) => acumulador + producto.precio,0);
  total.innerText = "Total a pagar $: " + preciosAcumulados;

  localStorage.setItem ("carrito", JSON.stringify (carrito));

};

//Gestion de productos JSON
async function obtenerJSON() {

  const URLJSON = "productos.json";
  const resp = await fetch(URLJSON);
  const data = await resp.json();
  productosJSON = data;
  renderizarProds();

};

//Cerrando la compra
botonFinalizar.onclick = () => {
  if (carrito.length==0){
    Swal.fire ({
      title: 'El carro esta vacio',
      text: 'Compre algun producto',
      icon: 'error',
      showConfirmButton: false,
      timer: 1500

    });
  }
  else {
    carrito = [];
    document.getElementById("tablabody").innerHTML+"";
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar $: ";
    localStorage.removeItem("carrito");

  };
};