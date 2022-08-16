import { connection } from "../dbStrategy/postgres.js";

export async function getUserByEmail(email) {
  return connection.query(`SELECT * FROM users WHERE email = $1 `, [email]);
}
export async function getUserById(id) {
  return connection.query(`SELECT * FROM users WHERE id = $1`, [id]);
}

export async function searchUsers(username) {
  return connection.query(
    `
    SELECT users.id, users.username, users.picture 
    FROM users
    WHERE username ILIKE $1
    ORDER BY username ASC;`,
    [`${username}%`]
  );
}
