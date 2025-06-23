const express = require("express");
const router = express.Router();
const usuarioscontroller = require("../controller/usuarios.controller");

const authMiddleware = require("../middleware/authMiddleware");
const soloAdmin = require("../middleware/soloAdmin");


router.get("/perfil", authMiddleware, usuarioscontroller.obtenerPerfil);
router.put("/perfil/update/:campo", authMiddleware, usuarioscontroller.actualizarCampoPerfil);
router.put("/cambiar-password", authMiddleware, usuarioscontroller.cambiarPassword);

router.put("/:id/reset-password", authMiddleware, soloAdmin, usuarioscontroller.resetearPassword);

module.exports = router;
