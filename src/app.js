import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes.js";

const app = express();
app.use(cors(), json());
dotenv.config();

app.use(router);
app.listen(process.env.PORT, () => {
  console.log("server running ", process.env.PORT);
});
