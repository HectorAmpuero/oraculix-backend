const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Preference } = require("mercadopago");

// ✅ Crear instancia configurada
const mp = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

router.post("/crear-preferencia", async (req, res) => {
    console.log("📦 Recibido payload:", req.body);

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
                success: "https://www.oraculix.cl/pago-exitoso",
                failure: "https://www.oraculix.cl/pago-error",
                pending: "https://www.oraculix.cl/pago-pendiente",
            },
            auto_return: "approved",
        };

        const response = await new Preference(mp).create({ body: preference });

        res.json({ id: response.id });
    } catch (error) {
        console.error("❌ Error al crear preferencia:", error);
        res.status(500).json({ error: "No se pudo generar la preferencia" });
    }
});

module.exports = router;







