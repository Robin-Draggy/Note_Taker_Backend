import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";

import { router as authRoutes } from "./routes/auth.route.js";
import { router as noteRoutes } from "./routes/note.route.js";
import { router as adminRoutes } from "./routes/admin.route.js";
import { router as postRoutes } from "./routes/post.route.js";
import { router as userRoutes } from "./routes/user.route.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  "https://notetaker-ruby-alpha.vercel.app",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5500",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: false,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(pinoHttp());

// Health
app.get("/api/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Secure Notes API is running" });
});

// Static frontend
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);

app.use("/api/users", userRoutes);

// 404 + error handler (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
