//-- Acceder al módulo http
const http = require('http');

//-- Crear el servidor que es un objeto del tipo http.server
const server = http.createServer();

//-- Función de retrollamada de petición recibida
//-- Cada vez que un cliente realiza una petición
//-- Se llama a esta función
function atender(req, res) {
    //-- req: http.IncomingMessage: Mensaje de solicitud
    //-- res: http.SercerResponse: Mensaje de respuesta (vacío)

    //-- Indicamos que se ha recibido una petición
    console.log("Petición recibida!");

    //-- pero no enviamos respuesta (todavía)
}

//-- Activar la función de retrollamada del servidor
server.on('request', atender);

//-- Activar el servidor. A la escucha de peticiones
//-- en el puerto 8080
server.listen(8080);