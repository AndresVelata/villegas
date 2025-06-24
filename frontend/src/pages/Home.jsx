import { useAuth } from "../hooks/useAuth";
import LayoutPrivado from "../layouts/LayoutPrivado";

const Home = () => {
  const { usuario } = useAuth();

  if (!usuario) return <p className="text-center">Cargando...</p>;

  return (
    <LayoutPrivado usuario={usuario}>
      <div className="flex flex-col w-full h-full justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Hola, {usuario.nombre}</h1>
        <p>Bienvenido al sistema Villegas</p>
      </div>
    </LayoutPrivado>
  );
};

export default Home;
