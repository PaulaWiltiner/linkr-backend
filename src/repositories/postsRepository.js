import { connection } from "../dbStrategy/postgres.js";

export async function getPosts() {
  const { rows: posts } = await connection.query(
    `
    SELECT  posts.id, posts.link, posts.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
					  (SELECT json_build_object('count',COUNT("pL".id) ,'usernameList' ,json_agg(users.username) ) FROM (SELECT * FROM "postLikes" ORDER BY "createdAt" DESC) AS "pL"
    JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= posts.id) AS "postLikes" FROM  posts
    JOIN "userPosts" ON "userPosts"."postId"=posts.id
    JOIN users ON "userPosts"."userId"=users.id
    ORDER BY posts.id DESC LIMIT 20
  `
  );

  return posts;
}
