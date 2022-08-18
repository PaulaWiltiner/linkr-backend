import { connection } from "../dbStrategy/postgres.js";

export async function getOneFollower(userId) {
  const { rows: follower } = await connection.query(
    `
    SELECT  "userFollowers".follower FROM "userFollowers" WHERE follower=$1
  `,
    [userId]
  );

  return follower;
}

export async function getOnePostFollower(userId) {
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
     ORDER BY posts.id DESC LIMIT 1;
  `,
    [userId]
  );

  return posts;
}
