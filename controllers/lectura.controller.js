require("dotenv").config();
const db = require("../config/db");
const { generarInterpretacion } = require("../utils/openai");

const guardarLectura = async (req, res) => {
  const {
    nombre,
    nacimiento,
    personaQuerida,
    fechaImportante,
    deseos
  } = req.body;

  if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos) {
    return res.status(400).json({ error: "Faltan datos para guardar la lectura" });
  }

  try {
    // ✅ Generar interpretación y números
    const {
      interpretacion,
      numerosPrincipales,
      numerosComplementarios
    } = await generarInterpretacion({
      nombre,
      nacimiento,
      personaQuerida,
      fechaImportante,
      deseos
    });

    // ✅ Insertar en la base de datos
    const resultado = await db.query(
      `INSERT INTO lecturas 
      (nombre, nacimiento, persona_querida, fecha_importante, deseos, 
       numeros_principales, numeros_complementarios, interpretacion) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        nombre,
        nacimiento,
        personaQuerida,
        fechaImportante,
        deseos,
        numerosPrincipales.join(", "),
        numerosComplementarios.join(", "),
        interpretacion
      ]
    );

    res.status(201).json({
      mensaje: "Lectura guardada exitosamente",
      lectura: resultado.rows[0]
    });

  } catch (error) {
    console.error("❌ Error al guardar la lectura:", error);
    res.status(500).json({ error: "Error al guardar la lectura" });
  }
};

module.exports = { guardarLectura };
