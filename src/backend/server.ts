import "dotenv/config";
import "express-async-errors";

import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database";
import { json } from "body-parser";
import { AppError } from "./errors/AppError"; // adicione o import perto dos outros
// Note: route modules import repositories that use the DB instance at module init.
// We will require them after running initializeDatabase() to ensure migrations run first.

const PORT = process.env.PORT || 4000;
// Accept a comma-separated list via FRONTEND_ORIGINS or fallback to both common dev ports
const FRONTEND_ORIGINS = (
  process.env.FRONTEND_ORIGINS || "http://localhost:3000,http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Inicialização do banco de dados (migrations iniciais)
try {
  initializeDatabase();
} catch (error) {
  console.error("FATAL: Falha ao inicializar o banco de dados:", error);
  process.exit(1);
}

// importar rotas APÓS as migrations serem executadas
const authRoutes = require("./api/auth.routes").default;
const clienteRoutes = require("./api/cliente.routes").default;
const servicoRoutes = require("./api/servico.routes").default;
const agendamentoRoutes = require("./api/agendamento.routes").default;

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like curl, server-to-server) with no origin
      if (!origin) return callback(null, true);
      if (FRONTEND_ORIGINS.includes(origin)) return callback(null, true);
      // Otherwise block the request and provide a helpful message in the server logs
      console.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
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
app.use("/api/v1/clientes", clienteRoutes);
app.use("/api/v1/servicos", servicoRoutes);
app.use("/api/v1/agendamentos", agendamentoRoutes);
// app.use('/api/v1/appointments', appointmentRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err.stack || err);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro interno no servidor." });
  }
);

app.listen(PORT, () => {
  console.log(`\n Servidor Express rodando na porta ${PORT}`);
});
