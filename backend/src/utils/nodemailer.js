const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendConfirmationEmail = async ({ nombre, email, claveTemporal }) => {
  try {
    await transporter.sendMail({
      from: `"Social Network Analysis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Bienvenido - Acceso al Sistema",
      html: `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #2c3e50; text-align: center;">¡Bienvenido al Social Network Analysis!</h2>
      
      <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>
      
      <p style="font-size: 16px; color: #333;">
        Has sido registrado exitosamente en nuestro sistema. A continuación te dejamos tu <strong>contraseña temporal</strong> para que puedas acceder:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <span style="display: inline-block; background-color:rgb(0, 10, 99); color: white; padding: 12px 20px; border-radius: 6px; font-size: 18px; letter-spacing: 1px;">
          ${claveTemporal}
        </span>
      </div>

      <p style="font-size: 16px; color: #333;">
        Debes iniciar sesión con tu correo <strong>${email}</strong> y esta contraseña. Luego se te pedirá que la cambies por una nueva.
      </p>

      <p style="font-size: 14px; color: #777; margin-top: 30px;">
        ⚠️ No compartas esta información con nadie. Si no reconoces este registro, por favor comunícate con soporte.
      </p>

      <p style="text-align: right; font-size: 14px; color: #555;">
        — El equipo de <strong>Social Network Analysis</strong>
      </p>
    </div>
  </div>
`,

    });
    console.log("📧 Correo enviado a", email);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error.message);
    throw new Error("No se pudo enviar el correo de confirmación");
  }
};

exports.sendResetPasswordEmail = async ({ nombre, email, claveTemporal }) => {
  try {
    await transporter.sendMail({
      from: `"Social Network Analysis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔄 Tu contraseña ha sido restablecida",
      html: `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #2c3e50; text-align: center;">🔄 Tu contraseña ha sido restablecida</h2>

      <p style="font-size: 16px; color: #333;">Hola <strong>${nombre}</strong>,</p>

      <p style="font-size: 16px; color: #333;">
        Un administrador ha restablecido tu contraseña. Para acceder nuevamente al sistema, utiliza la siguiente contraseña temporal:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <span style="display: inline-block; background-color: rgb(0, 10, 99); color: white; padding: 12px 20px; border-radius: 6px; font-size: 18px; letter-spacing: 1px;">
          ${claveTemporal}
        </span>
      </div>

      <p style="font-size: 16px; color: #333;">
        Iniciá sesión con tu correo <strong>${email}</strong> y esta clave temporal. Por seguridad, se te pedirá que configures una nueva contraseña permanente.
      </p>

      <p style="font-size: 14px; color: #777; margin-top: 30px;">
        ⚠️ Si no solicitaste este cambio, por favor contactá a soporte inmediatamente.
      </p>

      <p style="text-align: right; font-size: 14px; color: #555;">
        — El equipo de <strong>Social Network Analysis</strong>
      </p>
    </div>
  </div>
      `,
    });

    console.log("📧 Correo de reseteo enviado a", email);
  } catch (error) {
    console.error("❌ Error al enviar correo de reseteo:", error.message);
    throw new Error("No se pudo enviar el correo de reseteo");
  }
};
