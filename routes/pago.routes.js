const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

// Instanciar correctamente el cliente de Mercado Pago
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

console.log("🔑 Access Token usado:", process.env.MERCADO_PAGO_ACCESS_TOKEN);

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
        success: "https://oraculix-frontend.vercel.app/pago-exitoso",
        failure: "https://oraculix-frontend.vercel.app/pago-error",
        pending: "https://oraculix-frontend.vercel.app/",
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


