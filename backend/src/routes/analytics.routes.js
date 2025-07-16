const express = require("express");
const router = express.Router();
const  controller  = require("../controller/analytics/analytics.controller");

router.get("/analizar", controller.analizarComentarios);

// Leer archivos JSON ya existentes
router.get("/leer/resultado", controller.leerResultadoJson);
router.get("/leer/resumen", controller.leerResumenJson);

module.exports = router;
