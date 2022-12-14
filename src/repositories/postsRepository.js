import { connection } from "../dbStrategy/postgres.js";

export async function getPosts(userId, startLimit) {
  const { rows: posts } = await connection.query(
    `
    SELECT  post.id, json_build_object('description',post."descriptionurl",'title',post."titleurl",'url',post."link", 'image',post."imageurl") AS link,
     post.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                       (SELECT json_build_object('count',COUNT("pL".id) ,
                                                 'usernameList' , (array_agg(users.username))[1:3] ,
                                                 'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
                        FROM 
                        (SELECT * 
                        FROM "postLikes"
                        ORDER BY "createdAt" DESC) AS "pL"
     JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= post.id) AS "postLikes", post."isRepost"
     FROM (SELECT posts.* , (SELECT reposts."userId" FROM reposts WHERE reposts.id=posts."isRepost" ) AS "userIdRepost" FROM posts ) AS post
     JOIN "userPosts" ON "userPosts"."postId"=post.id AND post.id < $2
     JOIN  "userFollowers" ON "userFollowers".follower=$1
     JOIN users ON "userFollowers".followed=users.id 
     WHERE "userPosts"."userId"=users.id OR users.id=$1 OR post."userIdRepost"="userFollowers".followed
     GROUP BY post.id,users.id ,post."descriptionurl", post."titleurl", post."link", post."imageurl", post.description,post."isRepost"
     ORDER BY post.id DESC LIMIT 10;
  `,
    [userId, startLimit]
  );
  return posts;
}

export async function getPostsByUserId(userId, startLimit) {
  const bindParam = startLimit ? "AND posts.id < $2" : "";
  const defaultQuery = `
    SELECT  posts.id, json_build_object('description',posts."descriptionurl",'title',posts."titleurl",'url',posts."link", 'image',posts."imageurl") AS link,
    posts.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                      (SELECT json_build_object('count',COUNT("pL".id) ,
                        'usernameList' , (array_agg(users.username))[1:3] ,
                        'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
                        FROM 

            (SELECT * 
            FROM "postLikes"  
            ORDER BY "createdAt" DESC) AS "pL"
    JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= posts.id) AS "postLikes", posts."isRepost"
    FROM posts
    JOIN "userPosts" ON "userPosts"."postId"=posts.id ${bindParam}
    JOIN users ON "userPosts"."userId"=users.id
    WHERE users.id = $1
    ORDER BY posts.id DESC
  `;
  if (startLimit) {
    const query = defaultQuery + "LIMIT 10;";
    const { rows: posts } = await connection.query(query, [userId, startLimit]);
    return posts;
  }
  const query = defaultQuery + ";";
  const { rows: posts } = await connection.query(query, [userId]);
  return posts;
}
export async function getPostsWithoutLimit(userId) {
  const { rows: posts } = await connection.query(
    `
   SELECT  post.id, json_build_object('description',post."descriptionurl",'title',post."titleurl",'url',post."link", 'image',post."imageurl") AS link,
    post.description, json_build_object('id',users.id ,'username',users.username, 'picture',users.picture) AS user,
                      (SELECT json_build_object('count',COUNT("pL".id) ,
                        'usernameList' , (array_agg(users.username))[1:3] ,
                        'isLiked' , (json_agg(COALESCE(("pL"."userId" = $1), 'false')) FILTER (WHERE COALESCE(("pL"."userId" = $1), 'false'))) )
                       FROM 
           (SELECT * 
           FROM "postLikes"  
           ORDER BY "createdAt" DESC) AS "pL"
    JOIN users ON "pL"."userId"=users.id WHERE "pL"."postId"= post.id) AS "postLikes", post."isRepost"
    FROM (SELECT posts.* , (SELECT reposts."userId" FROM reposts WHERE reposts.id=posts."isRepost" ) AS "userIdRepost" FROM posts ) AS post
    JOIN "userPosts" ON "userPosts"."postId"=post.id
    JOIN  "userFollowers" ON "userFollowers".follower=$1
    JOIN users ON "userFollowers".followed=users.id OR users.id=$1
    WHERE "userPosts"."userId"=users.id OR post."userIdRepost"="userFollowers".followed
    GROUP BY post.id,users.id ,post."descriptionurl", post."titleurl", post."link", post."imageurl", post.description,post."isRepost"
    ORDER BY post.id DESC;
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

export async function reePost(postId, userId, post) {
  const {
    rows: [repostId],
  } = await connection.query(
    `
    INSERT INTO "reposts" ("postId", "userId") 
    VALUES($1, $2) RETURNING id`,
    [postId, userId]
  );
  const {
    rows: [newPostId],
  } = await connection.query(
    `
    INSERT INTO "posts" ("description", "link", "titleurl", "descriptionurl", "imageurl","isRepost") 
    VALUES('${post.description}','${post.link}','${post.titleurl}','${post.descriptionurl}','${post.imageurl}',$1) RETURNING id;`,
    [repostId.id]
  );

  const {
    rows: [newUserId],
  } = await connection.query(
    `SELECT "userPosts". "userId" FROM "userPosts" WHERE "userPosts"."postId"=$1`,
    [postId]
  );

  await connection.query(
    `
    INSERT INTO "userPosts" ("postId", "userId")
    VALUES($1,$2) RETURNING id;`,
    [newPostId.id, newUserId.userId]
  );
}

export async function findRePost(postId, userId) {
  const {
    rows: [post],
  } = await connection.query(
    `
    SELECT * FROM "reposts" WHERE  "postId"=$1 AND "userId"=$2;`,
    [postId, userId]
  );
  return post;
}
export async function getRePost(postId) {
  const {
    rows: [reposts],
  } = await connection.query(
    `
    SELECT COUNT("reposts".id),users.username,reposts."postId" FROM reposts
    JOIN users ON users.id=reposts."userId" AND reposts.id=$1
    WHERE reposts."postId"=(SELECT reposts."postId" FROM reposts WHERE reposts.id=$1)
    GROUP BY users.username,reposts."postId" `,
    [postId]
  );
  return reposts;
}

export async function getLikesPost(postId, userId) {
  const {
    rows: [likes],
  } = await connection.query(
    `
    SELECT json_build_object('count',COUNT( "pL".id) ,'usernameList' , (array_agg(users.username))[1:3] , 'isLiked' , (json_agg(COALESCE(( "pL"."userId" =$2), 'false')) FILTER (WHERE COALESCE(( "pL"."userId" =$2 ) ,'false'))) ) AS "postLikes"
    FROM (SELECT * FROM "postLikes" ORDER BY "createdAt" DESC) AS "pL"
    JOIN users ON  "pL"."userId"=users.id 
    WHERE "pL"."postId"= $1
    `,
    [postId, userId]
  );
  return likes;
}

export async function belongPost(postId, userId) {
  const {
    rows: [post],
  } = await connection.query(
    `
    SELECT * FROM "userPosts" WHERE  "postId"=$1 AND "userId"=$2;`,
    [postId, userId]
  );
  return post;
}

export async function getQtdComments(postId) {
  return await connection.query(
    `SELECT COUNT("postId") as qtd FROM "postComments" WHERE "postId" = $1 GROUP BY "postId"`,
    [postId]
  );
}

export async function setComment(comment, userId, postId) {
  return await connection.query(
    `INSERT INTO "postComments" (comment, "userId", "postId") VALUES ($1, $2, $3)`,
    [comment, userId, postId]
  );
}

export async function updateDescription(id, description) {
  return await connection.query(
    `UPDATE posts SET description = $2 WHERE id = $1`,
    [id, description]
  );
}

export async function insertPost(postId, userId) {
  return await connection.query(
    `INSERT INTO "userPosts" ("postId", "userId") VALUES ($1, $2)`,
    [postId, userId]
  );
}

export async function insertHashtags(postId, id) {
  return await connection.query(
    `INSERT INTO "postHashtags" ("postId", "hashtagId") VALUES ($1, $2)`,
    [postId, id]
  );
}

export async function searchIdTrending(userHashtags) {
  return await connection.query(`SELECT id FROM trending WHERE hashtag = $1`, [
    userHashtags[i],
  ]);
}

export async function insertTrending(hashtag) {
  return await connection.query(`INSERT INTO trending (hashtag) VALUES ($1)`, [
    hashtag,
  ]);
}

export async function addPosts(
  description,
  link,
  titleURL,
  descriptionURL,
  imageURL
) {
  return await connection.query(
    `INSERT INTO posts (description, link, titleURL, descriptionURL , imageURL) VALUES ($1, $2, $3,$4,$5) RETURNING id`,
    [description, link, titleURL, descriptionURL, imageURL]
  );
}

export async function getIdForEmail(email) {
  return await connection.query(`SELECT id FROM users WHERE email = $1;`, [
    email,
  ]);
}

export async function getHashtag() {
  return await connection.query(`SELECT hashtag FROM trending`);
}
