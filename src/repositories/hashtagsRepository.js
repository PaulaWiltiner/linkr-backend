import { connection } from "../dbStrategy/postgres.js";

export async function getOneHashtag(userId, hashtag) {
  return connection.query(
    `
    SELECT "newTab"."hashtagId" AS id , trending.hashtag, 
    json_agg("newTab"."postL") AS "postList"  FROM (SELECT "postHashtags"."hashtagId", json_build_object('id', posts.id , 
       'link',posts.link,'description',posts.description
       ,'user', json_build_object('id',users.id ,'username',users.username, 'picture',users.picture)
        ,'postLikes', (SELECT json_build_object('count',COUNT("pL".id) ,
       'usernameList' , (array_agg(users.username))[1:3] ,
     'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
         FROM (SELECT * FROM "postLikes"  
         ORDER BY "createdAt" DESC) AS "pL"
                JOIN users ON "pL"."userId"=users.id
              WHERE "pL"."postId"= posts.id)) AS "postL" 
          FROM  "postHashtags"
     JOIN posts ON "postHashtags"."postId"=posts.id
     JOIN "userPosts" ON "userPosts"."postId"=posts.id
     JOIN users ON "userPosts"."userId"=users.id
     WHERE  "postHashtags"."hashtagId"=(SELECT trending.id FROM trending WHERE hashtag=$2)
     ORDER BY posts.id ASC LIMIT 20 ) AS "newTab"
     JOIN trending ON "newTab"."hashtagId"=trending.id
     GROUP BY "newTab"."hashtagId",trending.hashtag`,
    [userId, hashtag]
  );
}

export async function getHashtags(id) {
  return connection.query(``);
}
