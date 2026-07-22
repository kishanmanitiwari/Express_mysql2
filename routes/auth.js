import { Router } from "express";
import { body, validationResult } from "express-validator";
import db from "../utils/db.js";
import bcrypt from "bcrypt";

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

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO auth(name, email, upassword)
        VALUES(?, ?, ?)
      `;

      await db.query(insertSql, [name, email, hashedPassword]);

      res.status(201).json({
        success: true,
        message: "Registration Successful",
      });
    } catch (err) {
      next(err);
    }
  },
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
      `;

      const [rows] = await db.query(sql, [email]);

      if (rows.length == 0) {
        const error = new Error("Invalid Credentials");
        error.statusCode = 409;
        return next(error);
      }

      const isMatch = await bcrypt.compare(password, rows[0].upassword);

      if (isMatch == false) {
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
  },
);

// ================= LOGOUT =================

router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout Successful",
  });
});

export default router;
