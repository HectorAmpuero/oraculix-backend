const db = require("../config/db");

// Registrar usuario
const registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const yaExiste = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (yaExiste.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado." });
    }

    const resultado = await db.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, fecha_creacion",
      [nombre, email, password]
    );

    return res.status(201).json({ usuario: resultado.rows[0] });

  } catch (err) {
    console.error("🔥 Error al registrar usuario:", err); // Mostramos error completo
    return res.status(500).json({ error: "Error del servidor.", detalle: err.message });
  }
};

// Login usuario
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const resultado = await db.query(
      "SELECT * FROM usuarios WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const { id, nombre, email: correo } = resultado.rows[0];
    return res.json({ usuario: { id, nombre, email: correo } });

  } catch (err) {
    console.error("🔥 Error al iniciar sesión:", err);
    return res.status(500).json({ error: "Error del servidor.", detalle: err.message });
  }
};

module.exports = { registrarUsuario, loginUsuario };


