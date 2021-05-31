//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const musica = document.getElementById("musica");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


//-- Escribir el nick
var nick = prompt("Escriba su nick");
if (nick == null || nick == "") {
  nick = prompt("No ha escrito un nick");
}
console.log(nick);

//-- Envio el nick al servidor
socket.emit('nick', nick);

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:black">' + msg + '</p>';
  musica.play();
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

