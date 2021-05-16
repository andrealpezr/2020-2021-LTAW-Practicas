console.log("Hola desde el proceso de la web..."); //-- Navegador

//-- Obtener elementos de la interfaz -> desarroladores
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");

btn_test.onclick = () => {
    display.innerHTML += "TEST! ";
    console.log("Botón apretado!");
}

