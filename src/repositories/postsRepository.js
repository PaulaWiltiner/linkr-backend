import { connection } from "../dbStrategy/postgres.js";

export async function getPosts(userId) {
  const { rows: posts } = await connection.query(
    `
    SELECT  posts.id, json_build_object('description',posts."descriptionurl",'title',posts."titleurl",'url',posts."link", 'image',posts."imageurl") AS link,
     posts.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                       (SELECT json_build_object('count',COUNT("pL".id) ,
												 'usernameList' , (array_agg(users.username))[1:3] ,
												 'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
                        FROM 
						(SELECT * 
						FROM "postLikes"  
						ORDER BY "createdAt" DESC) AS "pL"
     JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= posts.id) AS "postLikes"
     FROM posts
     JOIN "userPosts" ON "userPosts"."postId"=posts.id
	   JOIN  "userFollowers" ON "userPosts"."userId"="userFollowers".followed
     JOIN users ON "userFollowers".followed=users.id
	   WHERE "userFollowers".follower=$1
     ORDER BY posts.id DESC LIMIT 10;
  `,
    [userId]
  );

  return posts;
}
export async function getPostsByUserId(userId) {
  const { rows: posts } = await connection.query(
    `
    SELECT  posts.id, json_build_object('description',posts."descriptionurl",'title',posts."titleurl",'url',posts."link", 'image',posts."imageurl") AS link,
     posts.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                       (SELECT json_build_object('count',COUNT("pL".id) ,
												 'usernameList' , (array_agg(users.username))[1:3] ,
												 'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
                        FROM 
						(SELECT * 
						FROM "postLikes"  
						ORDER BY "createdAt" DESC) AS "pL"
     JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= posts.id) AS "postLikes"
     FROM posts
     JOIN "userPosts" ON "userPosts"."postId"=posts.id
     JOIN users ON "userPosts"."userId"=users.id
     WHERE users.id = $2
     ORDER BY posts.id DESC LIMIT 10;
  `,
    [userId, userId]
  );

  return posts;
}
export async function getPostsWithoutLimit(userId) {
  const { rows: posts } = await connection.query(
    `
    SELECT  posts.id, json_build_object('description',posts."descriptionurl",'title',posts."titleurl",'url',posts."link", 'image',posts."imageurl") AS link,
     posts.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                       (SELECT json_build_object('count',COUNT("pL".id) ,
												 'usernameList' , (array_agg(users.username))[1:3] ,
												 'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
                        FROM 
						(SELECT * 
						FROM "postLikes"  
						ORDER BY "createdAt" DESC) AS "pL"
     JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= posts.id) AS "postLikes"
     FROM posts
     JOIN "userPosts" ON "userPosts"."postId"=posts.id
	   JOIN  "userFollowers" ON "userPosts"."userId"="userFollowers".followed
     JOIN users ON "userFollowers".followed=users.id
	   WHERE "userFollowers".follower=$1
     ORDER BY posts.id DESC;
  `,
    [userId]
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
