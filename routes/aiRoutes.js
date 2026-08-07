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

// Add these to your router file

// GET /api/ai/chat/:id/messages
router.get("/chat/:id/messages", jwtAuth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    const messages = await aiService.getConversationMessages(
      conversationId,
      userId,
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/ai/chat/:id
router.delete("/chat/:id", jwtAuth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.id;

    await aiService.deleteConversation(conversationId, userId);

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
