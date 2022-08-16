import { searchUsers } from "../repositories/usersRepository.js";

export async function getUsers(req, res) {
  const { username } = req.params;
  const { rows: users } = await searchUsers(username);
  return res.status(200).send(users);
}
