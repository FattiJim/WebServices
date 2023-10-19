document.addEventListener('DOMContentLoaded', function () {
  validarContrasena();
  validarCorreo();
  function validarCorreo(correo) {
    const regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regexCorreo.test(correo);
  }

  function validarContrasena(contrasena) {
    const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    //regexContrasena debe tener al menos una letra mayúscula, una minúscula y un número y debe tener al menos 8 caracteres de longitud
    return regexContrasena.test(contrasena);
  }

  // Obtiene el formulario
  const form = document.getElementById('form_reg');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtiene los valores de los campos del formulario
    const usuario = document.getElementById('user_reg').value;
    const contrasena = document.getElementById('pass_reg').value;
    const correo = document.getElementById('email_reg').value;

    if (!usuario || !contrasena || !correo) {
      //mostrar error por unos segundos
      // $('#resultado').text('Por favor, completa todos los campos.').show();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, completa todos los campos.',
        showConfirmButton: false,
        timer: 3000
      })
      return;
    }

    /* Autores: */
    /* Britany Itaii Perez Cadena - Fatima Jimenez Bazan */

    if (!validarCorreo(correo)) {
      document.getElementById('ErrorEmail').textContent = 'El correo no es válido';
      //mostrar por unos segundos
      document.getElementById('ErrorEmail').style.display = 'block';
      setTimeout(function () {
        document.getElementById('ErrorEmail').style.display = 'none';
      }, 3000);

    } else {
      document.getElementById('ErrorEmail').style.display = 'none';
    }

    if (!validarContrasena(contrasena)) {
      document.getElementById('ErrorPass').textContent = 'La contraseña no es válida: Debe tener al menos una letra mayúscula, una minúscula, un número y debe tener al menos 8 caracteres de longitud';
      document.getElementById('ErrorPass').style.display = 'block';
      setTimeout(function () {
        document.getElementById('ErrorPass').style.display = 'none';
      }, 3000);
    } else {
      document.getElementById('ErrorPass').style.display = 'none';
    }

    // Realiza una solicitud AJAX a la API Flask
  //   if (validarContrasena(contrasena) && validarCorreo(correo)) {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('POST', '/registro'); //Aqui como sabe donde esta registro?ay perdon ..  no vi esto fijate que como se esta ejecutando el java en el puerto 5000 sabe el xhr que /registro pertenece a ese puerto este se esta ejecutando en el 4000 y el de registro en el 5000 oy e si es cieto brujeria
  //    //3grosera ando bien distraida siii esta bien le pertenece a flask y si es 400, solo me entro la duda de como funciono si es que se probo cuando lo moviste
  //    //pues como que no funciono eh, porque no insertó el objeto
  //     xhr.setRequestHeader('Content-Type', 'application/json');

  //     const data = JSON.stringify({ usuario: usuario, contrasena: contrasena, correo: correo });

  //     xhr.onload = function () {
  //       console.log(xhr.response);
  //       const response = JSON.parse(xhr.responseText); //Viste, dice que no se puede parsear xd si ya vi :( ) no lo parsea porque no es un objeto
  //       if (xhr.status === 201) {
  //         Swal.fire({
  //           icon: 'success',
  //           title: response.message,
  //           showConfirmButton: false,
  //           timer: 3000
  //         })
  //         //limpiando el formulario
  //         form.reset();
  //         console.log(xhr.status);
  //       } if (xhr.status === 409) {
  //         console.log(xhr.status);
  //         document.getElementById('ErrorUser').textContent = response.message;
  //         document.getElementById('ErrorUser').style.display = 'block';
  //         setTimeout(function () {
  //           document.getElementById('ErrorUser').style.display = 'none';
  //         }, 3000);
  //       }
  //     };

  //     xhr.send(data);
  //   }
  });
});