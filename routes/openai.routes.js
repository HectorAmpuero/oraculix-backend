const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = "TU_API_KEY_DE_OPENAI";

router.post("/interpretar", async (req, res) => {
  const { nombre, nacimiento, personaQuerida, fechaImportante, deseos, numerosPrincipales, numerosComplementarios } = req.body;

  const prompt = `
Eres un experto en numerología. Un usuario ingresó estos datos:

- Nombre: ${nombre}
- Fecha de nacimiento: ${nacimiento}
- Persona querida: ${personaQuerida}
- Fecha importante: ${fechaImportante}
- Deseos: ${deseos}
- Números principales: ${numerosPrincipales.join(", ")}
- Números complementarios: ${numerosComplementarios.join(", ")}

Basado en estos datos, entrega una lectura inspiradora, mágica, breve y entendible.
`;

  try {
    const respuesta = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ interpretacion: respuesta.data.choices[0].message.content });
  } catch (error) {
    console.error("Error al comunicar con OpenAI:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al generar interpretación" });
  }
});

module.exports = router;