import { signupSchema } from "../schemas/signUpSchema.js";

export default function validateSignUp(req, res, next) {
  const validate = signupSchema.validate(req.body);

  if (validate.error) {
    res.status(422).send(`${validate.error.message}`);
    return;
  }

  next();
}
