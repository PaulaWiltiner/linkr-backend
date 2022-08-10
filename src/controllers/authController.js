import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import {
  createSession,
  getSessionUserId,
  deleteSession,
} from "../repositories/authRepository.js";
import { getUserByEmail } from "../repositories/usersRepository.js";

export async function login(req, res) {
  const { email, password } = req.body;

  const { rows: users } = await getUserByEmail(email);
  const [user] = users;
  if (!user) {
    return res.sendStatus(401);
  }
  const session = await getSessionUserId(user.id);
  if (bcrypt.compareSync(password, user.password) && !session) {
    const token = uuid();
    await createSession(token, user.id);
    console.log(user);
    return res
      .send({
        username: user.username,
        picture: user.picture,
        token,
      })
      .status(200);
  }

  res.sendStatus(401);
}

export async function logout(req, res) {
  try {
    const { session } = res.locals;
    const { token } = session.token;
    await deleteSession(token);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(401);
  }
}
