import dotenv from "dotenv";
import { connection } from "../dbStrategy/postgres.js";

dotenv.config();

export async function followed(req, res){

    const {idFollowed} = req.params; // SEGUIDO
    const idFollower = res.locals.userId; //SEGUIDOR

    try {
        //verificar se já foi seguido ou não
        await connection.query(`INSERT INTO "userFollowers" (follower, followed) VALUES ($1, $2)`, [idFollower, idFollowed]);
        res.sendStatus(201);
        return;
    } catch (error) {
        res.sendStatus(500);
        return;
    }
}

export async function unfollowed(req, res){

    const {idFollowed} = req.params;
    const idFollower = res.locals.userId;

    try {
        await connection.query(`DELETE FROM "userFollowers" WHERE follower = $1 AND followed = $2`, [idFollower, idFollowed]);
        res.sendStatus(200);
        return;
    } catch (error) {
        return res.sendStatus(500);
    }

}

export async function statusFollowed(req, res, next){

    const {idFollowed} = req.params; // SEGUIDO
      const idFollower = res.locals.userId; //SEGUIDOR
    try {
      const {rows: response} = await connection.query(`SELECT * FROM "userFollowers" WHERE follower = $1 AND followed = $2`, [idFollower, idFollowed]);
  
      if(response.length > 0){
        res.status(200).send(false);
        return;
      }else{
        res.status(200).send(true);
        return;
      }
  
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
  
    next();
  }
