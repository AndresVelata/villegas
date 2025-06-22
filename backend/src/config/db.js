const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 📌 Verificar la conexión al iniciar
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado a la base de datos MariaDB");
    connection.release(); // Liberar la conexión después de usarla
  } catch (err) {
    console.error("❌ Error al conectar con la base de datos:", err.message);
  }
}

checkConnection();

module.exports = { pool };
