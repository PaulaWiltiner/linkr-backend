import { connection } from "../dbStrategy/postgres.js";
import urlMetaData from "url-metadata";
import { deletePostById, getPosts } from "../repositories/postsRepository.js";

export async function createPost(req, res) {
  const post = req.body;
  const email = req.email;

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
      `INSERT INTO posts (description, link) VALUES ($1, $2) RETURNING id`,
      [post.description, post.link]
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
    console.log(error);
    return res.sendStatus(500);
  }
}

async function pull(item) {
  let result;
  try {
    result = await urlMetaData(item);
  } catch (err) {
    result = {
      title: "",
      description: "",
      image: "",
      url: "",
    };
  }
  item["link"] = {
    title: result.title,
    description: result.description,
    image: result.image,
    url: result.url,
  };

  return item;
}

export async function pullPosts(req, res) {
  try {
    const postList = await getPosts();
    const newList = [];
    for (let item of postList) {
      const resp = await pull(item);
      newList.push(resp);
    }
    return res.send(newList).status(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function updatePost(req, res){
  const {description} = req.body;
  const {id} = req.params;

  try {
    await connection.query(`UPDATE posts SET description = $2 WHERE id = $1`, [id, description]);

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
