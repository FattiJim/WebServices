<?php

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

        public function searchSystemUser($id){
            $sysUser = $this->database->getReference('usuarios_sistema/'. $id)->getValue();
            if(!is_null($sysUser)) {
                return true;
            }
            return false;
        }

        public function getSystemUser($id){
            $sysUser = $this->database->getReference('usuarios_sistema/'. $id)->getValue();
            return $sysUser;
        }

        public function getMessage($code) {
            $mensaje = $this->database->getReference('respuestas/' . $code)->getValue();
            if(!is_null($mensaje)) {
                return $mensaje;
            }
            return false;
        }
    }
?>