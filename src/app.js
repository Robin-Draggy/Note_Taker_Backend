import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";

import { router as authRoutes } from "./routes/auth.route.js";
import { router as noteRoutes } from "./routes/note.route.js"
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(pinoHttp());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Secure Notes API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;