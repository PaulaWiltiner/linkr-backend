import { Router } from "express";
import { oneHashtag } from "../controllers/hashtagsController.js";

export const hashtagsRouter = Router();
hashtagsRouter.get("/hashtags/:id", oneHashtag);
