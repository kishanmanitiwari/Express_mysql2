import { Router } from "express";
import * as aiService from "../services/ai.service.js";
import { jwtAuth } from "../middleware/auth.js";

const router = Router();

// Get all conversations for the logged-in user
router.get("/conversations", jwtAuth, async (req, res, next) => {
  try {
    // req.user.id is populated by your jwtAuth middleware
    const userId = req.user.id;

    const conversations = await aiService.getUserConversations(userId);

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/chat", jwtAuth, async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    const response = await aiService.chat(req.user.id, conversationId, message);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/review-resume", jwtAuth, async (req, res, next) => {
  try {
    const { resume } = req.body;

    const response = await aiService.reviewResume(resume);

    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
