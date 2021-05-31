//-- Servidor JSON

const http = require('http');
const fs = require('fs');
const PUERTO = 9000;

//-- Cargar la Página de error
const ERROR = fs.readFileSync('error_page.html');

//-- Leer fichero JSON con los productos
const FICHERO_JSON = fs.readFileSync('tienda.json');

//-- Obtener fichero
let tienda = JSON.parse(FICHER_JSON);

//-- Analizar la cookie y devolver el nombre del
//-- usuario si existe, o null en caso contrario
function get_user(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
      
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
      
      //-- Variable para guardar el usuario
      let user;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
  
        //-- Leer el usuario
        //-- Solo si el nombre es 'user'
        if (nombre.trim() === 'user') {
          user = valor;
        }
      });
  
      //-- Si la variable user no está asignada
      //-- se devuelve null
      return user || null;
    }
  }
  
//-- Analizar la cookie y devolver el nombre del
//-- producto del carrito, o null en caso contrario
function get_carro(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
      
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
      
      //-- Variable para guardar el carro
      let carro;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
  
        //-- Leer el carrito
        //-- Solo si el nombre es esta en el carro
        if (nombre.trim() === 'carrito') {
          carro = valor;
        }
      });
  
      //-- Si la variable user no está asignada
      //-- se devuelve null
      return carro || null;
    }
}


//-- Analizar la cookie y devolver el numero de
//-- productos comprados, o null en caso contrario
function get_numProd(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
      
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
      console.log(pares);
      
      //-- Variable para guardar el numero de productos
      let numProd;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
  
        //-- Leer el producto
        //-- Solo si el nombre es cantidad
        if (nombre.trim() === 'cantidadsofa') {
          numProd = valor;
        } else if (nombre.trim() === 'cantidadmesa') {
            numProd = valor;
        } else if (nombre.trim() === 'cantidadlampara') {
                numProd = valor;
        }
    });
  
      //-- Si la variable user no está asignada
      //-- se devuelve null
      return carro || null;
    }
  }
  //-- SERVIDOR: Bucle principal de atención a clientes
  const server = http.createServer((req, res) => {
  
    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  
  
    //-- Determinar el contenido del mensaje de respuesta
    let content_type = "text/html";
    let content = EJ6_HTML.replace("HTML_EXTRA","");
  
    //-- Obtener le usuario que ha accedido
    //-- null si no se ha reconocido
    let user = get_user(req);
  
    console.log("User: " + user);
  
    //-- Acceso al recurso raiz
    if (myURL.pathname == '/') {
  
      //--- Si la variable user está asignada
      if (user) {
  
          //-- Añadir a la página el nombre del usuario
          console.log("user: " + user);
          content = EJ6_HTML.replace("HTML_EXTRA", "<h2>Usuario: " + user + "</h2>");
      } else {
          //-- Mostrar el enlace a la página de login
          content = EJ6_HTML.replace("HTML_EXTRA", `
          <a href="login">[Login]</a>
          `);
      }
  
      //-- Acceso a otro recurso: Se hace login
    } else if (myURL.pathname == '/login') {
  
      //-- Asignar la cookie de usuario Chuck
      res.setHeader('Set-Cookie', "user=Chuck");
  
      //-- Asignar la página web de login ok
      content = LOGIN;
    } else {
        content = "ERROR!!!";
    }
       
    //-- Enviar la respuesta
    res.setHeader('Content-Type', content_type);
    res.write(content);
    res.end();
  
  });
  
  server.listen(PUERTO);
  console.log("Escuchando en puerto: " + PUERTO);
  