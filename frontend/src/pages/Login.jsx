import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false); // 👈 estado para modal
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success(data.mensaje || "Inicio de sesión exitoso");
      setTimeout(() => {
        navigate("/home"); 
      }, 1000);
    } catch (err) {
      const mensaje = err.response?.data?.error || "Error al iniciar sesión";
      toast.error(mensaje);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/olvide-password`, {
        email: recoveryEmail,
      });
      toast.success(data.mensaje);
      setShowModal(false);
      setRecoveryEmail("");
    } catch (err) {
      const mensaje = err.response?.data?.error || "Error al recuperar la contraseña";
      toast.error(mensaje);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 relative">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md border border-muted z-10">
        <h2 className="text-3xl font-bold text-center text-secondary mb-8">Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-info transition"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-info transition"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-info text-white font-semibold py-2 rounded-lg shadow transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          ¿Olvidaste tu contraseña?{" "}
          <span
            className="text-info hover:underline cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Recupérala aquí
          </span>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-secondary mb-4 text-center">Recuperar contraseña</h3>
            <form onSubmit={handleRecovery}>
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-info transition mb-4"
                placeholder="Ingresa tu correo"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-muted text-white hover:bg-secondary transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-accent text-white hover:bg-info transition"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
