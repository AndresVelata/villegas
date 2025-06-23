const express = require("express");
const router = express.Router();

const authcontroller  = require("../controller/auth.controller");
const authMiddleware = require("../middleware/authMiddleware")
router.post("/register", authcontroller.registrarUsuario);
router.post("/login", authcontroller.loginUsuario);

router.get("/verify", authMiddleware, (req, res) => {
  res.json({
    mensaje: "Token válido",
    usuario: {
      id: req.usuario.id,
      nombre: req.usuario.nombre,
      rol: req.usuario.rol,
    }
  });
});


router.post("/olvide-password", authcontroller.olvidePassword);

module.exports = router;
