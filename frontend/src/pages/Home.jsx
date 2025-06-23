import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; 
import Sidebar from "../components/Sidebar";
import Inicio from "./Inicio"; 

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [vista, setVista] = useState("inicio");

  const { usuario } = useAuth();

  if (!usuario) return <p className="text-center">Cargando...</p>;

  return (
    <div className="flex min-h-screen bg-gray-300">
      <Sidebar
        usuario={usuario}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        vista={vista}
        setVista={setVista}
      />
      <div className={`flex-1 p-10 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        {vista === "inicio" && <Inicio usuario={usuario} />}
      </div>
    </div>
  );
};

export default Home;
