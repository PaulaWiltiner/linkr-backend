import { connection } from "../dbStrategy/postgres.js";
import {
  createLike,
  deleteLike,
  deletePostById,
  getPosts,
  getPostsByUserId,
} from "../repositories/postsRepository.js";
import { getUserById } from "../repositories/usersRepository.js";

export async function createPost(req, res) {
  const post = req.body;
  const email = req.email;
  const {
    title: titleURL,
    description: descriptionURL,
    image: imageURL,
  } = res.infosUrl;
  try {
    let arrayHashtagsId = [];
    const descriptionArray = post.description.split(" ");
    const userHashtags = descriptionArray.filter(
      (hashtag) => hashtag[0] === "#"
    );

    const { rows: dbHashtags } = await connection.query(
      `SELECT hashtag FROM trending`
    );
    const alreadyExistHashtags = dbHashtags.map((user) => user.hashtag);

    const hashtagsToInsert = userHashtags.filter((userHashtag) => {
      let existHashtag = false;

      alreadyExistHashtags.map((dbHashtag) => {
        if (userHashtag === dbHashtag) {
          existHashtag = true;
        }
      });

      if (existHashtag == false) {
        return userHashtag;
      }
    });

    const { rows: user } = await connection.query(
      `SELECT id FROM users WHERE email = $1;`,
      [email]
    );
    const {
      rows: [postId],
    } = await connection.query(
      `INSERT INTO posts (description, link, titleURL, descriptionURL , imageURL) VALUES ($1, $2, $3,$4,$5) RETURNING id`,
      [post.description, post.link, titleURL, descriptionURL, imageURL]
    );

    hashtagsToInsert.map(async (hashtag) => {
      await connection.query(`INSERT INTO trending (hashtag) VALUES ($1)`, [
        hashtag,
      ]);
    });

    for (let i = 0; i < userHashtags.length; i++) {
      const {
        rows: [hashtagId],
      } = await connection.query(`SELECT id FROM trending WHERE hashtag = $1`, [
        userHashtags[i],
      ]);

      arrayHashtagsId.push(hashtagId.id);
    }

    arrayHashtagsId.map(async (id) => {
      await connection.query(
        `INSERT INTO "postHashtags" ("postId", "hashtagId") VALUES ($1, $2)`,
        [postId.id, id]
      );
    });

    await connection.query(
      `INSERT INTO "userPosts" ("postId", "userId") VALUES ($1, $2)`,
      [postId.id, user[0].id]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function pullPosts(req, res) {
  try {
    const postList = await getPosts(res.locals.userId);
    return res.send(postList).status(200);
  } catch (error) {
    return res
      .status(500)
      .send(
        "An error occured while trying to fetch the posts, please refresh the page"
      );
  }
}

export async function updatePost(req, res) {
  const { description } = req.body;
  const { id } = req.params;

  try {
    await connection.query(`UPDATE posts SET description = $2 WHERE id = $1`, [
      id,
      description,
    ]);

    return res.status(200).send("successfully updated");
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;

  await deletePostById(id);

  return res.status(200).send("Post deleted!");
}

export async function likePost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    await createLike(postId, userId);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function unlikePost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    await deleteLike(postId, userId);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function postsByUserId(req, res) {
  const { id } = req.params;

  try {
    const {
      rows: [user],
    } = await getUserById(id);

    if (!user) return res.sendStatus(404);

    console.log(user);
    const userPosts = await getPostsByUserId(user.id);
    console.log(userPosts);
    return res.status(200).send(userPosts);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
