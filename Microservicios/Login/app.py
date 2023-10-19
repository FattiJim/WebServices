from flask import Flask, request, jsonify, send_from_directory
import hashlib
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__, static_folder='static') # create an instance of the Flask class

cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred, {'databaseURL': 'https://webapi-e1e51-default-rtdb.firebaseio.com/'})


@app.route('/static/<filename>')
def serve_js(filename):
    return send_from_directory('static', filename)

#abrimos la pag principal
#imprimimos un mensaje en la pagina principal
@app.route('/')
def index():
    #abrimos el archivo html
    return app.send_static_file('index.html')


    #iniciamos el servidor
if __name__ == '__main__':
    CORS(app)  #acepta cuakquier peticion de puertos
    app.run(debug=True, port=4000)

#Autores:
#Britany Itaii Perez Cadena - Fatima Jimenez Bazan  


