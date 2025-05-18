import express from 'express';
import{pool} from '../database/connection.js'; // Asegúrate que el archivo también use ES Modules
import bcrypt from 'bcrypt';

const router = express.Router();
const SALT_ROUNDS = 10;

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, password, isAdmin } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'Por favor completa todos los campos requeridos.' });
    }

    const [existingUser] = await pool.query('SELECT * FROM users WHERE correo = ?', [correo]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
      'INSERT INTO users (nombre, correo, contraseña, isAdmin) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, isAdmin ? 1 : 0]
    );

    return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.contraseña);

    if (!match) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    return res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        isAdmin: user.isAdmin === 1
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
});

export default router;
