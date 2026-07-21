import { Router } from "express";
import db from "../utils/db.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = `
            SELECT *
            FROM users
            WHERE email=?
            AND upassword=?
        `;

    console.log(sql);

    const [rows] = await db.query(sql, [username, password]); //rows[0]

    if (rows.length > 0) return res.send("Login Successful");

    res.send("Invalid Credentials");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post("/register", () => {});

router.post("/logout", () => {});

export default router;
