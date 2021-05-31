//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const musica = document.getElementById("musica");

//-- Escribiendo el mensaje
const msg_escribiendo = "está escribiendo...";
let escribir = false;

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
  if (msg = msg_escribiendo) {
    musica.play();
  } else  {
    console.log("cliente escribiendo");
  }
 
});


//-- Al pulsar el display, se manda el mensaje de escribiendo
msg_entry.oninput = () => {
  if (!escribir) {
    socket.send(msg_escribiendo);
    escribir = true;
  msg_entry.value = "";
  }
}

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
    escribir = false;
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}
