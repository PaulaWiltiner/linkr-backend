import {updateSchema} from '../schemas/postSchema.js';

export async function validateUpdatePost(req, res, next) {
    const validate = updateSchema.validate(req.body);
  
    if (validate.error) {
      res.status(422).send(validate.error.message.replace(/[\\"()]/g, ""));
      return;
    }
  
    next();
  }