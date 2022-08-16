import { Router } from "express";
import { getUsers } from "../controllers/usersController.js";

export const userRouter = Router();

userRouter.get("/users", getUsers);
