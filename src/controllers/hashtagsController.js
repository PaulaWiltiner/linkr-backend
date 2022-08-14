import { getOneHashtag } from "../repositories/hashtagsRepository.js";

export async function oneHashtag(req, res) {
  const { id } = req.params;
  const { rows: hashtag } = await getOneHashtag(res.locals.userId, id);

  if (!hashtag) {
    return res.sendStatus(404);
  }

  return res.send(hashtag).status(200);
}
