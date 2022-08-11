import bcrypt from "bcrypt";
import {
  createSession,
  getSessionUserId,
  deleteSession,
} from "../repositories/authRepository.js";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../repositories/usersRepository.js";
import dotenv from "dotenv";
dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;
  const { rows: users } = await getUserByEmail(email);
  const [user] = users;
  if (!user) {
    return res.sendStatus(401);
  }
  const session = await getSessionUserId(user.id);
  if (bcrypt.compareSync(password, user.password) && !session) {
    const token = jwt.sign({ email: users.email }, process.env.ACCESS_TOKEN);
    await createSession(token, user.id);
    return res
      .send({ username: user.username, picture: user.picture, token })
      .status(200);
  }

  res.sendStatus(401);
}

export async function logout(req, res) {
  try {
    const { session } = res.locals;
    await deleteSession(session.userId);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(401);
  }
}
