//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Variable del número de usuarios
var users = 0;

//-- Array del nick de los clientes
var nickname = [];

//-- Crear una nueva aplicacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web

//--Socket.send -> EL canal con ese cliente que esta conectado, envío solo ese cliente
//--io.send -> Envio el mensaje a todos los clientes que estan conectados, broadcast

app.get('/', (req, res) => {
  res.sendFile(_dirname +  '/chat.html');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  // Aumento el número de clientes
  users += 1;

  //-- Mensaje al usuario nuevo
  socket.send("Bienvenido al chat");
  
  console.log('** NUEVO USUARIO CONECTADO: **'.black);
  
  //-- Obtengo el nombre del usuario
  socket.on("nickmane", (nick) => {
    io.send(nick.blue + " está en el chat");
 
  })

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    users -= 1;

    io.send(nick + " ha abandonado el chat");

  });  



  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);

    //-- Analizo comandos especiales
    if(msg.startsWith("/")) {
      console.log("Se han pedido comandos al servidor".pink);
      if(msg == "/help"){
        socket.send("Los comandos soportados son:" + "<br>"
        + "/list: Número de usuarios conectados" + "<br>"
        + "/hello: Recibir un saludo" + "<br>" 
        + "/date: Fecha actual" + "<br>");
      
      } else if (msg == "/hello") {
        socket.send("Hola! Espero que estes disfrutando del chat");
      }else if (msg == "/date") {
        let fecha = new Date();
        socket.send("Hoy es día " +  fecha.getDate() + " de " + fecha.getMonth() + " del " + fecha.getFullYear());
      } else {
        socket.send("Comando no disponible, utilize /help para mas informacion");
      }
      } else { //-- Envio el mensaje a todos
      io.send(msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Abriendo chat en puerto: " + PUERTO);
