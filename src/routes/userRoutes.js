import { Router } from "express";
import { getUsers } from "../controllers/usersController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

export const userRouter = Router();

userRouter.get("/users/:username", authenticateToken, getUsers);
