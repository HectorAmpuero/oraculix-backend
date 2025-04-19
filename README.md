# Oraculix - Backend

Este repositorio contiene el backend del proyecto Oraculix, desplegado en Render.

## 🔧 Tecnologías

- Node.js
- Express
- PostgreSQL
- OpenAI API
- Mercado Pago SDK
- dotenv

## 🗂 Estructura

```
/
├── controllers/
├── routes/
├── utils/
├── config/
├── server.js
├── .env
├── package.json
└── render.yaml
```

## 🚀 Despliegue en Render

### 1. Crear servicio web en Render

- Tipo: Web Service
- Branch: `master`
- Comando de build: `npm install`
- Comando de inicio: `node server.js`
- Directorio de trabajo: raíz del proyecto

### 2. Variables de entorno necesarias

En Render → **Environment → Environment Variables**:

| Clave                       | Valor                          |
|----------------------------|---------------------------------|
| `OPENAI_API_KEY`           | Tu clave secreta de OpenAI     |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de prueba de MercadoPago |

### 3. URL pública

La app quedará accesible desde:  
`https://oraculix-backend.onrender.com`

## 📌 Notas

- Asegúrate que el puerto que escucha `server.js` sea el correcto (Render espera `process.env.PORT`).
- No subir `.env` al repositorio.
