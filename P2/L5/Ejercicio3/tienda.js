//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "../Ejercicio2/tienda.json"

//-- NOmbre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda-modificacion.json"

//-- Leer el fichero JSON, manera sincrona
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);


//-- Mostrar info de productos
tienda[0]["productos"].forEach(element => {
    console.log("Producto: " + element.nombre + ", Stock: " + element.stock);
});
console.log();

//-- Incremento stock de productos
console.log("<------------Se ha incrementado el stock en todos los productos------------>")
tienda[0]["productos"].forEach(element => {
    element["stock"] = element["stock"] + 1;
});

//-- Mostrar informacion del stock de productos
tienda[0].productos.forEach(element => {
    console.log("Producto: " + element.nombre + ", Stock: " + element.stock);
});

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);