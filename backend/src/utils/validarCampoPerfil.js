const camposProtegidos = ["cedula", "rol_id", "password"];

const validarCampoPerfil = (campo, valor) => {
  if (typeof valor !== "string" || valor.trim().length === 0)
    throw new Error(`El valor para ${campo} no puede estar vacío`);

  const limpio = valor.trim();

  switch (campo) {
    case "nombre":
    case "apellido":
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(limpio))
        throw new Error(`${campo} solo puede contener letras y espacios`);
      break;

    case "telefono":
      if (!/^[0-9]{7,15}$/.test(limpio))
        throw new Error("El teléfono debe tener entre 7 y 15 dígitos numéricos");
      break;

    case "email":
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(limpio)
      )
        throw new Error("El correo no tiene un formato válido");
      break;

   default:
      if (!camposProtegidos.includes(campo))
        throw new Error(`No se permite actualizar el campo "${campo}"`);
      break;
  }

  return limpio; // Devuelve valor limpio
};

module.exports = validarCampoPerfil;
