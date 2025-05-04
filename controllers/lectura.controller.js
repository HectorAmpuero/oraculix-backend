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
    email
  } = req.body;

  if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos || !email) {
    return res.status(400).json({ error: "Faltan datos para guardar la lectura" });
  }

  try {
    // 🛡️ Verificar si ya tiene una lectura reciente (últimos 60 días)
    const { rows: lecturasAnteriores } = await db.query(
      `SELECT * FROM lecturas 
       WHERE email = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );

    if (lecturasAnteriores.length > 0) {
      const ultimaLectura = new Date(lecturasAnteriores[0].created_at);
      const hoy = new Date();
      const diferenciaDias = Math.floor((hoy - ultimaLectura) / (1000 * 60 * 60 * 24));

      if (diferenciaDias < 60) {
        return res.status(403).json({
          error: "Ciclo lunar no completado",
          mensaje: "Tus números ya fueron revelados en una lectura reciente. Para mantener el equilibrio energético, debes esperar **dos ciclos lunares** antes de una nueva lectura. Confía en el tiempo, lo que debe llegar… llegará."
        });
      }
    }

    // ✅ Generar interpretación
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

    // ✅ Insertar lectura
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
        email
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
