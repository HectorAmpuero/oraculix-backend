const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const { guardarLectura } = require("../controllers/lectura.controller");

const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

router.post("/crear-preferencia", async (req, res) => {
  console.log("📦 Recibido payload:", req.body);

  const { nombre, nacimiento, personaQuerida, fechaImportante, deseos, email } = req.body;

  if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos || !email) {
    return res.status(400).json({ error: "Faltan datos del formulario" });
  }

  try {
    // 1️⃣ Intentamos guardar la lectura (validación de los 60 días incluida)
    let lecturaBloqueada = false;
    let mensajeBloqueo = "";

    const customRes = {
      status: (code) => {
        if (code === 403) {
          lecturaBloqueada = true;
          return {
            json: (data) => {
              mensajeBloqueo = data.mensaje || data.error;
            },
          };
        }
        return {
          json: () => {},
        };
      },
    };

    // Llamamos a guardarLectura simulando res
    await guardarLectura(req, customRes, true);

    if (lecturaBloqueada) {
      return res.status(403).json({
        error: mensajeBloqueo,
      });
    }

    // 2️⃣ Creamos la preferencia de pago
    const preference = {
      items: [
        {
          title: "Lectura numerológica Oraculix",
          unit_price: 1500,
          quantity: 1,
          currency_id: "CLP",
        },
      ],
      back_urls: {
        success: "https://www.oraculix.cl/pago-exitoso",
        failure: "https://www.oraculix.cl/pago-error",
        pending: "https://www.oraculix.cl/pago-pendiente",
      },
      auto_return: "approved",
    };

    const response = await new Preference(mp).create({ body: preference });

    // 3️⃣ Guardamos el preference_id real en DB
    req.body.preference_id = response.id;
    await guardarLectura(req, { status: () => ({ json: () => {} }) }, true); // segunda vez para actualizar preference_id

    // 4️⃣ Respondemos al frontend
    res.json({ id: response.id });

  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({ error: "No se pudo generar la preferencia" });
  }
});

module.exports = router;









