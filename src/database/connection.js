import mysql from 'mysql2/promise';
// Crear pool de conexiones para mejor rendimiento y manejo de conexiones
export const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',       // Cambia por tu usuario de MySQL
  password: 'root', // Cambia por tu contraseña de MySQL
  database: 'Focus_mind',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // charset: 'utf8mb4_general_ci' // Opcional para soporte completo Unicode
});

