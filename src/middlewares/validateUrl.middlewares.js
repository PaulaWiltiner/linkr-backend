import urlMetaData from "url-metadata";

export async function validateUrl(req, res, next) {
  let result;
  try {
    result = await urlMetaData(req.body.link);
  } catch (err) {
    return res.status(422).send("Invalid URL");
  }
  req.infosUrl = {
    title: result.title,
    description: result.description,
    image: result.image,
  };
  next();
}
