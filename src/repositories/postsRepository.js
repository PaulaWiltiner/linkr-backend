import { connection } from "../dbStrategy/postgres.js";

export async function getPosts() {
  const { rows: posts } = await connection.query(
    `
    SELECT  posts.id, json_build_object('description',posts."descriptionurl",'title',posts."titleurl",'link',posts."link", 'image',posts."imageurl") AS link,
    posts.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                      (SELECT json_build_object('count',COUNT("pL".id) ,'usernameList' ,json_agg(users.username) ) 
                      FROM (SELECT * FROM "postLikes" ORDER BY "createdAt" DESC) AS "pL"
    JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= posts.id) AS "postLikes", COALESCE(("postLikes"."userId" = 13), 'false') AS "userLiked"
    FROM posts
    JOIN "userPosts" ON "userPosts"."postId"=posts.id
    JOIN users ON "userPosts"."userId"=users.id
    JOIN "postLikes" ON "postLikes"."postId" = posts.id
    ORDER BY posts.id DESC LIMIT 20;
  `
  );

  return posts;
}
export async function getPostById(id) {
  const { rows: post } = await connection.query(
    `SELECT * FROM "userPosts" WHERE "postId" = $1;`,
    [id]
  );

  return post;
}

export async function deletePostById(id) {
  await connection.query(`DELETE FROM "userPosts" WHERE "postId" = $1;`, [id]);
  await connection.query(`DELETE FROM "postHashtags" WHERE "postId" = $1;`, [
    id,
  ]);
  await connection.query(`DELETE FROM posts WHERE id = $1;`, [id]);
}

export async function findPost(postId) {
  const {
    rows: [post],
  } = await connection.query(
    `
    SELECT * FROM posts 
    WHERE id = $1;`,
    [postId]
  );

  return post;
}

export async function findLike(postId, userId) {
  const {
    rows: [like],
  } = await connection.query(
    `
    SELECT * FROM "postLikes" 
    WHERE "postId" = $1
    AND "userId" = $2;`,
    [postId, userId]
  );

  return like;
}

export async function createLike(postId, userId) {
  await connection.query(
    `
    INSERT INTO "postLikes" ("postId", "userId") 
    VALUES($1, $2);`,
    [postId, userId]
  );
}

export async function deleteLike(postId, userId) {
  await connection.query(
    `
    DELETE FROM "postLikes" 
    WHERE "postId" = $1
    AND "userId" = $2;`,
    [postId, userId]
  );
}
