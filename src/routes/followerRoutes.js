import { Router } from "express";
import {followed, unfollowed} from "../controllers/followerControllers.js";
import authenticateToken from "../middlewares/authenticateToken.js";

export const followerRouter = Router();

followerRouter.post('user/follower/:id',authenticateToken, followed);
followerRouter.delete('user/follower/:id',authenticateToken, unfollowed);