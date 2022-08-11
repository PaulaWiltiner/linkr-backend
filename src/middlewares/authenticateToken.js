import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getSession } from "../repositories/authRepository.js";
dotenv.config();

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(401);

    req.email = user.email;
  });

  const session = await getSession(token);
  if (!session) {
    return res.sendStatus(401);
  }

  res.locals.session = session;

  next();
}
