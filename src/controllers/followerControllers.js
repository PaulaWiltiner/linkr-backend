import dotenv from "dotenv";
import { connection } from "../dbStrategy/postgres.js";

dotenv.config();

export async function followed(req, res){

    const {idFollowed} = req.params;
    const {idFollower} = req.body;//não tenho certeza ainda por onde vai vim esse parametro

    try {
    await connection.query(`INSERT INTO userFollowers (follower, followed) VALUES ($1, $2)`, [idFollower, idFollowed]);

    
        res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function unfollowed(){

    const {idFollowed} = req.params;
    const {idFollower} = req.body;//não tenho certeza ainda por onde vai vim esse parametro

    try {
    await connection.query(`DELETE FROM userFollowers WHERE follower = $1 AND followed = $2`, [idFollower, idFollowed]);

    
        res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }

}
