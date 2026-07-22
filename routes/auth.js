import { Router } from "express";
import { body, validationResult } from "express-validator";
import db from "../utils/db.js";

const router = Router();

// ================= REGISTER =================

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 400;
        error.errors = errors.array();
        return next(error);
      }

      const { name, email, password } = req.body;

      const checkSql = `
        SELECT *
        FROM auth
        WHERE email = ?
      `;

      const [user] = await db.query(checkSql, [email]);

      if (user.length > 0) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        return next(error);
      }

      const insertSql = `
        INSERT INTO auth(name, email, upassword)
        VALUES(?, ?, ?)
      `;

      await db.query(insertSql, [name, email, password]);

      res.status(201).json({
        success: true,
        message: "Registration Successful",
      });
    } catch (err) {
      next(err);
    }
  }
);

// ================= LOGIN =================

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 400;
        error.errors = errors.array();
        return next(error);
      }

      const { email, password } = req.body;

      const sql = `
        SELECT *
        FROM auth
        WHERE email = ?
        AND upassword = ?
      `;

      const [rows] = await db.query(sql, [email, password]);

      if (rows.length === 0) {
        const error = new Error("Invalid Credentials");
        error.statusCode = 401;
        return next(error);
      }

      res.json({
        success: true,
        message: "Login Successful",
      });
    } catch (err) {
      next(err);
    }
  }
);

// ================= LOGOUT =================

router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout Successful",
  });
});

export default router;