import { connection } from "../dbStrategy/postgres.js";

export async function createPost(req, res) {
  const post = req.body;
  let user;
  try {
    // await connection.query(
    //   `INSERT INTO posts (description, link) VALUES ($1, $2)`,
    //   [post.description, post.link]
    // );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
