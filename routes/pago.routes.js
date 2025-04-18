const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// Instanciar correctamente el cliente de Mercado Pago
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

console.log("🔑 Access Token usado:", process.env.MERCADOPAGO_ACCESS_TOKEN);

const { Preference } = mercadopago;

router.post("/crear-preferencia", async (req, res) => {
  try {
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
        success: "http://localhost:5173/pago-exitoso",
        failure: "http://localhost:5173/pago-error",
        pending: "http://localhost:5173/",
      },
      auto_return: "approved",
    };

    // Crear preferencia de pago
    const response = await new Preference(mp).create({ body: preference });

    res.json({ id: response.id });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({ error: "No se pudo generar la preferencia" });
  }
});

module.exports = router;


