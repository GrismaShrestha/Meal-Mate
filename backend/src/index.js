import express from "express";
import { db } from "./db.js";

const app = express();
const port = 3000;

// db.query("INSERT INTO test VALUES (NULL, 'foo');");
const [results] = await db.query("SELECT * FROM test;");
console.log(results);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
