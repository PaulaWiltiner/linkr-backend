import { createPostSchema } from "../schemas/postSchema";

export async function validateCreatePost(req, res, next) {
  const post = req.body;
  const { error } = createPostSchema.validate(post, { abortEarly: false });

  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);

    console.log(errorsMessageArray);
    return res.status(422).send(errorsMessageArray.replace(/[\\"()]/g, "")); // o replace retira os caracteres indesejáveis
  }
}
