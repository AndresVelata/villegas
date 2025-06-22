import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/login", form);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      toast.success(data.mensaje || "Inicio de sesión exitoso");
    } catch (err) {
      const mensaje = err.response?.data?.error || "Error al iniciar sesión";
      toast.error(mensaje);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md border border-muted">
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

        <p className="text-center text-sm  mt-6">
          ¿Olvidaste tu contraseña? <span className="text-info hover:underline cursor-pointer">Recupérala aquí</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
