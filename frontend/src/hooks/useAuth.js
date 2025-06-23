import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuth = () => {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuario(data.usuario);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
      } catch (err) {
        console.error("Sesión expirada o token inválido");
        toast.error("Tu sesión expiró, por favor inicia sesión nuevamente");
        logout(); // Deslogueo automático si falla el verify
      }
    };

    verificarToken();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  return {
    usuario,
    setUsuario,
    logout,
    isAuthenticated: !!usuario,
  };
};
