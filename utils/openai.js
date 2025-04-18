// backend/utils/openai.js
require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generarInterpretacion = async (datos) => {
  const prompt = `
Eres un guía espiritual experto en numerología. A partir de los siguientes datos del usuario:

- Nombre: ${datos.nombre}
- Fecha de nacimiento: ${datos.nacimiento}
- Persona querida: ${datos.personaQuerida}
- Fecha importante: ${datos.fechaImportante}
- Deseos: ${datos.deseos}
- Números principales: ${datos.numerosPrincipales.join(", ")}
- Números complementarios: ${datos.numerosComplementarios.join(", ")}

Escribe un mensaje motivacional, espiritual e intuitivo explicando el significado de sus números y cómo puede usarlos en su vida o juegos de azar. Sé cálido y positivo.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

module.exports = { generarInterpretacion };
