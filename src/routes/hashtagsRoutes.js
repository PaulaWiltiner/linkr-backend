import { Router } from "express";
import { oneHashtag } from "../controllers/hashtagsController.js";
import authenticateToken from "./../middlewares/authenticateToken.js";

export const hashtagsRouter = Router();
hashtagsRouter.get("/hashtags/:id", authenticateToken, oneHashtag);
