const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const analyticsRoutes = require("./routes/analytics.routes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Seguridad HTTP
app.use(helmet());

// Habilitar CORS
app.use(cors());

// Parseo de JSON
app.use(express.json());

// Logs en consola
app.use(morgan("dev"));

app.use("/api/auth", authRoutes); 
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/analytics", analyticsRoutes);

// Manejador de errores al final
app.use(errorHandler);
module.exports = app;
