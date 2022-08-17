import { Router } from "express";
import {followed, unfollowed} from "../controllers/followerControllers.js";

export const followerRouter = Router();

followerRouter.post('user/follower/:id', followed());
followerRouter.delete('user/follower/:id', unfollowed());