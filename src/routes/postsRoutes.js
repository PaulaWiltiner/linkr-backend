import { Router } from "express";
import {
  createPost,
  deletePost,
  likePost,
  postsByUserId,
  pullPosts,
  reloadPosts,
  rePost,
  unlikePost,
  updatePost,
} from "../controllers/postsController.js";
import { validateCreatePost } from "../middlewares/validateCreatePost.js";
import { validateAlterationPost } from "../middlewares/validateAlterationPost.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { validateUrl } from "../middlewares/validateUrl.middlewares.js";
import { validateUpdatePost } from "../middlewares/validateUpdatePost.js";
import {
  likeMiddleware,
  unlikeMiddleware,
} from "../middlewares/likeMiddleware.js";
import {
  validateFollowers,
  validatePostsFollowers,
} from "../middlewares/validateFollowers.js";
import { validateRePost } from "../middlewares/validateRePost.js";

export const postsRouter = Router();
postsRouter.post(
  "/post",
  authenticateToken,
  validateCreatePost,
  validateUrl,
  createPost
);
postsRouter.get(
  "/posts",
  authenticateToken,
  validateFollowers,
  validatePostsFollowers,
  pullPosts
);
postsRouter.get("/user/:id", postsByUserId);

postsRouter.put(
  "/post/:id",
  authenticateToken,
  validateUpdatePost,
  validateAlterationPost,
  updatePost
);
postsRouter.delete(
  "/posts/:id",
  authenticateToken,
  validateAlterationPost,
  deletePost
);
postsRouter.post(
  "/post/like/:postId",
  authenticateToken,
  likeMiddleware,
  likePost
);
postsRouter.delete(
  "/post/like/:postId",
  authenticateToken,
  unlikeMiddleware,
  unlikePost
);
postsRouter.get("/posts/reload", authenticateToken, reloadPosts);

postsRouter.post(
  "/post/repost/:postId",
  authenticateToken,
  validateRePost,
  rePost
);
