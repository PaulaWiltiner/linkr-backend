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
