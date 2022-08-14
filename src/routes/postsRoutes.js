import { Router } from "express";
import {createPost, deletePost,  likePost,  pullPosts, unlikePost, updatePost} from "../controllers/postsController.js";
import { validateAlterationPost } from "../middlewares/validateAlterationPost.js";
import { validateCreatePost } from "../middlewares/validateCreatePost.js";
import {
  createPost,
  deletePost,
  pullPosts,
  updatePost,
} from "../controllers/postsController.js";
import { validateAlterationPost } from "../middlewares/validateAlterationPost.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { validateUrl } from "../middlewares/validateUrl.middlewares.js";
import {validateUpdatePost} from "../middlewares/validateUpdatePost.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { likeMiddleware, unlikeMiddleware } from "../middlewares/likeMiddleware.js";

export const postsRouter = Router();
postsRouter.post(
  "/post",
  authenticateToken,
  validateCreatePost,
  validateUrl,
  createPost
);
postsRouter.get("/posts", pullPosts);
postsRouter.put("/post/:id", authenticateToken,validateUpdatePost, validateAlterationPost, updatePost);
postsRouter.delete("/posts/:id",  authenticateToken,  validateAlterationPost,  deletePost);
postsRouter.post("/post/like/:postId", authenticateToken, likeMiddleware, likePost);
postsRouter.delete("/post/like/:postId", authenticateToken, unlikeMiddleware, unlikePost);

