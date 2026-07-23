import { Router } from "express";
import db from "../utils/db.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({ debug: true });

const router = Router();

/*
Base URL: /users
*/

// ==================== CREATE ====================
router.post(
  "/",
  [
    body("name")
      .exists()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Name should be greater than 4 characters"),
    body("age")
      .exists()
      .notEmpty()
      .isInt({ min: 18 })
      .withMessage("Age cannot be less than 18"),
    body("email")
      .exists()
      .isEmail()
      .withMessage("'Please provide a valid email address")
      .normalizeEmail(), // Sanitizer
    body("password").exists().notEmpty().isLength({ min: 8 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      const { name, email, password, age } = req.body;

      // if (name == undefined || !email || !password || !age) {
      //   return res.status(400).json({ error: "All feilds are required" });
      // }

      // if (name.length < 3) {
      //   return res.status(400).json({
      //     message: "Name should contain at least 3 characters.",
      //   });
      // }

      // if (age < 18) {
      //   return res.status(400).json({
      //     message: "Age must be at least 18.",
      //   });
      // }

      const sql = `
        INSERT INTO users(name,email,password, age)
        VALUES(?,?,?,?)
    `;

      const [result] = await db.query(sql, [name, email, password, age]);

      res.status(201).json({
        message: "User created successfully.",
        result,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ==================== READ ====================
router.get("/", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = new Error("Token missing!");
      error.status = 401;
      return next(error);
    }

    // Bearer fjsddsflldfslsdf
    const tokenSplit = authHeader.split(" ");
    // [Bearer,dsfjlfdlfjdsljfdsljfdl]

    const token = tokenSplit[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decoded);

    const sql = `
        SELECT *
        FROM users
    `;

    const [users] = await db.query(sql);

    res.status(200).json(users);
  } catch (error) {
    next(error); //Error handling - Express Global Error Handler
  }
});

// ==================== UPDATE ====================
router.put("/", async (req, res, next) => {
  try {
    const { id, name, age } = req.body;

    const sql = `
        UPDATE users
        SET
            name='${name}',
            age=${age}
        WHERE id=${id}
    `;

    const [result] = await db.query(sql);

    res.status(200).json({
      message: "User updated successfully.",
      result,
    });
  } catch (error) {
    next(error); //Errror handling - Express Global Error Handler
  }
});

// ==================== PATCH ====================
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    // At least one field must be provided
    if (!name && age === undefined) {
      return res.status(400).json({
        message: "Provide at least one field to update.",
      });
    }

    let sql = `UPDATE users SET `;

    if (name) {
      sql += `name='${name}'`;
    }

    if (age !== undefined) {
      if (name) sql += ", ";
      sql += `age=${age}`;
    }

    sql += ` WHERE id=${id}`;

    const [result] = await db.query(sql);

    res.status(200).json({
      message: "User updated successfully.",
      result,
    });
  } catch (error) {
    next(error); //Errror handling - Express Global Error Handler
  }
});

// ==================== DELETE ====================
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
        DELETE FROM users
        WHERE id=${id}
    `;

    const [result] = await db.query(sql);

    res.status(200).json({
      message: "User deleted successfully.",
      result,
    });
  } catch (error) {
    next(error); //Errror handling - Express Global Error Handler
  }
});

export default router;
