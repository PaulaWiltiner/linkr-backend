import { Router } from "express";
import {followed, unfollowed} from "../controllers/followerControllers.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { validateFollowed, validateUnFollow } from "../middlewares/validateFollowers.js";

export const followerRouter = Router();

followerRouter.post('/user/follower/:idFollowed',authenticateToken, validateFollowed, followed);
followerRouter.delete('/user/follower/:idFollowed',authenticateToken,validateUnFollow, unfollowed);