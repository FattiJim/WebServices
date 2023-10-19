<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/Database/Firebase.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

use Kreait\Firebase\Factory; //Factory nos permite crear una instancia de Firebase
use Kreait\Firebase\ServiceAccount;
use Firebase\JWT\JWT;
use Slim\Exception\HttpNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Tuupola\Middleware\CorsMiddleware;

$app = AppFactory::create();
$app->setBasePath("/serviciosweb/Proyecto/Microservicios/Autenticacion");

$app->addErrorMiddleware(true, true, true);

$database = new FirebaseAPI(); //Llamada a la base de datos

$app->add(new CorsMiddleware([
    'origin' => '*', // permitir cualquier origen
    'methods' => ['GET', 'POST', 'OPTIONS'], // permitir los métodos GET, POST y OPTIONS
    'headers.allow' => ['Content-Type', 'Authorization'], // permitir los headers Content-Type y Authorization
    'headers.expose' => [], // no exponer ningún header
    'credentials' => false, // no permitir enviar cookies de sesión u otros datos de autenticación
    'cache' => 0, // no utilizar caché
]));

//Creamos una funcion para saber si lo que nos mandó el usuario es un correo o nombre de usuario
function is_valid_email($str)
{
  return (false !== filter_var($str, FILTER_VALIDATE_EMAIL));
}

//Autorizacion del administrador
$app->post("/auth", function ($request, $response, $args) use ($database){
    //Traemos los datos enviados por el usuario
    $reqPost = $request->getParsedBody();
    //Extraemos el correo y contraseña
    $user = $reqPost["user"];
    $pass = $reqPost["pass"];

    //Llamamos a la funcion de validacion del correo
    $sys_o_us = is_valid_email($user);
    //Dentro de este if vamos a saber si es un usuario normal o un administrador
    if($sys_o_us == true){ //Quiere decir que es correo y no un nombre de usuario
        //Entonces llamamos a toda la funcion de verificacion y creacion de token de un usuario_sistema
        $found = false; //Este es el controlar de la funcion
        $id = "USER00"; //Este va a cambiar dependiendo de la búsqueda
        $id_fin = ""; //Este es el que guardara el id donde se encuentra el correo
        for($i = 1; $i <= 9; $i = $i + 1){ 
            $info = $database->searchSystemUser($id . $i); //Espero que asi podamos controlar el id
            if($info != false){ //Contiene informacion
                //Llamamos a la funcion del getSystemUser
                $info_ex = $database->getSystemUser($id . $i);
                //Extraemos el correo para verificar si es que es el mismo
                $ver_email = $info_ex['email'];
                //Verificamos si el email del registro es igual al email que nos paso el usuario
                if($ver_email != $user){ //Si no es igual
                    $found = false; //Para controlar la siguiente parte del código
                } else { //Si encontro el registro
                    $found = true; //Mandamos que se encontro el registro
                    $id_fin = $id . $i; //Guardamos el id del registro
                    //break para que romper el ciclo 
                    break;
                }
            } else { //El registro no existe o esta vacio
                //Igual colocamos un break
                break;
            }
        }

        //Autores: 
        //Britany Itaii Perez Cadena - Fatima Jimenez Bazan

        //Aqui ya vamos a generar el token si es que encontro al usuario
        //Ya no es necesario llamar a la funcion de busqueda
        if($found === true){ //Si lo encontró, quiere decir que es un usuario_sistema
            //Llamamos al get del usuario
            $user_sys = $database->getSystemUser($id_fin);
            //De la consulta hay que extraer la contraseña y el nombre de usuario para pasarlo a verificacion
            $ver_pass = $user_sys['pass']; 
            $ver_user = $user_sys['name'];
            $ver_rol = $user_sys['rol'];
            //Verficamos que el password sea correcto
            if($ver_pass === md5($pass)){ //Si la contraseña es correcta, creamos el token
                $now = new DateTime();
                $future = new DateTime("+20 minutes"); //Tiempo de expiracion
                $aud = "http://localhost/serviciosweb/Proyecto/Proyecto-pt1/Vistas/Usuario/";
                $payload = [
                    "iss" => "IFFI Web Services", //De donde proviene
                    "iat" => $now->getTimeStamp(), //Cuando fue emitido
                    "exp" => $future->getTimeStamp(), //Cuando expira
                    "aud" => $aud, //Para quien va dirigido
                    "user" => $ver_user, //Aqui si podemos pasar el correo como el usuario, pero depende de como lo queramos
                    "role" => $ver_rol //Depende de lo que sean jeje
                ];
                $secret = '123456789user_gral';
                $token = JWT::encode($payload, $secret, "HS256");//JWT::base64_encode($payload, $secret, "HS256");//
                $data['Code'] = 201;
                $data["token"] = $token;
                $data["expires"] = $future->getTimeStamp();
                $data["user"] = $ver_user;
                $data["rol"] = $ver_rol;
                $data["Status"] = "Success";
                $response->withStatus(201)->withHeader("Content-Type", "application/json")
                ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
            } else {
                //Se crea un json que mande el error al sistema
                $JSON = array(
                    'Code' => '501',
                    'Message' => $database->getMessage(501),
                    'Status' => 'Error'
                );
                $response->withStatus(501)->withHeader("Content-Type", "application/json")
                ->write(json_encode($JSON, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
            }
        } else { //Quiere decir que el correo que mando no existe en la base de datos
            //Se crea un json que mande el error al sistema
            $JSON = array(
                'Code' => '500',
                'Message' => $database->getMessage(500),
                'Status' => 'Error'
            );
            $response->withStatus(500)->withHeader("Content-Type", "application/json")
                ->write(json_encode($JSON, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        }
    } else { //Quiere decir que mando un nombre de usuario entonces es un administrador
        //Autores: 
        //Britany Itaii Perez Cadena - Fatima Jimenez Bazan

        //buscamos al usuarios en la coleccion de usuarios
        $searchUser = $database->searchUser($user);
        if($searchUser != false){ //Si el usuario existe
            //Debemos verificar que la contraseña sea correcta
            $getUser = $database->getPassword($user);
            if($getUser === md5($pass)){ //Si la contraseña es correcta vamos a crear el token para enviarlo
                $now = new DateTime();
                $future = new DateTime("+20 minutes");
                $aud = "http://localhost/serviciosweb/Proyecto/Proyecto-pt1/Vistas/Admin/";
                $payload = [
                    "iss" => "IFFI Web Services",
                    "iat" => $now->getTimeStamp(),
                    "exp" => $future->getTimeStamp(),
                    "aud" => $aud,
                    "user" => $user,
                    "role" => "admin"
                ];
                $secret = '123456789user_gral';
                $token = JWT::encode($payload, $secret, "HS256");//JWT::base64_encode($payload, $secret, "HS256");//
                $data["Code"] = 201;
                $data["token"] = $token;
                $data["expires"] = $future->getTimeStamp();
                $data["user"] = $user;
                $data["rol"] = "admin";
                $data["Status"] = "Success";
                $response->withStatus(201)->withHeader("Content-Type", "application/json")
                                ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
            } else {
                //Se crea un json que mande el error al sistema
                $JSON = array(
                    'Code' => '501',
                    'Message' => $database->getMessage(501),
                    'Status' => 'Error'
                );
                $response->withStatus(501)->withHeader("Content-Type", "application/json")
                ->write(json_encode($JSON, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
            }
        } else { //Si el usuario no existe
            //Autores: 
            //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
            //Se crea un json que mande el error al sistema
            $JSON = array(
                'Code' => '500',
                'Message' => $database->getMessage(500),
                'Status' => 'Error'
            );
            $response->withStatus(500)->withHeader("Content-Type", "application/json")
                ->write(json_encode($JSON, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        }
    }
    return $response;
});

$app->run(); 
//No se que hacer, como estan
?>