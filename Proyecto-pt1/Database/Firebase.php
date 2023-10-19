<?php
    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
    require __DIR__ . '/../vendor/autoload.php';

    use Kreait\Firebase\Factory;
    use Kreait\Firebase\ServiceAccount;
    use Slim\Http\Request;
    use Slim\Http\Response;

    class FirebaseAPI {

        private $database;

        public function __construct() {
            $this->getDatabase();
        }

        private function getDatabase() {
            $firebase = (new Factory)
            ->withServiceAccount(__DIR__ . '/firebase_credentials.json')
            ->withDatabaseUri('https://webapi-e1e51-default-rtdb.firebaseio.com/');

            $this->database = $firebase->createDatabase();
        }

        public function searchUser($name){
            $usuario = $this->database->getReference('usuarios/' . $name)->getValue();
            if(!is_null($usuario)) {
                return true;
            }
            return false;
        }

        public function getPassword($user) {
            $password = $this->database->getReference('usuarios/' . $user)->getValue();
            return $password;
        }

        public function searchCategory($categoria) {
            $productos = $this->database->getReference('productos/' . $categoria)->getValue();
            if(!is_null($productos)) {
                return true;
            }
            return false;
        }

        public function getProducts($categoria) {
            $productos = $this->database->getReference('productos/' . $categoria)->getValue();
            return $productos;
        }

        public function searchISBN($isbn) {
            $detalles = $this->database->getReference('detalles/' . $isbn)->getValue();
            if(!is_null($detalles)) {
                return true;
            }
            return false;
        }

        //Autores:
        //Britany Itaii Perez Cadena - Fatima Jimenez Bazan

        public function getDetails($isbn) {
            $detalles = $this->database->getReference('detalles/' . $isbn)->getValue();
            return $detalles;
        }

        public function setProduct($categoria, $isbn, $detalles) {
            $data = json_decode($detalles);
            //Agregación de productos
            $this->database->getReference('productos/' . $categoria. '/' . $isbn . '/')->set($data->Nombre);

            //Agregación de Detalles
            $this->database->getReference('detalles/' . $isbn)->set($isbn);
            $this->database->getReference('detalles/' . $isbn . '/' . 'Autor/')->set($data->Autor);  
            $this->database->getReference('detalles/' . $isbn . '/' . 'Descuento/')->set($data->Descuento); 
            $this->database->getReference('detalles/' . $isbn . '/' . 'Editorial/')->set($data->Editorial); 
            $this->database->getReference('detalles/' . $isbn . '/' . 'Fecha/')->set($data->Fecha); 
            $this->database->getReference('detalles/' . $isbn . '/' . 'Nombre/')->set($data->Nombre); 
            $this->database->getReference('detalles/' . $isbn . '/' . 'Precio/')->set($data->Precio);    
        }

        public function updateProduct($categoria, $isbn, $detalles) {
            //Creamos arreglos para actualizar el producto y sus detalles
            $data_prod = array(
                $isbn => $detalles['Nombre']
            );
            
            //Actualización de productos
            $this->database->getReference('productos/' . $categoria. '/')->update($data_prod);
    
            //Actualización de Detalles
            $this->database->getReference('detalles/' . $isbn . '/')->update($detalles);
        }
    
        public function deleteProduct($isbn) {
            //Eliminación de productos
            //Obtenemos la subcadena
            $del_prod = substr($isbn, 0, 3);
            //switch - case para ir eliminando los datos de la categoria
            switch($del_prod){
                case "ART":
                    $this->database->getReference('productos/articulos/' . $isbn)->remove();
                    break;
                case "LIB":
                    $this->database->getReference('productos/libros/' . $isbn)->remove();
                    break;
                case "COM":
                    $this->database->getReference('productos/comics/' . $isbn)->remove();
                    break;
                case "MAN":
                    $this->database->getReference('productos/mangas/' . $isbn)->remove();
                    break;
            }
            //Eliminnación de detalles
            $this->database->getReference('detalles/' . $isbn)->remove();
        }

        public function getDetailsAllProducts(){
            $detalles = $this->database->getReference('detalles/')->getValue();
            return $detalles;
        }

        public function getMessage($code) {
            $mensaje = $this->database->getReference('respuestas/' . $code)->getValue();
            if(!is_null($mensaje)) {
                return $mensaje;
            }
            return false;
        }

        public function getDetailsAllUsers(){
            $usuarios = $this->database->getReference('usuarios_sistema/')->getValue();
            return $usuarios;
        }
    }

    //Autores:
    //Britany Itaii Perez Cadena - Fatima Jimenez Bazan
?>