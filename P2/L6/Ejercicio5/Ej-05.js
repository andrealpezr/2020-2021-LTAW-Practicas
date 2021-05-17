//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 8080;

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('form1.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('resp.html', 'utf-8');
const ERROR = fs.readFileSync('error.html', 'utf-8');

//-- JSON
const FICHERO_JSON = "usuarios.json";
const tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);

// Servidor
const server = http.createServer((req, res) => {

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  
     
  
    //-- Por defecto entregar formulario
    let content = FORMULARIO;
    let usuarios = 0;
  
    if (myURL.pathname == '/procesar') {
        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        //-- Leer los parámetros
        var nombre = myURL.searchParams.get('nombre');
        console.log(" Nombre: " + nombre);
  
        tienda.forEach((element, index) => {
            if (element["nombre"] == nombre){
                usuarios += 1;
            }
        });

        if (usuarios != 0) {
            content = RESPUESTA;
        }else {
            content = ERROR;
        }
    }
  
    //-- Enviar la respuesta
    res.setHeader('Content-Type', "text/html");
    res.write(content);
    res.end()
  
});
  
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);