import "dotenv/config";
import "express-async-errors";

import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database";
import { json } from "body-parser";
import authRoutes from "./api/auth.routes";

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

// Inicialização do banco de dados (migrations iniciais)
try {
  initializeDatabase();
} catch (error) {
  console.error("FATAL: Falha ao inicializar o banco de dados:", error);
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res.status(200).json({ message: "Agendou v3 Backend API is running!" })
);

// Rotas de exemplo (implementação futura)
// Rotas de API
app.use("/api/v1/auth", authRoutes);
// app.use('/api/v1/appointments', appointmentRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro interno no servidor." });
  }
);

app.listen(PORT, () => {
  console.log(`\n Servidor Express rodando na porta ${PORT}`);
});
