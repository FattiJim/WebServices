/* Autores: */
/* Britany Itaii Perez Cadena - Fatima Jimenez Bazan */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const usuario = document.getElementById('user_login').value;
        const contrasena = document.getElementById('pass_login').value;

        if (!usuario || !contrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, completa todos los campos.',
                showConfirmButton: false,
                timer: 3000
            })
            return;
        }

        $.ajax({
            url: 'http://localhost/serviciosweb/Proyecto/Microservicios/Autenticacion/auth',
            type: 'POST',
            data: JSON.stringify({ user: usuario, pass: contrasena }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (respuesta, datos, xhr) {
                if (xhr.status === 200) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Validando datos de acceso',
                        text: 'Verificando...',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    $.ajaxSetup({
                        headers: {
                            "Authorization": "Bearer " + respuesta.token
                        }
                    });

                    const token = respuesta.token;
                    const user_send = respuesta.user;
                    const role_send = respuesta.rol;
                    console.log(token);
                    console.log(respuesta.user + respuesta.rol); //quiero ver si funciona si si esta mandando el token correctamente
                    form.reset();
                    setTimeout(function () {
                        $.ajax({
                            url: 'http://localhost:3000/',
                            type: 'GET',
                            contentType: 'application/json',
                            dataType: 'json',
                            headers: {
                                "Authorization": "Bearer " + token,

                            },
                            success: function (response, datos, xhr) {
                                if (xhr.status === 200) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Acceso autorizado',
                                        text: 'Procesando...',
                                        showConfirmButton: false,
                                        timer: 3000
                                    });
                                    if (role_send === "admin") { 
                                        //enviamos el token a local storage
                                        localStorage.setItem('token', respuesta.token);
                                        localStorage.setItem('user_name', respuesta.user);
                                        window.location.assign('http://localhost/serviciosweb/Proyecto/Proyecto-pt1/Vistas/Admin/Almacen.html');
                                    } else {
                                        localStorage.setItem('user_name', respuesta.user);
                                        localStorage.setItem('token', respuesta.token);
                                        window.location.assign('http://localhost/serviciosweb/Proyecto/Proyecto-pt1/Vistas/Usuario/Ventas.html');
                                    }
                                
                                }
                            },
                            error: function (xhr, status, error) {
                                console.log(error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'El usuario o contraseña son incorrectos',
                                    showConfirmButton: false,
                                    timer: 6000
                                });
                                //redireccionamos a la pagina de login
                                window.location.href = "http://localhost:4000/";
                            }
                        });
                        form.reset();

                    }, 3000);
                    
                } else if( respuesta.Code === 500){ //Error de usuario
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: respuesta.Message,
                        showConfirmButton: false,
                        timer: 3000
                    });
                } else if( respuesta.Code === 501 ){ //Error en el password
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: respuesta.Message,
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
                if (xhr.status === 501) { //El 501 es del servidor ¿Verdad?sipi
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'EL API no pudo procesar la solicitud',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
                
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error de procesamiento en la API',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        })

    });


    /* Autores: */
    /* Britany Itaii Perez Cadena - Fatima Jimenez Bazan */

    const form_registro = document.getElementById('form_reg');
    form_registro.addEventListener('submit', function (event) {
        event.preventDefault();
        const user_reg = document.getElementById('user_reg').value;
        const pass_reg = document.getElementById('pass_reg').value;
        const email_reg = document.getElementById('email_reg').value;

        //Las validaciones las esta haciendo por si solas el formulario
        //Significa que no tendremos que verificar si estan vacios o no

        $.ajax({
            url: 'http://localhost:5000/registro',
            type: 'POST',
            data: JSON.stringify({ user: user_reg, pass: pass_reg, email: email_reg }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response, datos, xhr) {
                if(response.Code === 201){
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: response.Message,
                        showConfirmButton: false,
                        timer: 3000
                    });
                    //limpiando el formulario
                    form_registro.reset();
                } else if( response.Code === 409){
                    
                }
            },
            error: function (xhr, status, error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El nombre de usuario ya esta registrado',
                    showConfirmButton: false,
                    timer: 3000
                });
                //limpiando el formulario
                form_registro.reset();
            }
        });
    });
});