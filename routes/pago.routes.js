const express = require("express");
const router = express.Router();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const { guardarLectura } = require("../controllers/lectura.controller"); // 🚀 Agregamos importar el controlador de guardarLectura

const mp = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

router.post("/crear-preferencia", async (req, res) => {
    console.log("📦 Recibido payload:", req.body);

    const { nombre, nacimiento, personaQuerida, fechaImportante, deseos } = req.body;

    if (!nombre || !nacimiento || !personaQuerida || !fechaImportante || !deseos) {
        return res.status(400).json({ error: "Faltan datos del formulario" });
    }

    try {
        // 1️⃣ Creamos la preferencia primero
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

        // 2️⃣ Luego guardamos los datos del formulario en la base de datos
        req.body.preference_id = response.id; // guardamos también el id de preferencia generado
        await guardarLectura(req, res, true); // le pasamos "true" para que no termine el response

        // 3️⃣ Respondemos solo el id de preferencia
        res.json({ id: response.id });
    } catch (error) {
        console.error("❌ Error al crear preferencia:", error);
        res.status(500).json({ error: "No se pudo generar la preferencia" });
    }
});

module.exports = router;








