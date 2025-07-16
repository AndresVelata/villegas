const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs/promises"); // usamos promesas modernas de fs

// 🧠 Ejecuta análisis con script Python
exports.analizarComentarios = async (req, res) => {
  try {
    const scriptPath = path.join(__dirname, "p1.py");
    const python = spawn("python", [scriptPath]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      const text = data.toString();
      output += text;
      console.log("[PYTHON]", text);
    });

    python.stderr.on("data", (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error("[PYTHON ERROR]", text);
    });

    python.on("close", (code) => {
      if (code !== 0 || !output.includes("ANALISIS_OK")) {
        return res.status(500).json({
          success: false,
          error: "El script terminó con errores.",
          details: errorOutput || output,
        });
      }

      return res.status(200).json({
        success: true,
        message: "✅ Análisis completado correctamente.",
      });
    });
  } catch (err) {
    console.error("❌ Error al ejecutar el análisis:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error inesperado al ejecutar el análisis.",
      error: err.message,
    });
  }
};

// 📄 Lee resultado.json
exports.leerResultadoJson = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "..", "..", "generated", "resultado.json");
    console.log("📂 Leyendo archivo:", filePath);

    const data = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(data);

    return res.status(200).json(json);
  } catch (err) {
    console.error("❌ Error al leer resultado.json:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error al leer resultado.json",
      error: err.message,
    });
  }
};

// 📄 Lee resumen.json
exports.leerResumenJson = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "..", "..", "generated", "resumen.json");
    console.log("📂 Leyendo archivo:", filePath);

    const data = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(data);

    return res.status(200).json(json);
  } catch (err) {
    console.error("❌ Error al leer resumen.json:", err.message);

    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "resumen.json no encontrado." });
    }

    return res.status(500).json({ error: "Error al leer resumen.json", details: err.message });
  }
};
