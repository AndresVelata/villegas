import { useState } from "react";
import Sidebar from "../components/Sidebar";

const LayoutPrivado = ({ children, usuario }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar usuario={usuario} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} p-6`}>
        {children}
      </div>
    </div>
  );
};

export default LayoutPrivado;
