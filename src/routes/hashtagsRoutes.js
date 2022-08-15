import { Router } from "express";
import { oneHashtag, pullHashtags } from "../controllers/hashtagsController.js";
import authenticateToken from "./../middlewares/authenticateToken.js";

export const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags/:hashtag", authenticateToken, oneHashtag);
hashtagsRouter.get("/hashtags", pullHashtags);
