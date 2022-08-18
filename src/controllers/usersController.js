import { searchUsers } from "../repositories/usersRepository.js";

export async function getUsers(req, res) {
  const { username } = req.params;
  try {
    const { rows: users } = await searchUsers(username, res.locals.userId);
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
