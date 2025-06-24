import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return setCargando(false);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/verify`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsuario(data.usuario);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("usuario");
      } finally {
        setCargando(false);
      }
    };

    verificarToken();
  }, []);

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
