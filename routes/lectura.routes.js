const express = require("express");
const router = express.Router();
const { guardarLectura } = require("../controllers/lectura.controller");
const db = require("../config/db");

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

// 🆕 GET: Obtener lecturas filtradas por email para historial privado
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const resultado = await db.query(
      "SELECT * FROM lecturas WHERE email = $1 ORDER BY fecha_creacion DESC",
      [email]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ Error al buscar lecturas por email:", error);
    res.status(500).json({ error: "Error al buscar lecturas" });
  }
});

module.exports = router;


