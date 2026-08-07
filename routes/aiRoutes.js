import { Router } from "express";
import * as aiService from "../services/ai.service.js";

const router = Router();

router.post("/chat", async (req, res, next) => {
  try {
    const { message } = req.body;

    const response = await aiService.chat(message);

    res.json({
      sucess: true,
      data: response,
    });
  } catch (error) {
    //global hander error
    next(error);
  }
});

export default router;
