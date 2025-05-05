require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generarInterpretacion = async (req, res) => {
  const { nombre, deseos, numerosPrincipales, numerosComplementarios } = req.body;

  if (!nombre || !deseos || !numerosPrincipales || !numerosComplementarios) {
    return res.status(400).json({ error: "Faltan datos para generar la interpretación." });
  }

  const prompt = `
Eres un guía espiritual numerólogo. Da una interpretación cálida, positiva e inspiradora basada en los siguientes datos:

Nombre del usuario: ${nombre}
Deseos: ${deseos}
Números principales: ${numerosPrincipales.join(", ")}
Números complementarios: ${numerosComplementarios.join(", ")}

Haz la interpretación en un párrafo breve pero significativo. Usa un tono esperanzador y espiritual. No repitas los números, enfócate en el mensaje que transmiten. Da una orientación sutil de cómo el usuario puede usar esos números en su vida (especialmente en juegos de la suerte, si lo desea). No seas literal con sus deseos; ve más allá, entrega un mensaje con profundidad. Finaliza con una frase de cierre motivadora o de sabiduría suave. `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const respuesta = completion.choices[0].message.content;
    res.json({ interpretacion: respuesta });

  } catch (error) {
    console.error("Error al generar interpretación:", error);
    res.status(500).json({ error: "Error al generar interpretación con OpenAI" });
  }
};

module.exports = { generarInterpretacion };
