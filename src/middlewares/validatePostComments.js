import { connection } from "../dbStrategy/postgres.js";

export async function validatePostComments(req, res, next) {
  const { postId } = req.params;
  const { rows: comments } = await connection.query(
    `SELECT * FROM "postComments" WHERE "postId" = $1`,
    [postId]
  );

  if (comments.length === 0) return res.status(404).send("No comments yet!");

  next();
}
