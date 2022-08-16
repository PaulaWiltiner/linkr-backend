import { getOneFollower } from "../repositories/followers.js";

export async function validateFollowers(req, res, next) {
  try {
    const result = await getOneFollower(res.locals.userId);
    if (result.length === 0) {
      return res
        .status(404)
        .send("You don't follow anyone yet. Search for new friends!");
    }
  } catch (err) {
    return res.status(500);
  }
  next();
}
