import { Router } from "express";
import { createPost } from "../controllers/postsController.js";
import { validateCreatePost } from "../middlewares/validateCreatePost.js";
export const postsRouter = Router();

postsRouter.post("/post", validateCreatePost, createPost);
