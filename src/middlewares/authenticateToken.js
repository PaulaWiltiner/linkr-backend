import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getSession } from "../repositories/authRepository.js";
dotenv.config();

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.email = user.email;
    res.locals.userId = user.id;
  } 
  catch{
    return res.sendStatus(401);
  }

  const session = await getSession(token);
 
  if (!session) {
    return res.sendStatus(401);
  }

  res.locals.session = session;
  next();
}
