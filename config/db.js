// backend/config/db.js
const { Pool } = require("pg");

const db = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: false, // o true si estás en producción con Render
});

module.exports = pool;