import { connection } from "../dbStrategy/postgres.js";

export async function createPost(req, res) {
  const post = req.body;
  req.email = "r@r.com";
  const email = req.email;

  try {
    const descriptionArray = post.description.split(" ");
    const arrHashtags = descriptionArray.filter(
      (hashtag) => hashtag[0] === "#"
    );

    const { rows: dbHashtags } = await connection.query(
      `SELECT hashtag FROM trending`
    );
    const userHashtags = dbHashtags.map((user) => user.hashtag);

    function selectRepeatedHashtags() {
      let arr = [];

      for (let i = 0; i < userHashtags.length; i++) {
        for (let j = 0; j < arrHashtags.length; j++) {
          if (arrHashtags[i] === userHashtags[j]) {
            arr.push(arrHashtags[i]);
          }
        }
      }
      return arr;
    }

    console.log(selectRepeatedHashtags());

    // hashtags.map(hashtag => {
    //     await connection.query(`INSERT INTO trending (hashtag) VALUES ($1)`, [hashtag])
    // })

    // const { rows: user } = await connection.query(
    //   `SELECT id FROM users WHERE email = $1;`,
    //   [email]
    // );

    // const {
    //   rows: [postId],
    // } = await connection.query(
    //   `INSERT INTO posts (description, link) VALUES ($1, $2) RETURNING id`,
    //   [post.description, post.link]
    // );

    // await connection.query(
    //   `INSERT INTO "userPosts" ("postId", "userId") VALUES ($1, $2)`,
    //   [postId.id, user[0].id]
    // );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
