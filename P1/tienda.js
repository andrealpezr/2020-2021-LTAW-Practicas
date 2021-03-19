//-- Importo los modulos http, fs y url
const http = require('http');
const fs = require('fs');
//-- URL no hace falta ponerla
//--const URL = require('url');

//-- Definir el puerto a utilizar
const PUERTO = 9000;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Obtengo URL del mensaje de solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);
});
  
//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Server tienda activado!. Escuchando en puerto: " + PUERTO);