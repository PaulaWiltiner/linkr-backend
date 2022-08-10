import { Router } from "express";
import { postsRouter } from "./postsRoutes.js";

export const router = Router();

router.use(postsRouter);
