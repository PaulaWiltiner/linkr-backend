import {
  searchWithFollowers,
  searchUsers,
} from "../repositories/usersRepository.js";

export async function getUsers(req, res) {
  const { username } = req.params;
  let users;
  try {
    if (res.locals.status) {
      let { rows: users } = await searchWithFollowers(
        username,
        res.locals.userId
      );
      return res.status(200).send(users);
    } else {
      let { rows: users } = await searchUsers(username);
      return res.status(200).send(users);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
