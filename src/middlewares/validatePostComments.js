import { connection } from "../dbStrategy/postgres.js";

export async function validatePostComments(req, res, next) {
  const { postId } = req.params;

  const { rows: comments } = await connection.query(
    `SELECT * FROM "postComments" WHERE "postId" = $1`,
    [postId]
  );

  const {
    rows: [postAuthor],
  } = await connection.query(
    `SELECT "userId" FROM "userPosts" WHERE "postId" = $1`,
    [postId]
  );

  if (comments.length === 0) {
    res.locals.userId = postAuthor;
    res.locals.comments = [];
    next();
    return;
  }

  res.locals.userId = postAuthor;
  res.locals.comments = comments;

  next();
}
