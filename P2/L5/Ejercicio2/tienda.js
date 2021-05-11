//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- NOmbre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda-modificacion.json"

//-- Leer el fichero JSON, manera sincrona
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Mostrar informacion sobre la tienda
//-- Mostar informacion sobre productos
const productos = tienda[0]["productos"];
console.log("Productos en la tienda: " + productos.length);

//-- Recorrer el array de productos
productos.forEach((element, index)=>{
  console.log("Producto " + (index + 1) + ": " + element["nombre"]
               + ", Descripción: " + element["descripcion"]
               + ", Stock: " + element["stock"]);
});
console.log() //-- Pongo un salto por estetica


//-- Mostar informacion sobre usuarios
const usuarios = tienda[1]["usuarios"];
console.log("Usuarios registrados: " + usuarios.length);

//-- Recorrer el array de productos
usuarios.forEach((element, index)=>{
  console.log("Usuarios " + (index + 1) + ": " + element["nombre"]
               + ", Login: " + element["login"]
               + ", Correo: " + element["correo"]);
});
console.log() //-- Pongo un salto por estetica

//-- Mostar informacion sobre los pedidos
const pedidos = tienda[2]["pedidos"];
console.log("Pedidos solicitados: " + pedidos.length);

//-- Recorrer el array de productos
pedidos.forEach((element, index)=>{
  console.log("Pedidos " + (index + 1) + ": \nNombre: " + element["usuario"]
               + ", \nProducto: " + element["producto"]
               + ", \nCantidad: " + element["cantidad"]);
});
console.log() //-- Pongo un salto por estetica

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);