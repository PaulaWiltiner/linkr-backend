import { createPostSchema } from "../schemas/postSchema.js";

export async function validateCreatePost(req, res, next) {
  const post = req.body;
  const { error } = createPostSchema.validate(post, { abortEarly: false });
  console.log(createPostSchema.validate(post));
  if (error) {
    const errorsMessageArray = error.details.map((error) => error.message);

    return res.status(422).send(errorsMessageArray); // o replace retira os caracteres indesejáveis
  }

  next();
}
