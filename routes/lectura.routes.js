// backend/routes/lectura.routes.js
const express = require("express");
const router = express.Router();
const { guardarLectura } = require("../controllers/lectura.controller");

// Función para generar números únicos aleatorios
const generarNumerosUnicos = (cantidad, max) => {
  const numeros = new Set();
  while (numeros.size < cantidad) {
    const num = Math.floor(Math.random() * max) + 1;
    numeros.add(num);
  }
  return Array.from(numeros);
};

router.post("/", async (req, res) => {
  const { nombre, nacimiento, personaQuerida, fechaImportante, deseos } = req.body;

  if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos) {
    return res.status(400).json({ error: "Faltan datos del formulario" });
  }

  const numerosPrincipales = generarNumerosUnicos(6, 41);
  const numerosComplementarios = generarNumerosUnicos(14, 25);

  // Ahora que tenemos todos los datos, usamos el controller para guardarlos
  req.body.numeros = {
    principales: numerosPrincipales,
    complementarios: numerosComplementarios
  };

  await guardarLectura(req, res);
});

module.exports = router;