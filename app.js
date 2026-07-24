import express from "express";
import morgan from "morgan";

import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/auth.js";

const app = express();

// Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log(`Server is running on http://localhost:3000`);
});
