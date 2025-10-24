// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Business, User } = require('../models');
require('dotenv').config();

const router = express.Router();

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
  try {
    // 1. Obtenemos los datos del cuerpo de la petición
    const { businessName, userName, email, password } = req.body;

    // 2. Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Creamos el negocio
    const newBusiness = await Business.create({
      name: businessName,
      subscription_plan: 'seed'
    });

    // 4. Creamos el usuario, asociándolo con el negocio
    const newUser = await User.create({
      name: userName,
      email: email,
      password_hash: hashedPassword,
      business_id: newBusiness.id
    });

    // 5. Generamos el token DESPUÉS de crear el usuario
    const token = jwt.sign(
      { userId: newUser.id, businessId: newBusiness.id },
      process.env.JWT_SECRET, // Usamos la clave del .env
      { expiresIn: '24h' }
    );
    
    // 6. Enviamos la respuesta
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al registrar el usuario.' });
  }
});


// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta.' });
    }

    // Generamos el token usando la clave del .env
    const token = jwt.sign(
      { userId: user.id, businessId: user.business_id },
      process.env.JWT_SECRET, // Usamos la clave del .env
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al iniciar sesión.' });
  }
});

module.exports = router;