const http = require('http');

const PUERTO = 8080; //-- Puerto 

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  console.log("Petición recibida")

  //-- Generar respuesta
  //-- Código: Error. No encontrado
  res.statusCode = 404;
  res.statusMessage = "Not Found :-(";
  res.setHeader('Content-Type', 'text/plain');
  res.write("Soy el ANGRY Server\n");
  res.end()

}); 

server.listen(PUERTO); // Escuchando puerto

console.log("Ejemplo 5. Angry server!. Escuchando en puerto: " + PUERTO);