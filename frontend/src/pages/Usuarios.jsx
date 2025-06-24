import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LayoutPrivado from "../layouts/LayoutPrivado";
import { useAuth } from "../hooks/useAuth";

const Usuarios = () => {
  const { usuario } = useAuth(); 
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    cedula: ""
  });
  const [filtroCedula, setFiltroCedula] = useState("");

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios/lista`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(data.usuarios);
    } catch (err) {
      console.log(err);
      toast.error("Error al cargar usuarios");
    }
  };

  const handleRolChange = async (id, nuevoRol) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/usuarios/rol/${id}`,
        { rol: nuevoRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.mensaje);
      fetchUsuarios();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al cambiar rol");
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar/desactivar este usuario?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.mensaje);
      fetchUsuarios();
    } catch (err) {
      toast.error("Error al eliminar usuario");
    }
  };

  const handleRegistrar = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        nuevoUsuario,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.mensaje);
      setModalVisible(false);
      setNuevoUsuario({ nombre: "", apellido: "", email: "", telefono: "", cedula: "" });
      fetchUsuarios();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al registrar usuario");
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.cedula.toLowerCase().includes(filtroCedula.toLowerCase())
  );

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (!usuario) return <p className="text-center">Cargando...</p>;

  return (
    <LayoutPrivado usuario={usuario}>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow border border-cyanbg-cyan-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">Administrar Usuarios</h2>
          <button
            className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-dark"
            onClick={() => setModalVisible(true)}
          >
            Registrar Usuario
          </button>
        </div>

        <div className="mb-4 bg-cyan-50 border-2 border-cyan-950 rounded-3xl p-2 ">
          <input
            type="text"
            placeholder="Buscar por cédula..."
            value={filtroCedula}
            onChange={(e) => setFiltroCedula(e.target.value)}
            className="input w-full bg-gray-300 py-1 px-3 rounded-2xl max-w-sm"
          />
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-cyan-600 text-white">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Cedula</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Rol</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u, i) => (
              <tr key={u.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{u.cedula}</td>
                <td className="p-2">{u.nombre} {u.apellido}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.rol_id}
                    onChange={(e) => handleRolChange(u.id, parseInt(e.target.value))}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Usuario</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEliminar(u.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white px-8 py-6 rounded-2xl w-full max-w-lg shadow-2xl border border-cyan-500">
            <h3 className="text-2xl font-bold mb-6 text-secondary">Registrar Nuevo Usuario</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre*" className="input w-full bg-gray-300 py-1 px-3 rounded-2xl" value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} />
              <input type="text" placeholder="Apellido*" className="input w-full bg-gray-300 py-1 px-3 rounded-2xl" value={nuevoUsuario.apellido} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })} />
              <input type="email" placeholder="Email*" className="input w-full bg-gray-300 py-1 px-3 rounded-2xl" value={nuevoUsuario.email} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} />
              <input type="text" placeholder="Cédula*" className="input w-full bg-gray-300 py-1 px-3 rounded-2xl" value={nuevoUsuario.cedula} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, cedula: e.target.value })} />
              <input type="text" placeholder="Teléfono" className="input w-full bg-gray-300 py-1 px-3 rounded-2xl" value={nuevoUsuario.telefono} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })} />
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setModalVisible(false)}>Cancelar</button>
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark" onClick={handleRegistrar}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </LayoutPrivado>
  );
};

export default Usuarios;
