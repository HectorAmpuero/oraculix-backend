require("dotenv").config();
console.log("🔑 OpenAI Key cargada:", process.env.OPENAI_API_KEY);

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const mercadopago = require("./config/mercadoPago");
const lecturaRoutes = require("./routes/lectura.routes");
const openaiRoutes = require("./routes/openai.routes");
const interpretacionRoutes = require("./routes/interpretacion.routes");
const pagoRoutes = require("./routes/pago.routes");
const usuarioRoutes = require("./routes/usuario.routes");

const db = require("./config/db"); // ✅ Agregado para probar conexión

// 🌐 Verificar conexión a la base de datos al iniciar
db.query("SELECT NOW()")
  .then(res => console.log("✅ Conexión a la DB OK:", res.rows[0]))
  .catch(err => console.error("❌ Error de conexión a la DB:", err.message));

const app = express();
const PORT = process.env.PORT;

// ✅ Middleware de CORS
app.use(
  cors({
    origin: ['https://oraculix.cl', 'https://www.oraculix.cl'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

// ✅ Aceptar preflight requests
app.options("*", cors());

// ✅ Middleware útil
app.use(express.json());
app.use(morgan("dev"));

// ✅ Rutas API
app.use("/api/lectura", lecturaRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/interpretacion", interpretacionRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/usuarios", usuarioRoutes);

// ✅ Ruta de prueba
app.get("/api", (req, res) => {
  res.send("🌟 Servidor backend de Oraculix funcionando 🧿");
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log("🚀 Servidor backend corriendo en http://localhost:" + PORT);
  console.log("🔁 Servidor reiniciado correctamente");
});


