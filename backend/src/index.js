const dotenv = require("dotenv");
const app = require("./app"); 
dotenv.config();

// Puerto de ejecución
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
