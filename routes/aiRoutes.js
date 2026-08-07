import { Router } from "express";
import * as aiService from "../services/ai.service.js";
import {jwtAuth} from "../middleware/auth.js";

const router = Router();

router.post("/chat",jwtAuth, async (req, res, next) => {
  try {
    const { message , conversationId,} = req.body;

    const response = await aiService.chat(req.user.id,conversationId,message);

    res.json({
      sucess: true,
      data: response,
    });
  } catch (error) {
    //global hander error
    next(error);
  }
});

router.post("/review-resume",jwtAuth, async (req, res, next) =>{

  try{
        const { resume } = req.body;

        const response =
            await aiService.reviewResume(resume);

        res.json({

            success: true,

            data: response,

        });

    } catch (err) {

        next(err);

    }

});


export default router;
