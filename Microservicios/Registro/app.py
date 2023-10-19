from flask import Flask, request, jsonify, send_from_directory
import hashlib
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__) 

cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred, {'databaseURL': 'https://webapi-e1e51-default-rtdb.firebaseio.com/'})


#Funcion para registrar un usuario
@app.route('/registro', methods=['POST'])
def registro():
    #obtenemos los datos del usuario
    user = request.json['user']
    password = request.json['pass']
    email = request.json['email']
    
    hash_object = hashlib.md5(password.encode())
    print(hash_object.hexdigest())
    
    #hacemos una consulta a la base de datos para verificar si el usuario ya existe
    ref = db.reference('usuarios_sistema')
    usuarios = ref.get()
    for usuario_bd in usuarios.values():
        if usuario_bd['name'] == user:
            return jsonify({"Code" : 409, "message": "El usuario ya existe", "Status" : "Error"}), 409
     
   
    num_usuarios = len(usuarios) #sacamos el numero de usuarios que hay en la base de datos
    #imprimimos el numero de usuarios en consola
    print(num_usuarios)
    num_nuevo_usuario = num_usuarios + 1
    nuevo_directorio = 'USER' + str(num_nuevo_usuario).zfill(3) #zfill rellena con ceros a la izquierda para que el número tenga 3 dígitos
    
    ref = db.reference('usuarios_sistema/' + nuevo_directorio) #creamos una referencia al nuevo directorio
    nuevo_usuario = { #creamos un nuevo diccionario con los datos del usuario
        "name": user,
        "pass": hash_object.hexdigest(),
        "rol": "user", #por defecto el rol es usuario no se para las sesiones nos podra servir
        "email": email, 
        "active": 1
    }
    #agregamos el nuevo diccionario a la base de datos
    ref.set(nuevo_usuario) #usamos set para agregar un nuevo diccionario al directorio creado
    
    #retornamos un mensaje de exito
    return jsonify({"Code" : 201, "Message": "Usuario registrado exitosamente", "Status" : "Success"}), 201

    #iniciamos el servidor
if __name__ == '__main__':
    CORS(app)  #acepta cualquier peticion de puertos
    app.run(debug=True, port=5000)

#Autores:
#Britany Itaii Perez Cadena - Fatima Jimenez Bazan  
    


