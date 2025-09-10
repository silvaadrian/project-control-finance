const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Importe o pacote cors
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const expenseRoutes = require("./routes/expenseRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const debtRoutes = require("./routes/debtRoutes");

// Condicional para carregar o .env apenas em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
app.use(express.json());
app.use(cors()); // Use o middleware cors aqui

app.use("/api", expenseRoutes);
app.use("/api", revenueRoutes);
app.use("/api", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", debtRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = app;

if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}
