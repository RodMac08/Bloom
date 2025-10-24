// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    // 1. Extraer el token del header 'Authorization'
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    // 2. Verificar que el token sea válido usando el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Buscar al usuario en la base de datos
    const user = await User.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new Error();
    }

    // 4. Adjuntar el usuario a la petición y continuar
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Autenticación requerida.' });
  }
};

module.exports = auth;