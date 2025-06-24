module.exports = (req, res, next) => {
  if (req.usuario.rol !== 1) {
    return res.status(403).json({ error: "Acceso denegado. Solo admin." });
  }
  next();
};