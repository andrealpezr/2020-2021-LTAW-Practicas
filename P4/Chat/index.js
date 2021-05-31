const electron = require('electron');
const ip = require('ip');

console.log("Hola desde el proceso de la web...");

var PUERTO = 8080;

//-- Obtener elementos de la interfaz
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const info_user = document.getElementById("info_user");
const texto = document.getElementById("texto");
const textos = document.getElementById("textos");
const info7 = document.getElementById("info7");
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");


//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.arch;
info2.textContent = process.platform;
info4.textContent = process.versions.node;
info5.textContent = process.versions.chrome
info6.textContent = process.versions.electron;
info_user.textContent = 0;

//-- Mensaje recibido del proceso MAIN -> Usuarios
electron.ipcRenderer.on('users_send', (event, message) => {
    console.log("Usuarios: " + message);
    info_user.textContent = message;
});

//-- Mensaje recibido del proceso MAIN -> IP
electron.ipcRenderer.on('ip_send', (event, message) => {
    console.log("Recibido: " + message);
    info7.textContent = message;
});

//-- Mensaje recibido del proceso MAIN -> Texto
electron.ipcRenderer.on('message_send', (event, message) => {
    console.log("Recibido: " + message);
    textos.textContent += message;
    texto.scrollTop = texto.scrollHeight;
});

btn_test.onclick = () => {
    display.innerHTML += "Mensaje de prueba!!";
    console.log("Botón apretado!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA");
}