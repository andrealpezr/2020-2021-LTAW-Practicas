//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const electron = require('electron');
const ip = require('ip');
const process = require('process');

const PUERTO = 8080;

//-- Constantes para los mensajes de comandos
const msg_bienvenida = 'BIENVENIDO AL CHAT!!!';
const msg_help = '/help: La lista de comandos<br>'
                + '/list: Número de usuarios conectados<br>'
                + '/hello: Recibir un saludo<br>'
                + '/date: Fecha actual<br>'

const msg_saludo = 'Hola! Espero que estes disfrutando del chat';

const msg_error = 'Comando no disponible, utilize /help para mas informacion';

const msg_nousers = 'Actualmente no hay users conectados';

const msg_escribiendo = 'está escribiendo';

//-- Variable del número de usuarios
var users = 0;

//-- Array del nick de los clientes
var nickname = [];

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Crear una nueva aplicacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);


//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web

app.get('/', (req, res) => {
  let path = __dirname + '/public/chat.html';
  res.sendFile(path);
  console.log("Se ha solicitado el acceso al html");
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

  //-- Envio el numero de usuarios
  win.webContents.send('users_send', users);
  console.log("Envio el numero de usuarios");

  //-- Mensaje al usuario nuevo
  socket.send('<p style="color:blue">' + msg_bienvenida + '</p');
  
  console.log('** NUEVO USUARIO CONECTADO: **'.blue);
 
 
  //-- Obtengo el nombre del usuario
  socket.on("nick", (nick) => {
    io.send('<p style="color:blue">' + nick + " acaba de entrar en el chat");
 
    nickname.push(nick);
    //-- Envio mensje al renderizado, usuario conectado
    win.webContents.send(nick + ' se acaba de conectar');
    console.log(nick + ' se acaba de conectar');

    //-- Evento de desconexión
    socket.on('disconnect', function(){
      console.log('** CONEXIÓN TERMINADA **'.red);
      users -= 1; // Resto el contador de clientes

      io.send(nick + " se ha salido del chat");

      //-- Envio mensaje renderizado de la desconexion
      win.webContents.send(nick + " se ha salido del chat");
      win.webContents.send('users_send', users);
      
      //-- Elimino el nick del cliente
      let cliente = nickname.indexOf(nick);
      nickname.splice(cliente, 1);
      console.log("Usuarios actuales: " + cliente);
    }); 
    
    //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
    socket.on("message", (msg)=> {
      console.log("Mensaje Recibido!: " + msg.blue);
      //-- Analizo comandos especiales
      if(msg.startsWith("/")) {
        console.log('Se han pedido comandos al servidor'.pink);
      
        switch(msg) {
          case "/help":
            socket.send(msg_help);
            break;
          case "/list":
            if (users >= 1){
            message = users;
            socket.send("Hay " + message + " usuarios contectados");
            socket.send("Los usuarios son: " + nickname);
            } else {
              socket.send(msg_nousers);
            }
            break;
          case "/hello":
            socket.send(msg_saludo);
            break;
          case "/date":
            let fecha = new Date();
            socket.send("Hoy es día " +  fecha.getDate() + " de " + fecha.getMonth() + " del " + fecha.getFullYear());
            break;
          default:
            socket.send(msg_error);
            break;
        }
     }  else if (msg == msg_escribiendo) {
          socket.broadcast.emit('message', msg);
     } else { //-- Envio el mensaje a todos
        message = nick + ": " + msg;
        io.send(message); 
        //-- Envio al render 
        console.log("Envio mensaje a electron");
        win.webContents.send('message_send', message);
      };
    });
  });
});

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
  console.log("Evento Ready!");

  //-- Crear la ventana principal de nuestra aplicación
  win = new electron.BrowserWindow({
      width: 600,   //-- Anchura 
      height: 600,  //-- Altura

      //-- Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Mando IP
  win.on('ready-to-show', () => {
    ip_Address = 'http://' + ip.address() + ':' + PUERTO + "/public/chat.html";
    win.webContents.send('ip_send', ip_Address); 
  });
});


//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje desde el renderizado: " + msg);
  io.send(msg);
 
});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Abriendo chat en puerto: " + PUERTO);
