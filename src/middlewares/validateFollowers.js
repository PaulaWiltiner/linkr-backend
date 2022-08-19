import {
  getOneFollower,
  getOnePostFollower,
} from "../repositories/followers.js";

export async function validateFollowers(req, res, next) {
  try {
    const result = await getOneFollower(res.locals.userId);
    res.locals.validateErrFollower = "";
    res.locals.status = true;
    if (result.length === 0) {
      res.locals.validateErrFollower =
        "You don't follow anyone yet. Search for new friends!";
      res.locals.status = false;
    }
  } catch (err) {
    return res.status(500);
  }
  next();
}

export async function validatePostsFollowers(req, res, next) {
  try {
    const result = await getOnePostFollower(res.locals.userId);
    if (res.locals.validateErrFollower === "" && result.length === 0) {
      res.locals.validateErrFollower = "No posts found from your friends";
    }
  } catch (err) {
    return res.status(500);
  }
  next();
}
