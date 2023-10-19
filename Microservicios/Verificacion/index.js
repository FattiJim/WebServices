const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
app.use(cors());
const secretKey = '123456789user_gral';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ Code: 403, Message: "No autorizado", Status : "Error" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ Code: 401, Message: "Token invalido", Status : "Error" });
    }

    req.user = decoded.user;
    req.role = decoded.role;
    next(); 
  });
}

//Autores:
//Britany Itaii Perez Cadena - Fatima Jimenez Bazan  

app.get('/', verifyToken, (req, res) => {
  res.status(200).json({ Code: 200, username: req.user, role: req.role, Status: "Success" });
});

const eliminarToken = (req, res, next) => {
  // Verificar si hay un token en la cabecera de autorización //No creo que lo lea, porque lo esta pasando como header de autorizacion
  const token = req.headers.authorization;
  if (token) {
    // Eliminar el token de la cabecera de autorización
    delete req.headers.authorization;
    return res.status(200).send('Sesión cerrada exitosamente');
  }
  return res.status(401).send('no encuentro un token en la cabecera de autorizacion');
  // Pasar la petición al siguiente middleware
  next();
}

// Ruta para cerrar sesión
app.get('/logout', eliminarToken, (req, res) => {
  // Aquí podrías realizar cualquier acción adicional que necesites para cerrar la sesión
  res.send('Sesión cerrada exitosamente');
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

//Autores:
//Britany Itaii Perez Cadena - Fatima Jimenez Bazan

