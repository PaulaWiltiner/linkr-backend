import { connection } from "../dbStrategy/postgres.js";
import { createCommentSchema } from "../schemas/postSchema.js";

export async function validateCreateComment(req, res, next) {
  const { comment } = req.body;
  const { postId } = req.params;

  const { rows: postExist } = await connection.query(
    `SELECT * FROM "posts" WHERE id = $1`,
    [postId]
  );

  if (postExist.length === 0) return res.sendStatus(404);

  const { error } = createCommentSchema.validate(
    { comment },
    {
      abortEarly: false,
    }
  );

  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);
    console.log(error);
    return res.status(422).send(errorsMessageArray);
  }

  next();
}
