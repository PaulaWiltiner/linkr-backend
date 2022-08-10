import { connection } from "../dbStrategy/postgres.js";
import bcrypt from 'bcrypt';

export default async function signUp(req, res){

    const {
        username,
        email,
        password,
        picture
    } = req.body

    const {rows:isEmail} = await connection.query(`SELECT email FROM users WHERE email = $1`, [email])

    if(isEmail.length > 0){
        
        res.sendStatus(409);
        return;
    }
    const hashPassword=bcrypt.hashSync(password, 10);
    await connection.query('INSERT INTO links (picture, username, email, password) VALUES ($1, $2, $3, $4)', [picture, username, email, hashPassword]);

    res.sendStatus(201);
}
