import { connection } from "../dbStrategy/postgres.js";

export async function getUserByEmail(email) {
  return connection.query(`SELECT * FROM users WHERE email = $1 `, [email]);
}
export async function getUserById(id) {
  return connection.query(`SELECT * FROM users WHERE id = $1`, [id]);
}
export async function getUserByUsername(username) {
  return connection.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
}

export async function getAllUsers() {
  return connection.query(`SELECT id, username, picture FROM users`);
}
