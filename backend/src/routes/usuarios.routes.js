const express = require("express");
const router = express.Router();
const usuarioscontroller = require("../controller/usuarios.controller");

const authMiddleware = require("../middleware/authMiddleware");
const soloAdmin = require("../middleware/soloAdmin");


router.get("/perfil", authMiddleware, usuarioscontroller.obtenerPerfil);
router.put("/perfil/update/:campo", authMiddleware, usuarioscontroller.actualizarCampoPerfil);
router.put("/cambiar-password", authMiddleware, usuarioscontroller.cambiarPassword);

router.put("/:id/reset-password", authMiddleware, soloAdmin, usuarioscontroller.resetearPassword);


// rutas/usuarios.js
router.get("/lista", authMiddleware, soloAdmin, usuarioscontroller.listarUsuarios);
router.put("/rol/:id", authMiddleware, soloAdmin, usuarioscontroller.cambiarRol);
router.put("/estado/:id", authMiddleware, soloAdmin, usuarioscontroller.cambiarEstado);
router.delete("/:id", authMiddleware, soloAdmin, usuarioscontroller.eliminarUsuario);


module.exports = router;
