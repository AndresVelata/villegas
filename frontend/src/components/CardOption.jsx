const CardOption = ({ titulo, accion }) => {
  return (
    <button
      onClick={accion}
      className="bg-info hover:bg-accent text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 text-lg"
    >
      {titulo}
    </button>
  );
};

export default CardOption;
