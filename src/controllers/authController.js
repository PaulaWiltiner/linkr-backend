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

import { connection } from "../dbStrategy/postgres.js";

export default async function signUp(req, res){

    const {
        username,
        email,
        password,
        picture
    } = req.body

    const {rows:isEmail} = await connection.query(`SELECT email FROM users WHERE email = $1`, [email])

    if(isEmail.length > 0){
        
        res.sendStatus(409);
        return;
    }
    const hashPassword=bcrypt.hashSync(password, 10);
    await connection.query('INSERT INTO users (picture, username, email, password) VALUES ($1, $2, $3, $4)', [picture, username, email, hashPassword]);

    res.sendStatus(201);
}

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
