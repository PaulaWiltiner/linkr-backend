import {
  findPost,
  findRePost,
  belongPost,
} from "../repositories/postsRepository.js";

export async function validateRePost(req, res, next) {
  const { userId } = res.locals;
  const { postId } = req.params;

  try {
    const rePostExists = await findRePost(postId, userId);
    if (rePostExists) {
      return res.sendStatus(409);
    }
    const postExists = await findPost(postId);
    if (!postExists) {
      return res.sendStatus(404);
    } else {
      res.locals.post = postExists;
    }
    const postBelongUser = await belongPost(postId, userId);
    if (postBelongUser) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
}
