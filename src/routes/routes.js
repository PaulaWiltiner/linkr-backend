import { Router } from "express";
import {authRouter} from '../routes/authRouter.js';

export const router = Router();

router.use(authRouter);