require("dotenv").config();
const pool = require("../config/db");
const { generarInterpretacion } = require("../utils/openai");

const guardarLectura = async (req, res) => {
  const {
    nombre,
    nacimiento,
    personaQuerida,
    fechaImportante,
    deseos,
    numerosPrincipales,
    numerosComplementarios,
  } = req.body;

  if (
    !nombre ||
    !nacimiento ||
    !personaQuerida ||
    !fechaImportante ||
    !deseos ||
    !numerosPrincipales ||
    !numerosComplementarios
  ) {
    return res
      .status(400)
      .json({ error: "Faltan datos para guardar la lectura" });
  }

  try {
    // Generar respuesta de OpenAI
    const interpretacion = await generarInterpretacion({
      nombre,
      nacimiento,
      personaQuerida,
      fechaImportante,
      deseos,
      numerosPrincipales,
      numerosComplementarios,
    });

    // Guardar en la base de datos
    const result = await pool.query(
      `INSERT INTO lecturas 
        (nombre, nacimiento, persona_querida, fecha_importante, deseos, numeros_principales, numeros_complementarios)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        nombre,
        nacimiento,
        personaQuerida,
        fechaImportante,
        deseos,
        numerosPrincipales,
        numerosComplementarios,
      ]
    );

    res.status(201).json({
      mensaje: "Lectura guardada exitosamente",
      lectura: result.rows[0],
      interpretacion, // ✅ Aquí enviamos la respuesta de OpenAI al frontend
    });
  } catch (error) {
    console.error("Error al guardar la lectura:", error);
    res.status(500).json({ error: "Error al guardar la lectura" });
  }
};

module.exports = { guardarLectura };