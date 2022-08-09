import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    console.log(user);
    if (err) return res.sendStatus(401);

    req.email = user;
    next();
  });
}
