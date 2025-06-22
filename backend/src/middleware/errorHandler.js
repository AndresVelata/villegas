const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || "Error en el servidor" });
};

module.exports = errorHandler;
