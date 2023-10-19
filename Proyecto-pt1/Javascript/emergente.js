/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/

$(document).ready(function () {
    var port = window.location.port;
    $("#formularioEdit").submit(function (event) {
        event.preventDefault();
        var formData = {
            Categoria: $('#categoria1').val(),
            Isbn: $('#isbn1').val(),
            Nombre: $('#nombre1').val(),
            Autor: $('#autor1').val(),
            Editorial: $('#editorial1').val(),
            Precio: $('#precio1').val(),
            Descuento: $('#descuento1').val(),
            Fecha: $('#fecha1').val()
        };
        
        console.log(formData);

        if ($('#categoria1').val() === '' || $('#isbn1').val() === '' || $('#nombre1').val() === '' || $('#autor1').val() === '' || $('#editorial1').val() === '' || $('#precio1').val() === '' || $('#descuento1').val() === '' || $('#fecha1').val() === '') {
            $('#resultado').text('Por favor, completa todos los campos.').show();
            setTimeout(function () {
                var div = document.getElementById("resultado"); //obtenemos el elemento por id
                div.style.display = "none"; //ocultamos el elemento
                $("#resultado").html(""); //limpiamos el contenido del elemento
            }, 5000); // muestra el resultado durante 5 segundos
        }
        else {
            fetch('http://localhost:' + port + '/serviciosweb/Proyecto/Proyecto-pt1/producto/detalles', {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.text())
            .then(data => { //data es el resultado de la consulta
                $("#resultado").html(data).show();
                $('#formularioEdit')[0].reset();
                setTimeout(function () {
                    var div = document.getElementById("resultado"); //obtenemos el elemento por id
                    $("#resultado").html(""); //limpiamos el contenido del elemento
                    div.style.display = "none"; //ocultamos el elemento
                }, 5000); // muestra el resultado durante 5 segundos

                window.opener.postMessage("cerrar", "*"); 
            //    setTimeout(function () {
            //     window.opener.postMessage("cerrar", "*"); 
            //     window.close(); //cierra la ventana
            //     }, 5000); // muestra el resultado durante 5 segundos
            })
            .catch(error => {
                // Manejar el error
                alert("Error: " + error);
                
            });
        }
    });
    
});

/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/



