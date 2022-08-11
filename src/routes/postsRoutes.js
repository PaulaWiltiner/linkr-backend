import { Router } from "express";
import { createPost, pullPosts } from "../controllers/postsController.js";
import { validateCreatePost } from "../middlewares/validateCreatePost.js";
import authenticateToken from "../middlewares/authenticateToken.js";

export const postsRouter = Router();
postsRouter.post("/post", authenticateToken, validateCreatePost, createPost);
postsRouter.get("/posts", pullPosts);
