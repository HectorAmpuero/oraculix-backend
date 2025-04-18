require("dotenv").config();
console.log("OpenAI Key cargada:", process.env.OPENAI_API_KEY);
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const mercadopago = require("mercadopago");
const lecturaRoutes = require("./routes/lectura.routes");
const openAIRoutes = require("./routes/openai.routes");
const interpretacionRoutes = require("./routes/interpretacion.routes");
const pagoRoutes = require("./routes/pago.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://oraculix.cl', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

const allowedOrigins = ["https://oraculix.cl", "http://localhost:5173"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Responder OPTIONS manualmente si se necesita
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

console.log("🛡️ CORS habilitado para:", ['https://oraculix.cl', 'http://localhost:5173']);


app.use(express.json());
app.use(morgan("dev"));

// Ruta de prueba
app.get("/api", (req, res) => {
  res.send("Servidor backend de Oraculix funcionando 🚀");
});

// Rutas API
app.use("/api/lectura", lecturaRoutes);
app.use("/api/openai", openAIRoutes);
app.use("/api/interpretacion", interpretacionRoutes);
app.use("/api/pago", pagoRoutes);

// ==== Producción: Servir frontend desde dist ====
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
// =================================================


app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});