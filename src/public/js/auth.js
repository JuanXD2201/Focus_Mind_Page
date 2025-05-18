const express = require('express');
const router = express.Router();
const connection = require('../database/connection'); // tu conexión MySQL
const bcrypt = require('bcryptjs');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña, es_admin } = req.body;
  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  try {
    // Verificar si usuario ya existe
    const [existingUser] = await connection.promise().query('SELECT * FROM users WHERE correo = ?', [correo]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario
    await connection.promise().query(
      'INSERT INTO users (nombre, correo, contraseña, es_admin) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, es_admin ? 1 : 0]
    );

    return res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  if (!correo || !contraseña) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  try {
    const [rows] = await connection.promise().query('SELECT * FROM users WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Aquí podrías crear un token JWT para sesión, pero para simplificar:
    return res.json({
      message: 'Login exitoso.',
      user: {
        nombre: user.nombre,
        correo: user.correo,
        es_admin: user.es_admin === 1
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
});

module.exports = router;
