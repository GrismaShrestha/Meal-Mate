import express from "express";
import { db } from "./db.js";

const app = express();
const port = 3000;

const [results] = await db.query("SELECT * FROM test;");
console.log(results);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
