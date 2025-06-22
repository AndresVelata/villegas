const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    console.log(req.headers.authorization);
    
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
