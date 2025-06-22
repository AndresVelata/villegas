const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require("uuid");
const validateRegisterUser = require("../utils/validateRegisterUser");
const { sendConfirmationEmail, sendResetPasswordEmail } = require("../utils/nodemailer");


exports.registrarUsuario = async (req, res, next) => {
  try {
      
      //Validar datos
      validateRegisterUser(req.body);
      
      const { nombre, apellido, email, telefono, cedula } = req.body;
    // Generar clave temporal aleatoria
    const claveTemporal = uuidv4().slice(0, 8);
    const hashTemporal = await bcrypt.hash(claveTemporal, 10);

    // Verificar que no exista la cédula
    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE cedula = ?",
      [cedula]
    );
    if (existe.length > 0) {
      const error = new Error("La cédula ya está registrada");
      error.statusCode = 409;
      throw error;
    }

    // Insertar usuario con clave temporal
    await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, telefono, cedula, password_temporal, rol_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, telefono, cedula, hashTemporal, 2]
    );

    await sendConfirmationEmail({
    nombre,
    email,
    claveTemporal,
    });

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      clave_temporal: claveTemporal,
    });

  } catch (err) {
    next(err); 
  }
};

exports.loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validar que exista el email
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    
    if (rows.length === 0) {
        throw new Error("Credenciales incorrectas");
    }
    
    const usuario = rows[0];
    
    // Comparar con password hash
    const isMatch = await bcrypt.compare(password, usuario.password || usuario.password_temporal);
    if (!isMatch) {
        throw new Error("Credenciales incorrectas");
    }
    
    const token = jwt.sign(
        {
            id: usuario.id,
            rol: usuario.rol_id,
            nombre: usuario.nombre,
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol_id,
      },
    });
  } catch (err) {
    next(err);
  }
};


exports.olvidePassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ error: "El correo es obligatorio" });
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, email FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No hay ningún usuario con ese correo" });
    }

    const { id, nombre } = rows[0];

    const tempPassword = uuidv4().slice(0, 8); 
    const hash = await bcrypt.hash(tempPassword, 10);

    await pool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
      hash,
      id,
    ]);

    await sendResetPasswordEmail({
      nombre,
      email,
      claveTemporal: tempPassword,
    });

    res.json({
      mensaje: "Se envió una nueva contraseña temporal a tu correo ✅",
    });
  } catch (err) {
    next(err);
  }
};
