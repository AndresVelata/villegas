import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
  UserPlus,
  Home,
  Users
} from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = ({ usuario, collapsed, setCollapsed }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("usuario");
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  const SidebarButton = ({ icon: Icon, label, to }) => {
    const isActive = location.pathname === to;

    return (
      <button
        onClick={() => navigate(to)}
        className={`flex items-center gap-3 w-full text-left px-4 py-2  cursor-pointer rounded transition ${
          isActive
            ? "bg-blue-600 text-white font-semibold "
            : "hover:bg-cyan-600 "
        }`}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </button>
    );
  };

  return (
    <div
      className={`h-screen bg-primary text-white shadow-md fixed top-0 left-0 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "py-4 w-14" : "w-64 p-4"
      }`}
    >
      {/* Encabezado */}
      <div>
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-bold whitespace-nowrap">
              Social Network Analysis
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-cyan-600 cursor-pointer p-2 transition self-end"
          >
            {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <SidebarButton icon={Home} label="Inicio" to="/home" />
          <SidebarButton icon={User} label="Perfil" to="/perfil" />

   
          {usuario.rol === 1 && (
            <SidebarButton
              icon={Users}
              label="Usuarios"
               to="/usuarios"
            />
          )}
        </div>
      </div>

      {/* Info + Logout */}
      <div className="text-sm mt-4">
        {!collapsed && usuario && (
          <p className="mb-2 text-muted">
            {usuario.nombre} {usuario.apellido}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-2 rounded hover:bg-cyan-600 cursor-pointer transition"
        >
          <LogOut size={20} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
