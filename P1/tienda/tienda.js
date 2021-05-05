//-- Importo los modulos http, fs y url
const http = require('http');
const fs = require('fs');
//-- URL no hace falta ponerla
//--const URL = require('url');

//-- Definir el puerto a utilizar
const PUERTO = 9000; 

//-- Crear el servidor
const server = http.createServer(function(req, res) {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Obtengo URL del mensaje de solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("\nEl recurso solicitado es: " + myURL.pathname);

  //-- Declaro variable para almacenar los recursos pedidos
  let fichName = "";

  //-- Obtengo el fichero
  if(myURL.URL.pathname == '/'){
      fichName += "tienda.html"; //-- Pagina principal
  } else {
      fichName += myURL.p
  }
  


});
  
//-- Activo el servidor:
server.listen(PUERTO);

console.log("Server tienda activado!. Escuchando en puerto: " + PUERTO);