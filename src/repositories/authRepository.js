import { connection } from "../dbStrategy/postgres";

export async function getSession(token) {
  const {rows: [session]} = await connection.query(`
    SELECT * FROM sessions
    WHERE sessions.token = $1; 
  `, [token]);

  return session;
}