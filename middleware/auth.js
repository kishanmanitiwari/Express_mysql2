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
  console.log(token);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("I am here");
    
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

//jwt
export function isAdminJWT(req, res, next) {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Acess Denied" });
  }

  next();
}

//session
export function isAdminSession(req, res, next) {
  if (req.session.user.role !== "Admin") {
    return res.status(403).json({
      message: "Access Denied",
    });
  }

  next();
}
