import { Router } from "express";
import db from "../utils/db.js";

const router = Router();

// localhost:3000/users/users
//create
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
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
router.put("/", async (req, res) => {
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
router.delete("/", async (req, res) => {
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

export default router;
