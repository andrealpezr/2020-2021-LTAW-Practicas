//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');

const PUERTO = 8080;

//-- Cargar pagina web del formulario
const PAGINA = fs.readFileSync('index.html', 'utf-8');
const FORMULARIO = fs.readFileSync('form2.html','utf-8');
const COMPRA = fs.readFileSync('compra.html', 'utf-8');
//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('resp1.html', 'utf-8');
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
    let content = PAGINA;
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

    // Formulario
    if (myURL.pathname == '/form2') {
        content = FORMULARIO;
    }

    if (myURL.pathname == '/compra') {
        content = COMPRA;
    }

    if(myURL.pathname == '/productos') {

        content = PAGINA;
        var direccion = myURL.searchParams.get('direccion');
        var tarjeta = myURL.searchParams.get('tarjeta');

        tienda[0]["direccion"] = direccion;
        tienda[0]["tarjeta"] = tarjeta;

        let myJSON = JSON-stringify(tienda);
        fs.writeFileSync(FICHERO_JSON, myJSON);
    }

  
    //-- Enviar la respuesta
    res.setHeader('Content-Type', "text/html");
    res.write(content);
    res.end()
  
});
  
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);