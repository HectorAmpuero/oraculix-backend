// backend/routes/lectura.routes.js
const express = require("express");
const router = express.Router();
const { guardarLectura } = require("../controllers/lectura.controller");
const db = require("../config/db"); // 👈 Agregamos conexión a la BD para hacer consultas directas

// Función para generar números únicos aleatorios
const generarNumerosUnicos = (cantidad, max) => {
  const numeros = new Set();
  while (numeros.size < cantidad) {
    const num = Math.floor(Math.random() * max) + 1;
    numeros.add(num);
  }
  return Array.from(numeros);
};

// POST: Crear lectura tradicional (si llegara alguien sin pagar)
router.post("/", async (req, res) => {
  const { nombre, nacimiento, personaQuerida, fechaImportante, deseos } = req.body;

  if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos) {
    return res.status(400).json({ error: "Faltan datos del formulario" });
  }

  const numerosPrincipales = generarNumerosUnicos(6, 41);
  const numerosComplementarios = generarNumerosUnicos(14, 25);

  // Guardamos lectura
  req.body.numeros = {
    principales: numerosPrincipales,
    complementarios: numerosComplementarios
  };

  await guardarLectura(req, res);
});

// GET: Buscar lectura por preference_id después del pago exitoso
router.get("/preference/:preference_id", async (req, res) => {
  const { preference_id } = req.params;

  try {
    const resultado = await db.query(
      "SELECT * FROM lecturas WHERE preference_id = $1",
      [preference_id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Lectura no encontrada" });
    }

    res.json({ lectura: resultado.rows[0] });
  } catch (error) {
    console.error("❌ Error al buscar lectura:", error);
    res.status(500).json({ error: "Error al buscar lectura" });
  }
});

module.exports = router;
