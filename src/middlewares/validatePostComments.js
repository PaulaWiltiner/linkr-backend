import { connection } from "../dbStrategy/postgres.js";

export async function validatePostComments(req, res, next) {
  const { postId } = req.params;
  const commentsArray = [];

  const { rows: comments } = await connection.query(
    `SELECT "pC".comment, "pC"."userId" as "commentUser", "uP"."userId"
    FROM "postComments" as "pC"
    JOIN posts ON posts.id = "pC"."postId"
    JOIN "userPosts" as "uP" ON "uP"."postId" = posts.id
    WHERE "pC"."postId" = $1`,
    [postId]
  );

  const {
    rows: [postAuthor],
  } = await connection.query(
    `SELECT username FROM users JOIN "userPosts" ON users.id = "userPosts"."userId" WHERE "userPosts"."postId" = $1`,
    [postId]
  );

  if (comments.length === 0) {
    res.locals.userId = postAuthor;
    res.locals.comments = [];
    next();
    return;
  }

  for (let i = 0; i < comments.length; i++) {
    const {
      rows: [userCommentInformation],
    } = await connection.query(
      `SELECT username, picture FROM users WHERE id = $1`,
      [comments[i].commentUser]
    );

    const { rows: commentFollowers } = await connection.query(
      `SELECT * FROM "userFollowers" WHERE follower = $1 AND followed = $2`,
      [comments[i].userId, comments[i].commentUser]
    );

    commentsArray.push({
      postAuthor: comments[i].userId,
      commentUserInformation: {
        userId: comments[i].commentUser,
        username: userCommentInformation.username,
        picture: userCommentInformation.picture,
      },
      comment: comments[i].comment,
      isFollower: commentFollowers.length === 1 ? true : false,
    });
  }

  res.locals.userId = postAuthor;
  res.locals.comments = commentsArray;
  next();
}
