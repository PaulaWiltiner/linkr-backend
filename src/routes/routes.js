import { Router } from "express";
import { postsRouter } from "./postsRoutes.js";
import authRouter from "./authRoutes.js";
import { hashtagsRouter } from "./hashtagsRoutes.js";
import { userRouter } from "./userRoutes.js";
import { followerRouter } from "./followerRoutes.js";

export const router = Router();

router.use(postsRouter);
router.use(authRouter);
router.use(hashtagsRouter);
router.use(userRouter);
router.use(followerRouter);
