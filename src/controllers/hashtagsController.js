import {
  getOneHashtag,
  getHashtags,
} from "../repositories/hashtagsRepository.js";

export async function oneHashtag(req, res) {
  const { hashtag } = req.params;
  const { rows: hashtagList } = await getOneHashtag(
    res.locals.userId,
    "#" + hashtag
  );

  if (!hashtagList) {
    return res.sendStatus(404);
  }

  return res.send(hashtagList).status(200);
}

export async function pullHashtags(req, res) {
  try {
    const { rows: hashtagList } = await getHashtags();
    return res.send(hashtagList).status(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}
