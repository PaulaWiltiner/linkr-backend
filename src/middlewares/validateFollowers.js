import { connection } from "../dbStrategy/postgres.js";
import { getOneFollower } from "../repositories/followers.js";

export async function validateFollowers(req, res, next) {
  try {
    const result = await getOneFollower(res.locals.userId);
    if (result.length === 0) {
      return res
        .status(404)
        .send("You don't follow anyone yet. Search for new friends!");
    }
  } catch (err) {
    return res.status(500);
  }
  next();
}

export async function validateFollowed(req, res, next){

  const {idFollowed} = req.params; // SEGUIDO
    const idFollower = res.locals.userId; //SEGUIDOR
  try {
    const {rows: response} = await connection.query(`SELECT * FROM "userFollowers" WHERE follower = $1 AND followed = $2`, [idFollower, idFollowed]);

    if(response.length > 0){
      res.sendStatus(409);
      return;
    }

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }

  next();
}

export async function validateUnFollow(req, res, next){

  const {idFollowed} = req.params; // SEGUIDO
    const idFollower = res.locals.userId; //SEGUIDOR
  try {
    const {rows: response} = await connection.query(`SELECT * FROM "userFollowers" WHERE follower = $1 AND followed = $2`, [idFollower, idFollowed]);

    if(!response.length){
      res.sendStatus(404);
      return;
    }

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }

  next();
}
