import { Router } from "express";
import { createPost, pullPosts, updatePost } from "../controllers/postsController.js";
import { validateCreatePost } from "../middlewares/validateCreatePost.js";
import {validateUpdatePost} from "../middlewares/validateUpdatePost.js";
import authenticateToken from "../middlewares/authenticateToken.js";

export const postsRouter = Router();
postsRouter.post("/post", authenticateToken, validateCreatePost, createPost);
postsRouter.get("/posts", pullPosts);
postsRouter.put("/post/:id", authenticateToken, validateUpdatePost, updatePost)
