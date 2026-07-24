import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv({ debug: true });

export function jwtAuth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
}

export function isAuthenticatedSession(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.user = req.session.user;
  next();
}
