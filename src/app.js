import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes.js";
dotenv.config();

const app = express();
app.use(cors(), json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log("server running ", process.env.PORT);
});
