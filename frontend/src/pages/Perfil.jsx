import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LayoutPrivado from "../layouts/LayoutPrivado";

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(null);
  const [valor, setValor] = useState("");
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", repetir: "" });

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/usuarios/perfil`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPerfil(data.perfil);
        localStorage.setItem("usuario", JSON.stringify(data.perfil));
      } catch (err) {
        toast.error("No se pudo cargar el perfil");
      }
    };

    obtenerPerfil();
  }, []);

  const handleEditar = (campo, valorActual) => {
    setEditando(campo);
    setValor(valorActual);
  };

  const handleActualizar = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/usuarios/perfil/update/${editando}`,
        { valor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.mensaje);
      const nuevoPerfil = { ...perfil, [editando]: valor };
      setEditando(null);
      setPerfil(nuevoPerfil);
      localStorage.setItem("usuario", JSON.stringify(nuevoPerfil));
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al actualizar");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/usuarios/cambiar-password`,
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.mensaje);
      setPasswords({ actual: "", nueva: "", repetir: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al cambiar contraseña");
    }
  };

  if (!perfil) return <p className="text-center ">Cargando perfil...</p>;

  const campoEditable = (campo, label) => (
    <div className="flex">
        <div className=" w-18">

      <span className="font-semibold text-primary ">{label}:</span>{" "}
        </div>
      {editando === campo ? (
        <>
          <input
            type="text"
            className="border border-muted rounded px-2 ml-2 w-64"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <button
            className="ml-2 text-info font-semibold"
            onClick={handleActualizar}
          >
            Guardar
          </button>
          <button
            className="ml-2 "
            onClick={() => setEditando(null)}
          >
            Cancelar
          </button>
        </>
      ) : (
        <span className="ml-2 flex">
            <div className="w-64">
          {perfil[campo]} {" "}
            </div>
          <button
            onClick={() => handleEditar(campo, perfil[campo])}
            className="ml-2 text-info hover:underline"
          >
            Editar
          </button>
        </span>
      )}
    </div>
  );

  return (
    <LayoutPrivado usuario={perfil}>
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-muted">
        <h2 className="text-2xl font-bold text-secondary mb-6">Mi Perfil</h2>
        {perfil.password_temporal===0 && (
          <div className="mb-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded p-4">
            <strong>⚠️ ¡Atención!</strong> Estás usando una contraseña temporal. Por seguridad, cambia tu contraseña ahora.
          </div>
        )}
        <div className="space-y-4 text-gray-700">
          {campoEditable("nombre", "Nombre")}
          {campoEditable("apellido", "Apellido")}
          {campoEditable("telefono", "Teléfono")}
          <p className="flex"><div className="w-20"><span className="font-semibold text-primary ">Email:</span></div> {perfil.email}</p>
          <p className="flex"><div className="w-20"><span className="font-semibold text-primary">Cédula:</span></div> {perfil.cedula}</p>
          {/* <p><span className="font-semibold text-primary">Rol:</span> {perfil.rol_id === 1 ? "Administrador" : "Usuario"}</p> */}
        </div>

        <hr className="my-6 border-muted" />

        <h3 className="text-xl font-semibold text-secondary mb-4">Cambiar Contraseña</h3>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={passwords.actual}
            onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })}
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={passwords.nueva}
            onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
          />
          <input
            type="password"
            placeholder="Repetir contraseña"
            className="w-full px-4 py-2 border border-muted rounded-lg"
            value={passwords.repetir}
            onChange={(e) => setPasswords({ ...passwords, repetir: e.target.value })}
          />
          <button
            className="w-full bg-accent hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg shadow"
            onClick={handlePasswordChange}
          >
            Actualizar Contraseña
          </button>
        </div>
      </div>
    </LayoutPrivado>
  );
};

export default Perfil;


