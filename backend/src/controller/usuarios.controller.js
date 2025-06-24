const { pool } = require("../config/db");
const validarCampoPerfil = require("../utils/validarCampoPerfil");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

exports.obtenerPerfil = async (req, res, next) => {
  try {
    const { id } = req.usuario;

    const [rows] = await pool.query(
      `SELECT id, nombre, apellido, email, telefono, cedula, password_temporal, rol_id AS rol
       FROM usuarios WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ perfil: rows[0] });
  } catch (err) {
    next(err);
  }
};



exports.actualizarCampoPerfil = async (req, res, next) => {
  try {
    const { id } = req.usuario;
    const { campo } = req.params;
    const { valor } = req.body;

    const valorLimpio = validarCampoPerfil(campo, valor, req.usuario.rol);

    // Verificar que el email no esté repetido (solo si es email)
    if (campo === "email") {
      const [existe] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [valorLimpio, id]
      );
      if (existe.length > 0) {
        throw new Error("Ese correo ya está en uso por otro usuario");
      }
    }

    const sql = `UPDATE usuarios SET ${campo} = ? WHERE id = ?`;
    await pool.query(sql, [valorLimpio, id]);

    res.json({ mensaje: `Campo "${campo}" actualizado exitosamente ✅` });
  } catch (err) {
    next(err);
  }
};

exports.cambiarPassword = async (req, res, next) => {
  try {
    const { id } = req.usuario;
    const { actual, nueva, repetir } = req.body;

    if (!actual || !nueva || !repetir) {
      return res.status(400).json({ error: "Debes completar todos los campos" });
    }

    if (nueva !== repetir) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    if (nueva.length < 6) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const [rows] = await pool.query("SELECT password FROM usuarios WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const hashGuardado = rows[0].password;
    const match = await bcrypt.compare(actual, hashGuardado);

    if (!match) {
      return res.status(401).json({ error: "La contraseña actual es incorrecta" });
    }

    const hashNuevo = await bcrypt.hash(nueva, 10);
    await pool.query("UPDATE usuarios SET password = ?, password_temporal = 0 WHERE id = ?", [hashNuevo, id]);

    res.json({ mensaje: "Contraseña actualizada exitosamente ✅" });
  } catch (err) {
    next(err);
  }
};


exports.resetearPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, email, nombre FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { email, nombre } = rows[0];

    const tempPassword = uuidv4().slice(0, 8); 
    const hash = await bcrypt.hash(tempPassword, 10);

    await pool.query(
      "UPDATE usuarios SET password = ? WHERE id = ?",
      [hash, id]
    );

    await sendResetPasswordEmail({
      nombre,
      email,
      claveTemporal: tempPassword,
    });

    res.json({
      mensaje: "Contraseña reseteada exitosamente ✅",
      email,
      claveTemporal: tempPassword,
    });
  } catch (err) {
    next(err);
  }
};


exports.listarUsuarios = async (req, res, next) => {
  
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, apellido, email, telefono, cedula, rol_id FROM usuarios"
    );
    res.json({ usuarios: rows });
  } catch (err) {
    next(err);
  }
};

exports.cambiarRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (![1, 2].includes(rol)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    await pool.query("UPDATE usuarios SET rol_id = ? WHERE id = ?", [rol, id]);
    res.json({ mensaje: "Rol actualizado correctamente ✅" });
  } catch (err) {
    next(err);
  }
};

exports.cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body; // true o false
    await pool.query("UPDATE usuarios SET activo = ? WHERE id = ?", [activo ? 1 : 0, id]);
    res.json({ mensaje: `Usuario ${activo ? "activado" : "desactivado"} correctamente ✅` });
  } catch (err) {
    next(err);
  }
};

exports.eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ mensaje: "Usuario eliminado correctamente ✅" });
  } catch (err) {
    next(err);
  }
};
