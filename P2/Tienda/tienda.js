//-- Servidor JSON
const http = require('http');
const fs = require('fs');
const PUERTO = 9000;

//-- Pagina principal
const TIENDA = fs.readFileSync('tienda.html', 'utf-8');

//-- Cargar la Página de error
const ERROR = fs.readFileSync('./html/error.html');

//-- Carro y busquedas
var CESTA = fs.readFileSync('./html/cesta.html');
var SEARCH = fs.readFileSync('./search.json');

//-- Leer fichero JSON con los productos
const FICHERO_JSON = fs.readFileSync('tienda.json');
//-- Obtener fichero
const TIENDA_JSON = JSON.parse(FICHERO_JSON);



//-- Defino alguna variable
let carrito_exist = false;
let search;


//Definición de los tipos de mime
const mime= {
  "plain" : "text/plain",
  "html" : "text/html",
  "css"  : "text/css",
  "js"   : "application/javascript",
  "jpg"  : "image/jpg",
  "png"  : "image/png",
  "PNG"  : "image/png",
  "gif"  : "image/gif",
  "json" : "application/json"
};


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
  


const server = http.createServer((req, res)=>{
    
  //-- Indicamos que se ha recibido una petición
  console.log("\nPetición recibida!");

  //-- Obtengo URL del mensaje de solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("La URL del recurso solicitado es: " + myURL.href)

  //-- Obtengo el nombre del usuario
  let user = get_user(req);

  //-- Declaro variable para almacenar los recursos pedidos
  let recurso = myURL.pathname;
  let solicitud = ""; 
  let client_exist = 0;

    if (recurso == "/"){
      console.log("Se ha solicitado la página principal");
      solicitud += '/tienda.html'; //-- Pagina principal
/*       if (user) {
        //-- EL usuario ya se ha logeado
        solicitud = TIENDA.replace("HTML_EXTRA", "<h2>Usuario: " + user + "</h2>");
      } else {
        solicitud = TIENDA.replace("HTML_EXTRA", '<a href="/login">Login</a>');
      } */
    } else { //-- Se solicita otro recurso
        solicitud = myURL.pathname;  
    } 
 
     //-- Extraigo el recurso pedido y su extension
    file_extension = solicitud.split(".")[1]; //-- Extension
    solicitud = "." + solicitud //-- El punto es necesario

    if (solicitud == './login_process'){
        user = myURL.searchParams.get('nombre');
        password = myURL.searchParams.get('password');
        info_users = TIENDA_JSON[0].users;
        info_users.forEach((element, index)=> {
            if (element["nombre"] == user) {
                if (element["password"] == password) {
                    client_exist += 1;
                }
            }          
      });
      if (client_exist >= 1) {
          solicitud = "./html/login-ok.html";
          res.setHeader('Set-Cookie', "Nombre:" + user);
      } else {
          solicitud = "./html/error.html";
      }
}

if (solicitud == './html/login.html' && user != null) {
    solicitud = "./html/cesta.html";
} 

if (solicitud == "./html/add_cesta") {
    if(user != null) {
        solicitud = "./html/compra_ok.html";
        var cantidad = myURL.searchParams.get('cantidad');
        var producto = myURL.searchParams.get("producto");
        info_users = TIENDA_JSON[0].users;
        info_users.forEach((element, index)=> {
            if (element["nombre"] == user) {
                (element["carrito"][producto] == cantidad);
            }
        });
    } else {
      solicitud = './html/login.html';
    }  
}
if (solicitud == "./html/compra_ok.html") {
  info_users = TIENDA_JSON[0].users;
  info_users.forEach((element, index)=> {
      if (element["nombre"] == user) {
        if (element["carrito"]["lampara"] == 0 &&
            element["carrito"]["mesa"] == 0 &&
            element["carrito"]["sillon"] == 0 &&
            element["carrito"]["sofa"] == 0) {
            solicitud = "./html/empy_by.html";
         } else { // vacio la cesta al comprar
           solicitud = "./html/compra_ok.html";
           element["carrito"]["mesa"] = 0;
           element["carrito"]["sillon"] = 0;
           element["carrito"]["sofa"] = 0;
           element["carrito"]["lampara"] = 0;
         }
      }
  });

    //-- Añadir a JSON 
    var name = myURL.searchParams.get('nombre');
    var email = myURL.searchParams.get('email');
    var direccion = myURL.searchParams.get('direccion');
    var tarjeta = myURL.searchParams.get('tarjeta');
    
    tienda_pedidos.push({"Nombre": name, "Email": email,
    "Direccion": direccion, "Tarjeta": tarjeta});

//console.log(tienda_pedidos);
  }
  
  if(myURL.pathname == "./search") {
    //-- Analizo parámetros 
    let parametro = myURL.searchParams.get('parametro');
    parametro = parametro.toUpperCase();
 
    let productos = [];
    let result = [];
    info_producto = TIENDA_JSON[1].productos;
    info_producto.forEach((element, index) => {
      if(element["nombre"]) {
        productos.push(element["nombre"]);
      }
    });

    for (let prod of productos) {
        //-- Mayúsculas
        prodU = prod.toUpperCase();

        //-- Si el producto comienza por lo indicado, introduzco en el array
        if (prodU.startsWith(parametro)) {
            result.push(prod);
        }
      }
      var products = JSON.stringify(result);
      content_type = "application/json";
      SEARCH = products;
      solicitud = "./search.json"
    }
    if (solicitud == "./procesar_busqueda") {
      let producto = myURL.searchParams.get('productoss');
      if (producto == "mesa") {
        solicitud = mesa;     
      }else if(producto == "sillon"){
        solicitud = sillon;
      }else if(producto == "sofa"){
        solicitud = sofa;
      }else if(producto == "lampara"){
        solicitud = lampara; 
      }else{
        solicitud = TIENDA;
      }
    }

  //- Leer el fichero de manera sincrona
  fs.readFile(solicitud, function(err,data) {

    //-- En caso de error (pagina no encuentrada)
    if(err == null) {         
      if (user != null && solicitud == TIENDA) {
        //-- Añadir a la página el nombre del usuario
          data = TIENDA.replace("Login", "Usuario: " + user);
      }

      if (solicitud == "./html/cesta.html") {
          var carro_cliente = CARRO.replace("Login", "<h2>Usuario: " + user + "</h2>");
          
          tienda_user.forEach((element, index)=>{
            if (element["nombre"] == user){
              var carro_cliente1 = carro_cliente.replace("entersillon", element["carrito"]["sillon"]);
              var carro_cliente2 = carro_cliente1.replace("enterlampara", element["carrito"]["lampara"]);
            
              data = carro_cliente2.replace("entermesa", element["carrito"]["mesa"]);
            }
          });
      }

      if (solicitud == "./search.json") {
          data = FICHERO_JSON;
      }
      
      console.log("Leyendo", solicitud + "...");
      console.log("Lectura completada...");
      res.writeHead(200, {'Content-Type': mime});
      console.log("200 OK")
      res.write(data);
      res.end(); 
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("404 Not Found");
      solicitud = "html/error.html";
      data = fs.readFileSync(solicitud);
      res.write(data);
      res.end()
    }  
  }); 
});
  
//-- Activo el servidor:
server.listen(PUERTO);
console.log("Server tienda activado!. Escuchando en puerto: " + PUERTO);
