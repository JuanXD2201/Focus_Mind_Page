import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from "./routes/authRoutes.js";

// Crear __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos
app.use(express.static(path.join(__dirname, 'src', 'public')));

// HTML estático
app.use('/usuario', express.static(path.join(__dirname, 'usuario')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Rutas
app.use('/auth', authRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'usuario', 'login.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
