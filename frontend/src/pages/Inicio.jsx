const Inicio = ({ usuario }) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Hola, {usuario.nombre}</h1>
      <p>Bienvenido al sistema Villegas</p>
    </div>
  );
};

export default Inicio;
