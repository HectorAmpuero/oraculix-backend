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
    email,
  } = req.body;

  if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos || !email) {
    return res.status(400).json({ error: "Faltan datos para guardar la lectura" });
  }

  try {
    const { rows: lecturasAnteriores } = await db.query(
      `SELECT * FROM lecturas 
       WHERE email = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );

    const hoy = new Date();

    if (lecturasAnteriores.length > 0) {
      const ultimaLectura = new Date(lecturasAnteriores[0].created_at);
      const diferenciaDias = Math.floor((hoy - ultimaLectura) / (1000 * 60 * 60 * 24));

      if (diferenciaDias < 60) {
        if (desdePago && !lecturasAnteriores[0].preference_id) {
          // Actualiza la lectura con el preference_id
          await db.query(
            `UPDATE lecturas SET preference_id = $1 WHERE id = $2`,
            [preference_id, lecturasAnteriores[0].id]
          );
          return;
        }

        if (!desdePago) {
          return res.status(403).json({
            error: "Tus números ya fueron revelados en una lectura reciente. Para mantener el equilibrio energético, debes esperar **dos ciclos lunares** antes de una nueva lectura. Confía en el tiempo, lo que debe llegar… llegará."
          });
        }
      }
    }

    // Generar nueva interpretación y números
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

const verificarBloqueo = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Falta el email" });
  }

  try {
    const { rows } = await db.query(
      `SELECT created_at FROM lecturas WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.json({ bloqueado: false });
    }

    const ultimaLectura = new Date(rows[0].created_at);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy - ultimaLectura) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 60) {
      return res.json({
        bloqueado: true,
        diasRestantes: 60 - diferenciaDias,
        mensaje: "Tus números ya fueron revelados en una lectura reciente. Para mantener el equilibrio energético, debes esperar **dos ciclos lunares** antes de una nueva lectura. Confía en el tiempo, lo que debe llegar… llegará."
      });
    } else {
      return res.json({ bloqueado: false });
    }

  } catch (error) {
    console.error("❌ Error al verificar bloqueo:", error);
    res.status(500).json({ error: "Error al verificar el estado" });
  }
};

module.exports = {
  guardarLectura,
  verificarBloqueo
};

