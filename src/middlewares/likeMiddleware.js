import { findLike, findPost } from "../repositories/postsRepository.js";

export async function likeMiddleware(req, res, next) {
  const { postId } = req.params;
  const { userId } = res.locals;

  try {
    const postExists = await findPost(postId);
    if (!postExists) {
      return res.sendStatus(404);
    }

    const likeExists = await findLike(postId, userId);
    if (likeExists) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function unlikeMiddleware(req, res, next) {
  const { userId } = res.locals;
  const { postId } = req.params;

  try {
    const postExists = await findLike(postId, userId);
    if (!postExists) {
      return res.sendStatus(404);
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
}