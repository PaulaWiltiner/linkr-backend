import { Router } from "express";
import {
  createPost,
  deletePost,
  pullPosts,
} from "../controllers/postsController.js";
import { validateCreatePost } from "../middlewares/validateCreatePost.js";
import { validateAlterationPost } from "../middlewares/validateAlterationPost.js";
import authenticateToken from "../middlewares/authenticateToken.js";

export const postsRouter = Router();
postsRouter.post("/post", authenticateToken, validateCreatePost, createPost);
postsRouter.get("/posts", pullPosts);
postsRouter.delete(
  "/posts/:id",
  authenticateToken,
  validateAlterationPost,
  deletePost
);
