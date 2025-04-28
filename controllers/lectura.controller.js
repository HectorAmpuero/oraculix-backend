require("dotenv").config();
const db = require("../config/db");
const { generarInterpretacion } = require("../utils/openai");

const guardarLectura = async (req, res, desdePago = false) => {
  const {
    nombre,
    nacimiento,
    personaQuerida,
    fechaImportante,
    deseos,
    preference_id,
    email // 🆕 ahora también aceptamos email
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

    // ✅ Insertar en la base de datos incluyendo email
    const resultado = await db.query(
      `INSERT INTO lecturas 
      (nombre, nacimiento, persona_querida, fecha_importante, deseos, 
       numeros_principales, numeros_complementarios, interpretacion, preference_id, email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        nombre,
        nacimiento,
        personaQuerida,
        fechaImportante,
        deseos,
        numerosPrincipales.join(", "),
        numerosComplementarios.join(", "),
        interpretacion,
        preference_id || null,
        email || null // 🆕 si no viene email, guardamos null
      ]
    );

    if (!desdePago) {
      res.status(201).json({
        mensaje: "Lectura guardada exitosamente",
        lectura: resultado.rows[0]
      });
    }

  } catch (error) {
    console.error("❌ Error al guardar la lectura:", error);
    if (!desdePago) {
      res.status(500).json({ error: "Error al guardar la lectura" });
    }
  }
};

module.exports = { guardarLectura };


