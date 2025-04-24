require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function obtenerNumerosAleatorios(cantidad, maximo) {
  const numeros = new Set();
  while (numeros.size < cantidad) {
    numeros.add(Math.floor(Math.random() * maximo) + 1);
  }
  return Array.from(numeros);
}

const generarInterpretacion = async (datos) => {
  // Generar números aleatorios
  const numerosPrincipales = obtenerNumerosAleatorios(6, 41);
  const numerosComplementarios = obtenerNumerosAleatorios(14, 25);

  const prompt = `
Eres un guía espiritual experto en numerología. A partir de los siguientes datos del usuario:

- Nombre: ${datos.nombre}
- Fecha de nacimiento: ${datos.nacimiento}
- Persona querida: ${datos.personaQuerida}
- Fecha importante: ${datos.fechaImportante}
- Deseos: ${datos.deseos}
- Números principales: ${numerosPrincipales.join(", ")}
- Números complementarios: ${numerosComplementarios.join(", ")}

Escribe un mensaje motivacional, espiritual e intuitivo explicando el significado de sus números y cómo puede usarlos en su vida o juegos de azar. Sé cálido y positivo.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    interpretacion: response.choices[0].message.content,
    numerosPrincipales,
    numerosComplementarios,
  };
};

module.exports = { generarInterpretacion };

