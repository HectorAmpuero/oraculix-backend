require("dotenv").config();
console.log("🔐 OpenAI Key cargada:", process.env.OPENAI_API_KEY);

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const mercadopago = require("./config/mercadoPago");
const lecturaRoutes = require("./routes/lectura.routes");
const openaiRoutes = require("./routes/openai.routes");
const interpretacionRoutes = require("./routes/interpretacion.routes");
const pagoRoutes = require("./routes/pago.routes");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: ['https://www.oraculix.cl', 'https://oraculix.cl', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));


app.use(express.json());

const usuarioRoutes = require("./routes/usuario.routes");
app.use("/api/usuarios", usuarioRoutes);

app.use(morgan("dev"));

// Ruta de prueba
app.get("/api", (req, res) => {
  res.send("🚀 Servidor backend de Oraculix funcionando 🚀");
});

// Rutas API
app.use("/api/lectura", lecturaRoutes);
app.use("/api/openai", openaiRoutes);
app.use("/api/interpretacion", interpretacionRoutes);
app.use("/api/pago", pagoRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🟢 Servidor backend corriendo en http://localhost:" + PORT);
  console.log("🔁 Servidor reiniciado correctamente");
});


