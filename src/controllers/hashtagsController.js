import { getOneHashtag } from "../repositories/hashtagsRepository.js";

export async function oneHashtag(req, res) {
  const { id } = req.params;
  const hashtag = await getOneHashtag(id);

  if (!hashtag) {
    return res.sendStatus(404);
  }

  return res.send(hashtag).status(200);
}
