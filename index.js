import express from "express";
import morgan from "morgan";
import db from "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.get("/api/students", async (req, res) => {
  try {
    const data = await db.query("Select * from students");
    res.send(data[0]);
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on 3000");
});
