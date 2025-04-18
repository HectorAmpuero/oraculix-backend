const express = require("express");
const router = express.Router();
const { generarInterpretacion } = require("../controllers/openai.controller");

router.post("/", generarInterpretacion);

module.exports = router;