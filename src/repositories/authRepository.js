import { connection } from "../dbStrategy/postgres.js";

export async function getSession(token) {
  const {
    rows: [session],
  } = await connection.query(
    `
    SELECT * FROM sessions
    WHERE sessions.token = $1; 
  `,
    [token]
  );

  return session;
}

export async function getSessionUserId(userId) {
  const {
    rows: [session],
  } = await connection.query(
    `
    SELECT * FROM sessions
    WHERE "userId" = $1; 
  `,
    [userId]
  );

  return session;
}

export async function createSession(token, userId) {
  return connection.query(
    `
     INSERT INTO sessions (token, "userId") VALUES ($1, $2);`,
    [token, userId]
  );
}

export async function deleteSession(id) {
  return connection.query(
    `
     DELETE FROM sessions WHERE id=$1;`,
    [id]
  );
}
