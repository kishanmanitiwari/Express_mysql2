import express from "express";
import morgan from "morgan";
import db from "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create
app.post("/users", async (req, res) => {
  try {
    const { id, name, age } = req.body;

    const sql = `insert into users values(${id},'${name}',${age})`; //Created my query

    const [rows] = await db.query(sql);
    res.json(rows); //data[0]
  } catch (error) {
    console.log(error);
    res.json("Something went wrong!");
  }
});

//read
app.get("/users", async (req, res) => {
  try {
    const sql = `SELECT * FROM USERS`; //Created my query
    const [rows] = await db.query(sql);
    res.json(rows); //data[0]
  } catch (error) {
    console.log(error);
    res.json("Something went wrong!");
  }
});

//update
app.put("/users", async (req, res) => {
  try {
    const { id, name, age } = req.body;
    const sql = `update users set name='${name}', age =${age} where id = ${id}`; //Created my query
    const [rows] = await db.query(sql);
    res.json(rows); //data[0]
  } catch (error) {
    console.log(error);
    res.json("Something went wrong!");
  }
});

//delete
app.delete("/users", async (req, res) => {
  try {
    const { id } = req.body;
    const sql = `
    DELETE FROM users
    WHERE id=${id}`;
    const [rows] = await db.query(sql);
    res.json(rows); //data[0]
  } catch (error) {
    console.log(error);
    res.json("Something went wrong!");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
