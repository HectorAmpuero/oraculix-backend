const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");

// Ruta para registrar usuario
router.post("/registrar", usuarioController.registrarUsuario);

router.get("/test", (req, res) => {
    res.send("Ruta /api/usuarios/test funcionando");
  });
  

// Ruta para login
router.post("/login", usuarioController.loginUsuario);

module.exports = router;
