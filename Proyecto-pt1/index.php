<?php
/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/Database/Firebase.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods:  GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); //cumplido su capricho ajaj :) A
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
$app->setBasePath("/serviciosweb/Proyecto/Proyecto-pt1");

$app->addErrorMiddleware(true, true, true);

$database = new FirebaseAPI(); //Llamada a la base de datos

$app->add(new CorsMiddleware([
    'origin' => '*', // permitir cualquier origen
    'methods' => ['GET', 'POST', 'OPTIONS'], // permitir los métodos GET, POST y OPTIONS
    // "exposeHeaders" => ["Authorization"],
    // "allowHeaders" => ["Authorization"], //cual seria la diferencias en que lleve punto y en que no lo lleve :)
    'headers.allow' => ['Content-Type', 'Authorization'], // permitir los headers Content-Type y Authorization
    'headers.expose' => ['Authorization'], // no exponer ningún header
    'credentials' => false, // no permitir enviar cookies de sesión u otros datos de autenticación
    'cache' => 0, // no utilizar caché
])); 

// //Funcion de login
// $app->get('/', function ($request, $response, $args){
//     $response->getBody()->write(file_get_contents("Login/index.php")); //abrimos el login para que el usuario se logee o se registre
//         return $response;
// });


//listar todos los productos
$app->get("/listarProductos", function ($request, $response, $args) use ($database) {
    $productos = $database->getDetailsAllProducts();
    $responseArray = array();
    foreach ($productos as $key => $value) {
        $producto = array();
        $producto['ISBN'] = $key;
        $producto['Nombre'] = $value['Nombre'];
        $producto['Autor'] = $value['Autor'];
        $producto['Editorial'] = $value['Editorial'];
        $producto['Fecha'] = $value['Fecha'];
        $producto['Precio'] = $value['Precio'];
        $producto['Descuento'] = $value['Descuento'];
        array_push($responseArray, $producto); //agregamos el producto al array de respuesta
    }
    $response->getBody()->write(json_encode($responseArray));
    return $response;
});

/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/

//Obteniendo los detalles de un producto
$app->get("/detalles/{clave}", function ($reques, $response, $args) use ($database) {
    $isbn = $args['clave'];
    $detalles = $database->getDetails($isbn);
    if ($detalles != null) {
        $JSON = array(
            'Code' => '201',
            'Message' => $database->getMessage(201),
            'Data' => $detalles,
            'Status' => 'Success'
        );
        $response->getBody()->write(nl2br(json_encode($JSON))); //json_encode($JSON) convierte el array en un string JSON

    } else {
        $JSON = array(
            'Code' => '301',
            'Message' => $database->getMessage(301),
            'Data' => '',
            'Status' => 'Error'
        );
        $response->getBody()->write(json_encode($JSON));
    }
    return $response;
});


//Obteniendo los productos de una categoria
$app->get("/productos/{categoria}", function ($reques, $response, $args) use ($database) {
    $categoria = $args['categoria'];
    $productos = $database->getProducts($categoria);
    if ($productos != null) {
        $JSON = array(
            'Code' => '200',
            'Message' => $database->getMessage(200),
            'Data' => $productos,
            'Status' => 'Success'
        );
        $response->getBody()->write(json_encode($JSON)); //json_encode($JSON) convierte el array en un string JSON

    } else {
        $JSON = array(
            'Code' => '300',
            'Message' => $database->getMessage(300),
            'Data' => '',
            'Status' => 'Error'
        );
        $response->getBody()->write(json_encode($JSON));
    }
    return $response;
});

/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/

//Agregando un nuevo producto
$app->post("/producto", function ($request, $response, $args) use ($database) {
    $reqPost = $request->getParsedBody();
    $details = array(
        'Autor' => $reqPost["Autor"],
        'Descuento' => $reqPost["Descuento"],
        'Editorial' => $reqPost["Editorial"],
        'Fecha' => $reqPost["Fecha"],
        'Nombre' => $reqPost["Nombre"],
        'Precio' => $reqPost["Precio"]
    );

    $isbn = $reqPost["ISBN"];
    $categoria = $reqPost["Categoria"];

    $verIsbn = $database->searchISBN($isbn);
    if ($verIsbn == null) { //si el isbn no existe
        //insertamos el producto
        $database->setProduct($categoria, $isbn, json_encode($details));
        //realizamos la busqueda del producto para verificar si se ha insertado
        $prod = $database->getProducts($categoria);
        $det = $database->getDetails($isbn);
        if ($prod != null && $det != null) { //si se inserto correctamente
            $JSON = array(
                'Code' => '202',
                'Message' => $database->getMessage(202),
                'Data' => date("Y-m-d T h:i:s"),
                'Status' => 'Success'
            );
            $response->getBody()->write(json_encode($JSON));
        } else { //si no se inserto correctamente
            $JSON = array(
                'Code' => '999',
                'Message' => $database->getMessage(999),
                'Status' => 'Error'
            );
            $response->getBody()->write(json_encode($JSON));
        }
    } else { //si el isbn ya existe
        $JSON = array(
            'Code' => '302',
            'Message' => $database->getMessage(302),
            'Status' => 'Error'
        );
        $response->getBody()->write(json_encode($JSON));
    }
    //Para cualquiera de los casos retornamos la respuesta
    return $response;
});

//Actualizar los detalles de un producto 
$app->put("/producto/detalles", function ($request, $response, $args) use ($database) {
   //accedemos al Json enviado por el clinete
   $respuesta = $request->getParsedBody();
    $isbn = $respuesta['Isbn'];
    $categoria = $respuesta['Categoria'];
    $details = array(
        'Autor' => $respuesta["Autor"],
        'Descuento' => $respuesta["Descuento"],
        'Editorial' => $respuesta["Editorial"],
        'Fecha' => $respuesta["Fecha"],
        'Nombre' => $respuesta["Nombre"],
        'Precio' => $respuesta["Precio"]
    );
    $verISBN = $database->searchISBN($isbn);
    
    if ($verISBN != null) { //si el isbn existe
        $database->updateProduct($categoria, $isbn, $details);
        $JSON = array(
            'Code' => '203',
            'Message' => $database->getMessage(203),
            'Data' => date("Y-m-d T h:i:s"),
            'Status' => 'Success'
        );
        $response->getBody()->write(json_encode($JSON));
    } else { //si el isbn no existe 
        $JSON = array(
            'Code' => '301',
            'Message' => $database->getMessage(301),
            'Status' => 'Error'
        );
        $response->getBody()->write(json_encode($JSON));
    }

    return $response;
});


/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/


//Eliminar un producto
$app->delete("/producto", function ($request, $response, $args) use ($database) {
    $req = $request->getParsedBody();
    $isbn = $req['isbn'];
    $buscarISBN = $database->searchISBN($isbn);
    if ($buscarISBN != null) { //si el isbn existe y el producto se elimina
        $database->deleteProduct($isbn);
        $JSON = array(
            'Code' => '204',
            'Message' => $database->getMessage(204),
            'Data' => date("Y-m-d T h:i:s"),
            'Status' => 'Success'
        );
        $response->getBody()->write(json_encode($JSON));
    } else { //si el isbn no existe 
        $JSON = array(
            'Code' => '301',
            'Message' => $database->getMessage(301),
            'Status' => 'Error'
        );
        $response->getBody()->write(json_encode($JSON));
    }
    return $response;
});

$app->run();

/* 
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
*/
?>