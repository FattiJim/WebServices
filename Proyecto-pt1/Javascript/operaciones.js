/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/

//Antes de llamar a las funciones se les pasará los headers de acceso
var port = window.location.port;
$(document).ready(function () {
    obtenerProductos();
    //Creacion de variables globales jeje //no se esta actualixando :)
    var send_user = localStorage.getItem('name_user');
    console.log(send_user); //Esta como nulo, como si no estuviera recibiendo la info quita eso, vamos a hacer el ajax del registro eso es lo que importa mas
    $("#insert_name").html(send_user);

    function obtenerProductos() {
        $.ajax({
            url: "http://localhost:" + port + "/serviciosweb/Proyecto/Proyecto-pt1/listarProductos",
            dataType: "json",
            success: function (data) {
                var html = "<table class='table' id='tabla-productos table'><thead><tr><th>ISBN</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>";
                for (var i = 0; i < data.length; i++) {
                    html += "<tr><td taskId='" + data[i].ISBN + "'>" + data[i].ISBN + "</td><td>" +
                        "<li name='" + data[i].Nombre + "'> Nombre: " + data[i].Nombre + "</li>" +
                        "<li autor='" + data[i].Autor + "'> Autor: " + data[i].Autor + "</li>" +
                        "<li editorial='" + data[i].Editorial + "'> Editorial: " + data[i].Editorial + "</li>" +
                        "<li fecha='" + data[i].Fecha + "'> Fecha: " + data[i].Fecha + "</li>" +
                        "<li precio='" + data[i].Precio + "'> Precio: " + data[i].Precio + "</li>" +
                        "<li descuento='" + data[i].Descuento + "'> Descuento: " + data[i].Descuento +
                        "</li><td><button class='Btn'>Editar<svg class='svg' viewBox='0 0 512 512'><path d='M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z'></path></svg></button>" +
                        "<button class='Btn2'>Eliminar<svg class='svg' viewBox='0 0 24 24'><path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z'></path></svg></button></td></tr>";
                }
                $("#tabla-productos").html(html);
                $('#tabla-productos table').DataTable({
                    lengthMenu: [3, 6],
                    "pagingType": "simple_numbers"
                    

                });

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Manejar el error
                alert("Error: " + textStatus + " - " + errorThrown);
            }
        });
    }

    //formulario para listar detalles de un producto
    $("#formListProductos").submit(function (event) {
        // Evitar que se recargue la página al enviar el formulario
        event.preventDefault();
        // Obtener el valor del campo de texto
        var isbn = $("#isbn").val();
        // Realizar la solicitud AJAX al endpoint
        if (isbn === '') {
            $('#resultado').text('Por favor, inserta el ISBN.').show();
            setTimeout(function () {
                var div = document.getElementById("resultado"); //obtenemos el elemento por id
                div.style.display = "none"; //ocultamos el elemento
                $("#resultado").html(""); //limpiamos el contenido del elemento
            }, 5000); // muestra el resultado durante 5 segundos
        } else {
            $.ajax({
                url: 'http://localhost:' + port + '/serviciosweb/Proyecto/Proyecto-pt1/detalles/' + isbn,
                type: 'GET',
                success: function (response) {
                    //limpiamos formulario sin recargar la pagina y sin vaciar cada uno de los campos
                    $('#formListProductos')[0].reset();
                    var data = response.Data;
                    var html = "<div id=tabla-detalles'><table class='table1' id='tabla-detalles table'><caption>Detalles por producto</caption><thead><tr><th>Código</th><th>Mensaje</th><th>Datos</th><th>Status</th></tr></thead><tbody>";
                    html += "<tr><td>" + response.Code + "</td><td>" + response.Message + "</td><td>";
                    if (response.Data !== '') {
                        html += "Autor: " + data['Autor'] + "<br>" +
                            "Editorial: " + data['Editorial'] + "<br>" +
                            "Nombre: " + data['Nombre'] + "<br>" +
                            "Fecha: " + data['Fecha'] + "<br>" +
                            "Precio: " + data['Precio'] + "<br>" +
                            "Descuento: " + data['Descuento'] + "<br>" +
                            "</td><td>" + response.Status + "</td></tr> </tbody></table></div>";
                    }
                    else {
                        html += "  </td><td>" + response.Status + "</td></tr> </tbody></table></div>";
                    }
                    $("#tabla-detalles").html(html);
                    // $("#tabla-detalles table").DataTable();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Manejar el error
                    alert("Error: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    /* 
        //Autores:
        //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
   */

    //formulario para listar categorias 
    $("#formProductos").submit(function (event) {
        event.preventDefault();
        // Obtener el valor del campo de texto
        var categoria = $("#categoria").val();
        // Realizar la solicitud AJAX al endpoint
        if (categoria === '') {
            $('#resultado').text('Por favor, inserta la categoria.').show();
            setTimeout(function () {
                var div = document.getElementById("resultado"); //obtenemos el elemento por id
                div.style.display = "none"; //ocultamos el elemento
                $("#resultado").html(""); //limpiamos el contenido del elemento
            }, 5000); // muestra el resultado durante 5 segundos
        } else {
            $.ajax({
                url: 'http://localhost:' + port + '/serviciosweb/Proyecto/Proyecto-pt1/productos/' + categoria,
                type: 'GET',
                success: function (response) {
                    //limpiamos formulario sin recargar la pagina y sin vaciar cada uno de los campos
                    $('#formProductos')[0].reset();
                    var data = response.Data;
                    var html = "<div id=tabla-producto'><table class='table2' id='tabla-produto table'><caption>Detalles de categoria</caption><thead><tr><th>Código</th><th>Mensaje</th><th>Datos</th><th>Status</th></tr></thead><tbody>";
                    html += "<tr><td>" + response.Code + "</td><td>" + response.Message + "</td><td>";
                    if (response.Data !== '') {
                        for (var key in data) {
                            html += key + ": " + data[key] + "<br>";
                        }
                        html += "</td><td>" + response.Status + "</td></tr> </tbody></table></div>";
                    }
                    else {
                        html += "  </td><td>" + response.Status + "</td></tr> </tbody></table></div>";
                    }
                    $("#tabla-producto").html(html);
                    // $("#tabla-detalles table").DataTable();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Manejar el error
                    alert("Error: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    // función para abrir la ventana emergente y enviar los datos para editar el producto
    $(document).on('click', '.Btn', function () {
        // abrimos la ventana emergente y almacenamos la referencia en una variable global
        window.emergenteWindow = window.open("../../Vistas/Admin/EditarProducto.html", "Editar producto", "width=400,height=450"); 

        // obtenemos el isbn del producto
        var isbn = $(this).closest('tr').find('td[taskId]').attr('taskId');
        // obtenemos los datos del producto
        var nombre = $(this).closest('tr').find('li[name]').attr('name');
        var autor = $(this).closest('tr').find('li[autor]').attr('autor');
        var editorial = $(this).closest('tr').find('li[editorial]').attr('editorial');
        var precio = $(this).closest('tr').find('li[precio]').attr('precio');
        var descuento = $(this).closest('tr').find('li[descuento]').attr('descuento');
        var fecha = $(this).closest('tr').find('li[fecha]').attr('fecha');

        // enviamos los datos a la ventana emergente
        window.emergenteWindow.nombre1 = nombre;
        window.emergenteWindow.autor1 = autor;
        window.emergenteWindow.editorial1 = editorial;
        window.emergenteWindow.precio1 = precio;
        window.emergenteWindow.descuento1 = descuento;
        window.emergenteWindow.fecha1 = fecha;
        window.emergenteWindow.isbn1 = isbn;

        // cuando la ventana emergente se cargue
        window.emergenteWindow.addEventListener("load", function () {
            //insertar datos en los inputs en la ventana emergente en formato JSON
            window.emergenteWindow.document.getElementById("nombre1").value = window.emergenteWindow.nombre1;
            window.emergenteWindow.document.getElementById("autor1").value = window.emergenteWindow.autor1;
            window.emergenteWindow.document.getElementById("editorial1").value = window.emergenteWindow.editorial1;
            window.emergenteWindow.document.getElementById("precio1").value = window.emergenteWindow.precio1;
            window.emergenteWindow.document.getElementById("descuento1").value = window.emergenteWindow.descuento1;
            window.emergenteWindow.document.getElementById("fecha1").value = window.emergenteWindow.fecha1;
            window.emergenteWindow.document.getElementById("isbn1").value = window.emergenteWindow.isbn1;

        });

    });

    /* 
       //Autores:
       //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
    */

    //funcion para detectar cuando la ventana emergente se cierre
    window.addEventListener("message", function (event) {
        if (event.data === "cerrar") {
            obtenerProductos();
        }
    });

    //Podemos mandar los headers en cada solicitud como es el usuario y la contraseña VERIFICAR ESTA PARTE
    //formulario para agregar un producto
    $("#formularioAdd").submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize(); //obtenemos los datos del formulario
        console.log(formData);
        if ($('#categoria').val() === '' || $('#isbn').val() === '' || $('#nombre').val() === '' || $('#autor').val() === '' || $('#editorial').val() === '' || $('#precio').val() === '' || $('#descuento').val() === '' || $('#fecha').val() === '') {
            $('#resultado').text('Por favor, completa todos los campos.').show();
            setTimeout(function () {
                var div = document.getElementById("resultado"); //obtenemos el elemento por id
                div.style.display = "none"; //ocultamos el elemento
                $("#resultado").html(""); //limpiamos el contenido del elemento
            }, 5000); // muestra el resultado durante 5 segundos
        }
        else {
            $.ajax({
                type: "POST",
                url: 'http://localhost:' + port + '/serviciosweb/Proyecto/Proyecto-pt1/producto',
                data: formData,
                success: function (response) {
                    // Mostrar la respuesta en el área designada
                    $("#resultado").html('<p>' + 'Code: '+  response.Code + '<br>'+ 'Message: '+response.Message +'<br>'+ 'Data: '+ response.Data+'<br>'+ 'Status: '+response.Status+'</p>').show();
                    obtenerProductos();
                    //limpiamos el formulario sin recargar la pagina y sin vaciar cada uno de los campos
                    $('#formularioAdd')[0].reset();
                    setTimeout(function () {
                        var div = document.getElementById("resultado"); //obtenemos el elemento por id
                        div.style.display = "none"; //ocultamos el elemento
                        $("#resultado").html(""); //limpiamos el contenido del elemento
                    }, 5000); // muestra el resultado durante 5 segundos
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Manejar el error
                    alert("Error: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

    //funcion para actualizar la lista de productos y cerrar la ventana emergente

    //Boton para eliminar producto
    $(document).on('click', '.Btn2', function () {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            var isbn = $(this).closest('tr').find('td[taskId]').attr('taskId');
            $.ajax({
                url: 'http://localhost:' + port + '/serviciosweb/Proyecto/Proyecto-pt1/producto',
                type: 'DELETE',
                data: { isbn: isbn },
                success: function (response) {
                    $("#response").html('<p>' + 'Code: '+  response.Code + '<br>'+ 'Message: '+response.Message +'<br>'+ 'Data: '+ response.Data+'<br>'+ 'Status: '+response.Status+'</p>').show();
                    obtenerProductos();
                    setTimeout(function () {
                        var div = document.getElementById("response");
                        div.style.display = "none";
                        $("#response").html("");
                    }, 5000);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Error:', errorThrown);
                }
            });
        }
    });

    //Boton para cerrar la sesion jeje
    $(document).on('click', '.buttonL', function () {
        if (confirm("¿Desea cerrar sesión?")) {
            //obtner el token del local storage
            const token = localStorage.getItem('token');
            $.ajax({
                url: 'http://localhost:3000/logout',
                type: 'GET',
                headers: {
                    'Authorization': token
                },
                success: function (response, datos, xhr) {
                    if(xhr.status === 200){
                    window.location.replace("http://localhost:4000/"); //Ahora el inicio va a estar en el puerto 4000 jeje
                    localStorage.removeItem('token');
                    }
                    else{
                        alert('Lo sentimos operaciones bloqueadas');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Manejar el error
                    alert("Error: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

});

/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/