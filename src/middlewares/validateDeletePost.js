import { connection } from "../dbStrategy/postgres.js";
import { getPostById } from "../repositories/postsRepository.js";
import { getUserByEmail } from "../repositories/usersRepository.js";

export async function validateDeletePost(req, res, next) {
  const email = req.email;
  const { id } = req.params;
  const {
    rows: [user],
  } = await getUserByEmail(email);
  const post = await getPostById(id);

  if (post.length === 0) return res.sendStatus(404);
  if (post[0].userId !== user.id) return res.sendStatus(401);

  next();
}
