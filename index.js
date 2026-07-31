import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import { configDotenv } from "dotenv";

import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/auth.js";

configDotenv();

const app = express();

// Middlewares
app.use(morgan("tiny"));
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
  })
);

// Routes
app.use("/users", userRouter);
app.use("/auth", authRouter);

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