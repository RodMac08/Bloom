// backend/routes/user.js
const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadFileToGCS } = require('../services/storageService');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/me', auth, (req, res) => {
  res.status(200).json(req.user);
});

router.put('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo.' });
  }
  try {
    const userId = req.user.id;
    const fileBuffer = req.file.buffer;
    const destination = `avatars/user_${userId}_${Date.now()}.jpg`;
    const publicUrl = await uploadFileToGCS(fileBuffer, destination);
    await User.update({ profile_image_url: publicUrl }, {
      where: { id: userId }
    });
    const updatedUser = await User.findByPk(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al subir avatar:', error);
    res.status(500).json({ error: 'Error interno al procesar la imagen.' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es inválido o está vacío.' });
    }
    await User.update({ name: name.trim() }, {
      where: { id: userId }
    });
    const updatedUser = await User.findByPk(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Hubo un error al actualizar el perfil.' });
  } 
}); 

router.put('/me/password', auth, async (req, res) => {
  try {
    const { current: currentPassword, new: newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Se requieren la contraseña actual y la nueva.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.update({ password_hash: hashedNewPassword }, {
      where: { id: userId }
    });

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });

  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: 'Hubo un error al cambiar la contraseña.' });
  }
});


module.exports = router;