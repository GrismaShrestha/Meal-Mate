import mysql from "mysql2/promise";
import process from "process";

export const db = await mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "meal-mate",
});

db.connect((err) => {
  if (err) {
    console.log("[ERROR] Could not connect to mysql database:", err);
    process.exit(1);
  }
  console.log("Database connected");
});
