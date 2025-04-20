const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

// Ruta para registrar usuario
router.post("/registrar", usuarioController.registrarUsuario);

// Ruta para login
router.post("/login", usuarioController.loginUsuario);

module.exports = router;
