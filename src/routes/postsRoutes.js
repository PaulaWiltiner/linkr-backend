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
  getComments,
  createComment,
  reePosts,
} from "../controllers/postsController.js";
import { validatePostComments } from "../middlewares/validatePostComments.js";
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
import { validateCreateComment } from "../middlewares/validateCreateComment.js";

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

postsRouter.get("/post/repost/:postId", reePosts);

postsRouter.get(
  "/posts/:postId/comments",
  authenticateToken,
  validatePostComments,
  getComments
);
postsRouter.post(
  "/posts/:postId/comments",
  authenticateToken,
  validateCreateComment,
  createComment
);
