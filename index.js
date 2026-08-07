import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import { configDotenv } from "dotenv";
import { rateLimit } from "express-rate-limit";
import cors from "cors";

import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/auth.js";
import aiRoutes from "./routes/aiRoutes.js";

configDotenv();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

const origins = [
  { environment: "local", url: "http://localhost:3000" },
  {
    environment: "production",
    url: "https://chat-app-umber-tau-85.vercel.app/",
  },
];

// Middlewares
app.use(limiter);
app.use(morgan("tiny"));
app.use(
  cors({
    origin: origins.map((origin) => origin.url),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Session Secret
    resave: false, // Don't save if unmodified
    saveUninitialized: false, // Don't create empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
      httpOnly: true,
      secure: false, // true in production with HTTPS
    },
  }),
);

app.get("/", (req, res) => {
  res.send("Welcome to the Express MySQL2 API!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Routes
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/api/ai", aiRoutes);

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
