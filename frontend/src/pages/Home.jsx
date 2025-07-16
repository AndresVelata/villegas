import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import LayoutPrivado from "../layouts/LayoutPrivado";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
const Home = () => {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

const obtenerDatos = async () => {
  setError(null); // limpiamos errores anteriores
  try {
    const res1 = await fetch("http://localhost:3000/api/analytics/leer/resumen");
    const res2 = await fetch("http://localhost:3000/api/analytics/leer/resultado");

    if (!res1.ok || !res2.ok) {
      throw new Error("No se pudo obtener la información desde el servidor.");
    }

    const json1 = await res1.json();
    const json2 = await res2.json();

    if (!json1 || !json2 || Object.keys(json1).length === 0 || Object.keys(json2).length === 0) {
      throw new Error("Los datos recibidos están vacíos o incompletos.");
    }

    setResumen(json1);
    setResultado(json2);
  } catch (error) {
    console.error("❌ Error al obtener datos:", error.message);
    setError(error.message);
  }
};


  useEffect(() => {
    obtenerDatos();
  }, []);

if (!usuario) return <p className="text-center">Cargando usuario...</p>;

if (error) {
  return (
  <>
    {cargando && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <p className="text-lg font-semibold">Procesando análisis...</p>
          <div className="mt-4 animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )}

    <LayoutPrivado usuario={usuario}>
      <div className="p-6 space-y-6">
        {/* ENCABEZADO Y BOTONES: SIEMPRE VISIBLES */}
        <div className="flex w-full justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hola, {usuario.nombre}</h1>
            <p className="text-gray-600">Presentación de reporte</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={ejecutarAnalisis}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Ejecutar análisis
            </button>
            <button
              onClick={exportarExcel}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={!resultado}
            >
              Exportar a Excel
            </button>
            <button
              onClick={exportarPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              disabled={!resultado}
            >
              Exportar a PDF
            </button>
          </div>
        </div>

        {/* MOSTRAR ERROR DENTRO DEL LAYOUT */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mt-4">
            <h2 className="text-lg font-bold">⚠️ Error</h2>
            <p>{error}</p>
            <button
              onClick={obtenerDatos}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* SI NO HAY DATOS Y TAMPOCO HAY ERROR */}
        {!resumen || !resultado ? (
          !error && <p className="text-center text-gray-500 mt-10">Cargando datos del análisis...</p>
        ) : (
          <>
            {/* Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <ResumenCard title="Mayor Interacción" data={resumen.mayor_interaccion} />
              <ResumenCard title="Mejor Aceptación" data={resumen.mejor_aceptacion} />
              <ResumenCard title="Peor Aceptación" data={resumen.peor_aceptacion} />
            </div>

            {/* Gráfico */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Interacciones por post</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="post_id" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="comentarios" fill="#8884d8" name="Comentarios" />
                  <Bar dataKey="reacciones" fill="#82ca9d" name="Reacciones" />
                  {["joy", "neutral", "surprise"].map((emo) =>
                    dataGrafico.some((d) => d[emo]) ? (
                      <Bar key={emo} dataKey={emo} fill="#ffc658" name={`Emoción: ${emo}`} />
                    ) : null
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </LayoutPrivado>
  </>
);

}

if (!resumen || !resultado) return <p className="text-center">Cargando datos...</p>;


  // Convertimos resultado en arreglo
  const dataGrafico = Object.entries(resultado).map(([post_id, datos]) => ({
    post_id,
    comentarios: datos.comentarios,
    reacciones: datos.reacciones.total_count,
    ...datos.emociones,
  }));

  const exportarExcel = () => {
    const exportData = Object.entries(resultado).map(([post_id, datos]) => ({
      post_id,
      comentarios: datos.comentarios,
      reacciones: datos.reacciones.total_count,
      emocion: Object.keys(datos.emociones || {})[0] || "Sin emoción",
    }));

    const hoja = XLSX.utils.json_to_sheet(exportData);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Resumen");
    XLSX.writeFile(libro, "analytics_resumen.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Resumen de Interacciones", 14, 15);

    const exportData = Object.entries(resultado).map(([post_id, datos]) => [
      post_id,
      datos.comentarios,
      datos.reacciones.total_count,
      Object.keys(datos.emociones || {})[0] || "Sin emoción",
    ]);

    autoTable(doc, {
      head: [["Post ID", "Comentarios", "Reacciones", "Emoción"]],
      body: exportData,
      startY: 25,
    });

    doc.save("analytics_resumen.pdf");
  };

  const ejecutarAnalisis = async () => {
    setCargando(true);
    const toastId = toast.loading("Ejecutando análisis...");

    try {
      const res = await fetch("http://localhost:3000/api/analytics/analizar");
      const data = await res.json();

      if (data.success) {
        toast.update(toastId, {
          render: data.message || "Análisis completado ✅",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        await obtenerDatos(); // volver a cargar datos
      } else {
        toast.update(toastId, {
          render: data.message || "Error al ejecutar análisis ❌",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Error de conexión ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setCargando(false);
    }
  };

return (
  <>
    {cargando && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <p className="text-lg font-semibold">Procesando análisis...</p>
          <div className="mt-4 animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )}

    <LayoutPrivado usuario={usuario}>
      <div className="p-6 space-y-6">
        {/* Header + botones SIEMPRE visibles */}
        <div className="flex w-full justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Hola, {usuario.nombre}</h1>
            <p className="text-gray-600">Presentación de reporte</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={ejecutarAnalisis}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Ejecutar análisis
            </button>
            <button
              onClick={exportarExcel}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={!resultado}
            >
              Exportar a Excel
            </button>
            <button
              onClick={exportarPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              disabled={!resultado}
            >
              Exportar a PDF
            </button>
          </div>
        </div>

        {/* Contenido dinámico según estado */}
        {error ? (
          <div className="text-center text-red-600 mt-10">
            <p className="text-xl font-bold mb-2">⚠️ Error</p>
            <p className="mb-4">{error}</p>
            <button
              onClick={obtenerDatos}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Reintentar
            </button>
          </div>
        ) : !resumen || !resultado ? (
          <p className="text-center text-gray-500 mt-10">Cargando datos del análisis...</p>
        ) : (
          <>
            {/* Tarjetas resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <ResumenCard title="Mayor Interacción" data={resumen.mayor_interaccion} />
              <ResumenCard title="Mejor Aceptación" data={resumen.mejor_aceptacion} />
              <ResumenCard title="Peor Aceptación" data={resumen.peor_aceptacion} />
            </div>

            {/* Gráfico */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Interacciones por post</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="post_id" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="comentarios" fill="#8884d8" name="Comentarios" />
                  <Bar dataKey="reacciones" fill="#82ca9d" name="Reacciones" />
                  {["joy", "neutral", "surprise"].map((emo) =>
                    dataGrafico.some((d) => d[emo]) ? (
                      <Bar
                        key={emo}
                        dataKey={emo}
                        fill="#ffc658"
                        name={`Emoción: ${emo}`}
                      />
                    ) : null
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </LayoutPrivado>
  </>
);


};

// Componente tarjeta resumen
const ResumenCard = ({ title, data }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p>
        <span className="font-medium">Post ID:</span> {data.post_id}
      </p>
      <p>
        <span className="font-medium">Interacción:</span>{" "}
        {data.total_interaccion}
      </p>
      <p>
        <span className="font-medium">Emoción:</span>{" "}
        {data.emocion_predominante}
      </p>
      <p>
        <span className="text-green-600">👍</span> {data.positivas} |{" "}
        <span className="text-red-600">👎</span> {data.negativas}
      </p>
    </div>
  );
};

export default Home;
