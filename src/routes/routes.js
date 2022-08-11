import { Router } from "express";
import { postsRouter } from "./postsRoutes.js";
import authRouter from "./authRoutes.js";

export const router = Router();

router.use(postsRouter);
router.use(authRouter);