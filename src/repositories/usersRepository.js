import { connection } from "../dbStrategy/postgres.js";

export async function getUserByEmail(email) {
  return connection.query(`SELECT * FROM users WHERE email = $1 `, [email]);
}

export async function getUserById(id) {
  return connection.query(`SELECT * FROM users WHERE id = $1`, [id]);
}

export async function searchWithFollowers(username, userId) {
  return connection.query(
    `
    SELECT users.id, users.username, users.picture, array_agg(COALESCE((foll.followed = users.id), 'false')) FILTER (WHERE COALESCE((foll.followed = users.id), 'false')) AS "isFollowing" 
    FROM users,(SELECT "userFollowers".followed FROM "userFollowers"
    WHERE "userFollowers".follower = $2) AS foll 
    WHERE username ILIKE $1
    GROUP BY users.id
    ORDER BY "isFollowing", username ASC`,
    [`${username}%`, userId]
  );
}

export async function searchUsers(username) {
  return connection.query(
    `
    SELECT users.id, users.username, users.picture, (null) AS "isFollowing" 
    FROM users
    WHERE username ILIKE $1
    GROUP BY users.id
    ORDER BY "isFollowing", username ASC`,
    [`${username}%`]
  );
}
