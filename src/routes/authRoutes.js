import { Router } from "express";
import loginSchema from "./../schemas/loginSchema.js";
import { login, logout } from "./../controllers/authController.js";
import { validateSchema } from "./../middlewares/schemaValidator.js";
import authenticateToken from "./../middlewares/authenticateToken.js";
import signUp from "../controllers/authController.js";
import validateSignUp from "../middlewares/validateSignUp.js";

const authRouter = Router();

authRouter.post("/signin", validateSchema(loginSchema), login);
authRouter.put("/logout", authenticateToken, logout);
authRouter.post('/signup', validateSignUp, signUp);

export default authRouter;
