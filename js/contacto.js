// Validación y envío del formulario
const formContacto = document.getElementById("form-contacto");
const mensajeExito = document.getElementById("mensaje-exito");

formContacto.addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if(nombre === "" || email === "" || mensaje === ""){
        alert("Por favor completa todos los campos.");
        return;
    }

    // Validación básica de email
    const regexEmail = /^\S+@\S+\.\S+$/;
    if(!regexEmail.test(email)){
        alert("Por favor ingresa un email válido.");
        return;
    }

    // Simulamos envío exitoso
    mensajeExito.classList.remove("hidden");
    formContacto.reset(); // <-- Aquí se limpia el formulario automáticamente

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeExito.classList.add("hidden");
    }, 3000);
});
