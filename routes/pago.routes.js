const express = require("express");
const router = express.Router();

const mp = require("../config/mercadoPago");

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
        success: "https://oraculix.cl/pago-exitoso",
        failure: "https://oraculix.cl/pago-error",
        pending: "https://oraculix.cl/",
      },
      auto_return: "approved",
    };

    const response = await mp.preferences.create({ body: preference });

    res.json({ id: response.id });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({ error: "No se pudo generar la preferencia" });
  }
});

module.exports = router;



