console.log("Ejecutando Javascript...");

const display = document.getElementById("display"); //-- Obtengo HTML del dom (memoria)
const boton_test = document.getElementById("boton_test"); // Identifico el boton

boton_test.onclick = ()=> {
    display.innerHTML+="<p>Hola desde JS!</p>";
}
