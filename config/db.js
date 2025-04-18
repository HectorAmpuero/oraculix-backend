// backend/config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",         // 👈 Cambia si tu usuario es diferente
  host: "localhost",
  password: "1234", // 👈 Reemplaza por tu clave
  database: "oraculix_db",      // 👈 Asegúrate que esta base exista
  port: 5432,
});

module.exports = pool;