import express from "express";
import morgan from "morgan";
import userRouter from "#routes/userRoute.js";
import authRoute from "#routes/auth.js";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/users", userRouter);
app.use("/auth", authRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
