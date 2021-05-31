const electron = require('electron');
const ip_address = require('ip');
const QRCode = require('qrcode');

console.log("Hola desde el proceso de la web...");

var PUERTO = 8080

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const info7 = document.getElementById("info7");
const URL = document.getElementById("URL");
const QR = document.getElementById("QR");
const print = document.getElementById("print");
const ip_address = document.getElementById("ip_address");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.arch;
info2.textContent = process.platform;
info3.textContent = process.cwd();
info4.textContent = process.versions.node;
info5.textContent = process.versions.chrome;
info6.textContent = process.versions.electron;

ip_address.textContent = ip.address();
info3.textContent += ":" + PUERTO;


btn_test.onclick = () => {
    display.innerHTML += "<p>" + "Bienvenido al chat!!" + "<p>";
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Boton apretado");
}

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('print', (event, message) => {
    console.log("Recibido: " + message);
    print.textContent = message;
});

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('chat', (event, msg) => {
    console.log("Recibido: " + msg);
    display.innerHTML += '<p style="color:black">' + msg.username + " :" 
                         + msg.message + '</p>';
});



