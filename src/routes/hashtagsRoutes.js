import { Router } from "express";
import { oneHashtag } from "../controllers/hashtagsController.js";
import authenticateToken from "./../middlewares/authenticateToken.js";

export const hashtagsRouter = Router();
hashtagsRouter.get("/hashtags/:hashtag", authenticateToken, oneHashtag);
