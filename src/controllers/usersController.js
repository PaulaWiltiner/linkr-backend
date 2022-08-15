import { getAllUsers } from "../repositories/usersRepository.js";

export async function getUsers(req, res) {
  const { rows: users } = await getAllUsers();

  return res.status(200).send(users);
}
