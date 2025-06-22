const validateRegisterUser = (userData) => {
  let { nombre, apellido, email, telefono, cedula } = userData;

  // Limpiar espacios
  nombre = nombre?.trim();
  apellido = apellido?.trim();
  email = email?.trim();
  cedula = cedula?.trim();

  console.log(nombre,apellido,email,cedula);
  
  // Validar tipo
  if (
    typeof nombre !== "string" ||
    typeof apellido !== "string" ||
    typeof email !== "string" ||
    typeof cedula !== "string"
  ) {
    throw new Error("Todos los datos deben ser de tipo texto");
  }

  // Validar nombre y apellido
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;

  if (!nombre || nombre.length === 0)
    throw new Error("El nombre no puede estar vacío");
  if (!apellido || apellido.length === 0)
    throw new Error("El apellido no puede estar vacío");
  if (!nameRegex.test(nombre))
    throw new Error("El nombre solo puede contener letras y espacios");
  if (!nameRegex.test(apellido))
    throw new Error("El apellido solo puede contener letras y espacios");

  // Validar email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || email.length === 0)
    throw new Error("El correo no puede estar vacío");
  if (!emailRegex.test(email))
    throw new Error("El correo no tiene un formato válido");

  // Validar telefono
    if (telefono) {
    telefono = telefono.trim();

    const telefonoRegex = /^[0-9]{7,15}$/; // Ej: 04141234567
    if (!telefonoRegex.test(telefono)) {
      throw new Error("El teléfono debe contener solo números (7 a 15 dígitos)");
    }
  }

  // Validar cédula
  const cedulaRegex = /^\d{10}$/; // Ej: 1723456789
  if (!cedula || cedula.length === 0)
    throw new Error("La cédula no puede estar vacía");
  if (!cedulaRegex.test(cedula))
    throw new Error("La cédula debe tener exactamente 10 números");

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    throw new Error("El código de provincia en la cédula no es válido");
  }

  const tercerDigito = parseInt(cedula[2], 10);
  if (tercerDigito >= 6) {
    throw new Error("La cédula no es de una persona natural válida");
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i]) * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }

  const digitoVerificador = parseInt(cedula[9], 10);
  const decenaSuperior = Math.ceil(suma / 10) * 10;
  const resultado = decenaSuperior - suma;

  if ((resultado === 10 ? 0 : resultado) !== digitoVerificador) {
    throw new Error("La cédula ingresada no es válida");
  }

  return; // Todo OK
};

module.exports = validateRegisterUser;
