import { Router } from "express";
// import userSchema from "../schemas/userSchema.js";
import loginSchema from "./../schemas/loginSchema.js";
import { login } from "./../controllers/authController.js";
// import { createUser } from "../controllers/userController.js";
import { validateSchema } from "./../middlewares/schemaValidator.js";
import authenticateToken from "./../middlewares/authenticateToken.js";

const authRouter = Router();

// authRouter.post('/signup', validateSchema(userSchema), createUser);
authRouter.post("/signin", validateSchema(loginSchema), login);
authRouter.put("/logout", authenticateToken, login);

export default authRouter;
